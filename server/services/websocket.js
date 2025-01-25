const WebSocket = require('ws');
const db = require('../config/db');

const initWebSocketServer = (port) => {
    const wss = new WebSocket.Server({ port });

    const sendUpdates = async () => {
        wss.clients.forEach(async client => {
            if (client.readyState === WebSocket.OPEN) {
                const { rows } = await db.query(`
                SELECT 
                  (data->0->'block'->>'timestamp'):: TEXT AS timestamp,
                  (data->0->'block'->>'gasUsed'):: TEXT AS gasUsed
                  FROM "latest-blocks"
                  ORDER BY from_block_number DESC
                  LIMIT 10;
              `)
                client.send(JSON.stringify(rows))
            }
        })
    }
    setInterval(sendUpdates, 5000);

    wss.on('connection', (ws) => {
        console.log("Websocket client connected")
        ws.on('close', () => console.log("Websocket client closed"))
    })

    console.log(`Websocket server is running at Port ${port}`)

}

module.exports = initWebSocketServer