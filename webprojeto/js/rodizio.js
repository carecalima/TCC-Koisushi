const API = API_URL;
let rodizioId = null;
let userId = Number(localStorage.getItem("userId"));

rodizioId = Number(localStorage.getItem("rodizioId"));

  if (!userId) {
    return window.location.href = "login.html";
  }

async function abrirRodizio() {
    if (rodizioId) {
        console.log("Sessão já aberta com ID:", rodizioId);
        carregarSugestoes();
        carregarProdutos();
        carregarItens();
        return;
    }

    const mesa = prompt("Digite o número da mesa:");
    const pessoas = prompt("Digite quantas pessoas estão no rodízio:");

    if (!mesa || !pessoas) {
        alert("Mesa e número de pessoas são obrigatórios!");
        window.location.href = "../html/home.html";
        return;
    }

    const res = await fetch(`${API}/rodizio/abrir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, mesa, pessoas: Number(pessoas) })
    });

    const data = await res.json();
    if (data.erro) {
        alert("Erro ao abrir rodízio: " + data.erro);
        return;
    }

    rodizioId = data.id;
    localStorage.setItem("rodizioId", rodizioId);
    console.log("Rodízio aberto com ID:", rodizioId);

    carregarSugestoes();
    carregarProdutos();
    carregarItens();
}

setInterval(() => {
    if (rodizioId) carregarItens();
}, 5000);

async function carregarSugestoes() {
    try {
        const res = await fetch(`${API}/rodizio/sugestoes`);
        const lista = await res.json();
        const box = document.getElementById("sugestoes");
        box.innerHTML = "";
        lista.flat().forEach(nome => {
            const btn = document.createElement("button");
            btn.className = "sug-btn";
            btn.innerText = nome;
            btn.onclick = () => pedirItemByName(nome);
            box.appendChild(btn);
        });
    } catch (erro) {
        console.error("Erro ao carregar sugestões:", erro);
    }
}

async function carregarProdutos() {
    try {
        const res = await fetch(`${API}/produtos`);
        const produtos = await res.json();

        const comidas = produtos.filter(p => p.categoria === "COMIDA");
        const sobremesas = produtos.filter(p => p.categoria === "SOBREMESA");

        montarCategoria(comidas, document.getElementById("boxComidas"));
        montarCategoria(sobremesas, document.getElementById("boxSobremesas"));
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

function montarCategoria(lista, container) {
    container.innerHTML = "";
    lista.forEach(prod => {
        const card = document.createElement("div");
        card.className = "card";

        let selectHTML = '<select class="qtd-select">';
        for (let i = 1; i <= 10; i++) {
            selectHTML += `<option value="${i}">${i}</option>`;
        }
        selectHTML += '</select>';

        card.innerHTML = `
            <img src="${prod.imagemurl}" class="card-img">
            <div class="card-info">
                <strong>${prod.nome}</strong><br>
                Quantidade: ${selectHTML}<br>
                <button class="add-btn">Pedir</button>
            </div>
        `;

        card.querySelector(".add-btn").onclick = () => {
            const qtd = Number(card.querySelector(".qtd-select").value);
            pedirItem(prod.id, qtd);
        };

        container.appendChild(card);
    });
}

async function pedirItem(productId, quantidade) {
    try {
        if (!rodizioId) throw new Error("Rodízio não aberto");

        await fetch(`${API}/rodizio/adicionar-item`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rodizioId, productId, quantidade })
        });

        carregarItens();

        const res = await fetch(`${API}/rodizio/itens/${rodizioId}`);
        const itens = await res.json();
        const totalItens = itens.reduce((acc, i) => acc + (i.qtd || 1), 0);

        if (totalItens > 10) {
            alert("Cuidado! Você está pedindo muitos itens e pode gerar desperdício.");
        }

    } catch (erro) {
        console.error("Erro ao adicionar item:", erro);
    }
}

async function carregarItens() {
    try {
        if (!rodizioId) return;
        const res = await fetch(`${API}/rodizio/itens/${rodizioId}`);
        const itens = await res.json();
        const box = document.getElementById("listaItens");
        box.innerHTML = "";
        itens.forEach(i => {
            const div = document.createElement("div");
            div.className = "item";
            div.innerHTML = `
                <strong>${i.product?.nome || i.nome}</strong><br>
                Status: ${i.status}<br>
                Quantidade: ${i.qtd || 1}<br>
                <img src="${i.product?.imagemurl || ''}" style="width:80px; margin-top:4px;">
            `;
            box.appendChild(div);
        });
    } catch (erro) {
        console.error("Erro ao carregar itens:", erro);
    }
}

document.getElementById("btnFechar").onclick = async () => {
    try {
        if (!rodizioId) return;
        await fetch(`${API}/rodizio/fechar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rodizioId })
        });
        localStorage.removeItem("rodizioId");
        alert("Rodízio encerrado!");
        window.location.href = "home.html";
    } catch (erro) {
        console.error("Erro ao fechar rodízio:", erro);
    }
};

window.addEventListener("beforeunload", (event) => {
    if (rodizioId) {
        event.preventDefault();
        event.returnValue = "Você tem um rodízio aberto! Ele não será encerrado automaticamente.";
    }
});

abrirRodizio();
