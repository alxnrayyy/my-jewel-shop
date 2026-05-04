const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Импортируем твои маршруты для товаров (из lab 8)
const itemsRouter = require('./rest.js'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Настройки EJS и статики
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// 1. ГЛАВНАЯ СТРАНИЦА (index.html или index.ejs)
app.get('/', (req, res) => {
    // Если у тебя главная в public/index.html:
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. ПОДКЛЮЧАЕМ МАРШРУТЫ ТОВАРОВ (теперь /view-items заработает)
app.use('/', itemsRouter);

// 3. МАРШРУТ ДЛЯ ЧАТА
app.get('/chat', (req, res) => {
    res.render('chat', { 
        // Если в чате нужны пустые переменные, чтобы не было ошибок
        search: '', 
        sort: '' 
    });
});

// 4. ЛОГИКА WEBSOCKET (SOCKET.IO)
const users = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('set-username', (username) => {
        users[socket.id] = username;
        io.emit('user-list', Object.values(users));
        socket.broadcast.emit('message', { 
            user: 'Система', 
            text: `${username} присоединился к чату` 
        });
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
            io.emit('message', { 
                user: 'Система', 
                text: `${username} покинул чат` 
            });
        }
    });
});

// 5. ЗАПУСК (ВАЖНО ДЛЯ RENDER)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});