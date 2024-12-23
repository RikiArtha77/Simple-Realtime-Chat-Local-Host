const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Set(); // Menyimpan koneksi yang aktif

app.use(express.static('public'));

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('received:', message);
        ws.send(message.toString());
    });
});

wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        console.log('received:', message);

        // Kirim pesan ke semua klien yang terhubung
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws); // Hapus klien dari daftar saat koneksi terputus
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});