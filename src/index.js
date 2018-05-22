const hapi = require('hapi');
const server = hapi.server({
	port: 4000,
	host: 'localhost'
});

const init = async () => {

	server.route([
		{
			method: 'GET',
			path: '/',
			handler: (req, reply) => {
				return "<h1>MicroServices Basecode</h1>";
			}
		}
	]);

	await server.start();
	console.log('Server running at: ' + server.info.uri);
};

init();