const app = require('./app');
const initWebSocketServer = require('./services/websocket')
const PORT = 5000;
const WEBSOCKET_PORT = 8080;


app.listen(PORT, () => {
    console.log(`Server is running at port:${PORT}`)
})
initWebSocketServer(WEBSOCKET_PORT)