//============================
//IMPORT produtosData.js
//============================
import produtosData from "./produtosData.js";
// ===========================
// ELEMENTOS DO DOM
// ===========================
const links = document.querySelectorAll(".menu a");
const sections = document.querySelector(".sections");
const panels = document.querySelectorAll(".panel");
const arrows = document.querySelectorAll(".arrow");
// ===========================
// MAPEAMENTO DE SEÇÕES
// ===========================
// Cria um mapa de ID -> Index para navegação consistente
const sectionMap = new Map();
panels.forEach((panel, index) => {
  sectionMap.set(panel.id, index);
});
// ===========================
// ESTADO DA APLICAÇÃO
// ===========================
let currentIndex = 0;
const totalPanels = panels.length;
// ===========================
// FUNÇÕES PRINCIPAIS
// ===========================
/**
 * Navega para uma seção específica
 * @param {number} index - Índice da seção (0-4)
 */
function goToSection(index) {
  if (!Number.isInteger(index)) return;
  if (index < 0 || index >= totalPanels) return;

  currentIndex = index;

  // Animação de transição
  sections.style.transform = `translateX(-${index * 100}vw)`;

  // Atualiza menu ativo
  updateActiveMenu();

  // Atualiza visibilidade das setas
  updateArrows();

  // Atualiza URL (opcional, para histórico)
  updateURL();
}
/**
 * Navega para uma seção pelo ID
 * @param {string} sectionId - ID da seção (ex: 'produtos', 'lentes')
 */
function goToSectionById(sectionId) {
  const index = sectionMap.get(sectionId);
  if (index !== undefined) {
    goToSection(index);
  }
}
/**
 * Atualiza o link ativo no menu
 */
function updateActiveMenu() {
  links.forEach((link, i) => {
    if (i === currentIndex) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
}
/**
 * Atualiza a visibilidade das setas de navegação
 */
function updateArrows() {
  panels.forEach((panel, index) => {
    const prev = panel.querySelector(".arrow-prev");
    const next = panel.querySelector(".arrow-next");

    if (prev) {
      prev.style.display = index === 0 ? "none" : "block";
    }
    if (next) {
      next.style.display = index === totalPanels - 1 ? "none" : "block";
    }
  });
}
/**
 * Atualiza a URL sem recarregar a página
 */
function updateURL() {
  if (!panels[currentIndex]) return;

  const sectionId = panels[currentIndex].id;
  if (history.pushState) {
    history.pushState(null, null, `#${sectionId}`);
  }
}

/**
 * Navega para a próxima seção
 */
function nextSection() {
  goToSection(currentIndex + 1);
}
/**
 * Navega para a seção anterior
 */
function prevSection() {
  goToSection(currentIndex - 1);
}
// ===========================
// EVENT LISTENERS - MENU
// ===========================
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    // 👉 Se não for navegação por índice, não intercepta
    if (!link.dataset.index) {
      return;
    }

    e.preventDefault();

    const index = Number(link.dataset.index);

    if (Number.isNaN(index)) return;

    goToSection(index);
  });
});

