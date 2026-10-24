import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePeer } from '../multiplayer/SocketContext';
import { db } from '../../db/RPGDatabase';

export type MessageType = 'text' | 'roll' | 'system' | 'emote';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string; // For rolls, this could be a JSON string or formatted text
    type: MessageType;
    timestamp: number;
    metadata?: any; // Extra data like roll details
}

interface ChatContextProps {
    messages: ChatMessage[];
    sendMessage: (content: string, type?: MessageType, metadata?: any) => void;
    sendSystemMessage: (content: string) => void;
    clearChat: () => void;
    isOpen: boolean;
    toggleChat: () => void;
    unreadCount: number;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

const generateId = () =>
    (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { broadcast, myId, myName, onMessage, currentAdventureId } = usePeer();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hydratedRoomId, setHydratedRoomId] = useState<string | null>(null);

    const seenIdsRef = useRef<Set<string>>(new Set());
    const isOpenRef = useRef(isOpen);
    useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

    const myIdRef = useRef(myId);
    useEffect(() => { myIdRef.current = myId; }, [myId]);

    // Hydrate persisted campaign chat history from Dexie when switching / restoring a campaign
    useEffect(() => {
        let cancelled = false;
        const roomId = currentAdventureId;
        if (!roomId || roomId === 'default') {
            setHydratedRoomId(roomId || null);
            return;
        }

        seenIdsRef.current.clear();
        setMessages([]);
        setUnreadCount(0);

        (async () => {
            try {
                const campaign = await db.campaigns.get(roomId);
                if (cancelled) return;
                if (Array.isArray(campaign?.chatHistory) && campaign.chatHistory.length > 0) {
                    const validHistory = (campaign.chatHistory as ChatMessage[]).filter(m => m && m.id);
                    for (const m of validHistory) {
                        seenIdsRef.current.add(m.id);
                    }
                    setMessages(prev => {
                        const merged = [...validHistory];
                        for (const p of prev) {
                            if (p && p.id && !validHistory.some(v => v.id === p.id)) {
                                merged.push(p);
                            }
                        }
                        merged.sort((a, b) => a.timestamp - b.timestamp);
                        return merged.slice(-250);
                    });
                }
            } catch (err) {
                console.warn('[ChatContext] Failed to hydrate chatHistory from Dexie:', err);
            } finally {
                if (!cancelled) {
                    setHydratedRoomId(roomId);
                }
            }
        })();

        return () => { cancelled = true; };
    }, [currentAdventureId]);

    // Debounced persistence of latest 100 chat messages into Dexie campaign
    useEffect(() => {
        if (!currentAdventureId || currentAdventureId === 'default' || hydratedRoomId !== currentAdventureId) return;

        const timer = setTimeout(() => {
            const latest100 = messages.slice(-100);
            db.campaigns.update(currentAdventureId, {
                chatHistory: latest100
            }).catch(() => {
                // Campaign record may not exist on non-host player browser; safely ignore
            });
        }, 600);

        return () => clearTimeout(timer);
    }, [messages, currentAdventureId, hydratedRoomId]);

    // Helper to add message locally (safe under React 19 automatic batching)
    const addMessage = useCallback((msg: ChatMessage, isFromHistory: boolean = false) => {
        if (!msg || !msg.id) return;
        if (seenIdsRef.current.has(msg.id)) return;
        seenIdsRef.current.add(msg.id);

        setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            const next = [...prev, msg];
            if (prev.length > 0 && msg.timestamp < prev[prev.length - 1].timestamp) {
                next.sort((a, b) => a.timestamp - b.timestamp);
            }
            return next.length > 250 ? next.slice(-250) : next;
        });

        // Do not inflate unread badge when replaying server/Dexie history on F5 or for own messages
        if (!isFromHistory && !isOpenRef.current && msg.senderId !== myIdRef.current) {
            setUnreadCount(prev => prev + 1);
        }
    }, []);

    // Handle incoming Socket messages (live & F5 history replay)
    useEffect(() => {
        const cleanup = onMessage((data: any) => {
            if (data && data.type === 'CHAT_MESSAGE') {
                const msg = data.payload as ChatMessage;
                const isFromHistory = Boolean(data.fromHistory);
                // Ignore live echo of own message (already added in sendMessage),
                // EXCEPT when replaying server chatHistory after F5!
                if (!isFromHistory && msg?.senderId === myId) return;
                addMessage(msg, isFromHistory);
            }
        });
        return cleanup;
    }, [onMessage, addMessage, myId]);

    // Reset unread when opened
    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    const sendMessage = useCallback((content: string, type: MessageType = 'text', metadata?: any) => {
        const newMessage: ChatMessage = {
            id: generateId(),
            senderId: myId || 'unknown',
            senderName: myName || 'Anônimo',
            content,
            type,
            timestamp: Date.now(),
            metadata
        };

        // 1. Add locally
        addMessage(newMessage, false);

        // 2. Broadcast to peers
        broadcast({
            type: 'CHAT_MESSAGE',
            payload: newMessage
        });
    }, [broadcast, myId, myName, addMessage]);

    const sendSystemMessage = useCallback((content: string) => {
        const sysMsg: ChatMessage = {
            id: generateId(),
            senderId: 'system',
            senderName: 'Sistema',
            content,
            type: 'system',
            timestamp: Date.now()
        };
        addMessage(sysMsg, false);
    }, [addMessage]);

    const clearChat = () => {
        seenIdsRef.current.clear();
        setMessages([]);
        if (currentAdventureId && currentAdventureId !== 'default') {
            db.campaigns.update(currentAdventureId, { chatHistory: [] }).catch(() => {});
        }
    };

    const toggleChat = () => setIsOpen(prev => !prev);

    return (
        <ChatContext.Provider value={{
            messages,
            sendMessage,
            sendSystemMessage,
            clearChat,
            isOpen,
            toggleChat,
            unreadCount
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        return {
            messages: [],
            sendMessage: () => {},
            sendSystemMessage: () => {},
            clearChat: () => {},
            isOpen: false,
            toggleChat: () => {},
            unreadCount: 0
        };
    }
    return context;
};
