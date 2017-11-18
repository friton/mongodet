var express = require('express');
var jsonfile = require('jsonfile')
var mongo = require('./mongo');
var MongoClient = require('mongodb').MongoClient;
var {spawn} = require('child_process')

const child = spawn('mongod'); // find a way to shut it when out of the program

// Init the database


arg = process.argv;
if (arg.length > 2){
	if (arg[2]=="--init"){
		MongoClient.connect('mongodb://localhost:27017/det', function(err, db) {
			if (err) {
				throw err;
			}
			mongo.insertData(db, __dirname+arg[3]); 
		})
	}
}


//Partie HTML

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

module.exports = app;

var readJson=function(path) {
	var dict = jsonfile.readFileSync(path,'utf8');
	console.log(dict.data);
}

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html')
})

// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
*/
//readJson(__dirname+"/data/det.json")
// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
app.use('/script', express.static(__dirname + '/script'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/favicon.ico', express.static(__dirname + '/images/favicon.ico'));
app.use('/pic', express.static(__dirname + '/images'));
app.use('/getHeader',function (req, res, next) {
	res.send("<h1>Detergent Database CRUD Interface</h1>")
	next();
});


app.use('/loadTab',function (req, res, next) {   /// to load the data in the database
	mongo.FindinDet().then(function(items) {
  var test = items;
  //console.log({"data":test});
  	res.send({"data":test});
  	next();
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});

	
});

// intercept json from POST request
app.use(bodyParser.urlencoded({
		extended: true
}));
app.use(bodyParser.json());
app.post('/newDet',function (req, res) {
	console.log(req.body)
});

//Partie BD
app.use('/script', express.static(__dirname + '/script'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/favicon.ico', express.static(__dirname + '/images/favicon.ico'));


/*
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/detest', function(err, db) {
	if (err) {
		throw err;
	}
	db.collection('det').find().toArray(function(err, result) {
		if (err) {
			throw err;
		}
		console.log(result);
	});
});
*/
/*
var test =[];
mongo.FindinDet().then(function(items) {
  test = items;
  console.log(test);
}, function(err) {
  console.error('The promise was rejected', err, err.stack);
});
*/

//console.log(mongo.FindinDet())

app.listen(3000, function () {
	console.log('mongodet server listening on port 3000!')
})





