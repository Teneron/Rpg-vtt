import assert from 'node:assert';
import { getInitiativeBonus, rollInitiative } from './src/features/combat/combatUtils.ts';

console.log('=== RPG TABLETOP - COMBAT & INITIATIVE ENGINE TESTS ===');

// 1. Test Initiative Calculations across Different Game Systems
console.log('\n--- 1. Testing Agnostic Initiative Calculations ---');

// 1a. D&D 5e Standard
const dnd5eChar = {
    name: 'Elfo Ladino',
    attributes: {
        dex: { name: 'Destreza', value: 16, modifier: 3, saveProficiency: true }
    }
};
const bonus5e = getInitiativeBonus(dnd5eChar);
assert.strictEqual(bonus5e, 3, 'D&D 5e modifier should be +3 for DEX 16');
console.log('✓ D&D 5e DEX modifier correctly resolved (+3)');

// 1b. D&D 5e with value only (no precomputed modifier)
const dnd5eRawVal = {
    name: 'Guerreiro Humano',
    attributes: {
        dex: { name: 'Destreza', value: 14 }
    }
};
assert.strictEqual(getInitiativeBonus(dnd5eRawVal), 2, 'D&D 5e raw value 14 should compute modifier +2');
console.log('✓ D&D 5e raw value (14) computed to modifier (+2)');

// 1c. The Witcher TTRPG (REF / Reflexes)
const witcherChar = {
    name: 'Geralt de Rívia',
    stats: {
        ref: { name: 'Reflexes', value: 9 }
    }
};
assert.strictEqual(getInitiativeBonus(witcherChar), 9, 'The Witcher REF stat should be +9');
console.log('✓ The Witcher TTRPG REF attribute correctly resolved (+9)');

// 1d. Alternative / Cyberpunk System (attributes.reflexes)
const cyberpunkChar = {
    name: 'Netrunner Solo',
    attributes: {
        reflexes: { value: 8 }
    }
};
assert.strictEqual(getInitiativeBonus(cyberpunkChar), 8, 'Cyberpunk Reflexes should be +8');
console.log('✓ Cyberpunk reflexes attribute correctly resolved (+8)');

// 1e. Explicit Initiative Override
const explicitChar = {
    name: 'Bardo Ágil',
    initiative: 5,
    attributes: { dex: { value: 10 } }
};
assert.strictEqual(getInitiativeBonus(explicitChar), 5, 'Explicit initiative property takes precedence');
console.log('✓ Explicit initiative override correctly prioritized (+5)');

// 1f. Empty, malformed or alien character sheet (Never crashes!)
assert.strictEqual(getInitiativeBonus({}), 0, 'Empty character should return 0 without throwing');
assert.strictEqual(getInitiativeBonus(null), 0, 'Null character should return 0 without throwing');
assert.strictEqual(getInitiativeBonus(undefined), 0, 'Undefined character should return 0 without throwing');
assert.strictEqual(getInitiativeBonus({ randomField: 123 }), 0, 'Unknown format should return 0 without throwing');
console.log('✓ Robust fallback: Empty/null/alien structures return 0 safely without crashing');

// 1g. rollInitiative output structure
const rollRes = rollInitiative(dnd5eChar);
assert.strictEqual(typeof rollRes.roll, 'number', 'Roll must be a number');
assert.ok(rollRes.roll >= 1 && rollRes.roll <= 20, 'Roll must be within 1-20');
assert.strictEqual(rollRes.total, rollRes.roll + 3, 'Total must equal roll + bonus');
assert.ok(rollRes.formula.includes('1d20'), 'Formula must specify dice sides');
console.log(`✓ rollInitiative produced valid payload: total=${rollRes.total} (${rollRes.formula})`);

// 2. Test Combat Turn Order, Sorting & Tie-Breaking
console.log('\n--- 2. Testing Combat Order, Turn Cycling & Tie-Breaking ---');

const combatants = [
    { id: 'c1', name: 'Zumbi A', initiative: 12, bonus: 0 },
    { id: 'c2', name: 'Geralt', initiative: 20, bonus: 9 },
    { id: 'c3', name: 'Bandido', initiative: 15, bonus: 2 },
    { id: 'c4', name: 'Zumbi B', initiative: 12, bonus: 3 } // Tie with c1 on initiative, but higher bonus!
];

