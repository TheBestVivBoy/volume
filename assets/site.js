const BMC_URL = "https://buymeacoffee.com/vivancodes";
const POPUP_COOLDOWN_MS = 7 * 60 * 1000;
const MIN_VISITS = 2;
const FIRST_VISIT_DELAY_MS = 10 * 60 * 1000;
const POPUP_DELAY_AFTER_PAGELOAD = 15 * 1000;

const STORAGE_KEYS = {
  firstVisitTimestamp: "firstVisitTimestamp",
  visitCount: "visitCount",
  lastPopupTimestamp: "lastPopupTimestamp",
};

const sliders = [
  {
    title: "Alphabetical Order",
    description: "Numbers organised by letters? Strange.",
    slug: "alphabetical",
    path: "sliders/alphabetical/",
  },
  {
    title: "Cannon",
    description: "Aim the speaker. Release.",
    slug: "cannon",
    path: "sliders/cannon/",
    preview: false,
  },
  {
    title: "Curling",
    description: "Slide carefully.",
    slug: "curling",
    path: "sliders/curling/",
  },
  {
    title: "Drag and Drop",
    description: "One by one...",
    slug: "drag",
    path: "sliders/drag/",
  },
  {
    title: "Dropdown",
    description: "10,001 options.",
    slug: "dropdown",
    path: "sliders/dropdown/",
  },
  {
    title: "DVD",
    description: "Wait for the bounce.",
    slug: "dvd",
    path: "sliders/dvd/",
  },
  {
    title: "Horse Race",
    description: "Bet volume on a winner.",
    slug: "horse_race",
    path: "sliders/horse_race/",
  },
  {
    title: "Hundred Sliders",
    description: "Add them all up.",
    slug: "hundred_sliders",
    path: "sliders/hundred_sliders/",
  },
  {
    title: "Inertia",
    description: "A slider that refuses to stop.",
    slug: "inertia",
    path: "sliders/inertia/",
  },
  {
    title: "Memory",
    description: "Match a pair. That's the volume.",
    slug: "memory",
    path: "sliders/memory/",
    preview: false,
  },
  {
    title: "Personality",
    description: "Answer honestly.",
    slug: "personality",
    path: "sliders/personality/",
  },
  {
    title: "Plinko",
    description: "Drop one and see.",
    slug: "plinko",
    path: "sliders/plinko/",
  },
  {
    title: "Spinny Wheel",
    description: "Spin it. Accept your fate.",
    slug: "spinner",
    path: "sliders/spinner/",
  },
  {
    title: "Stacking",
    description: "Build it one layer at a time.",
    slug: "stacking",
    path: "sliders/stacking/",
  },
  {
    title: "Tic-Tac-Toe",
    description: "Slow and steady wins the.. volume?",
    slug: "tictactoe",
    path: "sliders/tictactoe/",
  },
  {
    title: "Trading Cards",
    description: "Reveal three percentages. Pick one.",
    slug: "tradingcards",
    path: "sliders/tradingcards/",
  },
  {
    title: "Find Your Sound",
    description: "Swipe until it matches.",
    slug: "tinder",
    path: "sliders/tinder/",
  },
  {
    title: "Tutorial",
    description: "Read every step.",
    slug: "tutorial",
    path: "sliders/tutorial/",
  },
  {
    title: "Uniquely Loud",
    description: "Availability is limited.",
    slug: "unique",
    path: "sliders/unique/",
  },
];

const logoSources = {
  small: "assets/vivancodes_logo-84.webp",
  large: "assets/vivancodes_logo-168.webp",
};

let popupTimer = 0;
let lastPopupFocus = null;
let popupListenersBound = false;

window.VolumeSiteConfig = {
  BMC_URL,
  POPUP_COOLDOWN_MS,
  MIN_VISITS,
  FIRST_VISIT_DELAY_MS,
  POPUP_DELAY_AFTER_PAGELOAD,
};

function getSiteRoot() {
  return document.body.dataset.siteRoot || "./";
}

function buildInternalHref(path) {
  return `${getSiteRoot()}${path}`;
}

function buildLogoSrc(path) {
  return buildInternalHref(path);
}

function buildPreviewSrc(slug) {
  return buildInternalHref(`assets/gifs/${slug}.gif`);
}

function supportsCardPreviews() {
  return (
    document.body.classList.contains("home-page") ||
    document.body.classList.contains("collection-page")
  );
}

