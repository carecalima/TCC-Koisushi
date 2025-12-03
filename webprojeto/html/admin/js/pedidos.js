const tabela = document.getElementById("pedidos-table");
const API = API_URL;
const modalBg = document.getElementById("modal-bg");
const detalhesConteudo = document.getElementById("detalhes-conteudo");

async function carregarPedidos() {
  try {
    const resp = await fetch(`${API}/pedidos`);
    const pedidos = await resp.json();

    tabela.innerHTML = "";

    pedidos.forEach(p => {
      const itensEncoded = encodeURIComponent(JSON.stringify(p.itens));

      tabela.innerHTML += `
        <tr>
          <td>${p.id}</td>
          <td>${p.nomeCliente}</td>
          <td>R$ ${Number(p.total).toFixed(2)}</td>
          <td>${p.formaPagamento}</td>
          <td>${new Date(p.data).toLocaleString()}</td>

          <td>
            <button class="btn btn-details" onclick="verDetalhes('${itensEncoded}', ${p.id})">Detalhes</button>
            <button class="btn btn-delete" onclick="deletarPedido(${p.id})">Excluir</button>
          </td>
        </tr>
      `;
    });

  } catch (e) {
    console.error("Erro ao carregar pedidos:", e);
  }
}

function verDetalhes(itensEncoded, id) {
  modalBg.style.display = "flex";

  const itens = JSON.parse(decodeURIComponent(itensEncoded));

  let html = `<p><strong>ID:</strong> ${id}</p>`;
  html += "<h3>Itens:</h3>";

  itens.forEach(i => {
    html += `
      <div style='margin-bottom: 10px;'>
        <strong>${i.name}</strong> — Qtd: ${i.quantity} — R$ ${i.price}
      </div>
    `;
  });

  detalhesConteudo.innerHTML = html;
}

function closeModal() {
  modalBg.style.display = "none";
}

async function deletarPedido(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  try {
    await fetch(`${API}/pedidos/${id}`, {
      method: "DELETE"
    });

    carregarPedidos();

  } catch (e) {
    console.error("Erro ao excluir pedido:", e);
  }
}

carregarPedidos();
