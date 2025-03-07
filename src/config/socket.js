const { Server } = require("socket.io");

module.exports = (server) => {
  const io = new Server(server);

  // Lista de mensajes que se guardan en el servidor (simulando una base de datos)
  const messages = [];

  // Evento de conexión - Cada que se conecta un client se ejecuta su function CB
  io.on("connection", (socket) => {
    console.log(`Usuario ID: ${socket.id} Conectado!!!`);

    socket.on("userConnect", (data) => {
      let message = {
        id: socket.id,
        info: "connection",
        name: data.user,
        message: `usuario: ${data.user} - id: ${data.id} - Conectado`,
      };
      messages.push(message);
      io.emit("serverUserMessage", messages);
    });

    socket.on("userMessage", (data) => {
      // Recibe el mensaje del cliente
      console.log("::::data:::::", data);
      const message = {
        id: socket.id,
        info: "message",
        name: data.user,
        message: data.message,
      };

      messages.push(message);
      io.emit("serverUserMessage", messages);
    });

    socket.on("typing", (data) => {
      io.emit("typing", data);
    });


    socket.on("disconnect", (data) => {
      console.log("data disconnect ----> ", data); // transport close
      console.log("Cliente desconectado:", socket.id);
    });
  });
};