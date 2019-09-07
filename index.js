const express = require('express');
const bodyParser = require('body-parser');

const hp = require('./helper-functions/database-calls');


// Webserver
const Webapp = express();

Webapp.use(bodyParser.urlencoded({ extended: true }));
Webapp.use(bodyParser.json());

const PORT = process.env.PORT;

Webapp.get('/', (req, res) => {
    res.send('Hello World.!')
});

// Provides movie name intent
const providesMovieName = async (req) => {

    let movieName = req['body']['queryResult']['parameters']['any'];
    let movieData = await hp.getMovieData(movieName);
    let session = req['body']['session'];
    let context = `${session}/contexts/await-movie-name`;
    
    if (movieData['Response'] === 'True') {
        responseText = {
            'fulfillmentText': JSON.stringify(movieData['movieData']),
            'outputContexts': [{
                'name': context,
                'lifespanCount': 0
            }]
        };
    } else {
        let movieList = await hp.getMovieID(movieName);
        if (movieList.length > 0) {
            responseText = {
                'fulfillmentText': `We found ${movieList[0]} and ${movieList[1]}, write the movie name.`,
                'outputContexts': [{
                    'name': context,
                    'lifespanCount': 0
                }]
            };
        } else {
            responseText = {
                'fulfillmentText': `We did not found the movie ${movieName} in our database.`,
                'outputContexts': [{
                    'name': context,
                    'lifespanCount': 0
                }]
            };
        }
    }

    return responseText;
};

Webapp.post('/webhook', async (req, res) => {
    
    let responseText = {};

    if (req['body']['queryResult']['action'] === 'provides-movie-name') {
        responseText = await providesMovieName(req);
    }

    res.send(responseText);
});

Webapp.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
