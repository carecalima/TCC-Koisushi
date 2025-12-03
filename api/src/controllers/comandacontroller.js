const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createComanda(req, res){
    const { userId, total } = req.body;

    try {
        const comanda = await prisma.order.create({
            data: {
                user: { connect: { id: userId } },
                total,
                items: {
                    create: req.body.items.map(item => ({
                        nomeProduto: item.nomeProduto,
                        qtd: item.qtd,
                        preco: item.preco
                    }))
                }
            }
        });
        res.status(201).json(comanda);
    } catch (error) {
        console.error("Erro criar Comanda:", error);
        res.status(500).json({ error: "Falha ao criar Comanda" });
    }
}

async function getAllComandas(req, res) {
    try {
        const comandas = await prisma.order.findMany();
        res.status(200).json(comandas);
    } catch (error) {
        console.error("Erro ao buscar Comandas:", error);
        res.status(500).json({ error: "Falha ao buscar Comandas" });
    }
}

async function getComandaById(req, res) {
    const { id } = req.params;

    try {
        const comanda = await prisma.order.findUnique({
            where: { id: Number(id) },
            include: { items: true }
        });
        if (!comanda) {
            return res.status(404).json({ error: "Comanda não encontrada" });
        }
        res.status(200).json(comanda);
    } catch (error) {
        console.error("Erro ao buscar Comanda:", error);
        res.status(500).json({ error: "Falha ao buscar Comanda" });
    }
}

async function updateComanda(req, res) {
    const { id } = req.params;
    const { userId, total, items } = req.body;

    try {
        const comanda = await prisma.order.update({
            where: { id: Number(id) },
            data: {
                user: { connect: { id: userId } },
                total,
                items: {
                    deleteMany: {},
                    create: items.map(item => ({
                        nomeProduto: item.nomeProduto,
                        qtd: item.qtd,
                        preco: item.preco
                    }))
                }
            },
            include: { items: true }
        });

        res.status(200).json(comanda);
    } catch (error) {
        console.error("Erro ao atualizar Comanda:", error);
        res.status(500).json({ error: "Falha ao atualizar Comanda" });
    }
}


async function deleteComanda(req, res) {
    const { id } = req.params;

    try {
        await prisma.order.delete({
            where: { id: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar Comanda:", error);
        res.status(500).json({ error: "Falha ao deletar Comanda" });
    }
}

module.exports = {
    createComanda,
    getAllComandas,
    getComandaById,
    updateComanda,
    deleteComanda
};
