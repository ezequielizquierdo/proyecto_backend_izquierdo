const app = require("./app");
const http = require("http");
const displayRoutes = require("express-routemap");
const server = http.createServer(app);
const configureSocket = require("./config/socket");

// Puerto del SERVER
const PORT = process.env.PORT || 3000;

// Configuración de SOCKET.IO
configureSocket(server);

// Levantar el servidor
server.listen(PORT, () => {
  displayRoutes(app);
  console.log(`Server listening on port http://localhost:${PORT}`);
});
