import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePeer } from '../multiplayer/FirebaseContext';

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

// Simple ID Generator
const generateId = () => Math.random().toString(36).substr(2, 9);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { broadcast, myId, myName, onMessage } = usePeer();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Helper to add message locally
    const addMessage = useCallback((msg: ChatMessage) => {
        setMessages(prev => {
            // Deduplicate by ID
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg].sort((a, b) => a.timestamp - b.timestamp);
        });

        if (!isOpen) { // If chat is closed, increment unread for everything
            setUnreadCount(prev => prev + 1);
        }
    }, [isOpen]);

    // Handle incoming P2P messages
    useEffect(() => {
        const cleanup = onMessage((data: any) => {
            if (data && data.type === 'CHAT_MESSAGE') {
                const msg = data.payload as ChatMessage;
                // Fix duplication: Ignore if I sent it (because I already added it locally in sendMessage)
                if (msg.senderId === myId) return;
                addMessage(msg);
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
            id: generateId(), // Replaced uuidv4
            senderId: myId || 'unknown',
            senderName: myName || 'Anônimo',
            content,
            type,
            timestamp: Date.now(),
            metadata
        };

        // 1. Add locally
        addMessage(newMessage);

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
        addMessage(sysMsg);
    }, [addMessage]);

    const clearChat = () => setMessages([]);

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
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
