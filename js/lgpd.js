// ===========================
// SISTEMA LGPD - COOKIES
// ===========================

/**
 * Gerenciador de Consentimento LGPD
 * Bloqueia navegação até o usuário aceitar/rejeitar cookies
 */

const LGPD = {
    // Configurações
    config: {
        storageKey: 'otica_showroom_lgpd_consent',
        expiryDays: 365
    },

    // Elementos DOM
    elements: {
        overlay: null,
        banner: null,
        btnAceitar: null,
        btnRejeitar: null
    },

    /**
     * Inicializa o sistema LGPD
     */
    init() {
        this.createElements();
        this.checkConsent();
        this.bindEvents();
    },

    /**
     * Cria os elementos HTML do banner
     */
    createElements() {
        // Cria overlay
        const overlay = document.createElement('div');
        overlay.className = 'lgpd-overlay';
        overlay.id = 'lgpdOverlay';

        // Cria banner
        const banner = document.createElement('div');
        banner.className = 'lgpd-banner';
        banner.id = 'lgpdBanner';
        banner.innerHTML = `
            <div class="lgpd-content">
                <div class="lgpd-texto">
                    <h3>🍪 Nós usamos cookies</h3>
                    <p>
                        Utilizamos cookies essenciais para melhorar sua experiência em nosso site. 
                        Ao continuar navegando, você concorda com nossa 
                        <a href="termos.html" target="_blank">Política de Privacidade</a> e 
                        com o uso de cookies conforme a LGPD.
                    </p>
                </div>
                <div class="lgpd-acoes">
                    <button class="lgpd-btn lgpd-btn-aceitar" id="lgpdAceitar">
                        Aceitar
                    </button>
                    <button class="lgpd-btn lgpd-btn-rejeitar" id="lgpdRejeitar">
                        Rejeitar
                    </button>
                </div>
            </div>
        `;

        // Adiciona ao body
        document.body.appendChild(overlay);
        document.body.appendChild(banner);

        // Armazena referências
        this.elements.overlay = overlay;
        this.elements.banner = banner;
        this.elements.btnAceitar = document.getElementById('lgpdAceitar');
        this.elements.btnRejeitar = document.getElementById('lgpdRejeitar');
    },

    /**
     * Verifica se o usuário já deu consentimento
     */
    checkConsent() {
        const consent = this.getConsent();

        if (consent === null) {
            // Usuário ainda não decidiu - mostra banner e bloqueia
            this.showBanner();
            this.blockNavigation();
        } else if (consent === true) {
            // Usuário aceitou - libera navegação
            this.enableNavigation();
        } else {
            // Usuário rejeitou - libera navegação mas não salva dados
            this.enableNavigation();
        }
    },

    /**
     * Obtém o consentimento armazenado
     * @returns {boolean|null} true = aceitou, false = rejeitou, null = não decidiu
     */
    getConsent() {
        const stored = localStorage.getItem(this.config.storageKey);
        
        if (stored === null) return null;
        
        try {
            const data = JSON.parse(stored);
            // Verifica se não expirou
            if (data.expiry && new Date().getTime() > data.expiry) {
                localStorage.removeItem(this.config.storageKey);
                return null;
            }
            return data.consent;
        } catch (e) {
            return null;
        }
    },

    /**
     * Salva o consentimento
     * @param {boolean} consent - true = aceito, false = rejeitado
     */
    setConsent(consent) {
        const data = {
            consent: consent,
            timestamp: new Date().toISOString(),
            expiry: new Date().getTime() + (this.config.expiryDays * 24 * 60 * 60 * 1000)
        };

        localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    },

    /**
     * Mostra o banner e overlay
     */
    showBanner() {
        this.elements.overlay.classList.add('active');
        this.elements.banner.classList.add('active');
    },

    /**
     * Esconde o banner e overlay
     */
    hideBanner() {
        this.elements.overlay.classList.remove('active');
        this.elements.banner.classList.remove('active');
    },

    /**
     * Bloqueia navegação (adiciona pointer-events: none)
     */
    blockNavigation() {
        // Bloqueia menu
        const menu = document.querySelector('.menu');
        if (menu) menu.style.pointerEvents = 'none';

        // Bloqueia setas
        const arrows = document.querySelectorAll('.arrow');
        arrows.forEach(arrow => arrow.style.pointerEvents = 'none');

        // Bloqueia links internos
        const links = document.querySelectorAll('a:not(.lgpd-texto a)');
        links.forEach(link => link.style.pointerEvents = 'none');

        // Bloqueia scroll e swipe
        const sections = document.querySelector('.sections');
        if (sections) {
            sections.style.pointerEvents = 'none';
        }

        // Bloqueia botões do banner home
        const bannerBtns = document.querySelectorAll('.btn-banner');
        bannerBtns.forEach(btn => btn.style.pointerEvents = 'none');

        // Desativa navegação por teclado
        document.body.classList.add('lgpd-blocked');
    },

    /**
     * Libera navegação
     */
    enableNavigation() {
        // Libera menu
        const menu = document.querySelector('.menu');
        if (menu) menu.style.pointerEvents = '';

        // Libera setas
        const arrows = document.querySelectorAll('.arrow');
        arrows.forEach(arrow => arrow.style.pointerEvents = '');

        // Libera links
        const links = document.querySelectorAll('a');
        links.forEach(link => link.style.pointerEvents = '');

        // Libera sections
        const sections = document.querySelector('.sections');
        if (sections) {
            sections.style.pointerEvents = '';
        }

        // Libera botões do banner
        const bannerBtns = document.querySelectorAll('.btn-banner');
        bannerBtns.forEach(btn => btn.style.pointerEvents = '');

        // Reativa navegação por teclado
        document.body.classList.remove('lgpd-blocked');
    },

    /**
     * Vincula eventos aos botões
     */
    bindEvents() {
        // Botão aceitar
        this.elements.btnAceitar.addEventListener('click', () => {
            this.handleAccept();
        });

        // Botão rejeitar
        this.elements.btnRejeitar.addEventListener('click', () => {
            this.handleReject();
        });

        // Previne fechar ao clicar no banner
        this.elements.banner.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Bloqueia navegação por teclado quando bloqueado
        document.addEventListener('keydown', (e) => {
            if (document.body.classList.contains('lgpd-blocked')) {
                const blockedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
                if (blockedKeys.includes(e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }, true); // Usa capture para interceptar antes
    },

    /**
     * Trata aceitação de cookies
     */
    handleAccept() {
        this.setConsent(true);
        this.hideBanner();
        this.enableNavigation();
        
        // Analytics ou outros scripts podem ser inicializados aqui
        console.log('✅ Cookies aceitos pelo usuário');
    },

    /**
     * Trata rejeição de cookies
     */
    handleReject() {
        this.setConsent(false);
        this.hideBanner();
        this.enableNavigation();
        
        // Remove cookies desnecessários se houver
        console.log('❌ Cookies rejeitados pelo usuário');
    },

    /**
     * Reseta o consentimento (útil para testes)
     */
    reset() {
        localStorage.removeItem(this.config.storageKey);
        location.reload();
    }
};

// ===========================
// INICIALIZAÇÃO
// ===========================

// Aguarda o DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        LGPD.init();
    });
} else {
    LGPD.init();
}

// Expõe globalmente para debug (remover em produção se desejar)
window.LGPD = LGPD;