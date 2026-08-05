/* ==========================================================================
   DATA — every practical lives here, cards & panel are built from this array
   ========================================================================== */
const practicals = [
  { id:"P1", title:"Introduction to the Web", description:"How browsers, servers and the internet fit together.", status:"Completed", notes:"#", code:"#", output:"#", color:"var(--yellow)" },
  { id:"P2", title:"HTML Structures",         description:"Semantic markup, forms and accessible document structure.", status:"Completed", notes:"#", code:"#", output:"#", color:"var(--blue)" },
  { id:"P3", title:"CSS Styling",             description:"Selectors, the box model and building consistent layouts.", status:"Completed", notes:"#", code:"#", output:"#", color:"var(--pink)" },
  { id:"P4", title:"Responsive Layouts",      description:"Flexbox, grid and design that adapts across devices.", status:"Completed", notes:"#", code:"#", output:"#", color:"var(--green)" },
  { id:"P5", title:"JavaScript Basics",       description:"Variables, functions and control flow in the browser.", status:"Completed", notes:"#", code:"#", output:"#", color:"var(--orange)" },
  { id:"P6", title:"DOM & Events",            description:"Reading, updating and reacting to the live page.", status:"Completed", notes:"#", code:"#", output:"#", color:"var(--violet)" },
  { id:"P7", title:"Forms & Validation",      description:"Collecting input and validating it before it's sent.", status:"Completed", notes:"#", code:"#", output:"#", color:"var(--cyan)" },
  { id:"P8", title:"PHP & Backends",          description:"Server-side logic, requests and simple data handling.", status:"Completed", notes:"#", code:"#", output:"#", color:"var(--yellow)" },
];

/* Fixed, deterministic tilt per card so re-renders stay stable */
const rotations = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.5];

/* ==========================================================================
   DOM REFERENCES
   ========================================================================== */
const gridEl        = document.getElementById("grid");
const emptyStateEl   = document.getElementById("emptyState");
const searchInputEl  = document.getElementById("searchInput");
const resultCountEl  = document.getElementById("resultCount");
const statTotalEl    = document.getElementById("statTotal");
const statDoneEl     = document.getElementById("statDone");
const panelEl        = document.getElementById("panel");
const scrimEl        = document.getElementById("scrim");
const clockEl        = document.getElementById("clock");
const marqueeEl      = document.getElementById("marqueeTrack");
const loaderEl       = document.getElementById("loader");

/* ==========================================================================
   RENDER: practical cards
   ========================================================================== */
function renderGrid(list){
  gridEl.innerHTML = "";

  if(list.length === 0){
    emptyStateEl.classList.add("show");
    return;
  }
  emptyStateEl.classList.remove("show");

  list.forEach((p) => {
    const originalIndex = practicals.indexOf(p);
    const card = document.createElement("article");
    card.className = "card";
    card.style.setProperty("--accent", p.color);
    card.style.setProperty("--rot", rotations[originalIndex % rotations.length] + "deg");
    card.style.setProperty("--stagger", (originalIndex * 0.05) + "s");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open ${p.id}: ${p.title}`);

    card.innerHTML = `
      <div class="card-accent-bar"></div>
      <div class="card-top">
        <div class="card-number">${p.id}</div>
        <span class="badge">${p.status}</span>
      </div>
      <h3 class="card-title">${p.title}</h3>
      <p class="card-desc">${p.description}</p>
      <div class="card-open-hint">Open details →</div>
    `;

    card.addEventListener("click", () => openPanel(p));
    card.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openPanel(p); }
    });

    gridEl.appendChild(card);
  });
}

/* ==========================================================================
   RENDER: detail panel
   ========================================================================== */
function openPanel(p){
  panelEl.style.setProperty("--accent", p.color);
  panelEl.innerHTML = `
    <div class="panel-window-bar">
      <div class="window-dots"><span></span><span></span><span></span></div>
      <span class="panel-path">practicals / ${p.id.toLowerCase()}.html</span>
      <button class="panel-close" id="panelCloseBtn" aria-label="Close panel">✕</button>
    </div>
    <div class="panel-body">
      <div class="panel-ghost-number" aria-hidden="true">${p.id}</div>
      <span class="panel-badge">${p.status}</span>
      <h2 class="panel-title">${p.id} — ${p.title}</h2>
      <p class="panel-desc">${p.description}</p>
      <div class="panel-actions">
        <a class="action-btn" href="${p.notes}" target="_blank" rel="noopener">
          <span class="icon">📄</span> View Notes <span class="arrow">↗</span>
        </a>
        <a class="action-btn" href="${p.code}" target="_blank" rel="noopener">
          <span class="icon">💻</span> View Source Code <span class="arrow">↗</span>
        </a>
        <a class="action-btn" href="${p.output}" target="_blank" rel="noopener">
          <span class="icon">🚀</span> Open Live Output <span class="arrow">↗</span>
        </a>
      </div>
      <div class="panel-footer-note">Press <kbd>ESC</kbd> or tap outside to close</div>
    </div>
  `;

  panelEl.classList.add("open");
  scrimEl.classList.add("open");
  panelEl.setAttribute("aria-hidden", "false");
  document.getElementById("panelCloseBtn").addEventListener("click", closePanel);
  document.body.style.overflow = "hidden";
}

function closePanel(){
  panelEl.classList.remove("open");
  scrimEl.classList.remove("open");
  panelEl.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ==========================================================================
   SEARCH — live filter
   ========================================================================== */
function filterPracticals(query){
  const q = query.trim().toLowerCase();
  const filtered = practicals.filter(p =>
    p.id.toLowerCase().includes(q) ||
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
  renderGrid(filtered);
  resultCountEl.textContent = q === ""
    ? "showing all"
    : `${filtered.length} match${filtered.length === 1 ? "" : "es"}`;
}

searchInputEl.addEventListener("input", (e) => filterPracticals(e.target.value));

/* ==========================================================================
   STATS
   ========================================================================== */
function renderStats(){
  const total = practicals.length;
  const done = practicals.filter(p => p.status === "Completed").length;
  statTotalEl.textContent = total;
  statDoneEl.textContent = done;
}

/* ==========================================================================
   LIVE CLOCK
   ========================================================================== */
function tickClock(){
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

/* ==========================================================================
   FOOTER MARQUEE — build a repeating strip from practical titles
   ========================================================================== */
function renderMarquee(){
  const items = practicals.map(p => `<span>✦ ${p.id} · ${p.title}</span>`).join("");
  marqueeEl.innerHTML = items + items; // duplicated for seamless loop
}

/* ==========================================================================
   KEYBOARD SUPPORT
   ========================================================================== */
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && panelEl.classList.contains("open")) closePanel();
});
scrimEl.addEventListener("click", closePanel);

/* ==========================================================================
   INIT
   ========================================================================== */
function init(){
  renderGrid(practicals);
  renderStats();
  renderMarquee();
  tickClock();
  setInterval(tickClock, 1000);

  // Reveal the dashboard once the loading animation completes
  window.setTimeout(() => loaderEl.classList.add("hidden"), 1300);
}

init();