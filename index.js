const express = require('express');
const bodyParser = require('body-parser');

const hp = require('./helper-functions/database-calls');


// Webserver
const Webapp = express();

Webapp.use(bodyParser.urlencoded({ extended: true }));
Webapp.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

Webapp.get('/', (req, res) => {
    res.send('Hello World.!')
});

// Provides movie name intent
const providesMovieName = async (req) => {

    let movieName = req['body']['queryResult']['parameters']['any'];
    let movieData = await hp.getMovieData(movieName);
    let session = req['body']['session'];
    let context = `${session}/contexts/await-movie-name`;
    
    if (movieData['']) {
        responseText = {
            'fulfillmentText': JSON.stringify(movieData),
            'outputContexts': [{
                'name': context,
                'lifespanCount': 0
            }]
        };
    } else {
        
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
