//dependencies
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');


//configure app
var app = express();

//load configuration file
const config = require('./config/default');
app.set('config', config); // <- makes config accessible to other js files
// app.get('config').mongodb  // <- access using app.get


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//required for passport
app.use(session({ secret: 'pandas', resave:true, saveUninitialized: true })) //secret is the salt for hash
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('view engine', 'ejs');

//connect to db
mongoose.connect(config.mongodb ,{useNewUrlParser: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(){
	console.log("db connected!")
})


//routes 
require('./config/passport')(passport); //pass the passport configuration
require('./routes/routes.js')(app, passport); //load the routes, pass the app and fully configured passport


//start the server
app.listen(config.port)
console.log("listening on http://"+ config.host+":"+config.port)
