# Quick Task: Implementar Opções Oficiais do PHB 2024 (Itens 1, 2, 3, 4)

## Objetivo
Deixar o Criador de Ficha (`CharacterBuilder.tsx`) 100% fiel ao Livro do Jogador Oficial (D&D 5.5e / 2024) implementando:
1. **Linhagens e Subespécies**: Escolhas oficiais para Elfo (Alto Elfo, Floresta, Drow), Draconato (10 Ancestralidades Dracônicas), Golias (6 Gigantes), Tiefling (3 Legados), Gnomo (Floresta, Rochas), Humano (Tamanho Médio/Pequeno + 2º Talento de Origem) e Anão (ferramenta de artesão).
2. **Escolhas dos Talentos de Origem**: Seleção interativa para *Iniciado em Magia* (2 truques + 1 magia nv 1), *Habilidoso* (3 perícias/ferramentas), *Músico* (3 instrumentos) e *Artífice* (3 ferramentas).
3. **Seleção de Idiomas 2024**: Todo personagem escolhe Comum + 2 Idiomas Comuns da tabela oficial.
4. **Subclasse para Nível Inicial >= 3 e Rolagem 4d6**: Suporte à seleção de subclasse ao iniciar no nível 3+ e botão/modal de rolagem 4d6 (descarte do menor) para atributos.

## Tarefas
- [x] Task 1: Atualizar `src/features/character/data/races.ts` e `characterTypes.ts` com subraças/linhagens estruturadas.
- [x] Task 2: Atualizar `CharacterBuilder.tsx` para renderizar os seletores de linhagem, tamanho e ferramenta na etapa "Origem".
- [x] Task 3: Implementar escolhas interativas para Talentos de Origem (*Iniciado em Magia*, *Habilidoso*, *Músico*, *Artífice*).
- [x] Task 4: Atualizar etapa de Idiomas para conceder Comum + 2 idiomas comuns conforme PHB 2024 p. 43.
- [x] Task 5: Adicionar seleção de Subclasse quando `startingLevel >= 3` e modo de rolagem 4d6 na etapa de Atributos.
- [x] Task 6: Verificar compilação (`tsc -b`), testes e build.
