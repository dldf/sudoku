const PORT = 8000

const express = require('express')
const cors = require('cors')
const axios = require('axios').default
require('dotenv').config() 

const app = express()
app.use(cors())
app.use(express.json())


app.post('/solve', (req, res) => {
    console.log('Here is the reqest:', req)
    console.log(req.body.solution)
    var options = {
        method: 'POST',
        url: 'https://solve-sudoku.p.rapidapi.com/',
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': 'solve-sudoku.p.rapidapi.com',
            // 'x-rapidapi-key': hidden in .env file,
            'x-rapidapi-key': process.env.RAPID_API_KEY
        },
        data: {
            // puzzle: getStringToSolve()
            // puzzle: '2.............62....1....7...6..8...3...9...7...6..4...4....8....52.............3'
            puzzle: req.body.solution
        }
    };
    axios.request(options).then(function (response) {
        console.log(response.data);
        // not doing this anymore after moving from app.js
        // populateValues(!response.data.solvable, response.data.solution)
        // instead:
        res.json(response.data)
    }).catch(function (error) {
        console.error(error);
    });
})

app.listen(PORT, () => console.log(`Express server listening on PORT ${PORT}`))

