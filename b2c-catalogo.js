// Catálogos oficiais Nespresso consultados em 22/10/2026.
// Coleções e perfis do Brasil; seis fotos complementadas pelos sites PT, IE e MX.
// Perfis aromáticos resumidos; dados comerciais cadastrados são preservados.
const COLECOES_B2C = {
  "Original": [
    [
      "limited",
      "Edição Limitada",
      "Sabores especiais para descobrir novas experiências.",
      "capsule-range-limited-edition"
    ],
    [
      "origins",
      "Master Origins",
      "Cafés que revelam o cultivo e os métodos de suas origens.",
      "capsule-range-MasterOrigin"
    ],
    [
      "italiana",
      "Ispirazione Italiana",
      "Torra e personalidade inspiradas na tradição italiana.",
      "capsule-range-ispirazione-italiana"
    ],
    [
      "espresso",
      "Espresso",
      "A experiência clássica de um espresso de 40 ml.",
      "capsule-range-espressos"
    ],
    [
      "barista",
      "Barista Creations",
      "Perfis aromatizados e cafés para receitas com leite.",
      "capsules-range-barista-creations"
    ],
    [
      "world",
      "World Explorations",
      "Uma viagem pelas culturas de café ao redor do mundo.",
      "capsule-range-world-explorations"
    ],
    [
      "selections",
      "Seleções Especiais",
      "Kits e combinações para explorar a linha Original.",
      "capsule-range-assortment"
    ],
    [
      "gifts",
      "Sugestão de Presente",
      "Combinações para presentear.",
      "capsule-suggestions"
    ],
    [
      "outros",
      "Outros",
      "Mais cafés da linha Original.",
      ""
    ]
  ],
  "Vertuo": [
    [
      "limited",
      "Edição Limitada",
      "Sabores especiais para descobrir novas experiências.",
      "capsule-range-limited-edition-vertuo"
    ],
    [
      "origins",
      "Master Origins",
      "Cafés de origem com preparos de 150 ml a 230 ml.",
      "capsule-range-MasterOrigin-vertuo"
    ],
    [
      "espresso",
      "Espresso",
      "Cremosos e intensos, em uma xícara de 40 ml.",
      "capsule-range-espresso-vertuo"
    ],
    [
      "ristretto",
      "Ristretto",
      "Uma experiência curta e marcante de 25 ml.",
      "capsule-range-espressos-vertuo-ristretto-sub"
    ],
    [
      "double",
      "Double Espresso",
      "Dois espressos em um preparo de 80 ml.",
      "capsule-range-double-espresso-vertuo"
    ],
    [
      "barista",
      "Barista Creations",
      "Perfis aromatizados e cafés para receitas com leite.",
      "capsule-range-barista-creations-vertuo"
    ],
    [
      "gran",
      "Gran Lungo",
      "Mais tempo para apreciar seu café de 150 ml.",
      "capsule-range-gran-lungo-vertuo"
    ],
    [
      "signature",
      "Signature",
      "Cafés de 230 ml para prolongar a pausa.",
      "capsule-range-Mug-vertuo"
    ],
    [
      "craft",
      "Craft Brew",
      "Preparos maiores, de 355 ml a 535 ml.",
      "capsule-range-craft-brew-vertuo"
    ],
    [
      "selections",
      "Seleções Especiais",
      "Kits e combinações para explorar a linha Vertuo.",
      "capsule-range-vertuo-gift-suggestions"
    ],
    [
      "outros",
      "Outros",
      "Mais cafés da linha Vertuo.",
      ""
    ]
  ]
};
const CATALOGO_OFICIAL_B2C = {
  "Original:7946.90": {
    "name": "Buenos Aires Lungo",
    "category": "world",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653500481566/buenos-aires-lungo-2x.png",
    "notes": "Pipoca e cereal adocicado.",
    "intensity": 4,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7948.90": {
    "name": "Cape Town Lungo",
    "category": "world",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653513130014/cape-town-lungo-2x.png",
    "notes": "Especiarias e caramelo, perfil potente.",
    "intensity": 10,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7961.90": {
    "name": "Capriccio",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653514899486/capriccio-2x.png",
    "notes": "Cereais e acidez em equilíbrio.",
    "intensity": 5,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7964.90": {
    "name": "Caramello",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17431332945950/C-1061-Responsive-PLP.png",
    "notes": "Caramelo em textura cremosa.",
    "intensity": null,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7968.90": {
    "name": "Ciocolatto",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17431322361886/C-1060-Responsive-PLP.png",
    "notes": "Chocolate em textura cremosa.",
    "intensity": null,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7969.90": {
    "name": "Cosi",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/15762785566750/cosi.png",
    "notes": "Cítricos e cereal, perfil leve.",
    "intensity": 4,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7928.90": {
    "name": "Ispirazione Firenze Arpeggio",
    "category": "italiana",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653366034462/arpeggio-2x.png",
    "notes": "Cacau em textura aveludada.",
    "intensity": 9,
    "size": "25 ml / 40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7943.90": {
    "name": "Ispirazione Firenze Arpeggio Decaffeinato",
    "category": "italiana",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/34682651541534/arpeggio-decaffeinato-plp.png",
    "notes": "Textura cremosa e toque de cacau.",
    "intensity": 9,
    "size": "25 ml / 40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7984.90": {
    "name": "Ispirazione Napoli",
    "category": "italiana",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653931806750/ispirazione-napoli-2x.png",
    "notes": "Cacau e madeira, torra marcante.",
    "intensity": 13,
    "size": "25 ml / 40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7972.90": {
    "name": "Ispirazione Palermo Kazaar",
    "category": "italiana",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653942259742/kazaar-2x.png",
    "notes": "Especiarias e torra potente.",
    "intensity": 12,
    "size": "25 ml / 40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7987.90": {
    "name": "Ispirazione Ristretto Italiano",
    "category": "italiana",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16467720470558/ispirazione-ristretto-italiano-XL.png",
    "notes": "Frutado intenso, com torra presente.",
    "intensity": 10,
    "size": "25 ml / 40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7980.90": {
    "name": "Ispirazione Ristretto Italiano Decaffeinato",
    "category": "italiana",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/34682663632926/ristretto-decaffeinato-plp.png",
    "notes": "Torra intensa com perfil frutado.",
    "intensity": 10,
    "size": "25 ml / 40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7985.90": {
    "name": "Ispirazione Roma",
    "category": "italiana",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653932462110/ispirazione-roma-2x.png",
    "notes": "Cereais, madeira e doçura equilibrada.",
    "intensity": 8,
    "size": "25 ml / 40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7979.90": {
    "name": "Ispirazione Torino Livanto",
    "category": "italiana",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653944487966/livanto-2x.png",
    "notes": "Caramelo, cereal e acidez em harmonia.",
    "intensity": 7,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7986.90": {
    "name": "Ispirazione Venezia",
    "category": "italiana",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653932789790/ispirazione-venezia-2x.png",
    "notes": "Doçura densa, com acidez discreta.",
    "intensity": 8,
    "size": "25 ml / 40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7923.90": {
    "name": "Lisbon Bica",
    "category": "limited",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/30234256965662.png",
    "notes": "Especiarias e frutas secas, perfil intenso.",
    "intensity": 10,
    "size": "25 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original",
    "imageSource": "https://www.nespresso.com/pt/pt/order/capsules/original/lisbon-bica-capsulas-cafe"
  },
  "Original:7894.90": {
    "name": "Master Origin - Brazil Organic",
    "category": "origins",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/15762787401758/C-1021-ResponsivePLPImage.png",
    "notes": "Malte e caramelo no perfil doce.",
    "intensity": 7,
    "size": "40 ml / 110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7929.90": {
    "name": "Master Origin - Colombia",
    "category": "origins",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653527384094/colombia-2x.png",
    "notes": "Frutas vermelhas de colheita tardia.",
    "intensity": 6,
    "size": "40 ml / 110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7977.90": {
    "name": "Master Origin - India",
    "category": "origins",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653744439326/india-2x.png",
    "notes": "Especiarias em corpo licoroso.",
    "intensity": 11,
    "size": "40 ml / 110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7975.90": {
    "name": "Master Origin - Indonesia",
    "category": "origins",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16653745881118/indonesia-2x.png",
    "notes": "Madeira; processamento por descascamento úmido.",
    "intensity": 8,
    "size": "40 ml / 110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7973.90": {
    "name": "Master Origin - Nicaragua",
    "category": "origins",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16654090272798/nicaragua-2x.png",
    "notes": "Doçura de mel; processamento Black Honey.",
    "intensity": 5,
    "size": "40 ml / 110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7937.90": {
    "name": "Nocciola",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17432559943710/C-1063-Responsive-PLP.png",
    "notes": "Avelã, cereal e biscoito.",
    "intensity": null,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7965.90": {
    "name": "Paris Espresso",
    "category": "world",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16724971225118/paris-2x.png",
    "notes": "Cítricos e cereal, perfil delicado.",
    "intensity": 6,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7880.90": {
    "name": "Rio Espresso",
    "category": "world",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16654101577758/rio-de-janeiro-2x.png",
    "notes": "Arábicas brasileiros; textura intensa, aveludada.",
    "intensity": 9,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7981.90": {
    "name": "Scuro",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16654104068126/scuro-2x.png",
    "notes": "Torra equilibrada, pensado para leite.",
    "intensity": null,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7947.90": {
    "name": "Shanghai Lungo",
    "category": "world",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16724973486110/shangai-lungo-2x.png",
    "notes": "Cítricos, frutas vermelhas e doçura.",
    "intensity": 5,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7926.90": {
    "name": "Stockholm Lungo",
    "category": "world",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16724841758750/stockholm-lungo-2x.png",
    "notes": "Malte, corpo e doçura natural.",
    "intensity": 8,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7936.90": {
    "name": "Tokyo Lungo",
    "category": "world",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16724845232158/tokyo-lungo-2x.png",
    "notes": "Flores brancas com acidez sutil.",
    "intensity": 6,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7933.90": {
    "name": "Vaniglia",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17432222531614/C-1062-Responsive-PLP.png",
    "notes": "Baunilha com cremosidade.",
    "intensity": null,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7988.90": {
    "name": "Vaniglia Decaffeinato",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/44327065813022/C-1324-OL-PLP-320x320.png",
    "notes": "Perfil cremoso de baunilha, sem cafeína.",
    "intensity": null,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7959.90": {
    "name": "Vienna Lungo",
    "category": "world",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16724849066014/vienna-lungo-2x.png",
    "notes": "Malte e doçura equilibrada.",
    "intensity": 6,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7962.90": {
    "name": "Vienna Lungo Decaffeinato",
    "category": "world",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/33381856575518/vienna-lungo-decaf-2x.png",
    "notes": "Doçura e malte, sem cafeína.",
    "intensity": 6,
    "size": "110 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7983.90": {
    "name": "Volluto",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16724852604958/volluto-2x.png",
    "notes": "Biscoito adocicado e frescor frutado.",
    "intensity": 4,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Original:7932.90": {
    "name": "Volluto Decaffeinato",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/34682639351838/volluto-decaffeinato-plp.png",
    "notes": "Acidez frutada e biscoito doce.",
    "intensity": 4,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/original"
  },
  "Vertuo:7048.80": {
    "name": "Altissio",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17190297239582/altissio-2x.png",
    "notes": "Cacau, cremosidade e corpo.",
    "intensity": 9,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7000.80": {
    "name": "Altissio Decaffeinato",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17190297796638/altissio-decaffeinato-2x.png",
    "notes": "Cacau e corpo, sem cafeína.",
    "intensity": 9,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7001.80": {
    "name": "Alto Ambrato",
    "category": "craft",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/26427418312734/C-1094-alto-ambrato-PLPimage320320.png",
    "notes": "Delicadeza com sugestão de mel.",
    "intensity": 4,
    "size": "355 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7038.80": {
    "name": "Alto Onice",
    "category": "craft",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/26427415986206/C-1095-alto-onice-PLPimage320320.png",
    "notes": "Torra presente e caráter amadeirado.",
    "intensity": 7,
    "size": "355 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7093.80": {
    "name": "Arondio",
    "category": "gran",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17190300778526/arondio-2x.png",
    "notes": "Cereais com suavidade.",
    "intensity": 6,
    "size": "150 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7092.80": {
    "name": "Bianco Doppio",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17190300844062/bianco-doppio-2x.png",
    "notes": "Caramelo e cereal, pensado para leite.",
    "intensity": null,
    "size": "80 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7030.80": {
    "name": "Bianco Forte",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17452696895518/C-0290-ResponsivePLPImage.png",
    "notes": "Cereal tostado, pensado para leite.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7006.80": {
    "name": "Carafe Pour-Over Style",
    "category": "craft",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299762282526/carafe-pour-over-style-intense-2x.png",
    "notes": "Aromático e delicado, para compartilhar.",
    "intensity": null,
    "size": "535 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7087.80": {
    "name": "Cinnamon Apple Crisp",
    "category": "limited",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/51138868674590/C-1403-VL-Responsive-plp.png",
    "notes": "Maçã acompanhada de canela.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo",
    "imageSource": "https://www.nespresso.com/pt/pt/order/capsules/vertuo/capsula-cafe-cinnamon-apple-crisp"
  },
  "Vertuo:7049.80": {
    "name": "Diavolitto",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17200619192350/diavolitto-2x.png",
    "notes": "Torra potente e caráter amadeirado.",
    "intensity": 11,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7045.80": {
    "name": "Double Espresso Chiaro",
    "category": "double",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17200613589022/chiaro-2x.png",
    "notes": "Madeira, equilíbrio e acidez sutil.",
    "intensity": 8,
    "size": "80 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7279.80": {
    "name": "Double Espresso Chiaro Decaffeinato",
    "category": "double",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/34710541402142/double-espresso-chiaro-decaffeinato-plp.png",
    "notes": "Torra de cereais e madeira.",
    "intensity": 8,
    "size": "80 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7085.80": {
    "name": "Double Espresso Dolce",
    "category": "double",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17200621944862/dolce-2x.png",
    "notes": "Malte e cereais em harmonia.",
    "intensity": 5,
    "size": "80 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7298.80": {
    "name": "Double Espresso Scuro",
    "category": "double",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299753631774/scuro-2x.png",
    "notes": "Cacau cremoso e toque de baunilha.",
    "intensity": 11,
    "size": "80 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7059.80": {
    "name": "Fortado",
    "category": "gran",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17201088299038/fortado-2x.png",
    "notes": "Madeira e cacau, corpo intenso.",
    "intensity": 8,
    "size": "150 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7015.80": {
    "name": "Fortado Decaffeinato",
    "category": "gran",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17201088626718/fortado-decaffeinato-2x.png",
    "notes": "Cacau e madeira, sem cafeína.",
    "intensity": 8,
    "size": "150 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7283.80": {
    "name": "Gingerbread",
    "category": "limited",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/16418077278238/C-0961-Desktop-Standard-2000x2000.png",
    "notes": "Cereais e picância aromática.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo",
    "imageSource": "https://www.nespresso.com/ie/en/order/capsules/vertuo/gingerbread-vertuo-coffee-pods"
  },
  "Vertuo:7295.80": {
    "name": "Golden Caramel",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17452249612318/golden-caramel-2x.png",
    "notes": "Textura macia, cremosa e aveludada.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7090.80": {
    "name": "Gran Lungo Master Origin - Colômbia",
    "category": "origins",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17200621879326/colombia-2x.png",
    "notes": "Frutas vermelhas, vivacidade e corpo licoroso.",
    "intensity": 5,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7091.80": {
    "name": "Gran Lungo Master Origin - Costa Rica",
    "category": "origins",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17200617521182/costa-rica-2x.png",
    "notes": "Doçura de cereais; fermentação termal.",
    "intensity": 7,
    "size": "150 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7027.80": {
    "name": "Gran Lungo Master Origin - El Salvador",
    "category": "origins",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/26582353870878/el-salvador-2x.png",
    "notes": "Doçura que lembra geleia.",
    "intensity": 5,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7026.80": {
    "name": "Gran Lungo Master Origin - México",
    "category": "origins",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299416907806/mexico-2x.png",
    "notes": "Madeira e especiarias, corpo denso.",
    "intensity": 7,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7060.80": {
    "name": "IL Café",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299760513054/il-caffe-2x.png",
    "notes": "Torra de cereais com grande intensidade.",
    "intensity": 11,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7014.80": {
    "name": "Inizio",
    "category": "gran",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299124846622/inizio-2x.png",
    "notes": "Flores e cereais em perfil suave.",
    "intensity": 4,
    "size": "150 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7042.80": {
    "name": "Intenso",
    "category": "signature",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299413729310/intenso-2x.png",
    "notes": "Doçura que lembra açúcar mascavo.",
    "intensity": 9,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7076.80": {
    "name": "Maple Pecan",
    "category": "limited",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/30313833529374/C-1215-PLPimage-320-320.png",
    "notes": "Bordo doce e noz-pecã.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo",
    "imageSource": "https://www.nespresso.com/pt/pt/order/capsules/vertuo/capsula-cafe-maple-pecan-vertuo"
  },
  "Vertuo:7039.80": {
    "name": "Melozio",
    "category": "signature",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/44214260498462/melozio.png",
    "notes": "Mel e cereais em equilíbrio.",
    "intensity": 6,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7023.80": {
    "name": "Melozio Decaffeinato",
    "category": "signature",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/14446712553502/melozio-decaffeinato-XL.png",
    "notes": "Mel, cereais e cremosidade, sem cafeína.",
    "intensity": 6,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7041.80": {
    "name": "Odacio",
    "category": "signature",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299416973342/odacio-2x.png",
    "notes": "Cereais, fruta e acidez sutil.",
    "intensity": 7,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7036.80": {
    "name": "Orafio",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299417628702/orafio-2x.png",
    "notes": "Cereal com caramelo de torra.",
    "intensity": 6,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7273.80": {
    "name": "Peppermint Pinwheel",
    "category": "limited",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/13704796667934/Pepper-Standard-2000x2000.png",
    "notes": "Doçura com frescor de menta.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo",
    "imageSource": "https://www.nespresso.com/mx/en/order/capsules/vertuo/peppermint-pinwheel-vertuo-coffee-po"
  },
  "Vertuo:7072.80": {
    "name": "Pumpkin Spice Cake",
    "category": "limited",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299753566238/pumpkin-spice-cake-2x.png",
    "notes": "Aroma de abóbora.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo",
    "imageSource": "https://www.nespresso.com/pt/pt/order/capsules/vertuo/capsula-cafe-pumpkin-spice-cake-vertuo"
  },
  "Vertuo:7296.80": {
    "name": "Rich Chocolate",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17452242108446/rich-chocolate-2x.png",
    "notes": "Chocolate com textura cremosa.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7010.80": {
    "name": "Ristretto Clássico",
    "category": "ristretto",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/27750724108318/C-1131-ResponsivePLPImage.png",
    "notes": "Frutas e cereal tostado.",
    "intensity": 9,
    "size": "25 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7011.80": {
    "name": "Ristretto Intenso",
    "category": "ristretto",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/27750715260958.png",
    "notes": "Madeira e especiarias em destaque.",
    "intensity": 12,
    "size": "25 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7294.80": {
    "name": "Roasted Hazelnut",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17452241649694/roasted-hazelnut-2x.png",
    "notes": "Complexidade e riqueza no perfil.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7089.80": {
    "name": "Solelio",
    "category": "signature",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299753697310/solelio-2x.png",
    "notes": "Frutado suave com acidez viva.",
    "intensity": 2,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7088.80": {
    "name": "Stormio",
    "category": "signature",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/33724654813214/stormio-plp.png",
    "notes": "Especiarias e caráter amadeirado.",
    "intensity": 8,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7292.80": {
    "name": "Sweet Vanilia",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17452245155870/sweet-vanilla-2x.png",
    "notes": "Baunilha com textura cremosa.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7057.80": {
    "name": "Sweet Vanilia Decaffeinato",
    "category": "barista",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/34718154948638/C-1306-VL-Responsive-plp-image.png",
    "notes": "Cremosidade de baunilha, sem cafeína.",
    "intensity": null,
    "size": "230 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  },
  "Vertuo:7047.80": {
    "name": "Voltesso",
    "category": "espresso",
    "image": "https://www.nespresso.com/ecom/medias/sys_master/public/17299759890462/voltesso-2x.png",
    "notes": "Biscoito amanteigado, suavidade e doçura.",
    "intensity": 4,
    "size": "40 ml",
    "source": "https://www.nespresso.com/br/pt/order/capsules/vertuo"
  }
};
function normalizarTextoB2C(v) {
 return String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}
function sistemaB2C(p) {
 const s=normalizarTextoB2C(p.sistema);return s==='original'?'Original':s==='vertuo'?'Vertuo':'Outros';
}
function infoOficialB2C(p) {
 const sistema=sistemaB2C(p);
 const sku=String(p.sku || '').trim().replace(',','.').replace(/^(\d{4})(\d{2})$/,'$1.$2');
 const direto=CATALOGO_OFICIAL_B2C[sistema+':'+sku];if(direto)return direto;
 const nome=normalizarTextoB2C(p.nome);
 return Object.entries(CATALOGO_OFICIAL_B2C).find(([k,v])=>k.startsWith(sistema+':')&&normalizarTextoB2C(v.name)===nome)?.[1] || null;
}
function categoriaB2C(p) {
 const oficial=infoOficialB2C(p);if(oficial)return oficial.category;
 const texto=normalizarTextoB2C(p.nome+' '+(p.observacoes || ''));
 const defs=COLECOES_B2C[sistemaB2C(p)] || [];
 if(/edicao limitada|limited/.test(texto))return 'limited';
 for(const [slug,nome] of defs){if(normalizarTextoB2C(nome)!=='outros'&&texto.includes(normalizarTextoB2C(nome)))return slug;}
 return 'outros';
}
function fontesFotoB2C(p) {
 const oficial=infoOficialB2C(p)?.image;
 const atual=typeof obterFotoProdutoB2C==='function'?obterFotoProdutoB2C(p):p.foto;
 return [...new Set([oficial,atual].filter(Boolean))];
}
function intensidadeB2C(p) {
 const valor=Number(p.intensidade ?? infoOficialB2C(p)?.intensity);
 return valor>0&&Number.isFinite(valor)?valor:null;
}
