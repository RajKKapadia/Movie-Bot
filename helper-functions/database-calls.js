const rp = require('request-promise');
const $ = require('cheerio');

require('dotenv').config();

const API_KEY = process.env.API_KEY;

const getMovieID = async (movieName) => {

    encodedMN = encodeURIComponent(movieName);

    imdbURL = `https://www.imdb.com/search/title/?title=${encodedMN}`;

    let response = await rp.get(imdbURL);

    let data = $('h3 > a', response);
        console.log(data.length);
        for (let i = 0; i < data.length; i++) {
            let element = data[i];
            console.log('Movie Name --> ', element.lastChild.data);
            console.log('Movie ID --> ', element.attribs.href.split('/')[2]);
        }
};

const getMovieData = async (movieID) => {
    
    omdbURL = `http://www.omdbapi.com/?t=${movieID}&plot=full&apikey=${API_KEY}`;
    let response = await rp.get(omdbURL);
    let data = JSON.parse(response);

    if (data['Response'] === 'True') {
        return {
            'Actors': data['Actors'],
            'Director': data['Director'],
            'Genre': data['Genre'],
            'imdbRating': data['imdbRating'],
            'imdbVotes': data['imdbVotes'],
            'Plot': data['Plot'],
            'Poster': data['Poster'],
            'Title': data['Title'],
            'Writer': data['Writer'],
            'Year': data['Year']
        }
    } else {
        return {
            'Error': data['Error']
        }
    }
};

module.exports = {
    getMovieID,
    getMovieData
};