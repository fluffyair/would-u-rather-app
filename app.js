const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

// utils
const { getRoomUsers, getCurrentUser, userJoin, userLeave, createRoom } = require('./utils/users');
const { uid, codes } = require('./utils/uid');
const { users } = require('./utils/users');
const { createQuestion } = require('./utils/rounds');

// server
const app = express();
const server = http.createServer(app)
let port = 3000;

// socket
const io = socketio(server)

let totalVotes = 0;
let ans = 0;
let voted = false;
io.on('connection', socket => {
    let r;
    socket.on('joinRoom', (room) => {
        socket.join(room)
        let l = getRoomUsers(room);
        setTimeout(() => {
            if(codes.includes(room)) {
                const user = userJoin(socket.id, room);
                if(l.length == 0) {
                    let qs = createQuestion();
                    socket.emit('passQuestion', qs);
                    user.running = true;
                    socket.emit('loadAns', 1, 0)
                };
                r = room;
            }
        }, 300);
    });

    socket.on('addVoter', (room, type) => {
        
        let l = getRoomUsers(room);
        totalVotes++;
        ans++;

        let fillt = [];
        l.every(x => {
            fillt = [];

            if(type == 'left') {
                x.roomVotes.left++;
            } else {
                x.roomVotes.right++;
            }    


            for (pp of l) {
                if(pp.running) fillt.push(pp);
            };

    
            if(totalVotes === fillt.length) {
                voted = true;
                let leftP = x.roomVotes.left / totalVotes * 100;
                let rightP = x.roomVotes.right / totalVotes * 100;
                let results = [leftP, rightP];
    
                socket.emit('giveResults', results);
                io.in(room).emit('giveResults', results);
    
                setTimeout(() => {
                    let qs = createQuestion();
                    socket.emit('passQuestion', qs);
                    io.in(room).emit('passQuestion', qs);
                    socket.emit('loadAns', l.length, 0)
                    io.in(room).emit('loadAns', l.length, 0);
                    l.forEach(y => {
                        y.roomVotes.left = 0;
                        y.roomVotes.right = 0;
                        y.running = true;
                        totalVotes = 0;
                        ans = 0;
                    });
    
                    setTimeout(() => {
                        socket.emit('resetClicker');
                        io.in(room).emit('resetClicker');    
                    }, 1500)
                    voted = false;
                }, 2000)
                return false;
            };
    
            return true;
        });

        console.log(fillt.length);
        socket.emit('loadAns', fillt.length, ans)
        io.in(room).emit('loadAns', fillt.length, ans);
    });

    socket.on('createId', () => {
        let id = uid();

        socket.emit('sendToRoom', id)
   });

    socket.on('checkCode', code => {
        let i = false;
        for (user of users) {
            if(user.room === code) i = true;
        };

        if(i && codes.includes(code)) {
            socket.emit('sendToRoom', code);
        };
    });

    
    
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            let l = getRoomUsers(user.room);

            let fillt = [];


            l.every(x => {
    
                for (pp of l) {
                    if(pp.running) fillt.push(pp);
                };

    
        
                if(totalVotes === fillt.length && !voted) {
                    let leftP = x.roomVotes.left / totalVotes * 100;
                    let rightP = x.roomVotes.right / totalVotes * 100;
                    let results = [leftP, rightP];
        
                    socket.emit('giveResults', results);
                    io.in(user.room).emit('giveResults', results);
        
                    setTimeout(() => {
                        console.log('test');
                        let qs = createQuestion();
                        socket.emit('passQuestion', qs);
                        io.in(user.room).emit('passQuestion', qs);
                        socket.emit('loadAns', l.length, 0)
                        io.in(user.room).emit('loadAns', l.length, 0);
                        l.forEach(y => {
                            y.roomVotes.left = 0;
                            y.roomVotes.right = 0;
                            y.running = true;
                            totalVotes = 0;
                            ans = 0;
                        });
        
                        setTimeout(() => {
                            socket.emit('resetClicker');
                            io.in(user.room).emit('resetClicker');    
                        }, 1500)
                    }, 2000)
                    return false;
                };
        
                return true;
            });


            socket.emit('loadAns', fillt.length, ans)
            io.in(user.room).emit('loadAns', fillt.length, ans);        
        }
    });
});

server.listen(port, () => { console.log('Server started:', port) })
app.use(express.static(path.join(__dirname, 'public')));