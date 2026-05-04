const express = require('express');
const http = require('http'); 
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server); 

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/chat', (req, res) => {
    res.render('chat');
});

const users = {};

io.on('connection', (socket) => {
    
    socket.on('set-username', (name) => {
        users[socket.id] = name; 
        
        io.emit('user-list', Object.values(users));
        
        socket.broadcast.emit('message', {
            user: 'Система',
            text: `${name} вошел в чат`
        });
    });

    socket.on('send-message', (text) => {
        io.emit('message', {
            user: users[socket.id] || 'Аноним',
            text: text
        });
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            delete users[socket.id];
            io.emit('user-list', Object.values(users)); 
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер чата запущен: http://localhost:${PORT}`);
});