import 'fake-indexeddb/auto';
import { Dexie } from 'dexie';

console.log('=== RPG TABLETOP - INDEXEDDB & STORAGE TEST ===');

async function runTests() {
    // 1. Initialize Dexie Database matching RPGDatabase schema
    const testDb = new Dexie('RPG_Tabletop_DB_Test');
    testDb.version(1).stores({
        campaigns: 'id, name, createdAt, updatedAt',
        maps: '++id, campaignId',
        scenes: 'id, campaignId',
        assets: '++id, campaignId, type'
    });

    testDb.version(2).stores({
        campaigns: 'id, name, createdAt, updatedAt',
        maps: '++id, campaignId',
        scenes: 'id, campaignId',
        assets: '++id, campaignId, type',
        characters: 'id, name, owner, adventureId, lastModified',
        customMonsters: 'id, name, category, source, cr',
        rollLogs: 'id, campaignId, timestamp, playerName'
    });

    await testDb.open();
    console.log('✓ Dexie v2 opened successfully with all 7 stores');

    // 2. Test Character CRUD
    const sampleChar = {
        id: 'char-uuid-1',
        name: 'Geralt de Rívia',
        race: 'Humano Mutado',
        class: 'Bruxo',
        level: 5,
        owner: 'blakm',
        adventureId: 'adv-default',
        lastModified: Date.now(),
        attributes: {
            str: { name: 'FOR', value: 16, modifier: 3, saveProficiency: true },
            dex: { name: 'DES', value: 18, modifier: 4, saveProficiency: true },
            con: { name: 'CON', value: 16, modifier: 3, saveProficiency: false },
            int: { name: 'INT', value: 14, modifier: 2, saveProficiency: false },
            wis: { name: 'SAB', value: 12, modifier: 1, saveProficiency: false },
            cha: { name: 'CAR', value: 10, modifier: 0, saveProficiency: false }
        }
    };

    await testDb.characters.put(sampleChar);
    const loadedChar = await testDb.characters.get('char-uuid-1');
    if (!loadedChar || loadedChar.name !== 'Geralt de Rívia') {
        throw new Error('Failed to retrieve character from Dexie');
    }
    console.log('✓ Character created and retrieved:', loadedChar.name);

    // Query by owner and adventureId
    const foundChars = await testDb.characters
        .where('owner').equals('blakm')
        .and(c => c.adventureId === 'adv-default')
        .toArray();
    if (foundChars.length !== 1) {
        throw new Error(`Expected 1 character for owner blakm, found ${foundChars.length}`);
    }
    console.log('✓ Character indexed query by owner and adventureId succeeded');

    // 3. Test Custom Monsters CRUD
    const sampleMonster = {
        id: 'monster-custom-1',
        name: 'Grifo Real',
        category: 'Híbrido',
        source: 'Custom',
        cr: 6,
        hp: { current: 120, max: 120 },
        ac: 15,
        speed: 18,
        actions: [{ id: 'a1', name: 'Bicada Dilacerante', type: 'melee', description: 'Ataque cortante letal' }]
    };

    await testDb.customMonsters.put(sampleMonster);
    const loadedMonster = await testDb.customMonsters.get('monster-custom-1');
    if (!loadedMonster || loadedMonster.name !== 'Grifo Real') {
        throw new Error('Failed to retrieve custom monster from Dexie');
    }
    console.log('✓ Custom Monster created and retrieved:', loadedMonster.name);

    // 4. Test Roll Logs
    const sampleRoll = {
        id: 'roll-12345',
        campaignId: 'adv-default',
        total: 24,
        dice: [{ type: 'd20', value: 20 }, { type: 'd4', value: 4 }],
        timestamp: Date.now(),
        playerName: 'Mestre',
        label: 'Ataque com Espada de Prata'
    };

    await testDb.rollLogs.put(sampleRoll);
    const loadedRoll = await testDb.rollLogs.get('roll-12345');
    if (!loadedRoll || loadedRoll.total !== 24) {
        throw new Error('Failed to retrieve roll log from Dexie');
    }
    console.log('✓ Roll log stored and retrieved successfully in rollLogs table');

    // 5. Test Simulated Migration from localStorage
    const mockLocalStorage = {
        'rpg_char_leg-1': JSON.stringify({
            id: 'leg-1',
            name: 'Yennefer de Vengerberg',
            race: 'Meia-Elfa',
            class: 'Feiticeira',
            level: 10,
            owner: 'blakm',
            adventureId: 'adv-default'
        }),
        'rpg_custom_monsters': JSON.stringify([
            { id: 'mon-leg-1', name: 'Katakan Ancião', category: 'Vampiro', source: 'Custom', cr: 8 }
        ])
    };

    // Run migration routine
    const migratedChars = [];
    for (const [key, val] of Object.entries(mockLocalStorage)) {
        if (key.startsWith('rpg_char_') && !key.startsWith('rpg_char_index')) {
            migratedChars.push(JSON.parse(val));
        }
    }
    await testDb.characters.bulkPut(migratedChars);

    const migratedMonsters = JSON.parse(mockLocalStorage['rpg_custom_monsters']);
    await testDb.customMonsters.bulkPut(migratedMonsters);

    const checkYennefer = await testDb.characters.get('leg-1');
    const checkKatakan = await testDb.customMonsters.get('mon-leg-1');

    if (!checkYennefer || checkYennefer.name !== 'Yennefer de Vengerberg') {
        throw new Error('Legacy character migration failed');
    }
    if (!checkKatakan || checkKatakan.name !== 'Katakan Ancião') {
        throw new Error('Legacy monster migration failed');
    }

    console.log('✓ Migration of legacy characters and monsters succeeded without data loss');

    // 6. Test Delete
    await testDb.characters.delete('char-uuid-1');
    const deletedChar = await testDb.characters.get('char-uuid-1');
    if (deletedChar) {
        throw new Error('Character deletion failed');
    }
    console.log('✓ Character deletion validated in IndexedDB');

    await testDb.close();
    console.log('\n>>> ALL INDEXEDDB & STORAGE TESTS PASSED SUCCESSFULLY! <<<');
}

runTests().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
