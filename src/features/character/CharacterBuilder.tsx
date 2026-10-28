import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { CLASSES } from './data/classes';
import { RACES } from './data/races';
import { BACKGROUNDS } from './data/backgrounds';
import { SPELLS } from './data/spells';
import { FEATS } from './data/feats';
import { DND_LANGUAGES, WITCHER_LANGUAGES } from './data/rules';
import { ITEMS } from './data/items';

import { SkillDescriptionPreview } from './SkillDescriptionPreview';
import { X } from 'lucide-react';
import {
    type Character,
    type CharacterAttributes,
    regenerateCharacterStats,
    calculateModifier,
    type ClassFeature,
    XP_TABLE
} from './characterTypes';
import { usePeer } from '../multiplayer/SocketContext';
import { getSpellSlotsForLevel, getClassResourcesForLevel } from './data/progression';
import { ClassProgression } from './components/ClassProgression';
import './CharacterBuilder.css';

interface CharacterBuilderProps {
    character: Character;
    onUpdate: (char: Character) => void;
    onClose: () => void;
    startingLevel?: number;
}

export const CharacterBuilder: React.FC<CharacterBuilderProps> = ({ character, onUpdate, onClose, startingLevel }) => {
    const { currentAdventureId, roomSystem, roomSettings } = usePeer();

    const effectiveStartingLevel = Math.max(1, Math.min(20, startingLevel ?? roomSettings?.startingLevel ?? 1));

    // Detect active system strictly (witcher if character/room is witcher, otherwise dnd55e)
    const activeSystem: 'witcher' | 'dnd55e' = (
        character.system === 'witcher' ||
        roomSystem === 'witcher' ||
        currentAdventureId?.toUpperCase().startsWith('WTC')
    ) ? 'witcher' : 'dnd55e';

    // Strict system-filtered catalogs
    const availableRaces = React.useMemo(() => {
        if (activeSystem === 'witcher') {
            return RACES.filter(r => r.system === 'witcher');
        }
        return RACES.filter(r => r.system === 'dnd55e' || (!r.system && r.id !== 'witcher' && !r.id.startsWith('witcher_')));
    }, [activeSystem]);

    const availableClasses = React.useMemo(() => {
        if (activeSystem === 'witcher') {
            return CLASSES.filter(c => c.system === 'witcher');
        }
        return CLASSES.filter(c => c.system === 'dnd55e' || (!c.system && c.id !== 'witcher'));
    }, [activeSystem]);

    const availableBackgrounds = React.useMemo(() => {
        if (activeSystem === 'witcher') {
            return BACKGROUNDS.filter(b => b.system === 'witcher');
        }
        return BACKGROUNDS.filter(b => b.system === 'dnd55e' || (!b.system && !b.id.startsWith('witcher_')));
    }, [activeSystem]);

    // Initial safe selection within the active system
    const initialRaceId = availableRaces.find(r => r.name === character.race || r.id === character.race?.toLowerCase())?.id || availableRaces[0]?.id || (activeSystem === 'witcher' ? 'witcher' : 'human');
    const initialClassId = availableClasses.find(c => c.name === character.class || c.id === character.class?.toLowerCase())?.id || availableClasses[0]?.id || (activeSystem === 'witcher' ? 'witcher' : 'fighter');
    const initialBackgroundId = availableBackgrounds.find(b => b.name === character.background || b.id === character.background?.toLowerCase())?.id || availableBackgrounds[0]?.id || (activeSystem === 'witcher' ? 'witcher_hunter' : 'soldier');

    const [charName, setCharName] = useState<string>(
        character.name && character.name !== 'Novo Personagem' ? character.name : ''
    );
    const [selectedRaceId, setSelectedRaceId] = useState<string>(initialRaceId);
    const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId);
    const [selectedAlignment, setSelectedAlignment] = useState<string>(character.alignment || 'Neutro');
    const [selectedBackgroundId, setSelectedBackgroundId] = useState<string>(initialBackgroundId);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const availableLanguages = React.useMemo(() => {
        return activeSystem === 'witcher' ? WITCHER_LANGUAGES : DND_LANGUAGES;
    }, [activeSystem]);

    // D&D 2024 / 5.5e Background Ability Score Increases (+2/+1 or +1/+1/+1 among background's abilityOptions)
    const [bgBonusMode, setBgBonusMode] = useState<'plus2_plus1' | 'plus1_all'>('plus2_plus1');
    const [bgPlusTwo, setBgPlusTwo] = useState<keyof CharacterAttributes>('str');
    const [bgPlusOne, setBgPlusOne] = useState<keyof CharacterAttributes>('con');

    // Keep background bonus choices aligned whenever background changes
    React.useEffect(() => {
        const bg = BACKGROUNDS.find(b => b.id === selectedBackgroundId);
        const options = bg?.abilityOptions || ['str', 'dex', 'con'];
        if (!options.includes(bgPlusTwo)) {
            setBgPlusTwo(options[0] || 'str');
        }
        const remaining = options.filter(o => o !== (options.includes(bgPlusTwo) ? bgPlusTwo : options[0]));
        if (!options.includes(bgPlusOne) || bgPlusOne === bgPlusTwo) {
            setBgPlusOne(remaining[0] || options[1] || 'con');
        }
    }, [selectedBackgroundId, bgPlusTwo, bgPlusOne]);

    const getAttributeBonus = React.useCallback((attrKey: string): number => {
        if (activeSystem === 'witcher') {
            const race = RACES.find(r => r.id === selectedRaceId);
            return race?.bonus ? ((race.bonus as any)[attrKey] || 0) : 0;
        }
        // D&D 5.5e (2024) official rules: Bonuses come strictly from Background
        const bg = BACKGROUNDS.find(b => b.id === selectedBackgroundId);
        const options = bg?.abilityOptions || [];
        if (!options.includes(attrKey as any)) return 0;

        if (bgBonusMode === 'plus2_plus1') {
            if (attrKey === bgPlusTwo) return 2;
            if (attrKey === bgPlusOne) return 1;
            return 0;
        } else {
            return 1; // +1 to all 3 eligible ability scores
        }
    }, [activeSystem, selectedRaceId, selectedBackgroundId, bgBonusMode, bgPlusTwo, bgPlusOne]);

    const ALIGNMENTS = [
        'Leal e Bom', 'Leal e Neutro', 'Leal e Mau',
        'Neutro e Bom', 'Neutro', 'Neutro e Mau',
        'Caótico e Bom', 'Caótico e Neutro', 'Caótico e Mau'
    ];

    const SPELL_SCHOOLS = [
        { id: 'all', name: 'Todas as Escolas' },
        { id: 'Abjuração', name: 'Abjuração' },
        { id: 'Adivinhação', name: 'Adivinhação' },
        { id: 'Conjuração', name: 'Conjuração' },
        { id: 'Encantamento', name: 'Encantamento' },
        { id: 'Evocação', name: 'Evocação' },
        { id: 'Ilusão', name: 'Ilusão' },
        { id: 'Necromancia', name: 'Necromancia' },
        { id: 'Transmutação', name: 'Transmutação' }
    ];

    const [baseStats, setBaseStats] = useState<Record<string, number>>({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });
    const [viewingProgressionId, setViewingProgressionId] = useState<string | null>(null);
    const POINTS_MAX = 27;

    // Selection State
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
    const [selectedCantrips, setSelectedCantrips] = useState<string[]>([]);
    const [selectedRaceCantrips, setSelectedRaceCantrips] = useState<string[]>([]); // New state
    const [selectedFeats, setSelectedFeats] = useState<string[]>([]);
    const [selectedEquipmentChoices, setSelectedEquipmentChoices] = useState<Record<number, number>>({});
    const [selectedRogueExpertises, setSelectedRogueExpertises] = useState<string[]>([]);

    const [spellSearch, setSpellSearch] = useState('');
    const [spellSchoolFilter, setSpellSchoolFilter] = useState('all');

    // Track previous class to reset selection if class changes
    const prevClassId = React.useRef(initialClassId);

    React.useEffect(() => {
        if (prevClassId.current !== selectedClassId) {
            console.log(`[CharacterBuilder] Class Changed from ${prevClassId.current} to ${selectedClassId}. Resetting equipment choices.`);
            setSelectedSkills([]);
            setSelectedSpells([]);
            setSelectedCantrips([]);
            setSelectedFeats([]);
            setSelectedEquipmentChoices({}); // Reset equipment choices
            setSelectedRogueExpertises([]);
            setSpellSearch('');
            setSpellSchoolFilter('all');
            onUpdate({ ...character, hpRolled: undefined });
            prevClassId.current = selectedClassId;
        }
    }, [selectedClassId, character, onUpdate]);

    // Memoized derived data
    const selectedClass = React.useMemo(() => CLASSES.find(c => c.id === selectedClassId), [selectedClassId]);
    const selectedRace = React.useMemo(() => RACES.find(r => r.id === selectedRaceId), [selectedRaceId]);
    const selectedBackground = React.useMemo(() => BACKGROUNDS.find(b => b.id === selectedBackgroundId), [selectedBackgroundId]);
    const isSpellCaster = React.useMemo(() => !!selectedClass?.spellcastingConfig, [selectedClass]);

    // Auto-select race cantrip if there is only 1 fixed option (e.g. Aasimar Light)
    React.useEffect(() => {
        if (selectedRace?.cantripChoices?.options && selectedRace.cantripChoices.options.length === 1) {
            setSelectedRaceCantrips(selectedRace.cantripChoices.options);
        } else {
            setSelectedRaceCantrips([]);
        }
    }, [selectedRaceId, selectedRace]);

    // Optimize Spell Filtering
    const availableCantrips = React.useMemo(() =>
        isSpellCaster ? SPELLS.filter(s => s.level === 0 && s.classes.includes(selectedClassId)) : []
        , [isSpellCaster, selectedClassId]);

    const availableRaceCantrips = React.useMemo(() => {
        if (!selectedRace?.cantripChoices) return [];
        if (selectedRace.cantripChoices.options && selectedRace.cantripChoices.options.length > 0) {
            return SPELLS.filter(s => s.level === 0 && selectedRace.cantripChoices!.options!.includes(s.id));
        }
        if (selectedRace.cantripChoices.classList) {
            return SPELLS.filter(s => s.level === 0 && s.classes.includes(selectedRace.cantripChoices!.classList!));
        }
        return [];
    }, [selectedRace]);

    const availableSpellsL1 = React.useMemo(() =>
        isSpellCaster ? SPELLS.filter(s => s.level === 1 && s.classes.includes(selectedClassId)) : []
        , [isSpellCaster, selectedClassId]);

    const filterSpells = React.useCallback((spellList: typeof SPELLS) => {
        return spellList.filter(s => {
            if (spellSchoolFilter !== 'all' && s.school.toLowerCase() !== spellSchoolFilter.toLowerCase()) {
                return false;
            }
            if (spellSearch.trim()) {
                const query = spellSearch.toLowerCase().trim();
                const matchName = s.name.toLowerCase().includes(query);
                const matchDesc = s.description.toLowerCase().includes(query);
                const matchSchool = s.school.toLowerCase().includes(query);
                return matchName || matchDesc || matchSchool;
            }
            return true;
        });
    }, [spellSearch, spellSchoolFilter]);

    const getSpeciesImage = React.useCallback((raceId: string) => {
        if (raceId.startsWith('elf')) return '/assets/species/elf.jpeg';
        if (raceId.startsWith('dwarf')) return '/assets/species/dwarf.jpeg';
        if (raceId.startsWith('halfling')) return '/assets/species/halfling.jpeg';
        const valid = ['human', 'aasimar', 'dragonborn', 'gnome', 'goliath', 'orc', 'tiefling'];
        if (valid.includes(raceId)) return `/assets/species/${raceId}.jpeg`;
        return null;
    }, []);

    const getClassImage = React.useCallback((classId: string) => {
        const valid = ['barbarian', 'bard', 'warlock', 'cleric', 'druid', 'sorcerer', 'ranger', 'fighter', 'rogue', 'wizard', 'monk', 'paladin'];
        if (valid.includes(classId)) return `/assets/classes/${classId}.jpeg`;
        return null;
    }, []);

    // Handlers
    const toggleSkill = React.useCallback((skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(prev => prev.filter(s => s !== skill));
            setSelectedRogueExpertises(prev => prev.filter(s => s !== skill));
        } else {
            const limit = selectedClass?.skillChoices.count || 2;
            if (selectedSkills.length < limit) {
                setSelectedSkills(prev => [...prev, skill]);
            }
        }
    }, [selectedSkills, selectedClass]);

    const toggleRogueExpertise = React.useCallback((skill: string) => {
        setSelectedRogueExpertises(prev => {
            if (prev.includes(skill)) {
                return prev.filter(s => s !== skill);
            }
            if (prev.length < 2) {
                return [...prev, skill];
            }
            return prev;
        });
    }, []);

    const toggleSpell = React.useCallback((spellId: string, isCantrip: boolean) => {
        const config = selectedClass?.spellcastingConfig;
        if (!config) return;


        // Accessing state setter via closure is risky if list is stale, but we use list in condition
        // Better to use functional updates fully or dependency
        // Re-implementing for safety:
        if (isCantrip) {
            setSelectedCantrips(prev => {
                if (prev.includes(spellId)) return prev.filter(id => id !== spellId);
                if (prev.length < config.cantripsKnown) return [...prev, spellId];
                return prev;
            });
        } else {
            setSelectedSpells(prev => {
                if (prev.includes(spellId)) return prev.filter(id => id !== spellId);
                if (prev.length < config.spellsKnown) return [...prev, spellId];
                return prev;
            });
        }
    }, [selectedClass, selectedCantrips, selectedSpells]); // Refs for lists would be better but this is fine with deps

    const toggleTool = React.useCallback((tool: string) => {
        const limit = selectedClass?.toolChoices?.count || 0;
        if (selectedTools.includes(tool)) {
            setSelectedTools(prev => prev.filter(t => t !== tool));
        } else {
            if (selectedTools.length < limit) {
                setSelectedTools(prev => [...prev, tool]);
            }
        }
    }, [selectedTools, selectedClass]);

    const toggleLanguage = React.useCallback((lang: string) => {
        const limit = selectedRace?.languageChoices?.count || 0;
        if (selectedLanguages.includes(lang)) {
            setSelectedLanguages(prev => prev.filter(l => l !== lang));
        } else {
            if (selectedLanguages.length < limit) {
                setSelectedLanguages(prev => [...prev, lang]);
            }
        }
    }, [selectedLanguages, selectedRace]);

    const toggleRaceCantrip = React.useCallback((spellId: string) => {
        const limit = selectedRace?.cantripChoices?.count || 0;
        if (selectedRaceCantrips.includes(spellId)) {
            setSelectedRaceCantrips(prev => prev.filter(id => id !== spellId));
        } else {
            if (selectedRaceCantrips.length < limit) {
                setSelectedRaceCantrips(prev => [...prev, spellId]);
            }
        }
    }, [selectedRaceCantrips, selectedRace]);

    const toggleFeat = React.useCallback((featId: string) => {
        // Typically only 1 feat (e.g. from Custom Lineage or Level 4), but let's allow 1 for now or check rules?
        // Let's assume Human Variant logic or generic "Pick a Feat".
        // Limit to 1 for this MVP builder step unless we want more.
        if (selectedFeats.includes(featId)) {
            setSelectedFeats(prev => prev.filter(f => f !== featId));
        } else {
            if (selectedFeats.length < 1) {
                setSelectedFeats(prev => [...prev, featId]);
            }
        }
    }, [selectedFeats]);

    const calculateCost = React.useCallback((score: number) => {
        if (score <= 8) return 0;
        if (score === 9) return 1;
        if (score === 10) return 2;
        if (score === 11) return 3;
        if (score === 12) return 4;
        if (score === 13) return 5;
        if (score === 14) return 7;
        if (score === 15) return 9;
        return 99;
    }, []);

    const usedPoints = React.useMemo(() =>
        Object.values(baseStats).reduce((acc, val) => acc + calculateCost(val), 0)
        , [baseStats, calculateCost]);

    const remainingPoints = POINTS_MAX - usedPoints;

    const updateBaseStat = React.useCallback((attr: string, delta: number) => {
        const current = baseStats[attr];
        const next = current + delta;
        if (next < 8 || next > 15) return;

        // Check cost with fresh calculation
        // We need to know cost difference. 
        // calculateCost is pure, so it's safe.
        // But we need 'remainingPoints'. Since we are in callback, we should calculate derived state inside too or rely on dep.
        // To avoid dep cycle, we recalc usedPoints here or use functional update with check?
        // Simplest: use variable, but we need current 'baseStats' for other stats? 
        // Actually we only need current attr val.

        // Let's rely on 'usedPoints' being correct from render scope (captured in closure)
        // This requires 'usedPoints' in dependency array.
        const costDiff = calculateCost(next) - calculateCost(current);
        if (remainingPoints - costDiff < 0) return;

        setBaseStats(prev => ({ ...prev, [attr]: next }));
    }, [baseStats, remainingPoints, calculateCost]);

    const applyStandardArray = React.useCallback(() => {
        const primary = selectedClass?.primaryAbility?.toLowerCase() || '';
        let newStats: Record<string, number>;
        if (/destreza|dex/i.test(primary) && /força|str/i.test(primary)) {
            newStats = { dex: 15, con: 14, str: 13, wis: 12, int: 10, cha: 8 };
        } else if (/destreza|dex/i.test(primary)) {
            newStats = { dex: 15, con: 14, wis: 13, int: 12, cha: 10, str: 8 };
        } else if (/força|str/i.test(primary)) {
            newStats = { str: 15, con: 14, dex: 13, wis: 12, cha: 10, int: 8 };
        } else if (/inteligência|int/i.test(primary)) {
            newStats = { int: 15, con: 14, dex: 13, wis: 12, cha: 10, str: 8 };
        } else if (/sabedoria|wis/i.test(primary)) {
            newStats = { wis: 15, con: 14, dex: 13, int: 12, cha: 10, str: 8 };
        } else if (/carisma|cha/i.test(primary)) {
            newStats = { cha: 15, con: 14, dex: 13, wis: 12, int: 10, str: 8 };
        } else {
            newStats = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
        }
        setBaseStats(newStats);
    }, [selectedClass]);

    const resetStats = React.useCallback(() => {
        setBaseStats({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });
    }, []);

    // Navigation
    const [currentStep, setCurrentStep] = useState(0);

    const hasProficiencyChoice = (selectedClass?.toolChoices || selectedRace?.languageChoices);
    const hasSpells = isSpellCaster || !!selectedRace?.cantripChoices;

    const rawSteps = [
        { label: 'Origem' },
        { label: 'Atributos' },
        { label: 'Perícias' },
        ...(hasProficiencyChoice ? [{ label: 'Proficiências' }] : []),
        ...(hasSpells ? [{ label: 'Magias' }] : []),
        { label: 'Talentos' },
        { label: 'Equipamentos' },
        { label: 'Vida' }
    ];
    const steps = rawSteps.map((s, i) => ({ id: i, label: s.label }));

    // Finalize
    const handleApply = React.useCallback(async () => {
        if (!selectedRace || !selectedClass) return;

        let nextChar = { ...character };

        // 0. Character Name
        nextChar.name = charName.trim() || character.name || 'Novo Personagem';

        // 0.5 Background
        if (selectedBackground) {
            nextChar.background = selectedBackground.name;
        }

        // 1. Race & Origin
        nextChar.race = selectedRace.name;
        nextChar.speed = selectedRace.speed;
        nextChar.alignment = selectedAlignment;

        // Auto-detect Darkvision
        const hasDarkvision = selectedRace.traits?.some(t => /visão no escuro|darkvision/i.test(t.name) || /visão no escuro|darkvision/i.test(t.description));
        nextChar.visionRange = hasDarkvision ? 18 : 0;

        // Attributes
        (Object.keys(nextChar.attributes) as Array<keyof Character['attributes']>).forEach(attrKey => {
            const base = baseStats[attrKey];
            const bonus = getAttributeBonus(attrKey);
            const total = base + bonus;
            nextChar.attributes[attrKey].value = total;
            nextChar.attributes[attrKey].modifier = Math.floor((total - 10) / 2);
        });
        nextChar.system = activeSystem;

        // 2. Class
        nextChar.class = selectedClass.name;
        nextChar.hitDice.dieFace = selectedClass.hitDie;

        // HP (Level 1 Max)
        if (nextChar.level === 1) {
            const hdValue = parseInt(selectedClass.hitDie.replace('d', ''));
            const conMod = calculateModifier(nextChar.attributes.con.value);
            const baseHp = hdValue;
            nextChar.hp.max = Math.max(1, baseHp + conMod);
            nextChar.hp.current = nextChar.hp.max;
            nextChar.hitDice.max = nextChar.level;
            nextChar.hitDice.current = nextChar.level;
        }

        // Subclasses are chosen at Level 3 per official D&D 5.5e (2024) rules
        nextChar.subclass = undefined;

        // Saves
        (Object.values(nextChar.attributes) as any[]).forEach(attr => attr.saveProficiency = false);
        selectedClass.savingThrows.forEach(saveAttr => {
            if (nextChar.attributes[saveAttr as keyof typeof nextChar.attributes]) {
                nextChar.attributes[saveAttr as keyof typeof nextChar.attributes].saveProficiency = true;
            }
        });

        // Resources
        if (selectedClass.resources) {
            nextChar.classResources = selectedClass.resources.map(r => ({ ...r }));
        }

        // Features
        const classFeatures: ClassFeature[] = selectedClass.features
            .filter(f => f.level <= nextChar.level)
            .map(f => ({ ...f, type: f.type || 'passive' } as ClassFeature));

        const raceFeatures: ClassFeature[] = (selectedRace.traits || []).map(t => ({
            name: t.name,
            description: t.description,
            level: 1,
            type: 'passive'
        }));

        nextChar.features = [...raceFeatures, ...classFeatures];

        // Skills
        // Merge Class Selection + Background Fixed Skills
        const bgSkills: string[] = selectedBackground ? (selectedBackground.skillProficiencies as string[]) : [];
        const finalSkillNames = Array.from(new Set([...selectedSkills, ...bgSkills]));

        // Generate base skill objects
        // We reuse the logic from characterTypes but we need to set 'proficient' to true for selected ones
        // Since we don't have access to createDefaultSkills directly here easily without importing it or duplicating
        // We will assume nextChar.skills is empty as per initial state
        // Actually, we can just iterate the SKILL_ATTRIBUTE_MAP keys.

        // Let's rely on regenerateCharacterStats helper to build the structure?
        // No, that helper expects existing structure or builds clean one.
        // We need to build the initial structure with proficiencies marked.

        nextChar.skills = []; // clear to force rebuild in next step? 
        // No, we should build it here to set 'proficient': true

        // This is a bit hacky: we'll let regenerateCharacterStats build the default list,
        // then we toggle the booleans.
        // But regenerateCharacterStats uses current attributes.

        // First, apply attributes to nextChar (done above)
        // Now call regenerate to get basic skills list
        nextChar = regenerateCharacterStats(nextChar); // This builds default skills based on attrs

        // Now update the skills with our selection
        nextChar.skills = nextChar.skills.map(s => ({
            ...s,
            proficient: finalSkillNames.includes(s.name)
        }));

        // Re-calculate values now that proficiency is set
        nextChar = regenerateCharacterStats(nextChar);

        // Tool Proficiencies
        const classTools = selectedTools;
        const bgTools: string[] = selectedBackground?.toolProficiencies || [];
        nextChar.proficiencies = Array.from(new Set([...classTools, ...bgTools]));

        // Languages
        const raceLangs = selectedRace.languages || ['Comum'];
        const chosenLangs = selectedLanguages;

        // Background languages not implemented in UI yet, ignoring count

        nextChar.languages = Array.from(new Set([...raceLangs, ...chosenLangs]));

        // Background starting gold extraction and equipment parsing
        let startingGold = activeSystem === 'witcher' ? 25 : 50;
        const bgEquip: any[] = [];

        (selectedBackground?.equipment || []).forEach(equipName => {
            const goldMatch = equipName.match(/(\d+)\s*PO/i);
            if (goldMatch) {
                const parsedGold = parseInt(goldMatch[1]);
                if (!isNaN(parsedGold) && parsedGold > 0) {
                    startingGold = parsedGold;
                }
                return;
            }

            const match = equipName.match(/^(?:(\d+)\s+)?(.*?)(?:\s*\((?:x)?(\d+)\))?$/);
            let name = equipName;
            let quantity = 1;
            if (match && match[1]) {
                quantity = parseInt(match[1]);
                name = match[2];
            } else if (match && match[3]) {
                quantity = parseInt(match[3]);
                name = match[2];
            }

            const id = name.toLowerCase()
                .replace(/[\s-]/g, '_')
                .replace(/[áàâã]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óôõ]/g, 'o').replace(/[ú]/g, 'u').replace(/ç/g, 'c');
            const def = ITEMS.find(i => i.id === id || i.name.toLowerCase() === name.toLowerCase());

            bgEquip.push({
                id: def ? def.id : id,
                name: def ? def.name : name,
                quantity: quantity,
                description: def?.description || `Equipamento concedido pelo Antecedente (${selectedBackground?.name || 'Antecedente'})`,
                weight: def?.weight ?? 1,
                type: def?.type ?? 'gear',
                damage: def?.damage,
                damageType: def?.damageType,
                properties: def?.properties,
                range: def?.range,
                ac: def?.ac,
                acDexBonus: def?.acDexBonus,
                acMaxDex: def?.acMaxDex,
                cost: def?.cost
            });
        });

        nextChar.currency = {
            ...(nextChar.currency || { cp: 0, sp: 0, ep: 0, pp: 0 }),
            gp: (nextChar.currency?.gp || 0) + startingGold
        };

        // Class Equipment parsing & intelligent auto-equipping
        const classEquip: any[] = [];
        const combinedEquipment = [
            ...(selectedClass.startingEquipment || [])
        ];

        if (selectedClass.equipmentChoices) {
            selectedClass.equipmentChoices.forEach((choice, idx) => {
                const selectedOptionIdx = selectedEquipmentChoices[idx] ?? 0;
                const selectedOption = choice.options[selectedOptionIdx];
                if (selectedOption) {
                    combinedEquipment.push(...selectedOption.items);
                }
            });
        }

        let hasEquippedArmor = false;
        let hasEquippedShield = false;
        let equippedWeaponCount = 0;

        if (combinedEquipment.length > 0) {
            combinedEquipment.forEach(itemStr => {
                const match = itemStr.match(/^(.*?)\s*\((?:x)?(\d+)(?:\s+flechas|\s+virotes)?\)$/i);
                let name = itemStr;
                let quantity = 1;

                if (match) {
                    name = match[1];
                    quantity = parseInt(match[2]);
                }

                const id = name.toLowerCase().replace(/[\s-]/g, '_')
                    .replace(/[áàâã]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óôõ]/g, 'o').replace(/[ú]/g, 'u').replace(/ç/g, 'c');

                const def = ITEMS.find(i => i.id === id || i.name.toLowerCase() === name.toLowerCase());
                const itemType = def?.type || 'gear';

                let isEquipped = false;
                if (itemType === 'armor') {
                    const isShield = id.includes('escudo') || (def?.name && /escudo/i.test(def.name)) || /escudo/i.test(name);
                    if (isShield) {
                        if (!hasEquippedShield) {
                            isEquipped = true;
                            hasEquippedShield = true;
                        }
                    } else {
                        if (!hasEquippedArmor) {
                            isEquipped = true;
                            hasEquippedArmor = true;
                        }
                    }
                } else if (itemType === 'weapon') {
                    if (equippedWeaponCount < 2) {
                        isEquipped = true;
                        equippedWeaponCount++;
                    }
                }

                classEquip.push({
                    id: def ? def.id : id,
                    name: def ? def.name : name,
                    quantity: quantity,
                    description: def ? (def.description || (def.type === 'weapon' ? `${def.damage} ${def.damageType}` : 'Equipamento')) : 'Item Inicial',
                    weight: def ? def.weight : 0,
                    type: def?.type,
                    damage: def?.damage,
                    damageType: def?.damageType,
                    properties: def?.properties,
                    range: def?.range,
                    ac: def?.ac,
                    acDexBonus: def?.acDexBonus,
                    acMaxDex: def?.acMaxDex,
                    stealthDisadvantage: def?.stealthDisadvantage,
                    cost: def?.cost,
                    equipped: isEquipped
                });
            });
        }

        nextChar.inventory = [...bgEquip, ...classEquip];

        // Add Feature from Background
        if (selectedBackground?.feature) {
            nextChar.features.push({
                name: selectedBackground.feature.name,
                description: selectedBackground.feature.description,
                level: 1,
                type: 'passive'
            });
        }

        nextChar.skills = nextChar.skills.map(s => ({ ...s, proficient: false, expertise: false }));
        finalSkillNames.forEach(skillName => {
            const sk = nextChar.skills.find(s => s.name === skillName);
            if (sk) {
                sk.proficient = true;
                if (selectedClassId === 'rogue' && selectedRogueExpertises.includes(skillName)) {
                    sk.expertise = true;
                }
            }
        });

        // Proficiencies (Tools & Languages)
        nextChar.proficiencies = []; // Reset first
        if (selectedClass.armorProficiency) nextChar.proficiencies.push(...selectedClass.armorProficiency.map(p => `Armadura (${p})`));
        if (selectedClass.weaponProficiency) nextChar.proficiencies.push(...selectedClass.weaponProficiency.map(p => `Armas (${p})`));
        if (selectedClass.toolProficiencies) nextChar.proficiencies.push(...selectedClass.toolProficiencies);
        if (selectedBackground?.toolProficiencies) nextChar.proficiencies.push(...selectedBackground.toolProficiencies);

        nextChar.proficiencies.push(...selectedTools); // Add chosen tools
        nextChar.proficiencies = Array.from(new Set(nextChar.proficiencies));

        nextChar.languages = [...(selectedRace.languages || [])]; // Fixed
        nextChar.languages.push(...selectedLanguages); // Chosen

        // Spells
        const chosenCantrips = SPELLS.filter(s => selectedCantrips.includes(s.id));
        const chosenSpells = SPELLS.filter(s => selectedSpells.includes(s.id));
        const chosenRaceCantrips = SPELLS.filter(s => selectedRaceCantrips.includes(s.id));

        nextChar.spells = [...chosenCantrips, ...chosenSpells, ...chosenRaceCantrips];

        // Feats (including Origin Feat from Background)
        const chosenFeats = FEATS.filter(f => selectedFeats.includes(f.id));
        if (selectedBackground?.featId) {
            const originFeat = FEATS.find(f => f.id === selectedBackground.featId);
            if (originFeat && !chosenFeats.some(f => f.id === originFeat.id)) {
                chosenFeats.unshift(originFeat);
            }
        }
        nextChar.feats = [...chosenFeats];

        // Apply Feat Bonuses (HP per Level, Speed)
        chosenFeats.forEach(feat => {
            if (feat.effects) {
                feat.effects.forEach(effect => {
                    if (effect.type === 'hp_per_level') {
                        const bonusHP = effect.value * nextChar.level;
                        nextChar.hp.max += bonusHP;
                        nextChar.hp.current = nextChar.hp.max; // Heal to full on create/edit
                    }
                    if (effect.type === 'speed') {
                        nextChar.speed += effect.value;
                    }
                });
            }
        });

        // Initialize Spell Slots for Casters at Level 1
        if (isSpellCaster || selectedClass?.spellcastingConfig) {
            nextChar.spellSlots = getSpellSlotsForLevel(selectedClass.id, 1);
        } else {
            nextChar.spellSlots = {
                1: { max: 0, used: 0 },
                2: { max: 0, used: 0 },
                3: { max: 0, used: 0 },
                4: { max: 0, used: 0 },
                5: { max: 0, used: 0 },
                6: { max: 0, used: 0 },
                7: { max: 0, used: 0 },
                8: { max: 0, used: 0 },
                9: { max: 0, used: 0 },
            };
        }

        // Initialize Class Resources for Level 1
        nextChar.classResources = getClassResourcesForLevel(selectedClass.id, 1);

        // Multi-level Queue Setup: If starting level > 1, configure target queue for LevelUpModal
        if (effectiveStartingLevel > 1) {
            nextChar.levelUpTarget = effectiveStartingLevel;
            nextChar.level = 2;
            nextChar.pendingLevelUp = true;
            nextChar.experience = XP_TABLE[2] || 300;
            nextChar.nextLevelExperience = XP_TABLE[3] || 900;
        } else {
            nextChar.level = 1;
            nextChar.levelUpTarget = undefined;
            nextChar.pendingLevelUp = false;
            nextChar.experience = 0;
            nextChar.nextLevelExperience = XP_TABLE[2] || 300;
        }

        onUpdate(regenerateCharacterStats(nextChar));
        onClose();
    }, [character, charName, selectedClass, selectedRace, selectedBackground, baseStats, selectedSkills, selectedRogueExpertises, isSpellCaster, selectedCantrips, selectedSpells, selectedAlignment, selectedTools, selectedLanguages, selectedFeats, selectedEquipmentChoices, getAttributeBonus, activeSystem, effectiveStartingLevel, onUpdate, onClose]);

    // Render using Portal
    return ReactDOM.createPortal(
        <div className="char-builder-modal">
            <div className="builder-content">
                <div className="builder-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2>{activeSystem === 'witcher' ? 'Criação de Personagem — The Witcher' : 'Criação de Personagem — D&D 5.5e (2024)'}</h2>
                        {effectiveStartingLevel > 1 && (
                            <span style={{
                                background: 'rgba(255, 215, 0, 0.15)',
                                border: '1px solid #ffd700',
                                color: '#ffd700',
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                Meta da Campanha: Nível {effectiveStartingLevel}
                            </span>
                        )}
                    </div>
                    <button className="btn-close-header" onClick={onClose} title="Fechar"><X size={18} /></button>
                </div>

                <div className="builder-stepper">
                    {steps.map(step => (
                        <button
                            key={step.id}
                            className={`step-btn ${currentStep === step.id ? 'active' : ''}`}
                            onClick={() => setCurrentStep(step.id)}
                        >
                            {step.label}
                        </button>
                    ))}
                </div>

                <div className="step-content">
                    {/* STEP 0: Origin */}
                    {currentStep === 0 && (
                        <div className="builder-row animate-fade">
                            <div className="builder-col">
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '6px', color: '#c5a059', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                        Nome do Personagem:
                                    </label>
                                    <input
                                        type="text"
                                        value={charName}
                                        onChange={(e) => setCharName(e.target.value)}
                                        placeholder="Ex: Geralt de Rívia, Eldrin, Arthur..."
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            background: '#1a1a24',
                                            color: '#fff',
                                            border: '1px solid #555',
                                            borderRadius: '6px',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <h3>{activeSystem === 'witcher' ? 'Raça' : 'Espécie'} & Alinhamento</h3>
                                <select value={selectedRaceId} onChange={(e) => setSelectedRaceId(e.target.value)}>
                                    {availableRaces.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>

                                <select
                                    value={selectedAlignment}
                                    onChange={(e) => setSelectedAlignment(e.target.value)}
                                    style={{ marginTop: '10px' }}
                                >
                                    {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>

                                <div style={{ marginTop: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '4px', color: '#c5a059', fontWeight: 'bold' }}>
                                        Antecedente (Background):
                                    </label>
                                    <select
                                        value={selectedBackgroundId}
                                        onChange={e => setSelectedBackgroundId(e.target.value)}
                                        style={{ width: '100%', padding: '8px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
                                    >
                                        {availableBackgrounds.map(bg => (
                                            <option key={bg.id} value={bg.id}>{bg.name}</option>
                                        ))}
                                    </select>
                                    {selectedBackground && (
                                        <div style={{ fontSize: '0.85rem', color: '#bbb', marginTop: '6px', background: 'rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: '4px', borderLeft: '3px solid #c5a059' }}>
                                            <div style={{ marginBottom: '4px' }}>{selectedBackground.description}</div>
                                            <div style={{ color: '#e0c070' }}>
                                                <strong>Perícias:</strong> {selectedBackground.skillProficiencies.join(', ')}
                                                {selectedBackground.toolProficiencies && selectedBackground.toolProficiencies.length > 0 && (
                                                    <span> | <strong>Ferramentas:</strong> {selectedBackground.toolProficiencies.join(', ')}</span>
                                                )}
                                                {selectedBackground.featName && (
                                                    <span> | <strong>Talento de Origem:</strong> {selectedBackground.featName}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="info-box" style={{ marginTop: '15px' }}>
                                    {getSpeciesImage(selectedRaceId) && (
                                        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                                            <img
                                                src={getSpeciesImage(selectedRaceId)!}
                                                alt={selectedRace?.name}
                                                style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #c5a059', background: '#0a0a0f', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                            />
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.9rem', marginBottom: '10px', fontStyle: 'italic' }}>
                                        {selectedRace?.description}
                                    </div>
                                    <p><strong>Deslocamento:</strong> {selectedRace?.speed}m</p>
                                    {activeSystem === 'witcher' ? (
                                        <p><strong>Bônus de Atributos:</strong> {Object.entries(selectedRace?.bonus || {}).map(([k, v]) => `${k.toUpperCase()} +${v}`).join(', ')}</p>
                                    ) : (
                                        <p style={{ color: '#4caf50' }}><strong>Bônus de Atributos:</strong> Concedidos pelo Antecedente ({selectedBackground?.name || 'Antecedente'})</p>
                                    )}
                                    <h4 style={{ marginTop: '10px', color: '#c5a059' }}>Traços Raciais:</h4>
                                    <ul style={{ paddingLeft: '20px', margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                                        {(selectedRace?.traits || []).map((t, i) => (
                                            <li key={i} title={t.description} style={{ marginBottom: '5px' }}>
                                                <strong>{t.name}</strong>
                                                <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{t.description}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="builder-col">
                                <h3>Classe</h3>
                                <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
                                    {availableClasses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.hitDie})</option>)}
                                </select>
                                <button
                                    className="btn-small-outline"
                                    style={{ marginTop: '5px', width: '100%', fontSize: '0.8rem', padding: '4px', background: 'transparent', border: '1px solid #666', color: '#ddd', cursor: 'pointer' }}
                                    onClick={() => setViewingProgressionId(selectedClassId)}
                                >
                                    Ver Tabela de Progressão
                                </button>
                                <div className="info-box">
                                    {getClassImage(selectedClassId) && (
                                        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                                            <img
                                                src={getClassImage(selectedClassId)!}
                                                alt={selectedClass?.name}
                                                style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #c5a059', background: '#0a0a0f', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                            />
                                        </div>
                                    )}
                                    <p><strong>Dado de Vida:</strong> {selectedClass?.hitDie}</p>
                                    <p><strong>Saves:</strong> {selectedClass?.savingThrows.join(', ').toUpperCase()}</p>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '10px', fontStyle: 'italic' }}>
                                        {selectedClass?.fullDescription}
                                    </div>
                                    <h4 style={{ marginTop: '10px', color: '#c5a059' }}>Habilidades (Lv1):</h4>
                                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                        {(selectedClass?.features || []).filter(f => f.level === 1).map(f => (
                                            <li key={f.name}>
                                                <strong>{f.name}</strong>
                                                <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{f.description}</div>
                                            </li>
                                        ))}
                                    </ul>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '12px' }}>
                                        🛡️ <em>As especializações de Subclasse são desbloqueadas e escolhidas no <strong>3º Nível</strong> durante a evolução do personagem.</em>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: Attributes */}
                    {steps[currentStep].label === 'Atributos' && (
                        <div className="animate-fade">
                            <div className="builder-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>Atributos (Point Buy — 27 Pontos)</h3>
                                        <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '3px' }}>
                                            Distribua seus atributos ou clique no Conjunto Padrão oficial.
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button
                                            type="button"
                                            onClick={applyStandardArray}
                                            style={{
                                                padding: '6px 14px',
                                                background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.25), rgba(197, 160, 89, 0.1))',
                                                border: '1px solid #c5a059',
                                                borderRadius: '5px',
                                                color: '#ffd700',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}
                                            title="Distribui 15, 14, 13, 12, 10, 8 focado na sua classe"
                                        >
                                            Conjunto Padrão (15, 14, 13, 12, 10, 8)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetStats}
                                            style={{
                                                padding: '6px 10px',
                                                background: '#222',
                                                border: '1px solid #555',
                                                borderRadius: '5px',
                                                color: '#bbb',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Resetar (8)
                                        </button>
                                        <span className={remainingPoints === 0 ? 'success' : 'warn'} style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                            {remainingPoints} pts restantes
                                        </span>
                                    </div>
                                </div>

                                {/* D&D 5.5e (2024) Background Attribute Selector */}
                                {activeSystem === 'dnd55e' && selectedBackground && (
                                    <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid rgba(225, 29, 72, 0.4)', borderRadius: '6px', padding: '12px 16px', margin: '15px 0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                            <div>
                                                <strong style={{ color: '#ffd700', fontSize: '0.95rem' }}>Aumento de Atributos do Antecedente ({selectedBackground.name})</strong>
                                                <div style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '2px' }}>
                                                    Atributos elegíveis: <strong>{(selectedBackground.abilityOptions || ['str', 'dex', 'con']).map(k => k.toUpperCase()).join(', ')}</strong>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    type="button"
                                                    style={{
                                                        padding: '5px 12px',
                                                        fontSize: '0.8rem',
                                                        background: bgBonusMode === 'plus2_plus1' ? '#e11d48' : '#222',
                                                        color: '#fff',
                                                        border: '1px solid #e11d48',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontWeight: bgBonusMode === 'plus2_plus1' ? 'bold' : 'normal'
                                                    }}
                                                    onClick={() => setBgBonusMode('plus2_plus1')}
                                                >
                                                    +2 em um / +1 em outro
                                                </button>
                                                <button
                                                    type="button"
                                                    style={{
                                                        padding: '5px 12px',
                                                        fontSize: '0.8rem',
                                                        background: bgBonusMode === 'plus1_all' ? '#e11d48' : '#222',
                                                        color: '#fff',
                                                        border: '1px solid #e11d48',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontWeight: bgBonusMode === 'plus1_all' ? 'bold' : 'normal'
                                                    }}
                                                    onClick={() => setBgBonusMode('plus1_all')}
                                                >
                                                    +1 nos três (+1/+1/+1)
                                                </button>
                                            </div>
                                        </div>

                                        {bgBonusMode === 'plus2_plus1' && (
                                            <div style={{ display: 'flex', gap: '20px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                <label style={{ fontSize: '0.85rem', color: '#eee' }}>
                                                    Bônus +2 em:
                                                    <select
                                                        value={bgPlusTwo}
                                                        onChange={e => {
                                                            const val = e.target.value as keyof CharacterAttributes;
                                                            setBgPlusTwo(val);
                                                            if (val === bgPlusOne) {
                                                                const nextOne = (selectedBackground.abilityOptions || []).find(k => k !== val) || 'dex';
                                                                setBgPlusOne(nextOne);
                                                            }
                                                        }}
                                                        style={{ marginLeft: '8px', padding: '4px 10px', background: '#1c1c24', color: '#ffd700', border: '1px solid #e11d48', borderRadius: '4px', fontWeight: 'bold' }}
                                                    >
                                                        {(selectedBackground.abilityOptions || ['str', 'dex', 'con']).map(attr => (
                                                            <option key={attr} value={attr}>{attr.toUpperCase()}</option>
                                                        ))}
                                                    </select>
                                                </label>

                                                <label style={{ fontSize: '0.85rem', color: '#eee' }}>
                                                    Bônus +1 em:
                                                    <select
                                                        value={bgPlusOne}
                                                        onChange={e => {
                                                            const val = e.target.value as keyof CharacterAttributes;
                                                            setBgPlusOne(val);
                                                            if (val === bgPlusTwo) {
                                                                const nextTwo = (selectedBackground.abilityOptions || []).find(k => k !== val) || 'str';
                                                                setBgPlusTwo(nextTwo);
                                                            }
                                                        }}
                                                        style={{ marginLeft: '8px', padding: '4px 10px', background: '#1c1c24', color: '#4caf50', border: '1px solid #4caf50', borderRadius: '4px', fontWeight: 'bold' }}
                                                    >
                                                        {(selectedBackground.abilityOptions || ['str', 'dex', 'con']).filter(attr => attr !== bgPlusTwo).map(attr => (
                                                            <option key={attr} value={attr}>{attr.toUpperCase()}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="point-buy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginTop: '15px' }}>
                                    {Object.entries(baseStats).map(([key, value]) => {
                                        const attrKey = key as keyof Character['attributes'];
                                        const bonus = getAttributeBonus(attrKey);
                                        const total = value + bonus;
                                        const mod = Math.floor((total - 10) / 2);
                                        return (
                                            <div key={key} className="stat-picker">
                                                <label style={{ textTransform: 'uppercase', fontWeight: 'bold', color: '#888' }}>{key}</label>
                                                <div className="stat-controls" style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', margin: '5px 0' }}>
                                                    <button onClick={() => updateBaseStat(key, -1)} disabled={value <= 8}>-</button>
                                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{value}</span>
                                                    <button onClick={() => updateBaseStat(key, 1)} disabled={value >= 15 || remainingPoints < (calculateCost(value + 1) - calculateCost(value))}>+</button>
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                                    Base: {value} <br />
                                                    {activeSystem === 'dnd55e' ? (
                                                        <span>Antecedente: <strong style={{ color: bonus > 0 ? '#4caf50' : '#888' }}>+{bonus}</strong></span>
                                                    ) : (
                                                        <span>Raça: <strong style={{ color: bonus > 0 ? '#c5a059' : '#888' }}>+{bonus}</strong></span>
                                                    )}
                                                </div>
                                                <div style={{ background: '#222', marginTop: '5px', padding: '5px', borderRadius: '4px', border: '1px solid #444' }}>
                                                    <div style={{ fontSize: '1.2rem', color: '#fff' }}>{total}</div>
                                                    <div style={{ fontSize: '0.9rem', color: '#c5a059' }}>{mod >= 0 ? '+' : ''}{mod}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Skills */}
                    {steps[currentStep].label === 'Perícias' && (
                        <div className="animate-fade">
                            <div className="builder-row">
                                <div className="builder-col">
                                    <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px' }}>
                                        Perícias de Classe ({selectedSkills.length}/{selectedClass?.skillChoices.count || 2})
                                    </h3>

                                    {selectedBackground && selectedBackground.skillProficiencies && selectedBackground.skillProficiencies.length > 0 && (
                                        <div style={{ margin: '10px 0', padding: '10px 12px', background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.35)', borderRadius: '6px', fontSize: '0.85rem' }}>
                                            <div style={{ color: '#ffd700', fontWeight: 'bold' }}>
                                                Perícias do Antecedente ({selectedBackground.name}):
                                            </div>
                                            <div style={{ color: '#eee', marginTop: '3px' }}>
                                                {selectedBackground.skillProficiencies.join(', ')} (Já concedidas automaticamente)
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                        {selectedClass?.skillChoices.options.map(skill => {
                                            const isFromBg = (selectedBackground?.skillProficiencies as string[] || []).includes(skill);
                                            const isSelected = selectedSkills.includes(skill);
                                            return (
                                                <button
                                                    key={skill}
                                                    onClick={() => !isFromBg && toggleSkill(skill)}
                                                    onMouseEnter={() => setHoveredSkill(skill)}
                                                    onMouseLeave={() => setHoveredSkill(null)}
                                                    className={isSelected || isFromBg ? 'skill-btn selected' : 'skill-btn'}
                                                    disabled={isFromBg || (!isSelected && selectedSkills.length >= (selectedClass?.skillChoices.count || 2))}
                                                    style={{
                                                        flex: '1 0 45%',
                                                        opacity: isFromBg ? 0.75 : 1,
                                                        borderColor: isFromBg ? '#ffd700' : undefined
                                                    }}
                                                    title={isFromBg ? 'Concedida pelo Antecedente' : undefined}
                                                >
                                                    {skill} {isFromBg ? '(Antecedente)' : ''}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {selectedClassId === 'rogue' && (
                                        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255, 215, 0, 0.06)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '6px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '0.88rem' }}>
                                                    ⭐ Especialização (Expertise — Ladino Nv 1):
                                                </span>
                                                <span style={{
                                                    fontSize: '0.78rem',
                                                    fontWeight: 600,
                                                    color: selectedRogueExpertises.length === 2 ? '#4ade80' : '#f59e0b',
                                                    background: selectedRogueExpertises.length === 2 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px'
                                                }}>
                                                    {selectedRogueExpertises.length}/2 Selecionadas
                                                </span>
                                            </div>
                                            <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                                                Escolha 2 de suas perícias já proficientes. O seu Bônus de Proficiência será dobrado em testes realizados com elas.
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {Array.from(new Set([...selectedSkills, ...(selectedBackground?.skillProficiencies as string[] || [])])).map(skill => {
                                                    const isExpert = selectedRogueExpertises.includes(skill);
                                                    return (
                                                        <button
                                                            key={skill}
                                                            type="button"
                                                            onClick={() => toggleRogueExpertise(skill)}
                                                            style={{
                                                                padding: '5px 10px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.8rem',
                                                                fontWeight: isExpert ? 'bold' : 'normal',
                                                                background: isExpert ? '#ffd700' : 'rgba(0,0,0,0.4)',
                                                                color: isExpert ? '#000' : '#ffd700',
                                                                border: '1px solid #ffd700',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s ease'
                                                            }}
                                                        >
                                                            {isExpert ? '✓ ' : '+ '}{skill} {isExpert ? '(Especialista)' : ''}
                                                        </button>
                                                    );
                                                })}
                                                {selectedSkills.length === 0 && (!selectedBackground?.skillProficiencies || selectedBackground.skillProficiencies.length === 0) && (
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                                        Selecione primeiro suas perícias proficientes acima.
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="builder-col">
                                    <SkillDescriptionPreview defaultText="Passe o mouse sobre uma perícia para ver os detalhes." hoveredSkill={hoveredSkill} />
                                </div>
                            </div>
                        </div>
                    )}



                    {/* STEP 3: Proficiencies */}
                    {
                        steps[currentStep].label === 'Proficiências' && hasProficiencyChoice && (
                            <div className="animate-fade">
                                <div className="builder-section">
                                    {selectedClass?.toolChoices && (
                                        <div style={{ marginBottom: '20px' }}>
                                            <h3>Ferramentas ({selectedTools.length}/{selectedClass.toolChoices.count})</h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {selectedClass.toolChoices.options.map(tool => (
                                                    <button
                                                        key={tool}
                                                        onClick={() => toggleTool(tool)}
                                                        className={selectedTools.includes(tool) ? 'skill-btn selected' : 'skill-btn'}
                                                        disabled={!selectedTools.includes(tool) && selectedTools.length >= selectedClass.toolChoices!.count}
                                                    >
                                                        {tool}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedBackground && selectedBackground.toolProficiencies && selectedBackground.toolProficiencies.length > 0 && (
                                        <div style={{ marginBottom: '15px', padding: '10px 12px', background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.35)', borderRadius: '6px', fontSize: '0.85rem' }}>
                                            <div style={{ color: '#ffd700', fontWeight: 'bold' }}>
                                                Ferramentas do Antecedente ({selectedBackground.name}):
                                            </div>
                                            <div style={{ color: '#eee', marginTop: '3px' }}>
                                                {selectedBackground.toolProficiencies.join(', ')} (Já concedidas automaticamente)
                                            </div>
                                        </div>
                                    )}

                                    {selectedRace?.languageChoices && (
                                        <div>
                                            <h3>Idiomas ({selectedLanguages.length}/{selectedRace.languageChoices.count})</h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {availableLanguages.filter(l => !selectedRace.languages?.includes(l)).map(lang => (
                                                    <button
                                                        key={lang}
                                                        onClick={() => toggleLanguage(lang)}
                                                        className={selectedLanguages.includes(lang) ? 'skill-btn selected' : 'skill-btn'}
                                                        disabled={!selectedLanguages.includes(lang) && selectedLanguages.length >= selectedRace.languageChoices!.count}
                                                    >
                                                        {lang}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}


                    {/* STEP: Spells */}
                    {
                        steps[currentStep].label === 'Magias' && (
                            <div className="animate-fade">
                                <div className="builder-section">
                                    {isSpellCaster && (
                                        <div className="info-box" style={{ marginBottom: '16px' }}>
                                            Atributo de Conjuração: <strong>{selectedClass?.spellcastingConfig?.ability.toUpperCase()}</strong> |
                                            {(selectedClass?.spellcastingConfig?.cantripsKnown || 0) > 0 && (
                                                <span> Truques Conhecidos: <strong>{selectedCantrips.length}/{selectedClass?.spellcastingConfig?.cantripsKnown}</strong> |</span>
                                            )}
                                            <span> Magias de 1º Nível: <strong>{selectedSpells.length}/{selectedClass?.spellcastingConfig?.spellsKnown}</strong></span>
                                        </div>
                                    )}

                                    {/* Filter and Search Bar */}
                                    <div className="spell-filter-bar">
                                        <input
                                            type="text"
                                            className="spell-search-input"
                                            placeholder="Pesquisar magia por nome, efeito ou escola..."
                                            value={spellSearch}
                                            onChange={(e) => setSpellSearch(e.target.value)}
                                        />
                                        <div className="spell-school-filter-chips">
                                            {SPELL_SCHOOLS.map(sc => (
                                                <button
                                                    key={sc.id}
                                                    type="button"
                                                    className={`school-chip-btn ${spellSchoolFilter === sc.id ? 'active' : ''}`}
                                                    onClick={() => setSpellSchoolFilter(sc.id)}
                                                >
                                                    {sc.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {isSpellCaster && (
                                        <>
                                            {(selectedClass?.spellcastingConfig?.cantripsKnown || 0) > 0 && (
                                                <div style={{ marginBottom: '24px' }}>
                                                    <h4 style={{ color: '#c5a059', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                                                        Truques de Classe — Escolha ({selectedCantrips.length}/{selectedClass?.spellcastingConfig?.cantripsKnown})
                                                    </h4>
                                                    {filterSpells(availableCantrips).length === 0 ? (
                                                        <div style={{ color: '#888', fontStyle: 'italic', margin: '10px 0' }}>Nenhum truque encontrado com o filtro atual.</div>
                                                    ) : (
                                                        <div className="spells-grid">
                                                            {filterSpells(availableCantrips).map(spell => (
                                                                <div
                                                                    key={spell.id}
                                                                    className={`spell-card ${selectedCantrips.includes(spell.id) ? 'selected' : ''}`}
                                                                    onClick={() => toggleSpell(spell.id, true)}
                                                                >
                                                                    <div className="spell-card-header">
                                                                        <strong>{spell.name}</strong>
                                                                        {spell.school && <span className="spell-school-tag">{spell.school}</span>}
                                                                    </div>
                                                                    <div className="spell-meta-row">
                                                                        {spell.castingTime && <span className="spell-meta-chip">{spell.castingTime}</span>}
                                                                        {spell.range && <span className="spell-meta-chip">{spell.range}</span>}
                                                                        {spell.duration && <span className="spell-meta-chip">{spell.duration}</span>}
                                                                    </div>
                                                                    <div className="spell-desc">{spell.description}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div style={{ marginBottom: '24px' }}>
                                                <h4 style={{ color: '#c5a059', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                                                    Magias de Nível 1 — Escolha ({selectedSpells.length}/{selectedClass?.spellcastingConfig?.spellsKnown})
                                                </h4>
                                                {filterSpells(availableSpellsL1).length === 0 ? (
                                                    <div style={{ color: '#888', fontStyle: 'italic', margin: '10px 0' }}>Nenhuma magia encontrada com o filtro atual.</div>
                                                ) : (
                                                    <div className="spells-grid">
                                                        {filterSpells(availableSpellsL1).map(spell => (
                                                            <div
                                                                key={spell.id}
                                                                className={`spell-card ${selectedSpells.includes(spell.id) ? 'selected' : ''}`}
                                                                onClick={() => toggleSpell(spell.id, false)}
                                                            >
                                                                <div className="spell-card-header">
                                                                    <strong>{spell.name}</strong>
                                                                    {spell.school && <span className="spell-school-tag">{spell.school}</span>}
                                                                </div>
                                                                <div className="spell-meta-row">
                                                                    {spell.castingTime && <span className="spell-meta-chip">{spell.castingTime}</span>}
                                                                    {spell.range && <span className="spell-meta-chip">{spell.range}</span>}
                                                                    {spell.duration && <span className="spell-meta-chip">{spell.duration}</span>}
                                                                </div>
                                                                <div className="spell-desc">{spell.description}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Race Cantrips */}
                                    {selectedRace?.cantripChoices && (
                                        <div style={{ marginTop: '24px' }}>
                                            <h4 style={{ color: '#c5a059', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                                                Truques Raciais ({selectedRace.name}) — Escolha ({selectedRaceCantrips.length}/{selectedRace.cantripChoices.count})
                                            </h4>
                                            <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '6px 0 10px 0' }}>
                                                Atributo de Conjuração: <strong>{selectedRace.cantripChoices.ability.toUpperCase()}</strong>
                                            </p>
                                            {filterSpells(availableRaceCantrips).length === 0 ? (
                                                <div style={{ color: '#888', fontStyle: 'italic', margin: '10px 0' }}>Nenhum truque racial encontrado com o filtro atual.</div>
                                            ) : (
                                                <div className="spells-grid">
                                                    {filterSpells(availableRaceCantrips).map(spell => (
                                                        <div
                                                            key={spell.id}
                                                            className={`spell-card ${selectedRaceCantrips.includes(spell.id) ? 'selected' : ''}`}
                                                            onClick={() => toggleRaceCantrip(spell.id)}
                                                        >
                                                            <div className="spell-card-header">
                                                                <strong>{spell.name}</strong>
                                                                {spell.school && <span className="spell-school-tag">{spell.school}</span>}
                                                            </div>
                                                            <div className="spell-meta-row">
                                                                {spell.castingTime && <span className="spell-meta-chip">{spell.castingTime}</span>}
                                                                {spell.range && <span className="spell-meta-chip">{spell.range}</span>}
                                                                {spell.duration && <span className="spell-meta-chip">{spell.duration}</span>}
                                                            </div>
                                                            <div className="spell-desc">{spell.description}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* STEP: Feats */}
                    {
                        steps[currentStep].label === 'Talentos' && (
                            <div className="animate-fade">
                                <div className="builder-section">
                                    {selectedBackground && selectedBackground.featId && (
                                        <div style={{ marginBottom: '16px', padding: '12px 14px', background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.4)', borderRadius: '6px' }}>
                                            <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                                Talento de Origem do Antecedente ({selectedBackground.name}):
                                            </div>
                                            <div style={{ color: '#fff', fontSize: '1.05rem', marginTop: '4px', fontWeight: 'bold' }}>
                                                {selectedBackground.featName || FEATS.find(f => f.id === selectedBackground.featId)?.name}
                                            </div>
                                            <div style={{ color: '#ccc', fontSize: '0.85rem', marginTop: '2px' }}>
                                                {FEATS.find(f => f.id === selectedBackground.featId)?.description}
                                            </div>
                                        </div>
                                    )}

                                    <h3>Talento Adicional / Bônus ({selectedFeats.length}/1)</h3>
                                    <div className="spells-grid">
                                        {FEATS.filter(f => f.category === 'Origem' && f.id !== selectedBackground?.featId).map(feat => (
                                            <div
                                                key={feat.id}
                                                className={`spell-card ${selectedFeats.includes(feat.id) ? 'selected' : ''}`}
                                                onClick={() => toggleFeat(feat.id)}
                                            >
                                                <strong>{feat.name}</strong>
                                                <div className="spell-desc">{feat.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* STEP: Equipment */}
                    {steps[currentStep].label === 'Equipamentos' && (
                        <div className="animate-fade">
                            <div className="builder-section">
                                <div className="builder-row">
                                    <div className="builder-col" style={{ width: '100%' }}>
                                        <h3>Equipamento Inicial de Classe</h3>
                                        <div className="info-box">
                                            <p>Sua classe ({selectedClass?.name}) concede os seguintes itens iniciais:</p>
                                            <ul className="equipment-list" style={{ paddingLeft: '20px', fontSize: '1.1rem', marginTop: '15px' }}>
                                                {(selectedClass?.startingEquipment || []).map((item, idx) => (
                                                    <li key={`class-${idx}`} style={{ marginBottom: '8px' }}>
                                                        <span style={{ color: '#fff' }}>{item}</span>
                                                    </li>
                                                ))}
                                                {(!selectedClass?.startingEquipment || selectedClass?.startingEquipment.length === 0) && (
                                                    <li style={{ color: '#aaa', fontStyle: 'italic' }}>Nenhum equipamento listado.</li>
                                                )}
                                            </ul>

                                            {/* Equipment Choices */}
                                            {selectedClass?.equipmentChoices && selectedClass.equipmentChoices.map((choice, idx) => (
                                                <div key={`choice-${idx}`} style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                                                    <h4 style={{ color: '#c5a059', marginBottom: '10px' }}>{choice.label}</h4>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                        {choice.options.map((option, optIdx) => {
                                                            const isSelected = (selectedEquipmentChoices[idx] ?? 0) === optIdx; // Default to 0
                                                            return (
                                                                <label key={`opt-${optIdx}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '5px', background: isSelected ? 'rgba(255,255,255,0.1)' : 'transparent', borderRadius: '4px' }}>
                                                                    <input
                                                                        type="radio"
                                                                        name={`equip-choice-${idx}`}
                                                                        checked={isSelected}
                                                                        onChange={() => setSelectedEquipmentChoices(prev => ({ ...prev, [idx]: optIdx }))}
                                                                    />
                                                                    <span style={{ color: isSelected ? '#fff' : '#aaa' }}>{option.label}</span>
                                                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>({option.items.join(', ')})</span>
                                                                </label>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}

                                            {selectedBackground && selectedBackground.equipment && selectedBackground.equipment.length > 0 && (
                                                <div style={{ marginTop: '20px', padding: '12px 14px', background: 'rgba(197, 160, 89, 0.1)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '6px' }}>
                                                    <h4 style={{ color: '#ffd700', marginBottom: '8px' }}>
                                                        Equipamento do Antecedente ({selectedBackground.name})
                                                    </h4>
                                                    <ul style={{ paddingLeft: '20px', fontSize: '0.95rem', margin: 0, color: '#eee' }}>
                                                        {selectedBackground.equipment.map((eq, i) => (
                                                            <li key={i} style={{ marginBottom: '4px' }}>{eq}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP: Life */}
                    {
                        steps[currentStep].label === 'Vida' && (
                            <div className="builder-row animate-fade">
                                <div className="builder-col" style={{ width: '100%', textAlign: 'center' }}>
                                    <h3>Pontos de Vida (Nível 1)</h3>
                                    <div className="hp-roll-container" style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                                        <p style={{ fontSize: '1.2rem' }}>
                                            Regra: <strong style={{ color: '#c5a059' }}>Vida Máxima</strong> (Dado Completo + CON + Talentos)
                                        </p>
                                        <p>
                                            Dado de Vida: <strong>{selectedClass?.hitDie}</strong> (Max: {parseInt(selectedClass?.hitDie.replace('d', '') || '10')})
                                        </p>
                                        <p>Modificador de Constituição: <strong>{calculateModifier(baseStats.con + getAttributeBonus('con')) >= 0 ? '+' : ''}{calculateModifier(baseStats.con + getAttributeBonus('con'))}</strong></p>
                                        {(() => {
                                            const bgFeat = selectedBackground?.featId ? FEATS.find(f => f.id === selectedBackground.featId) : null;
                                            const allFeatsForHp = [...FEATS.filter(f => selectedFeats.includes(f.id)), ...(bgFeat ? [bgFeat] : [])];
                                            const featHp = allFeatsForHp.reduce((acc, f) => {
                                                const hpEffect = f.effects?.find(e => e.type === 'hp_per_level');
                                                return acc + (hpEffect ? hpEffect.value : 0);
                                            }, 0);
                                            const totalBonus = featHp;
                                            const dieMax = parseInt(selectedClass?.hitDie.replace('d', '') || '10');
                                            const conMod = calculateModifier(baseStats.con + getAttributeBonus('con'));
                                            const totalHp = Math.max(1, dieMax + conMod) + totalBonus;

                                            return (
                                                <>
                                                    {totalBonus > 0 && (
                                                        <p>
                                                            Bônus de Talento: <strong style={{ color: '#4caf50' }}>+{totalBonus}</strong>
                                                            {bgFeat?.id === 'tough' && <span style={{ fontSize: '0.85rem', color: '#ffd700' }}> (Vigoroso do Antecedente)</span>}
                                                        </p>
                                                    )}
                                                    <div className="roll-result" style={{ marginTop: '20px' }}>
                                                        <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>
                                                            Vida Total: <strong style={{ color: '#4caf50', fontSize: '2.5rem' }}>{totalHp}</strong>
                                                        </p>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div >

                <div className="builder-actions">
                    {currentStep > 0 && <button className="btn-cancel" onClick={() => setCurrentStep(prev => prev - 1)}>Voltar</button>}
                    {currentStep < steps.length - 1
                        ? <button className="btn-apply" onClick={() => setCurrentStep(prev => prev + 1)}>Próximo</button>
                        : <button
                            className="btn-apply"
                            onClick={handleApply}
                            disabled={
                                remainingPoints !== 0 ||
                                selectedSkills.length < (selectedClass?.skillChoices.count || 2) ||
                                (selectedClassId === 'rogue' && selectedRogueExpertises.length < 2) ||
                                (!!selectedClass?.toolChoices && selectedTools.length < selectedClass.toolChoices.count) ||
                                (!!selectedRace?.languageChoices && selectedLanguages.length < selectedRace.languageChoices.count) ||
                                (!!selectedRace?.cantripChoices && selectedRaceCantrips.length < selectedRace.cantripChoices.count)
                            }
                            style={{
                                opacity: (
                                    remainingPoints !== 0 ||
                                    selectedSkills.length < (selectedClass?.skillChoices.count || 2) ||
                                    (selectedClassId === 'rogue' && selectedRogueExpertises.length < 2) ||
                                    (!!selectedClass?.toolChoices && selectedTools.length < selectedClass.toolChoices.count) ||
                                    (!!selectedRace?.languageChoices && selectedLanguages.length < selectedRace.languageChoices.count) ||
                                    (!!selectedRace?.cantripChoices && selectedRaceCantrips.length < selectedRace.cantripChoices.count)
                                ) ? 0.5 : 1,
                                cursor: (
                                    remainingPoints !== 0 ||
                                    selectedSkills.length < (selectedClass?.skillChoices.count || 2) ||
                                    (selectedClassId === 'rogue' && selectedRogueExpertises.length < 2) ||
                                    (!!selectedClass?.toolChoices && selectedTools.length < selectedClass.toolChoices.count) ||
                                    (!!selectedRace?.languageChoices && selectedLanguages.length < selectedRace.languageChoices.count) ||
                                    (!!selectedRace?.cantripChoices && selectedRaceCantrips.length < selectedRace.cantripChoices.count)
                                ) ? 'not-allowed' : 'pointer'
                            }}
                            title={remainingPoints !== 0 ? `Distribua todos os 27 pontos (${remainingPoints} restantes)!` : "Tudo pronto!"}
                        >
                            {effectiveStartingLevel > 1 ? `Concluir e Evoluir (Nível ${effectiveStartingLevel})` : 'Concluir Personagem'} {remainingPoints !== 0 ? `(${remainingPoints} pts restantes)` : ''}
                        </button>
                    }
                </div>
            </div >
            {viewingProgressionId && (
                <ClassProgression
                    classData={CLASSES.find(c => c.id === viewingProgressionId)!}
                    characterLevel={character.level || 1}
                    onClose={() => setViewingProgressionId(null)}
                />
            )}
        </div >,
        document.body
    );
};
