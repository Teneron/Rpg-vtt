
/**
 * Compresses an image file to a Base64 string with a target size limit.
 * Used to ensure map backgrounds don't exceed Firebase payload limits.
 */
export const compressImage = (file: File, maxWidth = 2048, quality = 0.7, maxSizeBytes = 3000000): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                let currentWidth = img.width;
                let currentHeight = img.height;
                let currentQuality = quality;

                const attemptCompression = (w: number, h: number, q: number): string => {
                    const canvas = document.createElement('canvas');
                    // Ensure aspect ratio is maintained if we clamped dimensions
                    if (w > maxWidth) {
                        h = (maxWidth / w) * h;
                        w = maxWidth;
                    }

                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        throw new Error('Canvas context not available');
                    }
                    ctx.drawImage(img, 0, 0, w, h);
                    return canvas.toDataURL('image/jpeg', q);
                };

                // Iterative compression
                let dataUrl = attemptCompression(currentWidth, currentHeight, currentQuality);

                // Max 5 attempts to reduce size
                let attempts = 0;
                while (dataUrl.length > maxSizeBytes && attempts < 5) {
                    attempts++;
                    // Reduce dimensions by 20% and quality by 10% each step
                    // But don't go too small too fast
                    currentWidth = Math.floor(currentWidth * 0.8);
                    currentHeight = Math.floor(currentHeight * 0.8);
                    currentQuality = Math.max(0.3, currentQuality - 0.1);

                    console.log(`[ImageUtils] Image too large (${dataUrl.length} bytes). Retrying: ${currentWidth}x${currentHeight} @ ${currentQuality.toFixed(1)}`);
                    dataUrl = attemptCompression(currentWidth, currentHeight, currentQuality);
                }

                if (dataUrl.length > maxSizeBytes) {
                    console.warn(`[ImageUtils] Could not compress image below target size. Final size: ${dataUrl.length}`);
                } else {
                    console.log(`[ImageUtils] Compression successful. Final size: ${dataUrl.length} (Attempts: ${attempts})`);
                }

                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