function supportsStorage() {
  try {
    const probe = "__volume_probe__";
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch (_error) {
    return false;
  }
}

function readStoredNumber(key) {
  if (!supportsStorage()) return 0;
  const value = Number.parseInt(window.localStorage.getItem(key) || "0", 10);
  return Number.isFinite(value) ? value : 0;
}

function writeStoredNumber(key, value) {
  if (!supportsStorage()) return;
  window.localStorage.setItem(key, String(value));
}

function renderSiteHeader() {
  const mount = document.querySelector("[data-site-header]");
  if (!mount) return;

  const isHome = document.body.classList.contains("home-page");
  const inSliderSection =
    document.body.classList.contains("collection-page") ||
    window.location.pathname.includes("/sliders/");

  mount.innerHTML = `
    <header class="site-header">
      <a class="site-brand" href="${buildInternalHref("")}" aria-label="Go to homepage">
        <span class="site-brand-mark">
          <img
            src="${buildLogoSrc(logoSources.small)}"
            srcset="${buildLogoSrc(logoSources.small)} 84w, ${buildLogoSrc(logoSources.large)} 168w"
            sizes="42px"
            alt="Vivan Codes"
            width="42"
            height="42"
            decoding="async"
          />
        </span>
        <span class="site-brand-text">
          <span class="site-brand-name">Vivan Codes</span>
          <span class="site-brand-note">Volume</span>
        </span>
      </a>

      <nav class="site-nav" aria-label="Primary">
        <a class="site-nav-link${isHome ? " is-current" : ""}" href="${buildInternalHref("")}"${
          isHome ? ' aria-current="page"' : ""
        }>Home</a>
        <a class="site-nav-link${inSliderSection ? " is-current" : ""}" href="${buildInternalHref(
          "sliders/",
        )}"${inSliderSection ? ' aria-current="page"' : ""}>Sliders</a>
        <a
          class="site-nav-link"
          href="https://github.com/TheBestVivBoy/volume"
          target="_blank"
          rel="noreferrer"
        >GitHub</a>
        <a
          class="site-nav-link"
          href="https://tiktok.com/@vivancodes"
          target="_blank"
          rel="noreferrer"
        >TikTok</a>
      </nav>
    </header>
  `;
}

function renderGrid() {
  const grid = document.getElementById("slider-grid");
  if (!grid) return;

  const showPreviews = supportsCardPreviews();
  grid.textContent = "";

  sliders.forEach((slider) => {
    const card = document.createElement("article");
    card.className = "collection-card";

    const title = document.createElement("h3");
    title.textContent = slider.title;

    const description = document.createElement("p");
    description.textContent = slider.description;

    const link = document.createElement("a");
    link.className = "card-link";
    link.href = buildInternalHref(slider.path);
    link.textContent = "Open →";

    if (showPreviews) {
      card.dataset.previewSrc = buildPreviewSrc(slider.slug);
    }

    card.append(title, description, link);

    grid.appendChild(card);
  });
}

function mountHomePreviews() {
  if (!supportsCardPreviews()) return;

  const cards = document.querySelectorAll(".collection-card[data-preview-src]");
  if (!cards.length) return;

  const injectPreview = (card) => {
    if (card.dataset.previewLoaded === "true") return;

    const previewSrc = card.dataset.previewSrc;
    if (!previewSrc) return;

    const probe = new Image();
    probe.decoding = "async";

    probe.onload = () => {
      const frame = document.createElement("figure");
      frame.className = "card-preview";
      frame.setAttribute("aria-hidden", "true");

      const img = document.createElement("img");
      img.className = "card-preview-media";
      img.src = previewSrc;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";

      frame.appendChild(img);
      card.insertBefore(frame, card.firstChild);
      card.dataset.previewLoaded = "true";
      card.classList.add("has-preview");
    };

    probe.onerror = () => {
      card.dataset.previewLoaded = "missing";
    };

    probe.src = previewSrc;
  };

  if (!("IntersectionObserver" in window)) {
    cards.forEach(injectPreview);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        injectPreview(entry.target);
      });
    },
    { rootMargin: "180px 0px" },
  );

  cards.forEach((card) => observer.observe(card));
}

function renderHomeSupport() {
  if (!document.body.classList.contains("home-page")) return;

  const anchor = document.querySelector("[data-home-support-anchor]");
  if (!anchor) return;

  anchor.innerHTML = `
    <section class="support-inline support-inline--home" data-animate aria-label="Support Vivan Codes">
      <div class="support-inline-copy">
        <span class="support-inline-eyebrow">Support</span>
        <p class="support-inline-title">To keep vivancodes.com free for everyone.</p>
        <p class="support-inline-text">If the sliders made you smile, a small donation helps keep new ones coming.</p>
      </div>
      <div class="support-inline-actions">
        <a
          class="support-link"
          href="${BMC_URL}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support Vivan Codes on Buy Me a Coffee"
        >Buy me volume</a>
      </div>
    </section>
  `;
}

