const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Auth = require('./routes/auth');
const FaceBook = require('./routes/facebook');
require('dotenv').config()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const clientIo = require('socket.io-client');
const WhatsApp = require('./routes/whatsapp');
const Webhook = require('./routes/webhook');
const Client = clientIo("ws://localhost:8000")

function StartApp() {
    try {
        app.use(cors());
        app.options('*', cors());
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json());
        server.listen(process.env.PORT, function() {
            console.log("Server is Running on " + process.env.PORT)
        });
        app.use('/auth', Auth)
        app.use('/faceBook', FaceBook)
        app.use('/whatsapp', WhatsApp)
        app.use('/Webhook', Webhook)
        app.all('*', function(req, res) {
            res.setHeader('Content-type', 'application/json')
            res.status(404).json({ status: 0, message: 'Incorrect Request' });
        });

        // socket setup

        io.on('connection', (socket) => {
            console.log('Connected');
            socket.on('disconnect', () => {
                console.log('Disconnected');
            });

            socket.on('message', (data) => {
                console.log('chat message: ' + data);
                if (data == 'ping') {
                    name()
                    socket.emit('message', 'pang')
                }
            });
        });

        function name() {
            Client.emit('message', 'pang')
        }
        // end
    } catch (e) {
        console.log(e)
    }
}
StartApp();