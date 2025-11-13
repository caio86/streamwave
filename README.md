# StreamWave

StreamWave é uma plataforma de streaming VOD, desenvolvida com uma arquitetura escalável para entregar vídeo de forma eficiente e confiável. Ela combina a performance do streaming adaptativo com a experiência social de assistir em grupo, tudo em um único serviço.

## Como Funciona (Visão Geral):

**Processamento de Mídia (Backend):** Os arquivos de vídeo são processados automaticamente (FFmpeg) e segmentados no formato HLS (HTTP Live Streaming) em várias qualidades, preparando o conteúdo para streaming adaptativo.

**Gerenciamento e Serviço (Servidor):** Um backend eficiente gerencia o catálogo de vídeos e serve as playlists HLS dinamicamente, garantindo que cada usuário receba os segmentos de vídeo ideais para sua conexão.

**Entrega de Alta Performance (CDN/Nginx):** Os segmentos de vídeo são servidos por uma infraestrutura otimizada (Nginx ou CDN), assegurando baixa latência e escalabilidade para um grande número de usuários simultâneos.

**Sessões Compartilhadas (WebSockets):** A funcionalidade "WatchParty" utiliza WebSockets para sincronizar a reprodução entre todos os participantes de uma sala, criando uma experiência de assistir junto em tempo real.

## Funcionalidades Principais:

- **Streaming Adaptativo (HLS):** A qualidade do vídeo é ajustada automaticamente conforme a velocidade da internet do usuário.

- **Player Moderno:** Interface de usuário completa com controles de reprodução, busca e seleção de qualidade.

- **Catálogo Dinâmico:** Sistema para upload, organização e gerenciamento de um catálogo de vídeos.

## Tecnologias-Chave

- **Frontend:** HTML5, CSS3, JavaScript (Hls.js, Socket.io-client)

- **Backend:** Node.js (Express, Socket.io)

- **Mídia:** FFmpeg, HLS, Nginx

### Equipe:

Caio Luiz Lacerda Terto Silva

Felipe da Silva Oliveira

Gabriel Gomes Castanha Maiolo
