const token = localStorage.getItem("token");

async function carregarCupons() {
  const res = await fetch(`${API_URL}/cupons`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const cupons = await res.json();

  const lista = document.getElementById("cupomLista");
  lista.innerHTML = "";

  if (cupons.length === 0) {
    lista.innerHTML = "<p style='text-align:center;color:#555'>Nenhum cupom disponível no momento.</p>";
    return;
  }

  cupons.forEach(c => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${c.codigo}</h3>
      <p>${c.descricao || ""}</p>
      <p>Desconto: <strong>${c.desconto}</strong></p>
      <p>Validade: ${new Date(c.validade).toLocaleDateString("pt-BR")}</p>
      <span class="badge">Válido</span>
    `;

    lista.appendChild(card);
  });
}

carregarCupons();
