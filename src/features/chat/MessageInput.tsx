import React, { useState } from 'react';
import { useChat } from './ChatContext';
import { Send } from 'lucide-react';

export const MessageInput: React.FC = () => {
    const { sendMessage } = useChat();
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        // Future: Command parsing here
        sendMessage(text);
        setText('');
    };

    return (
        <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
                type="text"
                className="chat-input"
                placeholder="Mensagem... (/roll 1d20)"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" title="Enviar Mensagem">
                <Send size={15} />
            </button>
        </form>
    );
};
