import React, { useState, useEffect } from 'react';
import {
    initialCharacter,
    regenerateCharacterStats,
    getLevel,
    getMinXPForLevel,
    calculateModifier
} from './characterTypes';
import type {
    Character
} from './characterTypes';
import { ITEMS } from './data/items';
import './CharacterSheet.css';
import { CharacterAvatar } from './CharacterAvatar';

import { useDice } from '../dice/DiceContext';
import { CharacterBuilder } from './CharacterBuilder';
// import { usePlayerSync } from '../multiplayer/usePlayerSync';
import { usePeer } from '../multiplayer/SocketContext';
import { useAdventure } from '../adventure/AdventureContext';
import { CharacterRepository } from './characterRepository';
import { Save, X, Settings, Sparkles, BookOpen, Table, Download, Upload } from 'lucide-react';

// New Components
import { AttributesPanel } from './components/AttributesPanel';
import { CombatPanel } from './components/CombatPanel';
import { BioPanel } from './components/BioPanel';
import { SpellsPanel } from './components/SpellsPanel';
import { FeatsPanel } from './components/FeatsPanel';
import { AbilitiesPanel } from './components/AbilitiesPanel';
import { LevelUpModal } from './components/LevelUpModal';
import { InventoryPanel } from './components/InventoryPanel';
import { PlayerBestiaryPanel } from './components/PlayerBestiaryPanel';
import { ManageSpellsModal } from './components/ManageSpellsModal';
import { ClassProgression } from './components/ClassProgression';
import { CLASSES } from './data/classes';

