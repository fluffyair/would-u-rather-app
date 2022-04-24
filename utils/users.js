const { uid } = require('./uid');

let users = [];

function userJoin(id, room) {
    const user = {
        id,
        room,
        roomVotes: {
            left: 0,
            right: 0
        },
        running: false
    };

    users.push(user);

    return user;
};

function getCurrentUser(id) {
    return users.find(user => user.id === id);
};

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room)    
}

// setInterval(() => {
//     console.log(users);
// }, 2000)

module.exports = { userJoin, getCurrentUser, getRoomUsers, userLeave, users };