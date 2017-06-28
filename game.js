const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const session = require('express-session');
var application = express();
application.engine('mustache', mustache());
application.use(express.static(__dirname + '/public'));
application.set('views', './views');
application.set('view engine', 'mustache');
application.use(express.static(__dirname + '/public'));
application.use(cookieParser());
application.use(bodyParser.urlencoded());
application.use(expressValidator());
application.use(session({
    secret: "secretkey",
    saveUninitialized: true,
    resave: false
}));
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
application.get('/', (request, response) => {
    response.render('index');
});
application.post('/', (request, response) => {
    response.render('index');
});

application.get('/index', (request, response) => {
    response.render("index");
});
application.post('/index', (request, response) => {
    response.render('index');
});
application.get('/game', (request, response) => {
    request.session.word = words[Math.floor(Math.random() * words.length)];
    request.session.length = request.session.word.length;
    request.session.dash = [];
    request.session.guess = [];
    request.session.wrong_guess = [];
    request.session.guess_number = 0;
    request.session.error = false;
    request.session.guess_number = 0;
    request.session.game_over = "";
    request.session.restart = "";
    request.session.error_message = "";
    request.session.counter = 0;
    request.session.win = "";
    request.session.red = "red";
    request.session.color1 = "green";
    request.session.color2 = "green";
    request.session.color3 = "green";
    request.session.color4 = "green";
    request.session.color5 = "green";
    request.session.color6 = "green";
    request.session.color7 = "green";
    request.session.color8 = "green";
    for (var i = 0; i < request.session.length; i++) {
        request.session.dash.push("_");
    };
    request.session.dash_visual = request.session.dash.join(" ");
    response.render('game', request.session);
});
application.post('/game', (request, response) => {
    request.checkBody('letter', 'No Letter Provided. Try again!').notEmpty();
    request.checkBody('letter', "Please Enter ONE LETTER! hur dur dur").matches(/^.{0,1}$/, "i");
    request.session.error = request.validationErrors();
    if (request.session.error === false) {
        request.session.error_message = "";
        var dash = request.session.dash;
        if (request.session.word.search(request.body.letter) != -1 && request.session.guess.includes(request.body.letter) === false) {
            request.session.guess += request.body.letter;
            for (var i = 0; i < request.session.word.length; i++) {
                if (request.session.word[i].search(request.body.letter) != -1) {
                    request.session.counter += 1;
                    var index = request.session.word.indexOf(request.body.letter);
                    dash[i] = request.session.word[i];
                    var noComma = dash.join(" ");
                    request.session.dash_visual = noComma;
                    if (request.session.counter === request.session.length) {
                        request.session.win = "Game Over, You win!";
                        request.session.restart = "Play Again?";
                    }
                }
            }
        } else {
            var red = request.session.red;
            var guess = request.session.guess_number
            request.session.wrong_guess += request.body.letter;
            request.session.guess_number += 1;
            if (guess === 0) {
                request.session.color1 = red;
            } else if(guess === 1){
                request.session.color2 = red;
            } else if(guess === 2){
                request.session.color3 = red;
            } else if(guess === 3){
                request.session.color4 = red;
            } else if(guess === 4){
                request.session.color5 = red;
            } else if(guess === 5){
                request.session.color6 = red;
            } else if(guess === 6){
                request.session.color7 = red;
            } else if (guess >= 8) {
                request.session.game_over = "Game Over";
                request.session.restart = "Restart Game?";
                request.session.color8 = red;
                for (var i = 0; i < request.session.word.length; i++) {
                    request.session.dash[i] = request.session.word[i];
                    var noComma = request.session.dash.join(" ");
                    request.session.dash_visual = noComma;
                }
            }
        }
    } else {
        request.session.error_message = request.session.error[0].msg;
    }
    response.render('game', request.session);
});
application.listen(3000);



// difficulty
//  var easyArray = words.filter(function(word){
//     return word.length <= 4;
//   });

//   var hardArray = words.filter(function(word){
//     return word.length > 4;
//   });

//   function wordSelect (array) {
//     var num = Math.floor(Math.random() * (array.length - 1));
//     var word = array[num];
//     return word;
//   }



