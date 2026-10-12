import React from 'react';
import type { ChatMessage } from './ChatContext';
import { usePeer } from '../multiplayer/SocketContext';
import { D4Icon, D6Icon, D8Icon, D10Icon, D12Icon, D20Icon } from '../dice/DieIcons';

interface ChatMessageItemProps {
    message: ChatMessage;
}

const IconMap: Record<string, React.FC<any>> = {
    d4: D4Icon, d6: D6Icon, d8: D8Icon, d10: D10Icon, d12: D12Icon, d20: D20Icon
};

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
    const { myId } = usePeer();
    const isMine = message.senderId === myId;

    let messageClass = 'chat-message';
    if (message.type === 'system') messageClass += ' system';
    else if (message.type === 'roll') messageClass += ' roll';
    else {
        messageClass += ' text';
        if (isMine) messageClass += ' my-message';
    }

    // Roll Parsing (if content is JSON)
    let contentDisplay: React.ReactNode = message.content;

    // If it's a roll, we might want to render it fancier
    if (message.type === 'roll') {
        try {
            // Check if content is JSON-like (starts with {)
            if (message.content.trim().startsWith('{')) {
                const rollData = JSON.parse(message.content);
                // Expected format: { total: 15, formula: "1d20+5", details: { dice: [], modifier: 0 } }

                contentDisplay = (
                    <div className="roll-card">
                        {rollData.label && (
                            <div style={{ color: '#aaa', fontSize: '0.85em', marginBottom: '4px', fontStyle: 'italic', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2px' }}>
                                {rollData.label}
                            </div>
                        )}
                        <div className="roll-header">
                            <span className="roll-formula">{rollData.formula}</span>
                            <span className="roll-total">{rollData.total}</span>
                        </div>
                        {rollData.details?.dice && (
                            <div className="roll-breakdown">
                                {rollData.details.dice.map((d: any, i: number) => {
                                    const Icon = IconMap[d.type] || D20Icon;
                                    return (
                                        <div key={i} className="roll-die">
                                            <Icon />
                                            <span className="die-val">{d.value}</span>
                                        </div>
                                    );
                                })}
                                {rollData.details.modifier !== 0 && (
                                    <div className="roll-mod">
                                        {rollData.details.modifier > 0 ? '+' : ''}{rollData.details.modifier}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            }
        } catch (e) {
            // Fallback to plain text if parse fails
        }
    }

    return (
        <div className={messageClass}>
            {message.type !== 'system' && (
                <div className="message-sender">
                    {message.senderName}
                </div>
            )}

            <div className="message-content">
                {contentDisplay}
            </div>

            <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            <style>{`
                .roll-card { background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; border-left: 3px solid #ffaa00; }
                .roll-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
                .roll-formula { color: #ccc; font-size: 0.9em; }
                .roll-total { font-size: 1.4em; font-weight: bold; color: #ffaa00; }
                .roll-breakdown { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; }
                .roll-die { position: relative; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; color: #ccc; }
                .die-val { position: absolute; font-size: 0.7em; font-weight: bold; color: #fff; text-shadow: 0 1px 2px black; }
                .roll-mod { color: #888; font-weight: bold; margin-left: 2px; }
            `}</style>
        </div>
    );
};
