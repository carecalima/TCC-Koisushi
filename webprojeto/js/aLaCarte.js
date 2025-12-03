    let cupomAtivo = null;

    const token = localStorage.getItem("token");
    if (!token) {
      return window.location.href = "login.html";
    }
    
document.addEventListener("DOMContentLoaded", async function () {
  const cartButton = document.querySelector(".cart-button");
  const cartModal = createCartModal();
  document.body.appendChild(cartModal);

document.querySelectorAll(".filtros button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filtros button").forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");

    const categoria = btn.getAttribute("data-cat");
    carregarProdutosPorCategoria(categoria);
  });
});


  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  await carregarProdutos();

  cartButton.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "block";
  });

  cartModal.querySelector(".close").addEventListener("click", function () {
    cartModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === cartModal) {
      cartModal.style.display = "none";
    }
  });

  async function carregarProdutosPorCategoria(categoria) {
  try {
    const container = document.querySelector(".content");
    container.innerHTML = "";

    const url = categoria === "todos"
      ? `${API_URL}/produtos`
      : `${API_URL}/produtos/categoria/${categoria}`;

    const resposta = await fetch(url);
    const produtos = await resposta.json();

    produtos.forEach(produto => {
      const item = document.createElement("div");
      item.classList.add("menu-item");

      item.innerHTML = `
        <img src="${produto.imagemurl || '../imagens/placeholder.png'}">
        <div class="item-info">
          <strong>${produto.nome}</strong>
          <p>${produto.descricao || ""}</p>
          <span class="price">R$ ${parseFloat(produto.preco)
            .toFixed(2).replace(".", ",")}</span>
        </div>
      `;

      const addButton = document.createElement("button");
      addButton.className = "add-to-cart";
      addButton.textContent = "+";

      addButton.addEventListener("click", function (e) {
        e.stopPropagation();
        addToCart(item);
      });

      item.appendChild(addButton);
      container.appendChild(item);
    });

  } catch (erro) {
    console.error("Erro ao carregar por categoria:", erro);
  }
}


  async function carregarProdutos() {
    try {
      const resposta = await fetch(`${API_URL}/produtos`);
      const produtos = await resposta.json();

      const container = document.querySelector(".content");
      container.innerHTML = "";

      produtos.forEach((produto) => {
        const item = document.createElement("div");
        item.classList.add("menu-item");
        item.innerHTML = `
          <img src="${
            produto.imagemurl || "../imagens/placeholder.png"
          }" alt="${produto.nome}">
          <div class="item-info">
            <strong>${produto.nome}</strong>
            <p>${
              produto.descricao || "Delicioso prato disponível no cardápio."
            }</p>
            <span class="price">R$ ${parseFloat(produto.preco)
              .toFixed(2)
              .replace(".", ",")}</span>
          </div>
        `;

        const addButton = document.createElement("button");
        addButton.className = "add-to-cart";
        addButton.textContent = "+";
        addButton.addEventListener("click", function (e) {
          e.stopPropagation();
          addToCart(item);
        });

        item.appendChild(addButton);
        container.appendChild(item);
      });
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
    }
  }

  function addToCart(menuItem) {
    const itemName = menuItem.querySelector("strong").textContent;
    const itemDescription = menuItem.querySelector("p").textContent;
    const priceElement = menuItem.querySelector(".price");

    if (!priceElement) {
      console.error("Erro: preço não encontrado no item:", itemName);
      return;
    }

    const itemPrice = parseFloat(
      priceElement.textContent.replace("R$", "").replace(",", ".")
    );

    if (isNaN(itemPrice)) {
      console.error("Erro: preço inválido para o item:", itemName);
      return;
    }

    const existingItem = cart.find((item) => item.name === itemName);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: itemName,
        description: itemDescription,
        price: itemPrice,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showAddedFeedback(menuItem);
    updateCartCounter();
  }

  function showAddedFeedback(item) {
    const feedback = document.createElement("div");
    feedback.className = "added-feedback";
    feedback.textContent = "Adicionado!";
    item.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 1000);
  }

  function updateCartCounter() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (totalItems > 0) {
      cartButton.innerHTML = `Carrinho (${totalItems})`;
    } else {
      cartButton.textContent = "Carrinho";
    }
  }

  function createCartModal() {
    const modal = document.createElement("div");
    modal.className = "cart-modal";
modal.innerHTML = `
  <div class="cart-content">
    <span class="close">&times;</span>
    <h2>Seu Carrinho</h2>

    <div class="cart-items"></div>

    <!-- CUPOM -->
    <div class="cupom-area">
      <input type="text" id="cupomInput" placeholder="Insira um cupom">
      <button id="aplicarCupomBtn" class="cupom-btn">Aplicar</button>
      <p id="cupomInfo" class="cupom-info"></p>
    </div>

    <div class="cart-total">
      <strong>Total: R$ <span class="total-value">0,00</span></strong>
      <p id="descontoTexto" class="desconto-info" style="display:none;"></p>
    </div>

        <div class="payment-choice">
          <h3>Forma de pagamento</h3>
          <label><input type="radio" name="payment" value="pix"> PIX</label>
          <label><input type="radio" name="payment" value="cartao"> Cartão</label>
        </div>

        <div class="cart-buttons">
          <button class="checkout-button" disabled>Finalizar Pedido</button>
          <button class="clear-cart">Limpar Carrinho</button>
        </div>
      </div>
    `;

modal.querySelector(".clear-cart").addEventListener("click", function () {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  cupomAtivo = null;

  modal.querySelector("#cupomInfo").textContent = "";
  modal.querySelector("#cupomInput").value = "";

  const descTexto = modal.querySelector("#descontoTexto");
  descTexto.style.display = "none";
  descTexto.textContent = "";

  modal.querySelector(".total-value").textContent = "0,00";

  updateCartModal();
  updateCartCounter();
});

    const checkoutButton = modal.querySelector(".checkout-button");
    const paymentRadios = modal.querySelectorAll('input[name="payment"]');

    paymentRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        checkoutButton.disabled = false;
      });
    });

    checkoutButton.addEventListener("click", async function () {
      const selected = document.querySelector('input[name="payment"]:checked');
      if (!selected) {
        alert("Selecione uma forma de pagamento antes de continuar.");
        return;
      }

      const formaPagamento = selected.value;
      const total = getTotalComDesconto();
      
      const nomeCliente =
        localStorage.getItem("usuarioNome") || "Cliente Anônimo";

      try {
        const resposta = await fetch(`${API_URL}/pedidos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            nomeCliente,
            formaPagamento,
            total,
            itens: cart,
          }),
        });

        if (!resposta.ok) throw new Error("Erro ao enviar pedido");

        const dados = await resposta.json();
        console.log("Pedido salvo:", dados);

        if (formaPagamento === "pix") {
          showPixModal(total);
        } else if (formaPagamento === "cartao") {
          showCardModal(total);
        }
      } catch (erro) {
        console.error("Erro ao enviar pedido:", erro);
        alert("Não foi possível finalizar o pedido. Tente novamente.");
      }
    });

    function showPixModal(total) {
      const qrData = `Pagamento Koi Sushi - Valor R$ ${total.toFixed(2)}`;
      const qrURL = `https://quickchart.io/qr?text=${encodeURIComponent(
        qrData
      )}&size=250`;

      const newWindow = window.open("", "_blank", "width=420,height=500");

      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Pagamento PIX - Koi Sushi</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #E9E1CA;
              color: #333;
              text-align: center;
              padding: 30px;
            }
            h2 { color: #7b1e1e; }
            img { margin: 20px 0; border: 5px solid #7b1e1e; border-radius: 10px; }
            button {
              background: #7b1e1e;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 8px;
              cursor: pointer;
              font-weight: bold;
            }
            button:hover { background: #5e1515; }
          </style>
        </head>
        <body>
          <h2>Pagamento via PIX</h2>
          <p>Escaneie o QR Code abaixo para simular o pagamento:</p>
          <img src="${qrURL}" alt="QR Code PIX">
          <p><strong>Total:</strong> R$ ${total
            .toFixed(2)
            .replace(".", ",")}</p>
          <button id="confirmarPix">Simular Pagamento</button>

          <script>
            const button = document.getElementById("confirmarPix");
            button.addEventListener("click", () => {
              const msg = document.createElement("p");
              msg.textContent = "✅ Pagamento confirmado via PIX!";
              msg.style.color = "green";
              msg.style.fontWeight = "bold";
              document.body.appendChild(msg);
              button.remove();
            });
          </script>
        </body>
        </html>
      `);

      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartModal();
      updateCartCounter();
    }

    function showCardModal(total) {
      const cardModal = document.createElement("div");
      cardModal.className = "payment-modal";
      cardModal.innerHTML = `
        <div class="payment-content">
          <h2>Pagamento com Cartão</h2>
          <form id="cardForm">
            <label>Nome no cartão:</label>
            <input type="text" required>

            <label>Número do cartão:</label>
            <input type="text" maxlength="16" required>

            <label>Validade:</label>
            <input type="month" required>

            <label>CVV:</label>
            <input type="text" maxlength="3" required>

            <p><strong>Total:</strong> R$ ${total
              .toFixed(2)
              .replace(".", ",")}</p>
            <button type="submit">Pagar</button>
            <button type="button" class="close-payment">Cancelar</button>
          </form>
        </div>
      `;

      document.body.appendChild(cardModal);

      const form = cardModal.querySelector("#cardForm");

      cardModal
        .querySelector(".close-payment")
        .addEventListener("click", () => {
          cardModal.remove();
        });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = document.createElement("p");
        msg.textContent = "✅ Pagamento aprovado no cartão!";
        msg.style.color = "green";
        form.appendChild(msg);

        setTimeout(() => {
          cardModal.remove();
          cart = [];
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartModal();
          updateCartCounter();
        }, 2500);
      });
    }


