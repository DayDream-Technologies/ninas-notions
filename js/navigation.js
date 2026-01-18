/* ==========================================
   Nina's Notions - Navigation JavaScript
   ========================================== */

class Navigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.nav = document.querySelector('.header__nav');
    this.menuToggle = document.querySelector('.header__menu-toggle');
    this.navItems = document.querySelectorAll('.nav__item');
    this.lastScrollY = 0;
    this.ticking = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.nav?.classList.contains('is-open') && 
          !e.target.closest('.header__nav') && 
          !e.target.closest('.header__menu-toggle')) {
        this.closeMobileMenu();
      }
    });

    // Handle submenu toggles on mobile
    this.navItems.forEach(item => {
      const hasSubmenu = item.querySelector('.nav__submenu');
      if (hasSubmenu) {
        const link = item.querySelector('.nav__link');
        link?.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            item.classList.toggle('is-open');
          }
        });
      }
    });

    // Scroll handling
    window.addEventListener('scroll', () => {
      this.lastScrollY = window.scrollY;
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
        this.navItems.forEach(item => item.classList.remove('is-open'));
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.nav?.classList.contains('is-open')) {
        this.closeMobileMenu();
      }
    });

    // Handle nav link clicks (close menu on navigation)
    document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', (e) => {
        if (!link.parentElement.querySelector('.nav__submenu') || window.innerWidth > 768) {
          this.closeMobileMenu();
        }
      });
    });
  }

  toggleMobileMenu() {
    const isOpen = this.nav?.classList.toggle('is-open');
    this.menuToggle?.classList.toggle('is-active');
    this.menuToggle?.setAttribute('aria-expanded', isOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.nav?.classList.remove('is-open');
    this.menuToggle?.classList.remove('is-active');
    this.menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  handleScroll() {
    if (!this.header) return;

    // Add shadow on scroll
    if (this.lastScrollY > 10) {
      this.header.classList.add('is-scrolled');
    } else {
      this.header.classList.remove('is-scrolled');
    }

    // Hide/show header on scroll direction (optional - uncomment if wanted)
    // if (this.lastScrollY > this.prevScrollY && this.lastScrollY > 100) {
    //   this.header.classList.add('is-hidden');
    // } else {
    //   this.header.classList.remove('is-hidden');
    // }
    // this.prevScrollY = this.lastScrollY;
  }
}

// Navigation-specific styles (injected)
const navStyles = `
  /* Header */
  .header {
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    background: white;
    z-index: 100;
    transition: box-shadow var(--transition-base), transform var(--transition-base);
  }

  .header.is-scrolled {
    box-shadow: var(--shadow-md);
  }

  .header.is-hidden {
    transform: translateY(-100%);
  }

  .header__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--space-lg);
  }

  /* Logo */
  .header__logo {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: var(--font-accent);
    font-size: var(--text-2xl);
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .header__logo:hover {
    color: var(--color-primary-dark);
  }

  .header__logo-icon {
    width: 40px;
    height: 40px;
  }

  /* Navigation */
  .header__nav {
    display: flex;
    align-items: center;
  }

  .nav__list {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .nav__item {
    position: relative;
  }

  .nav__link {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    font-weight: 500;
    color: var(--color-charcoal);
    border-radius: var(--border-radius);
    transition: all var(--transition-fast);
  }

  .nav__link:hover,
  .nav__link.is-active {
    color: var(--color-primary);
    background-color: var(--color-cream);
  }

  .nav__link--has-submenu::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid currentColor;
    transition: transform var(--transition-fast);
  }

  .nav__item:hover .nav__link--has-submenu::after,
  .nav__item.is-open .nav__link--has-submenu::after {
    transform: rotate(180deg);
  }

  /* Submenu */
  .nav__submenu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 180px;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    padding: var(--space-sm) 0;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all var(--transition-fast);
  }

  .nav__item:hover .nav__submenu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .nav__submenu-link {
    display: block;
    padding: var(--space-sm) var(--space-lg);
    color: var(--color-charcoal);
    transition: all var(--transition-fast);
  }

  .nav__submenu-link:hover {
    color: var(--color-primary);
    background-color: var(--color-cream);
  }

  /* Header Actions */
  .header__actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  /* Mobile Menu Toggle */
  .header__menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--border-radius);
    transition: background-color var(--transition-fast);
  }

  .header__menu-toggle:hover {
    background-color: var(--color-cream);
  }

  .header__menu-toggle span {
    display: block;
    width: 24px;
    height: 2px;
    background-color: var(--color-charcoal);
    border-radius: 1px;
    transition: all var(--transition-fast);
  }

  .header__menu-toggle span:nth-child(1) {
    transform: translateY(-6px);
  }

  .header__menu-toggle span:nth-child(3) {
    transform: translateY(6px);
  }

  .header__menu-toggle.is-active span:nth-child(1) {
    transform: translateY(0) rotate(45deg);
  }

  .header__menu-toggle.is-active span:nth-child(2) {
    opacity: 0;
  }

  .header__menu-toggle.is-active span:nth-child(3) {
    transform: translateY(-2px) rotate(-45deg);
  }

  /* Mobile Navigation */
  @media (max-width: 768px) {
    .header__menu-toggle {
      display: flex;
    }

    .header__nav {
      position: fixed;
      top: var(--header-height);
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      padding: var(--space-xl);
      transform: translateX(-100%);
      transition: transform var(--transition-base);
      z-index: 100;
      overflow-y: auto;
    }

    .header__nav.is-open {
      transform: translateX(0);
    }

    .nav__list {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }

    .nav__item {
      border-bottom: 1px solid var(--color-light-gray);
    }

    .nav__link {
      padding: var(--space-md) 0;
      font-size: var(--text-lg);
      border-radius: 0;
    }

    .nav__submenu {
      position: static;
      box-shadow: none;
      padding: 0 0 var(--space-md) var(--space-lg);
      opacity: 1;
      visibility: visible;
      transform: none;
      display: none;
    }

    .nav__item.is-open .nav__submenu {
      display: block;
    }

    .nav__submenu-link {
      padding: var(--space-sm) 0;
    }
  }
`;

// Inject navigation styles
const navStyleSheet = document.createElement('style');
navStyleSheet.textContent = navStyles;
document.head.appendChild(navStyleSheet);

// Initialize navigation
document.addEventListener('DOMContentLoaded', () => {
  window.navigation = new Navigation();
});

