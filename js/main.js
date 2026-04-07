/* ═══════════════════════════════════════════════════════
   Piyush Singhal Portfolio — main.js
   Features: loader · particles · cursor · typewriter ·
             skill bars · card tilt · scroll progress ·
             reveal · counters · magnetic buttons · nav
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Year ── */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ════════════════════════════════
     LOADER
  ════════════════════════════════ */
  var loader = document.getElementById("loader");
  function removeLoader() {
    if (!loader) return;
    setTimeout(function () {
      loader.classList.add("done");
      triggerHeroAnims();
    }, 1400);
  }
  if (document.readyState === "complete") {
    removeLoader();
  } else {
    window.addEventListener("load", removeLoader);
  }

  /* ════════════════════════════════
     HERO ANIMATIONS (staggered)
  ════════════════════════════════ */
  function triggerHeroAnims() {
    var els = document.querySelectorAll(".hero [data-anim]");
    els.forEach(function (el, i) {
      el.style.setProperty("--d", String(i));
      requestAnimationFrame(function () {
        el.classList.add("visible");
      });
    });
  }

  /* ════════════════════════════════
     SCROLL PROGRESS BAR
  ════════════════════════════════ */
  var prog = document.getElementById("scrollProg");
  function updateScrollProg() {
    if (!prog) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    prog.style.width = pct + "%";
  }

  /* ════════════════════════════════
     HEADER SCROLL CLASS
  ════════════════════════════════ */
  var header = document.getElementById("siteHeader");
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 50);
  }

  /* ════════════════════════════════
     BACK TO TOP
  ════════════════════════════════ */
  var btt = document.getElementById("backToTop");
  if (btt) {
    btt.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  function updateBtt() {
    if (!btt) return;
    btt.classList.toggle("show", window.scrollY > 320);
  }

  window.addEventListener("scroll", function () {
    updateScrollProg();
    updateHeader();
    updateBtt();
  }, { passive: true });

  /* ════════════════════════════════
     ACTIVE NAV ON SCROLL
  ════════════════════════════════ */
  var navLinks = document.querySelectorAll(".nav a[data-for]");
  var trackedSections = document.querySelectorAll("section[id]");

  if ("IntersectionObserver" in window && navLinks.length) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("data-for") === id);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    trackedSections.forEach(function (s) { navIO.observe(s); });
  }

  /* ════════════════════════════════
     MOBILE NAV
  ════════════════════════════════ */
  var toggleBtn = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      toggleBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("[data-nav]").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ════════════════════════════════
     CUSTOM CURSOR (desktop only)
  ════════════════════════════════ */
  var dot  = document.getElementById("cDot");
  var ring = document.getElementById("cRing");
  if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;
    var rx = mx, ry = my;

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top  = my + "px";
    });

    function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + "px";
      ring.style.top  = ry + "px";
      requestAnimationFrame(animRing);
    }
    animRing();

    /* Hover effect on interactive elements */
    document.querySelectorAll("a, button, .tilt, .stag").forEach(function (el) {
      el.addEventListener("mouseenter", function () { document.body.classList.add("hovering"); });
      el.addEventListener("mouseleave", function () { document.body.classList.remove("hovering"); });
    });
  }

  /* ════════════════════════════════
     PARTICLES CANVAS
  ════════════════════════════════ */
  var canvas = document.getElementById("particleCanvas");
  if (canvas && !prefersReducedMotion) {
    var ctx = canvas.getContext("2d");
    var W, H, particles;
    var PARTICLE_COUNT = 70;
    var MAX_DIST = 130;
    var COLORS = ["#00cfff", "#48e6ff", "#ff6b35", "#9bffd5", "#c4b5fd"];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.3
      };
    }

    function initParticles() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      /* Draw connections */
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(0,207,255," + (0.10 * (1 - dist / MAX_DIST)) + ")";
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      /* Draw dots */
      particles.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
        /* Move */
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }

    resize();
    initParticles();
    drawParticles();
    window.addEventListener("resize", function () { resize(); initParticles(); }, { passive: true });
  }

  /* ════════════════════════════════
     TYPEWRITER
  ════════════════════════════════ */
  var twEl = document.getElementById("typewriter");
  if (twEl) {
    var phrases = [
      "Java Backend Developer",
      "Spring Boot Architect",
      "REST API Engineer",
      "Microservices Specialist",
      "Performance Optimiser"
    ];
    var pi = 0, ci = 0, deleting = false;

    function type() {
      var phrase = phrases[pi];
      if (deleting) {
        ci--;
        twEl.textContent = phrase.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(type, 450);
          return;
        }
        setTimeout(type, 40);
      } else {
        ci++;
        twEl.textContent = phrase.slice(0, ci);
        if (ci === phrase.length) {
          deleting = true;
          setTimeout(type, 2200);
          return;
        }
        setTimeout(type, 75);
      }
    }
    setTimeout(type, 1800);
  }

  /* ════════════════════════════════
     SCROLL REVEAL (IntersectionObserver)
  ════════════════════════════════ */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealIO.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ════════════════════════════════
     COUNTER ANIMATION
  ════════════════════════════════ */
  function countUp(el, target, duration) {
    var start = null;
    var suffix = el.getAttribute("data-suffix") || "";
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  var counterEls = document.querySelectorAll(".mc-val[data-count]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var target = parseFloat(e.target.getAttribute("data-count"));
          countUp(e.target, target, 1400);
          counterIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { counterIO.observe(el); });
  } else {
    counterEls.forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* ════════════════════════════════
     SKILL BAR ANIMATION
  ════════════════════════════════ */
  var bars = document.querySelectorAll(".sbar");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var barIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var fill = e.target.querySelector(".sbar-fill");
          var pct  = e.target.getAttribute("data-pct") || "0";
          if (fill) {
            setTimeout(function () { fill.style.width = pct + "%"; }, 100);
          }
          barIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    bars.forEach(function (bar) { barIO.observe(bar); });
  } else {
    bars.forEach(function (bar) {
      var fill = bar.querySelector(".sbar-fill");
      if (fill) fill.style.width = (bar.getAttribute("data-pct") || "0") + "%";
    });
  }

  /* ════════════════════════════════
     3D CARD TILT (project cards)
  ════════════════════════════════ */
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width  / 2;
        var cy = rect.height / 2;
        var rx = ((y - cy) / cy) * -8;
        var ry = ((x - cx) / cx) *  8;
        card.style.transform = "perspective(800px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale(1.02)";
        /* Radial highlight */
        var pctX = (x / rect.width)  * 100;
        var pctY = (y / rect.height) * 100;
        card.style.setProperty("--mx", pctX + "%");
        card.style.setProperty("--my", pctY + "%");
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
        card.style.setProperty("--mx", "50%");
        card.style.setProperty("--my", "50%");
      });
    });
  }

  /* ════════════════════════════════
     MAGNETIC BUTTONS
  ════════════════════════════════ */
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var dx = e.clientX - (rect.left + rect.width  / 2);
        var dy = e.clientY - (rect.top  + rect.height / 2);
        el.style.transform = "translate(" + dx * 0.3 + "px," + dy * 0.3 + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

})();
