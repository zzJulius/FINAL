

function qs(sel, scope = document) {
  return scope.querySelector(sel);
}

function qsa(sel, scope = document) {
  return Array.from(scope.querySelectorAll(sel));
}

function safePlay(audioEl, volume = 1) {
  if (!audioEl) return;
  if (audioEl.dataset.muted === "true") return;

  try {
    audioEl.volume = Math.max(0, Math.min(1, volume));
    audioEl.currentTime = 0;
    audioEl.play();
  } catch (e) {
  
  }
}




/* PACKAGES */


function setupPackages() {
  const buttons = qsa("[data-package]");
  const title = qs("#packageDetailTitle");
  const price = qs("#packageDetailPrice");
  const list = qs("#packageDetailList");
  const uiBeep = qs("#uiBeep");

  if (!buttons.length || !title || !price || !list) return;

  const data = {
    starter: {
      title: "Starter Audit",
      price: "From $900",
      items: [
        "90-minute intake + goals alignment",
        "Customer + margin diagnosis (quick wins first)",
        "Prioritized 2-week action plan",
        "1 follow-up call to lock execution"
      ]
    },
    growth: {
      title: "Growth Sprint",
      price: "From $2,500",
      items: [
        "Full funnel review (acquisition → conversion → retention)",
        "Channel strategy + creative testing plan",
        "Offer & pricing/margin levers",
        "30-day roadmap + KPI dashboard template"
      ]
    },
    operator: {
      title: "Operator Support (Monthly)",
      price: "From $3,500 / month",
      items: [
        "Weekly check-ins + execution guidance",
        "Experiment planning + post-mortems",
        "Team alignment + decision support",
        "Always-on strategic “sparring partner”"
      ]
    }
  };



/* SOUND */


  function render(key, playSound) {
    buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
    const active = qs(`[data-package="${key}"]`);
    if (active) active.setAttribute("aria-pressed", "true");

    const d = data[key];
    if (!d) return;

    title.textContent = d.title;
    price.textContent = d.price;

    list.innerHTML = "";
    d.items.forEach((txt) => {
      const li = document.createElement("li");
      li.textContent = txt;
      list.appendChild(li);
    });

    if (playSound) safePlay(uiBeep, 0.18);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => render(btn.dataset.package, true));
  });

  // default selection without sound
  render("growth", false);
}




/* CONTACT */



function setupContactForm() {
  const form = qs("#contactForm");
  const status = qs("#formStatus");
  const uiBeep = qs("#uiBeep");
  if (!form || !status) return;

  function setStatus(type, msg) {
    status.classList.remove("ok", "err");
    if (type) status.classList.add(type);
    status.textContent = msg;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = qs("#name", form).value.trim();
    const email = qs("#email", form).value.trim();
    const message = qs("#message", form).value.trim();


const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (name.length < 2) return setStatus("err", "Please enter your name (2+ characters).");
    if (!emailOk) return setStatus("err", "Please enter a valid email address.");
    if (message.length < 15) return setStatus("err", "Please write a short message (15+ characters).");

    setStatus("ok", "Message sent ✅");
    safePlay(uiBeep, 0.18); /* check volume on phone b4 submitting!! */

    const submitBtn = qs('button[type="submit"]', form);
    if (submitBtn) {
      submitBtn.textContent = "Submitted (client-side)";
      submitBtn.disabled = true;
    }
  });
}



/* SOUND TOGGLE */



function setupSoundToggle() {
  const toggle = qs("[data-sound-toggle]");
  const uiBeep = qs("#uiBeep");
  const navClick = qs("#navClick"); /* fix delay, otherwise remove? */
  if (!toggle || (!uiBeep)) return;

  function getMuted() {
    const ref = uiBeep
    return ref.dataset.muted === "true";
  }

  function setMuted(muted) {
    if (uiBeep) uiBeep.dataset.muted = muted ? "true" : "false";
  }

  function render() {
    const muted = getMuted();
    toggle.setAttribute("aria-pressed", String(!muted));
    toggle.textContent = muted ? "Sound: Off" : "Sound: On";
  }

  toggle.addEventListener("click", () => {
    setMuted(!getMuted());
    render();
  });

  render();
}


/* safety */

document.addEventListener("DOMContentLoaded", () => {
  setupPackages();
  setupContactForm();
  setupSoundToggle();
  /* nav click add?? */


  const year = qs("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
});
