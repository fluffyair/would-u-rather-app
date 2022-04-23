let codes = [];

function uid() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < 1; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    let id = `${(Date.now().toString()).slice(10) + result + Math.round(Math.random() * 10)}`;

    codes.push(id);

    return id;
};


module.exports = { uid, codes };