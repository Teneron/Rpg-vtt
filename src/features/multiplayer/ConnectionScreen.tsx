import React, { useState } from 'react';
import { usePeer } from './FirebaseContext';
import { useAdventure } from '../adventure/AdventureContext';

interface ConnectionScreenProps {
    onStartGame: () => void;
    onOpenPlayerRules?: () => void;
    onOpenGMRules?: () => void;
}

export const ConnectionScreen: React.FC<ConnectionScreenProps> = ({ onStartGame, onOpenPlayerRules, onOpenGMRules }) => {
    const { startHosting, connectToHost, peerId, connections, peerError, currentAdventureId, serverUrl, setServerUrl, isConnecting: isPeerConnecting } = usePeer();
    const { adventures, createAdventure, loadAdventure, deleteAdventure, currentAdventure } = useAdventure();

    // Modes: 
    // 'role-selection': Initial screen (Master vs Player)
    // 'gm-login': Password check for Master
    // 'gm-setup': Adventure selection
    // 'player-setup': Name & Code input
    // 'host': Lobby waiting
    // 'join': Connecting... (usually instant but keeps UI consistent)
    // 'gm-rules-auth': Password check just for viewing rules
    const [mode, setMode] = useState<'role-selection' | 'gm-login' | 'gm-setup' | 'player-setup' | 'host' | 'join' | 'gm-rules-auth'>('role-selection');

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

    // Loading State (Moved up to fix Hook Rule Violation)
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
        if (gmPassword === 'mestre' || gmPassword === 'admin') { // Hardcoded for now
            if (mode === 'gm-rules-auth') {
                if (onOpenGMRules) onOpenGMRules();
            } else {
                setMode('gm-setup');
            }
        } else {
            alert("Senha incorreta!");
        }
    };

    const ErrorDisplay = () => peerError ? (
        <div style={{ marginTop: '20px', color: '#ff6b6b', background: 'rgba(50,0,0,0.5)', padding: '10px', borderRadius: '4px', border: '1px solid #ff4444' }}>
            ⚠️ {peerError}
        </div>
    ) : null;

    // Auto-start logic removed to allow App.tsx to handle routing (e.g. to character setup)
    // useEffect(() => { ... }, []);

    const handleHost = async () => {
        if (!name) return alert("Digite seu nome de Mestre!");

        let finalAdventureId = currentAdventure?.id || 'default';

        if (advName) {
            // Create and use the NEW ID immediately
            const newAdv = await createAdventure(advName);
            finalAdventureId = newAdv.id;
        } else if (!currentAdventure) {
            // Se nenhuma aventura selecionada, cria uma "Sessão Rápida" para garantir isolamento
            const autoName = `Sessão ${new Date().toLocaleTimeString()}`;
            if (confirm(`Nenhuma aventura selecionada. Criar uma "${autoName}" para salvar o progresso separadamente? (Cancelar = Usar 'Padrão' compartilhado)`)) {
                const newAdv = await createAdventure(autoName);
                finalAdventureId = newAdv.id;
            } else {
                finalAdventureId = 'default';
            }
        }

        console.log("Starting host with Adventure ID:", finalAdventureId);

        // Pass the adventure ID so players know which character list to load
        const advNameDisplay = currentAdventure?.name || (advName ? advName : 'Aventura Padrão');
        startHosting(name, finalAdventureId, advNameDisplay);
        setMode('host');
    };

    const handleJoin = async () => {
        if (!name || !targetId) return alert("Digite Nome e Código da Sala!");
        if (isConnecting) return;

        setIsConnecting(true);
        try {
            connectToHost(targetId, name);
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

    // --- RENDER MODAL & BUTTON ---
    const renderServerModal = () => {
        if (!showServerConfig) return null;
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10001, backdropFilter: 'blur(4px)'
            }}>
                <div style={{
                    background: '#1a1a24', border: '1px solid #444', borderRadius: '12px',
                    padding: '24px', maxWidth: '480px', width: '90%', color: '#fff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#c5a059', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🌐 Configurar Servidor de Rede
                    </h3>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '15px', lineHeight: 1.4 }}>
                        Insira o endereço do servidor Socket.io. Use isto para jogar via rede local (LAN) ou servidor na nuvem.
                    </p>
                    <input
                        type="text"
                        style={{
                            width: '100%', padding: '12px', background: '#0e0e14', border: '1px solid #555',
                            color: '#fff', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box',
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
                            style={{ background: '#2a2a38', border: '1px solid #444', color: '#ccc', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Localhost (3001)
                        </button>
                        <button
                            type="button"
                            onClick={() => setTempServerUrl(`http://${window.location.hostname}:3001`)}
                            style={{ background: '#2a2a38', border: '1px solid #444', color: '#ccc', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            IP Local ({window.location.hostname}:3001)
                        </button>
                        <button
                            type="button"
                            onClick={() => setTempServerUrl(window.location.origin)}
                            style={{ background: '#2a2a38', border: '1px solid #444', color: '#ccc', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Origem Web Atual
                        </button>
                    </div>
                    {urlFeedback && <div style={{ color: '#4caf50', fontSize: '0.85rem', marginBottom: '10px' }}>✓ {urlFeedback}</div>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={() => setShowServerConfig(false)}
                            style={{ background: '#444', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveServerUrl}
                            style={{ background: '#950740', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Salvar e Aplicar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderServerButton = () => (
        <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 10000 }}>
            <button
                type="button"
                onClick={() => {
                    setTempServerUrl(serverUrl);
                    setShowServerConfig(true);
                }}
                style={{
                    background: 'rgba(25, 25, 35, 0.85)',
                    border: '1px solid #444',
                    color: '#c5a059',
                    padding: '7px 14px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(6px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}
                title="Configurar servidor de rede"
            >
                🌐 <span>Servidor: <strong style={{ color: '#fff' }}>{serverUrl}</strong></span>
            </button>
        </div>
    );

    // --- RENDER ---
    const renderBody = () => {
        // 1. Role Selection
        if (mode === 'role-selection') {
            return (
                <div style={containerStyle}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>RPG Tabletop</h1>
                    <h2 style={{ color: '#aaa' }}>Quem é você hoje?</h2>
                    <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
                        <button style={{ ...bigBtnStyle, background: '#4a1515' }} onClick={() => setMode('gm-login')}>
                            👑 Sou o Mestre
                        </button>
                        <button style={{ ...bigBtnStyle, background: '#152b4a' }} onClick={() => setMode('player-setup')}>
                            ⚔️ Sou Jogador
                        </button>
                    </div>
                    {isPeerConnecting && <div style={{ color: '#ffcc00', fontSize: '0.9rem', marginTop: '15px' }}>⏳ Conectando ao servidor...</div>}
                    <ErrorDisplay />
                </div>
            );
        }

        // 2. GM Login
        if (mode === 'gm-login' || mode === 'gm-rules-auth') {
            return (
                <div style={containerStyle}>
                    <h2>{mode === 'gm-rules-auth' ? 'Acesso ao Livro do Mestre' : 'Acesso do Mestre'}</h2>
                    <div style={cardStyle}>
                        <p>Digite a senha para gerenciar a mesa:</p>
                        <input
                            type="password"
                            style={inputStyle}
                            placeholder="Senha"
                            value={gmPassword} onChange={e => setGmPassword(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && checkGmPassword()}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                            <button style={actionBtnStyle} onClick={checkGmPassword}>Entrar</button>
                            <button style={cancelBtnStyle} onClick={() => setMode('role-selection')}>Voltar</button>
                        </div>
                    </div>
                    <ErrorDisplay />
                </div>
            );
        }

        // 3. GM Setup
        if (mode === 'gm-setup') {
            return (
                <div style={containerStyle}>
                    <h2>Configuração da Mesa</h2>

                    {/* Botão de Livro do Mestre - Acesso Autorizado */}
                    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                        <button
                            style={{ ...btnStyle, fontSize: '0.9rem', padding: '10px 15px', background: '#333' }}
                            onClick={onOpenGMRules}
                        >
                            📜 Livro do Mestre
                        </button>
                    </div>

                    <div style={cardStyle}>
                        <h3 style={{ margin: '0 0 10px 0' }}>👤 Identidade do Mestre</h3>
                        <input
                            style={inputStyle}
                            placeholder="Seu Nome (ex: GM Cláudio)"
                            value={name} onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div style={{ ...cardStyle, background: 'rgba(50,0,0,0.3)', border: '1px solid #442222' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>📜 Aventura (Save)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <select
                                    style={{ ...inputStyle, width: '100%', padding: '10px', marginBottom: 0 }}
                                    onChange={(e) => loadAdventure(e.target.value)}
                                    value={currentAdventure?.id || ''}
                                >
                                    <option value="">-- Carregar Aventura --</option>
                                    {adventures.map(a => <option key={a.id} value={a.id}>{a.name} ({new Date(a.updatedAt).toLocaleDateString()})</option>)}
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
                                        padding: '0 15px',
                                        background: currentAdventure ? '#b30000' : '#444',
                                        fontSize: '1.2rem',
                                        cursor: currentAdventure ? 'pointer' : 'not-allowed'
                                    }}
                                    title="Apagar Aventura Selecionada"
                                >
                                    🗑️
                                </button>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>OU</div>

                            <input
                                style={{ ...inputStyle, width: '100%', padding: '10px', marginBottom: '0' }}
                                placeholder="Criar Nova Aventura..."
                                value={advName} onChange={e => setAdvName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={actionBtnStyle} onClick={handleHost}>👑 Abrir Sala</button>
                        <button style={cancelBtnStyle} onClick={() => setMode('role-selection')}>Voltar</button>
                    </div>
                    <ErrorDisplay />
                </div>
            );
        }

        // 4. Player Setup
        if (mode === 'player-setup') {
            return (
                <div style={containerStyle}>
                    <h2>Entrar no Jogo</h2>

                    {/* Acesso ao Livro do Jogador */}
                    <button
                        style={{ ...btnStyle, fontSize: '1rem', padding: '10px 20px', background: '#333', marginBottom: '20px' }}
                        onClick={onOpenPlayerRules}
                    >
                        📖 Abrir Livro do Jogador
                    </button>

                    <div style={cardStyle}>
                        <input
                            style={inputStyle}
                            placeholder="Seu Nome de Jogador"
                            value={name} onChange={e => setName(e.target.value)}
                        />
                        <input
                            style={inputStyle}
                            placeholder="Código da Sala (Peça ao Mestre)"
                            value={targetId} onChange={e => setTargetId(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                style={{ ...actionBtnStyle, opacity: isConnecting ? 0.7 : 1, cursor: isConnecting ? 'wait' : 'pointer' }}
                                onClick={handleJoin}
                                disabled={isConnecting}
                            >
                                {isConnecting ? 'Conectando...' : 'Conectar'}
                            </button>
                            <button style={cancelBtnStyle} onClick={() => setMode('role-selection')}>Voltar</button>
                        </div>
                    </div>
                    {isPeerConnecting && <div style={{ color: '#ffcc00', fontSize: '0.9rem', marginTop: '10px' }}>⏳ Conectando ao servidor...</div>}
                    <ErrorDisplay />
                </div>
            );
        }

        // 5. Host Lobby (Waiting)
        if (mode === 'host') {
            return (
                <div style={containerStyle}>
                    <h2>Sala de Espera (Mestre)</h2>
                    <div style={cardStyle}>
                        <p style={{ color: '#aaa' }}>Adicione jogadores enviando este código:</p>
                        <div style={codeBoxStyle} onClick={copyCode}>
                            {currentAdventureId || peerId || 'Gerando ID...'}
                        </div>
                        {copied && <span style={{ color: '#4caf50' }}>Copiado!</span>}
                    </div>

                    <div style={listStyle}>
                        <h3>Jogadores Conectados ({connections.length})</h3>
                        {connections.length === 0 ? <p>Aguardando jogadores...</p> : (
                            connections.map((c, i) => <div key={i} style={playerItemStyle}>Jogador {c.metadata?.name || 'Desconhecido'}</div>)
                        )}
                    </div>

                    <button style={actionBtnStyle} onClick={onStartGame}>Iniciar Sessão 🚀</button>
                    <ErrorDisplay />
                </div>
            );
        }

        // Join (Loading)
        if (mode === 'join') {
            return (
                <div style={containerStyle}>
                    <h2>Conectando...</h2>
                    <ErrorDisplay />
                </div>
            );
        }

        return null;
    };

    return (
        <>
            {renderBody()}
            {renderServerButton()}
            {renderServerModal()}
        </>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'linear-gradient(135deg, #121212 0%, #1a0b14 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    color: '#fff', zIndex: 9999
};

const inputStyle: React.CSSProperties = {
    padding: '15px', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid #444',
    background: '#222', color: '#fff', marginBottom: '20px', width: '300px', textAlign: 'center'
};

const btnStyle: React.CSSProperties = {
    padding: '15px 30px', fontSize: '1.2rem', borderRadius: '8px', border: 'none',
    background: '#950740', color: '#fff', cursor: 'pointer', fontWeight: 'bold'
};

const bigBtnStyle: React.CSSProperties = {
    ...btnStyle, padding: '30px 50px', fontSize: '1.5rem', width: '300px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
};

const actionBtnStyle: React.CSSProperties = { ...btnStyle, background: '#44a', minWidth: '150px' };
const cancelBtnStyle: React.CSSProperties = { ...btnStyle, background: '#555', padding: '15px 20px' };

const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '15px',
    marginBottom: '20px', textAlign: 'center', minWidth: '350px',
    border: '1px solid rgba(255,255,255,0.1)'
};

const codeBoxStyle: React.CSSProperties = {
    fontFamily: 'monospace', fontSize: '1.5rem', background: '#000', padding: '15px',
    borderRadius: '10px', border: '2px dashed #666', marginTop: '15px', cursor: 'pointer',
    userSelect: 'all', color: '#ffcc00'
};

const listStyle: React.CSSProperties = { marginBottom: '30px', textAlign: 'center', minWidth: '300px' };
const playerItemStyle: React.CSSProperties = { padding: '10px', borderBottom: '1px solid #333', fontSize: '1.1rem' };
