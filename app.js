const message = document.getElementById('message')
const sudokuDiv = document.querySelector('#sudoku-div')
const solveButton = document.querySelector('#solve-button')
const numSquares = 9 * 9
let isSolved = false;

for (let i = 0; i < numSquares; i++) {
    const square = document.createElement('input')
    square.classList.add('square')
    square.setAttribute('type', 'number')
    square.setAttribute('min', 1)
    square.setAttribute('max', 9)
    square.setAttribute('onkeyup', 'setPuzzleValue(this)')
    square.setAttribute('onchange', 'setPuzzleValue(this)')
    sudokuDiv.appendChild(square)

    if ((i % 3 == 0) && (i % 9 != 0)) {
        square.classList.add('leftline')
    }
    if ((i >= 3 * 9 && i < 4 * 9) || (i >= 6 * 9 && i < 7 * 9)) {
        square.classList.add('topline')
    }

    if (
        ((i % 9 < 3 || i % 9 > 5) && (i < 27 || i > 53)) // first and last three columns (minus center three rows)
        ||
        ((i % 9 >= 3 && i % 9 <= 5) && (i >= 27 && i <= 53)) // center three columns (minus first and last three rows)
    ) {
        square.classList.add('shade1')
    }
    else {
        square.classList.add('shade2')
    }
}

function setPuzzleValue(element) {
    element.classList.add('puzzle-value')
    if (element.value < 1 || element.value > 9) {
        element.value = ''
        element.classList.remove('puzzle-value')
    }
    // blank out the rest of the puzzle
    const inputArray = document.querySelectorAll('input')
    inputArray.forEach(inputArrayElement => {
        if (!inputArrayElement.classList.contains('puzzle-value')) {
            inputArrayElement.value = ''
            message.innerText = "Enter the starting digits."
        }
    })

}

const getStringToSolve = () => {
    const inputArray = document.querySelectorAll('input')
    stringToSolve = ''
    inputArray.forEach(inputArrayElement => {
        if (inputArrayElement.value) {
            stringToSolve += inputArrayElement.value
        } else {
            stringToSolve += '.'
        }
    })
    return stringToSolve
}

const populateValues = (noSolution, solutionString) => {
    if (noSolution) {
        message.innerText = "No solution exists."
        return
    }

    const inputArray = document.querySelectorAll('input')
    for (let i = 0; i < numSquares; i++) {
        inputArray[i].value = solutionString[i]
        if (!inputArray[i].classList.contains('puzzle-value'))
            inputArray[i].classList.add('solution-value')
    }
    message.innerText = "Solved!"
}

/*
const solve = () => {


    // pasted from https://rapidapi.com/sosier/api/solve-sudoku/
    // after getting server.js working, move this all to server.js
    // and instead fetch the route /server (as now done below)

    // var axios = require("axios").default; // at the top of server.js

    var options = {
        method: 'POST',
        url: 'https://solve-sudoku.p.rapidapi.com/',
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': 'solve-sudoku.p.rapidapi.com',
            // my api key visible to anyone with a browser...
            // ...until remove hardcoded key and hide in .env
            'x-rapidapi-key': process.env.RAPID_API_KEY
            // ...now need a node backend server to retrive the key:
            // npm init (accept defaults) to create package.json 
            // npm i express axios dotenv cors nodemon (install dependencies pkgs)
            // create server.js to make a backend Express server 
            // add "start:backend": "nodeman server.js" to package.json scripts
            // npm run start:backend (to start server running)

            // after getting server.js working, move this all to server.js
    
        },
        data: {
            // puzzle: '2.............62....1....7...6..8...3...9...7...6..4...4....8....52.............3'
            puzzle: getStringToSolve()
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
        // call a fn to fill in the puzzle squares
        populateValues(!response.data.solvable, response.data.solution)
    }).catch(function (error) {
        console.error(error);
    });
}
*/

const solve = () => {
    // data must be an object
    const solutionString = getStringToSolve()
    const data = { solution: solutionString }
    console.log('Here is the data', data)
    console.log(JSON.stringify(data))

    // the /solve route defined in server.js
    fetch('http://localhost:8000/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            populateValues(!data.solvable, data.solution)
        })
        .catch(error => console.log('error: ', error))

    isSolved = true
    configureButton()
}

function clearPuzzle() {
    const inputArray = document.querySelectorAll('input')
    inputArray.forEach(inputArrayElement => inputArrayElement.value = '')
    message.innerText = "Enter the starting digits."
    isSolved = false;
    configureButton()
}

function configureButton() {
    if (!isSolved) {
        solveButton.addEventListener('click', solve)
        solveButton.innerHTML = 'Click to solve'
    } else {
        solveButton.addEventListener('click', clearPuzzle)
        solveButton.innerHTML = 'Clear Puzzle'
    }
}

configureButton();
