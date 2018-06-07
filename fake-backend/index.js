var restify = require('restify');
var server = restify.createServer();
var listenPort = process.env.PORT || 9999;
var corsMiddleware = require('restify-cors-middleware');

var cors = corsMiddleware({
	origins: ['http://localhost:3000'],
	allowHeaders: ['API-Token'],
	exposeHeaders: ['API-Token-Expiry']
});

server.pre(cors.preflight);
server.use(cors.actual);

server.get('/init', function(req, res, next) {
	res.send({
		defaultMailSender: 'dg75-definitions-et-sources-statistiques@insee.fr',
		lg2: 'en',
		lg1: 'fr',
		maxLengthScopeNote: '300',
		authType: 'NoAuthImpl',
		defaultContributor: 'DG75-L201',
		appHost: 'https://localhost:3000/#/'
	});
	next();
});

server.post('/auth', function(req, res, next) {
	res.send({
		roles: ['ADMIN'],
		stamp: 'XXXXXX'
	});
	next();
});

server.listen(listenPort, function() {
	console.log('%s listening at %s', server.name, server.url);
});
