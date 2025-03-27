const socket = io("http://localhost:3000");
let currentCartId = null;

const initializeEvents = () => {
  document.addEventListener("DOMContentLoaded", () => {
    setupGlobalButtons();
    setupProductButtons();
    setupCartButtons();
    updateCartButtonVisibility();
    loadProducts();
    loadCategories();

    const filterForm = document.getElementById("filterForm");
    if (filterForm) {
      filterForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const limit = document.getElementById("limit").value || 10;
        const query = document.getElementById("query").value || "";
        const sort = document.getElementById("sort").value || "";

        loadProducts(1, limit, query, sort);
      });
    }
  });
};

const setupGlobalButtons = () => {
  const createCartBtn = document.getElementById("createCartBtn");
  const deleteCartBtn = document.getElementById("deleteCartBtn");
  const cartBtn = document.getElementById("cartBtn");
  const addProductBtn = document.getElementById("addProductBtn");

  if (createCartBtn) createCartBtn.addEventListener("click", createCart);
  if (deleteCartBtn) deleteCartBtn.addEventListener("click", deleteCart);
  if (cartBtn) cartBtn.addEventListener("click", openCartModal);
  if (addProductBtn) addProductBtn.addEventListener("click", showProductAlert);
};

const setupProductButtons = () => {
  const addToCartBtns = document.querySelectorAll(".addToCartBtn");
  const deleteProductBtns = document.querySelectorAll(".deleteProductBtn");

  addToCartBtns.forEach((btn) => {
    btn.removeEventListener("click", handleAddToCart);
    btn.addEventListener("click", handleAddToCart);
  });

  deleteProductBtns.forEach((btn) => {
    btn.removeEventListener("click", handleDeleteProduct);
    btn.addEventListener("click", handleDeleteProduct);
  });
};

const setupCartButtons = () => {
  const closeModal = document.getElementById("closeModal");
  if (closeModal) closeModal.addEventListener("click", closeCartModal);
};

const handleAddToCart = (e) => {
  const productId = e.target.getAttribute("data-id");
  addToCart(productId);
};

const handleDeleteProduct = (e) => {
  const productId = e.target.getAttribute("data-id");
  deleteProduct(productId);
};

//* Función para agregar un producto al carrito
const addToCart = async (productId) => {
  if (!currentCartId) {
    console.error(
      "No hay un carrito activo. Por favor, crea un carrito primero."
    );
    return;
  }

  try {
    const response = await fetch(
      `/api/carts/${currentCartId}/product/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al agregar el producto al carrito:", errorData);
      return;
    }

    const data = await response.json();
    console.log("Producto agregado al carrito:", data);
    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: "El producto se agregó correctamente al carrito.",
    });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al intentar agregar el producto al carrito.",
    });
  }
};

//* Función para crear un carrito
const createCart = async () => {
  try {
    const response = await fetch("/api/carts", { method: "POST" });
    const data = await response.json();

    if (data.cart && data.cart._id) {
      currentCartId = data.cart._id; // Asignar el ID del carrito creado
      document.getElementById("createCartBtn").disabled = true;
      document.getElementById("deleteCartBtn").style.display = "inline-block";
      document.getElementById("cartBtn").style.display = "inline-block";
    } else {
      console.error("No se pudo crear el carrito:", data);
    }
  } catch (error) {
    console.error("Error al crear el carrito:", error);
  }
};

//* Función para mostrar el alert de SweetAlert2
const showProductAlert = () => {
  Swal.fire({
    title: "Agregar un nuevo producto",
    html: `
      <input type="text" id="swal-input-title" class="swal2-input" placeholder="Nombre del producto">
      <input type="text" id="swal-input-description" class="swal2-input" placeholder="Descripción">
      <input type="number" id="swal-input-price" class="swal2-input" placeholder="Precio">
      <input type="text" id="swal-input-thumbnail" class="swal2-input" placeholder="URL de la imagen">
      <input type="text" id="swal-input-category" class="swal2-input" placeholder="Categoría">
      <input type="number" id="swal-input-stock" class="swal2-input" placeholder="Stock">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Agregar",
    preConfirm: () => {
      const title = Swal.getPopup().querySelector("#swal-input-title").value;
      const description = Swal.getPopup().querySelector(
        "#swal-input-description"
      ).value;
      const price = Swal.getPopup().querySelector("#swal-input-price").value;
      const thumbnail = Swal.getPopup().querySelector(
        "#swal-input-thumbnail"
      ).value;
      const category = Swal.getPopup().querySelector(
        "#swal-input-category"
      ).value;
      const stock = Swal.getPopup().querySelector("#swal-input-stock").value;

      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !category ||
        !stock
      ) {
        Swal.showValidationMessage(`Por favor, completa todos los campos`);
      }

      return { title, description, price, thumbnail, category, stock };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const product = result.value;
      createProduct(product); // Llama a la función para crear el producto
    }
  });
};

