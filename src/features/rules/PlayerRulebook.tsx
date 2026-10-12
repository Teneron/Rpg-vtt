import React from 'react';
import { RulebookViewer } from './RulebookViewer';
import { getSystemRulebook } from './data';
import { useAdventure } from '../adventure/AdventureContext';
import { usePeer } from '../multiplayer/SocketContext';

export const PlayerRulebook: React.FC = () => {
    const { roomSystem, currentAdventureId } = usePeer();
    const { currentAdventure } = useAdventure();

    // Isolate active game system strictly to eliminate cross-system pollution
    const activeSystem = (
        roomSystem === 'witcher' ||
        currentAdventure?.system === 'witcher' ||
        currentAdventureId?.toUpperCase().startsWith('WTC') ||
        (typeof window !== 'undefined' && localStorage.getItem('rpg_selected_system') === 'witcher')
    ) ? 'witcher' : 'dnd55e';

    const activeRulebook = getSystemRulebook(activeSystem);

    return (
        <RulebookViewer
            title={`Livro do Jogador: ${activeRulebook.shortName}`}
            subtitle="Referência oficial e regras essenciais de jogo para jogadores."
            systemBadge={{
                icon: activeRulebook.badgeIcon,
                text: activeRulebook.name,
                color: activeRulebook.accentColor
            }}
            sections={activeRulebook.playerSections}
        />
    );
};
