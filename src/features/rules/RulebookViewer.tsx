import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './Rulebook.css';

export interface RuleSection {
    id: string;
    title: string;
    category?: string;
    content: React.ReactNode;
}

interface RulebookViewerProps {
    title: string;
    subtitle?: string;
    systemBadge?: {
        icon: string;
        text: string;
        color?: string;
    };
    sections: RuleSection[];
    headerControls?: React.ReactNode;
}

export const RulebookViewer: React.FC<RulebookViewerProps> = ({
    title,
    subtitle,
    systemBadge,
    sections,
    headerControls
}) => {
    const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id || '');
    const [searchFilter, setSearchFilter] = useState('');

    // Derive activeSection: if selected is invalid for current sections, fallback to first
    const activeSection = sections.some(s => s.id === selectedSectionId)
        ? selectedSectionId
        : (sections[0]?.id || '');

    const filteredSections = searchFilter.trim() === ''
        ? sections
        : sections.filter(s => s.title.toLowerCase().includes(searchFilter.toLowerCase()));

    const currentSection = sections.find(s => s.id === activeSection) || sections[0];

    return (
        <div className="rulebook-container">
            <nav className="rulebook-toc">
                {headerControls && (
                    <div className="rulebook-system-controls">
                        {headerControls}
                    </div>
                )}

                <div className="rulebook-toc-header">
                    <h3>Índice</h3>
                    <div className="rulebook-search-box">
                        <Search size={14} className="rulebook-search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar tópicos..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="rulebook-search-input"
                        />
                    </div>
                </div>

                <ul className="rulebook-toc-list">
                    {filteredSections.map((section, idx) => {
                        const showCategoryHeader = !searchFilter.trim() &&
                            section.category &&
                            (idx === 0 || filteredSections[idx - 1]?.category !== section.category);
                        return (
                            <React.Fragment key={section.id}>
                                {showCategoryHeader && (
                                    <li className="rulebook-toc-category">
                                        {section.category}
                                    </li>
                                )}
                                <li>
                                    <a
                                        onClick={() => setSelectedSectionId(section.id)}
                                        className={activeSection === section.id ? 'active' : ''}
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            </React.Fragment>
                        );
                    })}
                    {filteredSections.length === 0 && (
                        <li className="rulebook-no-results">Nenhum tópico encontrado.</li>
                    )}
                </ul>
            </nav>

            <main className="rulebook-content">
                <header className="rulebook-main-header">
                    {systemBadge && (
                        <div
                            className="rulebook-system-badge"
                            style={{ borderColor: systemBadge.color || 'var(--color-accent)' }}
                        >
                            <span className="badge-icon">{systemBadge.icon}</span>
                            <span className="badge-text">{systemBadge.text}</span>
                        </div>
                    )}
                    <h1>{title}</h1>
                    {subtitle && <p className="rulebook-subtitle">{subtitle}</p>}
                </header>

                {currentSection && (
                    <div key={currentSection.id} className="fade-in rulebook-section-body">
                        <h2>{currentSection.title}</h2>
                        {currentSection.content}
                    </div>
                )}
            </main>
        </div>
    );
};