//* Función para enviar el producto al servidor
const createProduct = async (product) => {
  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al agregar el producto:", errorData);
      return;
    }

    const data = await response.json();
    console.log("Producto agregado:", data);
    location.reload(); // Recargar la página para actualizar el listado de productos
  } catch (error) {
    console.error("Error al agregar el producto:", error);
  }
};

//* Función para eliminar el carrito completo
const deleteCart = async () => {
  if (!currentCartId) {
    console.error("No hay un carrito activo para eliminar.");
    return;
  }

  try {
    const response = await fetch(`/api/carts/${currentCartId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al eliminar el carrito:", errorData);
      return;
    }

    currentCartId = null; // Reiniciar el ID del carrito
    document.getElementById("createCartBtn").disabled = false;
    document.getElementById("deleteCartBtn").style.display = "none";
    document.getElementById("cartBtn").style.display = "none";
  } catch (error) {
    console.error("Error al eliminar el carrito:", error);
  }
};

//* Función para abrir el modal del carrito
const openCartModal = async () => {
  if (!currentCartId) {
    console.error(
      "No hay un carrito activo. Por favor, crea un carrito primero."
    );
    Swal.fire({
      icon: "error",
      title: "Carrito no disponible",
      text: "No hay un carrito activo. Por favor, crea un carrito primero.",
    });
    return;
  }

  try {
    const response = await fetch(`/api/carts/${currentCartId}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al obtener los datos del carrito:", errorData);
      Swal.fire({
        icon: "error",
        title: "Error al cargar el carrito",
        text: "No se pudo cargar la información del carrito.",
      });
      return;
    }

    const cart = await response.json();

    // Construir el contenido HTML para mostrar los productos del carrito con la categoría
    const cartProductsHTML = cart.products
      .map(
        (item) => `
        <li style="margin-bottom: 10px;">
          <strong>${item.product.title}</strong> - Cantidad: ${item.quantity} - Categoría: ${item.product.category}
          <button class="remove-product-btn" data-id="${item.product._id}" style="margin-left: 10px; color: white; background-color: red; border: none; padding: 5px 10px; cursor: pointer;">
            Eliminar
          </button>
        </li>
      `
      )
      .join("");

    // Mostrar el carrito en un SweetAlert
    Swal.fire({
      title: "Productos en el carrito",
      html: `
        <ul style="text-align: left; list-style: none; padding: 0;">
          ${cartProductsHTML}
        </ul>
      `,
      icon: "info",
      showConfirmButton: false, // Ocultar el botón de confirmación
      showCloseButton: true, // Mostrar un botón de cierre
      didOpen: () => {
        // Configurar eventos para los botones "Eliminar"
        const removeProductBtns = document.querySelectorAll(
          ".remove-product-btn"
        );
        removeProductBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            removeFromCart(productId); // Llamar a la función para eliminar el producto
          });
        });
      },
    });
  } catch (error) {
    console.error("Error al abrir el modal del carrito:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al intentar abrir el carrito.",
    });
  }
};

//* Manejar el evento de eliminar un producto del carrito desde el modal
const handleRemoveFromCart = (e) => {
  const productId = e.target.getAttribute("data-id");
  removeFromCart(productId);
};

//* Función para eliminar un producto
const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al eliminar el producto:", errorData);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el producto.",
      });
      return;
    }

    const data = await response.json();
    console.log("Producto eliminado:", data);
    Swal.fire({
      icon: "success",
      title: "Producto eliminado",
      text: "El producto se eliminó correctamente.",
    });

    // Recargar los productos después de eliminar
    loadProducts();
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al intentar eliminar el producto.",
    });
  }
};

