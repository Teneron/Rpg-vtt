import React, { useEffect, useRef } from 'react';
import { useChat } from './ChatContext';
import { ChatMessageItem } from './ChatMessageItem';

export const MessageList: React.FC = () => {
    const { messages } = useChat();
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll on new message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="message-list">
            {messages.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
};
