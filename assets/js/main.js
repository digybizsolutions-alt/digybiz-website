/*
 * DigyBiz — shared site script
 * Builds the header, footer and "Free Proposal" popup on every page,
 * renders icons, and sends lead forms to Google Sheets (via Apps Script).
 */
(function () {
  "use strict";

  var CFG = window.DIGYBIZ_CONFIG || {};

  /* ------------------------------------------------------------------
   * Icons (simple line icons, 24x24, drawn with currentColor)
   * ------------------------------------------------------------------ */
  var ICONS = {
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M2 14h2M20 14h2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 8a5 5 0 0 1 0 8M20 5a9 9 0 0 1 0 14"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    sparkles: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M17 5h4M5 17v4M3 19h4"/>',
    workflow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v3a3 3 0 0 0 3 3h6"/>',
    whatsapp: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="M12 15l-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
    trending: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16v-4M12 16V8M17 16v-7"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    store: '<path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    school: '<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    home: '<path d="M3 10l9-7 9 7v11h-6v-7H9v7H3z"/>',
    food: '<path d="M3 2v7a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V2M6 2v20M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3zm0 0v7"/>',
    dumbbell: '<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    play: '<path d="M6 4l14 8-14 8z" fill="currentColor"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5 5 0 0 1 6.2-.7l.5.3a2 2 0 0 0 1.4.3L21 4M3 3l1 1 6 6M21 13l-3 3"/>'
  };

  function icon(name, cls) {
    var body = ICONS[name] || "";
    return '<svg class="icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + "</svg>";
  }

  function renderIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      if (el.dataset.iconDone) return;
      el.innerHTML = icon(el.dataset.icon);
      el.dataset.iconDone = "1";
    });
  }

  /* DigyBiz "DB" mark, drawn as SVG so it stays sharp on dark backgrounds */
  var markCount = 0;
  function logoMark(cls) {
    var id = "dbg" + markCount++;
    return (
      '<svg class="' + (cls || "") + '" viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
      '<defs>' +
      '<linearGradient id="' + id + 'r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00E5FF"/><stop offset=".55" stop-color="#064DFF"/><stop offset="1" stop-color="#3A2BFF"/></linearGradient>' +
      '<linearGradient id="' + id + 't" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B04DFF"/><stop offset=".35" stop-color="#2F6BFF"/><stop offset="1" stop-color="#00E5FF"/></linearGradient>' +
      "</defs>" +
      '<circle cx="36" cy="32" r="24" fill="none" stroke="url(#' + id + 'r)" stroke-width="4" stroke-linecap="round" stroke-dasharray="122 29" transform="rotate(-150 36 32)"/>' +
      '<text x="37" y="41" text-anchor="middle" font-family="Manrope, Inter, sans-serif" font-weight="800" font-size="25" letter-spacing="-2" fill="url(#' + id + 't)">DB</text>' +
      '<rect x="8" y="17" width="5" height="5" rx="1" fill="#00C8FF"/>' +
      '<rect x="3" y="24" width="4" height="4" rx="1" fill="#2F6BFF"/>' +
      '<rect x="10" y="26" width="5" height="5" rx="1" fill="#00E5FF"/>' +
      '<rect x="0" y="31" width="4" height="4" rx="1" fill="#9B00FF"/>' +
      '<rect x="6" y="34" width="5" height="5" rx="1" fill="#064DFF"/>' +
      '<rect x="13" y="38" width="4" height="4" rx="1" fill="#8A2BFF"/>' +
      "</svg>"
    );
  }

  /* ------------------------------------------------------------------
   * Helpers for contact links
   * ------------------------------------------------------------------ */
  function waLink(message) {
    var num = String(CFG.WHATSAPP_NUMBER || "").replace(/\D/g, "");
    var text = encodeURIComponent(message || CFG.WHATSAPP_MESSAGE || "Hi DigyBiz!");
    return "https://wa.me/" + num + "?text=" + text;
  }
  function telLink() { return "tel:" + String(CFG.PHONE_DISPLAY || "").replace(/[^\d+]/g, ""); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ------------------------------------------------------------------
   * Services list (used by header dropdown and footer)
   * ------------------------------------------------------------------ */
  var SERVICES = [
    { id: "ai-lead-generation", name: "AI Lead Generation", icon: "target" },
    { id: "business-automation", name: "Business Automation", icon: "bot" },
    { id: "meta-ads", name: "Meta Ads & Social Promotions", icon: "megaphone" },
    { id: "content-creation", name: "Content Creation", icon: "pen" },
    { id: "copywriting", name: "Copywriting & Creatives", icon: "type" },
    { id: "video-editing", name: "Video Editing", icon: "video" },
    { id: "websites", name: "Websites & Landing Pages", icon: "monitor" },
    { id: "brand-promotion", name: "Brand Promotion", icon: "sparkles" }
  ];

  /* ------------------------------------------------------------------
   * Header
   * ------------------------------------------------------------------ */
  function buildHeader() {
    var host = document.getElementById("site-header");
    if (!host) return;
    host.className = "site-header";

    var dd = SERVICES.map(function (s) {
      return '<li><a href="services.html#' + s.id + '">' + icon(s.icon) + s.name + "</a></li>";
    }).join("");

    host.innerHTML =
      '<div class="container nav-wrap">' +
        '<a class="brand" href="index.html" aria-label="DigyBiz home">' + logoMark() +
          '<span class="brand-text">Digy<span>Biz</span></span></a>' +
        '<nav class="nav" id="primary-nav" aria-label="Main">' +
          '<ul class="nav-list">' +
            '<li><a href="index.html" data-nav="home">Home</a></li>' +
            '<li class="has-dropdown"><a href="services.html" data-nav="services">Services</a>' +
              '<button class="dd-toggle" type="button" aria-expanded="false" aria-label="Show services list">' + icon("chevron") + "</button>" +
              '<ul class="dropdown">' + dd + "</ul></li>" +
            '<li><a href="about.html" data-nav="about">About</a></li>' +
            '<li><a href="our-work.html" data-nav="work">Our Work</a></li>' +
            '<li><a href="contact.html" data-nav="contact">Contact</a></li>' +
          "</ul>" +
          '<button class="btn btn-primary btn-sm nav-cta" type="button" data-proposal>Get Free Proposal</button>' +
        "</nav>" +
        '<button class="menu-toggle" type="button" aria-controls="primary-nav" aria-expanded="false" aria-label="Open menu">' + icon("menu") + "</button>" +
      "</div>";

    // Highlight the current page
    var page = document.body.getAttribute("data-page");
    var active = host.querySelector('[data-nav="' + page + '"]');
    if (active) { active.classList.add("active"); active.setAttribute("aria-current", "page"); }

    // Mobile menu
    var nav = host.querySelector(".nav");
    var toggle = host.querySelector(".menu-toggle");
    function setMenu(open) {
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.innerHTML = icon(open ? "close" : "menu");
    }
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") || e.target.closest("[data-proposal]")) setMenu(false);
    });

    // Services dropdown toggle (keyboard + mobile)
    var li = host.querySelector(".has-dropdown");
    var ddBtn = host.querySelector(".dd-toggle");
    ddBtn.addEventListener("click", function () {
      var open = !li.classList.contains("open");
      li.classList.toggle("open", open);
      ddBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!li.contains(e.target) && window.innerWidth > 960) {
        li.classList.remove("open");
        ddBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Border on scroll
    function onScroll() { host.classList.toggle("scrolled", window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
   * Footer
   * ------------------------------------------------------------------ */
  function buildFooter() {
    var host = document.getElementById("site-footer");
    if (!host) return;
    host.className = "site-footer";

    var socials = "";
    if (CFG.INSTAGRAM) socials += '<a href="' + esc(CFG.INSTAGRAM) + '" target="_blank" rel="noopener" aria-label="Instagram">' + icon("instagram") + "</a>";
    if (CFG.FACEBOOK) socials += '<a href="' + esc(CFG.FACEBOOK) + '" target="_blank" rel="noopener" aria-label="Facebook">' + icon("facebook") + "</a>";
    if (CFG.LINKEDIN) socials += '<a href="' + esc(CFG.LINKEDIN) + '" target="_blank" rel="noopener" aria-label="LinkedIn">' + icon("linkedin") + "</a>";
    socials += '<a href="' + waLink() + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + icon("whatsapp") + "</a>";

    var svc = SERVICES.map(function (s) {
      return '<li><a href="services.html#' + s.id + '">' + s.name + "</a></li>";
    }).join("");

    host.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-about">' +
            '<a class="brand" href="index.html" aria-label="DigyBiz home">' + logoMark() + '<span class="brand-text">Digy<span>Biz</span></span></a>' +
            '<div class="footer-tagline">CREATE <span class="dot"></span> AUTOMATION <span class="dot p"></span> SCALE</div>' +
            "<p>AI-powered lead generation, digital marketing, creative content and automation for business owners who want steady, measurable growth.</p>" +
            '<div class="socials">' + socials + "</div>" +
          "</div>" +
          "<div><h4>Services</h4><ul>" + svc + "</ul></div>" +
          "<div><h4>Company</h4><ul>" +
            '<li><a href="about.html">About Us</a></li>' +
            '<li><a href="our-work.html">Our Work</a></li>' +
            '<li><a href="services.html">All Services</a></li>' +
            '<li><a href="contact.html">Contact</a></li>' +
            '<li><a href="#" data-proposal>Free Proposal</a></li>' +
          "</ul></div>" +
          '<div><h4>Get in touch</h4><ul class="footer-contact">' +
            "<li>" + icon("whatsapp") + '<a href="' + waLink() + '" target="_blank" rel="noopener">WhatsApp us</a></li>' +
            "<li>" + icon("phone") + '<a href="' + telLink() + '">' + esc(CFG.PHONE_DISPLAY) + "</a></li>" +
            "<li>" + icon("mail") + '<a href="mailto:' + esc(CFG.EMAIL) + '">' + esc(CFG.EMAIL) + "</a></li>" +
            "<li>" + icon("pin") + "<span>" + esc(CFG.LOCATION) + "</span></li>" +
          "</ul></div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<span>&copy; " + new Date().getFullYear() + " DigyBiz. All rights reserved.</span>" +
          '<nav aria-label="Legal"><a href="privacy-policy.html">Privacy Policy</a><a href="terms.html">Terms &amp; Conditions</a></nav>' +
        "</div>" +
      "</div>";

    // Floating WhatsApp button
    var wa = document.createElement("a");
    wa.className = "wa-float";
    wa.href = waLink();
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.setAttribute("aria-label", "Chat with DigyBiz on WhatsApp");
    wa.innerHTML = icon("whatsapp");
    document.body.appendChild(wa);
  }

  /* ------------------------------------------------------------------
   * Lead form markup (shared by the popup, home page and contact page)
   * ------------------------------------------------------------------ */
  var formCount = 0;
  function formMarkup(source, buttonText) {
    var n = "lf" + formCount++;
    return (
      '<form class="lead-form" novalidate data-source="' + esc(source) + '">' +
        '<div class="field"><label for="' + n + '-name">Full name <span class="req">*</span></label>' +
          '<input id="' + n + '-name" name="name" type="text" autocomplete="name" placeholder="Your full name" required maxlength="100">' +
          '<small class="err" aria-live="polite"></small></div>' +
        '<div class="field"><label for="' + n + '-phone">Phone / WhatsApp number <span class="req">*</span></label>' +
          '<input id="' + n + '-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="e.g. +91 98765 43210" required maxlength="20">' +
          '<small class="err" aria-live="polite"></small></div>' +
        '<div class="field"><label for="' + n + '-email">Email address <span class="req">*</span></label>' +
          '<input id="' + n + '-email" name="email" type="email" autocomplete="email" placeholder="you@business.com" required maxlength="150">' +
          '<small class="err" aria-live="polite"></small></div>' +
        '<div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>' +
        '<button class="btn btn-primary btn-block" type="submit"><span class="btn-label">' + esc(buttonText || "Get My Free Proposal") + "</span>" + icon("arrow") + "</button>" +
        '<div class="form-status" role="alert"></div>' +
        '<p class="form-note">We reply within one business day. No spam &mdash; see our <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
      "</form>"
    );
  }

  function mountForms() {
    document.querySelectorAll("[data-lead-form]").forEach(function (slot) {
      slot.innerHTML = formMarkup(slot.getAttribute("data-source") || document.title, slot.getAttribute("data-button"));
    });
  }

  /* ------------------------------------------------------------------
   * Free Proposal popup
   * ------------------------------------------------------------------ */
  var modal, lastFocus;
  function buildModal() {
    modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "proposal-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="modal-backdrop" data-close></div>' +
      '<div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="pm-title">' +
        '<div class="form-card">' +
          '<button class="modal-close" type="button" data-close aria-label="Close">' + icon("close") + "</button>" +
          '<p class="eyebrow">Free Proposal</p>' +
          '<h3 id="pm-title">Let&rsquo;s grow your business</h3>' +
          "<p>Share your details and we&rsquo;ll send a free, tailored growth proposal for your business.</p>" +
          formMarkup("Popup — " + document.title) +
        "</div>" +
      "</div>";
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "Tab") trapFocus(e);
    });
  }
  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    var first = modal.querySelector("input");
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function trapFocus(e) {
    var f = modal.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ------------------------------------------------------------------
   * Form validation + submit to Google Sheets
   * ------------------------------------------------------------------ */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setErr(input, msg) {
    var field = input.closest(".field");
    field.classList.toggle("invalid", !!msg);
    field.querySelector(".err").textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  function validate(form) {
    var ok = true;
    var name = form.elements.name, phone = form.elements.phone, email = form.elements.email;
    var nameVal = name.value.trim();
    var phoneDigits = phone.value.replace(/[\s\-().]/g, "");
    var emailVal = email.value.trim();

    if (nameVal.length < 2) { setErr(name, "Please enter your name."); ok = false; } else setErr(name, "");
    if (!/^\+?\d{7,15}$/.test(phoneDigits)) { setErr(phone, "Please enter a valid phone number."); ok = false; } else setErr(phone, "");
    if (!EMAIL_RE.test(emailVal)) { setErr(email, "Please enter a valid email address."); ok = false; } else setErr(email, "");

    if (!ok) {
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
    }
    return ok;
  }

  function showSuccess(form, name) {
    var first = String(name || "").split(" ")[0];
    form.innerHTML =
      '<div class="form-success" tabindex="-1">' +
        '<div class="ok">' + icon("check") + "</div>" +
        "<h3>Thank you" + (first ? ", " + esc(first) : "") + "!</h3>" +
        "<p>We&rsquo;ve received your details and will reach out within one business day with your free proposal.</p>" +
        '<a class="btn btn-whatsapp" href="' + waLink() + '" target="_blank" rel="noopener">' + icon("whatsapp") + "Chat on WhatsApp now</a>" +
      "</div>";
    form.querySelector(".form-success").focus();
  }

  function handleSubmit(e) {
    var form = e.target.closest(".lead-form");
    if (!form) return;
    e.preventDefault();

    var status = form.querySelector(".form-status");
    status.textContent = "";
    status.className = "form-status";

    // Bots fill the hidden field; quietly pretend success.
    if (form.elements.website && form.elements.website.value) { showSuccess(form, ""); return; }
    if (!validate(form)) return;

    var url = String(CFG.SCRIPT_URL || "");
    if (!/^https:\/\/script\.google(usercontent)?\.com\//.test(url)) {
      status.className = "form-status error";
      status.innerHTML = "The form isn&rsquo;t connected yet. Please message us on <a href=\"" + waLink() + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a> instead.";
      console.warn("[DigyBiz] Set SCRIPT_URL in assets/js/config.js to your Apps Script Web App URL.");
      return;
    }

    var data = new URLSearchParams();
    data.append("name", form.elements.name.value.trim());
    data.append("phone", form.elements.phone.value.trim());
    data.append("email", form.elements.email.value.trim());
    data.append("source", form.getAttribute("data-source") || "");
    data.append("page", location.href);

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Sending&hellip;</span>';

    fetch(url, { method: "POST", body: data })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json && json.result === "success") {
          showSuccess(form, form.elements.name.value.trim());
        } else {
          throw new Error((json && json.message) || "Unknown error");
        }
      })
      .catch(function (err) {
        console.error("[DigyBiz] Form submit failed:", err);
        btn.disabled = false;
        btn.innerHTML = label;
        status.className = "form-status error";
        status.innerHTML = "Sorry, something went wrong. Please try again, or reach us on <a href=\"" + waLink() + "\" target=\"_blank\" rel=\"noopener\">WhatsApp</a>.";
      });
  }

  /* ------------------------------------------------------------------
   * Small page features
   * ------------------------------------------------------------------ */
  function wireContactLinks() {
    document.querySelectorAll("[data-whatsapp]").forEach(function (a) {
      a.href = waLink(a.getAttribute("data-whatsapp") || undefined);
      a.target = "_blank";
      a.rel = "noopener";
    });
    document.querySelectorAll("[data-email]").forEach(function (a) {
      a.href = "mailto:" + CFG.EMAIL;
      var t = a.querySelector("[data-text]");
      if (t) t.textContent = CFG.EMAIL;
    });
    document.querySelectorAll("[data-phone]").forEach(function (a) {
      a.href = telLink();
      var t = a.querySelector("[data-text]");
      if (t) t.textContent = CFG.PHONE_DISPLAY;
    });
    document.querySelectorAll("[data-instagram]").forEach(function (a) {
      if (!CFG.INSTAGRAM) { a.closest("li") ? a.closest("li").remove() : a.remove(); return; }
      a.href = CFG.INSTAGRAM;
    });
    document.querySelectorAll("[data-cfg]").forEach(function (el) {
      el.textContent = CFG[el.getAttribute("data-cfg")] || "";
    });
  }

  function revealOnScroll() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  function workFilters() {
    var bar = document.querySelector("[data-filters]");
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      var f = btn.getAttribute("data-filter");
      bar.querySelectorAll(".filter-btn").forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      document.querySelectorAll(".work-item").forEach(function (item) {
        var cats = (item.getAttribute("data-cat") || "").split(" ");
        item.hidden = !(f === "all" || cats.indexOf(f) !== -1);
      });
    });
  }

  /* ------------------------------------------------------------------
   * Init
   * ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    buildHeader();
    buildFooter();
    mountForms();
    buildModal();
    wireContactLinks();
    renderIcons();
    document.querySelectorAll("[data-mark]").forEach(function (el) { el.innerHTML = logoMark("mark"); });

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-proposal]");
      if (trigger) { e.preventDefault(); openModal(); }
    });
    document.addEventListener("submit", handleSubmit);

    // Clear a field's error as soon as the visitor edits it
    document.addEventListener("input", function (e) {
      if (e.target.closest(".field.invalid")) setErr(e.target, "");
    });

    revealOnScroll();
    workFilters();

    // Open the popup automatically when the URL ends with #free-proposal-popup
    if (location.hash === "#free-proposal-popup") openModal();
  });
})();
