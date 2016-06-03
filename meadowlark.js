var fortune = require('./lib/fortune.js');

var express = require('express');//모듈 가져옴

var app = express();

var handlebars = require('express-handlebars').create({ 
	defaultLayout:'main',//디폴트 레이아웃 main으로 지정 
	helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
}); 

app.engine('handlebars', handlebars.engine);//핸들바 사용
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);//포트 지정

function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

app.use(function(req, res, next){//날씨 데이터를 res.locals.partials 객체에 주입할 미들웨어
	if(!res.locals.partials) res.locals.partials = {};
 	res.locals.partials.weatherContext = getWeatherData();
 	next();
});

var tours =[
	{id:0, name:'Hood River', price:99.99},
	{id:1, name:'Oregon Coast', price:149.95}
	];

app.get('/api/tours', function(req, res){
		res.json(tours);
});

/*
app.get('/api/tours', function(req, res){
	var toursXml = '' + products.map(function(p){
		return '" id="' + p.id + '">' + p.name + '';
 	}).join('')+'';
 	var toursText = tours.map(function(p){
 		return p.id + ': ' + p.name + ' (' + p.price + ')';
 	}).join('\n');
 	res.format({
 		'application/json': function(){
 			res.json(tours);
 		},
 		'application/xml': function(){
 			res.type('application/xml');
 			res.send(toursXml);
 		},
 		'text/xml': function(){
 			res.type('text/xml');
 			res.send(toursXml);
 		},
 		'text/plain': function(){
 			res.tpe('text/plain');
 			res.send(toursXml);
 		}
 	});
});
*/

app.use(express.static(__dirname + '/public'));//정적 자원 경로 지정

app.disable('x-powered-by'); // x-powered-by헤더 비활성화

app.get('/headers', function(req, res){
		res.set('Content-Type', 'text/plain');
		var s = '';
		for(var name in req.headers) {
			s += name + ': ' + req.headers[name] + '\n';
		}
		res.send(s);
});

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req,res){
	//var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
	res.render('about', {fortune: fortune.getFortune()});//fortune.js의 getFortune()
});

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log( 'start server  :' + 
    app.get('port') + ' port; press Ctrl-C to terminate.' );
});