/* =========================================================
   Site behaviour — language, navigation, animations,
   videos, forms and booking calendar.
   ========================================================= */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var EN = window.I18N_EN || {};
  var UI = window.UI_TEXT || { ar: {}, en: {} };
  var root = document.documentElement;
  var page = document.body.getAttribute("data-page");
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var lang = function () { return root.lang === "en" ? "en" : "ar"; };
  var t = function (k) { return (UI[lang()] || {})[k] || ""; };
  var ROOT = window.SITE_ROOT || "";
  var rel = function (p) { return /^(https?:|\/|#|mailto:)/.test(p) ? p : ROOT + p; };

  /* ---------- Language ---------- */
  var originals = new Map();
  var originalTitle = document.title;

  function remember(el) {
    if (!originals.has(el)) {
      originals.set(el, {
        html: el.innerHTML,
        ph: el.getAttribute("placeholder"),
        alt: el.getAttribute("alt")
      });
    }
    return originals.get(el);
  }

  function applyLang() {
    var en = lang() === "en";
    $$("[data-i18n]").forEach(function (el) {
      var o = remember(el), k = el.getAttribute("data-i18n");
      el.innerHTML = en && EN[k] != null ? EN[k] : o.html;
    });
    $$("[data-i18n-ph]").forEach(function (el) {
      var o = remember(el), k = el.getAttribute("data-i18n-ph");
      el.setAttribute("placeholder", en && EN[k] ? EN[k] : o.ph);
    });
    $$("[data-i18n-alt]").forEach(function (el) {
      var o = remember(el), k = el.getAttribute("data-i18n-alt");
      el.setAttribute("alt", en && EN[k] ? EN[k] : o.alt);
    });
    document.title = en && EN["meta." + page] ? EN["meta." + page] : originalTitle;
    $$(".lang-label").forEach(function (el) { el.textContent = t("langLabel"); });
    $$('input[name="lang"]').forEach(function (el) { el.value = lang(); });
    root.classList.remove("i18n-pending");
  }

  function setLang(next) {
    root.lang = next;
    root.dir = next === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("lang", next); } catch (e) {}
    try {
      var u = new URL(location.href);
      if (u.searchParams.has("lang")) { u.searchParams.delete("lang"); history.replaceState(null, "", u.toString()); }
    } catch (e) {}
    applyLang();
    renderAllShorts();
  }

  $$("[data-lang-toggle]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(lang() === "ar" ? "en" : "ar"); });
  });

  /* ---------- Links from config ---------- */
  function bindLinks() {
    $$("[data-link]").forEach(function (a) {
      var v = SITE[a.getAttribute("data-link")];
      if (v) a.setAttribute("href", rel(v));
    });
    $$("[data-social]").forEach(function (a) {
      var v = (SITE.socials || {})[a.getAttribute("data-social")];
      if (v) a.setAttribute("href", v);
    });
    $$("[data-cal-link]").forEach(function (a) {
      if (SITE.calLink) a.setAttribute("href", "https://cal.com/" + SITE.calLink);
    });
    $$("[data-mail]").forEach(function (a) {
      if (SITE.email) a.setAttribute("href", "mailto:" + SITE.email);
      else (a.closest("li") || a).hidden = true;
    });
    $$("[data-mail-text]").forEach(function (el) { el.textContent = SITE.email || ""; });
    $$("[data-hero-video]").forEach(function (b) {
      if (SITE.heroVideo) b.setAttribute("data-video", SITE.heroVideo); else b.hidden = true;
    });
    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    var nav = $("#nav");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 20); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    var btn = $(".menu-btn");
    if (btn) {
      btn.addEventListener("click", function () {
        var open = document.body.classList.toggle("menu-open");
        btn.setAttribute("aria-expanded", open);
      });
      $$("#mobile-menu a").forEach(function (a) {
        a.addEventListener("click", function () { document.body.classList.remove("menu-open"); btn.setAttribute("aria-expanded", "false"); });
      });
    }

    var links = $$(".nav-pill a");
    var setActive = function (key) {
      links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-nav") === key); });
    };
    if (page !== "home") { setActive(page === "post" ? "blog" : page); return; }
    setActive("top");
    var sections = $$("[data-section]");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var key = e.target.getAttribute("data-section");
          setActive(key === "contact" ? "" : key);
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = $$("[data-reveal]");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Course lessons light up as you scroll ---------- */
  function initLessons() {
    var lessons = $$("[data-lesson]");
    if (!lessons.length) return;
    var ticking = false;
    var update = function () {
      var line = window.innerHeight * 0.68;
      lessons.forEach(function (l) { l.classList.toggle("is-active", l.getBoundingClientRect().top < line); });
      ticking = false;
    };
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- Card spotlight ---------- */
  function initSpotlight() {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ---------- Ventures logos ---------- */
  function initVentures() {
    var sec = $("#ventures"), track = $("#ventures-track");
    var list = SITE.ventures || [];
    if (!sec || !track || !list.length) return;
    var html = "";
    for (var r = 0; r < 2; r++) {
      list.forEach(function (src) { html += '<img src="' + rel(src) + '" alt="" loading="lazy">'; });
    }
    track.innerHTML = html;
    sec.hidden = false;
  }

  /* ---------- Videos (YouTube: long videos + Shorts) ---------- */
  var videosPromise = null;

  function fallbackVideos() {
    var all = (window.VIDEOS || []).slice();
    return {
      long: all.filter(function (v) { return v.kind === "long"; }),
      shorts: all.filter(function (v) { return v.kind !== "long"; })
    };
  }

  // YouTube keeps two automatic playlists per channel:
  // "UULF…" = long videos only, "UUSH…" = Shorts only.
  function fetchPlaylist(prefix, yt) {
    var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" +
      prefix + yt.channelId.slice(2) + "&key=" + encodeURIComponent(yt.apiKey);
    return fetch(url).then(function (r) {
      if (r.status === 404) return { items: [] };   // the channel has none of this kind yet
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (d) {
      var items = (d.items || []).map(function (it) {
        var s = it.snippet || {}, th = s.thumbnails || {};
        var best = th.maxres || th.standard || th.high || th.medium || {};
        return { id: (s.resourceId || {}).videoId, title: s.title, published: s.publishedAt, thumb: best.url };
      }).filter(function (v) { return v.id && v.title !== "Private video" && v.title !== "Deleted video"; });
      items.sort(function (x, y) { return (y.published || "").localeCompare(x.published || ""); });
      return items;
    });
  }

  function loadVideos() {
    if (videosPromise) return videosPromise;
    var yt = SITE.youtube || {};
    if (!yt.apiKey || !yt.channelId) { videosPromise = Promise.resolve(fallbackVideos()); return videosPromise; }

    var cacheKey = "yt-cache-v2";
    try {
      var c = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
      if (c && Date.now() - c.t < 30 * 60 * 1000) { videosPromise = Promise.resolve(c.data); return videosPromise; }
    } catch (e) {}

    videosPromise = Promise.all([fetchPlaylist("UULF", yt), fetchPlaylist("UUSH", yt)]).then(function (res) {
      var data = { long: res[0], shorts: res[1] };
      if (!data.long.length && !data.shorts.length) return fallbackVideos();
      try { sessionStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), data: data })); } catch (e) {}
      return data;
    }).catch(fallbackVideos);
    return videosPromise;
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function cleanTitle(s) { return String(s).replace(/#\S+/g, "").replace(/[⁨⁩]/g, "").trim(); }
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';

  // YouTube answers a missing thumbnail with a tiny grey placeholder instead of an error.
  window.__ytThumb = function (img, fallback) {
    if (img.naturalWidth && img.naturalWidth <= 120 && img.src !== fallback) img.src = fallback;
  };

  function card(v, wide) {
    var title = cleanTitle(v.title), id = esc(v.id);
    var base = "https://i.ytimg.com/vi/" + id + "/";
    var src = v.thumb ? esc(v.thumb) : base + (wide ? "maxresdefault.jpg" : "sddefault.jpg");
    var fb = base + (wide ? "mqdefault.jpg" : "hqdefault.jpg");
    return '<button class="' + (wide ? "vid" : "short") + '" type="button" data-video="' + id + '"' + (wide ? " data-wide" : "") +
      ' aria-label="' + esc(t("play") + ": " + title) + '">' +
      '<img src="' + src + '" alt="" loading="lazy" onload="__ytThumb(this,\'' + fb + '\')" onerror="this.onerror=null;this.src=\'' + fb + '\'">' +
      (wide ? "" : '<span class="kind">' + t("short") + "</span>") +
      '<span class="play glass">' + PLAY + "</span>" +
      '<span class="meta"><p dir="auto">' + esc(title) + "</p></span></button>";
  }

  function fill(box, items, wide) {
    var limit = parseInt(box.getAttribute("data-limit"), 10) || 8;
    var list = items.slice(0, limit);
    box.innerHTML = list.length ? list.map(function (v) { return card(v, wide); }).join("") : '<p class="muted">' + t("noVideos") + "</p>";
  }

  var currentTab = null;
  function renderAllShorts() {
    var shortsBoxes = $$("[data-shorts]"), longBoxes = $$("[data-longs]");
    if (!shortsBoxes.length && !longBoxes.length) return;
    loadVideos().then(function (data) {
      var hasLong = data.long.length > 0, hasShorts = data.shorts.length > 0;
      shortsBoxes.forEach(function (b) { fill(b, data.shorts, false); });
      longBoxes.forEach(function (b) { if (hasLong) fill(b, data.long, true); b.hidden = !hasLong; });

      var tabs = $("[data-video-tabs]");
      if (!tabs) return;
      var both = hasLong && hasShorts;
      tabs.hidden = !both;
      if (!currentTab) currentTab = tabs.getAttribute("data-default") || (hasLong ? "long" : "shorts");
      var show = function (tab) {
        currentTab = tab;
        $$("[data-tab]", tabs).forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === tab); });
        longBoxes.forEach(function (b) { b.hidden = !(hasLong && tab === "long"); });
        shortsBoxes.forEach(function (b) { b.hidden = !(tab === "shorts"); });
      };
      show(both ? currentTab : (hasLong ? "long" : "shorts"));
      if (!tabs.__bound) {
        tabs.__bound = true;
        tabs.addEventListener("click", function (e) {
          var b = e.target.closest("[data-tab]");
          if (b) show(b.getAttribute("data-tab"));
        });
      }
    });
  }

  function initPlayer() {
    var modal = $("#player");
    if (!modal) return;
    var frame = $(".modal-frame", modal);
    var close = function () { modal.classList.remove("open"); frame.innerHTML = ""; document.body.style.overflow = ""; };
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-video]");
      if (!b) return;
      var id = b.getAttribute("data-video");
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&playsinline=1&modestbranding=1" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      modal.classList.toggle("wide", b.hasAttribute("data-wide"));
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      $(".modal-close", modal).focus();
    });
    modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest(".modal-close")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
  }

  /* ---------- Lead forms ---------- */
  function initForms() {
    $$("[data-lead-form]").forEach(function (form) {
      var status = $(".form-status", form);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var hp = form.querySelector('[name="company"]');
        if (hp && hp.value) return;
        var btn = form.querySelector('button[type="submit"]');
        status.className = "form-status";
        status.textContent = t("sending");
        btn.disabled = true;

        var data = new FormData(form);
        var endpoint = SITE.formEndpoint;
        var req = endpoint
          ? fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
          : fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data).toString() });

        req.then(function (r) {
          if (!r.ok) throw new Error(r.status);
          status.textContent = "";
          form.classList.add("is-done");
        }).catch(function () {
          status.className = "form-status err";
          status.textContent = t("error");
        }).then(function () { btn.disabled = false; });
      });
    });
  }

  /* ---------- Cal.com booking (loads when the section gets close) ---------- */
  function initCal() {
    var el = document.getElementById("cal-inline");
    if (!el || !SITE.calLink) return;
    var started = false;
    var start = function () {
      if (started) return; started = true;
      (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
      window.Cal("init", "30min", { origin: "https://app.cal.com" });
      window.Cal.config = window.Cal.config || {};
      window.Cal.config.forwardQueryParams = true;
      el.innerHTML = "";
      window.Cal.ns["30min"]("inline", {
        elementOrSelector: "#cal-inline",
        config: { layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "dark" },
        calLink: SITE.calLink
      });
      window.Cal.ns["30min"]("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: { dark: { "cal-brand": "#ffffff" } }
      });
    };
    if (!("IntersectionObserver" in window)) { start(); return; }
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { start(); io.disconnect(); } }, { rootMargin: "900px 0px" });
    io.observe(el);
  }

  /* ---------- Boot ---------- */
  applyLang();
  bindLinks();
  initNav();
  initVentures();
  initReveal();
  initLessons();
  initSpotlight();
  renderAllShorts();
  initPlayer();
  initForms();
  initCal();
})();
