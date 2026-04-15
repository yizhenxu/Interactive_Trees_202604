// =============================
// Tree rendering logic
// =============================
function createNode(nodeData) {
  const node = document.createElement("div");
  node.className = "tree-node";

  const box = document.createElement("div");
  box.className = "node-box";

  const nodeColor =
    nodeData &&
    typeof nodeData.color === "string" &&
    nodeData.color.trim().length > 0
      ? nodeData.color.trim()
      : "white";

  box.style.backgroundColor = nodeColor;

  // Title
  const titleEl = document.createElement("div");
  titleEl.style.fontWeight = "bold";
  titleEl.style.marginBottom = "6px";
  titleEl.textContent =
    nodeData && nodeData.title != null ? String(nodeData.title) : "";
  box.appendChild(titleEl);

  // Details
  const details = nodeData ? nodeData.details : null;
  if (Array.isArray(details)) {
    details.forEach((line) => {
      const lineEl = document.createElement("div");
      lineEl.textContent = line != null ? String(line) : "";
      box.appendChild(lineEl);
    });
  } else if (typeof details === "string" && details.length > 0) {
    const lineEl = document.createElement("div");
    lineEl.textContent = details;
    box.appendChild(lineEl);
  }

  node.appendChild(box);

  let expanded = false;
  let childrenContainer = null;

  box.addEventListener("click", (e) => {
    e.stopPropagation();

    const kids = nodeData ? nodeData.children : null;
    if (!Array.isArray(kids) || kids.length === 0) return;

    if (!expanded) {
      childrenContainer = document.createElement("div");
      childrenContainer.className = "children";

      kids.forEach((child) => {
        childrenContainer.appendChild(createNode(child));
      });

      node.appendChild(childrenContainer);
      expanded = true;
    } else {
      if (childrenContainer) node.removeChild(childrenContainer);
      childrenContainer = null;
      expanded = false;
    }
  });

  return node;
}

// =============================
// Load tree from JSON
// =============================
function loadTree(jsonPath) {
  fetch(jsonPath)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${jsonPath}`);
      return res.json();
    })
    .then((treeData) => {
      const container = document.getElementById("tree-container");
      if (!container) throw new Error("Missing element with id='tree-container'");
      container.innerHTML = "";
      container.appendChild(createNode(treeData));
    })
    .catch((err) => {
      console.error("Failed to load tree:", err);
      const container = document.getElementById("tree-container");
      if (container) {
        container.innerHTML = `
          <div class="error-box">
            Failed to load tree data from <code>${jsonPath}</code>.
            Please check that the JSON file exists and is valid.
          </div>
        `;
      }
    });
}

// =============================
// Shared tab definitions
// =============================
const TOP_TABS = [
  { href: "30day_mild.html", label: "30-day mortality MILD" },
  { href: "30day_moderate.html", label: "30-day mortality MODERATE" },
  { href: "30day_severe.html", label: "30-day mortality SEVERE" },
  { href: "90day_mild.html", label: "90-day mortality MILD" },
  { href: "90day_moderate.html", label: "90-day mortality MODERATE" },
  { href: "90day_severe.html", label: "90-day mortality SEVERE" }
];

const BOTTOM_TABS = [
  { href: "30day_flu.html", label: "30-day mortality Flu" },
  { href: "30day_rsv.html", label: "30-day mortality RSV" },
  { href: "30day_covid.html", label: "30-day mortality COVID" },
  { href: "30day_none.html", label: "30-day mortality None" },
  { href: "30day_others.html", label: "30-day mortality Others" },
  { href: "90day_flu.html", label: "90-day mortality Flu" },
  { href: "90day_rsv.html", label: "90-day mortality RSV" },
  { href: "90day_covid.html", label: "90-day mortality COVID" },
  { href: "90day_none.html", label: "90-day mortality None" },
  { href: "90day_others.html", label: "90-day mortality Others" }
];

function renderTabs(containerId, tabs, activePage) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  tabs.forEach((tab) => {
    const a = document.createElement("a");
    a.href = tab.href;
    a.className = "tab" + (tab.href === activePage ? " active" : "");
    a.textContent = tab.label;
    container.appendChild(a);
  });
}

// =============================
// Page bootstrap
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const pageTitle = body.dataset.title || "";
  const jsonPath = body.dataset.json || "";
  const activePage = body.dataset.page || "";

  document.title = pageTitle;

  const h1 = document.getElementById("page-title");
  if (h1) h1.textContent = pageTitle;

  renderTabs("top-tabs", TOP_TABS, activePage);
  renderTabs("bottom-tabs", BOTTOM_TABS, activePage);

  if (jsonPath) {
    loadTree(jsonPath);
  }
});
