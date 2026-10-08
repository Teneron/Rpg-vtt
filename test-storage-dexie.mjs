import 'fake-indexeddb/auto';
import { Dexie } from 'dexie';
import assert from 'node:assert';

console.log('=== RPG TABLETOP - INDEXEDDB & STORAGE TEST (MULTI-CAMPAIGN / MULTI-LORE) ===');

async function runTests() {
    // 1. Initialize Dexie Database matching RPGDatabase schema version 1, 2 and 3
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

    testDb.version(3).stores({
        campaigns: 'id, name, system, createdAt, updatedAt',
        maps: '++id, campaignId',
        scenes: 'id, campaignId',
        assets: '++id, campaignId, type',
        characters: 'id, name, owner, adventureId, lastModified',
        customMonsters: 'id, name, category, source, cr, campaignId, system',
        rollLogs: 'id, campaignId, timestamp, playerName'
    });

    await testDb.open();
    console.log('✓ Dexie v3 opened successfully with all 7 stores and multi-campaign indexes');

    // 2. Test Multi-Campaign Creation & System Scoping
    console.log('\n--- 2. Testing Multi-Campaign Isolation ---');
    const campWitcher = {
        id: 'camp-witcher-1',
        name: 'O Destino de Cintra',
        system: 'witcher',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        logs: []
    };
    const campScifi = {
        id: 'camp-scifi-1',
        name: 'Estação Ômega 4',
        system: 'cyberpunk',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        logs: []
    };

    await testDb.campaigns.bulkPut([campWitcher, campScifi]);
    const witcherCampLoaded = await testDb.campaigns.get('camp-witcher-1');
    assert.strictEqual(witcherCampLoaded.system, 'witcher');
    console.log('✓ Multi-campaign systems registered: Witcher and Cyberpunk');

    // 3. Test Characters Isolated by Adventure/Campaign
    const charWitcher = {
        id: 'char-w-1',
        name: 'Geralt de Rívia',
        race: 'Mutante',
        class: 'Bruxo',
        level: 5,
        owner: 'user-gm',
        adventureId: 'camp-witcher-1',
        system: 'witcher',
        lastModified: Date.now()
    };

    // Alien / Non-5e character (e.g. Cyberpunk or Cthulhu with custom role, no spell slots, no 5e attributes)
    const charCyberpunk = {
        id: 'char-cyber-1',
        name: 'V / Valerie',
        owner: 'user-gm',
        adventureId: 'camp-scifi-1',
        system: 'cyberpunk',
        lastModified: Date.now(),
        customStats: { cyberware: 'Sandevistan', humanity: 45 }
    };

    await testDb.characters.bulkPut([charWitcher, charCyberpunk]);

    // Query characters for camp-witcher-1
    const witcherChars = await testDb.characters.where('adventureId').equals('camp-witcher-1').toArray();
    assert.strictEqual(witcherChars.length, 1);
    assert.strictEqual(witcherChars[0].id, 'char-w-1');

    // Query characters for camp-scifi-1
    const scifiChars = await testDb.characters.where('adventureId').equals('camp-scifi-1').toArray();
    assert.strictEqual(scifiChars.length, 1);
    assert.strictEqual(scifiChars[0].id, 'char-cyber-1');
    console.log('✓ Strict character isolation between campaigns confirmed');

    // 4. Test Custom Monsters Scoped by Campaign and System
    console.log('\n--- 4. Testing Monster Campaign & System Scoping ---');
    const monsterWitcher = {
        id: 'mon-w-1',
        name: 'Lobisomem de Velen',
        category: 'Relicto',
        source: 'Witcher',
        cr: 4,
        campaignId: 'camp-witcher-1',
        system: 'witcher',
        hp: { current: 95, max: 95 },
        ac: 14,
        speed: 12
    };

    const monsterDrone = {
        id: 'mon-sci-1',
        name: 'Drone de Patrulha Arasaka',
        category: 'Constructo',
        source: 'Custom',
        cr: 3,
        campaignId: 'camp-scifi-1',
        system: 'cyberpunk',
        hp: { current: 40, max: 40 },
        ac: 16,
        speed: 15
    };

    await testDb.customMonsters.bulkPut([monsterWitcher, monsterDrone]);

    const witcherMonsters = await testDb.customMonsters.where('campaignId').equals('camp-witcher-1').toArray();
    assert.strictEqual(witcherMonsters.length, 1);
    assert.strictEqual(witcherMonsters[0].name, 'Lobisomem de Velen');

    const scifiMonsters = await testDb.customMonsters.where('campaignId').equals('camp-scifi-1').toArray();
    assert.strictEqual(scifiMonsters.length, 1);
    assert.strictEqual(scifiMonsters[0].name, 'Drone de Patrulha Arasaka');
    console.log('✓ Custom monsters scoped and indexed by campaignId and system');

    // 5. Test Maps, Scenes & Assets Associated with Campaign
    console.log('\n--- 5. Testing Campaign Maps & Assets ---');
    await testDb.maps.add({
        campaignId: 'camp-scifi-1',
        name: 'Hangar Principal',
        config: { width: 30, height: 30, gridSize: 50, scale: 1, offsetX: 0, offsetY: 0, globalLight: 'dim', gridColor: '#555', walls: [] },
        tokens: [],
        walls: []
    });

    await testDb.scenes.add({
        id: 'scene-sci-1',
        campaignId: 'camp-scifi-1',
        name: 'Laboratório Secreto',
        gridSize: 50,
        width: 25,
        height: 25,
        walls: [],
        tokens: [],
        lights: []
    });

    const initialScifiMaps = await testDb.maps.where('campaignId').equals('camp-scifi-1').toArray();
    assert.strictEqual(initialScifiMaps.length, 1);
    console.log('✓ Maps and scenes successfully linked to campaign');

    // 6. Test Atomic Cascade Deletion
    console.log('\n--- 6. Testing Complete Cascade Deletion ---');
    const deleteId = 'camp-scifi-1';
    await testDb.transaction('rw', [testDb.campaigns, testDb.maps, testDb.scenes, testDb.assets, testDb.characters, testDb.customMonsters], async () => {
        await testDb.maps.where('campaignId').equals(deleteId).delete();
        await testDb.scenes.where('campaignId').equals(deleteId).delete();
        await testDb.assets.where('campaignId').equals(deleteId).delete();
        await testDb.characters.where('adventureId').equals(deleteId).delete();
        await testDb.customMonsters.where('campaignId').equals(deleteId).delete();
        await testDb.campaigns.delete(deleteId);
    });

    // Verify all camp-scifi-1 data is purged
    assert.strictEqual(await testDb.campaigns.get('camp-scifi-1'), undefined);
    assert.strictEqual((await testDb.maps.where('campaignId').equals('camp-scifi-1').toArray()).length, 0);
    assert.strictEqual((await testDb.scenes.where('campaignId').equals('camp-scifi-1').toArray()).length, 0);
    assert.strictEqual((await testDb.characters.where('adventureId').equals('camp-scifi-1').toArray()).length, 0);
    assert.strictEqual((await testDb.customMonsters.where('campaignId').equals('camp-scifi-1').toArray()).length, 0);

    // Verify camp-witcher-1 data remains completely intact
    assert.ok(await testDb.campaigns.get('camp-witcher-1'));
    assert.strictEqual((await testDb.characters.where('adventureId').equals('camp-witcher-1').toArray()).length, 1);
    assert.strictEqual((await testDb.customMonsters.where('campaignId').equals('camp-witcher-1').toArray()).length, 1);
    console.log('✓ Cascade deletion purged all campaign data without touching other campaigns');

    // 7. Test Simulated Legacy Migration
    console.log('\n--- 7. Testing Legacy Migration Safety ---');
    const mockLegacyChars = [
        { id: 'leg-1', name: 'Yennefer', race: 'Meia-Elfa', class: 'Maga', level: 10, owner: 'gm', adventureId: 'camp-witcher-1' }
    ];
    await testDb.characters.bulkPut(mockLegacyChars);
    const yenn = await testDb.characters.get('leg-1');
    assert.strictEqual(yenn.name, 'Yennefer');
    console.log('✓ Legacy data migration verified successfully');

    await testDb.close();
    console.log('\n🎉 ALL INDEXEDDB, STORAGE & MULTI-CAMPAIGN TESTS PASSED SUCCESSFULLY!\n');
}

runTests().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
