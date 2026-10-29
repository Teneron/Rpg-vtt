import { describe, it, expect } from 'vitest';
import { CLASSES } from './classes';
import {
    normalizeClassId,
    getProficiencyBonus,
    getAsiLevels,
    isAsiLevel,
    getSubclassLevel,
    getSpellSlotsForLevel,
    getCantripsKnownCount,
    getSpellsPreparedCount,
    getClassResourcesForLevel,
    getFeaturesForLevel,
    getFeaturesUpToLevel
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
});