modal.querySelector("#aplicarCupomBtn").addEventListener("click", async () => {
  const codigo = modal.querySelector("#cupomInput").value.trim();
  const info = modal.querySelector("#cupomInfo");

  if (!codigo) {
    info.textContent = "Digite um cupom.";
    info.style.color = "red";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/cupons/verificar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo })
    });

    const data = await res.json();
    console.log("CÓDIGO RECEBIDO:", codigo);


    if (!res.ok) {
      info.textContent = data.mensagem || "Cupom inválido.";
      info.style.color = "red";
      return;
    }

    cupomAtivo = data;

    info.textContent = `Cupom aplicado: ${data.codigo} (${data.desconto}% OFF)`;
    info.style.color = "green";



    aplicarDesconto(cartModal);

  } catch (err) {
    info.textContent = "Erro ao validar cupom.";
    info.style.color = "red";
  }
});

    return modal;
  }

  function updateCartModal() {
    const cartItemsContainer = document.querySelector(".cart-items");
    const totalValueElement = document.querySelector(".total-value");

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<p>Seu carrinho está vazio</p>";
      totalValueElement.textContent = "0,00";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      const preco = Number(item.price) || 0;
      const quantidade = Number(item.quantity) || 1;

      const itemTotal = preco * quantidade;
      total += itemTotal;

      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
        <div class="item-info">
            <strong>${item.name || "Produto"}</strong>
            <p>${item.description || ""}</p>
            <div class="item-price">R$ ${preco
              .toFixed(2)
              .replace(".", ",")} x ${quantidade}</div>
        </div>
        <div class="item-total">R$ ${itemTotal
          .toFixed(2)
          .replace(".", ",")}</div>
        <div class="item-actions">
            <button class="decrease-quantity" data-index="${index}">-</button>
            <button class="remove-item" data-index="${index}">&times;</button>
        </div>
      `;

      cartItemsContainer.appendChild(itemElement);
    });

    totalValueElement.textContent = total.toFixed(2).replace(".", ",");

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartModal();
        updateCartCounter();
      });
    });

    document.querySelectorAll(".decrease-quantity").forEach((button) => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartModal();
        updateCartCounter();
      });
    });
  }

  updateCartCounter();

  function getTotalComDesconto() {
  let total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  if (cupomAtivo) {
    total -= (total * cupomAtivo.desconto) / 100;
  }

  return total;
}


  function aplicarDesconto(modal) {
  if (!cupomAtivo) return;

  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const valorDesconto = (total * cupomAtivo.desconto) / 100;
  const totalComDesconto = total - valorDesconto;

  modal.querySelector(".total-value").textContent =
    totalComDesconto.toFixed(2).replace(".", ",");

  const descTexto = modal.querySelector("#descontoTexto");
  descTexto.textContent = `Desconto aplicado: -R$ ${valorDesconto
    .toFixed(2)
    .replace(".", ",")}`;
  descTexto.style.display = "block";
}
});

