import { describe, it, expect } from 'vitest';
import { CLASSES } from './classes';
import { BACKGROUNDS } from './backgrounds';
import { FEATS } from './feats';
import { RACES } from './races';
import { WARLOCK_INVOCATIONS } from './warlockInvocations';
import { regenerateCharacterStats, initialCharacter, type Character } from '../characterTypes';
import { applyCharacterLevelDown } from '../utils/levelUtils';
import {
    checkFeatPrerequisites,
    checkInvocationPrerequisites,
    getValidFeatAbilityOptions
} from '../utils/featPrerequisites';
import {
    normalizeClassId,
    getProficiencyBonus,
    getAsiLevels,
    isAsiLevel,
    getSubclassLevel,
    getSpellSlotsForLevel,
    getMaxSpellCircleForLevel,
    getCantripsKnownCount,
    getSpellsPreparedCount,
    getClassResourcesForLevel,
    getFeaturesForLevel,
    getFeaturesUpToLevel,
    getSubclassGrantedSpells
} from './progression';

describe('progression.ts - 1 to 20 rules engine', () => {
    it('normalizes class names in Portuguese and IDs', () => {
        expect(normalizeClassId('Guerreiro')).toBe('fighter');
        expect(normalizeClassId('Mago')).toBe('wizard');
        expect(normalizeClassId('Bruxo')).toBe('warlock');
        expect(normalizeClassId('Bruxo (The Witcher)')).toBe('witcher');
        expect(normalizeClassId('witcher')).toBe('witcher');
        expect(normalizeClassId('Paladino')).toBe('paladin');
        expect(normalizeClassId('Bárbaro')).toBe('barbarian');
        expect(normalizeClassId('Ladino')).toBe('rogue');
    });

    it('calculates official proficiency bonus for all levels', () => {
        expect(getProficiencyBonus(1)).toBe(2);
        expect(getProficiencyBonus(4)).toBe(2);
        expect(getProficiencyBonus(5)).toBe(3);
        expect(getProficiencyBonus(8)).toBe(3);
        expect(getProficiencyBonus(9)).toBe(4);
        expect(getProficiencyBonus(13)).toBe(5);
        expect(getProficiencyBonus(17)).toBe(6);
        expect(getProficiencyBonus(20)).toBe(6);
    });

    it('identifies ASI levels including Fighter and Rogue bonus levels', () => {
        expect(getAsiLevels('fighter')).toEqual([4, 6, 8, 12, 14, 16, 19]);
        expect(isAsiLevel('fighter', 6)).toBe(true);
        expect(isAsiLevel('wizard', 6)).toBe(false);

        expect(getAsiLevels('rogue')).toEqual([4, 8, 10, 12, 16, 19]);
        expect(isAsiLevel('rogue', 10)).toBe(true);
        expect(isAsiLevel('cleric', 10)).toBe(false);

        expect(getAsiLevels('wizard')).toEqual([4, 8, 12, 16, 19]);
        expect(getAsiLevels('witcher')).toEqual([4, 8, 12, 16, 19]);
    });

    it('returns subclass milestone level (level 3 for 5.5e)', () => {
        expect(getSubclassLevel('fighter')).toBe(3);
        expect(getSubclassLevel('wizard')).toBe(3);
        expect(getSubclassLevel('witcher')).toBe(3);
    });

    it('calculates correct spell slots up to level 20 for full casters', () => {
        // Wizard Level 1: 2 1st-level slots
        const wiz1 = getSpellSlotsForLevel('wizard', 1);
        expect(wiz1[1].max).toBe(2);
        expect(wiz1[2].max).toBe(0);

        // Wizard Level 5: 4 1st, 3 2nd, 2 3rd
        const wiz5 = getSpellSlotsForLevel('wizard', 5);
        expect(wiz5[1].max).toBe(4);
        expect(wiz5[2].max).toBe(3);
        expect(wiz5[3].max).toBe(2);
        expect(wiz5[4].max).toBe(0);

        // Wizard Level 20: 4/3/3/3/3/2/2/1/1
        const wiz20 = getSpellSlotsForLevel('wizard', 20);
        expect(wiz20[1].max).toBe(4);
        expect(wiz20[2].max).toBe(3);
        expect(wiz20[3].max).toBe(3);
        expect(wiz20[4].max).toBe(3);
        expect(wiz20[5].max).toBe(3);
        expect(wiz20[6].max).toBe(2);
        expect(wiz20[7].max).toBe(2);
        expect(wiz20[8].max).toBe(1);
        expect(wiz20[9].max).toBe(1);
    });

    it('calculates Pact Magic slots for Warlock correctly', () => {
        // Warlock Level 1: 1 slot of 1st level
        const war1 = getSpellSlotsForLevel('warlock', 1);
        expect(war1[1].max).toBe(1);

        // Warlock Level 3: 2 slots of 2nd level
        const war3 = getSpellSlotsForLevel('warlock', 3);
        expect(war3[2].max).toBe(2);
        expect(war3[1].max).toBe(0);

        // Warlock Level 9: 2 slots of 5th level
        const war9 = getSpellSlotsForLevel('warlock', 9);
        expect(war9[5].max).toBe(2);

        // Warlock Level 17: 4 slots of 5th level
        const war17 = getSpellSlotsForLevel('warlock', 17);
        expect(war17[5].max).toBe(4);
    });

    it('calculates half-caster spell slots for Paladin & Ranger', () => {
        // Paladin Level 1: 0 slots in 5e (or check 5.5e table)
        const pal1 = getSpellSlotsForLevel('paladin', 1);
        expect(pal1[1].max).toBe(2); // 5.5e (2024) gives Paladin spellcasting at level 1!

        // Paladin Level 5: 4 1st, 2 2nd
        const pal5 = getSpellSlotsForLevel('paladin', 5);
        expect(pal5[1].max).toBe(4);
        expect(pal5[2].max).toBe(2);
    });

    it('returns 0 spell slots for non-casters (Fighter, Barbarian, Witcher)', () => {
        const f10 = getSpellSlotsForLevel('fighter', 10);
        for (let i = 1; i <= 9; i++) {
            expect(f10[i].max).toBe(0);
        }
        const w10 = getSpellSlotsForLevel('witcher', 10);
        for (let i = 1; i <= 9; i++) {
            expect(w10[i].max).toBe(0);
        }
    });

    it('extracts cantrips and prepared spells counts', () => {
        expect(getCantripsKnownCount('wizard', 1)).toBe(3);
        expect(getCantripsKnownCount('wizard', 10)).toBe(5);
        expect(getSpellsPreparedCount('cleric', 1)).toBe(4);
        expect(getSpellsPreparedCount('cleric', 20)).toBe(22);
    });

    it('configures class resources for all classes across levels', () => {
        // Barbarian rages
        const barb1 = getClassResourcesForLevel('barbarian', 1);
        expect(barb1.find(r => r.id === 'rage')?.max).toBe(2);
        const barb20 = getClassResourcesForLevel('barbarian', 20);
        expect(barb20.find(r => r.id === 'rage')?.max).toBe(6); // 6 rages at level 20 in 5.5e table

        // Fighter Action Surge & Second Wind
        const fig5 = getClassResourcesForLevel('fighter', 5);
        expect(fig5.find(r => r.id === 'action_surge')?.max).toBe(1);
        expect(fig5.find(r => r.id === 'second_wind')?.max).toBe(3);

        // Monk Focus Points
        const monk5 = getClassResourcesForLevel('monk', 5);
        expect(monk5.find(r => r.id === 'focus_points')?.max).toBe(5);

        // Witcher Vigor & Toxicity
        const witcher5 = getClassResourcesForLevel('witcher', 5);
        expect(witcher5.find(r => r.id === 'witcher_vigor')?.max).toBe(20);
        expect(witcher5.find(r => r.id === 'witcher_toxicity')?.max).toBe(125);
    });

    it('extracts class features for specific levels and cumulative', () => {
        const f1 = getFeaturesForLevel('fighter', 1);
        expect(f1.length).toBeGreaterThan(0);

        const allF5 = getFeaturesUpToLevel('fighter', 5);
        expect(allF5.length).toBeGreaterThan(f1.length);
        expect(allF5.some(f => f.level === 5)).toBe(true);
    });

    it('ensures all classes unlock subclasses at level 3 in D&D 5.5e with detailed descriptions and features', () => {
        const dndClasses = CLASSES.filter(c => c.system !== 'witcher');
        expect(dndClasses.length).toBe(12);

        for (const cls of dndClasses) {
            expect(getSubclassLevel(cls.id)).toBe(3);
            expect(cls.subclasses).toBeDefined();
            expect(cls.subclasses!.length).toBeGreaterThanOrEqual(1);

            for (const sub of cls.subclasses!) {
                expect(sub.name.length).toBeGreaterThan(0);
                expect(sub.description.length).toBeGreaterThan(10);
                expect(sub.features.length).toBeGreaterThan(0);
                for (const f of sub.features) {
                    expect(f.name.length).toBeGreaterThan(0);
                    expect(f.description.length).toBeGreaterThan(10);
                    expect(f.level).toBeGreaterThanOrEqual(3);
                }
            }
        }
    });

    it('ensures level 3 is strictly NOT an ASI level for any class (subclasses only, no stat boost)', () => {
        const allClasses = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'ranger', 'rogue', 'sorcerer', 'warlock', 'wizard', 'witcher'];
        for (const classId of allClasses) {
            expect(isAsiLevel(classId, 3)).toBe(false);
            expect(isAsiLevel(classId, 1)).toBe(false);
            expect(isAsiLevel(classId, 2)).toBe(false);
            expect(isAsiLevel(classId, 4)).toBe(true);
        }
    });

    it('verifies Farmer background grants Tough feat with +2 HP per level', () => {
        const farmer = BACKGROUNDS.find(b => b.id === 'farmer');
        expect(farmer).toBeDefined();
        expect(farmer?.featId).toBe('tough');
        expect(farmer?.featName).toContain('Vigoroso');

        const toughFeat = FEATS.find(f => f.id === 'tough');
        expect(toughFeat).toBeDefined();
        const hpEffect = toughFeat?.effects?.find(e => e.type === 'hp_per_level');
        expect(hpEffect).toBeDefined();
        expect(hpEffect?.value).toBe(2);
    });

    it('verifies Dwarf race grants Dwarven Toughness (+1 HP per level)', () => {
        const dwarf = RACES.find(r => r.id === 'dwarf');
        expect(dwarf).toBeDefined();
        const toughnessTrait = dwarf?.traits.find(t => t.name.toLowerCase().includes('tenacidade'));
        expect(toughnessTrait).toBeDefined();
        expect(toughnessTrait?.description).toContain('+1 a cada nível');
    });

    it('verifies Alert feat dynamically scales Initiative by PB in regenerateCharacterStats', () => {
        const baseChar: Character = {
            ...initialCharacter,
            level: 1,
            attributes: {
                ...initialCharacter.attributes,
                dex: { ...initialCharacter.attributes.dex, value: 14, modifier: 2 }
            },
            feats: [{ id: 'alert', name: 'Alerta (Alert)', description: '' }]
        };

        // Level 1: Dex mod (+2) + PB (+2) = 4
        const charLvl1 = regenerateCharacterStats(baseChar);
        expect(charLvl1.initiative).toBe(4);

        // Level 5: Dex mod (+2) + PB (+3) = 5
        const charLvl5 = regenerateCharacterStats({ ...baseChar, level: 5 });
        expect(charLvl5.initiative).toBe(5);

        // Level 9: Dex mod (+2) + PB (+4) = 6
        const charLvl9 = regenerateCharacterStats({ ...baseChar, level: 9 });
        expect(charLvl9.initiative).toBe(6);
    });

    it('automatically grants subclass resources (Battle Master Superiority Dice & Archfey Fey Steps)', () => {
        // Fighter Battle Master level 3: 4 superiority dice
        const bmResources = getClassResourcesForLevel('fighter', 3, [], 1, 'Mestre da Batalha');
        const supDice = bmResources.find(r => r.id === 'combat_superiority');
        expect(supDice).toBeDefined();
        expect(supDice?.max).toBe(4);
        expect(supDice?.rechargesOn).toBe('short');

        // Warlock Archfey level 3 with Cha mod +3: 3 fey steps
        const afResources = getClassResourcesForLevel('warlock', 3, [], 3, 'Patrono Arquifada');
        const feySteps = afResources.find(r => r.id === 'steps_of_the_fey');
        expect(feySteps).toBeDefined();
        expect(feySteps?.max).toBe(3);
        expect(feySteps?.rechargesOn).toBe('long');
    });

    it('automatically retrieves subclass granted spells for Archfey and Vengeance Paladin', () => {
        // Archfey level 3 grants Sleep (Sono) and Misty Step (Passo Nebuloso)
        const archfeySpells = getSubclassGrantedSpells('archfey', 3);
        expect(archfeySpells.some(s => s.id === 'sleep')).toBe(true);
        expect(archfeySpells.some(s => s.id === 'misty_step')).toBe(true);

        // Vengeance Paladin level 3 grants Bane and Hunter's Mark
        const vengeanceSpells = getSubclassGrantedSpells('Juramento da Vingança', 3);
        expect(vengeanceSpells.some(s => s.id === 'bane')).toBe(true);
        expect(vengeanceSpells.some(s => s.id === 'hunter_mark')).toBe(true);
    });

    it('contains complete D&D 5.5e (2024) Feats & Warlock Invocations catalog', () => {
        const originFeats = FEATS.filter(f => f.category === 'Origem');
        const generalFeats = FEATS.filter(f => f.category === 'Geral');
        const fightingStyles = FEATS.filter(f => f.category === 'Estilo de Luta');
        const epicBoons = FEATS.filter(f => f.category === 'Dádiva Épica');

        expect(originFeats.length).toBeGreaterThanOrEqual(10);
        expect(generalFeats.length).toBeGreaterThanOrEqual(35);
        expect(fightingStyles.length).toBe(10);
        expect(epicBoons.length).toBe(12);

        // Every General Feat in D&D 2024 is a half-feat (+1 ability score up to 20)
        for (const gf of generalFeats) {
            expect(gf.abilityBonusOptions).toBeDefined();
            expect(gf.abilityBonusAmount ?? 1).toBe(1);
        }

        // Every Epic Boon raises an ability score up to 30 and requires level 19+
        for (const boon of epicBoons) {
            expect(boon.prerequisite).toContain('19');
            expect(boon.maxAttributeCap).toBe(30);
        }

        // Key Warlock Invocations exist
        expect(WARLOCK_INVOCATIONS.some(i => i.id === 'thirsting_blade')).toBe(true);
        expect(WARLOCK_INVOCATIONS.some(i => i.id === 'eldritch_smite')).toBe(true);
        expect(WARLOCK_INVOCATIONS.some(i => i.id === 'lifedrinker')).toBe(true);
        expect(WARLOCK_INVOCATIONS.some(i => i.id === 'devouring_blade')).toBe(true);
    });

    it('derives accurate max unlocked spell circles and rich Lv 6-20 feature descriptions', () => {
        // Half-casters at Lv 4 only have 1st-circle slots (2nd circle unlocks at Lv 5)
        expect(getMaxSpellCircleForLevel('Paladino', 4)).toBe(1);
        expect(getMaxSpellCircleForLevel('Paladino', 5)).toBe(2);
        expect(getMaxSpellCircleForLevel('Mago', 4)).toBe(2);
        expect(getMaxSpellCircleForLevel('Bruxo', 11)).toBe(6);

        // Lv 6+ features pull real Portuguese rules instead of generic placeholders
        const paladinLv6 = getFeaturesForLevel('Paladino', 6);
        const aura = paladinLv6.find(f => f.name.includes('Aura de Proteção'));
        expect(aura).toBeDefined();
        expect(aura?.description.toLowerCase()).toContain('carisma');

        // Downgrading below resource unlock level removes the locked resource
        const fighterLv2Res = getClassResourcesForLevel('Guerreiro', 2);
        expect(fighterLv2Res.some(r => r.id === 'action_surge')).toBe(true);
        const fighterLv1Res = getClassResourcesForLevel('Guerreiro', 1, fighterLv2Res);
        expect(fighterLv1Res.some(r => r.id === 'action_surge')).toBe(false);
    });

    it('reverts HP, ASI attributes, and Feats cleanly when downgrading from Level 4 to Level 3 (snapshot & legacy)', () => {
        // 1. Exact snapshot reversal (Level 4 -> Level 3 after +2 STR ASI and +9 HP gain)
        const charWithSnapshot: Character = regenerateCharacterStats({
            ...initialCharacter,
            class: 'Guerreiro',
            level: 4,
            hp: { current: 37, max: 37, temp: 0 },
            hitDice: { current: 4, max: 4, dieFace: '1d10' },
            attributes: {
                ...initialCharacter.attributes,
                str: { ...initialCharacter.attributes.str, value: 18, modifier: 4 },
                con: { ...initialCharacter.attributes.con, value: 14, modifier: 2 }
            },
            feats: [
                { id: 'alert', name: 'Alerta (Alert)', description: '', category: 'Origem', acquiredAtLevel: 1 },
                { id: 'asi_4', name: 'Aumento no Valor de Atributo (+2 FOR)', description: '', acquiredAtLevel: 4 }
            ],
            levelHistory: {
                4: {
                    level: 4,
                    hpGained: 9,
                    previousHpMax: 28,
                    previousAttributes: {
                        ...initialCharacter.attributes,
                        str: { ...initialCharacter.attributes.str, value: 16, modifier: 3 },
                        con: { ...initialCharacter.attributes.con, value: 14, modifier: 2 }
                    },
                    previousFeatIds: ['alert'],
                    previousFeatureNames: [],
                    previousSpellIds: [],
                    previousSkillExpertises: []
                }
            }
        });

        const revertedSnapshot = applyCharacterLevelDown(charWithSnapshot, 3);
        expect(revertedSnapshot.level).toBe(3);
        expect(revertedSnapshot.hp.max).toBe(28);
        expect(revertedSnapshot.hp.current).toBe(28);
        expect(revertedSnapshot.attributes.str.value).toBe(16);
        expect(revertedSnapshot.feats.some(f => f.id === 'asi_4')).toBe(false);
        expect(revertedSnapshot.feats.some(f => f.id === 'alert')).toBe(true);
        expect(revertedSnapshot.levelHistory?.[4]).toBeUndefined();

        // 2. Legacy sheet reversal without levelHistory (Level 4 -> Level 3 removing General half-feat +1 CON and average HP)
        const legacyLvl4: Character = regenerateCharacterStats({
            ...initialCharacter,
            class: 'Guerreiro',
            level: 4,
            hp: { current: 40, max: 40, temp: 0 },
            hitDice: { current: 4, max: 4, dieFace: '1d10' },
            attributes: {
                ...initialCharacter.attributes,
                str: { ...initialCharacter.attributes.str, value: 16, modifier: 3 },
                con: { ...initialCharacter.attributes.con, value: 16, modifier: 3 }
            },
            feats: [
                { id: 'alert', name: 'Alerta (Alert)', description: '', category: 'Origem' },
                { id: 'durable', name: 'Durável (Durable)', description: '', category: 'Geral', chosenAbilityBonus: 'con' }
            ]
        });

        // Fighter d10 (avg 6) + CON +3 = 9 HP for Lv4, plus removing Durable drops CON 16->15 (mod +3 -> +2, so -3 HP across remaining 3 levels) -> 40 - 9 - 3 = 28!
        const revertedLegacy = applyCharacterLevelDown(legacyLvl4, 3, {
            legacyHpReduction: 9,
            featIndicesToRemove: [1]
        });
        expect(revertedLegacy.level).toBe(3);
        expect(revertedLegacy.attributes.con.value).toBe(15);
        expect(revertedLegacy.hp.max).toBe(28);
        expect(revertedLegacy.feats).toHaveLength(1);
    });

    it('calculates, self-heals, and removes Tough (Vigoroso) & Boon of Fortitude HP without double counting', () => {
        // 1. Broken legacy Level 4 Fighter (d10, CON +2) that had Tough in feats without HP applied (36 instead of 44)
        const brokenLvl4WithTough: Character = {
            ...initialCharacter,
            class: 'Guerreiro',
            level: 4,
            hp: { current: 36, max: 36, temp: 0 },
            hitDice: { current: 4, max: 4, dieFace: 'd10' },
            attributes: {
                ...initialCharacter.attributes,
                con: { ...initialCharacter.attributes.con, value: 14, modifier: 2 }
            },
            feats: [{ id: 'tough', name: 'Vigoroso (Tough)', description: '' }]
        };

        const healed = regenerateCharacterStats(brokenLvl4WithTough);
        expect(healed.hp.max).toBe(44); // +8 HP (+2 * 4 levels)
        expect(healed.hp.current).toBe(44);
        expect(healed.hpAppliedFeatIds).toContain('tough');

        // Re-running regenerateCharacterStats must be 100% idempotent (never double-count!)
        const secondPass = regenerateCharacterStats(healed);
        expect(secondPass.hp.max).toBe(44);

        // 2. Already-correct Level 1 Fighter with Tough (10 + 2 CON + 2 Tough = 14) must NOT add +2 again
        const validLvl1WithTough: Character = {
            ...initialCharacter,
            class: 'Guerreiro',
            level: 1,
            hp: { current: 14, max: 14, temp: 0 },
            hitDice: { current: 1, max: 1, dieFace: 'd10' },
            attributes: {
                ...initialCharacter.attributes,
                con: { ...initialCharacter.attributes.con, value: 14, modifier: 2 }
            },
            feats: [{ id: 'tough', name: 'Vigoroso (Tough)', description: '' }]
        };
        const checkedValid = regenerateCharacterStats(validLvl1WithTough);
        expect(checkedValid.hp.max).toBe(14);
        expect(checkedValid.hpAppliedFeatIds).toContain('tough');

        // 3. Removing Tough (GM action) subtracts 2 * level cleanly
        const withoutTough = regenerateCharacterStats({ ...healed, feats: [] });
        expect(withoutTough.hp.max).toBe(36);
        expect(withoutTough.hpAppliedFeatIds).not.toContain('tough');
    });

    it('enforces D&D 5.5e Feat and Warlock Invocation prerequisites strictly at Level 4+', () => {
        const gwm = FEATS.find(f => f.id === 'great_weapon_master')!;
        const warCaster = FEATS.find(f => f.id === 'war_caster')!;
        const archeryStyle = FEATS.find(f => f.id === 'fighting_style_archery')!;
        const heavyArmorMaster = FEATS.find(f => f.id === 'heavy_armor_master')!;
        const boonFortitude = FEATS.find(f => f.id === 'boon_of_fortitude')!;
        const resilient = FEATS.find(f => f.id === 'resilient')!;

        const wizardLv4: Character = {
            ...initialCharacter,
            class: 'Mago',
            level: 4,
            attributes: {
                ...initialCharacter.attributes,
                str: { ...initialCharacter.attributes.str, value: 8, modifier: -1, saveProficiency: false },
                int: { ...initialCharacter.attributes.int, value: 17, modifier: 3, saveProficiency: true },
                wis: { ...initialCharacter.attributes.wis, value: 14, modifier: 2, saveProficiency: true }
            }
        };

        // Wizard Lv 4: cannot take GWM (STR 8 < 13), Fighting Style, Heavy Armor Master, or Lv 19 Epic Boon
        expect(checkFeatPrerequisites(gwm, wizardLv4, 4).met).toBe(false);
        expect(checkFeatPrerequisites(archeryStyle, wizardLv4, 4).met).toBe(false);
        expect(checkFeatPrerequisites(heavyArmorMaster, wizardLv4, 4).met).toBe(false);
        expect(checkFeatPrerequisites(boonFortitude, wizardLv4, 4).met).toBe(false);
        // Wizard Lv 4 CAN take War Caster (has Spellcasting)
        expect(checkFeatPrerequisites(warCaster, wizardLv4, 4).met).toBe(true);
        // Resilient excludes already-proficient INT and WIS saves
        const resilientOpts = getValidFeatAbilityOptions(resilient, wizardLv4);
        expect(resilientOpts).not.toContain('int');
        expect(resilientOpts).not.toContain('wis');
        expect(resilientOpts).toContain('con');

        const fighterLv4: Character = {
            ...initialCharacter,
            class: 'Guerreiro',
            level: 4,
            attributes: {
                ...initialCharacter.attributes,
                str: { ...initialCharacter.attributes.str, value: 16, modifier: 3 }
            }
        };
        expect(checkFeatPrerequisites(gwm, fighterLv4, 4).met).toBe(true);
        expect(checkFeatPrerequisites(archeryStyle, fighterLv4, 4).met).toBe(true);
        expect(checkFeatPrerequisites(heavyArmorMaster, fighterLv4, 4).met).toBe(true);
        expect(checkFeatPrerequisites(warCaster, fighterLv4, 4).met).toBe(false);
        expect(checkFeatPrerequisites(warCaster, { ...fighterLv4, subclass: 'Cavaleiro Arcano' }, 4).met).toBe(true);

        // Warlock Invocation prerequisites (Thirsting Blade requires Level 5+ and Pact of the Blade)
        const thirstingBlade = WARLOCK_INVOCATIONS.find(i => i.id === 'thirsting_blade')!;
        const warlockLv5: Character = { ...initialCharacter, class: 'Bruxo', level: 5, features: [] };
        expect(checkInvocationPrerequisites(thirstingBlade, warlockLv5, 5).met).toBe(false);
        expect(checkInvocationPrerequisites(thirstingBlade, warlockLv5, 5, ['pact_of_the_blade']).met).toBe(true);
    });

    it('applies Archery (+2 ranged hit) and Dueling (+2 one-handed melee damage) Fighting Styles in regenerateCharacterStats', () => {
        const archer: Character = regenerateCharacterStats({
            ...initialCharacter,
            class: 'Guerreiro',
            level: 4,
            attributes: {
                ...initialCharacter.attributes,
                dex: { ...initialCharacter.attributes.dex, value: 16, modifier: 3 },
                str: { ...initialCharacter.attributes.str, value: 16, modifier: 3 }
            },
            feats: [{ id: 'fighting_style_archery', name: 'Estilo de Luta: Arquearia (Archery)', description: '' }],
            inventory: [
                { id: 'longbow', name: 'Arco Longo', description: '', type: 'weapon', quantity: 1, weight: 1, equipped: true, damage: '1d8', range: '45/180m', properties: ['Munição', 'Pesada', 'Duas Mãos'] }
            ]
        });
        const bowAtk = archer.attacks.find(a => a.id === 'longbow');
        // DEX (+3) + PB (+2) + Archery (+2) = +7
        expect(bowAtk?.attackBonus).toBe(7);

        const duelist: Character = regenerateCharacterStats({
            ...initialCharacter,
            class: 'Guerreiro',
            level: 4,
            attributes: {
                ...initialCharacter.attributes,
                str: { ...initialCharacter.attributes.str, value: 16, modifier: 3 }
            },
            feats: [{ id: 'fighting_style_dueling', name: 'Estilo de Luta: Duelismo (Dueling)', description: '' }],
            inventory: [
                { id: 'longsword', name: 'Espada Longa', description: '', type: 'weapon', quantity: 1, weight: 1.5, equipped: true, damage: '1d8', properties: ['Versátil (1d10)'] }
            ]
        });
        const swordAtk = duelist.attacks.find(a => a.id === 'longsword');
        // STR (+3) + Dueling (+2) = +5 damage
        expect(swordAtk?.damageDice).toBe('1d8 + 5');
    });
});
