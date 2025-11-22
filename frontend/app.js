// ===============================
// ImpactOS Frontend App Logic
// ===============================

// CHANGE ONLY THIS if you ever rename the Worker subdomain
const API_BASE = "https://impact-os-api.impactsolutionsgroup25.workers.dev";

// ----- Helper: Call API -----
async function callApi(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ----- Helper: Extract OpenAI Text -----
function extractTextFromOpenAI(data) {
  try {
    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    if (data.result) return data.result;
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return JSON.stringify(data, null, 2);
  }
}

// ----- Helper: Loading Buttons -----
function setLoading(button, isLoading) {
  if (!button) return;
  const spinner = button.querySelector(".btn-spinner");
  button.disabled = isLoading;
  if (spinner) spinner.hidden = !isLoading;
}

// Utility: smooth scroll
function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ===============================
// MAIN UI LOGIC (runs after DOM ready)
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // Hero buttons (if present)
  // ===============================
  const ctaEnter = document.getElementById("cta-enter");
  const ctaLearn = document.getElementById("cta-learn");

  if (ctaEnter) {
    ctaEnter.addEventListener("click", () => {
      scrollToId("command-center");
    });
  }

  if (ctaLearn) {
    ctaLearn.addEventListener("click", () => {
      scrollToId("command-center");
    });
  }

  // ===============================
  // Sidebar Navigation
  // ===============================
  const navButtons = document.querySelectorAll(".nav-item");
  const panels = document.querySelectorAll(".panel");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.dataset.section;

      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      panels.forEach((panel) => {
        panel.classList.toggle(
          "panel-active",
          panel.id === `section-${section}`
        );
      });
    });
  });

  // ===============================
  // PROMPT STUDIO
  // ===============================
  const promptForm = document.getElementById("prompt-form");
  const promptInput = document.getElementById("prompt-input");
  const promptOutput = document.getElementById("prompt-output");
  const promptCopyBtn = document.getElementById("prompt-copy-btn");

  if (promptForm && promptInput && promptOutput) {
    promptForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const value = promptInput.value.trim();
      if (!value) return;

      const btn = promptForm.querySelector(".btn-primary");
      setLoading(btn, true);
      promptOutput.textContent = "Thinking…";
      promptOutput.classList.add("thinking");

      try {
        const data = await callApi("/api/prompt", { prompt: value });
        const text = extractTextFromOpenAI(data);
        promptOutput.textContent = text;
      } catch (err) {
        console.error("Prompt error:", err);
        promptOutput.textContent = `Error: ${err.message}`;
      } finally {
        promptOutput.classList.remove("thinking");
        setLoading(btn, false);
      }
    });
  }

  if (promptCopyBtn && promptOutput) {
    promptCopyBtn.addEventListener("click", () => {
      const text = promptOutput.textContent || "";
      if (!text) return;
      navigator.clipboard.writeText(text);
    });
  }

  // ===============================
  // ORG ARCHITECTURE
  // ===============================
  const orgForm = document.getElementById("orgchart-form");
  const orgContext = document.getElementById("org-context");
  const orgPriority = document.getElementById("org-priority");
  const orgOutput = document.getElementById("org-output");
  const orgCopyBtn = document.getElementById("org-copy-btn");

  if (orgForm && orgContext && orgOutput) {
    orgForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const ctx = orgContext.value.trim();
      const pri = orgPriority ? orgPriority.value.trim() : "";

      if (!ctx) return;

      const btn = orgForm.querySelector(".btn-primary");
      setLoading(btn, true);
      orgOutput.textContent = "Designing organizational structure…";
      orgOutput.classList.add("thinking");

      try {
        const data = await callApi("/api/orgchart", {
          orgContext: ctx,
          priority: pri,
        });
        const text = extractTextFromOpenAI(data);
        orgOutput.textContent = text;
      } catch (err) {
        console.error("Org chart error:", err);
        orgOutput.textContent = `Error: ${err.message}`;
      } finally {
        orgOutput.classList.remove("thinking");
        setLoading(btn, false);
      }
    });
  }

  if (orgCopyBtn && orgOutput) {
    orgCopyBtn.addEventListener("click", () => {
      const text = orgOutput.textContent || "";
      if (!text) return;
      navigator.clipboard.writeText(text);
    });
  }

  // ===============================
  // DEPARTMENT BUILDER
  // ===============================
  const deptForm = document.getElementById("department-form");
  const deptName = document.getElementById("dept-name");
  const deptOrgType = document.getElementById("dept-org-type");
  const deptMandate = document.getElementById("dept-mandate");
  const deptConstraints = document.getElementById("dept-constraints");
  const deptOutput = document.getElementById("dept-output");
  const deptCopyBtn = document.getElementById("dept-copy-btn");

  if (deptForm && deptName && deptOrgType && deptMandate && deptOutput) {
    deptForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        name: deptName.value.trim(),
        orgType: deptOrgType.value.trim(),
        mandate: deptMandate.value.trim(),
        constraints: deptConstraints ? deptConstraints.value.trim() : "",
      };

      if (!payload.name && !payload.mandate) return;

      const btn = deptForm.querySelector(".btn-primary");
      setLoading(btn, true);
      deptOutput.textContent = "Generating department model…";
      deptOutput.classList.add("thinking");

      try {
        const data = await callApi("/api/department", payload);
        const text = extractTextFromOpenAI(data);
        deptOutput.textContent = text;
      } catch (err) {
        console.error("Department error:", err);
        deptOutput.textContent = `Error: ${err.message}`;
      } finally {
        deptOutput.classList.remove("thinking");
        setLoading(btn, false);
      }
    });
  }

  if (deptCopyBtn && deptOutput) {
    deptCopyBtn.addEventListener("click", () => {
      const text = deptOutput.textContent || "";
      if (!text) return;
      navigator.clipboard.writeText(text);
    });
  }

  // ===============================
  // KNOWLEDGE ENGINE
  // ===============================
  const knowledgeForm = document.getElementById("knowledge-form");
  const knowledgeText = document.getElementById("knowledge-text");
  const knowledgeOutput = document.getElementById("knowledge-output");

  if (knowledgeForm && knowledgeText && knowledgeOutput) {
    knowledgeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = knowledgeText.value.trim();
      if (!text) return;

      const btn = knowledgeForm.querySelector(".btn-primary");
      setLoading(btn, true);
      knowledgeOutput.textContent = "Saving insight…";
      knowledgeOutput.classList.add("thinking");

      try {
        const result = await callApi("/api/knowledge", { text });
        knowledgeOutput.textContent =
          typeof result === "string"
            ? result
            : JSON.stringify(result, null, 2) || "Saved.";
      } catch (err) {
        console.error("Knowledge error:", err);
        knowledgeOutput.textContent = `Error: ${err.message}`;
      } finally {
        knowledgeOutput.classList.remove("thinking");
        setLoading(btn, false);
      }
    });
  }
});

