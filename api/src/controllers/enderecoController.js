const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function criarEndereco(req, res) {
  try {
    const userId = req.user.id;
    const { apelido, rua, numero, bairro, cidade, cep, referencia } = req.body;

    const endereco = await prisma.endereco.create({
      data: {
        userId,
        apelido,
        rua,
        numero,
        bairro,
        cidade,
        cep,
        referencia,
      },
    });

    res.json({ message: "Endereço salvo!", endereco });
  } catch (erro) {
    console.error("Erro ao criar endereço:", erro);
    res.status(500).json({ error: "Erro ao criar endereço" });
  }
}

async function listarEnderecos(req, res) {
  try {
    const userId = req.user.id;

    const enderecos = await prisma.endereco.findMany({
      where: { userId },
    });

    res.json(enderecos);
  } catch (erro) {
    console.error("Erro ao listar endereços:", erro);
    res.status(500).json({ error: "Erro ao listar endereços" });
  }
}

async function atualizarEndereco(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const data = req.body;

    const endereco = await prisma.endereco.update({
      where: { id: Number(id) },
      data,
    });

    res.json({ message: "Endereço atualizado!", endereco });
  } catch (erro) {
    console.error("Erro ao atualizar endereço:", erro);
    res.status(500).json({ error: "Erro ao atualizar endereço" });
  }
}

async function deletarEndereco(req, res) {
  try {
    const { id } = req.params;

    await prisma.endereco.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Endereço removido!" });
  } catch (erro) {
    console.error("Erro ao deletar endereço:", erro);
    res.status(500).json({ error: "Erro ao deletar endereço" });
  }
}

module.exports = {
  criarEndereco,
  listarEnderecos,
  atualizarEndereco,
  deletarEndereco,
};
