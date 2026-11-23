// ===== Optimized Main Script =====
(function () {
  "use strict";

  // Configuration
  const CONFIG = {
    scrollThreshold: 50,
    scrollToTopThreshold: 300,
    socialBarOpacity: {
      mobile: { visible: 1, hidden: 0.8, threshold: 60 },
      desktop: { visible: 1, hidden: 0.7, threshold: 100 },
    },
    selectors: {
      header: ".header",
      contactForm: "#contact-form",
      successMessage: "#success-msg",
      menuToggle: ".menu-toggle",
      navMenu: ".nav-menu",
      socialBar: ".social-bar-simple",
      scrollToTop: ".scroll-to-top",
      loader: "#loader-overlay",
    },
  };

  // ===== Utility Functions =====
  const utils = {
    throttle(fn, delay) {
      let timeoutId;
      let lastExecTime = 0;
      return function (...args) {
        const currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
          fn.apply(this, args);
          lastExecTime = currentTime;
        } else {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => fn.apply(this, args), delay);
        }
      };
    },
    exists(selector) {
      return document.querySelector(selector) !== null;
    },
    getElement(selector) {
      return document.querySelector(selector);
    },
    addEvent(element, event, handler, options = {}) {
      if (element) element.addEventListener(event, handler, options);
    },
  };

  // Removed old ContactFormHandler class to avoid conflict with new form handler below

  // ===== Header Scroll Handler =====
  class HeaderHandler {
    constructor() {
      this.header = utils.getElement(CONFIG.selectors.header);
      this.init();
    }
    init() {
      if (!this.header) return;
      const throttledScroll = utils.throttle(this.handleScroll.bind(this), 16);
      utils.addEvent(window, "scroll", throttledScroll, { passive: true });
    }
    handleScroll() {
      const scrolled = window.scrollY > CONFIG.scrollThreshold;
      this.header.classList.toggle("scrolled", scrolled);
    }
  }

  // ===== Mobile Navigation Handler =====
  class MobileNavHandler {
    constructor() {
      this.menuToggle = utils.getElement(CONFIG.selectors.menuToggle);
      this.navMenu = utils.getElement(CONFIG.selectors.navMenu);
      this.init();
    }
    init() {
      if (!this.menuToggle || !this.navMenu) return;
      utils.addEvent(this.menuToggle, "click", this.toggleMenu.bind(this));
      this.setupMenuLinks();
    }
    toggleMenu() {
      const isOpen = this.navMenu.classList.contains("open");
      this.navMenu.classList.toggle("open");
      this.menuToggle.setAttribute("aria-expanded", !isOpen);
    }
    closeMenu() {
      this.navMenu.classList.remove("open");
      this.menuToggle.setAttribute("aria-expanded", "false");
    }
    setupMenuLinks() {
      const links = this.navMenu.querySelectorAll("a");
      links.forEach((link) => {
        utils.addEvent(link, "click", () => {
          if (this.navMenu.classList.contains("open")) this.closeMenu();
        });
      });
    }
  }

  // ===== Smooth Scroll Handler =====
  class SmoothScrollHandler {
    constructor() { this.init(); }
    init() {
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach((link) => {
        utils.addEvent(link, "click", this.handleClick.bind(this));
      });
    }
    handleClick(e) {
      const targetId = e.currentTarget.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = utils.getElement(CONFIG.selectors.header)?.offsetHeight || 80;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  }

  // ===== Scroll to Top Button Handler =====
  class ScrollToTopHandler {
    constructor() {
      this.button = this.createButton();
      this.init();
    }
    createButton() {
      let button = utils.getElement(CONFIG.selectors.scrollToTop);
      if (!button) {
        button = document.createElement("button");
        button.className = "scroll-to-top";
        button.setAttribute("aria-label", "Scroll to top");
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(button);
      }
      return button;
    }
    init() {
      if (!this.button) return;
      utils.addEvent(this.button, "click", this.scrollToTop.bind(this));
      const throttledScroll = utils.throttle(this.handleScroll.bind(this), 100);
      utils.addEvent(window, "scroll", throttledScroll, { passive: true });
      utils.addEvent(window, "resize", this.updatePosition.bind(this));
      this.updatePosition();
      this.handleScroll();
    }
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    handleScroll() {
      const shouldShow = window.scrollY > CONFIG.scrollToTopThreshold;
      this.button.style.display = shouldShow ? "flex" : "none";
    }
    updatePosition() {
      Object.assign(this.button.style, {
        right: "20px", left: "", bottom: "20px",
        transform: "", width: "50px", height: "50px", fontSize: "1.2em",
      });
    }
  }

  // ===== Social Bar Handler =====
  class SocialBarHandler {
    constructor() {
      this.socialBar = utils.getElement(CONFIG.selectors.socialBar);
      this.init();
    }
    init() {
      if (!this.socialBar) return;
      utils.addEvent(window, "resize", this.updatePosition.bind(this));
      const throttledScroll = utils.throttle(this.handleScroll.bind(this), 100);
      utils.addEvent(window, "scroll", throttledScroll, { passive: true });
      this.updatePosition();
    }
    updatePosition() {
      const isMobile = window.innerWidth <= 600;
      if (isMobile) {
        Object.assign(this.socialBar.style, {
          position: "fixed", top: "", left: "50%", bottom: "0",
          transform: "translateX(-50%)", flexDirection: "row",
          padding: "8px 12px", borderRadius: "12px 12px 0 0",
        });
      } else {
        Object.assign(this.socialBar.style, {
          position: "fixed", top: "50%", left: "12px", bottom: "",
          transform: "translateY(-50%)", flexDirection: "column",
          padding: "13px 7px", borderRadius: "9px",
        });
      }
    }
    handleScroll() {
      const isMobile = window.innerWidth <= 600;
      const config = isMobile ? CONFIG.socialBarOpacity.mobile : CONFIG.socialBarOpacity.desktop;
      const opacity = window.scrollY > config.threshold ? config.visible : config.hidden;
      this.socialBar.style.opacity = opacity;
    }
  }

  // ===== Loader Handler =====
  class LoaderHandler {
    constructor() {
      this.loader = utils.getElement(CONFIG.selectors.loader);
      this.init();
    }
    init() {
      if (!this.loader) return;
      if (document.readyState === "loading") {
        utils.addEvent(window, "load", this.hideLoader.bind(this));
      } else {
        this.hideLoader();
      }
    }
    hideLoader() {
      if (!this.loader) return;
      this.loader.classList.add("hide");
      setTimeout(() => {
        if (this.loader.parentNode) this.loader.parentNode.removeChild(this.loader);
      }, 700);
    }
  }

  // ===== Language Switcher =====
  function setupLanguageSwitcher() {
    // ... (سيب نفس الكود بتاع الترجمة اللي عندك من غير تغيير)
  }

  // ===== WebMCP Support Handler =====
  class WebMcpHandler {
    constructor() {
      this.init();
    }
    init() {
      const webMcpContext = {
        name: "nbig-website-assistant",
        description: "Exposes real estate search, contact submit, and project filter tools directly to the browser AI.",
        tools: [
          {
            name: "search",
            description: "Search projects, services, or pages on the website by keyword.",
            inputSchema: {
              type: "object",
              properties: {
                query: { type: "string", description: "Search query keyword." }
              },
              required: ["query"]
            },
            execute: async (args) => {
              const query = args.query.toLowerCase();
              console.log("[WebMCP] Search called with query:", query);
              const projects = [
                { id: "sky-hills", name: "Sky Hills", type: "Residential", url: "sky-hills.html" },
                { id: "zayed-hills", name: "Zayed Hills", type: "Residential", url: "zayed-hills.html" },
                { id: "lamar-residence", name: "Lamar Residence", type: "Residential", url: "lamar-residence.html" },
                { id: "cmc", name: "New CMC", type: "Medical", url: "cmc.html" },
                { id: "cmc-2", name: "CMC 2", type: "Medical", url: "cmc-2.html" },
                { id: "new-cmc", name: "New CMC", type: "Medical", url: "new-cmc.html" },
                { id: "prime", name: "Prime Med", type: "Medical", url: "prime.html" }
              ];
              const results = projects.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.type.toLowerCase().includes(query)
              );
              return {
                success: true,
                results: results,
                message: results.length ? `Found ${results.length} matching projects.` : "No projects matched your search query."
              };
            }
          },
          {
            name: "contact_form",
            description: "Submit a contact message directly to the NBIG Developments team.",
            inputSchema: {
              type: "object",
              properties: {
                name: { type: "string", description: "Your full name." },
                email: { type: "string", description: "Your email address." },
                phone: { type: "string", description: "Your phone number." },
                message: { type: "string", description: "Your message content." }
              },
              required: ["name", "email", "phone"]
            },
            execute: async (args) => {
              console.log("[WebMCP] Contact Form submitted via AI:", args);
              const formData = new FormData();
              formData.append("name", args.name);
              formData.append("email", args.email);
              formData.append("number", args.phone);
              formData.append("message", args.message || "");
              try {
                const response = await fetch("send_email.php", {
                  method: "POST",
                  body: formData
                });
                const data = await response.json();
                return { success: data.success, message: data.message };
              } catch (err) {
                return { success: false, message: "Failed to send message due to network connection issues." };
              }
            }
          },
          {
            name: "project_lookup",
            description: "Get detailed information about a specific project.",
            inputSchema: {
              type: "object",
              properties: {
                projectId: { 
                  type: "string", 
                  enum: ["sky-hills", "zayed-hills", "lamar-residence", "cmc", "cmc-2", "new-cmc", "prime"],
                  description: "The project slug identifier." 
                }
              },
              required: ["projectId"]
            },
            execute: async (args) => {
              const id = args.projectId;
              console.log("[WebMCP] Project lookup:", id);
              const projectData = {
                "sky-hills": { name: "Sky Hills", type: "Residential", location: "October Gardens", features: "Premium residential compound, elegant modern finishes, lush landscapes, 24/7 security." },
                "zayed-hills": { name: "Zayed Hills", type: "Residential", location: "Sheikh Zayed City", features: "Premium residential compound, next to Mazar Mall, gated community, private parking." },
                "lamar-residence": { name: "Lamar Residence", type: "Residential", location: "Sheikh Zayed City", features: "Boutique apartments, elegant modern finishes, high-security gate." },
                "cmc": { name: "New CMC", type: "Medical", location: "6th of October City", features: "Premier medical tower, fully finished clinics, 24/7 power backup, high ROI." },
                "cmc-2": { name: "CMC 2", type: "Medical", location: "6th of October City", features: "Next-gen smart medical suites, dedicated parking, state-of-the-art diagnostics." },
                "new-cmc": { name: "New CMC", type: "Medical", location: "October Gardens", features: "Smart-medical hub, next to main roads, central waiting reception lobby." },
                "prime": { name: "Prime Med", type: "Medical", location: "October Gardens", features: "Smart technology medical hub, compliant with medical standards, central reception, private parking." }
              };
              return {
                success: !!projectData[id],
                data: projectData[id] || null,
                message: projectData[id] ? `Details loaded for ${projectData[id].name}` : "Project not found."
              };
            }
          },
          {
            name: "navigation",
            description: "Scroll to a specific section on the page.",
            inputSchema: {
              type: "object",
              properties: {
                section: { 
                  type: "string", 
                  enum: ["home", "services", "portfolio", "about", "contact"], 
                  description: "Section anchor id to navigate to." 
                }
              },
              required: ["section"]
            },
            execute: async (args) => {
              const sectionId = args.section;
              console.log("[WebMCP] Navigation scrolling to:", sectionId);
              const element = document.getElementById(sectionId);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                return { success: true, message: `Scrolled to section: ${sectionId}` };
              }
              return { success: false, message: `Section with ID #${sectionId} not found on this page.` };
            }
          },
          {
            name: "property_filtering",
            description: "Filter shown projects in the UI by category.",
            inputSchema: {
              type: "object",
              properties: {
                category: { 
                  type: "string", 
                  enum: ["all", "medical", "residential"], 
                  description: "Category to filter by." 
                }
              },
              required: ["category"]
            },
            execute: async (args) => {
              const cat = args.category.toLowerCase();
              console.log("[WebMCP] Filtering portfolio by:", cat);
              const items = document.querySelectorAll(".pc");
              if (items.length) {
                items.forEach(item => {
                  const catText = item.querySelector(".pc-cat")?.textContent.toLowerCase() || "";
                  if (cat === "all") {
                    item.style.display = "block";
                  } else if (cat === "medical" && catText.includes("med")) {
                    item.style.display = "block";
                  } else if (cat === "residential" && catText.includes("res")) {
                    item.style.display = "block";
                  } else {
                    item.style.display = "none";
                  }
                });
                return { success: true, message: `Portfolio filtered to ${cat}.` };
              }
              return { success: false, message: "No portfolio section found to filter on this page." };
            }
          },
          {
            name: "booking_requests",
            description: "Register a request to book a consultation or viewing for a project.",
            inputSchema: {
              type: "object",
              properties: {
                projectId: { type: "string", description: "Project of interest (e.g. 'sky-hills')." },
                name: { type: "string", description: "Consultant client name." },
                phone: { type: "string", description: "Consultant client phone number." }
              },
              required: ["projectId", "name", "phone"]
            },
            execute: async (args) => {
              console.log("[WebMCP] Consultation Booking request:", args);
              const formData = new FormData();
              formData.append("name", args.name);
              formData.append("email", "booking-system@new-build-egypt.com");
              formData.append("number", args.phone);
              formData.append("message", `AUTOMATED WEBMCP BOOKING REQUEST:\nInterested in project: ${args.projectId}`);
              try {
                const response = await fetch("send_email.php", {
                  method: "POST",
                  body: formData
                });
                const data = await response.json();
                return { success: data.success, message: `Booking inquiry registered. ${data.message}` };
              } catch (err) {
                return { success: false, message: "Consultation request failed due to connectivity." };
              }
            }
          }
        ]
      };

      if (typeof navigator !== "undefined" && navigator.modelContext && typeof navigator.modelContext.provideContext === "function") {
        try {
          navigator.modelContext.provideContext(webMcpContext);
          console.log("[WebMCP] Registered context and tools with browser agent successfully.");
        } catch (err) {
          console.warn("[WebMCP] provideContext failed:", err);
        }
      } else {
        window.webMcpRegistry = webMcpContext;
        console.log("[WebMCP] Navigator context unavailable. Bound tools to window.webMcpRegistry for sandbox testing.");
      }
    }
  }

  // ===== Main Application =====
  class App {
    constructor() { this.init(); }
    init() {
      try {
        // Commenting out old ContactFormHandler to avoid conflicts
        // new ContactFormHandler();
        new HeaderHandler();
        new MobileNavHandler();
        new SmoothScrollHandler();
        new ScrollToTopHandler();
        new SocialBarHandler();
        new LoaderHandler();
        setupLanguageSwitcher();
        new WebMcpHandler();
        console.log("NBIG Website initialized successfully");

        // Fix fetch URL to send_email.php instead of send_email_simple.php
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const successMsg = document.getElementById('success-msg');
            const errorMsg = document.getElementById('error-msg');
            const loadingMsg = document.getElementById('loading-msg');

            function hideAll() {
              if (successMsg) successMsg.style.display = 'none';
              if (errorMsg) errorMsg.style.display = 'none';
              if (loadingMsg) loadingMsg.style.display = 'none';
            }
            function showLoading() {
              if (loadingMsg) loadingMsg.style.display = 'block';
            }

            hideAll();
            showLoading();

            const formData = new FormData(contactForm);
            fetch('send_email.php', {
              method: 'POST',
              body: formData
            })
            .then(res => res.json())
            .then(data => {
              hideAll();
              if (data.success) {
                if (successMsg) {
                  successMsg.textContent = data.message;
                  successMsg.style.display = 'block';
                }
                contactForm.reset();
              } else {
                if (errorMsg) {
                  errorMsg.textContent = data.message;
                  errorMsg.style.display = 'block';
                }
              }
            })
            .catch(() => {
              hideAll();
              if (errorMsg) {
                errorMsg.textContent = 'حدث خطأ في الاتصال!';
                errorMsg.style.display = 'block';
              }
            });
          });
        }
      } catch (error) {
        console.warn("Some features may not work correctly:", error);
      }
    }
  }

  // ===== Auto-initialize when DOM is ready =====
  function initApp() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => new App());
    } else {
      new App();
    }
  }
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form') || document.getElementById('contactForm');
  const successMsg = document.getElementById('success-msg') || document.getElementById('formResult');
  const errorMsg = document.getElementById('error-msg') || document.getElementById('formResult');
  const loadingMsg = document.getElementById('loading-msg') || { style: {} };

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      hideAll();
      showLoading();
      const formData = new FormData(contactForm);

      fetch('send_email.php', {  // Changed from send_email_simple.php to send_email.php
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        hideAll();
        if (data.success) {
          if (successMsg) {
            successMsg.textContent = data.message;
            successMsg.style.display = 'block';
          }
          contactForm.reset();
        } else {
          if (errorMsg) {
            errorMsg.textContent = data.message;
            errorMsg.style.display = 'block';
          }
        }
      })
      .catch(() => {
        hideAll();
        if (errorMsg) {
          errorMsg.textContent = 'حدث خطأ في الاتصال!';
          errorMsg.style.display = 'block';
        }
      });
    });
  }

  function hideAll() {
    if (successMsg && successMsg.style) successMsg.style.display = 'none';
    if (errorMsg && errorMsg.style) errorMsg.style.display = 'none';
    if (loadingMsg && loadingMsg.style) loadingMsg.style.display = 'none';
  }
  function showLoading() {
    if (loadingMsg && loadingMsg.style) loadingMsg.style.display = 'block';
  }
});
  initApp();
})();

