const { createServer, Model } = require('json-server');

const server = createServer({
  cities: new Model(),
});

server.listen(8000, () => {
  console.log('JSON Server is running');
});

module.exports.handler = server;