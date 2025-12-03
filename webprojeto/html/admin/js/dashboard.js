if (localStorage.getItem("userRole") !== "ADMIN") {
  window.location.href = "../login.html";
}

const token = localStorage.getItem("token");

async function carregarDashboard() {
  try {
    const response = await fetch(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    document.getElementById("pedidosHoje").textContent = data.pedidosHoje;
    document.getElementById("pedidosMes").textContent = data.pedidosMes;
    document.getElementById("totalPedidos").textContent = data.totalPedidos;
    document.getElementById("totalVendas").textContent =
      data.totalVendas.toFixed(2);

    criarGrafico(data.pedidosSemana);
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }
}

function criarGrafico(dados) {
  const labels = dados.map((item) =>
    new Date(item.createdAt).toLocaleDateString("pt-BR")
  );

  const valores = dados.map((item) => item._count.id);

  new Chart(document.getElementById("graficoPedidos"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Pedidos",
          data: valores,
          borderWidth: 3,
          borderColor: "#7b1414",
          backgroundColor: "rgba(123, 20, 20, 0.2)",
        },
      ],
    },
  });
}

async function carregarRodizioDashboard() {
  try {
    const res = await fetch(`${API_URL}/admin/dashboard/rodizios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    document.getElementById("rodiziosHoje").textContent = data.rodiziosHoje;
    document.getElementById("rodiziosMes").textContent = data.rodiziosMes;
    document.getElementById("totalRodizios").textContent = data.totalRodizios;
    document.getElementById("totalValor").textContent = data.totalValor.toFixed(2);

    criarGraficoRodizios(data.rodiziosSemana);
  } catch (erro) {
    console.error("Erro ao carregar dashboard rodízio:", erro);
  }
}

function criarGraficoRodizios(dados) {
  const labels = dados.map(item => new Date(item.criadoEm).toLocaleDateString("pt-BR"));
  const valores = dados.map(item => item._count.id);

  new Chart(document.getElementById("graficoRodizios"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Rodízios",
        data: valores,
        borderWidth: 3,
        borderColor: "#147b14",
        backgroundColor: "rgba(20, 123, 20, 0.2)"
      }]
    }
  });
}

carregarRodizioDashboard();


setInterval(carregarRodizioDashboard, 10000);

function logout() {
  localStorage.clear();
  window.location.href = "../login.html";
}

carregarDashboard();
