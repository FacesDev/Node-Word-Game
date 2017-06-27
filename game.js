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
    request.session.color = "green";
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
    var error = request.validationErrors();
    if (error === false) {
        request.session.error_message = "";
        var dash = request.session.dash;
        if (request.session.word.search(request.body.letter) != -1 && request.session.guess.includes(request.body.letter) === false) {
            request.session.guess += request.body.letter;
            for (var i = 0; i < request.session.word.length; i++) {
                if (request.session.word[i].search(request.body.letter) != -1) {
                    request.session.counter += 1;
                    var index = request.session.word.indexOf(request.body.letter);
                    var word = request.session.word[i];
                    dash[i] = word;
                    var noComma = dash.join(" ");
                    request.session.dash_visual = noComma;
                    if (request.session.counter === request.session.length) {
                        request.session.win = "Game Over, You win!";
                        request.session.restart = "Play Again?";
                        console.log("bla");
                    }
                }
            }
        } else {
            request.session.wrong_guess += request.body.letter;
            request.session.guess_number += 1;
            request.session.color = "red";
            if (request.session.guess_number >= 8) {
                request.session.game_over = "Game Over";
                request.session.restart = "Restart Game?";
                for (var i = 0; i < request.session.word.length; i++) {
                    var dash = request.session.dash;
                    var word = request.session.word[i];
                    dash[i] = word;
                    var noComma = dash.join(" ");
                    request.session.dash_visual = noComma;
                }
            }
        }
    }
    else {
        request.session.error_message = error[0].msg;
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



