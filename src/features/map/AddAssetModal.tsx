import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from './MapContext';
import { Upload } from 'lucide-react';

interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PRESETS = [
    { label: 'Barril', url: 'https://i.imgur.com/7bQ5zX0.png' },
    { label: 'Mesa', url: 'https://i.imgur.com/Kz6Z9X0.png' },
    { label: 'Baú', url: 'https://i.imgur.com/Qz7W9X0.png' },
    { label: 'Fogueira', url: 'https://i.imgur.com/5z6Z9X0.png' },
];

const MAX_PROP_DATAURL_CHARS = Math.floor(2.5 * 1024 * 1024);

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose }) => {
    const { addToken, config } = useMap();

    // Form State
    const [name, setName] = useState('Novo Asset');
    const [url, setUrl] = useState('');
    const [size, setSize] = useState(1);
    const [uploading, setUploading] = useState(false);

    if (!isOpen) return null;

    const compressAndConvertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.max(1, Math.round(height * (MAX_WIDTH / width)));
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.max(1, Math.round(width * (MAX_HEIGHT / height)));
                            height = MAX_HEIGHT;
                        }
                    }

                    const encodeWebp = (w: number, h: number, q: number): string => {
                        const canvas = document.createElement('canvas');
                        canvas.width = Math.max(1, Math.round(w));
                        canvas.height = Math.max(1, Math.round(h));
                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            throw new Error('Canvas context is null');
                        }
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        // Encode with image/webp @ 0.82 to preserve alpha transparency at ~10x smaller size than PNG
                        return canvas.toDataURL('image/webp', q);
                    };

                    try {
                        let dataUrl = encodeWebp(width, height, 0.82);

                        if (dataUrl.length > MAX_PROP_DATAURL_CHARS) {
                            dataUrl = encodeWebp(width * 0.7, height * 0.7, 0.72);
                        }

                        if (dataUrl.length > MAX_PROP_DATAURL_CHARS) {
                            reject(new Error('O arquivo do asset excedeu o limite seguro de 2,5 MB mesmo após compressão WebP. Use uma imagem menor ou cole uma URL externa.'));
                            return;
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);
        setName(file.name.split('.')[0]); // Auto-name from file

        try {
            const base64Url = await compressAndConvertToBase64(file);
            setUrl(base64Url);
        } catch (error: any) {
            console.error("Compression failed", error);
            alert(error?.message || "Erro ao processar imagem.");
            setUrl('');
            e.target.value = '';
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!url) {
            alert("Insira uma URL ou faça upload de uma imagem.");
            return;
        }

        if (url.startsWith('data:') && url.length > MAX_PROP_DATAURL_CHARS) {
            alert("A imagem em Base64 excede o limite seguro de 2,5 MB. Escolha uma imagem menor ou use uma URL externa.");
            return;
        }

        const startX = Math.floor(config.width / 2);
        const startY = Math.floor(config.height / 2);

        addToken({
            id: crypto.randomUUID(),
            name: name || 'Asset',
            position: { x: startX, y: startY },
            size: size,
            imageUrl: url,
            color: '#888888',
            visibleStats: false,
            invisible: false,
            isAsset: true,
            lightEnabled: false,
            lightRadius: 0
        });

        onClose();
        setName('Novo Asset');
        setUrl('');
    };

    return createPortal(
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            overflowY: 'auto',
            padding: '20px'
        }}>
            <div className="glass-panel" style={{
                margin: 'auto',
                width: '100%', maxWidth: '450px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '25px',
                background: '#222', border: '1px solid #444', borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}>
                <h3 style={{ marginTop: 0, color: '#ffcc00', borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '15px' }}>
                    Adicionar Asset / Prop
                </h3>

                {/* PRESETS */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {PRESETS.map((p, i) => (
                        <button key={i} type="button" onClick={() => {
                            setName(p.label);
                            setUrl(p.url);
                        }} className="glass-button small" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                            {p.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label className="label-text">Nome</label>
                        <input
                            type="text"
                            className="input-dark"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ex: Mesa de Pedra"
                        />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px', border: '1px dashed #555' }}>
                        <label className="label-text" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Upload size={14} />
                            <span>Upload de Arquivo Local</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            style={{ color: '#ccc', width: '100%' }}
                        />
                        {uploading && <div style={{ color: '#ffcc00', marginTop: '5px', fontSize: '0.9em' }}>Processando Imagem (WebP)...</div>}
                    </div>

                    <div style={{ textAlign: 'center', color: '#666', fontSize: '0.8em' }}>- OU -</div>

                    <div>
                        <label className="label-text">URL da Imagem</label>
                        <input
                            type="text"
                            className="input-dark"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://..."
                            onFocus={(e) => e.target.select()}
                        />
                    </div>

                    <div>
                        <label className="label-text">Tamanho (Quadrados)</label>
                        <select
                            className="input-dark"
                            value={size}
                            onChange={e => setSize(Number(e.target.value))}
                        >
                            <option value={0.5}>Mínimo (0.5x0.5)</option>
                            <option value={1}>Médio (1x1)</option>
                            <option value={2}>Grande (2x2)</option>
                            <option value={3}>Enorme (3x3)</option>
                            <option value={4}>Imenso (4x4)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '8px 16px', background: '#333', color: '#ccc', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer'
                        }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={uploading || !url} style={{
                            padding: '8px 16px',
                            background: (uploading || !url) ? '#444' : '#0066cc',
                            color: '#fff',
                            border: '1px solid #004488',
                            borderRadius: '4px',
                            cursor: (uploading || !url) ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}>
                            {uploading ? 'Processando...' : 'Adicionar ao Mapa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
