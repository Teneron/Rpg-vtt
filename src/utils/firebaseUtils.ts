
/**
 * Recursively removes undefined values from an object or array.
 * Firebase Realtime Database throws an error if any value is 'undefined'.
 * It also converts empty arrays to null (or [] if preferred, but Firebase stores [] as null).
 */
export function sanitizePayload<T>(data: T): T {
    if (data === undefined) return null as any;
    if (data === null) return null as any;

    if (Array.isArray(data)) {
        // Recursively sanitize items
        const saneArray = data.map(item => sanitizePayload(item));
        // Optional: Filter out nulls if you want sparse arrays to close gaps?
        // But for things like equipment indexes, we might want to keep the structure.
        // For MapTokens, gaps are probably bad.
        // Let's just return the sanitized array. Firebase treats undefined in array as null.
        return saneArray as any;
    }

    if (typeof data === 'object') {
        const result: any = {};
        Object.keys(data).forEach(key => {
            const val = (data as any)[key];
            if (val !== undefined) {
                result[key] = sanitizePayload(val);
            }
        });
        return result;
    }

    return data;
}
