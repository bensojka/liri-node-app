var fs = require("fs");

var request = require("request");

var Twitter = require("twitter");

var Spotify = require("node-spotify-api");

var keys = require("./keys.js");

var twitterKeys = keys.twitterKeys;

var inputString = process.argv;

var command = inputString[2];

var name = inputString[3];

var movieName = "";

var songName = "";

var client;



if (command === "my-tweets") {
    client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret,
    });
    if(!name) {
        name = "dadboner";
    }
    params = {screen_name: name};
    client.get("statuses/user_timeline/", params, function(error, data, response){
        if (!error) {
            for (var i = 0; i < data.length; i++) {
                var dStr = data[i].created_at;
                var d = dStr.replace("+0000 ", "");
                var twitterResults =
                d + ": " + "@" + data[i].user.screen_name + ": " +
                data[i].text + "\r\n";
                console.log(twitterResults);
            }
        }
        else {
            console.log("Error :" + error);
            return;
        }
    });
}

else if (command === "spotify-this-song") {

    for (var i = 3; i < inputString.length; i++) {
        
        if (i > 3 && i < inputString.length) {
        
            songName = songName + " " + inputString[i];
        
        }
        
        else {
        
            songName += inputString[i];
        
        }
    }

    client = new Spotify({
        id: keys.spotifyKeys.id,
        secret: keys.spotifyKeys.secret,
    });
    if(!name){
        songName = "The Sign Ace of Base";
    }

    params = songName;
    client.search({ type: "track", query: params }, function(err, data) {
        if(!err){
            var songInfo = data.tracks.items;
            for (var i = 0; i < 1; i++) {
                if (songInfo[i] != undefined) {
                    var spotifyResults =
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Album: " + songInfo[i].album.name + "\r\n" +
                    "Preview: " + songInfo[i].preview_url + "\r\n";
                    console.log(spotifyResults);
                }
            }
        }	else {
            console.log("Error :"+ err);
            return;
        }
    });
}

else if (command === "movie-this") {
    for (var i = 3; i < inputString.length; i++) {
        
        if (i > 3 && i < inputString.length) {
        
            movieName = movieName + "+" + inputString[i];
        
        }
        
        else {
        
            movieName += inputString[i];
        
        }
    }

    if(!name){
        movieName = "Mr+Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=40e9cece";
    
    request(queryUrl, function(error, response, body) {
    
      // If the request is successful
        if (!error && response.statusCode === 200) {
        
            var movieObject = JSON.parse(body);
            var movieResults =
            "Title: " + movieObject.Title+"\r\n"+
            "Year: " + movieObject.Year+"\r\n"+
            "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
            "Country: " + movieObject.Country+"\r\n"+
            "Language: " + movieObject.Language+"\r\n"+
            "Plot: " + movieObject.Plot+"\r\n"+
            "Actors: " + movieObject.Actors+"\r\n"+
            "Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
            "Rotten Tomatoes URL: " + movieObject.tomatoURL+ "\r\n"; 
            console.log(movieResults);

        } else {
            console.log("Error :"+ error);
            return;
        }
    });
}

else if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (!error) {
            var doWhatItSaysResults = data.split(",");
            var spotifyThis = doWhatItSaysResults[1];

            client = new Spotify({
                id: keys.spotifyKeys.id,
                secret: keys.spotifyKeys.secret,
            });
            params = spotifyThis;
            client.search({ type: "track", query: params }, function(err, data) {
                if(!err){
                    var songInfo = data.tracks.items;
                    for (var i = 0; i < 1; i++) {
                        if (songInfo[i] != undefined) {
                            var spotifyResults =
                            "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                            "Song: " + songInfo[i].name + "\r\n" +
                            "Album: " + songInfo[i].album.name + "\r\n" +
                            "Preview: " + songInfo[i].preview_url + "\r\n";
                            console.log(spotifyResults);
                        }
                    }
                }	else {
                    console.log("Error :"+ err);
                    return;
                }
            });
            
        } 
        else {
            console.log("Error occurred" + error);
        }
    });
}


else {
    console.log("Not a recognized command");
}
