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
        return "<div>ciao<h2>Kandinskijs</h2></div>";
      }
    }
  ]);

  await server.start();
  console.log('Server running at: ' + server.info.uri);
};

init();