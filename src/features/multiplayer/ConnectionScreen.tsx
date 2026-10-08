import React, { useState } from 'react';
import { usePeer } from './FirebaseContext';
import { useAdventure } from '../adventure/AdventureContext';
import { GAME_SYSTEMS, getGameSystem } from '../systems/gameSystems';
import './ConnectionScreen.css';

interface ConnectionScreenProps {
    onStartGame: () => void;
    onOpenPlayerRules?: () => void;
    onOpenGMRules?: () => void;
}

export const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ onStartGame, onOpenPlayerRules, onOpenGMRules }) => {
    const { startHosting, connectToHost, peerId, connections, peerError, currentAdventureId, serverUrl, setServerUrl, isConnecting: isPeerConnecting, isConnected } = usePeer();
    const { adventures, createAdventure, loadAdventure, deleteAdventure, currentAdventure } = useAdventure();

    // Mode States
    const [mode, setMode] = useState<'role-selection' | 'gm-login' | 'gm-setup' | 'player-setup' | 'host' | 'join' | 'gm-rules-auth'>('role-selection');

    // System Selection State
    const [selectedSystemId, setSelectedSystemId] = useState<string>('dnd5e');
    const selectedSystem = getGameSystem(selectedSystemId);

    // Form States
    const [name, setName] = useState('');
    const [targetId, setTargetId] = useState('');
    const [gmPassword, setGmPassword] = useState('');
    const [advName, setAdvName] = useState('');
    const [copied, setCopied] = useState(false);

    // Server URL Config Modal State
    const [showServerConfig, setShowServerConfig] = useState(false);
    const [tempServerUrl, setTempServerUrl] = useState(serverUrl);
    const [urlFeedback, setUrlFeedback] = useState<string | null>(null);

    // Loading State
    const [isConnecting, setIsConnecting] = useState(false);

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
        if (!name) return alert('Digite seu nome de Mestre!');

        let finalAdventureId = currentAdventure?.id || 'default';

        if (advName.trim()) {
            // Cria aventura vinculada ao sistema selecionado
            const newAdv = await createAdventure(advName.trim(), selectedSystem.id);
            finalAdventureId = newAdv.id;
        } else if (!currentAdventure) {
            const autoName = `Sessão ${selectedSystem.name.split('&')[0].trim()} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
            if (confirm(`Nenhuma aventura selecionada. Criar "${autoName}" no universo ${selectedSystem.name}?`)) {
                const newAdv = await createAdventure(autoName, selectedSystem.id);
                finalAdventureId = newAdv.id;
            } else {
                finalAdventureId = 'default';
            }
        }

        console.log('Starting host with Adventure ID:', finalAdventureId, 'System:', selectedSystem.id);

        const advNameDisplay = currentAdventure?.name || (advName ? advName : `${selectedSystem.name} (Padrão)`);
        startHosting(name, finalAdventureId, advNameDisplay);
        setMode('host');
    };

    const handleJoin = async () => {
        if (!name || !targetId) return alert('Digite Nome e Código da Sala!');
        if (isConnecting) return;

        setIsConnecting(true);
        try {
            connectToHost(targetId.trim(), name.trim());
            setTimeout(() => setIsConnecting(false), 5000);
        } catch (e) {
            setIsConnecting(false);
        }
    };

    const copyCode = () => {
        const codeToCopy = currentAdventureId || peerId;
        if (!codeToCopy) return;
        navigator.clipboard.writeText(codeToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const ErrorDisplay = () => peerError ? (
        <div style={{ marginTop: '16px', color: '#ff6b6b', background: 'rgba(50,0,0,0.6)', padding: '10px 16px', borderRadius: '8px', border: '1px solid #ff4444', textAlign: 'center', fontSize: '0.9rem' }}>
            ⚠️ {peerError}
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
                        🌐 Configurar Servidor de Rede
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
                    {urlFeedback && <div style={{ color: '#4caf50', fontSize: '0.85rem', marginBottom: '12px' }}>✓ {urlFeedback}</div>}
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
                <span style={{ fontSize: '1rem' }}>🌐</span>
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
                            <span style={{ fontSize: '1.8rem' }}>⚔️</span>
                            <div>
                                <h1>RPG Tabletop VTT</h1>
                                <span className="brand-subtitle">VIRTUAL TABLETOP MULTI-SISTEMA</span>
                            </div>
                        </div>

                        <div className="header-actions">
                            {onOpenPlayerRules && (
                                <button type="button" className="nav-link-btn" onClick={onOpenPlayerRules}>
                                    📖 Livro do Jogador
                                </button>
                            )}
                            {onOpenGMRules && (
                                <button type="button" className="nav-link-btn" onClick={() => setMode('gm-rules-auth')}>
                                    📜 Livro do Mestre
                                </button>
                            )}
                            <button
                                type="button"
                                className="nav-link-btn"
                                onClick={() => {
                                    setTempServerUrl(serverUrl);
                                    setShowServerConfig(true);
                                }}
                                style={{ borderColor: 'rgba(255, 215, 0, 0.4)' }}
                            >
                                ⚙️ Servidor
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
                                    onClick={() => setSelectedSystemId(sys.id)}
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
                                            style={{ background: sys.accentColor, color: '#000' }}
                                        >
                                            ✓ ATIVO
                                        </div>
                                    )}

                                    {/* Top Badge */}
                                    <div
                                        className="card-badge"
                                        style={{
                                            background: `rgba(${sys.id === 'cyberpunk' ? '0, 243, 255' : sys.id === 'cthulhu' ? '0, 255, 157' : sys.id === 'custom' ? '168, 85, 247' : '197, 160, 89'}, 0.15)`,
                                            color: sys.accentColor,
                                            border: `1px solid ${sys.accentColor}44`
                                        }}
                                    >
                                        <span>{sys.badgeIcon}</span>
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
                                {selectedSystem.badgeIcon} {selectedSystem.name}
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
                            >
                                <span>👑</span>
                                <span>Criar Sala como Mestre</span>
                            </button>

                            <button
                                type="button"
                                className="role-btn role-btn-player"
                                onClick={() => setMode('player-setup')}
                            >
                                <span>⚔️</span>
                                <span>Entrar como Jogador</span>
                            </button>
                        </div>

                        {isPeerConnecting && (
                            <div style={{ color: '#ffcc00', fontSize: '0.85rem', marginTop: '16px' }}>
                                ⏳ Sincronizando com o servidor de rede...
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
                        <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👑</span>
                        <h2 className="subscreen-title">
                            {mode === 'gm-rules-auth' ? 'Acesso ao Livro do Mestre' : 'Identificação do Mestre'}
                        </h2>

                        <div className="thematic-badge-header" style={{ color: selectedSystem.accentColor, borderColor: `${selectedSystem.accentColor}44` }}>
                            {selectedSystem.badgeIcon} {selectedSystem.name}
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
                                    style={{ background: '#252535', border: '1px solid #444', color: '#ffd700', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    📜 Livro do Mestre
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
                                    {selectedSystem.badgeIcon} {selectedSystem.name}
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
                                👤 Nome do Mestre:
                            </label>
                            <input
                                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', marginBottom: 0 }}
                                placeholder="Seu Nome (ex: GM Cláudio)"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        {/* Aventura / Campanha */}
                        <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px', boxSizing: 'border-box' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '8px' }}>
                                📜 Campanha / Aventura:
                            </label>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                <select
                                    style={{ ...inputStyle, width: '100%', padding: '12px', marginBottom: 0, textAlign: 'left', boxSizing: 'border-box' }}
                                    onChange={(e) => {
                                        const advId = e.target.value;
                                        loadAdventure(advId);
                                        const found = adventures.find(a => a.id === advId);
                                        if (found && (found as any).system) {
                                            setSelectedSystemId((found as any).system);
                                        }
                                    }}
                                    value={currentAdventure?.id || ''}
                                >
                                    <option value="">-- Carregar Aventura Salva --</option>
                                    {adventures.map(a => {
                                        const sys = getGameSystem((a as any).system);
                                        return (
                                            <option key={a.id} value={a.id}>
                                                {sys.badgeIcon} {a.name} [{sys.badgeText}] ({new Date(a.updatedAt).toLocaleDateString()})
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
                                        cursor: currentAdventure ? 'pointer' : 'not-allowed'
                                    }}
                                    title="Apagar Aventura Selecionada"
                                >
                                    🗑️
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
                                style={{ ...actionBtnStyle, flex: 2, background: selectedSystem.secondaryColor }}
                                onClick={handleHost}
                            >
                                👑 Abrir Sala no Universo {selectedSystem.badgeText}
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
                        <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⚔️</span>
                        <h2 className="subscreen-title">Entrar na Sessão</h2>

                        {onOpenPlayerRules && (
                            <button
                                type="button"
                                style={{ background: '#252535', border: '1px solid #444', color: '#ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '20px' }}
                                onClick={onOpenPlayerRules}
                            >
                                📖 Abrir Livro do Jogador
                            </button>
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
                                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', fontFamily: 'monospace' }}
                                placeholder="Peça o código ao Mestre"
                                value={targetId}
                                onChange={e => setTargetId(e.target.value)}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                            <button
                                style={{
                                    ...actionBtnStyle, flex: 2,
                                    opacity: isConnecting ? 0.7 : 1,
                                    cursor: isConnecting ? 'wait' : 'pointer'
                                }}
                                onClick={handleJoin}
                                disabled={isConnecting}
                            >
                                {isConnecting ? 'Conectando...' : '⚔️ Entrar na Mesa'}
                            </button>
                            <button
                                style={{ ...cancelBtnStyle, flex: 1 }}
                                onClick={() => setMode('role-selection')}
                            >
                                Voltar
                            </button>
                        </div>

                        {isPeerConnecting && (
                            <div style={{ color: '#ffcc00', fontSize: '0.85rem', marginTop: '12px' }}>
                                ⏳ Conectando ao servidor...
                            </div>
                        )}
                        <ErrorDisplay />
                    </div>
                </div>
            );
        }

        // 5. Host Lobby
        if (mode === 'host') {
            return (
                <div className="connection-content" style={{ justifyContent: 'center', minHeight: '80vh' }}>
                    <div className="subscreen-card" style={{ maxWidth: '540px' }}>
                        <span style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏰</span>
                        <h2 className="subscreen-title">Sala de Espera do Mestre</h2>

                        <div className="thematic-badge-header" style={{ color: selectedSystem.accentColor, borderColor: `${selectedSystem.accentColor}44` }}>
                            {selectedSystem.badgeIcon} Universo: {selectedSystem.name}
                        </div>

                        <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', margin: '0 0 10px 0' }}>
                            Envie este código da sala para seus jogadores entrarem:
                        </p>

                        <div
                            style={codeBoxStyle}
                            onClick={copyCode}
                            title="Clique para copiar o código da sala"
                        >
                            {currentAdventureId || peerId || 'Gerando ID da Sala...'}
                        </div>
                        {copied && <span style={{ color: '#4caf50', fontSize: '0.85rem', marginTop: '6px' }}>✓ Código copiado para a área de transferência!</span>}

                        <div style={listStyle}>
                            <h3 style={{ fontSize: '1rem', color: '#ffd700', margin: '20px 0 10px 0' }}>
                                Jogadores Conectados ({connections.length})
                            </h3>
                            {connections.length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic', fontSize: '0.9rem' }}>Aguardando entrada dos jogadores...</p>
                            ) : (
                                connections.map((c, i) => (
                                    <div key={i} style={playerItemStyle}>
                                        ⚔️ {c.metadata?.name || 'Jogador Anônimo'}
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            style={{ ...actionBtnStyle, width: '100%', fontSize: '1.2rem', padding: '16px', background: selectedSystem.secondaryColor }}
                            onClick={onStartGame}
                        >
                            Iniciar Sessão 🚀
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
                        <span style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⏳</span>
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

const codeBoxStyle: React.CSSProperties = {
    fontFamily: 'monospace',
    fontSize: '1.3rem',
    background: '#09090f',
    padding: '16px',
    borderRadius: '10px',
    border: '2px dashed #ffd700',
    margin: '12px 0 6px 0',
    cursor: 'pointer',
    userSelect: 'all',
    color: '#ffd700',
    letterSpacing: '2px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box'
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