// Sort function matching CombatContext sort logic
function sortCombatants(list) {
    return [...list].sort((a, b) => {
        if (b.initiative !== a.initiative) {
            return b.initiative - a.initiative;
        }
        const bonusB = b.bonus ?? 0;
        const bonusA = a.bonus ?? 0;
        if (bonusB !== bonusA) {
            return bonusB - bonusA;
        }
        return a.name.localeCompare(b.name);
    });
}

const sorted = sortCombatants(combatants);
assert.strictEqual(sorted[0].name, 'Geralt', 'First should be Geralt (20)');
assert.strictEqual(sorted[1].name, 'Bandido', 'Second should be Bandido (15)');
assert.strictEqual(sorted[2].name, 'Zumbi B', 'Third should be Zumbi B (12 with bonus +3 tie-breaker)');
assert.strictEqual(sorted[3].name, 'Zumbi A', 'Fourth should be Zumbi A (12 with bonus 0)');
console.log('✓ Initiative sorting and tie-breaker by bonus verified');

// 3. Test Turn Progression & Round Rollover
console.log('\n--- 3. Testing Turn Progression & Round Rollover ---');

let combatState = {
    isActive: true,
    round: 1,
    activeTurnId: sorted[0].id,
    currentTargetId: null,
    combatants: sorted
};

function advanceTurn(state) {
    const list = state.combatants || [];
    if (list.length === 0) return state;

    const currentIndex = list.findIndex(c => c.id === state.activeTurnId);
    let nextIndex = currentIndex !== -1 ? currentIndex + 1 : 0;
    let nextRound = state.round;

    if (nextIndex >= list.length) {
        nextIndex = 0;
        nextRound++;
    }

    return {
        ...state,
        activeTurnId: list[nextIndex].id,
        round: nextRound
    };
}

// Round 1 turns
combatState = advanceTurn(combatState); // Geralt -> Bandido
assert.strictEqual(combatState.activeTurnId, 'c3');
assert.strictEqual(combatState.round, 1);

combatState = advanceTurn(combatState); // Bandido -> Zumbi B
assert.strictEqual(combatState.activeTurnId, 'c4');
assert.strictEqual(combatState.round, 1);

combatState = advanceTurn(combatState); // Zumbi B -> Zumbi A
assert.strictEqual(combatState.activeTurnId, 'c1');
assert.strictEqual(combatState.round, 1);

// End of round: Zumbi A -> Geralt (Round 2)
combatState = advanceTurn(combatState);
assert.strictEqual(combatState.activeTurnId, 'c2');
assert.strictEqual(combatState.round, 2);
console.log('✓ Turn progression completed full cycle and rolled over to Round 2');

// 4. Test Target Selection & Removal
console.log('\n--- 4. Testing Target Selection & Resilient Removal ---');

// Set target to Zumbi B (c4)
combatState.currentTargetId = 'c4';
assert.strictEqual(combatState.currentTargetId, 'c4', 'Target set to c4');

// Remove combatant c4
function removeCombatant(state, idToRemove) {
    const remaining = state.combatants.filter(c => c.id !== idToRemove);
    let nextActiveTurnId = state.activeTurnId;
    if (state.activeTurnId === idToRemove) {
        nextActiveTurnId = remaining.length > 0 ? remaining[0].id : null;
    }
    const nextTargetId = state.currentTargetId === idToRemove ? null : state.currentTargetId;
    return {
        ...state,
        combatants: remaining,
        activeTurnId: nextActiveTurnId,
        currentTargetId: nextTargetId
    };
}

combatState = removeCombatant(combatState, 'c4');
assert.strictEqual(combatState.combatants.length, 3, 'Combatant list reduced to 3');
assert.strictEqual(combatState.currentTargetId, null, 'Target cleared automatically when targeted combatant was removed');
console.log('✓ Target automatically cleared upon combatant removal');

// Remove currently active combatant (c2)
combatState = removeCombatant(combatState, 'c2');
assert.strictEqual(combatState.activeTurnId, 'c3', 'Active turn fallback safely moved to next remaining combatant');
console.log('✓ Active turn fallback safely transitioned upon active combatant removal');

console.log('\n🎉 ALL COMBAT & INITIATIVE ENGINE TESTS PASSED SUCCESSFULLY!\n');
