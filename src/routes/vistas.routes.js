const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../db/users.json");

const getUsers = () => {
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

router.get("/user", (req, res) => {
  const { nombre } = req.query;
  const users = getUsers();
  const user = users.find(u => u.username === nombre);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

router.post("/register", (req, res) => {
  try {
    const { username, firstName, lastName, age, email } = req.body;
    const users = getUsers();
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: "El nombre de usuario ya existe" });
    }
    const newUser = {
      id: users.length + 1,
      username,
      firstName,
      lastName,
      age,
      email,
    };
    users.push(newUser);
    saveUsers(users);
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

module.exports = router;