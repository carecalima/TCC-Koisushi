
const API = API_URL;

async function carregarRodizios() {
    try {
        const res = await fetch(`${API}/rodizio/todos`);
        const rodizios = await res.json();

        const container = document.getElementById("rodiziosContainer");
        container.innerHTML = "";

        rodizios.forEach(rodizio => {
            const rodizioDiv = document.createElement("div");
            rodizioDiv.className = "rodizio";

            rodizioDiv.innerHTML = `
                <h2>Mesa: ${rodizio.mesa || "Não informada"} | Cliente: ${rodizio.nomeCliente || "Anônimo"} | Status: ${rodizio.status}</h2>
                <div id="itensRodizio-${rodizio.id}"></div>
            `;

            container.appendChild(rodizioDiv);

            carregarItensRodizio(rodizio.id);
        });
    } catch (erro) {
        console.error("Erro ao carregar rodízios:", erro);
    }
}

async function carregarItensRodizio(rodizioId) {
    try {
        const res = await fetch(`${API}/rodizio/itens/${rodizioId}`);
        const itens = await res.json();

        const container = document.getElementById(`itensRodizio-${rodizioId}`);
        container.innerHTML = "";

        itens.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item";

            itemDiv.innerHTML = `
                <img src="${item.product?.imagemurl || ''}" alt="${item.product?.nome || item.nome}" style="width:80px; margin-right: 10px;">
                <div class="item-info">
                    <strong>${item.product?.nome || item.nome}</strong><br>
                    Quantidade: ${item.qtd || 1}<br>
                    Status: ${item.status}
                </div>
                <select onchange="mudarStatus(${item.id}, this.value)">
                    <option value="PENDENTE" ${item.status === "PENDENTE" ? "selected" : ""}>PENDENTE</option>
                    <option value="PREPARANDO" ${item.status === "PREPARANDO" ? "selected" : ""}>PREPARANDO</option>
                    <option value="ENTREGUE" ${item.status === "ENTREGUE" ? "selected" : ""}>ENTREGUE</option>
                </select>
            `;

            container.appendChild(itemDiv);
        });

    } catch (erro) {
        console.error("Erro ao carregar itens do rodízio:", erro);
    }
}

async function mudarStatus(itemId, novoStatus) {
    try {
        await fetch(`${API}/rodizio/item/${itemId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus })
        });

        carregarRodizios();
    } catch (erro) {
        console.error("Erro ao mudar status:", erro);
    }
}

setInterval(carregarRodizios, 10000);

carregarRodizios();
