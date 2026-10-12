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
    }

    public render() {
        if (this.state.hasError) {
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
