const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const itemsRouter = require('./rest.js'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Подключаем маршруты из rest.js
app.use('/', itemsRouter);

// Чат
app.get('/chat', (req, res) => {
    res.render('chat');
});

const users = {};

io.on('connection', (socket) => {
    socket.on('set-username', (username) => {
        users[socket.id] = username;
        io.emit('user-list', Object.values(users));
        socket.broadcast.emit('message', { user: 'Система', text: `${username} вошел в чат` });
    });

    socket.on('send-message', (text) => {
        if (users[socket.id]) {
            io.emit('message', { user: users[socket.id], text });
        }
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        if (username) {
            delete users[socket.id];
            io.emit('user-list', Object.values(users));
            socket.broadcast.emit('message', { user: 'Система', text: `${username} вышел из чата` });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});