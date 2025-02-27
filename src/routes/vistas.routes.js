const express = require("express");
const router = express.Router();

const users = [];

router.get("/user", (req, res) => {
  const { nombre, id } = req.query;
  const context = {
    nombre,
    id,
  };
console.log("users", users);
  let isValidate = id === "1234"
  if (isValidate) {
    return res.render("index", context); // Renderiza el handlebars index.hbs
  } else {
    return res.render("not_found_user", context); // Renderiza el handlebars not_found_user.hbs
  }
});

// Hacer un post de user con un try catch. Incluyendo nombre, edad, email.
router.post("/user", (req, res) => {
  try {
    const { nombre, edad, email } = req.body;
    if (!nombre || !edad || !email) {
      return res.status(400).json({ error: "Faltan datos" });
    }
    const user = {
      nombre,
      edad,
      email,
    };
    users.push(user)
    return res.status(200).send("Usuario creado correctamente");
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
  return res.render("index", context);
});

router.get("/users", (req, res) => {
  res.json(users);
});




module.exports = router;
