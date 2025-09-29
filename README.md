# SynchroStream

SynchroStream é uma aplicação web focada em entregar conteúdo de vídeo pré-gravado (VOD) com a experiência e disciplina de uma transmissão ao vivo (Live TV). Seu principal objetivo é a sincronização perfeita: garantir que todos os espectadores assistindo à transmissão vejam o mesmo quadro, no mesmo instante, não importando o momento em que se conectem. Ela transforma um arquivo de mídia em uma "programação" linear com hora marcada.

## Como Funciona (Visão Geral):

- Processamento (Backend): O arquivo de vídeo de origem é processado (FFmpeg) para ser dividido em pequenos segmentos e playlists no formato HLS (HTTP Live Streaming), em várias qualidades (bitrates).
- Serviço e Lógica (Servidor): Um processo central no Backend rastreia o timestamp exato da transmissão em andamento. Ele gera dinamicamente as playlists HLS para os novos clientes, instruindo-os a começar a reprodução no ponto preciso da transmissão.
- Entrega (CDN/Nginx): Os segmentos de vídeo são servidos de forma otimizada via servidor web de alto desempenho (ou idealmente um CDN) para garantir a baixa latência e escalabilidade.
- Sincronização (WebSockets): Um canal de comunicação em tempo real (WebSockets) é usado para monitorar e corrigir os players que se desviam do tempo exato da transmissão, forçando-os à ressincronização.

## Funcionalidades Principais:

- Streaming Adaptativo (HLS): Suporte nativo ao HLS, permitindo que a qualidade do vídeo seja ajustada automaticamente (bitrate) com base na velocidade de internet do usuário.
- Sincronização Precisa: Lógica de servidor que calcula o chunk exato para cada novo espectador e usa WebSockets para manter todos os players alinhados com o tempo real da transmissão.
- Experiência Linear (Live TV): O player de vídeo não possui barra de progresso, botão de pausa ou avanço/retrocesso, reforçando a natureza "ao vivo" da transmissão.
- Entrega Otimizada: Preparado para trabalhar com Content Delivery Networks (CDN) e servidores Nginx para lidar com grandes volumes de acesso simultâneo.
- Monitoramento de Status: Exibição clara do status da transmissão ("AO VIVO", "Em Buffer", "Desconectado") e informações sobre a qualidade atual de streaming.

## Experiência do Usuário

Ao acessar o SynchroStream, o usuário é imediatamente colocado no ponto da série que está sendo transmitida. O foco é a simplicidade da visualização.

- Player Minimalista: O player ocupa o centro da tela, com controles de volume e seleção de qualidade (quando disponível), mas sem o seek bar ou controle de pausa/reprodução não-linear.
- Status de Transmissão: Um indicador proeminente "AO VIVO" confirma a natureza da transmissão.
- Feedback de Sincronia: O player comunica sutilmente (se necessário) quando o cliente está atrasado e está sendo ressincronizado automaticamente, garantindo que o usuário não se perca no tempo da série.

## Tecnologias-Chave

- Frontend: HTML5, CSS3, JavaScript (com Hls.js para reprodução e Socket.io-client para sincronização).
- Backend: Node.js (com Express/Socket.io) ou Python (com Flask/Django) para a Lógica de Sincronização.
- Mídia: FFmpeg (Transcodificação), HLS (Protocolo de Entrega), Nginx/CDN (Serviço de Mídia).

## Equipe:

Caio Luiz Lacerda Terto Silva
Felipe da Silva Oliveira
Gabriel Gomes Castanha Maiolo
