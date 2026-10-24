/**
 * Compresses an image file to a Base64 string with a target size limit.
 * Used to ensure map backgrounds don't exceed Socket.io / IndexedDB payload limits.
 */
export const compressImage = (file: File, maxWidth = 2048, quality = 0.7, maxSizeBytes = 3000000): Promise<string> => {
    const HARD_MAX_CHARS = Math.floor(3.5 * 1024 * 1024);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                try {
                    let currentWidth = img.width;
                    let currentHeight = img.height;
                    let currentQuality = quality;

                    // Clamp initial dimensions to maxWidth preserving aspect ratio
                    if (currentWidth > maxWidth || currentHeight > maxWidth) {
                        if (currentWidth >= currentHeight) {
                            currentHeight = Math.max(1, Math.round((maxWidth / currentWidth) * currentHeight));
                            currentWidth = maxWidth;
                        } else {
                            currentWidth = Math.max(1, Math.round((maxWidth / currentHeight) * currentWidth));
                            currentHeight = maxWidth;
                        }
                    }

                    const attemptCompression = (w: number, h: number, q: number): string => {
                        const canvas = document.createElement('canvas');
                        canvas.width = Math.max(1, Math.round(w));
                        canvas.height = Math.max(1, Math.round(h));
                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            throw new Error('Canvas context not available');
                        }
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        return canvas.toDataURL('image/jpeg', q);
                    };

                    // Iterative compression
                    let dataUrl = attemptCompression(currentWidth, currentHeight, currentQuality);

                    // Max 5 attempts to reduce size
                    let attempts = 0;
                    while (dataUrl.length > maxSizeBytes && attempts < 5) {
                        attempts++;
                        currentWidth = Math.max(64, Math.floor(currentWidth * 0.8));
                        currentHeight = Math.max(64, Math.floor(currentHeight * 0.8));
                        currentQuality = Math.max(0.3, currentQuality - 0.1);

                        console.log(`[ImageUtils] Image too large (${dataUrl.length} chars). Retrying: ${currentWidth}x${currentHeight} @ ${currentQuality.toFixed(1)}`);
                        dataUrl = attemptCompression(currentWidth, currentHeight, currentQuality);
                    }

                    // Final hard guard: never return > 3.5 MB string that would break WebSocket frames
                    if (dataUrl.length > HARD_MAX_CHARS) {
                        currentWidth = Math.max(64, Math.floor(currentWidth * 0.7));
                        currentHeight = Math.max(64, Math.floor(currentHeight * 0.7));
                        currentQuality = Math.max(0.25, currentQuality * 0.8);
                        dataUrl = attemptCompression(currentWidth, currentHeight, currentQuality);
                    }

                    if (dataUrl.length > HARD_MAX_CHARS) {
                        reject(new Error('A imagem é grande demais mesmo após compressão (limite máximo: 3,5 MB). Use uma imagem menor ou cole uma URL externa.'));
                        return;
                    }

                    if (dataUrl.length > maxSizeBytes) {
                        console.warn(`[ImageUtils] Compressed above soft target but within safe limit. Final size: ${dataUrl.length}`);
                    } else {
                        console.log(`[ImageUtils] Compression successful. Final size: ${dataUrl.length} (Attempts: ${attempts})`);
                    }

                    resolve(dataUrl);
                } catch (err) {
                    reject(err);
                }
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
