import { useState, useEffect, lazy, Suspense } from 'react'
import './App.css'
import './Layout.css'
import { DiceProvider } from './features/dice/DiceContext'
import { RollHistoryProvider } from './features/dice/RollHistoryContext'
import { MultiplayerProvider, useMultiplayer as usePeer } from './features/multiplayer/SocketContext'
import { ConnectionScreen } from './features/multiplayer/ConnectionScreen'
import { BattleMap } from './features/map/BattleMap'
import { MapHeaderControls } from './features/map/MapToolbar';
import { InitiativeTracker } from './features/combat/InitiativeTracker';
import { AdventureProvider, useAdventure } from './features/adventure/AdventureContext'
import { MapProvider } from './features/map/MapContext'
import { SceneProvider } from './features/map/SceneContext'
import { CombatProvider } from './features/combat/CombatContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChatWindow } from './features/chat/ChatWindow';
import { ChatProvider } from './features/chat/ChatContext';
import { AudioProvider } from './features/audio/AudioContext';
import { MusicPlayer } from './features/audio/MusicPlayer';
import { Soundboard } from './features/audio/Soundboard';

import {
  User,
  Dices,
  Swords,
  Skull,
  Shield,
  BookOpen,
  Scroll,
  LogOut,
  Copy,
  Check,
  Link2,
  Loader2,
  X,
  Sparkles,
  Maximize,
  Minimize,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw
} from 'lucide-react';

// Lazy loaded heavy components to optimize initial bundle size & load on demand
const DiceOverlay = lazy(() => import('./features/dice/DiceRoller').then(m => ({ default: m.DiceOverlay })));
const DiceSidebar = lazy(() => import('./features/dice/DiceRoller').then(m => ({ default: m.DiceSidebar })));
const CharacterSheet = lazy(() => import('./features/character/CharacterSheet').then(m => ({ default: m.CharacterSheet })));
const CharacterSelection = lazy(() => import('./features/character/CharacterSelection').then(m => ({ default: m.CharacterSelection })));
const GMScreen = lazy(() => import('./features/gm/GMScreen').then(m => ({ default: m.GMScreen })));
const BestiarySidebar = lazy(() => import('./features/monsters/BestiarySidebar').then(m => ({ default: m.BestiarySidebar })));
const PlayerRulebook = lazy(() => import('./features/rules/PlayerRulebook').then(m => ({ default: m.PlayerRulebook })));
const GMRulebook = lazy(() => import('./features/rules/GMRulebook').then(m => ({ default: m.GMRulebook })));

const LazyLoadingFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '100px', color: '#c5a059', gap: '8px' }}>
    <Loader2 size={16} className="animate-spin" />
    <span style={{ fontSize: '0.9rem' }}>Carregando módulo...</span>
  </div>
);

type Tab = 'dice' | 'character' | 'map' | 'gm-screen' | 'combat' | 'bestiary' | 'rules-player' | 'rules-gm';

interface ConnectionBadgeProps {
  status: 'connected' | 'reconnecting' | 'disconnected';
  onReconnect: () => void;
}

const ConnectionBadge: React.FC<ConnectionBadgeProps> = ({ status, onReconnect }) => {
  if (status === 'connected') {
    return (
      <div
        title="Conexão em tempo real estabelecida com o servidor"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          borderRadius: '16px',
          background: 'rgba(34, 197, 94, 0.12)',
          border: '1px solid rgba(34, 197, 94, 0.35)',
          color: '#4ade80',
          fontSize: '0.75rem',
          fontWeight: 600,
          userSelect: 'none'
        }}
      >
        <span className="status-dot status-dot-online" />
        <span>Online</span>
      </div>
    );
  }

  if (status === 'reconnecting') {
    return (
      <div
        title="Tentando restabelecer conexão com o servidor..."
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          borderRadius: '16px',
          background: 'rgba(234, 179, 8, 0.12)',
          border: '1px solid rgba(234, 179, 8, 0.4)',
          color: '#facc15',
          fontSize: '0.75rem',
          fontWeight: 600,
          userSelect: 'none'
        }}
      >
        <span className="status-dot status-dot-reconnecting" />
        <span>Reconectando...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '2px 8px 2px 10px',
        borderRadius: '16px',
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        color: '#f87171',
        fontSize: '0.75rem',
        fontWeight: 600
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span className="status-dot status-dot-offline" />
        <span>Offline</span>
      </div>
      <button
        type="button"
        onClick={onReconnect}
        title="Tentar reconectar ao servidor agora"
        style={{
          background: '#dc2626',
          border: 'none',
          color: '#fff',
          borderRadius: '10px',
          padding: '2px 8px',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'background 0.2s ease'
        }}
      >
        <RefreshCw size={11} />
        <span>Reconectar</span>
      </button>
    </div>
  );
};

