require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require('moment');
moment().format();
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
let fs = require('fs');


let argument2 = process.argv[2]
let argument3 = process.argv.slice(3).join('+')
let string1 = ''

let liri = () => {
    switch (argument2) {
        case 'concert-this':
            concertThis();
            break;
        case 'spotify-this-song':
            spotifyFunction();
            break;
        case 'movie-this':
            movieThis()
            break;
        case 'do-what-it-says':
            doAsItSays()
            break;
    }
};

function test (){
    for (var property1 in arguments) {
        string1 += `${arguments[property1]},`;
     }
     return string1
};
let concertThis = () => {
    let bandsintown = "https://rest.bandsintown.com/artists/" + argument3 + "/events?app_id=codingbootcamp&upcoming";
    let temp = argument3.replace(/\+/g, ' ');
    axios
        .get(bandsintown)
        .then(function (response) {
            if (response.data.length < 1) {
                console.log(`${argument3} has no upcoming concerts`)
            } else if (response.data.length < 5) {
                for (var x = 0; x < response.data.length; x++) {
                    console.log(`${temp}'s next concert is at ${response.data[x].venue.name} in ${response.data[x].venue.country}, ${response.data[x].venue.city} on ${moment(response.data[x].datetime, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD')}`)
                }
            } else {
                for (var x = 0; x < 5; x++) {
                    console.log(`${temp}'s next concert is at ${response.data[x].venue.name} in ${response.data[x].venue.country}, ${response.data[x].venue.city} on ${moment(response.data[x].datetime, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD')}`)
                }
            }
            fs.appendFile("log.csv", "\n" + test(temp), response.data[0].venue.name,response.data[0].venue.country,response.data[0].venue.city,moment(response.data[0].datetime, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD')), function (err) {

                // If an error was experienced we will log it.
                if (err) {
                    console.log(err);
                }
        
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                    console.log("Content Added!");
                }
            });
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}


let spotifyFunction = () => {
    // if (argument3 === '') {
    //     argument3 = 'The+Sign'
    // }
    if (!argument3) {
  argument3 = "The+Sign";
}
    spotify.search({ type: 'track', query: argument3 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`Song: ${data.tracks.items[0].name}`)
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}`)
        console.log(`Album: ${data.tracks.items[0].album.name}`)
        console.log(`Preview URL: ${data.tracks.items[0].preview_url}`)
        fs.appendFile("log.csv", "\n" + test(data.tracks.items[0].name, data.tracks.items[0].artists[0].name, data.tracks.items[0].album.name,data.tracks.items[0].preview_url ), function (err) {

            // If an error was experienced we will log it.
            if (err) {
                console.log(err);
            }
    
            // If no error is experienced, we'll log the phrase "Content Added" to our node console.
            else {
                console.log("Content Added!");
            }
        });
    });
}



let movieThis = () => {
    var queryUrl = "http://www.omdbapi.com/?t=" + argument3 + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {

            console.log(`Title: ${response.data.Title}`)
            console.log(`Year: ${response.data.Year}`)
            console.log(`IMDB Rating: ${response.data.imdbRating}`)
            isUndefined(response.data.Ratings[1])
            console.log(`Country produced: ${response.data.Country}`)
            console.log(`Language: ${response.data.Language}`)
            console.log(`Plot: ${response.data.Plot}`)
            console.log(`Actors: ${response.data.Actors}`)




            fs.appendFile("log.csv", "\n" + test(response.data.Title, response.data.Year,response.data.imdbRating,response.data.Country,response.data.Language), function (err) {

                // If an error was experienced we will log it.
                if (err) {
                    console.log(err);
                }
        
                // If no error is experienced, we'll log the phrase "Content Added" to our node console.
                else {
                    console.log("Content Added!");
                }
            });
        }
    )
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}


let isUndefined = (value) => {
    if (value === undefined) {
        return ''
    } else {
        // question = dont have access to response in this function. why? 
        // original code = console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`)
        // console.log(this)
        console.log(`Rotten Tomatoes Rating: ${value.Value}`)
    }
}

let doAsItSays = () => {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        switch (dataArr[0]) {
            case 'spotify-this-song':
                argument3 = dataArr[1]
                spotifyFunction()
                break;
            case 'movie-this':
                argument3 = dataArr[1]
                movieThis()
                break;
            case 'concert-this':
                argument3 = dataArr[1].replace(/"/g, '')
                concertThis()
                break;
        }

    });
}



liri()