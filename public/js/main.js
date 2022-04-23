const socket = io();

// create room
let createRoomButton = document.querySelector('.create');

createRoomButton.addEventListener('click', () => {
    socket.emit('createId');
})

socket.on('sendToRoom', (room) => window.location.href = `play.html?room=${room}`);

document.addEventListener("keyup", function(event) {
    let code = document.querySelector('.code');
    if (event.key === 'Enter') {
        console.log('ok');
        if(!code.value || code.value == 'Room Code' || code.value.length < 5) return;
        if(code.value) {
            socket.emit('checkCode', code.value);
        };
    };
});