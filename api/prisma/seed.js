const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {


  const produtos = [
    { nome: "Sushi Misto", descricao: "Variedade de sushis tradicionais e especiais", preco: 59.90, estoque: 50, imagemurl: "https://www.sushicome.com/cdn/shop/files/1006.png?v=1734453006&width=480", categoria: "COMIDA" },
    { nome: "Temaki Salmão", descricao: "Cone com salmão fresco", preco: 19.90, estoque: 100, imagemurl: "https://mareriopescados.com.br/uploads/receitas/20eb01205effe035dd9cd5c40e047207.jpg", categoria: "COMIDA" },
    { nome: "Coca-Cola Lata", descricao: "350ml gelada", preco: 6.00, estoque: 200, imagemurl: "https://res.cloudinary.com/piramides/image/upload/c_fill,h_564,w_395/v1/products/3716-coca-cola-lata-350ml-normal-12un.20251024104230.png?_a=BAAAV6GX", categoria: "BEBIDA" },
    { nome: "Yakissoba Frango", descricao: "Macarrão com frango e legumes", preco: 29.90, estoque: 75, imagemurl: "https://www.seara.com.br/wp-content/uploads/2025/09/Yakisoba-de-frango-G.jpg", categoria: "COMIDA" },
    { nome: "Sorvete Matcha", descricao: "Chá verde especial", preco: 12.90, estoque: 40, imagemurl: "https://i0.wp.com/pratofundo.com/wp-content/uploads/receita-sorvete-matcha-cha-verde002.jpg?resize=700%2C1036&quality=85&strip=all&ssl=1", categoria: "SOBREMESA" },

    { nome: "Guioza", descricao: "Porção com 6 unidades", preco: 17.90, estoque: 60, imagemurl: "https://www.receiteria.com.br/wp-content/uploads/guioza.jpeg", categoria: "COMIDA" },
    { nome: "Suco de Laranja", descricao: "Natural e fresco", preco: 9.90, estoque: 90, imagemurl: "https://veja.abril.com.br/wp-content/uploads/2024/02/suco-laranja.jpg?crop=1&resize=1212,909", categoria: "BEBIDA" },
    { nome: "Tempurá", descricao: "Legumes empanados", preco: 22.50, estoque: 30, imagemurl: "https://www.seara.com.br/wp-content/uploads/2025/09/R0625-SP-tempura-de-camarao-na-airfryer-com-molho-tentsuyu-1200x675-1.webp", categoria: "COMIDA" },
    { nome: "Milkshake Oreo", descricao: "Cremoso com pedaços de Oreo", preco: 18.00, estoque: 25, imagemurl: "https://sweetlycakes.com/wp-content/uploads/2022/07/milkshakeoreo-9-1024x1536.jpg", categoria: "SOBREMESA" },
    { nome: "Água Mineral", descricao: "Sem gás", preco: 4.00, estoque: 150, imagemurl: "https://fortatacadista.vteximg.com.br/arquivos/ids/294008-1000-1000/7898196700179.jpg?v=637625572165270000", categoria: "BEBIDA" },

    { nome: "Sashimi Salmão", descricao: "8 fatias de salmão fresco", preco: 34.90, estoque: 40, imagemurl: "https://cloudfront-us-east-1.images.arcpublishing.com/estadao/T3ZTKKAUR5HWDJB3PYQE5DRT5Q.jpg", categoria: "COMIDA" },
    { nome: "Sushi Hot Roll", descricao: "8 unidades empanadas", preco: 26.90, estoque: 45, imagemurl: "https://espaconatelie.com.br/wp-content/uploads/2024/07/hot-roll.jpg", categoria: "COMIDA" },
    { nome: "Refrigerante Guaraná", descricao: "350ml", preco: 5.50, estoque: 180, imagemurl: "https://carrefourbrfood.vtexassets.com/arquivos/ids/8969235/refrigerante-guarana-antarctica-350ml-1.jpg?v=637364778200030000", categoria: "BEBIDA" },
    { nome: "Brownie", descricao: "Com chocolate meio amargo", preco: 11.50, estoque: 35, imagemurl: "https://moinhoglobo.com.br/wp-content/uploads/2016/02/51-Brownie-scaled.jpg", categoria: "SOBREMESA" },
    { nome: "Suco de Uva", descricao: "Integral", preco: 12.00, estoque: 70, imagemurl: "https://conteudo.imguol.com.br/c/entretenimento/cd/2020/04/28/suco-de-uva-1588091947594_v2_450x450.jpg", categoria: "BEBIDA" },

    { nome: "Ramen Tradicional", descricao: "Caldo rico com noodles frescos", preco: 32.90, estoque: 55, imagemurl: "https://guiadacozinha.com.br/wp-content/uploads/2023/03/lamen-tradicional.jpg", categoria: "COMIDA" },
    { nome: "Temaki Atum", descricao: "Cone com atum fresco", preco: 21.90, estoque: 80, imagemurl: "https://djapa.com.br/wp-content/uploads/2019/11/temaki-atum.jpg", categoria: "COMIDA" },
    { nome: "Chá Verde Gelado", descricao: "Muito refrescante", preco: 7.90, estoque: 110, imagemurl: "https://minervafoods.com/wp-content/uploads/2022/12/cha_verde_com_gengibre-1.jpg", categoria: "BEBIDA" },
    { nome: "Pudim", descricao: "Com calda de caramelo", preco: 9.50, estoque: 50, imagemurl: "https://www.seara.com.br/wp-content/uploads/2025/09/desktop-pudim-de-leite-1.png", categoria: "SOBREMESA" },
    { nome: "Suco de Limão", descricao: "Natural", preco: 8.50, estoque: 85, imagemurl: "https://www.sabornamesa.com.br/media/k2/items/cache/1f9467ed0ebd32e9dc822d63c55d5401_XL.jpg", categoria: "BEBIDA" },

  ];

  for (const produto of produtos) {
    await prisma.product.create({ data: produto });
  }

  console.log("Seed de produtos OK!");

  const hoje = new Date();
  const mais30 = new Date();
  mais30.setDate(hoje.getDate() + 30);

  const cupons = [
    { codigo: "PROMO10", tipo: "PORCENTAGEM", desconto: 10, minimo: 50, descricao: "10% OFF pedidos acima de R$ 50", validade: mais30, ativo: true },
    { codigo: "SUSHILOVER", tipo: "PORCENTAGEM", desconto: 15, minimo: 80, descricao: "15% OFF especial sushi", validade: mais30, ativo: true },
    { codigo: "FRETEGRATIS", tipo: "FIXO", desconto: 8, minimo: 40, descricao: "Desconto equivalente ao frete médio", validade: mais30, ativo: true },
    { codigo: "MATCHA5", tipo: "FIXO", desconto: 5, minimo: 20, descricao: "R$ 5 OFF em sobremesas", validade: mais30, ativo: true },
    { codigo: "BEBIDA3", tipo: "FIXO", desconto: 3, minimo: 15, descricao: "R$ 3 OFF em bebidas", validade: mais30, ativo: true },
    { codigo: "YAKI20", tipo: "PORCENTAGEM", desconto: 20, minimo: 70, descricao: "20% OFF no Yakissoba", validade: mais30, ativo: false },
    { codigo: "NOVOUSUARIO", tipo: "PORCENTAGEM", desconto: 12, minimo: 30, descricao: "Cupom para novos usuários", validade: mais30, ativo: true },
    { codigo: "RAMEN7", tipo: "FIXO", desconto: 7, minimo: 30, descricao: "Desconto especial no ramen", validade: mais30, ativo: false },
    { codigo: "FINALDOMES", tipo: "PORCENTAGEM", desconto: 10, minimo: 60, descricao: "Promoção mensal", validade: mais30, ativo: true },
    { codigo: "DOCES2", tipo: "FIXO", desconto: 2, minimo: 10, descricao: "Desconto pequeno para sobremesas", validade: mais30, ativo: true }
  ];

  for (const cupom of cupons) {
    await prisma.cupom.create({ data: cupom });
  }

  console.log("Seed de cupons OK!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
