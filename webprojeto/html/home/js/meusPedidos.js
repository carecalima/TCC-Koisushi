document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const container = document.getElementById("orders-list");

  if (!userId || !token) {
    container.innerHTML = "<p>Você precisa estar logado para ver seus pedidos.</p>";
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/pedidos/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (resposta.status === 401) {
      container.innerHTML = "<p>Sua sessão expirou. Faça login novamente.</p>";
      localStorage.clear();
      return;
    }

    const pedidos = await resposta.json();
    container.innerHTML = "";

    if (!Array.isArray(pedidos) || pedidos.length === 0) {
      container.innerHTML = "<p>Você ainda não fez pedidos.</p>";
      return;
    }

    pedidos.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("pedido-card");

      const total = Number(p.total) || 0;
      const dataPedido = p.data ? new Date(p.data) : new Date();

      card.innerHTML = `
        <h3>Pedido #${p.id}</h3>
        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
        <p><strong>Data:</strong> ${dataPedido.toLocaleDateString()}</p>
        <button class="details-btn" data-id="${p.id}">Ver Detalhes</button>
      `;

      container.appendChild(card);
    });

    // EVENTO PARA TODOS OS BOTÕES "VER DETALHES"
    document.querySelectorAll(".details-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idPedido = btn.getAttribute("data-id");
        abrirModalDetalhes(idPedido);
      });
    });

  } catch (error) {
    console.error("Erro ao carregar pedidos:", error);
    container.innerHTML = "<p>Erro ao carregar pedidos.</p>";
  }
});

async function abrirModalDetalhes(idPedido) {
  const token = localStorage.getItem("token");

  try {
    const resposta = await fetch(`${API_URL}/pedidos/${idPedido}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const pedido = await resposta.json();

    let itens = [];

    // tratamento seguro para o campo itens
    try {
      if (Array.isArray(pedido.itens)) {
        // já veio como array
        itens = pedido.itens;
      } else if (typeof pedido.itens === "string") {
        // tenta parsear se for string
        itens = JSON.parse(pedido.itens);
      } else {
        itens = [];
      }
    } catch (e) {
      console.error("Erro ao fazer JSON.parse em pedido.itens:", pedido.itens, e);
      itens = [];
    }

    const total = Number(pedido.total) || 0;
    const dataPedido = pedido.data ? new Date(pedido.data) : new Date();

    const modal = document.createElement("div");
    modal.classList.add("modal-overlay");
    modal.innerHTML = `
      <div class="modal">
        <h2>Detalhes do Pedido #${pedido.id}</h2>

        <p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>
        <p><strong>Data:</strong> ${dataPedido.toLocaleDateString()}</p>

        <h3>Itens:</h3>
        ${
          itens.length === 0
            ? "<p>Sem itens registrados para este pedido.</p>"
            : `<ul>
                ${itens
                  .map(i => {
                    const nome = i.name || i.nome || "Item";
                    const qtd = Number(i.quantity || i.qtd || 1);
                    const preco = Number(i.price || i.preco || 0);
                    return `
                      <li>
                        <strong>${nome}</strong> — ${qtd}x<br>
                        <small>R$ ${preco.toFixed(2)}</small>
                      </li>
                    `;
                  })
                  .join("")}
              </ul>`
        }

        <button id="closeModal">Fechar</button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeModal").addEventListener("click", () => {
      modal.remove();
    });

    modal.addEventListener("click", e => {
      if (e.target === modal) modal.remove();
    });

  } catch (erro) {
    console.error("Erro ao carregar detalhes do pedido:", erro);
    alert("Erro ao carregar detalhes do pedido.");
  }
}
