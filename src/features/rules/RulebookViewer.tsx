import React, { useState } from 'react';
import './Rulebook.css';

export interface RuleSection {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface RulebookViewerProps {
    title: string;
    sections: RuleSection[];
}

export const RulebookViewer: React.FC<RulebookViewerProps> = ({ title, sections }) => {
    const [activeSection, setActiveSection] = useState(sections[0].id);

    const currentSection = sections.find(s => s.id === activeSection) || sections[0];

    return (
        <div className="rulebook-container">
            <nav className="rulebook-toc">
                <h3>Índice</h3>
                <ul>
                    {sections.map(section => (
                        <li key={section.id}>
                            <a
                                onClick={() => setActiveSection(section.id)}
                                className={activeSection === section.id ? 'active' : ''}
                            >
                                {section.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className="rulebook-content">
                <h1>{title}</h1>

                <div key={currentSection.id} className="fade-in">
                    <h2>{currentSection.title}</h2>
                    {currentSection.content}
                </div>
            </main>
        </div>
    );
};
