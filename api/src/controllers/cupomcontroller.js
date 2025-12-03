const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verificarCupom(req, res) {
  const { codigo } = req.body;

  try {
    const cupom = await prisma.cupom.findUnique({
      where: { codigo },
    });

    if (!cupom || !cupom.ativo || new Date() > new Date(cupom.validade)) {
      return res.status(400).json({ mensagem: "Cupom inválido ou expirado." });
    }

    res.json({
      mensagem: "Cupom válido!",
        codigo: cupom.codigo,
      desconto: cupom.desconto,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao verificar cupom." });
  }
}

async function criarCupom(req, res) {
  const { codigo, tipo, desconto, minimo, descricao, validade, ativo } = req.body;

  try {
    const novoCupom = await prisma.cupom.create({
      data: {
        codigo,
        tipo,
        desconto,
        minimo,
        descricao,
        validade: new Date(validade),
        ativo
      }
    });

    return res.status(201).json(novoCupom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar cupom" });
  }
}

async function vercupom(req, res) {
  try {
    const cupons = await prisma.cupom.findMany();
    res.json(cupons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar cupons." });
  }
  
}

async function deletarCupom(req, res) {
  const { id } = req.params;
  try {
    await prisma.cupom.delete({
      where: { id: parseInt(id) },
    });
    res.json({ mensagem: "Cupom deletado com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao deletar cupom." });
  }
}

module.exports = { verificarCupom, criarCupom, vercupom, deletarCupom };