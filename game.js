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


    for (var i = 0; i < request.session.length; i++) {
        request.session.dash.push("_");
    };
    request.session.dash_visual = request.session.dash.join(" ");
    var game = request.session;
    response.render('game', game);
});

application.post('/game', (request, response) => {
   
    request.checkBody('letter', 'No Letter Provided. Try again!').notEmpty();
    request.checkBody('letter', "Please Enter ONE LETTER! hur dur dur").matches(/^.{0,1}$/, "i");
    request.session.error = request.validationErrors();
    var error = request.validationErrors();
    
    if (error === false) {
        request.session.error_message = "";
        if (request.session.guess_number >= 8 | request.session.counter === request.session.length) {
            console.log("count", request.session.counter);
            console.log("length:", request.session.length);
            if(request.session.counter === request.session.length){
                request.session.win = "Game Over, You win!";
                request.session.restart = "Play Again?";
                console.log("game over:", request.session.game_win);
            } else {
            request.session.game_over = "Game Over";
            request.session.restart = "Restart Game?";
            for (var i = 0; i < request.session.word.length; i++) {
                        var dash = request.session.dash;
                        var word = request.session.word[i];
                        dash[i] = word;
                        var noComma = dash.join(" ");
                        request.session.dash_visual = noComma;
                        console.log("nocomma",noComma);
                    }
            }
        } else {
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
                    }
                }
            } else {
                request.session.wrong_guess += request.body.letter;
                request.session.guess_number += 1;
            }
        }
    } else {
        request.session.error_message = error[0].msg;
        console.log("request.session.error_message: ", request.session.error_message);
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



