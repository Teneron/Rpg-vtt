import type { AudioTrack } from './AudioContext';

const DB_NAME = 'RPG_AudioDB';
const STORE_NAME = 'tracks';
const DB_VERSION = 1;

interface StoredTrack {
    id: string;
    title: string;
    type: 'music' | 'sfx';
    loop?: boolean;
    volume?: number;
    blob: Blob; // Store the binary data
}

export const AudioRepository = {
    openDB: (): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            };
        });
    },

    saveTrack: async (track: AudioTrack, file: File): Promise<void> => {
        const db = await AudioRepository.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const storedTrack: StoredTrack = {
                id: track.id,
                title: track.title,
                type: track.type,
                loop: track.loop,
                volume: track.volume,
                blob: file // Store the file directly
            };

            const request = store.put(storedTrack);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    getAllTracks: async (): Promise<AudioTrack[]> => {
        const db = await AudioRepository.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const stored = request.result as StoredTrack[];
                const tracks: AudioTrack[] = stored.map(s => ({
                    id: s.id,
                    title: s.title,
                    type: s.type,
                    loop: s.loop,
                    volume: s.volume,
                    url: URL.createObjectURL(s.blob) // Create fresh URL for this session
                }));
                resolve(tracks);
            };
            request.onerror = () => reject(request.error);
        });
    },

    deleteTrack: async (id: string): Promise<void> => {
        const db = await AudioRepository.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};
