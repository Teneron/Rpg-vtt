import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { CLASSES } from './data/classes';
import { RACES, type SubraceData } from './data/races';
import { BACKGROUNDS } from './data/backgrounds';
import { SPELLS } from './data/spells';
import { FEATS } from './data/feats';
import {
    DND_LANGUAGES,
    WITCHER_LANGUAGES,
    DND_COMMON_LANGUAGES,
    MUSICAL_INSTRUMENTS,
    ARTISAN_TOOLS
} from './data/rules';
import { ITEMS } from './data/items';

import { SkillDescriptionPreview } from './SkillDescriptionPreview';
import { X, Sparkles, Wrench } from 'lucide-react';
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

    // =========================================================================
    // SUBESPÉCIES / LINHAGENS
    // =========================================================================
    const [selectedSubraceId, setSelectedSubraceId] = useState<string>('');
    const [selectedCharacterSize, setSelectedCharacterSize] = useState<'Médio' | 'Pequeno'>('Médio');
    const [selectedDwarfTool, setSelectedDwarfTool] = useState<string>('Ferramentas de Ferreiro');
    const [selectedHumanBonusFeat, setSelectedHumanBonusFeat] = useState<string>('alert');

    // =========================================================================
    // ATRIBUTOS DIRETOS (SEM POINT BUY, SEM 4d6)
    // =========================================================================
    const [baseStats, setBaseStats] = useState<Record<string, number>>({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });

    // =========================================================================
    // ESCOLHAS INTERNAS DE TALENTOS DE ORIGEM
    // =========================================================================
    // Iniciado em Magia (Magic Initiate)
    const [magicInitiateClass, setMagicInitiateClass] = useState<'cleric' | 'druid' | 'wizard'>('wizard');
    const [magicInitiateAbility, setMagicInitiateAbility] = useState<'int' | 'wis' | 'cha'>('int');
    const [magicInitiateCantrips, setMagicInitiateCantrips] = useState<string[]>([]);
    const [magicInitiateSpell, setMagicInitiateSpell] = useState<string>('');

    // Habilidoso (Skilled)
    const [skilledChoices, setSkilledChoices] = useState<string[]>([]);

    // Músico (Musician)
    const [musicianInstruments, setMusicianInstruments] = useState<string[]>([]);

    // Artífice (Crafter)
    const [crafterTools, setCrafterTools] = useState<string[]>([]);

    // =========================================================================
    // IDIOMAS COMUNS (COMUM + 2 ADICIONAIS)
    // =========================================================================
    const [selectedCommonLanguages, setSelectedCommonLanguages] = useState<string[]>([]);

    // Bônus de Atributos do Antecedente (+2/+1 ou +1/+1/+1)
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

    // Keep Subrace in sync with selected Race
    React.useEffect(() => {
        const race = RACES.find(r => r.id === selectedRaceId);
        if (race?.subraces && race.subraces.length > 0) {
            setSelectedSubraceId(race.subraces[0].id);
        } else {
            setSelectedSubraceId('');
        }
        if (race?.allowSizeChoice) {
            setSelectedCharacterSize(race.size || 'Médio');
        } else if (race?.size) {
            setSelectedCharacterSize(race.size);
        }
        if (race?.toolChoices && race.toolChoices.options.length > 0) {
            setSelectedDwarfTool(race.toolChoices.options[0]);
        }
    }, [selectedRaceId]);

    // Derived Race / Class / Background data
    const selectedClass = React.useMemo(() => CLASSES.find(c => c.id === selectedClassId), [selectedClassId]);
    const selectedRace = React.useMemo(() => RACES.find(r => r.id === selectedRaceId), [selectedRaceId]);
    const selectedBackground = React.useMemo(() => BACKGROUNDS.find(b => b.id === selectedBackgroundId), [selectedBackgroundId]);
    const isSpellCaster = React.useMemo(() => !!selectedClass?.spellcastingConfig, [selectedClass]);

    const selectedSubrace: SubraceData | null = React.useMemo(() => {
        if (!selectedRace?.subraces) return null;
        return selectedRace.subraces.find(s => s.id === selectedSubraceId) || selectedRace.subraces[0] || null;
    }, [selectedRace, selectedSubraceId]);

    const [viewingProgressionId, setViewingProgressionId] = useState<string | null>(null);

    // Selection State
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
    const [selectedCantrips, setSelectedCantrips] = useState<string[]>([]);
    const [selectedRaceCantrips, setSelectedRaceCantrips] = useState<string[]>([]);
    const [selectedFeats, setSelectedFeats] = useState<string[]>([]);
    const [selectedEquipmentChoices, setSelectedEquipmentChoices] = useState<Record<number, number>>({});
    const [selectedRogueExpertises, setSelectedRogueExpertises] = useState<string[]>([]);

    const [spellSearch, setSpellSearch] = useState('');
    const [spellSchoolFilter, setSpellSchoolFilter] = useState('all');

    // Feat detection helper
    const hasFeatActive = React.useCallback((featId: string) => {
        if (selectedBackground?.featId === featId) return true;
        if (selectedRace?.originFeatChoice && selectedHumanBonusFeat === featId) return true;
        if (selectedFeats.includes(featId)) return true;
        return false;
    }, [selectedBackground, selectedRace, selectedHumanBonusFeat, selectedFeats]);

    const hasMagicInitiate = hasFeatActive('magic_initiate');
    const hasSkilled = hasFeatActive('skilled');
    const hasMusician = hasFeatActive('musician');
    const hasCrafter = hasFeatActive('crafter');

    // Auto-configure Magic Initiate defaults when background changes
    React.useEffect(() => {
        if (selectedBackgroundId === 'acolyte') {
            setMagicInitiateClass('cleric');
            setMagicInitiateAbility('wis');
        } else if (selectedBackgroundId === 'guide') {
            setMagicInitiateClass('druid');
            setMagicInitiateAbility('wis');
        } else if (selectedBackgroundId === 'sage') {
            setMagicInitiateClass('wizard');
            setMagicInitiateAbility('int');
        }
    }, [selectedBackgroundId]);

    // Track previous class to reset selection if class changes
    const prevClassId = React.useRef(initialClassId);

    React.useEffect(() => {
        if (prevClassId.current !== selectedClassId) {
            setSelectedSkills([]);
            setSelectedSpells([]);
            setSelectedCantrips([]);
            setSelectedFeats([]);
            setSelectedEquipmentChoices({});
            setSelectedRogueExpertises([]);
            setSpellSearch('');
            setSpellSchoolFilter('all');
            onUpdate({ ...character, hpRolled: undefined });
            prevClassId.current = selectedClassId;
        }
    }, [selectedClassId, character, onUpdate]);

    const getAttributeBonus = React.useCallback((attrKey: string): number => {
        if (activeSystem === 'witcher') {
            const race = RACES.find(r => r.id === selectedRaceId);
            return race?.bonus ? ((race.bonus as any)[attrKey] || 0) : 0;
        }
        // Bonuses come strictly from Background
        const bg = BACKGROUNDS.find(b => b.id === selectedBackgroundId);
        const options = bg?.abilityOptions || [];
        if (!options.includes(attrKey as any)) return 0;

        if (bgBonusMode === 'plus2_plus1') {
            if (attrKey === bgPlusTwo) return 2;
            if (attrKey === bgPlusOne) return 1;
            return 0;
        } else {
            return 1;
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

    // Combine race and subrace cantrip requirements
    const effectiveRaceCantripChoices = React.useMemo(() => {
        if (selectedSubrace?.cantripChoices) return selectedSubrace.cantripChoices;
        if (selectedRace?.cantripChoices) return selectedRace.cantripChoices;
        return null;
    }, [selectedRace, selectedSubrace]);

    // Auto-select race/subrace cantrip if options are fixed
    React.useEffect(() => {
        if (effectiveRaceCantripChoices?.options && effectiveRaceCantripChoices.options.length > 0) {
            setSelectedRaceCantrips(effectiveRaceCantripChoices.options);
        } else {
            setSelectedRaceCantrips([]);
        }
    }, [selectedRaceId, selectedSubraceId, effectiveRaceCantripChoices]);

    // Optimize Spell Filtering
    const availableCantrips = React.useMemo(() =>
        isSpellCaster ? SPELLS.filter(s => s.level === 0 && s.classes.includes(selectedClassId)) : []
        , [isSpellCaster, selectedClassId]);

    const availableRaceCantrips = React.useMemo(() => {
        if (!effectiveRaceCantripChoices) return [];
        if (effectiveRaceCantripChoices.options && effectiveRaceCantripChoices.options.length > 0) {
            return SPELLS.filter(s => s.level === 0 && effectiveRaceCantripChoices.options!.includes(s.id));
        }
        if (effectiveRaceCantripChoices.classList) {
            return SPELLS.filter(s => s.level === 0 && s.classes.includes(effectiveRaceCantripChoices.classList!));
        }
        return [];
    }, [effectiveRaceCantripChoices]);

    const availableSpellsL1 = React.useMemo(() =>
        isSpellCaster ? SPELLS.filter(s => s.level === 1 && s.classes.includes(selectedClassId)) : []
        , [isSpellCaster, selectedClassId]);

    // Magic Initiate Spells (Cleric, Druid or Wizard)
    const availableMagicInitiateCantrips = React.useMemo(() => {
        return SPELLS.filter(s => s.level === 0 && s.classes.includes(magicInitiateClass));
    }, [magicInitiateClass]);

    const availableMagicInitiateSpellsL1 = React.useMemo(() => {
        return SPELLS.filter(s => s.level === 1 && s.classes.includes(magicInitiateClass));
    }, [magicInitiateClass]);

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

    // Total Skill Limit (Class + Human Versatile)
    const baseSkillLimit = (selectedClass?.skillChoices.count || 2) + (selectedRace?.skillChoices?.count || 0);

    const toggleSkill = React.useCallback((skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(prev => prev.filter(s => s !== skill));
            setSelectedRogueExpertises(prev => prev.filter(s => s !== skill));
        } else {
            if (selectedSkills.length < baseSkillLimit) {
                setSelectedSkills(prev => [...prev, skill]);
            }
        }
    }, [selectedSkills, baseSkillLimit]);

    const toggleSkilledChoice = React.useCallback((skill: string) => {
        if (skilledChoices.includes(skill)) {
            setSkilledChoices(prev => prev.filter(s => s !== skill));
        } else {
            if (skilledChoices.length < 3) {
                setSkilledChoices(prev => [...prev, skill]);
            }
        }
    }, [skilledChoices]);

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
    }, [selectedClass]);

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

    // Common Languages toggle (2 choices)
    const toggleCommonLanguage = React.useCallback((lang: string) => {
        if (selectedCommonLanguages.includes(lang)) {
            setSelectedCommonLanguages(prev => prev.filter(l => l !== lang));
        } else {
            if (selectedCommonLanguages.length < 2) {
                setSelectedCommonLanguages(prev => [...prev, lang]);
            }
        }
    }, [selectedCommonLanguages]);

    const toggleRaceCantrip = React.useCallback((spellId: string) => {
        const limit = effectiveRaceCantripChoices?.count || 0;
        if (selectedRaceCantrips.includes(spellId)) {
            setSelectedRaceCantrips(prev => prev.filter(id => id !== spellId));
        } else {
            if (selectedRaceCantrips.length < limit) {
                setSelectedRaceCantrips(prev => [...prev, spellId]);
            }
        }
    }, [selectedRaceCantrips, effectiveRaceCantripChoices]);

    const toggleMagicInitiateCantrip = React.useCallback((spellId: string) => {
        if (magicInitiateCantrips.includes(spellId)) {
            setMagicInitiateCantrips(prev => prev.filter(id => id !== spellId));
        } else {
            if (magicInitiateCantrips.length < 2) {
                setMagicInitiateCantrips(prev => [...prev, spellId]);
            }
        }
    }, [magicInitiateCantrips]);

    const toggleMusicianInstrument = React.useCallback((instrument: string) => {
        if (musicianInstruments.includes(instrument)) {
            setMusicianInstruments(prev => prev.filter(i => i !== instrument));
        } else {
            if (musicianInstruments.length < 3) {
                setMusicianInstruments(prev => [...prev, instrument]);
            }
        }
    }, [musicianInstruments]);

    const toggleCrafterTool = React.useCallback((tool: string) => {
        if (crafterTools.includes(tool)) {
            setCrafterTools(prev => prev.filter(t => t !== tool));
        } else {
            if (crafterTools.length < 3) {
                setCrafterTools(prev => [...prev, tool]);
            }
        }
    }, [crafterTools]);

    const toggleFeat = React.useCallback((featId: string) => {
        if (selectedFeats.includes(featId)) {
            setSelectedFeats(prev => prev.filter(f => f !== featId));
        } else {
            if (selectedFeats.length < 1) {
                setSelectedFeats(prev => [...prev, featId]);
            }
        }
    }, [selectedFeats]);

    // Simple, direct stat modifier
    const updateBaseStat = React.useCallback((attr: string, delta: number) => {
        setBaseStats(prev => {
            const current = prev[attr] ?? 10;
            const next = Math.max(1, Math.min(20, current + delta));
            return { ...prev, [attr]: next };
        });
    }, []);

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
        setBaseStats({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
    }, []);

    // Navigation Steps
    const [currentStep, setCurrentStep] = useState(0);

    const hasProficiencyChoice = (
        activeSystem === 'dnd55e' ||
        !!selectedClass?.toolChoices ||
        !!selectedRace?.languageChoices ||
        hasMusician ||
        hasCrafter
    );
    const hasSpells = isSpellCaster || !!effectiveRaceCantripChoices || hasMagicInitiate;

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

    // Validation checks for final apply (No point-buy restrictions)
    const isMagicInitiateValid = !hasMagicInitiate || (magicInitiateCantrips.length === 2 && !!magicInitiateSpell);
    const isSkilledValid = !hasSkilled || skilledChoices.length === 3;
    const isMusicianValid = !hasMusician || musicianInstruments.length === 3;
    const isCrafterValid = !hasCrafter || crafterTools.length === 3;
    const isLanguagesValid = activeSystem !== 'dnd55e' || selectedCommonLanguages.length === 2;
    const isSkillsValid = selectedSkills.length >= baseSkillLimit;
    const isRaceCantripsValid = !effectiveRaceCantripChoices || selectedRaceCantrips.length >= effectiveRaceCantripChoices.count;

    const isFormValid = (
        isSkillsValid &&
        (selectedClassId !== 'rogue' || selectedRogueExpertises.length === 2) &&
        (!selectedClass?.toolChoices || selectedTools.length >= selectedClass.toolChoices.count) &&
        isRaceCantripsValid &&
        isMagicInitiateValid &&
        isSkilledValid &&
        isMusicianValid &&
        isCrafterValid &&
        isLanguagesValid
    );

    // Finalize Character
    const handleApply = React.useCallback(async () => {
        if (!selectedRace || !selectedClass) return;

        let nextChar = { ...character };

        // 0. Character Name & Background
        nextChar.name = charName.trim() || character.name || 'Novo Personagem';
        if (selectedBackground) {
            nextChar.background = selectedBackground.name;
        }

        // 1. Race & Origin & Subrace
        nextChar.race = selectedRace.name;
        if (selectedSubrace) {
            nextChar.subrace = selectedSubrace.name;
            nextChar.speed = selectedSubrace.speed || selectedRace.speed;
        } else {
            nextChar.subrace = undefined;
            nextChar.speed = selectedRace.speed;
        }

        // Size
        nextChar.size = selectedCharacterSize || selectedRace.size || 'Médio';

        // Darkvision check
        const hasDarkvision = selectedRace.traits?.some(t => /visão no escuro|darkvision/i.test(t.name) || /visão no escuro|darkvision/i.test(t.description)) || !!selectedSubrace?.visionRange;
        nextChar.visionRange = selectedSubrace?.visionRange || (hasDarkvision ? 18 : 0);

        nextChar.alignment = selectedAlignment;

        // Attributes
        (Object.keys(nextChar.attributes) as Array<keyof Character['attributes']>).forEach(attrKey => {
            const base = baseStats[attrKey] || 10;
            const bonus = getAttributeBonus(attrKey);
            const total = base + bonus;
            nextChar.attributes[attrKey].value = total;
            nextChar.attributes[attrKey].modifier = Math.floor((total - 10) / 2);
        });

        nextChar.system = activeSystem;

        // 2. Class - Subclasses are strictly chosen at Level 3
        nextChar.class = selectedClass.name;
        nextChar.hitDice.dieFace = selectedClass.hitDie;
        nextChar.subclass = undefined;

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

        // Saving throws
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

        // Features (Level 1 base)
        const classFeatures: ClassFeature[] = selectedClass.features
            .filter(f => f.level === 1)
            .map(f => ({ ...f, type: f.type || 'passive' } as ClassFeature));

        const raceFeatures: ClassFeature[] = (selectedRace.traits || []).map(t => ({
            name: t.name,
            description: t.description,
            level: 1,
            type: 'passive'
        }));

        const subraceFeatures: ClassFeature[] = (selectedSubrace?.traits || []).map(t => ({
            name: t.name,
            description: t.description,
            level: 1,
            type: 'passive'
        }));

        nextChar.features = [...raceFeatures, ...subraceFeatures, ...classFeatures];

        // Skills (including Background + Class + Human Versatile + Skilled feat)
        const bgSkills: string[] = selectedBackground ? (selectedBackground.skillProficiencies as string[]) : [];
        const finalSkillNames = Array.from(new Set([...selectedSkills, ...bgSkills, ...skilledChoices]));

        nextChar = regenerateCharacterStats(nextChar);
        nextChar.skills = nextChar.skills.map(s => ({
            ...s,
            proficient: finalSkillNames.includes(s.name),
            expertise: selectedClassId === 'rogue' && selectedRogueExpertises.includes(s.name)
        }));
        nextChar = regenerateCharacterStats(nextChar);

        // Tool Proficiencies (including Class + Background + Dwarf tool + Crafter + Musician)
        const classTools = selectedTools;
        const bgTools: string[] = selectedBackground?.toolProficiencies || [];
        const extraTools: string[] = [];

        if (selectedRace?.toolChoices && selectedDwarfTool) {
            extraTools.push(selectedDwarfTool);
        }
        if (hasCrafter && crafterTools.length > 0) {
            extraTools.push(...crafterTools);
        }
        if (hasMusician && musicianInstruments.length > 0) {
            extraTools.push(...musicianInstruments);
        }

        nextChar.proficiencies = [];
        if (selectedClass.armorProficiency) nextChar.proficiencies.push(...selectedClass.armorProficiency.map(p => `Armadura (${p})`));
        if (selectedClass.weaponProficiency) nextChar.proficiencies.push(...selectedClass.weaponProficiency.map(p => `Armas (${p})`));
        if (selectedClass.toolProficiencies) nextChar.proficiencies.push(...selectedClass.toolProficiencies);
        if (bgTools.length > 0) nextChar.proficiencies.push(...bgTools);
        nextChar.proficiencies.push(...classTools, ...extraTools);
        nextChar.proficiencies = Array.from(new Set(nextChar.proficiencies));

        // Languages
        const raceLangs = selectedRace.languages || ['Comum'];
        nextChar.languages = Array.from(new Set([
            ...raceLangs,
            ...selectedCommonLanguages,
            ...selectedLanguages
        ]));

        // Background starting gold & equipment
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

            const baseDefId = def ? def.id : id;
            const uniqueId = `${baseDefId}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

            bgEquip.push({
                id: uniqueId,
                defId: baseDefId,
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

        // Class Equipment parsing
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

                const baseClassDefId = def ? def.id : id;
                const uniqueClassId = `${baseClassDefId}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

                classEquip.push({
                    id: uniqueClassId,
                    defId: baseClassDefId,
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

        // Background feature
        if (selectedBackground?.feature) {
            nextChar.features.push({
                name: selectedBackground.feature.name,
                description: selectedBackground.feature.description,
                level: 1,
                type: 'passive'
            });
        }

        // Spells & Race Cantrips & Magic Initiate
        const chosenCantrips = SPELLS.filter(s => selectedCantrips.includes(s.id));
        const chosenSpells = SPELLS.filter(s => selectedSpells.includes(s.id));
        const chosenRaceCantrips = SPELLS.filter(s => selectedRaceCantrips.includes(s.id));

        const miCantrips = SPELLS.filter(s => magicInitiateCantrips.includes(s.id));
        const miSpell = SPELLS.filter(s => s.id === magicInitiateSpell);

        nextChar.spells = [
            ...chosenCantrips,
            ...chosenSpells,
            ...chosenRaceCantrips,
            ...miCantrips,
            ...miSpell
        ];

        // Feats (Background feat + Human bonus feat + Custom chosen feat)
        const chosenFeats = FEATS.filter(f => selectedFeats.includes(f.id));
        if (selectedBackground?.featId) {
            const originFeat = FEATS.find(f => f.id === selectedBackground.featId);
            if (originFeat && !chosenFeats.some(f => f.id === originFeat.id)) {
                chosenFeats.unshift(originFeat);
            }
        }
        if (selectedRace?.originFeatChoice && selectedHumanBonusFeat) {
            const humanFeat = FEATS.find(f => f.id === selectedHumanBonusFeat);
            if (humanFeat && !chosenFeats.some(f => f.id === humanFeat.id)) {
                chosenFeats.push(humanFeat);
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
                        nextChar.hp.current = nextChar.hp.max;
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

        // Initialize Class Resources
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
    }, [
        character,
        charName,
        selectedClass,
        selectedRace,
        selectedSubrace,
        selectedCharacterSize,
        selectedDwarfTool,
        selectedHumanBonusFeat,
        selectedBackground,
        baseStats,
        selectedSkills,
        skilledChoices,
        selectedRogueExpertises,
        isSpellCaster,
        selectedCantrips,
        selectedSpells,
        selectedRaceCantrips,
        magicInitiateCantrips,
        magicInitiateSpell,
        hasCrafter,
        crafterTools,
        hasMusician,
        musicianInstruments,
        selectedAlignment,
        selectedTools,
        selectedLanguages,
        selectedCommonLanguages,
        selectedFeats,
        selectedEquipmentChoices,
        getAttributeBonus,
        activeSystem,
        effectiveStartingLevel,
        onUpdate,
        onClose
    ]);

    // Render using Portal
    return ReactDOM.createPortal(
        <div className="char-builder-modal">
            <div className="builder-content">
                <div className="builder-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h2>{activeSystem === 'witcher' ? 'Criação de Personagem — The Witcher' : 'Criação de Personagem'}</h2>
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

                                <h3>{activeSystem === 'witcher' ? 'Raça' : 'Espécie'}</h3>
                                <select value={selectedRaceId} onChange={(e) => setSelectedRaceId(e.target.value)}>
                                    {availableRaces.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>

                                {/* SUBESPÉCIES / LINHAGENS */}
                                {selectedRace?.subraces && selectedRace.subraces.length > 0 && (
                                    <div style={{ marginTop: '12px' }}>
                                        <label style={{ display: 'block', marginBottom: '4px', color: '#ffd700', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                            {selectedRace.subraceLabel || 'Linhagem / Sub-espécie'}:
                                        </label>
                                        <select
                                            value={selectedSubraceId}
                                            onChange={(e) => setSelectedSubraceId(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                background: '#1c1c28',
                                                color: '#fff',
                                                border: '1px solid #ffd700',
                                                borderRadius: '4px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {selectedRace.subraces.map(sub => (
                                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* ESCOLHA DE TAMANHO (MÉDIO / PEQUENO) */}
                                {selectedRace?.allowSizeChoice && (
                                    <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '4px', border: '1px solid #444' }}>
                                        <label style={{ display: 'block', marginBottom: '6px', color: '#c5a059', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                            Tamanho:
                                        </label>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            {(['Médio', 'Pequeno'] as const).map(sz => (
                                                <label key={sz} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ddd', cursor: 'pointer', fontSize: '0.88rem' }}>
                                                    <input
                                                        type="radio"
                                                        name="charSizeChoice"
                                                        checked={selectedCharacterSize === sz}
                                                        onChange={() => setSelectedCharacterSize(sz)}
                                                    />
                                                    {sz}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ANÃO - ESCOLHA DE FERRAMENTA ARTESANAL */}
                                {selectedRace?.toolChoices && (
                                    <div style={{ marginTop: '12px', background: 'rgba(255, 215, 0, 0.08)', padding: '8px 10px', borderRadius: '4px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                                        <label style={{ display: 'block', marginBottom: '4px', color: '#ffd700', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                            Ofício Anão (1 Ferramenta de Artesão):
                                        </label>
                                        <select
                                            value={selectedDwarfTool}
                                            onChange={(e) => setSelectedDwarfTool(e.target.value)}
                                            style={{ width: '100%', padding: '6px', background: '#1c1c24', color: '#fff', border: '1px solid #666', borderRadius: '4px' }}
                                        >
                                            {selectedRace.toolChoices.options.map(tool => (
                                                <option key={tool} value={tool}>{tool}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* HUMANO - TALENTO DE ORIGEM EXTRA */}
                                {selectedRace?.originFeatChoice && (
                                    <div style={{ marginTop: '12px', background: 'rgba(59, 130, 246, 0.1)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                                        <label style={{ display: 'block', marginBottom: '4px', color: '#60a5fa', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                            ⭐ Traço Versátil — Talento de Origem Extra (Humano):
                                        </label>
                                        <select
                                            value={selectedHumanBonusFeat}
                                            onChange={(e) => setSelectedHumanBonusFeat(e.target.value)}
                                            style={{ width: '100%', padding: '6px 8px', background: '#131e33', color: '#93c5fd', border: '1px solid #3b82f6', borderRadius: '4px', fontWeight: '600' }}
                                        >
                                            {FEATS.filter(f => f.category === 'Origem' && f.id !== selectedBackground?.featId).map(feat => (
                                                <option key={feat.id} value={feat.id}>{feat.name}</option>
                                            ))}
                                        </select>
                                        <div style={{ fontSize: '0.78rem', color: '#93c5fd', marginTop: '4px' }}>
                                            {FEATS.find(f => f.id === selectedHumanBonusFeat)?.description}
                                        </div>
                                    </div>
                                )}

                                {/* TRAÇOS RACIAIS E DETALHES COLOCADOS JUNTOS DA DESCRIÇÃO */}
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
                                    <div style={{ fontSize: '0.9rem', marginBottom: '10px', fontStyle: 'italic', color: '#e2e8f0', lineHeight: '1.4' }}>
                                        {selectedRace?.description}
                                    </div>

                                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '10px', fontSize: '0.88rem' }}>
                                        <div><strong>Deslocamento:</strong> {selectedSubrace?.speed || selectedRace?.speed}m</div>
                                        <div><strong>Visão:</strong> {selectedSubrace?.visionRange ? `${selectedSubrace.visionRange}m no Escuro` : (selectedRace?.traits?.some(t => /visão no escuro|darkvision/i.test(t.name)) ? '18m no Escuro' : 'Normal')}</div>
                                        {selectedSubrace?.damageResistance && (
                                            <div style={{ color: '#4ade80' }}><strong>Resistência:</strong> {selectedSubrace.damageResistance}</div>
                                        )}
                                    </div>

                                    {/* Subrace Specific Details Card */}
                                    {selectedSubrace && (
                                        <div style={{ marginBottom: '10px', padding: '8px 10px', background: 'rgba(255, 215, 0, 0.08)', borderRadius: '6px', border: '1px solid rgba(255, 215, 0, 0.25)' }}>
                                            <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '0.88rem' }}>
                                                ✨ {selectedSubrace.name}
                                            </div>
                                            <div style={{ fontSize: '0.82rem', color: '#ddd', marginTop: '2px' }}>
                                                {selectedSubrace.description}
                                            </div>
                                            {selectedSubrace.breathWeapon && (
                                                <div style={{ marginTop: '3px', fontSize: '0.8rem', color: '#f87171' }}>
                                                    🔥 Sopro: {selectedSubrace.breathWeapon.area} ({selectedSubrace.breathWeapon.damageType})
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Traços Raciais com nome e descrição lado a lado */}
                                    <h4 style={{ margin: '12px 0 8px 0', color: '#c5a059', fontSize: '0.95rem' }}>Traços Raciais:</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                                        {(selectedRace?.traits || []).map((t, i) => (
                                            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #c5a059' }}>
                                                <strong style={{ color: '#ffd700', fontSize: '0.88rem' }}>{t.name}</strong>
                                                <div style={{ fontSize: '0.82rem', color: '#ccc', marginTop: '2px', lineHeight: '1.35' }}>{t.description}</div>
                                            </div>
                                        ))}
                                        {(selectedSubrace?.traits || []).map((st, i) => (
                                            <div key={`sub-${i}`} style={{ background: 'rgba(96, 165, 250, 0.08)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #60a5fa' }}>
                                                <strong style={{ color: '#93c5fd', fontSize: '0.88rem' }}>{st.name} ({selectedSubrace?.name})</strong>
                                                <div style={{ fontSize: '0.82rem', color: '#ddd', marginTop: '2px', lineHeight: '1.35' }}>{st.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginTop: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '4px', color: '#c5a059', fontWeight: 'bold' }}>
                                        Alinhamento:
                                    </label>
                                    <select
                                        value={selectedAlignment}
                                        onChange={(e) => setSelectedAlignment(e.target.value)}
                                        style={{ width: '100%', padding: '8px' }}
                                    >
                                        {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>

                                <div style={{ marginTop: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '4px', color: '#c5a059', fontWeight: 'bold' }}>
                                        Antecedente:
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
                                        <div style={{ fontSize: '0.85rem', color: '#bbb', marginTop: '6px', background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #c5a059' }}>
                                            <div style={{ marginBottom: '4px', color: '#eee' }}>{selectedBackground.description}</div>
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

                                <div className="info-box" style={{ marginTop: '12px' }}>
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
                                    <h4 style={{ marginTop: '10px', color: '#c5a059' }}>Habilidades (Nv 1):</h4>
                                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                        {(selectedClass?.features || []).filter(f => f.level === 1).map(f => (
                                            <li key={f.name}>
                                                <strong>{f.name}</strong>
                                                <div style={{ fontSize: '0.85rem', color: '#aaa' }}>{f.description}</div>
                                            </li>
                                        ))}
                                    </ul>
                                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '14px', padding: '8px 10px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '4px', borderLeft: '3px solid #ffd700' }}>
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
                                        <h3 style={{ margin: 0 }}>Atributos do Personagem</h3>
                                        <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '3px' }}>
                                            Ajuste os valores dos atributos diretamente ou utilize o Conjunto Padrão.
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
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
                                                padding: '6px 12px',
                                                background: '#222',
                                                border: '1px solid #555',
                                                borderRadius: '5px',
                                                color: '#bbb',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Resetar (10)
                                        </button>
                                    </div>
                                </div>

                                {/* Background Attribute Selector */}
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
                                                
                                                <div className="stat-controls" style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', margin: '6px 0' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateBaseStat(key, -1)}
                                                        disabled={value <= 1}
                                                        style={{ width: '28px', height: '28px', fontSize: '1rem', cursor: 'pointer' }}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={20}
                                                        value={value}
                                                        onChange={(e) => {
                                                            const v = parseInt(e.target.value);
                                                            if (!isNaN(v)) {
                                                                setBaseStats(prev => ({ ...prev, [key]: Math.max(1, Math.min(20, v)) }));
                                                            }
                                                        }}
                                                        style={{
                                                            width: '46px',
                                                            textAlign: 'center',
                                                            fontSize: '1.2rem',
                                                            fontWeight: 'bold',
                                                            background: '#151620',
                                                            color: '#fff',
                                                            border: '1px solid #444',
                                                            borderRadius: '4px',
                                                            padding: '2px 0'
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => updateBaseStat(key, 1)}
                                                        disabled={value >= 20}
                                                        style={{ width: '28px', height: '28px', fontSize: '1rem', cursor: 'pointer' }}
                                                    >
                                                        +
                                                    </button>
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
                                                    <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{total}</div>
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
                                        Perícias de Classe & Espécie ({selectedSkills.length}/{baseSkillLimit})
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

                                    {selectedRace?.skillChoices && (
                                        <div style={{ margin: '8px 0', padding: '8px 10px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', fontSize: '0.82rem', color: '#93c5fd' }}>
                                            ⭐ <strong>Humano Versátil:</strong> Você tem direito a +1 perícia extra à sua escolha!
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
                                                    disabled={isFromBg || (!isSelected && selectedSkills.length >= baseSkillLimit)}
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

                                    {/* TALENTO HABILIDOSO (SKILLED) */}
                                    {hasSkilled && (
                                        <div style={{ marginTop: '18px', padding: '12px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '6px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                                <span style={{ color: '#c084fc', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                    ⭐ Talento Habilidoso (Skilled) — Escolha 3 Perícias Adicionais:
                                                </span>
                                                <span style={{
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold',
                                                    color: skilledChoices.length === 3 ? '#4ade80' : '#f59e0b',
                                                    background: skilledChoices.length === 3 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px'
                                                }}>
                                                    {skilledChoices.length}/3 Selecionadas
                                                </span>
                                            </div>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '0.78rem', color: '#cbd5e1' }}>
                                                O talento Habilidoso concede proficiência em 3 perícias ou ferramentas quaisquer à sua escolha.
                                            </p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {[
                                                    'Acrobacia', 'Adestrar Animais', 'Arcanismo', 'Atletismo', 'Atuação', 'Enganação',
                                                    'Furtividade', 'História', 'Intimidação', 'Intuição', 'Investigação', 'Medicina',
                                                    'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião', 'Sobrevivência'
                                                ].filter(sk => !selectedSkills.includes(sk) && !(selectedBackground?.skillProficiencies as string[] || []).includes(sk)).map(skill => {
                                                    const isSelected = skilledChoices.includes(skill);
                                                    return (
                                                        <button
                                                            key={skill}
                                                            type="button"
                                                            onClick={() => toggleSkilledChoice(skill)}
                                                            disabled={!isSelected && skilledChoices.length >= 3}
                                                            style={{
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                fontSize: '0.8rem',
                                                                fontWeight: isSelected ? 'bold' : 'normal',
                                                                background: isSelected ? '#a855f7' : 'rgba(0,0,0,0.3)',
                                                                color: isSelected ? '#fff' : '#c084fc',
                                                                border: '1px solid #a855f7',
                                                                cursor: (!isSelected && skilledChoices.length >= 3) ? 'not-allowed' : 'pointer'
                                                            }}
                                                        >
                                                            {isSelected ? '✓ ' : '+ '}{skill}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {selectedClassId === 'rogue' && (
                                        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255, 215, 0, 0.06)', border: '1px solid rgba(255, 215, 0, 0.3)', borderRadius: '6px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                <span style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '0.88rem' }}>
                                                    ⭐ Especialização (Ladino Nv 1):
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
                                                {Array.from(new Set([...selectedSkills, ...(selectedBackground?.skillProficiencies as string[] || []), ...skilledChoices])).map(skill => {
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
                    {steps[currentStep].label === 'Proficiências' && hasProficiencyChoice && (
                        <div className="animate-fade">
                            <div className="builder-section">
                                {/* IDIOMAS COMUNS */}
                                {activeSystem === 'dnd55e' && (
                                    <div style={{ marginBottom: '24px', padding: '14px', background: 'rgba(197, 160, 89, 0.08)', border: '1px solid rgba(197, 160, 89, 0.3)', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h3 style={{ margin: 0, color: '#ffd700', fontSize: '1.05rem' }}>
                                                🗣️ Idiomas do Personagem
                                            </h3>
                                            <span style={{
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                color: selectedCommonLanguages.length === 2 ? '#4ade80' : '#f59e0b',
                                                background: selectedCommonLanguages.length === 2 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                padding: '2px 10px',
                                                borderRadius: '12px'
                                            }}>
                                                {selectedCommonLanguages.length}/2 Idiomas Comuns Escolhidos
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 10px 0' }}>
                                            Todo personagem sabe o <strong>Comum</strong> {(selectedRace?.languages || []).filter(l => l !== 'Comum').length > 0 ? `e ${(selectedRace?.languages || []).filter(l => l !== 'Comum').join(', ')} (Espécie)` : ''} + <strong>2 Idiomas Comuns adicionais</strong> à sua escolha:
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {DND_COMMON_LANGUAGES.filter(l => !(selectedRace?.languages || ['Comum']).includes(l)).map(lang => {
                                                const isSelected = selectedCommonLanguages.includes(lang);
                                                return (
                                                    <button
                                                        key={lang}
                                                        type="button"
                                                        onClick={() => toggleCommonLanguage(lang)}
                                                        className={isSelected ? 'skill-btn selected' : 'skill-btn'}
                                                        disabled={!isSelected && selectedCommonLanguages.length >= 2}
                                                        style={{ flex: '1 0 30%' }}
                                                    >
                                                        {lang}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {selectedClass?.toolChoices && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h3>Ferramentas de Classe ({selectedTools.length}/{selectedClass.toolChoices.count})</h3>
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

                                {/* TALENTO ARTÍFICE (CRAFTER) */}
                                {hasCrafter && (
                                    <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.35)', borderRadius: '6px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <div style={{ color: '#fb923c', fontWeight: 'bold', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Wrench size={16} /> Talento Artífice (Crafter) — Escolha 3 Ferramentas de Artesão:
                                            </div>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                color: crafterTools.length === 3 ? '#4ade80' : '#f59e0b',
                                                background: crafterTools.length === 3 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                padding: '2px 8px',
                                                borderRadius: '10px'
                                            }}>
                                                {crafterTools.length}/3 Selecionadas
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                            {ARTISAN_TOOLS.map(tool => {
                                                const isSelected = crafterTools.includes(tool);
                                                return (
                                                    <button
                                                        key={tool}
                                                        type="button"
                                                        onClick={() => toggleCrafterTool(tool)}
                                                        disabled={!isSelected && crafterTools.length >= 3}
                                                        style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: isSelected ? 'bold' : 'normal',
                                                            background: isSelected ? '#ea580c' : 'rgba(0,0,0,0.3)',
                                                            color: isSelected ? '#fff' : '#fdba74',
                                                            border: '1px solid #ea580c',
                                                            cursor: (!isSelected && crafterTools.length >= 3) ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {isSelected ? '✓ ' : '+ '}{tool}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* TALENTO MÚSICO (MUSICIAN) */}
                                {hasMusician && (
                                    <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.35)', borderRadius: '6px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <div style={{ color: '#f472b6', fontWeight: 'bold', fontSize: '0.92rem' }}>
                                                🎵 Talento Músico (Musician) — Escolha 3 Instrumentos Musicais:
                                            </div>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                color: musicianInstruments.length === 3 ? '#4ade80' : '#f59e0b',
                                                background: musicianInstruments.length === 3 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                padding: '2px 8px',
                                                borderRadius: '10px'
                                            }}>
                                                {musicianInstruments.length}/3 Selecionados
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                            {MUSICAL_INSTRUMENTS.map(inst => {
                                                const isSelected = musicianInstruments.includes(inst);
                                                return (
                                                    <button
                                                        key={inst}
                                                        type="button"
                                                        onClick={() => toggleMusicianInstrument(inst)}
                                                        disabled={!isSelected && musicianInstruments.length >= 3}
                                                        style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: isSelected ? 'bold' : 'normal',
                                                            background: isSelected ? '#db2777' : 'rgba(0,0,0,0.3)',
                                                            color: isSelected ? '#fff' : '#fbcfe8',
                                                            border: '1px solid #db2777',
                                                            cursor: (!isSelected && musicianInstruments.length >= 3) ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {isSelected ? '✓ ' : '+ '}{inst}
                                                    </button>
                                                );
                                            })}
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
                                        <h3>Idiomas da Espécie ({selectedLanguages.length}/{selectedRace.languageChoices.count})</h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            {(activeSystem === 'witcher' ? WITCHER_LANGUAGES : DND_LANGUAGES).filter(l => !selectedRace.languages?.includes(l)).map(lang => (
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
                    {steps[currentStep].label === 'Magias' && (
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

                                {/* INICIADO EM MAGIA (MAGIC INITIATE) */}
                                {hasMagicInitiate && (
                                    <div style={{ marginBottom: '28px', padding: '16px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid #a855f7', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                            <div style={{ color: '#d8b4fe', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Sparkles size={18} /> Talento: Iniciado em Magia (Magic Initiate)
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <label style={{ fontSize: '0.85rem', color: '#eee' }}>
                                                    Lista da Classe:
                                                    <select
                                                        value={magicInitiateClass}
                                                        onChange={(e) => {
                                                            const cls = e.target.value as 'cleric' | 'druid' | 'wizard';
                                                            setMagicInitiateClass(cls);
                                                            setMagicInitiateAbility(cls === 'wizard' ? 'int' : 'wis');
                                                            setMagicInitiateCantrips([]);
                                                            setMagicInitiateSpell('');
                                                        }}
                                                        style={{ marginLeft: '6px', padding: '4px 8px', background: '#1c1c28', color: '#c084fc', border: '1px solid #a855f7', borderRadius: '4px', fontWeight: 'bold' }}
                                                    >
                                                        <option value="wizard">Mago (Inteligência)</option>
                                                        <option value="cleric">Clérigo (Sabedoria)</option>
                                                        <option value="druid">Druida (Sabedoria)</option>
                                                    </select>
                                                </label>
                                                <label style={{ fontSize: '0.85rem', color: '#eee' }}>
                                                    Atributo Chave:
                                                    <select
                                                        value={magicInitiateAbility}
                                                        onChange={(e) => setMagicInitiateAbility(e.target.value as any)}
                                                        style={{ marginLeft: '6px', padding: '4px 8px', background: '#1c1c28', color: '#ffd700', border: '1px solid #a855f7', borderRadius: '4px' }}
                                                    >
                                                        <option value="int">INT</option>
                                                        <option value="wis">SAB</option>
                                                        <option value="cha">CAR</option>
                                                    </select>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Magic Initiate Cantrips */}
                                        <div style={{ marginBottom: '14px' }}>
                                            <div style={{ color: '#c084fc', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px' }}>
                                                Escolha 2 Truques ({magicInitiateCantrips.length}/2):
                                            </div>
                                            <div className="spells-grid">
                                                {filterSpells(availableMagicInitiateCantrips).map(spell => (
                                                    <div
                                                        key={spell.id}
                                                        className={`spell-card ${magicInitiateCantrips.includes(spell.id) ? 'selected' : ''}`}
                                                        onClick={() => toggleMagicInitiateCantrip(spell.id)}
                                                    >
                                                        <div className="spell-card-header">
                                                            <strong>{spell.name}</strong>
                                                            {spell.school && <span className="spell-school-tag">{spell.school}</span>}
                                                        </div>
                                                        <div className="spell-desc">{spell.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Magic Initiate Level 1 Spell */}
                                        <div>
                                            <div style={{ color: '#c084fc', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '6px' }}>
                                                Escolha 1 Magia de 1º Círculo ({magicInitiateSpell ? 1 : 0}/1):
                                            </div>
                                            <div className="spells-grid">
                                                {filterSpells(availableMagicInitiateSpellsL1).map(spell => (
                                                    <div
                                                        key={spell.id}
                                                        className={`spell-card ${magicInitiateSpell === spell.id ? 'selected' : ''}`}
                                                        onClick={() => setMagicInitiateSpell(prev => prev === spell.id ? '' : spell.id)}
                                                    >
                                                        <div className="spell-card-header">
                                                            <strong>{spell.name}</strong>
                                                            {spell.school && <span className="spell-school-tag">{spell.school}</span>}
                                                        </div>
                                                        <div className="spell-desc">{spell.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                {effectiveRaceCantripChoices && (
                                    <div style={{ marginTop: '24px' }}>
                                        <h4 style={{ color: '#c5a059', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}>
                                            Truques Raciais ({selectedSubrace?.name || selectedRace?.name}) — Escolha ({selectedRaceCantrips.length}/{effectiveRaceCantripChoices.count})
                                        </h4>
                                        <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '6px 0 10px 0' }}>
                                            Atributo de Conjuração: <strong>{effectiveRaceCantripChoices.ability.toUpperCase()}</strong>
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
                    )}

                    {/* STEP: Feats */}
                    {steps[currentStep].label === 'Talentos' && (
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

                                {selectedRace?.originFeatChoice && selectedHumanBonusFeat && (
                                    <div style={{ marginBottom: '16px', padding: '12px 14px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '6px' }}>
                                        <div style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '0.95rem' }}>
                                            Talento de Origem Extra — Versátil (Humano):
                                        </div>
                                        <div style={{ color: '#fff', fontSize: '1.05rem', marginTop: '4px', fontWeight: 'bold' }}>
                                            {FEATS.find(f => f.id === selectedHumanBonusFeat)?.name}
                                        </div>
                                        <div style={{ color: '#ccc', fontSize: '0.85rem', marginTop: '2px' }}>
                                            {FEATS.find(f => f.id === selectedHumanBonusFeat)?.description}
                                        </div>
                                    </div>
                                )}

                                <h3>Talento Adicional / Bônus ({selectedFeats.length}/1)</h3>
                                <div className="spells-grid">
                                    {FEATS.filter(f => f.category === 'Origem' && f.id !== selectedBackground?.featId && f.id !== selectedHumanBonusFeat).map(feat => (
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
                    )}

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
                                                            const isSelected = (selectedEquipmentChoices[idx] ?? 0) === optIdx;
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
                                                            );
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
                    {steps[currentStep].label === 'Vida' && (
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
                    )}
                </div>

                <div className="builder-actions">
                    {currentStep > 0 && <button className="btn-cancel" onClick={() => setCurrentStep(prev => prev - 1)}>Voltar</button>}
                    {currentStep < steps.length - 1
                        ? <button className="btn-apply" onClick={() => setCurrentStep(prev => prev + 1)}>Próximo</button>
                        : <button
                            className="btn-apply"
                            onClick={handleApply}
                            disabled={!isFormValid}
                            style={{
                                opacity: !isFormValid ? 0.5 : 1,
                                cursor: !isFormValid ? 'not-allowed' : 'pointer'
                            }}
                            title={
                                !isSkillsValid
                                    ? `Selecione ${baseSkillLimit} perícias!`
                                    : !isLanguagesValid
                                        ? 'Escolha seus 2 idiomas comuns!'
                                        : !isMagicInitiateValid
                                            ? 'Escolha 2 truques e 1 magia para Iniciado em Magia!'
                                            : !isSkilledValid
                                                ? 'Escolha 3 perícias para o talento Habilidoso!'
                                                : !isMusicianValid
                                                    ? 'Escolha 3 instrumentos para o talento Músico!'
                                                    : !isCrafterValid
                                                        ? 'Escolha 3 ferramentas para o talento Artífice!'
                                                        : "Tudo pronto!"
                            }
                        >
                            {effectiveStartingLevel > 1 ? `Concluir e Evoluir (Nível ${effectiveStartingLevel})` : 'Concluir Personagem'}
                        </button>
                    }
                </div>
            </div>
            {viewingProgressionId && (
                <ClassProgression
                    classData={CLASSES.find(c => c.id === viewingProgressionId)!}
                    characterLevel={character.level || 1}
                    onClose={() => setViewingProgressionId(null)}
                />
            )}
        </div>,
        document.body
    );
};
