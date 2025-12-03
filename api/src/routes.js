const express = require("express");
const routes = express.Router();

const usercontroller = require("./controllers/usercontroller");
const comandacontroller = require("./controllers/comandacontroller");
const itenscontroller = require("./controllers/itenscontroller");
const authenticateToken = require("./middleware/auth");
const cupomcontroller = require("./controllers/cupomcontroller");
const controllerpedidos = require("./controllers/controllerpedidos");
const isAdmin = require("./middleware/isAdmin");
const enderecoController = require("./controllers/enderecoController");

const rodizioController = require("./controllers/RodizioController");

const produtoscontrollers = require("./controllers/produtoscontrollers");

//rota padrao para teste
routes.get("/", (req, res) => {
  res.send("API rodando normalmente!");
});

routes.get(
  "/admin/dashboard",
  authenticateToken,
  isAdmin,
  controllerpedidos.getDashboardInfo
);

routes.get(
  "/admin/dashboard/rodizios",
  authenticateToken,
  isAdmin,
  rodizioController.getRodizioDashboardInfo
);

routes.post("/login", usercontroller.loginUser);
routes.get("/me", authenticateToken, usercontroller.getMe);

// user controller
routes.post("/usuarios", usercontroller.createUser);
routes.get("/usuarios", usercontroller.getAllUsers);
routes.get("/usuarios/:id", usercontroller.getUserById);
routes.put("/usuarios/:id", usercontroller.updateUser);
routes.delete("/usuarios/:id", usercontroller.deleteUser);

// comanda controller
routes.post("/comandas", comandacontroller.createComanda);
routes.get("/comandas", comandacontroller.getAllComandas);
routes.get("/comandas/:id", comandacontroller.getComandaById);
routes.put("/comandas/:id", comandacontroller.updateComanda);
routes.delete("/comandas/:id", comandacontroller.deleteComanda);

// itens controller
routes.post("/comandas-itens", itenscontroller.createOrderItem);
routes.get("/comandas-itens", itenscontroller.getOrderItems);
routes.put("/comandas-itens/:id", itenscontroller.updateOrderItem);
routes.delete("/comandas-itens/:id", itenscontroller.deleteOrderItem);

//produtos
routes.get("/produtos", produtoscontrollers.getprodutos);
routes.get("/produtos/:id", produtoscontrollers.getprodutosById);
routes.post("/produtos", produtoscontrollers.createProduto);
routes.delete("/produtos/:id", produtoscontrollers.deleteProduto);
routes.put("/produtos/:id", produtoscontrollers.updateProduto);
routes.get("/produtos/categoria/:categoria", produtoscontrollers.getprodutosbycategorias);

//cupom
routes.post("/cupons/verificar", cupomcontroller.verificarCupom);
routes.post("/cupons/criar", cupomcontroller.criarCupom);
routes.get("/cupons", cupomcontroller.vercupom);
routes.delete("/cupons/:id", cupomcontroller.deletarCupom);

//pedidos
routes.post("/pedidos", controllerpedidos.criarPedido);
routes.get("/pedidos", controllerpedidos.getpedidos);
routes.get("/pedidos/me", authenticateToken, controllerpedidos.getPedidosByToken);
routes.get("/pedidos/:id", controllerpedidos.getPedidosbyid);
routes.put("/pedidos/:id", controllerpedidos.updatePedido);
routes.delete("/pedidos/:id", controllerpedidos.deletePedido);

routes.post("/enderecos", authenticateToken, enderecoController.criarEndereco);
routes.get("/enderecos", authenticateToken, enderecoController.listarEnderecos);
routes.put("/enderecos/:id", authenticateToken, enderecoController.atualizarEndereco);
routes.delete("/enderecos/:id", authenticateToken, enderecoController.deletarEndereco);

routes.post("/rodizio/abrir", rodizioController.abrirRodizio);
routes.post("/rodizio/adicionar-item", rodizioController.adicionarItem);
routes.get("/rodizio/itens/:rodizioId", rodizioController.listarItens);
routes.post("/rodizio/fechar", rodizioController.encerrarSessao);
routes.get("/rodizio/todos", rodizioController.todosRodizios);
routes.patch("/rodizio/item/:id", rodizioController.atualizarStatusItem);







module.exports = routes;
