const socket = io();

const { room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinRoom', room)

let left = document.querySelector('.left');
let right = document.querySelector('.right');


socket.on('passQuestion', (question) => {
    setTimeout(() => {
        left.innerHTML = `<h2>${question[0]}<h2><div id="box"><p class="nbr"></p>`
        right.innerHTML = `<h2>${question[1]}<h2><div id="box"><p class="nbr"></p>`
    }, 800)
})

function showToast() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

let clicker = true;

left.addEventListener('click', () => {
    if(clicker) {
        showToast()
        left.querySelector('h2').style.fontSize = '2.5em';
        clicker = false;
        socket.emit('addVoter', room, 'left')
    };
});

right.addEventListener('click', () => {
    if(clicker) {
        showToast()
        document.querySelector('body').style.cursor = 'progress';
        right.querySelector('h2').style.fontSize = '2.5em';
        clicker = false;
        socket.emit('addVoter', room, 'right')
    };
});

socket.on('resetClicker', () => {
    clicker = true;
})

// % render

var speed = 10;

/* Call this function with a string containing the ID name to
 * the element containing the number you want to do a count animation on.*/
function incEltNbr(numb) {
    let hl = left.querySelector('.nbr');
    let hr = right.querySelector('.nbr');
    endNbr1 = Number(numb[0]);
    endNbr2 = Number(numb[1]);
    incNbrRec(0, endNbr1, hl);
    incNbrRec(0, endNbr2, hr);


}

/*A recursive function to increase the number.*/
function incNbrRec(i, endNbr, elt) {
  if (i <= endNbr) {
    elt.innerHTML = i + '%';
    setTimeout(function() {//Delay a bit before calling the function again.
      incNbrRec(i + 1, endNbr, elt);
    }, speed);
  }
}


socket.on('giveResults', res => {
    incEltNbr(res);
})

socket.on('log', l => {
    console.log(l);
})

socket.on('loadAns', (a, b) => {
    let ans = document.querySelector('.circle-stat');

    ans.textContent = `Answers: ${b + '/' + a}`
})