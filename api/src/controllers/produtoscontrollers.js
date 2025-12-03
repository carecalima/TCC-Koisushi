const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getprodutos(req, res) {
  try {
    const produtos = await prisma.product.findMany();
    res.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}

async function getprodutosById(req, res) {
  const { id } = req.params;

  try {
    const produto = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
}

async function createProduto(req, res) {
const { nome, descricao, preco, estoque, imagemurl, categoria } = req.body;

try {
  const produto = await prisma.product.create({
    data: {
      nome,
      descricao,
      preco: Number(preco),
      estoque: Number(estoque),
      imagemurl,
      categoria
    }
  });

  res.json(produto);

} catch (e) {
  console.error("Erro ao criar produto:", e);
  res.status(500).json({ error: "Erro ao criar produto" });
}

}

async function updateProduto(req, res) {
  const { id } = req.params;
  const { nome, descricao, preco, estoque, imagemurl, categoria } = req.body;

  try {
    const produtoAtualizado = await prisma.product.update({
      where: { id: Number(id) },
      data: { nome, descricao, preco, estoque, imagemurl, categoria },
    });
    res.json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
}

async function deleteProduto(req, res) {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
}

async function getprodutosbycategorias(req, res) {
  const { categoria } = req.params;

  try {
    const produtos = await prisma.product.findMany({
      where: { categoria }
    });

    return res.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error);
    return res.status(500).json({ error: "Erro ao buscar produtos por categoria" });
  }
}

module.exports = {
  getprodutos,
  getprodutosById,
  createProduto,
  updateProduto,
  deleteProduto,
  getprodutosbycategorias
};
