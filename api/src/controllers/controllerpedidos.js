const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function criarPedido(req, res) {
  try {
    console.log("BODY DO PEDIDO >>>", req.body);

    const { userId, nomeCliente, formaPagamento, total, itens } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }

    const pedido = await prisma.pedido.create({
      data: {
        nomeCliente: nomeCliente || "Cliente Anônimo",
        formaPagamento: formaPagamento || "pix",
        total: Number(total), // garante número
        itens: JSON.stringify(itens), // array -> string
        user: {
          connect: {
            id: Number(userId), // 👈 AGORA VAI UM INT DE VERDADE
          },
        },
      },
    });

    return res.json({ message: "Pedido criado com sucesso!", pedido });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ error: "Erro ao salvar pedido" });
  }
}



async function getpedidos(req, res) {
  try {
    console.log(">>> ENTROU NO GETPEDIDOS");

    const pedidos = await prisma.pedido.findMany();
    const pedidosFormatados = pedidos.map(p => ({
      ...p,
      itens: JSON.parse(p.itens)
    }));

    res.json(pedidosFormatados);
  } catch (error) { 
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
}


async function getPedidosByToken(req, res) {
  try {
    const userId = req.user.id; 

    const pedidos = await prisma.pedido.findMany({
      where: { userId },
      orderBy: { data: "desc" },
    });

    const pedidosFormatados = pedidos.map(p => ({
    ...p,
    itens: JSON.parse(p.itens)
})); 

    res.json(pedidosFormatados);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
}


async function updatePedido(req, res) {
  try {
    const { id } = req.params;
    const { nomeCliente, formaPagamento, total, itens } = req.body;

    const pedidoAtualizado = await prisma.pedido.update({
      where: { id: Number(id) },
      data: {
        nomeCliente,
        formaPagamento,
        total,
        itens: JSON.stringify(itens),
      },
    });

    res.json({
      message: "Pedido atualizado com sucesso!",
      pedido: pedidoAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    res.status(500).json({ error: "Erro ao atualizar pedido" });
  }
}

async function deletePedido(req, res) {
  try {
    const { id } = req.params;

    await prisma.pedido.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Pedido deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    res.status(500).json({ error: "Erro ao deletar pedido" });
  }
}

async function getDashboardInfo(req, res) {
  try {
    const hoje = new Date();
    const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
    const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const totalPedidos = await prisma.pedido.count();

    const pedidosHoje = await prisma.pedido.count({
      where: {
        data: { gte: inicioDoDia }, // <-- trocou createdAt por data
      },
    });

    const pedidosMes = await prisma.pedido.count({
      where: {
        data: { gte: inicioDoMes }, // <-- trocou createdAt por data
      },
    });

    const vendas = await prisma.pedido.aggregate({
      _sum: { total: true },
    });

    const dataSemana = new Date();
    dataSemana.setDate(dataSemana.getDate() - 7);

    const pedidosSemana = await prisma.pedido.groupBy({
      by: ["data"],
      _count: { id: true },
      where: {
        data: { gte: dataSemana }, 
      },
    });

    res.json({
      totalPedidos,
      pedidosHoje,
      pedidosMes,
      totalVendas: vendas._sum.total || 0,
      pedidosSemana,
    });
  } catch (error) {
    console.error("Erro no dashboard:", error);
    res.status(500).json({ error: "Erro ao gerar dados do dashboard" });
  }
}


async function getPedidosbyid(req, res) {
  try {
    const { id } = req.params;
    const pedido = await prisma.pedido.findUnique({
      where: { id: Number(id) },
    });
    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    res.json(pedido);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({ error: "Erro ao buscar pedido" });
  }
}

module.exports = {
  criarPedido,
  getpedidos,
  getPedidosByToken,
  updatePedido,
  deletePedido,
  getDashboardInfo,
  getPedidosbyid
};