interface CharacterSheetProps {
    characterId: string;
    initialData?: Character;
    isGM?: boolean;
    onExit?: () => void;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ characterId, initialData, isGM = false, onExit }) => {
    const { triggerRoll } = useDice();
    const { broadcastCharacterUpdate } = usePeer();

    // 4. Dirty Flag (To prevent network updates from triggering auto-save loops)
    const dirtyRef = React.useRef(false);

    // Helper to update character and mark as dirty (User Interaction)
    const setCharacterWithDirty = (update: Character | ((prev: Character) => Character)) => {
        dirtyRef.current = true;
        setCharacter(update);
    };

    // 1. Initial Load
    const [character, setCharacter] = useState<Character>(() => {
        // FIX: Always try to load from Local Cache first, then initialData fallback (e.g. for GM viewing remote player).
        const loaded = CharacterRepository.load(characterId) || initialData;
        if (loaded) return regenerateCharacterStats({ ...initialCharacter, ...loaded });

        return initialCharacter;
    });

    // FIX: Keep a Ref of the current character for safely accessing it in cleanup functions (unmount/switch)
    const characterRef = React.useRef(character);
    useEffect(() => { characterRef.current = character; }, [character]);

    // 2. React to ID Change
    useEffect(() => {
        // FIX: Component Recycling - Reset dirty status when ID changes
        // This ensures previous character's "typing" state doesn't block new character's load
        dirtyRef.current = false;

        // Local Load first
        if (character.id !== characterId && characterId) {
            CharacterRepository.loadAsync(characterId).then(loaded => {
                if (loaded) {
                    setCharacter(regenerateCharacterStats({ ...initialCharacter, ...loaded }));
                }
            });
        }
    }, [characterId, character.id]);

    // 2.5: GM Remote Sync (Load from Connected Players)
    // Allows GM/Player bidirectional sync (e.g. for Level Up)
    const { connectedPlayersData, updateRemotePlayerCharacter, myCharacter } = usePeer();

    useEffect(() => {
        if (!characterId) return;

        const isMe = myCharacter?.id === characterId;

        if (isMe) {
            // 2.5a: Sync ME (From Internal Context)
            if (myCharacter && JSON.stringify(myCharacter) !== JSON.stringify(character)) {
                setCharacter(regenerateCharacterStats(myCharacter));
            }
        } else {
            // 2.5b: Sync OTHERS (From DB/Peers) - THIS IS FOR GM EDITING
            const remoteWrapper = Object.values(connectedPlayersData).find(p => p.character?.id === characterId);

            if (remoteWrapper && remoteWrapper.character) {
                const rChar = remoteWrapper.character;

                // FIX: If we have unsaved local changes (dirty), DO NOT overwrite them with remote data.
                // This prevents the "Reset" bug when GM is typing and a heartbeat/sync arrives.
                if (dirtyRef.current) return;

                // FIX: Time-Lock for GM Sync (Stale Data Protection)
                // If we edited locally recently (last 5s), ignore remote updates.
                // This gives time for the remote client to receive our update and echo it back.
                const lastEditTime = parseInt(sessionStorage.getItem(`last_gm_edit_${characterId}`) || '0');
                if (Date.now() - lastEditTime < 5000) {
                    console.log("[CharacterSheet] Ignoring remote update due to recent local edit (TimeLock active)");
                    return;
                }

                // Compare Timestamps (Last Writer Wins)
                const localTime = character.lastModified || 0;
                const remoteTime = rChar.lastModified || 0;

                if (remoteTime > localTime) {
                    console.log(`[CharacterSheet] GM Sync: Updating from NEWER remote player (${remoteTime} > ${localTime})`, rChar.name);
                    setCharacter(regenerateCharacterStats(rChar));
                } else if (remoteTime < localTime) {
                    console.log(`[CharacterSheet] GM Sync: Ignoring OLDER remote update (${remoteTime} < ${localTime}). Keeping local.`);
                } else if (JSON.stringify(rChar) !== JSON.stringify(character)) {
                    console.log("[CharacterSheet] GM Sync: Updating (Timestamp tie/missing)", rChar.name);
                    setCharacter(regenerateCharacterStats(rChar));
                }
            } else if (isGM) {
                console.log("[CharacterSheet] Waiting for remote character data...", characterId);
            }
        }
    }, [characterId, connectedPlayersData, myCharacter, isGM]);

    // 3. Force Update / Local Sync (e.g. from TokenSettingsModal or InitiativeTracker)
    useEffect(() => {
        const handleForceUpdate = (e: CustomEvent<Character>) => {
            if (e.detail && e.detail.id === characterId) {
                setCharacter(regenerateCharacterStats(e.detail));
            }
        };
        const handleLocalCharSave = (e: Event) => {
            const detail = (e as CustomEvent<Character>).detail;
            if (!detail || detail.id !== characterId || dirtyRef.current) return;
            const currentMod = characterRef.current?.lastModified || 0;
            if ((detail.lastModified || 0) > currentMod) {
                setCharacter(regenerateCharacterStats(detail));
            }
        };
        window.addEventListener('character_force_update' as any, handleForceUpdate);
        window.addEventListener('rpg_local_char_save', handleLocalCharSave);
        return () => {
            window.removeEventListener('character_force_update' as any, handleForceUpdate);
            window.removeEventListener('rpg_local_char_save', handleLocalCharSave);
        };
    }, [characterId]);

    // 4. Auto-Save (Debounced)
    useEffect(() => {
        if (!character.id || character.id !== characterId) return;

        // LOOP FIX: Only save if the change came from USER interaction (dirtyRef)
        // If it came from network (setCharacter without dirty), ignore.
        if (!dirtyRef.current) return;

        const timer = setTimeout(() => {
            handleSave();
            dirtyRef.current = false; // Reset dirty after save initiated
        }, 1000);

        return () => clearTimeout(timer);
    }, [character, characterId]);

    // R2: Ref estável para handleSave evitando stale closures em efeitos/cleanup
    const handleSaveRef = React.useRef<((charOverride?: Character) => void) | null>(null);

    // FIX: Flush Clean Up (Unmount or ID Switch)
    // This ensures that if the user closes the modal or switches characters while "dirty", we force-save.
    useEffect(() => {
        return () => {
            if (dirtyRef.current && characterRef.current && handleSaveRef.current) {
                console.log("[CharacterSheet] Unmount/Switch detected with unsaved changes. Force saving...");
                handleSaveRef.current(characterRef.current);
                dirtyRef.current = false;
            }
        };
    }, [characterId]); // Run cleanup when ID changes (or component unmounts)

    // Helper to determine HOW to save
    const handleSave = (charOverride?: Character) => {
        const base = charOverride || character;
        // R1: Atualização imutável do timestamp
        const charToSave: Character = {
            ...base,
            lastModified: Date.now()
        };

        // SAFETY GUARD: Prevent cross-contamination
        if (charToSave.id !== characterId) {
            console.error(`[CharacterSheet] CRITICAL: Attempted to save character ${charToSave.id} (${charToSave.name}) into slot ${characterId}. Aborting save.`);
            return;
        }

        // Identity Check: Am I fixing my own character or someone else's?
        const isMyCharacter = myCharacter?.id === characterId;

        if (isGM && !isMyCharacter) {
            // GM VIEWING ANOTHER PLAYER:
            console.log("GM viewing player: Saving changes to remote player via broadcast...", charToSave.name);

            // 1. ALWAYS save local cache for GM first, to prevent "Reset on Reopen" and include in Campaign Backup
            CharacterRepository.save(charToSave);
            sessionStorage.setItem(`last_gm_edit_${characterId}`, Date.now().toString());

            // 2. Dispatch Local Event so GM's own MapContext tokens and CombatContext combatants update immediately
            window.dispatchEvent(new CustomEvent('rpg_local_char_save', { detail: charToSave }));

            // 3. Find the owner peer ID and sync over network if connected
            const ownerPeer = Object.values(connectedPlayersData).find(p => p.character?.id === characterId);

            if (ownerPeer) {
                console.log("[DEBUG SAVE] Found Owner Peer:", ownerPeer.name, ownerPeer.peerId);
                updateRemotePlayerCharacter(ownerPeer.peerId, charToSave);
                const toast = document.createElement('div');
                toast.textContent = `Salvo em ${ownerPeer.name}!`;
                toast.style.cssText = `
                    position: fixed; top: 10px; right: 10px; background: #4caf50; color: #fff;
                    padding: 10px 20px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                    z-index: 9999; animation: fadeOut 2s forwards;
                `;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            } else {
                console.warn("[DEBUG SAVE] Owner peer offline; saved locally and synced with GM map/combat:", characterId);
                const toast = document.createElement('div');
                toast.textContent = `Ficha salva localmente na mesa (jogador offline).`;
                toast.style.cssText = `
                    position: fixed; top: 10px; right: 10px; background: #d97706; color: #fff;
                    padding: 10px 20px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                    z-index: 9999; animation: fadeOut 2.5s forwards;
                `;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2500);
            }

            return;
        }

        // PERMIT SAVE: It's my character (or I'm a player).
        console.log("[DEBUG SAVE] Permitting Standard Save for:", charToSave.name);

        // 1. Save Local
        CharacterRepository.save(charToSave);

        // 2. Mark timestamp if GM (for local protection)
        if (isGM) {
            sessionStorage.setItem(`last_gm_edit_${characterId}`, Date.now().toString());
        }

        // 3. Broadcast to peers
        broadcastCharacterUpdate(charToSave);

        // 4. Dispatch Local Event for Map & Combat Sync (Host/Client Local Update)
        window.dispatchEvent(new CustomEvent('rpg_local_char_save', { detail: charToSave }));
    };

    handleSaveRef.current = handleSave;

    // FIX: Immediate Save on Image Change with Feedback
    const prevImgRef = React.useRef(character.imageUrl);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const { isConnected } = usePeer();

    useEffect(() => {
        if (character.imageUrl !== prevImgRef.current) {
            prevImgRef.current = character.imageUrl;
            console.log("Image changed, forcing immediate save...", character.imageUrl);
            setSaveStatus('saving');

            // Force save
            try {
                handleSave();
                setTimeout(() => setSaveStatus('saved'), 500);
                setTimeout(() => setSaveStatus('idle'), 2000);
            } catch (err) {
                console.error("Save failed:", err);
                setSaveStatus('error');
            }
        }
    }, [character.imageUrl]);

    // Derived connection status for UI
    const connectionStatusColor = isConnected ? '#4eff4e' : '#ff4e4e';
    const connectionText = isConnected ? 'Online' : 'Offline';

    // --- HANDLERS ---
    const updateCharacter = (updates: Partial<Character>) => {
        // Safe update with regen
        setCharacterWithDirty(prev => {
            const next = regenerateCharacterStats({ ...prev, ...updates });
            return next;
        });
    };

    const handleEquipToggle = (itemId: string, equipped: boolean) => {
        const nextInv = (character.inventory || []).map(i => {
            if (i.id === itemId) return { ...i, equipped };
            return i;
        });

        const nextChar = { ...character, inventory: nextInv };
        const statsChar = regenerateCharacterStats(nextChar);

        setCharacterWithDirty(statsChar);
    };

    const handleRemoveItem = (itemId: string) => {
        if (!confirm('Tem certeza que deseja remover este item para sempre?')) return;
        const nextInv = (character.inventory || []).filter(i => i.id !== itemId);
        const nextChar = { ...character, inventory: nextInv };
        setCharacterWithDirty(regenerateCharacterStats(nextChar));
    };

    const handleConsumeItem = (itemId: string) => {
        const itemIndex = (character.inventory || []).findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;

        const item = character.inventory[itemIndex];

        // Lookup Definition for Toxicity
        const def = ITEMS.find(i => i.id === itemId) || ITEMS.find(i => i.name === item.name);
        const toxicity = (item as any).toxicity || def?.toxicity || 0;

        if (toxicity > 0) {
            // Find or Create Toxicity Resource
            let resourceIndex = (character.classResources || []).findIndex(r => r.id === 'toxicity');

            const nextResources = [...(character.classResources || [])];

            if (resourceIndex === -1) {
                // Initialize if missing (Witcher default)
                nextResources.push({ id: 'toxicity', name: 'Toxicidade', current: 0, max: 100, rechargesOn: 'short' });
                resourceIndex = nextResources.length - 1;
            }

            const currentTox = nextResources[resourceIndex].current;
            const maxTox = nextResources[resourceIndex].max;

            if (currentTox + toxicity > maxTox) {
                alert(`CUIDADO! Beber esta poção excederá sua Toxicidade Máxima (${maxTox}). Você sofrerá overdose!`);
            }

            nextResources[resourceIndex] = {
                ...nextResources[resourceIndex],
                current: Math.min(maxTox + 50, currentTox + toxicity)
            };

            // Update Character with new resource
            const postResourceChar = { ...character, classResources: nextResources };

            // Decrease Quantity
            const nextInv = [...(postResourceChar.inventory || [])];
            if (nextInv[itemIndex].quantity > 1) {
                nextInv[itemIndex] = { ...nextInv[itemIndex], quantity: nextInv[itemIndex].quantity - 1 };
            } else {
                nextInv.splice(itemIndex, 1);
            }

            const finalChar = { ...postResourceChar, inventory: nextInv };
            setCharacterWithDirty(regenerateCharacterStats(finalChar));
            alert(`Você bebeu ${item.name}. Toxicidade +${toxicity}.`);
        } else {
            const nextInv = [...(character.inventory || [])];
            if (nextInv[itemIndex].quantity > 1) {
                nextInv[itemIndex] = { ...nextInv[itemIndex], quantity: nextInv[itemIndex].quantity - 1 };
            } else {
                nextInv.splice(itemIndex, 1);
            }
            const finalChar = { ...character, inventory: nextInv };
            setCharacterWithDirty(regenerateCharacterStats(finalChar));
            alert(`Você consumiu ${item.name}.`);
        }
    };

    const updateAttribute = React.useCallback((key: string, value: number) => {
        setCharacterWithDirty(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            next.attributes[key].value = value;
            return regenerateCharacterStats(next);
        });
    }, []);

    const toggleSave = React.useCallback((key: string) => {
        setCharacterWithDirty(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            next.attributes[key].saveProficiency = !next.attributes[key].saveProficiency;
            return regenerateCharacterStats(next);
        });
    }, []);

    const toggleSkill = React.useCallback((skillName: string) => {
        setCharacterWithDirty(prev => {
            const next = JSON.parse(JSON.stringify(prev));
            const sk = next.skills.find((s: any) => s.name === skillName);
            if (sk) {
                if (!sk.proficient) { sk.proficient = true; sk.expertise = false; }
                else if (!sk.expertise) { sk.expertise = true; }
                else { sk.proficient = false; sk.expertise = false; }
            }
            return regenerateCharacterStats(next);
        });
    }, []);

    const handleRoll = React.useCallback((_: string, modifier: number) => {
        triggerRoll({ d20: 1 }, modifier);
    }, [triggerRoll]);

    const { roomSettings } = usePeer();
    const { currentAdventure } = useAdventure();
    const campaignStartingLevel = roomSettings?.startingLevel || currentAdventure?.settings?.startingLevel || 1;

    const isOwner = !isGM || myCharacter?.id === characterId;
    const [showBuilder, setShowBuilder] = useState(isOwner && !character.class);
    const [showLevelModal, setShowLevelModal] = useState(isOwner && (character.pendingLevelUp || false));

    useEffect(() => {
        if (isOwner && character.pendingLevelUp) {
            setShowLevelModal(true);
        }
    }, [character.pendingLevelUp, isOwner]);
    const [activeTab, setActiveTab] = useState<'bio' | 'spells' | 'feats' | 'abilities'>('bio');
    const [showInventory, setShowInventory] = useState(false);
    const [showBestiary, setShowBestiary] = useState(false);
    const [showManageSpells, setShowManageSpells] = useState(false);
    const [showProgressionModal, setShowProgressionModal] = useState(false);

    const currentClassData = React.useMemo(() => {
        if (!character.class) return CLASSES[0];
        const lowerName = character.class.toLowerCase().trim();
        return (
            CLASSES.find(c => c.name.toLowerCase() === lowerName || c.id.toLowerCase() === lowerName) ||
            CLASSES.find(c => lowerName.includes(c.name.toLowerCase()) || lowerName.includes(c.id.toLowerCase())) ||
            CLASSES[0]
        );
    }, [character.class]);

    const updateSpellSlot = React.useCallback((level: number, used: number) => {
        setCharacterWithDirty(prev => {
            const next = { ...prev, spellSlots: { ...prev.spellSlots } };
            if (next.spellSlots[level]) {
                next.spellSlots[level] = { ...next.spellSlots[level], used };
            }
            return next;
        });
    }, []);

    const sheetFileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleSheetImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm('Importar esta ficha substituirá os dados atuais da tela. Deseja continuar?')) {
            if (sheetFileInputRef.current) sheetFileInputRef.current.value = '';
            return;
        }

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            if (parsed && (parsed.type === 'rpg-campaign-backup' || (parsed.campaign && Array.isArray(parsed.maps)))) {
                throw new Error("Este arquivo é um Backup de Campanha. Use 'Importar Aventura' no painel do Mestre.");
            }

            const raw = (parsed && parsed.type === 'rpg-character-backup' && parsed.character)
                ? parsed.character
                : parsed;

            if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
                throw new Error('Conteúdo do arquivo não corresponde a uma ficha de personagem válida.');
            }

            const baseClone: Character = JSON.parse(JSON.stringify(initialCharacter));
            const mergedAttrs: Character['attributes'] = {
                str: { ...baseClone.attributes.str, ...(character.attributes?.str || {}), ...(raw.attributes?.str || {}) },
                dex: { ...baseClone.attributes.dex, ...(character.attributes?.dex || {}), ...(raw.attributes?.dex || {}) },
                con: { ...baseClone.attributes.con, ...(character.attributes?.con || {}), ...(raw.attributes?.con || {}) },
                int: { ...baseClone.attributes.int, ...(character.attributes?.int || {}), ...(raw.attributes?.int || {}) },
                wis: { ...baseClone.attributes.wis, ...(character.attributes?.wis || {}), ...(raw.attributes?.wis || {}) },
                cha: { ...baseClone.attributes.cha, ...(character.attributes?.cha || {}), ...(raw.attributes?.cha || {}) }
            };

            const merged: Character = {
                ...baseClone,
                ...character,
                ...raw,
                attributes: mergedAttrs,
                hp: { ...baseClone.hp, ...(character.hp || {}), ...(raw.hp && typeof raw.hp === 'object' ? raw.hp : {}) },
                hitDice: { ...baseClone.hitDice, ...(character.hitDice || {}), ...(raw.hitDice && typeof raw.hitDice === 'object' ? raw.hitDice : {}) },
                deathSaves: { ...baseClone.deathSaves, ...(character.deathSaves || {}), ...(raw.deathSaves && typeof raw.deathSaves === 'object' ? raw.deathSaves : {}) },
                currency: { ...baseClone.currency, ...(character.currency || {}), ...(raw.currency && typeof raw.currency === 'object' ? raw.currency : {}) },
                spellSlots: { ...baseClone.spellSlots, ...(character.spellSlots || {}), ...(raw.spellSlots && typeof raw.spellSlots === 'object' ? raw.spellSlots : {}) },
                // CRITICAL: Preserve slot identity, room binding, and owner!
                id: character.id,
                owner: character.owner,
                adventureId: character.adventureId,
                system: character.system || raw.system
            };

            const regened = regenerateCharacterStats(merged);

            if (regened.class && regened.class.trim()) {
                setShowBuilder(false);
            }

            dirtyRef.current = false;
            setCharacter(regened);
            handleSave(regened);
            alert('Ficha atualizada com sucesso!');
        } catch (err: any) {
            alert('Erro ao carregar arquivo de ficha: ' + (err?.message || 'Arquivo inválido'));
        } finally {
            if (sheetFileInputRef.current) sheetFileInputRef.current.value = '';
        }
    };

    // --- RENDER ---
    return (
        <div className="dnd-sheet-container">
            {/* --- HEADER --- */}
            <header className="sheet-header">
                <div className="header-top-row">
                    <div className="char-name-block">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span
                                style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 'bold',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    background: character.system === 'witcher' ? 'rgba(197, 160, 89, 0.2)' : 'rgba(225, 29, 72, 0.2)',
                                    color: character.system === 'witcher' ? '#c5a059' : '#f43f5e',
                                    border: `1px solid ${character.system === 'witcher' ? '#c5a059' : '#e11d48'}`
                                }}
                            >
                                {character.system === 'witcher' ? 'The Witcher' : 'D&D 5.5e'}
                            </span>
                        </div>
                        <input
                            className="sheet-char-name"
                            value={character.name}
                            onChange={e => updateCharacter({ name: e.target.value })}
                            placeholder="Nome do Personagem"
                        />
                    </div>

                    <div className="header-meta-grid">
                        <div className="meta-field">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label>Classe e Nível</label>
                                {character.class && (
                                    <button
                                        type="button"
                                        title="Ver Tabela Oficial de Progressão de Níveis 1 a 20 e Espaços de Magia"
                                        onClick={() => setShowProgressionModal(true)}
                                        style={{
                                            background: 'rgba(197, 160, 89, 0.15)',
                                            border: '1px solid rgba(197, 160, 89, 0.4)',
                                            color: '#c5a059',
                                            cursor: 'pointer',
                                            fontSize: '0.68rem',
                                            fontWeight: 600,
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            lineHeight: 1.2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <Table size={11} />
                                        <span>1–20</span>
                                    </button>
                                )}
                            </div>
                            <div className="meta-val display-flex readonly-text">
                                {character.class || '---'} {character.level}
                            </div>
                        </div>
                        <div className="meta-field">
                            <label>Raça</label>
                            <div className="meta-val readonly-text">{character.race || '---'}</div>
                        </div>
                        <div className="meta-field">
                            <label>Antecedente</label>
                            <input className="meta-val" value={character.background} onChange={e => updateCharacter({ background: e.target.value })} />
                        </div>
                        <div className="meta-field">
                            <label>Alinhamento</label>
                            <div className="meta-val readonly-text">{character.alignment || '---'}</div>
                        </div>
                        <div className="meta-field">
                            <label>XP</label>
                            <div className="meta-val">
                                {getLevel ? getLevel(character.experience) : ''} (XP: {character.experience})
                            </div>
                            {isGM && (
                                <button
                                    className="gm-lvl-btn"
                                    onClick={() => {
                                        const input = prompt("Definir Nível do personagem (1-20):", String(character.level));
                                        if (input === null) return;

                                        const newLevel = parseInt(input, 10);
                                        if (isNaN(newLevel) || newLevel < 1 || newLevel > 20) {
                                            alert("Por favor insira um nível válido entre 1 e 20.");
                                            return;
                                        }

                                        if (newLevel === character.level) return;

                                        if (confirm(`Alterar nível de ${character.level} para ${newLevel}?\n\nO XP será ajustado para o mínimo deste nível.`)) {
                                            // 1. Calculate new XP
                                            const newXP = getMinXPForLevel(newLevel);
                                            const nextXP = getMinXPForLevel(newLevel + 1) || newXP;

                                            // 2. Prepare Base Update
                                            const nextChar: Character = {
                                                ...character,
                                                level: newLevel,
                                                experience: newXP,
                                                nextLevelExperience: nextXP,
                                                pendingLevelUp: newLevel > character.level,
                                                hitDice: {
                                                    ...character.hitDice,
                                                    max: newLevel,
                                                    current: newLevel > character.level
                                                        ? Math.min(newLevel, (character.hitDice?.current || 1) + (newLevel - character.level))
                                                        : Math.min(newLevel, character.hitDice?.current || 1)
                                                }
                                            };

                                            // 3. Level Down HP Logic
                                            if (newLevel < character.level) {
                                                const diff = character.level - newLevel;
                                                const faces = parseInt(character.hitDice?.dieFace.replace('d', '') || '8');
                                                const avg = (faces / 2) + 1;
                                                const conMod = calculateModifier(character.attributes.con.value);
                                                const hpReduction = Math.floor((avg + conMod) * diff);

                                                if (hpReduction > 0) {
                                                    if (confirm(`DESEJA REDUZIR O HP?\n\nDetectado Downgrade de ${diff} níveis.\nValor sugerido de redução: -${hpReduction} PV\n(Baseado em ${diff}x Média do Dado d${faces} + CON)`)) {
                                                        nextChar.hp.max = Math.max(1, nextChar.hp.max - hpReduction);
                                                        nextChar.hp.current = Math.min(nextChar.hp.current, nextChar.hp.max);
                                                    }
                                                }

                                                // 3b. Remove Higher Level Features
                                                const lostFeatures = (character.features || []).filter(f => f.level > newLevel);
                                                if (lostFeatures.length > 0) {
                                                    if (confirm(`Remover ${lostFeatures.length} Habilidades de Nível Superior?\n\nElas foram obtidas após o nível ${newLevel}.\n\nLista: ${lostFeatures.map(f => f.name).join(', ')}`)) {
                                                        nextChar.features = (character.features || []).filter(f => f.level <= newLevel);
                                                    }
                                                }

                                                // 3c. ASI/Feat Warning
                                                const asiLevels = [4, 8, 12, 16, 19];
                                                const passedASIs = asiLevels.filter(l => l > newLevel && l <= character.level);
                                                if (passedASIs.length > 0) {
                                                    alert(`ATENÇÃO: Você reduziu através de patamares de Talento/Atributo (Níveis: ${passedASIs.join(', ')}).\n\nO sistema NÃO sabe qual atributo ou talento foi escolhido nesses níveis.\n\nPor favor, REMOVA MANUALMENTE quaisquer talentos ou pontos de atributo ganhos indevidamente.`);
                                                }

                                                // 3d. Spell Warning
                                                if (character.spells && character.spells.length > 0) {
                                                    const likelyMaxSpellLevel = Math.ceil(newLevel / 2);
                                                    const highLevelSpells = character.spells.filter(s => s.level > likelyMaxSpellLevel);
                                                    if (highLevelSpells.length > 0) {
                                                        alert(`ATENÇÃO: Existem magias conhecidas de círculo superior ao esperado para o nível ${newLevel} (Possivelmente Círculos: ${highLevelSpells.map(s => s.level).filter((v, i, a) => a.indexOf(v) === i).join(', ')}).\n\nVerifique e remova magias inválidas na aba Magias.`);
                                                    }
                                                }
                                            }

                                            // 4. Update Local & Regen
                                            const regenedChar = regenerateCharacterStats(nextChar);
                                            dirtyRef.current = false;
                                            setCharacter(regenedChar);

                                            // 5. Save & Sync Immediately (Local Repo + Map/Combat Event + Remote Peer)
                                            handleSave(regenedChar);
                                        }
                                    }}
                                >
                                    <Settings size={13} style={{ marginRight: '4px' }} />
                                    Nível
                                </button>
                            )}
                            {!isGM && character.pendingLevelUp && (
                                <button className="lvl-pending-btn animate-pulse" onClick={() => setShowLevelModal(true)}>
                                    <Sparkles size={13} style={{ marginRight: '4px' }} />
                                    Configurar Nível {character.level}!
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="header-actions">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '10px', fontSize: '0.8rem' }}>
                            <span style={{ color: connectionStatusColor, fontWeight: 'bold' }}>{connectionText}</span>
                            {saveStatus === 'saving' && <span style={{ color: '#aaa' }}>Salvando...</span>}
                            {saveStatus === 'saved' && <span style={{ color: '#4eff4e' }}>Salvo!</span>}
                            {saveStatus === 'error' && <span style={{ color: '#ff4e4e' }}>Erro ao Salvar</span>}
                        </div>
                        <button
                            type="button"
                            className="btn-save"
                            onClick={() => CharacterRepository.downloadCharacterFile(character)}
                            title="Exportar Ficha (.json)"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Download size={16} />
                        </button>
                        <button
                            type="button"
                            className="btn-save"
                            onClick={() => sheetFileInputRef.current?.click()}
                            title="Importar / Sobrescrever Ficha (.json)"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Upload size={16} />
                        </button>
                        <input
                            ref={sheetFileInputRef}
                            type="file"
                            accept=".json"
                            style={{ display: 'none' }}
                            onChange={handleSheetImport}
                        />
                        <button className="btn-save" onClick={() => {
                            setSaveStatus('saving');
                            handleSave();
                            setTimeout(() => setSaveStatus('saved'), 500);
                            alert("Salvo!");
                        }} title="Salvar Ficha">
                            <Save size={16} />
                        </button>
                        <button className="btn-exit" onClick={onExit} title="Fechar Ficha">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- 3 COLUMN LAYOUT --- */}
            <div className="sheet-body-grid">

                {/* 1. ATTRIBUTES & SKILLS */}
                <div className="sheet-col col-1">
                    <AttributesPanel
                        attributes={character.attributes}
                        skills={character.skills}
                        level={character.level}
                        proficiencies={character.proficiencies}
                        languages={character.languages}
                        onUpdateAttribute={updateAttribute}
                        onToggleSave={toggleSave}
                        onToggleSkill={toggleSkill}
                        onRoll={handleRoll}
                        isGM={isGM}
                    />
                </div>

                {/* 2. COMBAT & VITALITY */}
                <div className="sheet-col col-2">
                    <CharacterAvatar character={character} onUpdate={url => updateCharacter({ imageUrl: url })} />

                    <CombatPanel
                        character={character}
                        onUpdateHP={React.useCallback((curr: number, temp: number) => updateCharacter({ hp: { ...character.hp, current: curr, temp: temp } }), [character.hp])}
                        onUpdateMaxHP={React.useCallback((max: number) => updateCharacter({ hp: { ...character.hp, max: max } }), [character.hp])}
                        onUpdateAC={React.useCallback((ac: number) => updateCharacter({ armorClass: ac, acOverride: ac }), [])}

                        onRollAttack={(name, bonus) => handleRoll(name, bonus)}
                        onUpdateResource={React.useCallback((index: number, val: number) => {
                            setCharacterWithDirty(prev => {
                                const next = { ...prev, classResources: [...prev.classResources] };
                                next.classResources[index] = { ...next.classResources[index], current: val };
                                return next;
                            });
                        }, [])}
                        onUpdateCharacter={updateCharacter}
                        isGM={isGM}
                    />
                </div>

                {/* 3. BIO, SPELLS & FEATS */}
                <div className="sheet-col col-3">
                    {/* ACTION BUTTONS (SEPARATE) */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <button
                            className="btn-glow"
                            style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                            onClick={() => setShowInventory(true)}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            Inventário
                        </button>
                        {character.system === 'witcher' && (
                            <button
                                className="btn-glow"
                                style={{ flex: 1, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', borderColor: '#c5a059', color: '#c5a059' }}
                                onClick={() => setShowBestiary(true)}
                            >
                                <BookOpen size={14} />
                                <span>Bestiário</span>
                            </button>
                        )}
                    </div>

                    <div className="sheet-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'bio' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bio')}
                        >
                            Bio
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'spells' ? 'active' : ''}`}
                            onClick={() => setActiveTab('spells')}
                        >
                            Grimório
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'abilities' ? 'active' : ''}`}
                            onClick={() => setActiveTab('abilities')}
                        >
                            Habilidades
                        </button>
                        {character.feats && character.feats.length > 0 && (
                            <button
                                className={`tab-btn ${activeTab === 'feats' ? 'active' : ''}`}
                                onClick={() => setActiveTab('feats')}
                            >
                                Talentos
                            </button>
                        )}
                    </div>

                    <div className="tab-content" style={{ marginTop: '15px' }}>
                        {activeTab === 'bio' && (
                            <BioPanel
                                character={character}
                                onUpdateTrait={(field, val) => updateCharacter({ [field]: val })}
                            />
                        )}
                        {activeTab === 'spells' && (
                            <SpellsPanel
                                character={character}
                                onUpdateSlot={updateSpellSlot}
                                onOpenManage={isGM ? () => setShowManageSpells(true) : undefined}
                            />
                        )}
                        {activeTab === 'abilities' && (
                            <AbilitiesPanel
                                character={character}
                                onOpenProgression={() => setShowProgressionModal(true)}
                            />
                        )}
                        {activeTab === 'feats' && (
                            <FeatsPanel character={character} />
                        )}
                    </div>
                </div>

            </div>

            {/* MODALS */}
            {showInventory && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="modal-content animate-fade-in" style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', width: '800px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #444', position: 'relative' }}>
                        <button
                            onClick={() => setShowInventory(false)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ×
                        </button>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>Inventário</h2>
                        <InventoryPanel
                            character={character}
                            onEquipToggle={handleEquipToggle}
                            onRemoveItem={handleRemoveItem}
                            onConsumeItem={handleConsumeItem}
                            isGM={isGM}
                            onAddItem={(item) => {
                                setCharacterWithDirty(prev => {
                                    const next = { ...prev, inventory: [...(prev.inventory || []), item] };
                                    return regenerateCharacterStats(next);
                                });
                            }}
                            onUpdateItem={(updatedItem) => {
                                setCharacterWithDirty(prev => {
                                    const nextInv = (prev.inventory || []).map(i => i.id === updatedItem.id ? updatedItem : i);
                                    const next = { ...prev, inventory: nextInv };
                                    return regenerateCharacterStats(next);
                                });
                            }}
                        />
                    </div>
                </div>
            )}

            {showBestiary && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="modal-content animate-fade-in" style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', width: '900px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #444', position: 'relative' }}>
                        <button
                            onClick={() => setShowBestiary(false)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ×
                        </button>
                        <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginTop: 0 }}>Conhecimento de Bruxo</h2>
                        <PlayerBestiaryPanel character={character} />
                    </div>
                </div>
            )}

            {/* BUILDER MODAL */}
            {showBuilder && (
                <CharacterBuilder
                    character={character}
                    startingLevel={campaignStartingLevel}
                    onUpdate={(updatedChar) => {
                        setCharacter(updatedChar);
                        handleSave(updatedChar);
                        dirtyRef.current = false;
                        if (updatedChar.pendingLevelUp) {
                            setShowLevelModal(true);
                        }
                    }}
                    onClose={() => setShowBuilder(false)}
                />
            )}

            {showLevelModal && (
                <LevelUpModal
                    character={character}
                    onUpdate={(updatedChar) => {
                        // FIX: Sync Bug - Force immediate save and broadcast
                        console.log("Level Up Completed: Forcing Immediate Sync...");
                        const stampedChar: Character = { ...updatedChar, lastModified: Date.now() };

                        // 1. Update Local State (UI)
                        dirtyRef.current = false;
                        setCharacter(stampedChar);

                        // 2. Persist & Sync
                        handleSave(stampedChar);

                        // 3. Dispatch Event (for internal listeners)
                        window.dispatchEvent(new CustomEvent('character_update', { detail: stampedChar }));
                    }}
                    onClose={() => setShowLevelModal(false)}
                />
            )}

            {showManageSpells && (
                <ManageSpellsModal
                    character={character}
                    onLearnSpell={spell => {
                        setCharacterWithDirty(prev => {
                            if (prev.spells?.some(s => s.id === spell.id)) return prev;
                            const next = { ...prev, spells: [...(prev.spells || []), spell] };
                            return regenerateCharacterStats(next);
                        });
                    }}
                    onForgetSpell={id => {
                        setCharacterWithDirty(prev => {
                            const next = { ...prev, spells: (prev.spells || []).filter(s => s.id !== id) };
                            return regenerateCharacterStats(next);
                        });
                    }}
                    onClose={() => setShowManageSpells(false)}
                />
            )}

            {showProgressionModal && currentClassData && (
                <ClassProgression
                    classData={currentClassData}
                    characterLevel={character.level}
                    onClose={() => setShowProgressionModal(false)}
                />
            )}

            <style>{`
                .dnd-sheet-container {
                    /* Layout handled in CSS file */
                }

                /* TABS (Keep these if not in CSS file) */
                .sheet-tabs {
                    display: flex; gap: 5px; border-bottom: 1px solid #333;
                    margin-bottom: 10px;
                }
                .tab-btn {
                    background: transparent; border: none; color: #888;
                    padding: 8px 15px; cursor: pointer; font-size: 1rem;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                }
                .tab-btn:hover { color: #ccc; }
                .tab-btn.active { color: #c5a059; border-bottom-color: #c5a059; font-weight: bold; }
            `}</style>
        </div>
    );
};
