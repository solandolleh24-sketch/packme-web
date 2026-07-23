/* PACKME 2026 — 4-step wizard controller */

(function () {
  var D = window.PACKME_DATA;
  var selection = window.PackmeState.load();
  var currentStep = 1;

  var STEP_LABELS = ["", "아키타입", "현재 상태", "구성품", "결과 톤"];

  function persist() { window.PackmeState.save(selection); }

  function updatePreview() {
    try {
      PackmePoster.render(document.getElementById("previewCanvas"), selection);
      var frame = document.getElementById("previewFrame");
      frame.setAttribute("data-tone", selection.tone || "positive");
    } catch (e) {
      console.error("preview render failed", e);
    }
  }

  function renderBreadcrumb() {
    var el = document.getElementById("stepsBreadcrumb");
    var parts = [];
    for (var i = 1; i <= 4; i++) {
      if (i === currentStep) parts.push('<span class="current">' + i + '. ' + STEP_LABELS[i] + '</span>');
      else parts.push('<span>' + i + '/4</span>');
    }
    el.innerHTML = parts.join(' <span>›</span> ');
    document.getElementById("progressFill").style.width = (currentStep / 4 * 100) + "%";
  }

  function showStep(step) {
    currentStep = step;
    document.querySelectorAll(".step-panel").forEach(function (p) {
      p.classList.toggle("active", Number(p.dataset.step) === step);
    });
    renderBreadcrumb();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildTile(container, item, groupKey, onPick) {
    var btn = document.createElement("button");
    btn.type = "button";
    var isSelected = selection[groupKey] === item.id;
    btn.className = "tile" + (isSelected ? " selected" : "");
    btn.setAttribute("aria-pressed", String(isSelected));
    btn.innerHTML =
      '<span class="emoji">' + item.emoji + '</span>' +
      '<span class="name">' + item.name + '</span>' +
      (item.tagline ? '<span class="tagline">' + item.tagline + '</span>' : '');
    btn.addEventListener("click", function () {
      selection[groupKey] = item.id;
      persist();
      onPick();
    });
    container.appendChild(btn);
  }

  // ---------- Step 1: archetype ----------
  function renderStep1() {
    var grid = document.getElementById("archetypeGrid");
    grid.innerHTML = "";
    D.archetypes.forEach(function (a) {
      buildTile(grid, a, "archetype", function () {
        renderStep1();
        updatePreview();
        document.getElementById("toStep2").disabled = !selection.archetype;
      });
    });
    document.getElementById("toStep2").disabled = !selection.archetype;
  }

  // ---------- Step 2: state ----------
  function renderStep2() {
    var list = document.getElementById("stateList");
    list.innerHTML = "";
    D.states.forEach(function (s) {
      var box = document.createElement("button");
      box.type = "button";
      var stateSelected = selection.state === s.id;
      box.className = "box tight tile" + (stateSelected ? " selected" : "");
      box.setAttribute("aria-pressed", String(stateSelected));
      box.style.textAlign = "left";
      box.innerHTML =
        '<div class="state-row">' +
        '<div class="emoji-disc">' + s.emoji + '</div>' +
        '<div class="col gap-4"><div class="t-md">' + s.emoji + ' ' + s.name + '</div>' +
        '<div class="t-sm">' + s.tagline + '</div></div></div>';
      box.addEventListener("click", function () {
        selection.state = s.id;
        persist();
        renderStep2();
        updatePreview();
        document.getElementById("toStep2Next").disabled = !selection.state;
      });
      list.appendChild(box);
    });
    document.getElementById("toStep2Next").disabled = !selection.state;
  }

  // ---------- Step 3: components ----------
  function buildChips(container, list, groupKey) {
    container.innerHTML = "";
    list.forEach(function (item) {
      var chip = document.createElement("button");
      chip.type = "button";
      var chipSelected = selection[groupKey] === item.id;
      chip.className = "chip" + (chipSelected ? " selected" : "");
      chip.setAttribute("aria-pressed", String(chipSelected));
      chip.textContent = item.emoji + " " + item.name;
      chip.addEventListener("click", function () {
        selection[groupKey] = item.id;
        persist();
        renderStep3();
        updatePreview();
      });
      container.appendChild(chip);
    });
  }

  function renderStep3() {
    var prevBox = document.getElementById("prevChoicesBox");
    var arche = D.archetypes.find(function (a) { return a.id === selection.archetype; });
    var st = D.states.find(function (s) { return s.id === selection.state; });
    prevBox.innerHTML =
      '<div class="t-sm" style="margin-bottom:8px;">이전 단계 선택값</div>' +
      '<div class="row gap-24 wrap-row">' +
      '<div class="kv"><span class="k">아키타입</span><span class="v">' + (arche ? arche.emoji + " " + arche.name : "-") + '</span></div>' +
      '<div class="kv"><span class="k">현재 상태</span><span class="v">' + (st ? st.emoji + " " + st.name : "-") + '</span></div>' +
      '</div>';

    buildChips(document.getElementById("tasteChips"), D.tastes, "taste");
    buildChips(document.getElementById("belongingChips"), D.belongings, "belonging");
    buildChips(document.getElementById("habitChips"), D.habits, "habit");

    var taste = D.tastes.find(function (t) { return t.id === selection.taste; });
    var belonging = D.belongings.find(function (b) { return b.id === selection.belonging; });
    var habit = D.habits.find(function (h) { return h.id === selection.habit; });
    var summary = document.getElementById("componentSummary");
    summary.innerHTML =
      '<div class="kv"><span class="k">취향</span><span class="v">' + (taste ? taste.emoji + " " + taste.name : "—") + '</span></div>' +
      '<div class="kv"><span class="k">소지품</span><span class="v">' + (belonging ? belonging.emoji + " " + belonging.name : "—") + '</span></div>' +
      '<div class="kv"><span class="k">습관</span><span class="v">' + (habit ? habit.emoji + " " + habit.name : "—") + '</span></div>';

    document.getElementById("toStep4").disabled = !(selection.taste && selection.belonging && selection.habit);
  }

  // ---------- Step 4: tone ----------
  function renderStep4() {
    var list = document.getElementById("toneList");
    list.innerHTML = "";
    D.tones.forEach(function (tone) {
      var label = document.createElement("label");
      label.className = "tone-card" + (selection.tone === tone.id ? " selected" : "");
      label.innerHTML =
        '<input type="radio" name="tone" ' + (selection.tone === tone.id ? "checked" : "") + '>' +
        '<div class="col gap-4"><div class="name">' + tone.name + '</div><div class="desc">' + tone.desc + '</div></div>';
      label.querySelector("input").addEventListener("change", function () {
        selection.tone = tone.id;
        persist();
        renderStep4();
        updatePreview();
        document.getElementById("finishBtn").disabled = !selection.tone;
      });
      list.appendChild(label);
    });
    document.getElementById("finishBtn").disabled = !selection.tone;
  }

  async function init() {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    renderStep1();
    renderStep2();
    renderStep3();
    renderStep4();
    updatePreview();
    showStep(1);

    document.getElementById("toStep2").addEventListener("click", function () { showStep(2); });
    document.getElementById("toStep1").addEventListener("click", function () { showStep(1); });
    document.getElementById("toStep2Next").addEventListener("click", function () { showStep(3); });
    document.getElementById("toStep2Back").addEventListener("click", function () { showStep(2); });
    document.getElementById("toStep4").addEventListener("click", function () { showStep(4); });
    document.getElementById("toStep3").addEventListener("click", function () { showStep(3); });
    document.getElementById("finishBtn").addEventListener("click", function () {
      selection.captionSeed = 0;
      persist();
      window.location.href = "result.html";
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
