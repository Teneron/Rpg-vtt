import React from 'react';
import { useChat } from './ChatContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { MessageSquare, ChevronDown } from 'lucide-react';
import './Chat.css';

export const ChatWindow: React.FC = () => {
    const { isOpen, toggleChat, unreadCount } = useChat();

    if (!isOpen) {
        return (
            <button className="chat-toggle-btn" onClick={toggleChat} title="Abrir Chat" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={20} color="#ffd700" />
                {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </button>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={16} color="#ffd700" />
                    <span>Chat Global</span>
                </span>
                <button className="chat-close-btn" onClick={toggleChat} title="Minimizar">
                    <ChevronDown size={16} />
                </button>
            </div>

            <MessageList />

            <MessageInput />
        </div>
    );
};
