const API = API_URL;
const tabela = document.getElementById("produtos-table");
const modalBg = document.getElementById("modal-bg");

let editId = null;
let produtosCache = [];

function openModal(produto = null) {
  modalBg.style.display = "flex";

  if (produto) {
    document.getElementById("modal-title").innerText = "Editar Produto";
    editId = produto.id;

    document.getElementById("nome").value = produto.nome;
    document.getElementById("descricao").value = produto.descricao;
    document.getElementById("preco").value = produto.preco;
    document.getElementById("estoque").value = produto.estoque;
    document.getElementById("imagemurl").value = produto.imagemurl;
    document.getElementById("produtoCategoria").value = produto.categoria; 

  } else {
    document.getElementById("modal-title").innerText = "Novo Produto";
    editId = null;

    document.getElementById("nome").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("estoque").value = "";
    document.getElementById("imagemurl").value = "";
    document.getElementById("produtoCategoria").value = "COMIDA"; 
  }
}


function closeModal() {
  modalBg.style.display = "none";
}

async function carregarProdutos() {
  try {
    const resp = await fetch(`${API}/produtos`);
    const produtos = await resp.json();
    produtosCache = produtos;

    tabela.innerHTML = "";

    produtos.forEach(p => {
      tabela.innerHTML += `
        <tr>
          <td>${p.nome}</td>
          <td>R$ ${p.preco}</td>
          <td>${p.estoque}</td>
          <td>${p.categoria}</td>
          <td><img src="${p.imagemurl}" width="50"></td>
          <td>
            <button class="btn btn-edit" onclick="editar(${p.id})">Editar</button>
            <button class="btn btn-delete" onclick="deletarProduto(${p.id})">Excluir</button>
          </td>
        </tr>
      `;
    });

  } catch (e) {
    console.error("Erro ao carregar produtos:", e);
  }
}

function editar(id) {
  const produto = produtosCache.find(p => p.id === id);
  openModal(produto);
}

async function salvarProduto() {
  const data = {
    nome: document.getElementById("nome").value,
    descricao: document.getElementById("descricao").value,
    preco: Number(document.getElementById("preco").value),
    estoque: Number(document.getElementById("estoque").value),
    imagemurl: document.getElementById("imagemurl").value,
    categoria: document.getElementById("produtoCategoria").value
  };

  try {
    let url = `${API}/produtos`;
    let method = "POST";

    if (editId) {
      url = `${API}/produtos/${editId}`;
      method = "PUT";
    }

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    closeModal();
    carregarProdutos();

  } catch (e) {
    console.error("Erro ao salvar produto:", e);
  }
}

async function deletarProduto(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;

  try {
    await fetch(`${API}/produtos/${id}`, {
      method: "DELETE"
    });

    carregarProdutos();

  } catch (e) {
    console.error("Erro ao excluir produto:", e);
  }
}

carregarProdutos();
