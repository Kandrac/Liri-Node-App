require("dotenv").config();
var keys = require("./keys.js");
var moment = require('moment');
var fs = require('fs');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var liriCommand = process.argv[2];
var  liriSearch = process.argv.slice(3).join("+");

console.log(liriCommand);

startLiri(liriCommand);

function startLiri(liriCommand) {

  if (liriCommand === "concert-this") {
    concertInfo( liriSearch);
  }
  if (liriCommand === "spotify-this-song") {
    songInfo( liriSearch);
  }
  if (liriCommand === "movie-this") {
    movieInfo( liriSearch);
  }
  if (liriCommand === "do-what-it-says") {
    lirisChoice();
  }
}
function movieInfo( liriSearch) {

    if (! liriSearch) {
      movie = "mr nobody";
    }

    axios.get("http://www.omdbapi.com/?t=" +  liriSearch + "&y=&plot=short&apikey=trilogy").then(
      function (response) {
  
        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes: " + response.data.Ratings[1]);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Movie Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
      
      }
    )
  };
  function concertInfo( liriSearch) {

    console.log( liriSearch);
    axios.get("https://rest.bandsintown.com/artists/" +  liriSearch + "/events?app_id=codingbootcamp").then(
        function (response) {
        response.data.forEach(concert => {
        var date = moment(response.data[0].datetime).format("MM/DD/YYYY");
          console.log(concert.venue.name)
          console.log(concert.venue.city + ", " + concert.venue.region)
          console.log("date: " + date);
          
        })
       
      }
    );
  }

  function songInfo(startLiri) {
  if (!startLiri) {
    startLiri = "The Sign";
  }
  spotify.search({ type: 'track', query: startLiri }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err); 
    }
    console.log("Artist: " + data.tracks.items[0].artists[0].name)
    console.log("Song: " + data.tracks.items[0].name)
    console.log("Preview: " + data.tracks.items[3].preview_url)
    console.log("Album: " + data.tracks.items[0].album.name);
  

  });
}
function lirisChoice() {

    fs.readFile("random.txt", "utf8", function (error, data) {
      var arr = data.split(",");
      var task = arr[0];
      var  liriSearch = arr[1].split('"').join('');
  
  console.log(arr);
  console.log(task);
  console.log( liriSearch);
  
      if (error) {
        return console.log(error);
      }
  
      if (task === "concert-this"){
        concertInfo( liriSearch);
      }
      if (task === "spotify-this-song"){
        songInfo( liriSearch);
      }
      if (task === "movie-this"){
        movieInfo( liriSearch);
      }
  
    });
  }