function createPopup() {
  let popup = document.getElementById("support-popup");
  if (popup) return popup;

  popup = document.createElement("div");
  popup.id = "support-popup";
  popup.className = "support-popup";
  popup.hidden = true;
  popup.innerHTML = `
    <div
      class="support-popup__panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="support-popup-title"
      aria-describedby="support-popup-copy"
    >
      <div class="support-popup__top">
        <span class="support-popup__eyebrow">Support</span>
        <button
          type="button"
          class="support-popup__icon"
          data-popup-close
          aria-label="Close support prompt"
        >×</button>
      </div>
      <h2 class="support-popup__title" id="support-popup-title">
        To keep vivancodes.com free for everyone.
      </h2>
      <p class="support-popup__copy" id="support-popup-copy">
        a small donation helps keep the next inconvenient slider online.
      </p>
      <div class="support-popup__actions">
        <a
          class="support-link support-link--compact"
          href="${BMC_URL}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Support Vivan Codes on Buy Me a Coffee"
        >Buy me volume</a>
        <button
          type="button"
          class="support-popup__dismiss"
          data-popup-close
          aria-label="Dismiss support prompt for now"
        >Maybe later</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  popup.querySelectorAll("[data-popup-close]").forEach((button) => {
    button.addEventListener("click", () => closePopup());
  });

  return popup;
}

function getFocusableElements(scope) {
  return Array.from(
    scope.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    (element) =>
      !element.hidden && element.getAttribute("aria-hidden") !== "true",
  );
}

function bindPopupListeners() {
  if (popupListenersBound) return;

  document.addEventListener("keydown", (event) => {
    const popup = document.getElementById("support-popup");
    if (!popup || popup.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closePopup();
      return;
    }

    if (event.key !== "Tab" || !popup.contains(document.activeElement)) return;

    const focusable = getFocusableElements(popup);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener("focusin", (event) => {
    const popup = document.getElementById("support-popup");
    if (!popup || popup.hidden) return;
    if (popup.contains(event.target)) return;

    const focusable = getFocusableElements(popup);
    focusable[0]?.focus();
  });

  popupListenersBound = true;
}

function openPopup() {
  const popup = createPopup();
  if (!popup.hidden) return;

  writeStoredNumber(STORAGE_KEYS.lastPopupTimestamp, Date.now());
  lastPopupFocus =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

  popup.hidden = false;
  window.requestAnimationFrame(() => {
    popup.classList.add("is-visible");
    const preferredFocus =
      popup.querySelector(".support-popup__dismiss") ||
      getFocusableElements(popup)[0];
    preferredFocus?.focus();
  });
}

function closePopup() {
  const popup = document.getElementById("support-popup");
  if (!popup || popup.hidden) return;

  writeStoredNumber(STORAGE_KEYS.lastPopupTimestamp, Date.now());
  popup.classList.remove("is-visible");

  window.setTimeout(() => {
    popup.hidden = true;
  }, 180);

  if (lastPopupFocus && document.contains(lastPopupFocus)) {
    lastPopupFocus.focus();
  }
}

function trackVisit() {
  const now = Date.now();
  let firstVisitTimestamp = readStoredNumber(STORAGE_KEYS.firstVisitTimestamp);
  let visitCount = readStoredNumber(STORAGE_KEYS.visitCount);
  const lastPopupTimestamp = readStoredNumber(STORAGE_KEYS.lastPopupTimestamp);

  if (!firstVisitTimestamp || firstVisitTimestamp > now) {
    firstVisitTimestamp = now;
    visitCount = 1;
  } else {
    visitCount = Math.max(visitCount, 0) + 1;
  }

  writeStoredNumber(STORAGE_KEYS.firstVisitTimestamp, firstVisitTimestamp);
  writeStoredNumber(STORAGE_KEYS.visitCount, visitCount);

  return {
    now,
    firstVisitTimestamp,
    visitCount,
    lastPopupTimestamp,
  };
}

function shouldSchedulePopup(state) {
  if (!supportsStorage()) return false;
  if (state.visitCount < MIN_VISITS) return false;
  if (state.now - state.firstVisitTimestamp < FIRST_VISIT_DELAY_MS)
    return false;
  if (
    state.lastPopupTimestamp &&
    state.now - state.lastPopupTimestamp < POPUP_COOLDOWN_MS
  ) {
    return false;
  }

  return true;
}

function initSupportPopup() {
  if (!document.body.classList.contains("home-page")) return;

  createPopup();
  bindPopupListeners();

  const visitState = trackVisit();
  if (!shouldSchedulePopup(visitState)) return;

  const delay = POPUP_DELAY_AFTER_PAGELOAD + Math.floor(Math.random() * 7000);
  popupTimer = window.setTimeout(() => {
    openPopup();
  }, delay);
}

function initAnimations() {
  const staggerEls = document.querySelectorAll("[data-stagger]");
  staggerEls.forEach((el, i) => {
    el.style.setProperty("--stagger-index", i);
    el.classList.add("stagger-in");
  });

  const animateTargets = document.querySelectorAll("[data-animate]");
  if (!animateTargets.length) return;

  if (!("IntersectionObserver" in window)) {
    animateTargets.forEach((el) => {
      el.classList.add("fade-up", "visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );

  animateTargets.forEach((el) => {
    el.classList.add("fade-up");
    observer.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSiteHeader();
  renderGrid();
  mountHomePreviews();
  renderHomeSupport();
  document.body.classList.add("has-bmc-widget");
  initSupportPopup();
  initAnimations();
});
