const socket = io();

socket.emit('pRoom')

socket.on('passRs', (users) => {
    let grid = document.querySelector('.grid');

    if(!users.length) {
        grid.innerHTML = `<div class="ntr"><h1>No rooms avaible!</h1></div>`
    } else {
        let allRooms = [];

        function formatRoom(users, code) {
            let room = {
                users,
                code,
            };

            allRooms.push(room);
            return room;
        };


        for (user of users) {
            let t = true;

            for (r of allRooms) {
                if(user.room == r.code) t = false;
            }

            if(t) {
                formatRoom([user], user.room);
            } else {
                let room = allRooms.find(rp => rp.code == user.room);

                room.users.push(user);
            };
        };

        let nHtml = '';
        for(r of allRooms) {
            nHtml += `<div class="room"><h1>Room: ${r.code}</h1><p>Players: ${r.users.length}</p></div>`
        }

        grid.innerHTML = nHtml;
    };
});

socket.on('sendToRoom', (room) => window.location.href = `play.html?room=${room}`);

setTimeout(() => {
    let rooms = document.querySelectorAll('.room');

    rooms.forEach(r => {
        r.addEventListener('click', () => {
            socket.emit('checkCode', r.parentElement.querySelector('h1').textContent.split('Room: ')[1]);
        });
    });
}, 400);

function redirect(s) {
    if(s === 'rooms') {
        window.location.href = 'rooms.html'
    };

    if(s === 'index') {
        window.location.href = 'index.html'
    };
};