// ===========================
// EVENT LISTENERS - LINKS INTERNOS (BOTÕES DO BANNER)
// ===========================
// Intercepta TODOS os links internos da página que começam com #
document.addEventListener("click", (e) => {
  const target = e.target.closest("a[href^='#']");

  if (target) {
    const href = target.getAttribute("href");

    // Ignora se for link do WhatsApp ou externo
    if (href.includes("wa.me") || href.includes("http")) {
      return;
    }

    // Pega o ID da seção (remove o #)
    const sectionId = href.replace("#", "");

    // Se a seção existe no nosso mapa, intercepta o clique
    if (sectionMap.has(sectionId)) {
      e.preventDefault();
      goToSectionById(sectionId);
    }
  }
});
// ===========================
// EVENT LISTENERS - SETAS
// ===========================
arrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    if (arrow.dataset.go === "next") {
      nextSection();
    } else {
      prevSection();
    }
  });
});
// ===========================
// NAVEGAÇÃO POR TECLADO
// ===========================
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
    case "ArrowDown":
      e.preventDefault();
      nextSection();
      break;
    case "ArrowLeft":
    case "ArrowUp":
      e.preventDefault();
      prevSection();
      break;
    case "Home":
      e.preventDefault();
      goToSection(0);
      break;
    case "End":
      e.preventDefault();
      goToSection(totalPanels - 1);
      break;
  }
});
// ===========================
// SUPORTE TOUCH/SWIPE MOBILE
// ===========================
let touchStartX = 0;
let touchEndX = 0;
const minSwipeDistance = 50;
sections.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);
sections.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  { passive: true },
);
function handleSwipe() {
  const swipeDistance = touchStartX - touchEndX;

  if (swipeDistance > minSwipeDistance) {
    nextSection();
  } else if (swipeDistance < -minSwipeDistance) {
    prevSection();
  }
}
// ===========================
// NAVEGAÇÃO POR SCROLL (OPCIONAL)
// ===========================
let isScrolling = false;
sections.addEventListener(
  "wheel",
  (e) => {
    if (isScrolling) return;

    e.preventDefault();
    isScrolling = true;

    if (e.deltaY > 0) {
      nextSection();
    } else {
      prevSection();
    }

    setTimeout(() => {
      isScrolling = false;
    }, 1000);
  },
  { passive: false },
);
// ===========================
// INICIALIZAÇÃO NA HASH URL
// ===========================
function initFromHash() {
  const hash = window.location.hash.replace("#", "");

  if (hash && sectionMap.has(hash)) {
    goToSectionById(hash);
    return;
  }

  goToSection(0);
}
// ===========================
// HISTÓRICO DO NAVEGADOR
// ===========================
window.addEventListener("popstate", () => {
  initFromHash();
});
// ===========================
// SLIDER DO BANNER HOME
// ===========================
// Dados dos slides
const slidesData = [
  {
    title: "LOOK 2026",
    headline: "Sua Nova Identidade Visual",
    description: `Descubra os modelos que vão transformar seu estilo. Óculos premium com até 40% de desconto.`,
    primaryBtn: "ver loja",
    primaryLink: "#produtos",
    secondaryBtn: "comprar",
    secondaryLink:
      "https://wa.me/5511963208855?text=Quero conhecer a coleção LOOK 2026!",
  },
  {
    title: "PROMOÇÃO",
    headline: "Até 50% OFF em Armações",
    description: `Aproveite descontos imperdíveis nas melhores marcas. Estoque limitado!`,
    primaryBtn: "ver ofertas",
    primaryLink: "#produtos",
    secondaryBtn: "comprar agora",
    secondaryLink:
      "https://wa.me/5511963208855?text=Quero aproveitar a promoção!",
  },
  {
    title: "NOVIDADES",
    headline: "Coleção Exclusiva",
    description: `Modelos únicos, importados e com estilo incomparável. Seja o primeiro a usar!`,
    primaryBtn: "conhecer",
    primaryLink: "#produtos",
    secondaryBtn: "encomendar",
    secondaryLink:
      "https://wa.me/5511963208855?text=Quero a coleção exclusiva!",
  },
];
let currentSlide = 0;
// FUNÇÃO CORRIGIDA - Verifica se os elementos existem antes de atualizar
function updateBanner(index) {
  const slide = slidesData[index];

  // IMPORTANTE: Só atualiza se os elementos existirem (estamos na home)
  const titleEl = document.querySelector(".banner-title");
  const headlineEl = document.querySelector(".banner-headline");
  const descEl = document.querySelector(".banner-description");
  const primaryBtn = document.querySelector(".btn-primary-banner");
  const secondaryBtn = document.querySelector(".btn-secondary-banner");

  if (!titleEl || !headlineEl || !descEl) {
    // Elementos não existem, não estamos na home
    return;
  }

  titleEl.textContent = slide.title;
  headlineEl.textContent = slide.headline;
  descEl.textContent = slide.description;

  if (primaryBtn && secondaryBtn) {
    primaryBtn.textContent = slide.primaryBtn;
    primaryBtn.href = slide.primaryLink;
    secondaryBtn.textContent = slide.secondaryBtn;
    secondaryBtn.href = slide.secondaryLink;
  }

  // Atualiza indicadores
  document.querySelectorAll(".indicator").forEach((ind, i) => {
    ind.classList.toggle("active", i === index);
  });
}
// Event listeners para os indicadores
document.querySelectorAll(".indicator").forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    currentSlide = index;
    updateBanner(currentSlide);
  });
});
// Event listeners para as setas do banner
const bannerArrowLeft = document.querySelector(".banner-arrow-left");
const bannerArrowRight = document.querySelector(".banner-arrow-right");
if (bannerArrowLeft) {
  bannerArrowLeft.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita conflito com navegação de seções
    currentSlide = (currentSlide - 1 + slidesData.length) % slidesData.length;
    updateBanner(currentSlide);
  });
}
if (bannerArrowRight) {
  bannerArrowRight.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita conflito com navegação de seções
    currentSlide = (currentSlide + 1) % slidesData.length;
    updateBanner(currentSlide);
  });
}
// Auto-play do slider (10 segundos)
setInterval(() => {
  // Só roda se estamos na home (index 0)
  if (currentIndex === 0) {
    currentSlide = (currentSlide + 1) % slidesData.length;
    updateBanner(currentSlide);
  }
}, 10000);
// ===========================
// MODAL DE PRODUTOS
// ===========================
// Dados completos dos produtos (EDITE AQUI PARA ADICIONAR/MODIFICAR PRODUTOS)

