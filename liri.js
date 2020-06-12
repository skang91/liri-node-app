require("dotenv").config();

var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

let liriCommand = process.argv[2];
let liriString = process.argv[3];

//concert-this
function concertThis() {
    if (typeof liriString === "undefined") {
        console.log("You need to provide an artist to do a search...");
        return;
    }
    axios.get("https://rest.bandsintown.com/artists/" + liriString + "/events?app_id=codingbootcamp")
        .then(function (response) {
            if (response.data[0] != undefined) {
                console.log("--------------------------------------------------------------------");
                console.log(`Venue Name:  ${response.data[0].venue.name}`);
                console.log(`Venue Location:  ${response.data[0].venue.city + ", " + response.data[0].venue.region + ", " + response.data[0].venue.country}`);
                console.log(`Date of Event:  ${moment(response.data[0].datetime).format("MM/DD/YYYY")}`);
                console.log("--------------------------------------------------------------------");
            } else {
                console.log("No events found...")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

//spotify-this-song
function spotifyThis() {
    if (typeof liriString === "undefined") {
        liriString = "The Sign, Ace of Base";
    }
    spotify.search({ type: 'track', query: liriString, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("--------------------------------------------------------------------");
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
        console.log(`Song: ${data.tracks.items[0].name}`);
        if (data.tracks.items[0].preview_url === null) {
            console.log("No preview available...");
        } else {
            console.log(`Preview song link: ${data.tracks.items[0].preview_url}`);
        }
        console.log(`Album: ${data.tracks.items[0].album.name}`);
        console.log("--------------------------------------------------------------------");
    });

}
//movie-this
function movieThis(input) {
    if (typeof liriString === "undefined") {
        liriString = "Mr Nobody";
    }
    axios.get(`http://www.omdbapi.com/?apikey=trilogy&s=${liriString}`)
        .then(function (response) {
            let tempImdbID = response.data.Search[0].imdbID;
            axios.get(`http://www.omdbapi.com/?apikey=trilogy&i=${tempImdbID}`)
                .then(function (response2) {
                    console.log("--------------------------------------------------------------------");
                    console.log(`Title: ${response2.data.Title}`);
                    console.log(`Year: ${response2.data.Year}`);
                    console.log(`IMDB Rating: ${response2.data.imdbRating}`);
                    console.log(`Rotten Tomatoes Rating: ${response2.data.Ratings[1].Value}`)
                    console.log(`Country Produced: ${response2.data.Country}`);
                    console.log(`Language: ${response2.data.Language}`);
                    console.log(`Plot: ${response2.data.Plot}`);
                    console.log(`Actors: ${response2.data.Actors}`);
                    console.log("--------------------------------------------------------------------");
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error);
        });
}

//do-what-it-says
function doWhatItSays() {
    fs.readFile('random.txt', "utf8", function (err, data) {
        let dataArray = data.split(",");
        liriCommand = dataArray[0];
        liriString = dataArray[1];
        spotifyThis(liriString);
    });
}

//switch statement
switch (liriCommand) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
}