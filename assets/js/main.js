/* =========================================================
   TORAL — interacciones del sitio
   ========================================================= */

/* ---- CONFIGURACIÓN -------------------------------------------------
   Reemplaza WHATSAPP_NUMBER por el número real de TORAL en formato
   internacional, sin "+", espacios ni guiones. Ej: 56912345678
--------------------------------------------------------------------- */
const CONFIG = {
  WHATSAPP_NUMBER: "56934594694",
  WHATSAPP_DEFAULT_MESSAGE: "Hola TORAL, me gustaría cotizar un proyecto.",
};

(function () {
  "use strict";

  const waUrl = (text) =>
    `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  /* Año en el footer */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* Enlaces de WhatsApp */
  document.querySelectorAll(".js-whatsapp").forEach((a) => {
    a.href = waUrl(a.dataset.waMessage || document.body.dataset.waMessage || CONFIG.WHATSAPP_DEFAULT_MESSAGE);
  });

  /* Header al hacer scroll */
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menú móvil */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const setNav = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };
  toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setNav(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setNav(false); });

  /* Sección activa en el menú */
  const navLinks = [...nav.querySelectorAll('ul a[href^="#"]')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* Animaciones de aparición */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Video del hero: se reproduce solo (silenciado) en computador y celular.
     - En celulares usa una versión vertical liviana (1,9 MB).
     - Los navegadores móviles solo permiten la reproducción automática si el video
       está silenciado y "en línea", por eso se fuerzan muted y playsinline.
     - Si el teléfono la bloquea (por ejemplo, iPhone en modo de bajo consumo), se
       vuelve a intentar con el primer toque o desplazamiento; mientras tanto se ve
       la imagen fija, sin botón de play (ver CSS).
     - No se carga con "ahorro de datos" ni si el usuario pidió reducir movimiento. */
  const heroVideo = document.querySelector(".hero-video[data-src]");
  if (heroVideo) {
    const saveData = navigator.connection && navigator.connection.saveData;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!saveData && !reduce) {
      const v = heroVideo;
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.setAttribute("webkit-playsinline", "");

      const tryPlay = () => {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      };
      let started = false;
      const startVideo = () => {
        if (started) return;
        started = true;
        const mobile = window.matchMedia("(max-width: 767px)").matches && v.dataset.srcMobile;
        v.preload = "auto";
        v.src = mobile ? v.dataset.srcMobile : v.dataset.src;
        v.load();
        tryPlay();
      };
      v.addEventListener("canplay", () => { if (v.paused) tryPlay(); });
      v.addEventListener("playing", () => v.classList.add("is-playing"));

      // Empieza al terminar de cargar la página (o a los 1,5 s, lo que ocurra primero)
      if (document.readyState === "complete") startVideo();
      else {
        window.addEventListener("load", startVideo, { once: true });
        setTimeout(startVideo, 1500);
      }

      // Reintento con la primera interacción (necesario en algunos teléfonos)
      const retry = () => {
        startVideo();
        if (v.paused) tryPlay();
        if (!v.paused) ["touchstart", "click", "scroll", "keydown"].forEach((ev) => window.removeEventListener(ev, retry));
      };
      ["touchstart", "click", "scroll", "keydown"].forEach((ev) =>
        window.addEventListener(ev, retry, { passive: true })
      );
      // Al volver a la pestaña, retomar
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && v.paused && started) tryPlay();
      });
    }
  }

  /* Pestañas de servicios */
  const tabs = [...document.querySelectorAll('.tab-list [role="tab"]')];
  const activateTab = (tab, focus) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); activateTab(next, true); }
    });
  });
  /* Las tarjetas "Ver especialidades" abren la pestaña correspondiente */
  document.querySelectorAll(".card-link[data-tab]").forEach((link) => {
    link.addEventListener("click", () => {
      const tab = tabs.find((t) => t.dataset.tab === link.dataset.tab);
      if (tab) activateTab(tab);
    });
  });

  /* Filtro de proyectos */
  const filters = document.querySelectorAll(".filter");
  const projects = [...document.querySelectorAll(".project")];
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      projects.forEach((p) => {
        const show = f === "all" || p.dataset.cat.split(" ").includes(f);
        p.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* Lightbox */
  const lb = document.getElementById("lightbox");
  if (lb) {
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  let current = 0;
  let lastFocus = null;
  const visibleLinks = () => projects.filter((p) => !p.classList.contains("is-hidden")).map((p) => p.querySelector(".project-link"));
  const show = (i) => {
    const links = visibleLinks();
    current = (i + links.length) % links.length;
    const link = links[current];
    lbImg.src = link.href;
    lbImg.alt = link.querySelector("img").alt;
    lbCap.textContent = link.dataset.caption || "";
  };
  const openLb = (i) => {
    lastFocus = document.activeElement;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  };
  const closeLb = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  projects.forEach((p) => {
    p.querySelector(".project-link").addEventListener("click", (e) => {
      e.preventDefault();
      openLb(visibleLinks().indexOf(e.currentTarget));
    });
  });
  lb.querySelector(".lb-close").addEventListener("click", closeLb);
  lb.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => show(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  }

  /* Botones que preseleccionan el tipo de servicio en el formulario */
  const serviceSelect = document.getElementById("servicio");
  if (serviceSelect) {
    document.querySelectorAll("[data-service]").forEach((btn) => {
      btn.addEventListener("click", () => { serviceSelect.value = btn.dataset.service; });
    });
  }

  /* Formulario → WhatsApp */
  const form = document.getElementById("contact-form");
  if (!form) return;
  const errorBox = form.querySelector(".form-error");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const ok = field.type === "checkbox" ? field.checked : field.value.trim() !== "";
      field.classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });
    const email = form.elements.email;
    if (email.value && !email.checkValidity()) { email.classList.add("is-invalid"); valid = false; }
    errorBox.hidden = valid;
    if (!valid) return;

    const d = Object.fromEntries(new FormData(form));
    const lines = [
      "Hola TORAL, quiero solicitar una cotización.",
      "",
      `*Nombre:* ${d.nombre}`,
      `*Teléfono:* ${d.telefono}`,
      d.email ? `*Correo:* ${d.email}` : null,
      d.comuna ? `*Comuna/ubicación:* ${d.comuna}` : null,
      `*Tipo de proyecto:* ${d.servicio}`,
      "",
      `*Proyecto:* ${d.mensaje}`,
    ].filter((l) => l !== null);
    window.open(waUrl(lines.join("\n")), "_blank", "noopener");
  });
  form.querySelectorAll("input, textarea").forEach((f) =>
    f.addEventListener(f.type === "checkbox" ? "change" : "input", () => f.classList.remove("is-invalid"))
  );
})();
