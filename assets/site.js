const sliders = [
  {
    title: "Alphabetical Order",
    description: "Numbers organised by letters? Strange.",
    path: "sliders/alphabetical/",
  },
  {
    title: "Drag and Drop",
    description: "One by one...",
    path: "sliders/drag/",
  },
  {
    title: "Inertia",
    description: "A slider that refuses to stop.",
    path: "sliders/inertia/",
  },
  {
    title: "Roulette Wheel",
    description: "Spin it. Accept your fate.",
    path: "sliders/spinner/",
  },
  {
    title: "Tic-Tac-Toe",
    description: "Slow and steady wins the.. volume?",
    path: "sliders/tictactoe/",
  },
];

const logoSources = {
  small: "assets/vivancodes_logo-84.webp",
  large: "assets/vivancodes_logo-168.webp",
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

    card.append(title, description, link);

    grid.appendChild(card);
  });
}

function initAnimations() {
  const staggerEls = document.querySelectorAll("[data-stagger]");
  staggerEls.forEach((el, i) => {
    el.style.setProperty("--stagger-index", i);
    el.classList.add("stagger-in");
  });

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

  document.querySelectorAll("[data-animate]").forEach((el) => {
    el.classList.add("fade-up");
    observer.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSiteHeader();
  renderGrid();
  initAnimations();
});