// ===========================
// GERAÇÃO AUTOMÁTICA DE CARDS
// ===========================
function gerarCards() {
  // Gera cards para seção PRODUTOS
  const containerProdutos = document.querySelector("#produtos .content-box");
  const tituloEDescricaoProdutos = containerProdutos.innerHTML; // Preserva título e descrição

  // Gera cards para seção LENTES
  const containerLentes = document.querySelector("#lentes .content-box");
  const tituloEDescricaoLentes = containerLentes.innerHTML; // Preserva título e descrição

  // Limpa apenas os produtos, mantendo título e descrição
  const produtosAntigos = containerProdutos.querySelectorAll(".produto");
  produtosAntigos.forEach((p) => p.remove());

  const lentesAntigas = containerLentes.querySelectorAll(".produto");
  lentesAntigas.forEach((l) => l.remove());

  // Gera cards dinamicamente
  Object.entries(produtosData).forEach(([id, produto]) => {
    const card = document.createElement("article");
    card.className = "produto";
    card.setAttribute("data-produto", id);

    // HTML do card
    card.innerHTML = `
 <div class="produto-imagem">
 <img src="${produto.imagem}" alt="${produto.nome}" />
 ${produto.badge ? `<span class="produto-badge" style="background: ${produto.badgeColor || "#ff5722"}">${produto.badge}</span>` : ""}
 </div>
 <div class="produto-conteudo">
 <h3>${produto.nome}</h3>
 <div class="produto-rating">
 <span class="estrelas">${produto.rating}</span>
 </div>
 <p>${produto.descricaoCard}</p>
 <div class="produto-precos">
 <span class="preco-antigo">de ${produto.precoAntigo}</span>
 <span class="preco-atual">${produto.precoAtual}</span>
 </div>
 <button class="btn-ver-detalhes">ver detalhes</button>
 </div>
 `;

    // Adiciona o card na seção correta
    if (produto.secao === "produtos") {
      containerProdutos.appendChild(card);
    } else if (produto.secao === "lentes") {
      containerLentes.appendChild(card);
    }

    // Event listener para abrir modal
    const btnDetalhes = card.querySelector(".btn-ver-detalhes");
    btnDetalhes.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirModal(id);
    });
  });
}
// Elementos do modal
const modalOverlay = document.getElementById("modalOverlay");
const modalProduto = document.getElementById("modalProduto");
const modalClose = document.getElementById("modalClose");
const modalTitulo = document.getElementById("modalTitulo");
const modalNome = document.getElementById("modalNome");
const modalDescricao = document.getElementById("modalDescricao");
const modalImagemPrincipal = document.getElementById("modalImagemPrincipal");
const modalMiniaturas = document.getElementById("modalMiniaturas");
const modalRating = document.getElementById("modalRating");
const modalPrecoAntigo = document.getElementById("modalPrecoAntigo");
const modalPrecoAtual = document.getElementById("modalPrecoAtual");
const modalDesconto = document.getElementById("modalDesconto");
const modalCaracteristicas = document.getElementById("modalCaracteristicas");
const modalBtnComprar = document.getElementById("modalBtnComprar");
// Função para abrir modal
function abrirModal(produtoId) {
  const produto = produtosData[produtoId];

  if (!produto) return;

  // Preenche os dados do modal
  modalTitulo.textContent = produto.nome;
  modalNome.textContent = produto.nome;
  modalDescricao.textContent = produto.descricaoCompleta; // Usa descrição completa
  modalRating.textContent = produto.rating;
  modalPrecoAntigo.textContent = `de ${produto.precoAntigo}`;
  modalPrecoAtual.textContent = `por ${produto.precoAtual}`;
  modalDesconto.textContent = produto.desconto;

  // Atualiza imagem principal
  modalImagemPrincipal.src = produto.imagens[0];
  modalImagemPrincipal.alt = produto.nome;

  // Cria miniaturas
  modalMiniaturas.innerHTML = "";
  produto.imagens.forEach((img, index) => {
    const miniatura = document.createElement("div");
    miniatura.className = `miniatura ${index === 0 ? "active" : ""}`;
    miniatura.innerHTML = `<img src="${img}" alt="${produto.nome}">`;
    miniatura.addEventListener("click", () => {
      modalImagemPrincipal.src = img;
      document
        .querySelectorAll(".miniatura")
        .forEach((m) => m.classList.remove("active"));
      miniatura.classList.add("active");
    });
    modalMiniaturas.appendChild(miniatura);
  });

  // Preenche características
  modalCaracteristicas.innerHTML = "";
  produto.caracteristicas.forEach((caract) => {
    const li = document.createElement("li");
    li.textContent = caract;
    modalCaracteristicas.appendChild(li);
  });

  // Atualiza link do WhatsApp
  const whatsappUrl = `https://wa.me/${produto.whatsapp}?text=${encodeURIComponent(produto.mensagem)}`;

  modalBtnComprar.href = whatsappUrl;

  // Mostra modal
  modalOverlay.classList.add("active");
  modalProduto.classList.add("active");
  document.body.style.overflow = "hidden";
}
// Função para fechar modal
function fecharModal() {
  modalOverlay.classList.remove("active");
  modalProduto.classList.remove("active");
  document.body.style.overflow = "";
}
// Event listener para fechar modal ao clicar no X
modalClose.addEventListener("click", fecharModal);
// Event listener para fechar modal ao clicar no overlay
modalOverlay.addEventListener("click", fecharModal);
// Fechar modal com tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalProduto.classList.contains("active")) {
    fecharModal();
  }
});
// Previne fechar modal ao clicar dentro dele
modalProduto.addEventListener("click", (e) => {
  e.stopPropagation();
});
// ===========================
// INICIALIZAÇÃO
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  gerarCards(); // Gera os cards automaticamente
  initFromHash();
  updateArrows();
});
