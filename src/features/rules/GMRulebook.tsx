import React from 'react';
import { RulebookViewer } from './RulebookViewer';
import { getSystemRulebook } from './data';
import { useAdventure } from '../adventure/AdventureContext';
import { usePeer } from '../multiplayer/FirebaseContext';

export const GMRulebook: React.FC = () => {
    const { roomSystem, currentAdventureId } = usePeer();
    const { currentAdventure } = useAdventure();

    // Isolate active game system strictly to eliminate cross-system tabs and mentions
    const activeSystem = (
        roomSystem === 'witcher' ||
        currentAdventure?.system === 'witcher' ||
        currentAdventureId?.toUpperCase().startsWith('WTC') ||
        (typeof window !== 'undefined' && localStorage.getItem('rpg_selected_system') === 'witcher')
    ) ? 'witcher' : 'dnd55e';

    const activeRulebook = getSystemRulebook(activeSystem);

    return (
        <RulebookViewer
            title={`Guia do Mestre: ${activeRulebook.shortName}`}
            subtitle="Ferramentas do Narrador, orçamentos de encontros, tabelas de dificuldade e segredos."
            systemBadge={{
                icon: activeRulebook.badgeIcon,
                text: `${activeRulebook.name} - Mestre`,
                color: activeRulebook.accentColor
            }}
            sections={activeRulebook.gmSections}
        />
    );
};
