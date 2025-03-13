console.log("IN CLIENT");

const userName = document.querySelector(".userName");
const chatMessage = document.querySelector(".chatMessage");
var uuid = "";

//* Conexión con el servidor de Socket.IO
const socket = io("http://localhost:3000");

//* Lista de mensajes a renderizar en el chat
var messages = [];

//* Función para actualizar los mensajes en el chat
const updateMessages = (newMessages) => {
  messages = [...newMessages];
  chatMessage.innerHTML = messages
    .map((message) => {
      if (message.info === "connection") {
        return `<p class="connection">${message.message}</p>`;
      } else {
        return `
        <div class="messageUser">
          <h5>Nombre: ${message.name}</h5>
          <p>ID - ${message.id}</p>
          <p>${message.message}</p>
        </div>
      `;
      }
    })
    .join("");
};

//* Función para mostrar el alert de SweetAlert2
const showProductAlert = () => {
  Swal.fire({
    title: "Ingresá un producto",
    html: `
      <input type="text" id="swal-input-title" class="swal2-input" placeholder="Nombre">
      <input type="text" id="swal-input-description" class="swal2-input" placeholder="Descripción">
      <input type="text" id="swal-input-price" class="swal2-input" placeholder="Precio">
      <input type="text" id="swal-input-thumbnail" class="swal2-input" placeholder="URL imágen">
      <input type="text" id="swal-input-category" class="swal2-input" placeholder="Categoria">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Ingresar",
    preConfirm: () => {
      const title = Swal.getPopup().querySelector("#swal-input-title").value;
      const description = Swal.getPopup().querySelector("#swal-input-description").value;
      const price = Swal.getPopup().querySelector("#swal-input-price").value;
      const thumbnail = Swal.getPopup().querySelector("#swal-input-thumbnail").value;
      const category = Swal.getPopup().querySelector("#swal-input-category").value;
      if (!title || !description || !price || !thumbnail || !category) {
        Swal.showValidationMessage(`Por favor ingrese todos los campos`);
      }
      return { title, description, price, thumbnail, category };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const product = result.value;
      createProduct(product);
    }
  });
};

//* Función para crear un producto
const createProduct = (product) => {
  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Producto agregado:", data);
      // No es necesario recargar la página
    })
    .catch((error) => {
      console.error("Error al agregar el producto:", error);
    });
};

//* Función para eliminar un producto
const deleteProduct = (productId) => {
  fetch(`/api/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Producto eliminado:", data);
      location.reload(); // Recargar la página para actualizar la lista de productos
    })
    .catch((error) => {
      console.error("Error al eliminar el producto:", error);
    });
};

//* Función para manejar los mensajes del usuario
const handleUserMessage = () => {
  const btnMessage = document.getElementById("btnMessage");
  const inputMessage = document.getElementById("inputMessage");

  if (btnMessage && inputMessage) {
    btnMessage.addEventListener("click", (e) => {
      e.preventDefault();
      const message = inputMessage.value;
      socket.emit("userMessage", { message, user: userName.innerHTML });
      inputMessage.value = "";
    });

    inputMessage.addEventListener("keypress", () => {
      socket.emit("typing", { user: userName.innerHTML });
    });
  } else {
    console.error("btnMessage or inputMessage element not found");
  }
};

//* Inicializar el DOM y los eventos de Socket.IO
document.addEventListener("DOMContentLoaded", () => {
  const addProductBtn = document.getElementById("addProductBtn");

  if (addProductBtn) {
    addProductBtn.addEventListener("click", showProductAlert);
  } else {
    console.error("addProductBtn element not found");
  }

  handleUserMessage();

  // Agregar evento de eliminación a los botones
  const deleteProductBtns = document.querySelectorAll(".deleteProductBtn");
  deleteProductBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      deleteProduct(productId);
    });
  });
});

// Escuchar el evento productAdded y actualizar la lista de productos
socket.on("productAdded", (product) => {
  const productsContainer = document.querySelector(".products");
  const productCard = document.createElement("div");
  productCard.classList.add("product-card");
  productCard.innerHTML = `
    <img src="${product.thumbnail}" alt="Imagen del producto" onerror="this.onerror=null; this.src='/img/default.png';">
    <p class="product-title">${product.title}</p>
    <p class="product-description">${product.description}</p>
    <p class="product-price">${product.price}</p>
    <button class="deleteProductBtn" data-id="${product.id}">Eliminar</button>
  `;
  productsContainer.appendChild(productCard);

  // Agregar evento de eliminación al nuevo botón
  productCard.querySelector(".deleteProductBtn").addEventListener("click", (e) => {
    const productId = e.target.getAttribute("data-id");
    deleteProduct(productId);
  });
});

socket.on("serverUserMessage", (data) => {
  chatMessage.innerHTML = "";
  updateMessages(data);
});

const typing = document.querySelector(".typing");

inputMessage.addEventListener("keypress", () => {
  socket.emit("typing", { user: userName.innerHTML });
});

socket.on("typing", (data) => {
  typing.textContent = `...${data.user} esta escribiendo`;
});