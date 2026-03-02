import { WebSocket, WebSocketServer } from 'ws';

let wss;
const subscriptions = new Map();

const isValidMatchId = (value) => Number.isInteger(value) && value > 0;

const subscribeClientToMatch = (ws, matchId) => {
    const numericMatchId = Number(matchId);
    if (!isValidMatchId(numericMatchId)) {
        return;
    }

    const current = subscriptions.get(ws) || new Set();
    current.add(numericMatchId);
    subscriptions.set(ws, current);
};

export const setupWebSocketServer = (server) => {
    wss = new WebSocketServer({ server, path: '/live-updates' });

    wss.on('connection', (ws, req) => {
        const url = new URL(req.url, 'http://localhost');
        const matchIdFromQuery = url.searchParams.get('matchId');

        if (matchIdFromQuery) {
            subscribeClientToMatch(ws, matchIdFromQuery);
        }

        ws.on('message', (message) => {
            try {
                const parsed = JSON.parse(message.toString());
                if (parsed?.type === 'subscribe' && parsed?.matchId) {
                    subscribeClientToMatch(ws, parsed.matchId);
                }
            } catch (error) {
                console.error('Invalid websocket message received:', error);
            }
        });

        ws.on('close', () => {
            subscriptions.delete(ws);
        });
    });
};

export const broadcastLiveMatchUpdate = (matchId, payload) => {
    if (!wss) {
        return;
    }

    const numericMatchId = Number(matchId);
    if (!isValidMatchId(numericMatchId)) {
        return;
    }

    const message = JSON.stringify({
        type: 'live-match-update',
        matchId: numericMatchId,
        data: payload,
        timestamp: new Date().toISOString(),
    });

    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) {
            continue;
        }

        const clientSubscriptions = subscriptions.get(client);
        if (clientSubscriptions?.has(numericMatchId)) {
            client.send(message);
        }
    }
};
