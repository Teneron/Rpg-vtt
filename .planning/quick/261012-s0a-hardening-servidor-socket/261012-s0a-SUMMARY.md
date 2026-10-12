---
status: complete
quick_id: 261012-s0a
date: 2026-10-12
---

# Quick Task Summary: 261012-s0a - Hardening do servidor Socket.io (Fase 0)

## Result
Servidor não cai mais com payloads malformados e rejeita broadcasts/mensagens não autorizados.

## Verification
- Reproduzido o crash original (`TypeError: Cannot destructure property 'roomId' of 'undefined'`) com o `server.js` antigo via `server/test-hardening.js` (falha em 4 asserts / o processo morre).
- Com o novo `server.js`: 17/17 asserts passam; `npm test` completo (combat, map, storage, server bus, hardening) sai com código 0.

## Behavior changes to be aware of
- `room_broadcast` agora aceita apenas `force_refresh`, enviado por um Mestre membro da sala (único uso atual do cliente: `triggerForceRefresh`).
- `peer_message` de sockets que não são membros da sala é descartado.
- Jogadores não entram em mesas cujo Mestre está offline (comportamento originalmente pretendido; antes nunca disparava).
- `isHost` precisa ser exatamente `true` (cliente já envia booleano).
- Novas variáveis de ambiente opcionais: `ALLOWED_ORIGINS`, `MAX_PAYLOAD_BYTES`, `MAX_ROOMS`, `MAX_MEMBERS_PER_ROOM`.

## Pending (Fase 1+)
`isHost` ainda é declarado pelo cliente (hijack de Mestre), `MAP_UPDATE`/`COMBAT_UPDATE`/`AUDIO_UPDATE` ainda aceitos de qualquer membro, `senderId` do chat falsificável.
