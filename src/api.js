const restHost = 'http://localhost:3001';
const wsHost = 'wss://ftx.com/ws/';

export async function fetchData(market, resolution) {
    const response = await fetch(`${restHost}/markets/${market}/candles?resolution=${resolution}`, {
        headers: {
            'Accept': 'application/json',
        },
    });
    const data = await response.json();
    return data.result.map(({ time, open, high, low, close, volume }) => {
        return {
            timestamp: time,
            open,
            high,
            low,
            close,
            volume,
        };
    });
}

export function subscribeTrade(market) {
    const socket = new WebSocket(wsHost);
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({
            "op": "subscribe",
            "channel": "trades",
            "market": market,
        }));
    });

    return socket;
}