const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  const { nome, email, senha, role } = req.body;

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const newUser = await prisma.User.create({
      data: {
        nome,
        email,
        senha: hashedSenha,
        role: role || "CLIENT",
      },
    });

    console.log("Novo usuário criado:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      res.status(400).json({ error: "Email já está em uso" });
    } else {
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        senha,
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
}

const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res.status(401).json({ error: "Email ou senha incorretos." });

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword)
      return res.status(401).json({ error: "Email ou senha incorretos." });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      "seuSegredoJWT",
      { expiresIn: "1d" }
    );

    const role = user.role;
    const userId = user.id;
    res.json({ message: "Login bem-sucedido", token, role, userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};

async function getMe(req, res) {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nome: true, email: true },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getMe,
};