function AppContent() {
  const {
    isConnected,
    isHost,
    disconnect,
    closeRoom,
    currentAdventureId,
    peerId,
    myCharacter,
    connectionState,
    reconnectNow
  } = usePeer();
  const { closeAdventure } = useAdventure();
  const [activeTab, setActiveTab] = useState<Tab>('character');
  const [viewMode, setViewMode] = useState<'connection' | 'game' | 'character-setup' | 'rules-player' | 'rules-gm'>('connection');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(() => {
    return localStorage.getItem('rpg_selected_char_id') || null;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('[Fullscreen] Falha ao alternar tela cheia:', err);
    }
  };

  const handleTabSelect = (tab: Tab) => {
    setActiveTab(tab);
    if (isSidebarCollapsed && (tab === 'dice' || tab === 'combat' || tab === 'bestiary' || tab === 'gm-screen')) {
      setIsSidebarCollapsed(false);
    }
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedRoomCodeHeader, setCopiedRoomCodeHeader] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeRoomCode = currentAdventureId || peerId;

  const handleCopyCodeFromHeader = () => {
    if (!activeRoomCode) return;
    navigator.clipboard.writeText(activeRoomCode);
    setCopiedRoomCodeHeader(true);
    showToast(`Código da sala "${activeRoomCode}" copiado para a área de transferência!`);
    setTimeout(() => setCopiedRoomCodeHeader(false), 2500);
  };

  const handleCopyInviteLinkFromHeader = () => {
    if (!activeRoomCode) return;
    const inviteUrl = `${window.location.origin}${window.location.pathname}?sala=${encodeURIComponent(activeRoomCode)}`;
    navigator.clipboard.writeText(inviteUrl);
    showToast(`Link de convite para a sala "${activeRoomCode}" copiado!`);
  };

  // Ao conectar ou reconectar, decidir para onde vai
  useEffect(() => {
    console.log("AppContent Mounted/Updated. Mode:", viewMode, "isConnected:", isConnected, "isHost:", isHost);

    // Se for HOST restaurando sessão prévia (ex: refresh de tela no meio da partida)
    const isGameStarted = sessionStorage.getItem('rpg_game_started') === 'true';
    if (isConnected && isHost && viewMode === 'connection' && isGameStarted) {
      console.log("Host session restored from in-game refresh, switching to game view...");
      setViewMode('game');
    }

    // Se for PLAYER e conectar/restaurar
    if (isConnected && !isHost && viewMode === 'connection') {
      const savedCharId = localStorage.getItem('rpg_selected_char_id');
      if (savedCharId) {
        console.log("Player reconnected with saved character, going to game...");
        setSelectedCharacterId(savedCharId);
        setViewMode('game');
      } else {
        console.log("Player connected, switching to character setup...");
        setViewMode('character-setup');
      }
    }
  }, [isConnected, isHost, viewMode]);

  // Listen for room closure from host
  useEffect(() => {
    const handleRoomClosed = (e: any) => {
      sessionStorage.removeItem('rpg_game_started');
      localStorage.removeItem('rpg_selected_char_id');
      closeAdventure();
      setViewMode('connection');
      const msg = e.detail?.reason || 'A mesa foi encerrada pelo Mestre.';
      showToast(msg);
      alert(msg);
    };
    window.addEventListener('rpg_room_closed', handleRoomClosed);
    return () => window.removeEventListener('rpg_room_closed', handleRoomClosed);
  }, []);

  // Handle Hash Navigation (for Rulebook links)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#rules-player') {
        if (viewMode === 'game') setActiveTab('rules-player');
        else setViewMode('rules-player');
      }
      if (hash === '#rules-gm') {
        if (viewMode === 'game') setActiveTab('rules-gm');
        else setViewMode('rules-gm');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check on load
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [viewMode]);

  // AUTO-SYNC FIX: When character is selected, announce it to the room
  const { updateMyCharacter, broadcastCharacterUpdate } = usePeer();
  useEffect(() => {
    if (selectedCharacterId && isConnected) {
      // Dynamically load repo to avoid cyclic dependencies if any
      import('./features/character/characterRepository').then(async ({ CharacterRepository }) => {
        const char = await CharacterRepository.loadAsync(selectedCharacterId);
        if (char) {
          console.log("Auto-Syncing Character:", char.name);
          updateMyCharacter(char);
          broadcastCharacterUpdate(char);
        }
      });
    }
  }, [selectedCharacterId, isConnected]);

  // Event Listener for "Open Sheet" request (from GM Token Modal)
  useEffect(() => {
    const handleOpenRequest = (e: CustomEvent<string>) => {
      const charId = e.detail;
      console.log("Request to open sheet:", charId);
      setSelectedCharacterId(charId);
      setActiveTab('character');
    };
    window.addEventListener('request_open_sheet' as any, handleOpenRequest);
    return () => window.removeEventListener('request_open_sheet' as any, handleOpenRequest);
  }, []);

  /* ------------------------------------------------------------------
   * RENDER LOGIC
   * ------------------------------------------------------------------ */

  // . External Rulebooks View (No Session Required)
  if (viewMode === 'rules-player' || viewMode === 'rules-gm') {
    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <button
          onClick={() => {
            setViewMode('connection');
            window.history.pushState(null, '', ' '); // Clear hash
          }}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: '#333', border: '1px solid #555', color: '#fff',
            padding: '10px 20px', cursor: 'pointer', zIndex: 100
          }}
        >
          Voltar ao Menu
        </button>
        <Suspense fallback={<LazyLoadingFallback />}>
          {viewMode === 'rules-player' && <PlayerRulebook />}
          {viewMode === 'rules-gm' && <GMRulebook />}
        </Suspense>
      </div>
    );
  }

  // 1. Connection Screen
  if (viewMode === 'connection') {
    return (
      <ConnectionScreen
        onStartGame={() => {
          sessionStorage.setItem('rpg_game_started', 'true');
          setViewMode('game');
        }}
        onOpenPlayerRules={() => setViewMode('rules-player')}
        onOpenGMRules={() => setViewMode('rules-gm')}
      />
    )
  }

  // 2. Character Setup (Player Only)
  if (viewMode === 'character-setup') {
    return (
      <div style={{ width: '100vw', height: '100vh', background: 'var(--bg-deep)', overflow: 'hidden' }}>
        <Suspense fallback={<LazyLoadingFallback />}>
          <CharacterSelection onSelect={(charId) => {
            setSelectedCharacterId(charId);
            localStorage.setItem('rpg_selected_char_id', charId);
            setActiveTab('character'); // Force tab switch
            setViewMode('game');
          }} />
        </Suspense>
      </div>
    );
  }

  // 3. Premium Main Game View
  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="app-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#c5a059" />
            <span>RPG Tabletop</span>
          </div>

          {/* BADGE DE CONEXÃO SOCKET.IO */}
          <ConnectionBadge
            status={connectionState}
            onReconnect={reconnectNow}
          />

          {/* CÓDIGO DA SALA EM DESTAQUE NO HEADER */}
          {activeRoomCode && (
            <div
              className="room-code-badge"
              onClick={handleCopyCodeFromHeader}
              title="Clique para copiar o Código da Sala"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, rgba(22, 22, 34, 0.95) 0%, rgba(12, 12, 20, 0.98) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.45)',
                borderRadius: '20px',
                padding: '4px 12px',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.18)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Shield size={13} color="#ffd700" />
              <span style={{ fontSize: '0.75rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {isHost ? 'Mesa:' : 'Sala:'}
              </span>
              <span style={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: '#ffd700',
                fontSize: '0.95rem',
                letterSpacing: '1px'
              }}>
                {activeRoomCode}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyCodeFromHeader();
                }}
                style={{
                  background: copiedRoomCodeHeader ? '#4caf50' : '#ffd700',
                  color: '#000',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
                title="Copiar Código da Sala"
              >
                {copiedRoomCodeHeader ? <Check size={12} /> : <Copy size={12} />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyInviteLinkFromHeader();
                }}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Copiar Link de Convite Direto para Jogadores"
              >
                <Link2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* NAVEGAÇÃO PROFISSIONAL COM ÍCONES VETORIAIS */}
        <nav className="nav-tabs" style={{ margin: '0 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button className={`nav-tab ${activeTab === 'character' ? 'active' : ''}`} onClick={() => setActiveTab('character')}>
            <User size={15} />
            <span>Ficha</span>
            {!isHost && myCharacter?.pendingLevelUp && (
              <span style={{
                background: '#ffd700',
                color: '#000',
                fontSize: '0.68rem',
                fontWeight: 'bold',
                padding: '1px 6px',
                borderRadius: '8px',
                marginLeft: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px'
              }}>
                <Sparkles size={10} />
                <span>Nv {myCharacter.level}!</span>
              </span>
            )}
          </button>
          <button className={`nav-tab ${activeTab === 'dice' ? 'active' : ''}`} onClick={() => handleTabSelect('dice')}>
            <Dices size={15} />
            <span>Dados</span>
          </button>
          <button className={`nav-tab ${activeTab === 'combat' ? 'active' : ''}`} onClick={() => handleTabSelect('combat')}>
            <Swords size={15} />
            <span>Combate</span>
          </button>
          {isHost && (
            <button className={`nav-tab ${activeTab === 'bestiary' ? 'active' : ''}`} onClick={() => handleTabSelect('bestiary')}>
              <Skull size={15} />
              <span>Monstros</span>
            </button>
          )}
          {isHost && (
            <button className={`nav-tab ${activeTab === 'gm-screen' ? 'active' : ''}`} onClick={() => handleTabSelect('gm-screen')}>
              <Shield size={15} />
              <span>Painel GM</span>
            </button>
          )}
        </nav>
        <nav className="nav-tabs" style={{ margin: '0 20px', borderLeft: '1px solid #333', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button className={`nav-tab ${activeTab === 'rules-player' ? 'active' : ''}`} onClick={() => handleTabSelect('rules-player')}>
            <BookOpen size={15} />
            <span>Regras</span>
          </button>
          {isHost && (
            <button className={`nav-tab ${activeTab === 'rules-gm' ? 'active' : ''}`} onClick={() => handleTabSelect('rules-gm')}>
              <Scroll size={15} />
              <span>Mestre</span>
            </button>
          )}
        </nav>

        {/* Map Tools & Exit Controls (Right Side) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <MapHeaderControls />
          <button
            className="glass-button small"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Sair da Tela Cheia (Esc / F11)" : "Tela Cheia"}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px' }}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
          {isHost ? (
            <button
              onClick={() => {
                if (confirm("Deseja realmente encerrar a mesa? Isso desconectará todos os jogadores e fechará a sala.")) {
                  localStorage.removeItem('rpg_selected_char_id');
                  sessionStorage.removeItem('rpg_game_started');
                  closeRoom();
                  closeAdventure();
                  setViewMode('connection');
                }
              }}
              style={{
                background: '#7f1d1d', border: '1px solid #991b1b', color: '#fff',
                padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem'
              }}
              title="Encerrar mesa e fechar sala para todos"
            >
              <LogOut size={14} />
              <span>Encerrar Mesa</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (confirm("Deseja sair da mesa?")) {
                  localStorage.removeItem('rpg_selected_char_id');
                  sessionStorage.removeItem('rpg_game_started');
                  disconnect();
                  closeAdventure();
                  setViewMode('connection');
                }
              }}
              style={{
                background: '#374151', border: '1px solid #4b5563', color: '#fff',
                padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem'
              }}
              title="Sair da sala"
            >
              <LogOut size={14} />
              <span>Sair da Sala</span>
            </button>
          )}
        </div>
      </header>

      {/* FLOATING LEVEL UP BANNER FOR PLAYERS */}
      {!isHost && myCharacter?.pendingLevelUp && activeTab !== 'character' && (
        <div
          onClick={() => setActiveTab('character')}
          style={{
            position: 'fixed',
            top: '56px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.95) 0%, rgba(184, 134, 11, 0.95) 100%)',
            color: '#000',
            padding: '6px 18px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(255, 215, 0, 0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Clique para abrir sua ficha e configurar seu novo nível"
        >
          <Sparkles size={14} />
          <span>Subiu para o Nível {myCharacter.level}! Clique aqui para configurar suas novas perícias e habilidades.</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="main-layout">

        {/* SIDEBAR (Glass Panel) */}
        <div className={`sidebar-panel ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '6px 10px',
            borderBottom: '1px solid var(--glass-border)'
          }}>
            <button
              className="glass-button small"
              onClick={() => setIsSidebarCollapsed(true)}
              title="Recolher Painel Lateral"
              style={{ padding: '3px 6px' }}
            >
              <PanelLeftClose size={14} />
            </button>
          </div>

          <ErrorBoundary name="SidebarContent">
            <Suspense fallback={<LazyLoadingFallback />}>
              {activeTab === 'dice' && <DiceSidebar />}

              {/* Character Sheet MOVED to Central Modal */}
              {activeTab === 'character' && (
                <div style={{ padding: 20, color: '#aaa', textAlign: 'center', marginTop: '50px' }}>
                  <p>A ficha agora abre em modo de foco central.</p>
                  {!selectedCharacterId && isHost && (
                    <p style={{ marginTop: '10px' }}>Selecione um token ou jogador para ver detalhes.</p>
                  )}
                  {!selectedCharacterId && !isHost && (
                    <p style={{ marginTop: '10px' }}>Carregando dados da ficha...</p>
                  )}
                </div>
              )}

              {activeTab === 'combat' && <InitiativeTracker />}

              {activeTab === 'bestiary' && isHost && <BestiarySidebar />}

              {activeTab === 'gm-screen' && isHost && <GMScreen />}
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* MAP AREA */}
        <div className="map-area" style={{
          transition: 'filter 0.3s ease',
          filter: (activeTab === 'character' && selectedCharacterId) ? 'blur(5px) brightness(0.4)' : 'none'
        }}>
          {isSidebarCollapsed && (
            <button
              className="sidebar-floating-toggle"
              onClick={() => setIsSidebarCollapsed(false)}
              title="Expandir Painel Lateral"
            >
              <PanelLeftOpen size={18} />
            </button>
          )}

          <ErrorBoundary name="BattleMap"><BattleMap /></ErrorBoundary>
          <ErrorBoundary name="DiceOverlay">
            <Suspense fallback={null}>
              <DiceOverlay />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* CHAT WINDOW */}
        <ChatWindow />

        {/* --- CENTRAL CHARACTER SHEET MODAL --- */}
        {activeTab === 'character' && selectedCharacterId && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: '50px', left: 0, width: '100vw', height: 'calc(100vh - 50px)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
          }}>
            <div className="glass-panel" style={{
              width: '90%', maxWidth: '1200px', height: '90%',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: '0 0 50px rgba(0,0,0,0.8)', border: '1px solid rgba(197, 160, 89, 0.3)',
              background: 'rgba(20, 20, 20, 0.95)'
            }}>
              <Suspense fallback={<LazyLoadingFallback />}>
                <CharacterSheet
                  characterId={selectedCharacterId}
                  isGM={isHost}
                  onExit={() => {
                    if (isHost) {
                      setSelectedCharacterId(null);
                    } else {
                      setActiveTab('dice');
                    }
                  }}
                />
              </Suspense>
            </div>
          </div>
        )}

        {/* --- RULEBOOKS MODAL --- */}
        {(activeTab === 'rules-player' || activeTab === 'rules-gm') && (
          <div className="modal-overlay" style={{
            position: 'fixed', top: '50px', left: 0, width: '100vw', height: 'calc(100vh - 50px)',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
          }}>
            <div className="glass-panel" style={{
              width: '90%', maxWidth: '1200px', height: '90%',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
              boxShadow: '0 0 50px rgba(0,0,0,0.8)', border: '1px solid rgba(197, 160, 89, 0.3)',
              background: 'var(--bg-secondary)',
              position: 'relative'
            }}>
              <button
                onClick={() => setActiveTab('dice')}
                style={{
                  position: 'absolute', top: 20, right: 20,
                  background: 'none', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 10,
                  display: 'flex', alignItems: 'center'
                }}
                title="Fechar (Esc)"
              >
                <X size={24} />
              </button>
              <Suspense fallback={<LazyLoadingFallback />}>
                {activeTab === 'rules-player' && <PlayerRulebook />}
                {activeTab === 'rules-gm' && <GMRulebook />}
              </Suspense>
            </div>
          </div>
        )}

      </div>

      {/* Floating Room Code / Action Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#151522',
          border: '1px solid #ffd700',
          color: '#ffd700',
          padding: '10px 22px',
          borderRadius: '24px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
          zIndex: 99999,
          fontSize: '0.9rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none'
        }}>
          <Shield size={16} color="#ffd700" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <MultiplayerProvider>
      <AdventureProvider>
        <CombatProvider>
          <MapProvider>
            <SceneProvider>
              <AudioProvider>
                <ChatProvider>
                  <RollHistoryProvider>
                    <DiceProvider>
                      <AppContent />
                      <MusicPlayer />
                      <Soundboard />
                    </DiceProvider>
                  </RollHistoryProvider>
                </ChatProvider>
              </AudioProvider>
            </SceneProvider>
          </MapProvider>
        </CombatProvider>
      </AdventureProvider>
    </MultiplayerProvider>
  )
}

export default App
