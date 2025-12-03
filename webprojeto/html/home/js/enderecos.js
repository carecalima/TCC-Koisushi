const token = localStorage.getItem("token");
let enderecoEditando = null;

async function carregarEnderecos() {
  const res = await fetch(`${API_URL}/enderecos`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const enderecos = await res.json();

  const lista = document.getElementById("listaEnderecos");
  lista.innerHTML = "";

  enderecos.forEach((e) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${e.apelido}</h3>
      <p>${e.rua}, ${e.numero}</p>
      <p>${e.bairro} - ${e.cidade}</p>
      <p>CEP: ${e.cep}</p>
      ${e.referencia ? `<p>Ref: ${e.referencia}</p>` : ""}
      <div class="botoes">
        <button class="btn-edit" onclick="editarEndereco(${e.id})">Editar</button>
        <button class="btn-delete" onclick="deletarEndereco(${e.id})">Excluir</button>
      </div>
    `;

    lista.appendChild(card);
  });
}

function abrirModal() {
  enderecoEditando = null;
  document.getElementById("tituloModal").textContent = "Novo Endereço";
  document.getElementById("enderecoForm").reset();
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("enderecoForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const body = {
    apelido: document.getElementById("apelido").value,
    cep: document.getElementById("cep").value,
    rua: document.getElementById("rua").value,
    numero: document.getElementById("numero").value,
    bairro: document.getElementById("bairro").value,
    cidade: document.getElementById("cidade").value,
    referencia: document.getElementById("referencia").value
  };

  if (enderecoEditando) {
    await fetch(`${API_URL}/enderecos/${enderecoEditando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
  } else {
    await fetch(`${API_URL}/enderecos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
  }

  fecharModal();
  carregarEnderecos();
});

async function editarEndereco(id) {
  enderecoEditando = id;

  const res = await fetch(`${API_URL}/enderecos`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const lista = await res.json();
  const e = lista.find((end) => end.id === id);

  document.getElementById("tituloModal").textContent = "Editar Endereço";

  document.getElementById("apelido").value = e.apelido;
  document.getElementById("cep").value = e.cep;
  document.getElementById("rua").value = e.rua;
  document.getElementById("numero").value = e.numero;
  document.getElementById("bairro").value = e.bairro;
  document.getElementById("cidade").value = e.cidade;
  document.getElementById("referencia").value = e.referencia || "";

  document.getElementById("modal").style.display = "flex";
}

async function deletarEndereco(id) {
  if (!confirm("Deseja realmente excluir este endereço?")) return;

  await fetch(`${API_URL}/enderecos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  carregarEnderecos();
}

async function buscarCEP() {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");
  if (cep.length !== 8) return;

  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await res.json();

  if (!data.erro) {
    document.getElementById("rua").value = data.logradouro;
    document.getElementById("bairro").value = data.bairro;
    document.getElementById("cidade").value = data.localidade;
  }
}

  lucide.createIcons();


carregarEnderecos();