// ===============================
// CHECKOUT HANDLER (Stripe)
// ===============================
async function startCheckout(priceId) {
  try {
    const res = await fetch(`${API_BASE}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId,
        userId: crypto.randomUUID(),
      }),
    });

    const data = await res.json();
    console.log("Checkout response:", data);

    if (data.url) {
      window.location = data.url; // redirect to Stripe
    } else {
      alert("Error: " + (data.error || "Unable to start checkout."));
    }
  } catch (err) {
    console.error("Checkout exception:", err);
    alert("Could not start checkout. Check console for details.");
  }
}

/* ===============================
  HERO — Spotlight Cursor Glow
  =============================== */
const spotlight = document.getElementById("spotlight");
if (spotlight) {
  document.addEventListener("mousemove", (e) => {
    spotlight.style.left = `${e.pageX - 125}px`;
    spotlight.style.top = `${e.pageY - 125}px`;
  });
}

/* ===============================
  HERO — Typing Effect
  =============================== */
const typedText = [
  "ImpactOS Command Center",
  "AI-Powered Strategy Engine",
  "Build Smarter Organizations",
];

let i = 0,
  j = 0;
const speed = 90;
const typedEl = document.getElementById("typed");

function type() {
  if (!typedEl) return;
  if (j < typedText[i].length) {
    typedEl.textContent += typedText[i][j];
    j++;
    setTimeout(type, speed);
  } else {
    setTimeout(erase, 1500);
  }
}

function erase() {
  if (!typedEl) return;
  if (j > 0) {
    typedEl.textContent = typedText[i].substring(0, j - 1);
    j--;
    setTimeout(erase, 40);
  } else {
    i = (i + 1) % typedText.length;
    setTimeout(type, 300);
  }
}

type();

/* ===============================
  HERO — Floating Particles
  =============================== */
const canvas = document.getElementById("particle-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];

  function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(drawParticles);
  }

  initParticles();
  drawParticles();
  window.addEventListener("resize", initParticles);
}