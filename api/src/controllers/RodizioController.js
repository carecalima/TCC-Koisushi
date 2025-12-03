const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function abrirRodizio(req, res) {
    try {
        const { userId, mesa, pessoas } = req.body;

        if (!mesa || !pessoas) {
            return res.status(400).json({ erro: "Número da mesa e quantidade de pessoas são obrigatórios" });
        }

        let sessao = await prisma.sessaoRodizio.findFirst({
            where: { userId : Number(userId), status: "ATIVA" }
        });

        if (!sessao) {
            sessao = await prisma.sessaoRodizio.create({
                data: { userId, mesa, pessoas, status: "ATIVA" }
            });
        }

        return res.json(sessao);
    } catch (erro) {
        console.error("Erro ao abrir rodízio:", erro);
        return res.status(500).json({ erro: erro.message });
    }
}


async function adicionarItem(req, res) {
  try {
    const { rodizioId, productId, quantidade } = req.body;
    const novoItem = await prisma.itemRodizio.create({
      data: {
        sessaoId: rodizioId,
        productId,
        qtd: quantidade || 1
      }
    });
    return res.json(novoItem);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

async function listarItens(req, res) {
  try {
    const { rodizioId } = req.params;
    const itens = await prisma.itemRodizio.findMany({
      where: { sessaoId: Number(rodizioId) },
      include: { product: true }
    });
    return res.json(itens);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

async function encerrarSessao(req, res) {
  try {
    const { rodizioId } = req.body;
    const fechamento = await prisma.sessaoRodizio.update({
      where: { id: rodizioId },
      data: { status: "ENCERRADA", encerradoEm: new Date() }
    });
    return res.json({ mensagem: "Rodízio encerrado!", fechamento });
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
}

async function todosRodizios(req, res) {
  try {
    const rodizios = await prisma.SessaoRodizio.findMany({
      include: {
        itens: { include: { product: true } },
        user: true
      }
    });
    res.json(rodizios);
  } catch (erro) {
    console.error("Erro ao buscar rodízios:", erro);
    res.status(500).json({ erro: "Erro ao buscar rodízios" });
  }
}

async function atualizarStatusItem(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        const itemAtualizado = await prisma.itemRodizio.update({
            where: { id: Number(id) },
            data: { status }
        });

        return res.json(itemAtualizado);
    } catch (erro) {
        return res.status(500).json({ erro: erro.message });
    }
}

async function getRodizioDashboardInfo(req, res) {
  try {
    const VALOR_RODIZIO = 110; // valor fixo do rodízio

    const hoje = new Date();
    const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
    const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    // Quantidade total de rodízios
    const totalRodizios = await prisma.sessaoRodizio.count();

    // Rodízios abertos hoje
    const rodiziosHoje = await prisma.sessaoRodizio.count({
      where: { criadoEm: { gte: inicioDoDia } }
    });

    // Rodízios no mês
    const rodiziosMes = await prisma.sessaoRodizio.count({
      where: { criadoEm: { gte: inicioDoMes } }
    });

    // Valor total (quantidade * valor fixo)
    const totalValor = totalRodizios * VALOR_RODIZIO;

    // Dados da semana
    const dataSemana = new Date();
    dataSemana.setDate(dataSemana.getDate() - 7);

    const rodiziosSemana = await prisma.sessaoRodizio.findMany({
      where: { criadoEm: { gte: dataSemana } },
      select: { criadoEm: true }
    });

    // Agrupar por dia para gráfico
    const resumoSemana = rodiziosSemana.reduce((acc, rodizio) => {
      const dia = rodizio.criadoEm.toISOString().split("T")[0]; // yyyy-mm-dd
      if (!acc[dia]) acc[dia] = { quantidade: 0, valor: 0 };
      acc[dia].quantidade += 1;
      acc[dia].valor += VALOR_RODIZIO;
      return acc;
    }, {});

    res.json({
      totalRodizios,
      rodiziosHoje,
      rodiziosMes,
      totalValor,
      rodiziosSemana: resumoSemana
    });

  } catch (erro) {
    console.error("Erro no dashboard rodízio:", erro);
    res.status(500).json({ error: "Erro ao gerar dados do dashboard de rodízios" });
  }
}

module.exports = {
  abrirRodizio,
  adicionarItem,
  listarItens,
  encerrarSessao,
  todosRodizios,
  atualizarStatusItem,
  getRodizioDashboardInfo
};
