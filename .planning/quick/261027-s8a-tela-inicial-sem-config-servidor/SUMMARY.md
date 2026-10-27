---
status: complete
---

# Quick: 261027-s8a-tela-inicial-sem-config-servidor

## Objetivo
1. Remover da tela inicial qualquer opcao de configurar o servidor de rede (botao do header, botao flutuante e modal).
2. Centralizar e destacar as acoes "Criar Sala como Mestre" / "Entrar como Jogador".

## Mudancas
- ConnectionScreen.tsx: removidos modal/botoes/estado de servidor; layout reescrito (palco central com seletor de universo compacto + botoes grandes com subtitulo).
- ConnectionScreen.css: classes role-screen, role-stage, action-hero, universe-card, role-btn em coluna; responsivo para telas baixas.
- SocketContext.tsx: removida a API setServerUrl; serverUrl vem so de VITE_SOCKET_SERVER_URL ou da origem atual; overrides antigos do localStorage (rpg_server_url*) sao limpos no boot.

## Verificacao
tsc -b OK, eslint sem erros, build OK.
