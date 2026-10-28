import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Uncaught error in ${this.props.name || 'Aplicação'}:`, error, errorInfo);

        const isChunkError = error.message?.includes('dynamically imported module') ||
                             error.message?.includes('Failed to fetch') ||
                             (error.name === 'TypeError' && error.message?.includes('import'));

        if (isChunkError && typeof window !== 'undefined') {
            const lastReload = parseInt(sessionStorage.getItem('last_chunk_reload') || '0', 10);
            if (Date.now() - lastReload > 5000) {
                sessionStorage.setItem('last_chunk_reload', Date.now().toString());
                console.warn('[ErrorBoundary] Stale chunk detected after deployment. Auto-reloading page...');
                window.location.reload();
            }
        }
    }

    public render() {
        if (this.state.hasError) {
            const isChunkError = this.state.error?.message?.includes('dynamically imported module') ||
                                 this.state.error?.message?.includes('Failed to fetch') ||
                                 (this.state.error?.name === 'TypeError' && this.state.error?.message?.includes('import'));

            if (isChunkError) {
                return (
                    <div style={{
                        padding: '24px',
                        background: 'linear-gradient(135deg, rgba(20, 24, 40, 0.95) 0%, rgba(10, 14, 25, 0.98) 100%)',
                        color: '#f8fafc',
                        border: '1px solid rgba(255, 215, 0, 0.4)',
                        borderRadius: '12px',
                        margin: '20px auto',
                        maxWidth: '520px',
                        textAlign: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#ffd700', fontSize: '1.2rem' }}>
                            Nova Versão da Mesa Disponível!
                        </h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                            Uma atualização do RPG Tabletop foi publicada. Clique abaixo para carregar a versão mais recente.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            style={{
                                background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)',
                                color: '#000',
                                border: 'none',
                                padding: '10px 24px',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                            }}
                        >
                            Atualizar Página Agora (F5)
                        </button>
                    </div>
                );
            }

            return (
                <div style={{ padding: 20, background: '#1c1313', color: '#ff8888', border: '1px solid #771111', borderRadius: '8px', margin: '16px' }}>
                    <h3 style={{ marginTop: 0 }}>Erro em: {this.props.name || 'Aplicação'}</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{this.state.error?.message}</pre>
                    <pre style={{ opacity: 0.7, fontSize: '0.85em', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{this.state.error?.stack?.slice(0, 300)}...</pre>
                </div>
            );
        }

        return this.props.children;
    }
}
