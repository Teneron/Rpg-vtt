import React from 'react';
import { useChat } from './ChatContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import './Chat.css';

export const ChatWindow: React.FC = () => {
    const { isOpen, toggleChat, unreadCount } = useChat();

    if (!isOpen) {
        return (
            <button className="chat-toggle-btn" onClick={toggleChat} title="Abrir Chat">
                💬
                {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </button>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <span>💬 Chat Global</span>
                <button className="chat-close-btn" onClick={toggleChat}>▼</button>
            </div>

            <MessageList />

            <MessageInput />
        </div>
    );
};
