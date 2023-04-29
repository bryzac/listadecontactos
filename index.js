const app = require('./app');
const http = require('http');

const server = http.createServer(app);

server.listen(4004, () => {
    console.log('Servidor funcional');
});