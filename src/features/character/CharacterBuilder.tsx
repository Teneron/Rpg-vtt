import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { CLASSES } from './data/classes';
import { RACES } from './data/races';
// import { BACKGROUNDS } from './data/backgrounds';
import { SPELLS } from './data/spells';
import { FEATS } from './data/feats';
import { LANGUAGES_LIST } from './data/rules';
import { ITEMS } from './data/items';

import { SkillDescriptionPreview } from './SkillDescriptionPreview';
import {
    type Character,
    regenerateCharacterStats,
    calculateModifier,
    type ClassFeature
} from './characterTypes';
import { ClassProgression } from './components/ClassProgression';
import './CharacterBuilder.css';

interface CharacterBuilderProps {
    character: Character;
    onUpdate: (char: Character) => void;
    onClose: () => void;
}

export const CharacterBuilder: React.FC<CharacterBuilderProps> = ({ character, onUpdate, onClose }) => {
    // Basic lookup
    const initialRaceId = RACES.find(r => r.name === character.race || r.id === character.race?.toLowerCase())?.id || 'human';
    const initialClassId = CLASSES.find(c => c.name === character.class || c.id === character.class?.toLowerCase())?.id || 'fighter';

    const [selectedRaceId, setSelectedRaceId] = useState<string>(initialRaceId);
    const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId);
    const [selectedAlignment, setSelectedAlignment] = useState<string>(character.alignment || 'Neutro');
    // const [selectedBackgroundId, setSelectedBackgroundId] = useState<string>('acolyte');
    const [selectedSubclassId, setSelectedSubclassId] = useState<string | null>(null);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const ALIGNMENTS = [
        'Leal e Bom', 'Leal e Neutro', 'Leal e Mau',
        'Neutro e Bom', 'Neutro', 'Neutro e Mau',
        'Caótico e Bom', 'Caótico e Neutro', 'Caótico e Mau'
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
    // Track choices for equipment: map "Choice Group Index" -> "Option Index"
    // e.g. { 0: 1 } means for the first choice group, the user picked option index 1.
    const [selectedEquipmentChoices, setSelectedEquipmentChoices] = useState<Record<number, number>>({});

    // Track previous class to reset selection if class changes
    const prevClassId = React.useRef(initialClassId);

    React.useEffect(() => {
        if (prevClassId.current !== selectedClassId) {
            console.log(`[CharacterBuilder] Class Changed from ${prevClassId.current} to ${selectedClassId}. Resetting equipment choices.`);
            setSelectedSkills([]);
            setSelectedSpells([]);
            setSelectedCantrips([]);
            setSelectedFeats([]);
            setSelectedSkills([]);
            setSelectedSpells([]);
            setSelectedCantrips([]);
            setSelectedFeats([]);
            setSelectedEquipmentChoices({}); // Reset equipment choices
            setSelectedSubclassId(null);
            onUpdate({ ...character, hpRolled: undefined });
            prevClassId.current = selectedClassId;
        }
    }, [selectedClassId, character, onUpdate]);

    // Memoized derived data
    const selectedClass = React.useMemo(() => CLASSES.find(c => c.id === selectedClassId), [selectedClassId]);
    const selectedSubclass = React.useMemo(() => selectedClass?.subclasses?.find(s => s.id === selectedSubclassId), [selectedClass, selectedSubclassId]);
    const selectedRace = React.useMemo(() => RACES.find(r => r.id === selectedRaceId), [selectedRaceId]);
    // const selectedBackground = React.useMemo(() => BACKGROUNDS.find(b => b.id === selectedBackgroundId), [selectedBackgroundId]);
    const isSpellCaster = React.useMemo(() => !!selectedClass?.spellcastingConfig, [selectedClass]);

    // Optimize Spell Filtering
    const availableCantrips = React.useMemo(() =>
        isSpellCaster ? SPELLS.filter(s => s.level === 0 && s.classes.includes(selectedClassId)) : []
        , [isSpellCaster, selectedClassId]);

    const availableRaceCantrips = React.useMemo(() => {
        if (!selectedRace?.cantripChoices) return [];
        // Filter by class list if provided (e.g. 'wizard')
        if (selectedRace.cantripChoices.classList) {
            return SPELLS.filter(s => s.level === 0 && s.classes.includes(selectedRace.cantripChoices!.classList!));
        }
        return []; // Or all cantrips if no list? Usually specific.
    }, [selectedRace]);

    const availableSpellsL1 = React.useMemo(() =>
        isSpellCaster ? SPELLS.filter(s => s.level === 1 && s.classes.includes(selectedClassId)) : []
        , [isSpellCaster, selectedClassId]);

    // Handlers
    const toggleSkill = React.useCallback((skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(prev => prev.filter(s => s !== skill));
        } else {
            const limit = selectedClass?.skillChoices.count || 2;
            if (selectedSkills.length < limit) {
                setSelectedSkills(prev => [...prev, skill]);
            }
        }
    }, [selectedSkills, selectedClass]);

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

        // 0.5 Background (DISABLED PER USER REQUEST)
        /*
        if (selectedBackground) {
            nextChar.background = selectedBackground.name;

            // Apply Background Skill Profs (if not already picked? Actually background skills are fixed)
            // We'll merge them into the skills array
            // Note: 5e rules say if you duplicate, you pick another. For simplicity, we just add them.
            // But we need to update the UI to show them as pre-selected or locked? 
            // For now, simpler approach: Just grant them.
        }
        */

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
            const bonus = selectedRace.bonus[attrKey] || 0;
            const total = base + bonus;
            nextChar.attributes[attrKey].value = total;
            nextChar.attributes[attrKey].modifier = Math.floor((total - 10) / 2);
        });

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

        // Subclass
        if (selectedSubclass) {
            nextChar.subclass = selectedSubclass.name;

            // Apply Specific School Mechanics
            switch (selectedSubclass.id) {
                case 'school_bear':
                    // +2 HP per level (at level 1, +2)
                    nextChar.hp.max += (2 * nextChar.level);
                    nextChar.hp.current = nextChar.hp.max;
                    nextChar.proficiencies.push('Armaduras Pesadas');
                    break;
                case 'school_viper':
                    nextChar.proficiencies.push('Kit de Disfarce', 'Ferramentas de Ladrão');
                    break;
                case 'school_griffin':
                    // No stat changes, just features/resources?
                    // Maybe add a resource tracker for the bonus action signs?
                    // For now, relied on feature text.
                    break;
            }
        }

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

        if (selectedSubclass) {
            const subFeatures = selectedSubclass.features.map(f => ({ ...f, type: 'passive' } as ClassFeature));
            classFeatures.push(...subFeatures);
        }

        const raceFeatures: ClassFeature[] = (selectedRace.traits || []).map(t => ({
            name: t.name,
            description: t.description,
            level: 1,
            type: 'passive'
        }));

        nextChar.features = [...raceFeatures, ...classFeatures];

        // Skills
        // Merge Class Selection + Background Fixed Skills
        // Merge Class Selection + Background Fixed Skills
        const bgSkills: string[] = []; // selectedBackground ? selectedBackground.skillProficiencies : [];
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
        const bgTools: string[] = []; // selectedBackground?.toolProficiencies || [];
        nextChar.proficiencies = Array.from(new Set([...classTools, ...bgTools]));

        // Languages
        const raceLangs = selectedRace.languages || ['Comum'];
        const chosenLangs = selectedLanguages;

        // Background languages not implemented in UI yet, ignoring count

        nextChar.languages = Array.from(new Set([...raceLangs, ...chosenLangs]));

        // Equipment (Simple merge)
        // Equipment (Simple merge)
        const bgEquip: any[] = []; // selectedBackground ? ...

        // Class Equipment parsing
        const classEquip: any[] = [];
        const combinedEquipment = [
            ...(selectedClass.startingEquipment || []),
            ...(selectedSubclass?.startingEquipment || [])
        ];

        // Add chosen equipment items
        // Add chosen equipment items
        if (selectedClass.equipmentChoices) {
            selectedClass.equipmentChoices.forEach((choice, idx) => {
                const selectedOptionIdx = selectedEquipmentChoices[idx] ?? 0;
                console.log(`[CharacterBuilder] Processing Choice ${idx}: Selected Index ${selectedOptionIdx} (State: ${selectedEquipmentChoices[idx]})`);

                const selectedOption = choice.options[selectedOptionIdx];
                if (selectedOption) {
                    console.log(`[CharacterBuilder] Adding items from option: ${selectedOption.label}`, selectedOption.items);
                    combinedEquipment.push(...selectedOption.items);
                }
            });
        }

        if (combinedEquipment.length > 0) {

            combinedEquipment.forEach(itemStr => {
                // Check for quantity pattern "Item Name (xN)" or "Item Name (N)"
                const match = itemStr.match(/^(.*?) \((?:x)?(\d+)\)$/);
                let name = itemStr;
                let quantity = 1;

                if (match) {
                    name = match[1];
                    quantity = parseInt(match[2]);
                }

                const id = name.toLowerCase().replace(/\s/g, '_')
                    .replace(/[áàâã]/g, 'a').replace(/[éê]/g, 'e').replace(/[í]/g, 'i').replace(/[óôõ]/g, 'o').replace(/[ú]/g, 'u').replace(/ç/g, 'c'); // Normalize accents

                const def = ITEMS.find(i => i.id === id || i.name === name);

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
                    cost: def?.cost
                });
            });
        }

        nextChar.inventory = [...bgEquip, ...classEquip];

        // Add Feature from Background
        /*
        if (selectedBackground) {
            nextChar.features.push({
                name: selectedBackground.feature.name,
                description: selectedBackground.feature.description,
                level: 1,
                type: 'passive'
            });
        }
        */
        nextChar.skills = nextChar.skills.map(s => ({ ...s, proficient: false }));
        selectedSkills.forEach(skillName => {
            const sk = nextChar.skills.find(s => s.name === skillName);
            if (sk) sk.proficient = true;
        });

        // Proficiencies (Tools & Languages)
        nextChar.proficiencies = []; // Reset first? Or append? Reset is safer for builder.
        if (selectedClass.armorProficiency) nextChar.proficiencies.push(...selectedClass.armorProficiency.map(p => `Armadura (${p})`));
        if (selectedClass.weaponProficiency) nextChar.proficiencies.push(...selectedClass.weaponProficiency.map(p => `Armas (${p})`));
        if (selectedClass.toolProficiencies) nextChar.proficiencies.push(...selectedClass.toolProficiencies);

        nextChar.proficiencies.push(...selectedTools); // Add chosen tools

        nextChar.languages = [...(selectedRace.languages || [])]; // Fixed
        nextChar.languages.push(...selectedLanguages); // Chosen

        // Spells
        const chosenCantrips = SPELLS.filter(s => selectedCantrips.includes(s.id));
        const chosenSpells = SPELLS.filter(s => selectedSpells.includes(s.id));
        const chosenRaceCantrips = SPELLS.filter(s => selectedRaceCantrips.includes(s.id));

        nextChar.spells = [...chosenCantrips, ...chosenSpells, ...chosenRaceCantrips];

        // Feats
        const chosenFeats = FEATS.filter(f => selectedFeats.includes(f.id));
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

        onUpdate(regenerateCharacterStats(nextChar));
        onClose();
    }, [character, selectedClass, selectedRace, baseStats, selectedSkills, isSpellCaster, selectedCantrips, selectedSpells, selectedAlignment, selectedTools, selectedLanguages, selectedFeats, selectedEquipmentChoices, onUpdate, onClose]);

    // Render using Portal
    return ReactDOM.createPortal(
        <div className="char-builder-modal">
            <div className="builder-content">
                <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Construtor (D&D 5e)</span>
                </h2>

                <div className="builder-stepper">
                    {steps.map(step => (
                        <button
                            key={step.id}
                            className={`step-btn ${currentStep === step.id ? 'active' : ''}`}
                            onClick={() => setCurrentStep(step.id)}
                            disabled={step.id > currentStep && remainingPoints !== 0}
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
                                <h3>Raça & Alinhamento</h3>
                                <select value={selectedRaceId} onChange={(e) => setSelectedRaceId(e.target.value)}>
                                    {RACES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>

                                <select
                                    value={selectedAlignment}
                                    onChange={(e) => setSelectedAlignment(e.target.value)}
                                    style={{ marginTop: '10px' }}
                                >
                                    {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>

                                { /* Background Selection Removed per User Request
                                <div style={{ marginTop: '15px' }}>
                                    <label>Antecedente:</label>
                                    <select
                                        value={selectedBackgroundId}
                                        onChange={e => setSelectedBackgroundId(e.target.value)}
                                        style={{ width: '100%', padding: '8px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
                                    >
                                        {BACKGROUNDS.map(bg => (
                                            <option key={bg.id} value={bg.id}>{bg.name}</option>
                                        ))}
                                    </select>
                                    {selectedBackground && (
                                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '5px' }}>
                                            {selectedBackground.description} <br />
                                            <em>Perícias: {selectedBackground.skillProficiencies.join(', ')} e {selectedBackground.languages !== undefined ? (selectedBackground.languages + " Idioma(s)") : ""} {selectedBackground.toolProficiencies ? ("e " + selectedBackground.toolProficiencies.join(', ')) : ""}</em>
                                        </p>
                                    )}
                                </div>
                                */ }

                                <div className="info-box" style={{ marginTop: '15px' }}>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '10px', fontStyle: 'italic' }}>
                                        {selectedRace?.description}
                                    </div>
                                    <p><strong>Deslocamento:</strong> {selectedRace?.speed}m</p>
                                    <p><strong>Bônus:</strong> {Object.entries(selectedRace?.bonus || {}).map(([k, v]) => `${k.toUpperCase()} +${v}`).join(', ')}</p>
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
                                    {CLASSES.map(c => <option key={c.id} value={c.id}>{c.name} ({c.hitDie})</option>)}
                                </select>
                                <button
                                    className="btn-small-outline"
                                    style={{ marginTop: '5px', width: '100%', fontSize: '0.8rem', padding: '4px', background: 'transparent', border: '1px solid #666', color: '#ddd', cursor: 'pointer' }}
                                    onClick={() => setViewingProgressionId(selectedClassId)}
                                >
                                    Ver Tabela de Progressão
                                </button>
                                <div className="info-box">
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
                                    {selectedClass?.subclasses && (
                                        <div style={{ marginTop: '20px', padding: '10px', background: '#2c2c2c', borderRadius: '4px', border: '1px solid #c5a059' }}>
                                            <h4 style={{ color: '#c5a059', marginBottom: '10px' }}>ESCOLHER SUBCLASSE</h4>
                                            <select
                                                value={selectedSubclassId || ''}
                                                onChange={(e) => setSelectedSubclassId(e.target.value || null)}
                                                style={{ width: '100%', padding: '5px' }}
                                            >
                                                <option value="">Selecione...</option>
                                                {selectedClass.subclasses.map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                            {selectedSubclass && (
                                                <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '5px' }}>
                                                    {selectedSubclass.description}
                                                    {selectedSubclass.features.length > 0 && (
                                                        <ul style={{ paddingLeft: '20px', margin: '5px 0 0 0' }}>
                                                            {selectedSubclass.features.map(f => (
                                                                <li key={f.name}>
                                                                    <strong>{f.name}</strong>: {f.description}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ... (Steps 1, 2, 3, 4, 5 hidden for brevity, assume unchanged unless targeting) ... */}
                    {/* Actually, replace_file_content takes range. I need to be careful with range. */}
                    {/* I will split this into two edits if the range is too wide or use multi_replace. */}
                    {/* It is wide. Subclass is line ~523. Life Step is ~808. */}
                    {/* I will use multi_replace. */}

                    {/* STEP 1: Attributes */}
                    {steps[currentStep].label === 'Atributos' && (
                        <div className="animate-fade">
                            <div className="builder-section">
                                <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    Atributos (Point Buy)
                                    <span className={remainingPoints === 0 ? 'success' : 'warn'}>{remainingPoints} pts</span>
                                </h3>
                                <div className="point-buy-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', marginTop: '15px' }}>
                                    {Object.entries(baseStats).map(([key, value]) => {
                                        const attrKey = key as keyof Character['attributes'];
                                        const raceBonus = selectedRace?.bonus ? (selectedRace.bonus[attrKey] || 0) : 0;
                                        const total = value + raceBonus;
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
                                                    Raça: <span style={{ color: '#c5a059' }}>+{raceBonus}</span>
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
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                        {selectedClass?.skillChoices.options.map(skill => (
                                            <button
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                onMouseEnter={() => setHoveredSkill(skill)}
                                                onMouseLeave={() => setHoveredSkill(null)}
                                                className={selectedSkills.includes(skill) ? 'skill-btn selected' : 'skill-btn'}
                                                disabled={!selectedSkills.includes(skill) && selectedSkills.length >= (selectedClass?.skillChoices.count || 2)}
                                                style={{ flex: '1 0 45%' }}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
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

                                    {selectedRace?.languageChoices && (
                                        <div>
                                            <h3>Idiomas ({selectedLanguages.length}/{selectedRace.languageChoices.count})</h3>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {LANGUAGES_LIST.filter(l => !selectedRace.languages?.includes(l)).map(lang => (
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
                                        <>
                                            <div className="info-box" style={{ marginBottom: '10px' }}>
                                                Atributo: <strong>{selectedClass?.spellcastingConfig?.ability.toUpperCase()}</strong> |
                                                Truques: <strong>{selectedCantrips.length}/{selectedClass?.spellcastingConfig?.cantripsKnown}</strong> |
                                                Magias: <strong>{selectedSpells.length}/{selectedClass?.spellcastingConfig?.spellsKnown}</strong>
                                            </div>
                                            <h4>Truques de Classe (0)</h4>
                                            <div className="spells-grid">
                                                {availableCantrips.map(spell => (
                                                    <div
                                                        key={spell.id}
                                                        className={`spell-card ${selectedCantrips.includes(spell.id) ? 'selected' : ''}`}
                                                        onClick={() => toggleSpell(spell.id, true)}
                                                    >
                                                        <strong>{spell.name}</strong>
                                                        <div className="spell-desc">{spell.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <h4 style={{ marginTop: '20px' }}>Magias Nível 1</h4>
                                            <div className="spells-grid">
                                                {availableSpellsL1.map(spell => (
                                                    <div
                                                        key={spell.id}
                                                        className={`spell-card ${selectedSpells.includes(spell.id) ? 'selected' : ''}`}
                                                        onClick={() => toggleSpell(spell.id, false)}
                                                    >
                                                        <strong>{spell.name}</strong>
                                                        <div className="spell-desc">{spell.description}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Race Cantrips */}
                                    {selectedRace?.cantripChoices && (
                                        <div style={{ marginTop: isSpellCaster ? '30px' : '0' }}>
                                            <h3>
                                                Truques Raciais ({selectedRace.name}) - {selectedRaceCantrips.length}/{selectedRace.cantripChoices.count}
                                            </h3>
                                            <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '10px' }}>
                                                Atributo de Conjuração: <strong>{selectedRace.cantripChoices.ability.toUpperCase()}</strong>
                                            </p>
                                            <div className="spells-grid">
                                                {availableRaceCantrips.map(spell => (
                                                    <div
                                                        key={spell.id}
                                                        className={`spell-card ${selectedRaceCantrips.includes(spell.id) ? 'selected' : ''}`}
                                                        onClick={() => toggleRaceCantrip(spell.id)}
                                                    >
                                                        <strong>{spell.name}</strong>
                                                        <div className="spell-desc">{spell.description}</div>
                                                    </div>
                                                ))}
                                            </div>
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
                                    <h3>Talentos ({selectedFeats.length}/1)</h3>
                                    <div className="spells-grid">
                                        {FEATS.map(feat => (
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
                                                {selectedSubclass?.startingEquipment && (
                                                    <>
                                                        <div style={{ marginTop: '10px', color: '#c5a059', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                                            + {selectedSubclass.name}:
                                                        </div>
                                                        {selectedSubclass.startingEquipment.map((item, idx) => (
                                                            <li key={`sub-${idx}`} style={{ marginBottom: '8px' }}>
                                                                <span style={{ color: '#fff' }}>{item}</span>
                                                            </li>
                                                        ))}
                                                    </>
                                                )}
                                                {(!selectedClass?.startingEquipment || selectedClass?.startingEquipment.length === 0) && (!selectedSubclass?.startingEquipment) && (
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
                                        <p>Modificador de Constituição: <strong>{calculateModifier(baseStats.con + (selectedRace?.bonus.con || 0)) >= 0 ? '+' : ''}{calculateModifier(baseStats.con + (selectedRace?.bonus.con || 0))}</strong></p>
                                        {((FEATS.filter(f => selectedFeats.includes(f.id)).reduce((acc, f) => {
                                            const hpEffect = f.effects?.find(e => e.type === 'hp_per_level');
                                            return acc + (hpEffect ? hpEffect.value : 0);
                                        }, 0)) > 0) && (
                                                <p>Bônus de Talento: <strong style={{ color: '#4caf50' }}>+{(FEATS.filter(f => selectedFeats.includes(f.id)).reduce((acc, f) => {
                                                    const hpEffect = f.effects?.find(e => e.type === 'hp_per_level');
                                                    return acc + (hpEffect ? hpEffect.value : 0);
                                                }, 0))}</strong></p>
                                            )}

                                        <div className="roll-result" style={{ marginTop: '20px' }}>
                                            <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>
                                                Vida Total: <strong style={{ color: '#4caf50', fontSize: '2.5rem' }}>
                                                    {Math.max(1, parseInt(selectedClass?.hitDie.replace('d', '') || '10') + calculateModifier(baseStats.con + (selectedRace?.bonus.con || 0))) + (FEATS.filter(f => selectedFeats.includes(f.id)).reduce((acc, f) => {
                                                        const hpEffect = f.effects?.find(e => e.type === 'hp_per_level');
                                                        return acc + (hpEffect ? hpEffect.value : 0);
                                                    }, 0) * 1)}
                                                </strong>
                                            </p>
                                        </div>
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
                                (!!selectedClass?.toolChoices && selectedTools.length < selectedClass.toolChoices.count) ||
                                (!!selectedRace?.languageChoices && selectedLanguages.length < selectedRace.languageChoices.count) ||
                                (!!selectedRace?.cantripChoices && selectedRaceCantrips.length < selectedRace.cantripChoices.count)
                            }
                            style={{
                                opacity: (
                                    remainingPoints !== 0 ||
                                    selectedSkills.length < (selectedClass?.skillChoices.count || 2) ||
                                    (!!selectedClass?.toolChoices && selectedTools.length < selectedClass.toolChoices.count) ||
                                    (!!selectedRace?.languageChoices && selectedLanguages.length < selectedRace.languageChoices.count) ||
                                    (!!selectedRace?.cantripChoices && selectedRaceCantrips.length < selectedRace.cantripChoices.count)
                                ) ? 0.5 : 1,
                                cursor: (
                                    remainingPoints !== 0 ||
                                    selectedSkills.length < (selectedClass?.skillChoices.count || 2) ||
                                    (!!selectedClass?.toolChoices && selectedTools.length < selectedClass.toolChoices.count) ||
                                    (!!selectedRace?.languageChoices && selectedLanguages.length < selectedRace.languageChoices.count) ||
                                    (!!selectedRace?.cantripChoices && selectedRaceCantrips.length < selectedRace.cantripChoices.count)
                                ) ? 'not-allowed' : 'pointer'
                            }}
                            title={remainingPoints !== 0 ? "Você deve gastar exatamente 27 pontos!" : "Tudo pronto!"}
                        >
                            Concluir Personagem
                        </button>
                    }
                </div>
            </div >
            {viewingProgressionId && (
                <ClassProgression
                    classData={CLASSES.find(c => c.id === viewingProgressionId)!}
                    onClose={() => setViewingProgressionId(null)}
                />
            )}
        </div >,
        document.body
    );
};
