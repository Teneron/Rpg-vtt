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
import { AdventureProvider } from './features/adventure/AdventureContext'
import { MapProvider } from './features/map/MapContext'
import { SceneProvider } from './features/map/SceneContext'
import { CombatProvider } from './features/combat/CombatContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChatWindow } from './features/chat/ChatWindow';
import { ChatProvider } from './features/chat/ChatContext';
import { AudioProvider } from './features/audio/AudioContext';
import { MusicPlayer } from './features/audio/MusicPlayer';
import { Soundboard } from './features/audio/Soundboard';

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
    <span style={{ fontSize: '1.2rem' }}>⏳</span>
    <span style={{ fontSize: '0.9rem' }}>Carregando módulo...</span>
  </div>
);

type Tab = 'dice' | 'character' | 'map' | 'gm-screen' | 'combat' | 'bestiary' | 'rules-player' | 'rules-gm';

function AppContent() {
  const { isConnected, isHost, disconnect } = usePeer();
  const [activeTab, setActiveTab] = useState<Tab>('character');
  const [viewMode, setViewMode] = useState<'connection' | 'game' | 'character-setup' | 'rules-player' | 'rules-gm'>('connection');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(() => {
    return localStorage.getItem('rpg_selected_char_id') || null;
  });

  // Ao conectar ou reconectar, decidir para onde vai
  useEffect(() => {
    console.log("AppContent Mounted/Updated. Mode:", viewMode, "isConnected:", isConnected, "isHost:", isHost);

    // Se for HOST e conectar/restaurar sessão na tela inicial, vai direto para o jogo
    if (isConnected && isHost && viewMode === 'connection') {
      console.log("Host connected/restored, switching to game view...");
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
        onStartGame={() => setViewMode('game')}
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
        <div className="app-title">
          🔮 RPG Tabletop
        </div>

        {/* PREMIUM TABS */}
        <nav className="nav-tabs" style={{ margin: '0 20px' }}>
          <button className={`nav-tab ${activeTab === 'character' ? 'active' : ''}`} onClick={() => setActiveTab('character')}>
            👤 Ficha
          </button>
          <button className={`nav-tab ${activeTab === 'dice' ? 'active' : ''}`} onClick={() => setActiveTab('dice')}>
            🎲 Dados
          </button>
          <button className={`nav-tab ${activeTab === 'combat' ? 'active' : ''}`} onClick={() => setActiveTab('combat')}>
            ⚔️ Combate
          </button>
          {isHost && (
            <button className={`nav-tab ${activeTab === 'bestiary' ? 'active' : ''}`} onClick={() => setActiveTab('bestiary')}>
              🐉 Monstros
            </button>
          )}
          {isHost && (
            <button className={`nav-tab ${activeTab === 'gm-screen' ? 'active' : ''}`} onClick={() => setActiveTab('gm-screen')}>
              🛡️ GM
            </button>
          )}
        </nav>
        <nav className="nav-tabs" style={{ margin: '0 20px', borderLeft: '1px solid #333', paddingLeft: '20px' }}>
          <button className={`nav-tab ${activeTab === 'rules-player' ? 'active' : ''}`} onClick={() => setActiveTab('rules-player')}>
            📖 Regras
          </button>
          {isHost && (
            <button className={`nav-tab ${activeTab === 'rules-gm' ? 'active' : ''}`} onClick={() => setActiveTab('rules-gm')}>
              📜 Mestre
            </button>
          )}
        </nav>

        {/* Map Tools (Right Side) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <MapHeaderControls />
          <button
            onClick={() => {
              if (confirm("Sair da sessão?")) {
                localStorage.removeItem('rpg_selected_char_id');
                disconnect();
                setViewMode('connection');
              }
            }}
            style={{
              background: '#550000', border: '1px solid #770000', color: '#fff',
              padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
            }}
            title="Sair / Deslogar"
          >
            🚪 Sair
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">

        {/* SIDEBAR (Glass Panel) */}
        <div className="sidebar-panel">
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
                    <button
                      onClick={() => setViewMode('character-setup')}
                      style={{ marginTop: '20px', padding: '10px', background: '#333', color: '#fff', border: '1px solid #555', cursor: 'pointer' }}
                    >
                      Selecionar Personagem
                    </button>
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
                  background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10
                }}
              >
                ✕
              </button>
              <Suspense fallback={<LazyLoadingFallback />}>
                {activeTab === 'rules-player' && <PlayerRulebook />}
                {activeTab === 'rules-gm' && <GMRulebook />}
              </Suspense>
            </div>
          </div>
        )}

      </div>
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
                <DiceProvider>
                  <RollHistoryProvider>
                    <ChatProvider>
                      <AppContent />
                      <MusicPlayer />
                      <Soundboard />
                    </ChatProvider>
                  </RollHistoryProvider>
                </DiceProvider>
              </AudioProvider>
            </SceneProvider>
          </MapProvider>
        </CombatProvider>
      </AdventureProvider>
    </MultiplayerProvider>
  )
}

export default App
