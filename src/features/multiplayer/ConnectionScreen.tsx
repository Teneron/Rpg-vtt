import React, { useState, useEffect } from 'react';
import {
    Swords,
    Crown,
    BookOpen,
    Scroll,
    Settings,
    Globe,
    Copy,
    Check,
    Link2,
    Play,
    Trash2,
    RefreshCw,
    AlertTriangle,
    Users,
    Key,
    Loader2
} from 'lucide-react';
import { usePeer } from './FirebaseContext';
import { useAdventure } from '../adventure/AdventureContext';
import { GAME_SYSTEMS, getGameSystem } from '../systems/gameSystems';
import './ConnectionScreen.css';

interface ConnectionScreenProps {
    onStartGame: () => void;
    onOpenPlayerRules?: () => void;
    onOpenGMRules?: () => void;
}

// Gera código de sala limpo e padronizado (Ex: DND-8K2P ou WTC-7M4R)
const generateRoomCode = (systemId: string = 'dnd55e'): string => {
    const prefix = systemId === 'witcher' ? 'WTC' : 'DND';
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${code}`;
};

export const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ onStartGame, onOpenPlayerRules, onOpenGMRules }) => {
    const { startHosting, connectToHost, peerId, connections, peerError, currentAdventureId, serverUrl, setServerUrl, isConnecting: isPeerConnecting, isConnected } = usePeer();
    const { adventures, createAdventure, loadAdventure, deleteAdventure, closeAdventure, currentAdventure } = useAdventure();

    // Mode States
    const [mode, setMode] = useState<'role-selection' | 'gm-login' | 'gm-setup' | 'player-setup' | 'host' | 'join' | 'gm-rules-auth'>('role-selection');

    // System Selection State (Padrão D&D 5.5e)
    const [selectedSystemId, setSelectedSystemId] = useState<string>(() => {
        return localStorage.getItem('rpg_selected_system') || 'dnd55e';
    });
    const selectedSystem = getGameSystem(selectedSystemId);

    // Form States
    const [name, setName] = useState('');
    const [targetId, setTargetId] = useState('');
    const [gmPassword, setGmPassword] = useState('');
    const [advName, setAdvName] = useState('');
    const [copied, setCopied] = useState(false);
    const [copiedInviteLink, setCopiedInviteLink] = useState(false);
    const [copiedRoomCode, setCopiedRoomCode] = useState(false);
    const [isUrlCodeApplied, setIsUrlCodeApplied] = useState(false);

    // Persistent Room Code for GM Setup (mantém o mesmo código entre recarregamentos e sessões)
    const [customRoomCode, setCustomRoomCode] = useState<string>(() => {
        const sys = localStorage.getItem('rpg_selected_system') || 'dnd55e';
        const savedSys = localStorage.getItem(`rpg_gm_room_code_${sys}`) || localStorage.getItem('rpg_last_room_code');
        if (savedSys) return savedSys;
        const generated = generateRoomCode(sys);
        localStorage.setItem(`rpg_gm_room_code_${sys}`, generated);
        localStorage.setItem('rpg_last_room_code', generated);
        return generated;
    });

    // Check for room invite code in URL (?sala=... ou ?room=... ou ?code=...)
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const roomFromUrl = params.get('sala') || params.get('room') || params.get('code');
            if (roomFromUrl) {
                const cleanCode = roomFromUrl.trim().toUpperCase();
                setTargetId(cleanCode);
                setIsUrlCodeApplied(true);
                setMode('player-setup');
            }
        } catch (e) {
            console.error('Error parsing URL params for room code:', e);
        }
    }, []);

    // Server URL Config Modal State
    const [showServerConfig, setShowServerConfig] = useState(false);
    const [tempServerUrl, setTempServerUrl] = useState(serverUrl);
    const [urlFeedback, setUrlFeedback] = useState<string | null>(null);

    // Loading State
    const [isConnecting, setIsConnecting] = useState(false);

    const handleSelectSystem = (sysId: string) => {
        setSelectedSystemId(sysId);
        localStorage.setItem('rpg_selected_system', sysId);
        // Carrega o código persistente daquele universo, ou gera um novo mantendo-o salvo
        const saved = localStorage.getItem(`rpg_gm_room_code_${sysId}`);
        if (saved) {
            setCustomRoomCode(saved);
        } else {
            const newCode = generateRoomCode(sysId);
            setCustomRoomCode(newCode);
            localStorage.setItem(`rpg_gm_room_code_${sysId}`, newCode);
            localStorage.setItem('rpg_last_room_code', newCode);
        }
    };

    const handleRoomCodeChange = (newCode: string) => {
        const upper = newCode.trim().toUpperCase();
        setCustomRoomCode(upper);
        localStorage.setItem(`rpg_gm_room_code_${selectedSystemId}`, upper);
        localStorage.setItem('rpg_last_room_code', upper);
    };

    const handleGenerateNewCode = () => {
        const newCode = generateRoomCode(selectedSystem.id);
        setCustomRoomCode(newCode);
        localStorage.setItem(`rpg_gm_room_code_${selectedSystem.id}`, newCode);
        localStorage.setItem('rpg_last_room_code', newCode);
    };

    const handleSaveServerUrl = () => {
        const clean = tempServerUrl.trim();
        if (!clean) return alert('Por favor, informe uma URL válida.');
        setServerUrl(clean);
        setUrlFeedback('Endereço do servidor salvo!');
        setTimeout(() => setUrlFeedback(null), 2500);
        setShowServerConfig(false);
    };

    const checkGmPassword = () => {
        if (gmPassword === 'mestre' || gmPassword === 'admin') {
            if (mode === 'gm-rules-auth') {
                if (onOpenGMRules) onOpenGMRules();
            } else {
                setMode('gm-setup');
            }
        } else {
            alert('Senha incorreta! Tente "mestre" ou "admin".');
        }
    };

    const handleHost = async () => {
        if (!name.trim()) return alert('Digite seu nome de Mestre!');

        const finalCode = (customRoomCode.trim().toUpperCase()) || generateRoomCode(selectedSystem.id);

        // Persiste o código da sala utilizado para garantir que seja mantido nas próximas sessões
        localStorage.setItem(`rpg_gm_room_code_${selectedSystem.id}`, finalCode);
        localStorage.setItem('rpg_last_room_code', finalCode);
        localStorage.setItem('rpg_selected_system', selectedSystem.id);

        let activeAdvName = advName.trim();
        const existingAdv = adventures.find(a => a.id === finalCode);

        if (existingAdv) {
            await loadAdventure(finalCode);
            activeAdvName = existingAdv.name;
        } else if (!currentAdventure || currentAdventure.id !== finalCode) {
            const advTitle = advName.trim() || `Campanha ${selectedSystem.name.split('(')[0].trim()} [${finalCode}]`;
            const newAdv = await createAdventure(advTitle, selectedSystem.id, finalCode);
            activeAdvName = newAdv.name;
        } else {
            activeAdvName = currentAdventure.name;
        }

        console.log('Starting host with Adventure ID / Room Code:', finalCode, 'System:', selectedSystem.id);

        const advNameDisplay = activeAdvName || `${selectedSystem.name} [${finalCode}]`;
        await startHosting(name.trim(), finalCode, advNameDisplay, selectedSystem.id);
        setMode('host');
    };

    const handleJoin = async () => {
        if (!name.trim() || !targetId.trim()) return alert('Digite Nome e Código da Sala!');
        if (isConnecting) return;

        setIsConnecting(true);
        try {
            connectToHost(targetId.trim().toUpperCase(), name.trim());
            setTimeout(() => setIsConnecting(false), 5000);
        } catch (e) {
            setIsConnecting(false);
        }
    };

    const copyCode = () => {
        const codeToCopy = currentAdventureId || customRoomCode || peerId;
        if (!codeToCopy) return;
        navigator.clipboard.writeText(codeToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const copyInviteLink = () => {
        const codeToCopy = currentAdventureId || customRoomCode || peerId;
        if (!codeToCopy) return;
        const inviteUrl = `${window.location.origin}${window.location.pathname}?sala=${encodeURIComponent(codeToCopy)}`;
        navigator.clipboard.writeText(inviteUrl);
        setCopiedInviteLink(true);
        setTimeout(() => setCopiedInviteLink(false), 2500);
    };

    const ErrorDisplay = () => peerError ? (
        <div style={{ marginTop: '16px', color: '#ff6b6b', background: 'rgba(50,0,0,0.6)', padding: '10px 16px', borderRadius: '8px', border: '1px solid #ff4444', textAlign: 'center', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <AlertTriangle size={16} />
            <span>{peerError}</span>
        </div>
    ) : null;

    // --- RENDER MODAL SERVIDOR ---
    const renderServerModal = () => {
        if (!showServerConfig) return null;
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10001, backdropFilter: 'blur(6px)'
            }}>
                <div style={{
                    background: '#181824', border: '1px solid #444', borderRadius: '16px',
                    padding: '28px', maxWidth: '480px', width: '90%', color: '#fff',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.7)'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Cinzel, serif' }}>
                        <Globe size={18} color="#ffd700" />
                        <span>Configurar Servidor de Rede</span>
                    </h3>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.4 }}>
                        Defina a URL do servidor Socket.io para multiplayer local (LAN) ou na nuvem (Vercel/Render).
                    </p>
                    <input
                        type="text"
                        style={{
                            width: '100%', padding: '12px', background: '#0e0e14', border: '1px solid #555',
                            color: '#fff', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box',
                            marginBottom: '12px', fontFamily: 'monospace'
                        }}
                        value={tempServerUrl}
                        onChange={(e) => setTempServerUrl(e.target.value)}
                        placeholder="http://localhost:3001"
                    />
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                        <button
                            type="button"
                            onClick={() => setTempServerUrl('http://localhost:3001')}
                            style={{ background: '#252535', border: '1px solid #444', color: '#ccc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Localhost (3001)
                        </button>
                        <button
                            type="button"
                            onClick={() => setTempServerUrl(`http://${window.location.hostname}:3001`)}
                            style={{ background: '#252535', border: '1px solid #444', color: '#ccc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            IP Local ({window.location.hostname}:3001)
                        </button>
                        <button
                            type="button"
                            onClick={() => setTempServerUrl(window.location.origin)}
                            style={{ background: '#252535', border: '1px solid #444', color: '#ccc', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Origem Web Atual
                        </button>
                    </div>
                    {urlFeedback && <div style={{ color: '#4caf50', fontSize: '0.85rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} /> {urlFeedback}</div>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={() => setShowServerConfig(false)}
                            style={{ background: '#333', border: 'none', color: '#fff', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveServerUrl}
                            style={{ background: '#950740', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Salvar e Aplicar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- RENDER BOTÃO SERVIDOR FLUTUANTE ---
    const renderServerButton = () => (
        <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 10000 }}>
            <button
                type="button"
                onClick={() => {
                    setTempServerUrl(serverUrl);
                    setShowServerConfig(true);
                }}
                style={{
                    background: 'rgba(20, 20, 30, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffd700',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                    transition: 'all 0.2s ease'
                }}
                title="Configurar servidor de rede"
            >
                <Globe size={15} color="#ffd700" />
                <span>Servidor: <strong style={{ color: isConnected ? '#4caf50' : '#ffb74d' }}>{serverUrl.replace(/^https?:\/\//, '')}</strong></span>
                <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: isConnected ? '#4caf50' : '#ffb74d',
                    display: 'inline-block',
                    boxShadow: isConnected ? '0 0 8px #4caf50' : 'none'
                }} />
            </button>
        </div>
    );

    // --- CORPO DA TELA CONFORME O MODO ---
    const renderBody = () => {
        // 1. Role & Universe Selection (TELA PRINCIPAL)
        if (mode === 'role-selection') {
            return (
                <div className="connection-content">
                    {/* Header Superior */}
                    <header className="connection-header">
                        <div className="brand-title">
                            <Swords size={26} color="#c5a059" />
                            <div>
                                <h1>RPG Tabletop VTT</h1>
                                <span className="brand-subtitle">VIRTUAL TABLETOP MULTI-SISTEMA</span>
                            </div>
                        </div>

                        <div className="header-actions">
                            {onOpenPlayerRules && (
                                <button type="button" className="nav-link-btn" onClick={onOpenPlayerRules} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <BookOpen size={14} /> Livro do Jogador
                                </button>
                            )}
                            {onOpenGMRules && (
                                <button type="button" className="nav-link-btn" onClick={() => setMode('gm-rules-auth')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <Scroll size={14} /> Livro do Mestre
                                </button>
                            )}
                            <button
                                type="button"
                                className="nav-link-btn"
                                onClick={() => {
                                    setTempServerUrl(serverUrl);
                                    setShowServerConfig(true);
                                }}
                                style={{ borderColor: 'rgba(255, 215, 0, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Settings size={14} /> Servidor
                            </button>
                        </div>
                    </header>

                    {/* Hero Section */}
                    <section className="hero-section">
                        <h2 className="hero-title">Universos & Modos de Jogo</h2>
                        <p className="hero-description">
                            Escolha a ambientação para iniciar sua campanha ou conecte-se a uma mesa em andamento.
                            O VTT ajusta o combate, fichas e atmosfera automaticamente.
                        </p>
                    </section>

                    {/* Grade de Cards Temáticos */}
                    <div className="systems-grid">
                        {GAME_SYSTEMS.map(sys => {
                            const isSelected = sys.id === selectedSystemId;
                            return (
                                <div
                                    key={sys.id}
                                    className={`system-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelectSystem(sys.id)}
                                    style={{
                                        background: sys.bgGradient,
                                        border: `2px solid ${isSelected ? sys.accentColor : 'rgba(255,255,255,0.1)'}`,
                                        boxShadow: isSelected ? `0 0 25px ${sys.glowColor}` : '0 4px 15px rgba(0,0,0,0.4)'
                                    }}
                                >
                                    {/* Indicador de Seleção */}
                                    {isSelected && (
                                        <div
                                            className="card-selected-indicator"
                                            style={{ background: sys.accentColor, color: '#000', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <Check size={12} strokeWidth={3} />
                                            <span>ATIVO</span>
                                        </div>
                                    )}

                                    {/* Top Badge */}
                                    <div
                                        className="card-badge"
                                        style={{
                                            background: `${sys.accentColor}25`,
                                            color: sys.accentColor,
                                            border: `1px solid ${sys.accentColor}55`
                                        }}
                                    >
                                        <span>{sys.badgeText}</span>
                                    </div>

                                    {/* Título e Gênero */}
                                    <h3 className="card-title" style={{ color: sys.accentColor }}>{sys.name}</h3>
                                    <div className="card-genre" style={{ color: '#aaa' }}>{sys.genre}</div>

                                    {/* Tagline */}
                                    <p className="card-tagline">"{sys.tagline}"</p>

                                    {/* Descrição */}
                                    <p className="card-description">{sys.description}</p>

                                    {/* Tags Temáticas */}
                                    <div className="card-tags">
                                        {sys.tags.map((t, idx) => (
                                             <span key={idx} className="tag-pill" style={{ borderColor: `${sys.accentColor}33` }}>
                                                 {t}
                                             </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Painel Inferior de Ação (CTA) */}
                    <div className="action-control-panel">
                        <div className="active-mode-summary">
                            <span className="active-mode-label">Universo Selecionado:</span>
                            <span className="active-mode-name" style={{ color: selectedSystem.accentColor }}>
                                {selectedSystem.name}
                            </span>
                        </div>

                        <p style={{ margin: '0 0 20px 0', color: '#888', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center' }}>
                            "{selectedSystem.loreIntro}"
                        </p>

                        <div className="role-buttons-row">
                            <button
                                type="button"
                                className="role-btn role-btn-gm"
                                onClick={() => setMode('gm-login')}
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <Crown size={18} />
                                <span>Criar Sala como Mestre</span>
                            </button>

                            <button
                                type="button"
                                className="role-btn role-btn-player"
                                onClick={() => setMode('player-setup')}
                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <Swords size={18} />
                                <span>Entrar como Jogador</span>
                            </button>
                        </div>

                        {isPeerConnecting && (
                            <div style={{ color: '#ffcc00', fontSize: '0.85rem', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Sincronizando com o servidor de rede...</span>
                            </div>
                        )}
                        <ErrorDisplay />
                    </div>
                </div>
            );
        }

        // 2. GM Login
        if (mode === 'gm-login' || mode === 'gm-rules-auth') {
            return (
                <div className="connection-content" style={{ justifyContent: 'center', minHeight: '80vh' }}>
                    <div className="subscreen-card">
                        <Crown size={36} color="#ffd700" style={{ marginBottom: '8px' }} />
                        <h2 className="subscreen-title">
                            {mode === 'gm-rules-auth' ? 'Acesso ao Livro do Mestre' : 'Identificação do Mestre'}
                        </h2>

                        <div className="thematic-badge-header" style={{ color: selectedSystem.accentColor, borderColor: `${selectedSystem.accentColor}44` }}>
                            {selectedSystem.name}
                        </div>

                        <p style={{ color: '#aaa', fontSize: '0.95rem', textAlign: 'center', marginBottom: '20px' }}>
                            Digite a senha do Mestre para gerenciar esta mesa:
                        </p>

                        <input
                            type="password"
                            style={inputStyle}
                            placeholder="Senha do Mestre (ex: mestre)"
                            value={gmPassword}
                            onChange={e => setGmPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && checkGmPassword()}
                            autoFocus
                        />

                        <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '10px' }}>
                            <button
                                style={{ ...actionBtnStyle, flex: 1, background: selectedSystem.secondaryColor }}
                                onClick={checkGmPassword}
                            >
                                Entrar
                            </button>
                            <button
                                style={{ ...cancelBtnStyle, flex: 1 }}
                                onClick={() => setMode('role-selection')}
                            >
                                Voltar
                            </button>
                        </div>

                        <ErrorDisplay />
                    </div>
                </div>
            );
        }

        // 3. GM Setup (Configuração da Mesa)
        if (mode === 'gm-setup') {
            return (
                <div className="connection-content" style={{ justifyContent: 'center', minHeight: '80vh' }}>
                    <div className="subscreen-card" style={{ maxWidth: '560px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '14px' }}>
                            <h2 className="subscreen-title" style={{ margin: 0 }}>Configuração da Mesa</h2>
                            {onOpenGMRules && (
                                <button
                                    type="button"
                                    onClick={onOpenGMRules}
                                    style={{ background: '#252535', border: '1px solid #444', color: '#ffd700', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                >
                                    <Scroll size={14} />
                                    <span>Livro do Mestre</span>
                                </button>
                            )}
                        </div>

                        {/* Universo Selecionado & Troca */}
                        <div style={{
                            width: '100%', padding: '12px 16px', borderRadius: '12px',
                            background: selectedSystem.bgGradient, border: `1px solid ${selectedSystem.accentColor}66`,
                            marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#aaa', letterSpacing: '1px' }}>Universo Ativo:</div>
                                <div style={{ color: selectedSystem.accentColor, fontWeight: 'bold', fontSize: '1.05rem', fontFamily: 'Cinzel, serif' }}>
                                    {selectedSystem.name}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMode('role-selection')}
                                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                Alterar Universo
                            </button>
                        </div>

                        {/* Nome do Mestre */}
                        <div style={{ width: '100%', marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '6px' }}>
                                Nome do Mestre:
                            </label>
                            <input
                                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', marginBottom: 0 }}
                                placeholder="Seu Nome (ex: GM Cláudio)"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        {/* Código da Sala para os Jogadores */}
                        <div style={{ width: '100%', background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 215, 0, 0.3)', marginBottom: '18px', boxSizing: 'border-box' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#ffd700', fontWeight: 'bold' }}>
                                    <Key size={14} />
                                    <span>Código Fixo da Sala:</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={handleGenerateNewCode}
                                    style={{ background: '#252535', border: '1px solid #555', color: '#ffd700', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    title="Gerar outro código aleatório"
                                >
                                    <RefreshCw size={12} />
                                    <span>Gerar Novo Código</span>
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    style={{
                                        ...inputStyle,
                                        fontFamily: 'monospace',
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        letterSpacing: '2px',
                                        textAlign: 'center',
                                        color: '#ffd700',
                                        background: '#09090f',
                                        border: '2px solid rgba(255, 215, 0, 0.4)',
                                        marginBottom: 0
                                    }}
                                    value={customRoomCode}
                                    onChange={e => handleRoomCodeChange(e.target.value)}
                                    placeholder="Ex: DND-8K2P"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(customRoomCode);
                                        setCopiedRoomCode(true);
                                        setTimeout(() => setCopiedRoomCode(false), 2000);
                                    }}
                                    style={{ ...btnStyle, padding: '12px 16px', background: '#333344', border: '1px solid #555', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                    title="Copiar Código"
                                >
                                    {copiedRoomCode ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
                                </button>
                            </div>
                            <p style={{ color: '#888', fontSize: '0.78rem', margin: '6px 0 0 0' }}>
                                Este código é persistente e seus jogadores poderão utilizá-lo sempre para entrar na sua mesa.
                            </p>
                        </div>

                        {/* Aventura / Campanha */}
                        <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px', boxSizing: 'border-box' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#aaa', marginBottom: '8px' }}>
                                <Scroll size={14} />
                                <span>Campanha / Aventura:</span>
                            </label>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                <select
                                    style={{ ...inputStyle, width: '100%', padding: '12px', marginBottom: 0, textAlign: 'left', boxSizing: 'border-box' }}
                                    onChange={(e) => {
                                        const advId = e.target.value;
                                        if (!advId) {
                                            closeAdventure();
                                            return;
                                        }
                                        loadAdventure(advId);
                                        const found = adventures.find(a => a.id === advId);
                                        if (found) {
                                            if ((found as any).system) {
                                                setSelectedSystemId((found as any).system);
                                                localStorage.setItem('rpg_selected_system', (found as any).system);
                                            }
                                            if (found.id.startsWith('DND-') || found.id.startsWith('WTC-')) {
                                                handleRoomCodeChange(found.id);
                                            }
                                        }
                                    }}
                                    value={currentAdventure?.id || ''}
                                >
                                    <option value="">-- Carregar Aventura Salva --</option>
                                    {adventures.map(a => {
                                        const sys = getGameSystem((a as any).system);
                                        return (
                                            <option key={a.id} value={a.id}>
                                                {a.name} [{sys.badgeText}] ({new Date(a.updatedAt).toLocaleDateString()})
                                            </option>
                                        );
                                    })}
                                </select>
                                <button
                                    onClick={() => {
                                        if (currentAdventure && confirm(`Apagar aventura "${currentAdventure.name}" permanentemente?`)) {
                                            deleteAdventure(currentAdventure.id);
                                        }
                                    }}
                                    disabled={!currentAdventure}
                                    style={{
                                        ...btnStyle,
                                        padding: '0 16px',
                                        background: currentAdventure ? '#b30000' : '#333',
                                        fontSize: '1.1rem',
                                        cursor: currentAdventure ? 'pointer' : 'not-allowed',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title="Apagar Aventura Selecionada"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', margin: '8px 0' }}>OU CRIE UMA NOVA</div>

                            <input
                                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', marginBottom: 0 }}
                                placeholder="Nome da Nova Aventura..."
                                value={advName}
                                onChange={e => setAdvName(e.target.value)}
                            />
                        </div>

                        {/* Botões de Ação */}
                        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                            <button
                                style={{ ...actionBtnStyle, flex: 2, background: selectedSystem.secondaryColor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                onClick={handleHost}
                            >
                                <Crown size={18} />
                                <span>Abrir Sala: {selectedSystem.badgeText}</span>
                            </button>
                            <button
                                style={{ ...cancelBtnStyle, flex: 1 }}
                                onClick={() => setMode('role-selection')}
                            >
                                Voltar
                            </button>
                        </div>

                        <ErrorDisplay />
                    </div>
                </div>
            );
        }

        // 4. Player Setup
        if (mode === 'player-setup') {
            return (
                <div className="connection-content" style={{ justifyContent: 'center', minHeight: '80vh' }}>
                    <div className="subscreen-card">
                        <Swords size={32} color="#2563eb" style={{ marginBottom: '8px' }} />
                        <h2 className="subscreen-title">Entrar na Sessão</h2>

                        {onOpenPlayerRules && (
                            <button
                                type="button"
                                style={{ background: '#252535', border: '1px solid #444', color: '#ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                onClick={onOpenPlayerRules}
                            >
                                <BookOpen size={14} />
                                <span>Abrir Livro do Jogador</span>
                            </button>
                        )}

                        {isUrlCodeApplied && (
                            <div style={{ color: '#4caf50', background: 'rgba(76, 175, 80, 0.15)', border: '1px solid #4caf50', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Check size={14} />
                                <span>Código da sala <strong>{targetId}</strong> preenchido via link de convite!</span>
                            </div>
                        )}

                        <div style={{ width: '100%', marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '6px' }}>
                                Seu Nome de Jogador:
                            </label>
                            <input
                                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                                placeholder="Ex: Geralt, V, Detetive..."
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div style={{ width: '100%', marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '6px' }}>
                                Código da Sala:
                            </label>
                            <input
                                style={{
                                    ...inputStyle,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    fontFamily: 'monospace',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    letterSpacing: '2px',
                                    textAlign: 'center',
                                    color: '#ffd700',
                                    background: '#09090f',
                                    border: '2px solid rgba(255, 215, 0, 0.4)'
                                }}
                                placeholder="Ex: DND-8K2P"
                                value={targetId}
                                onChange={e => setTargetId(e.target.value.toUpperCase())}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                            <button
                                style={{
                                    ...actionBtnStyle, flex: 2,
                                    opacity: isConnecting ? 0.7 : 1,
                                    cursor: isConnecting ? 'wait' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onClick={handleJoin}
                                disabled={isConnecting}
                            >
                                {isConnecting ? (
                                    <><Loader2 size={16} className="animate-spin" /> Conectando...</>
                                ) : (
                                    <><Swords size={18} /> Entrar na Mesa</>
                                )}
                            </button>
                            <button
                                style={{ ...cancelBtnStyle, flex: 1 }}
                                onClick={() => setMode('role-selection')}
                            >
                                Voltar
                            </button>
                        </div>

                        {isPeerConnecting && (
                            <div style={{ color: '#ffcc00', fontSize: '0.85rem', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Conectando ao servidor...</span>
                            </div>
                        )}
                        <ErrorDisplay />
                    </div>
                </div>
            );
        }

        // 5. Host Lobby
        if (mode === 'host') {
            const displayCode = currentAdventureId || customRoomCode || peerId || 'Gerando ID...';
            return (
                <div className="connection-content" style={{ justifyContent: 'center', minHeight: '80vh' }}>
                    <div className="subscreen-card" style={{ maxWidth: '580px' }}>
                        <Crown size={36} color="#ffd700" style={{ marginBottom: '8px' }} />
                        <h2 className="subscreen-title">Sala de Espera do Mestre</h2>

                        <div className="thematic-badge-header" style={{ color: selectedSystem.accentColor, borderColor: `${selectedSystem.accentColor}44` }}>
                            Universo: {selectedSystem.name}
                        </div>

                        <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', margin: '0 0 10px 0' }}>
                            Sua mesa está aberta! Compartilhe o código ou o link direto com seus jogadores:
                        </p>

                        <div style={{
                            background: '#0a0a14',
                            border: '2px dashed #ffd700',
                            borderRadius: '12px',
                            padding: '16px',
                            margin: '12px 0 16px 0',
                            textAlign: 'center',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            <div style={{ color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                CÓDIGO DA SALA (DIGITE PARA ENTRAR)
                            </div>
                            <div
                                style={{
                                    fontSize: '2.2rem',
                                    fontFamily: 'monospace',
                                    fontWeight: 'bold',
                                    color: '#ffd700',
                                    letterSpacing: '4px',
                                    userSelect: 'all',
                                    margin: '6px 0 14px 0'
                                }}
                                title="Clique para selecionar o código"
                            >
                                {displayCode}
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={copyCode}
                                    style={{
                                        background: '#ffd700',
                                        color: '#000',
                                        border: 'none',
                                        padding: '10px 18px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {copied ? <><Check size={15} /> Código Copiado</> : <><Copy size={15} /> Copiar Código</>}
                                </button>
                                <button
                                    type="button"
                                    onClick={copyInviteLink}
                                    style={{
                                        background: '#2563eb',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '10px 18px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {copiedInviteLink ? <><Check size={15} /> Link Copiado</> : <><Link2 size={15} /> Copiar Link de Convite</>}
                                </button>
                            </div>
                            {(copied || copiedInviteLink) && (
                                <div style={{ color: '#4caf50', fontSize: '0.85rem', marginTop: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                    <Check size={14} />
                                    <span>Copiado com sucesso para a área de transferência!</span>
                                </div>
                            )}
                        </div>

                        <div style={listStyle}>
                            <h3 style={{ fontSize: '1.05rem', color: '#ffd700', margin: '14px 0 10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span>Jogadores Conectados:</span>
                                <span style={{ background: '#222', border: '1px solid #ffd700', borderRadius: '12px', padding: '2px 10px', fontSize: '0.9rem' }}>
                                    {connections.length}
                                </span>
                            </h3>
                            {connections.length === 0 ? (
                                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                    Aguardando entrada dos jogadores... Eles aparecerão aqui automaticamente.
                                </p>
                            ) : (
                                connections.map((c, i) => (
                                    <div key={i} style={playerItemStyle}>
                                        <Users size={16} color="#ffd700" />
                                        <strong style={{ color: '#fff' }}>{c.metadata?.name || 'Jogador Anônimo'}</strong>
                                        <span style={{ color: '#4caf50', fontSize: '0.8rem', marginLeft: '6px' }}>Online</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            style={{ ...actionBtnStyle, width: '100%', fontSize: '1.2rem', padding: '16px', background: selectedSystem.secondaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            onClick={() => {
                                sessionStorage.setItem('rpg_game_started', 'true');
                                onStartGame();
                            }}
                        >
                            <Play size={20} />
                            <span>Iniciar Sessão e Ir para o Tabuleiro</span>
                        </button>

                        <ErrorDisplay />
                    </div>
                </div>
            );
        }

        // 6. Join (Loading)
        if (mode === 'join') {
            return (
                <div className="connection-content" style={{ justifyContent: 'center', minHeight: '80vh' }}>
                    <div className="subscreen-card">
                        <Loader2 size={36} className="animate-spin" color="#ffd700" style={{ marginBottom: '12px' }} />
                        <h2 className="subscreen-title">Conectando à Sala...</h2>
                        <p style={{ color: '#aaa' }}>Sincronizando estado do mundo e carregando fichas.</p>
                        <ErrorDisplay />
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            className="connection-viewport"
            style={{
                background: `radial-gradient(circle at 50% 15%, ${selectedSystem.glowColor} 0%, rgba(10, 10, 15, 0.98) 65%), linear-gradient(180deg, #0d0d14 0%, #050508 100%)`
            }}
        >
            <div className="connection-bg-overlay" />
            {renderBody()}
            {renderServerButton()}
            {renderServerModal()}
        </div>
    );
};

// Estilos de formulários e caixas
const inputStyle: React.CSSProperties = {
    padding: '14px',
    fontSize: '1.05rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: '#12121c',
    color: '#fff',
    marginBottom: '16px',
    width: '100%',
    boxSizing: 'border-box'
};

const btnStyle: React.CSSProperties = {
    padding: '14px 24px',
    fontSize: '1rem',
    borderRadius: '10px',
    border: 'none',
    background: '#950740',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'Cinzel, serif',
    transition: 'all 0.2s ease'
};

const actionBtnStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#2563eb',
    minWidth: '140px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
};

const cancelBtnStyle: React.CSSProperties = {
    ...btnStyle,
    background: '#333344',
    padding: '14px 20px',
    color: '#bbb'
};

const listStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: '24px',
    textAlign: 'center'
};

const playerItemStyle: React.CSSProperties = {
    padding: '10px 14px',
    margin: '6px 0',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
};