//* Función para eliminar un producto del carrito
const removeFromCart = async (productId) => {
  if (!currentCartId) {
    console.error("No hay un carrito activo. Por favor, crea un carrito primero.");
    return;
  }

  try {
    const response = await fetch(
      `/api/carts/${currentCartId}/products/${productId}`, // Asegúrate de que esta URL coincida con la ruta del backend
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al eliminar el producto del carrito:", errorData);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el producto del carrito.",
      });
      return;
    }

    const data = await response.json();
    console.log("Producto eliminado del carrito:", data);

    // Actualizar el modal del carrito con los productos restantes
    openCartModal(); // Llamar a la función para reabrir el modal con los productos actualizados
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al intentar eliminar el producto.",
    });
  }
};

//* Función para cerrar el modal del carrito
const closeCartModal = () => {
  document.getElementById("cartModal").style.display = "none";
};

//* Función para actualizar la visibilidad del botón "Carrito"
const updateCartButtonVisibility = async () => {
  if (!currentCartId) {
    document.getElementById("cartBtn").style.display = "none";
    return;
  }

  try {
    const response = await fetch(`/api/carts/${currentCartId}`);
    if (!response.ok) {
      console.error("Error al obtener los datos del carrito.");
      document.getElementById("cartBtn").style.display = "none";
      return;
    }

    const cart = await response.json();
    const cartBtn = document.getElementById("cartBtn");

    // Mostrar el botón "Carrito" solo si hay productos en el carrito
    cartBtn.style.display =
      cart.products && cart.products.length > 0 ? "inline-block" : "none";
  } catch (error) {
    console.error("Error en updateCartButtonVisibility:", error);
    document.getElementById("cartBtn").style.display = "none";
  }
};

//* Función para cargar los productos con paginación
const loadProducts = async (page = 1, limit = 10, query = "", sort = "") => {
  try {
    const response = await fetch(
      `/api/products?page=${page}&limit=${limit}&query=${query}&sort=${sort}`
    );
    if (!response.ok) {
      console.error("Error al cargar los productos:", await response.json());
      return;
    }

    const data = await response.json();
    const productsContainer = document.querySelector(".products");

    // Limpiar los productos actuales
    productsContainer.innerHTML = "";

    // Renderizar los productos de la página actual
    data.payload.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <img
          src="${product.thumbnail}"
          alt="Imagen del producto"
          onerror="this.onerror=null; this.src='/img/default.png';"
        />
        <p class="product-title">${product.title}</p>
        <p class="product-category" style="font-size: 0.9em; color: gray; margin: 0;">Categoría: ${product.category}</p>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${product.price}</p>
        <button class="addToCartBtn" data-id="${product._id}">Agregar al carrito</button>
        <button class="deleteProductBtn" data-id="${product._id}">Eliminar producto de la lista</button>
      `;
      productsContainer.appendChild(productCard);
    });

    // Configurar los botones de paginación
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = ""; // Limpiar la paginación actual

    if (data.hasPrevPage) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Anterior";
      prevButton.addEventListener("click", () =>
        loadProducts(data.prevPage, limit, query, sort)
      );
      paginationContainer.appendChild(prevButton);
    }

    if (data.hasNextPage) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Siguiente";
      nextButton.addEventListener("click", () =>
        loadProducts(data.nextPage, limit, query, sort)
      );
      paginationContainer.appendChild(nextButton);
    }

    // Configurar los botones después de renderizar los productos
    setupProductButtons();
  } catch (error) {
    console.error("Error al cargar los productos con paginación:", error);
  }
};

//* Función para cargar las categorías en el dropdown
const loadCategories = async () => {
  try {
    const response = await fetch("/api/products/categories");
    if (!response.ok) {
      console.error("Error al cargar las categorías:", await response.json());
      return;
    }

    const data = await response.json();
    const categoryDropdown = document.getElementById("query");

    // Limpiar las opciones actuales
    categoryDropdown.innerHTML = `<option value="">Todas las categorías</option>`;

    // Agregar las categorías al dropdown
    data.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
};

initializeEvents();
