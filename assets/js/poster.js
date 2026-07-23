/* PACKME 2026 — poster rendering
   Draws the 9:16 "blister pack" starter-pack poster onto a <canvas>, entirely client-side. */

window.PackmePoster = (function () {
  const D = window.PACKME_DATA;

  const TONE_COLORS = {
    positive:    { a: "#ffb703", b: "#fb8500", bg: "#fff4de", text: "#16171b", card: "#ffffff" },
    selfmock:    { a: "#8a8a90", b: "#2b2b2b", bg: "#e7e5e2", text: "#16171b", card: "#f4f3f1" },
    exaggerated: { a: "#39ff14", b: "#ff00e5", bg: "#0a0a0a", text: "#f6f3ec", card: "#151515" },
    relaxed:     { a: "#cdeac0", b: "#d8c9f0", bg: "#f6f1fb", text: "#16171b", card: "#ffffff" },
    chaos:       { a: "#ff3b30", b: "#0a84ff", bg: "#0d0d0f", text: "#f6f3ec", card: "#1b1b1f" }
  };

  function find(list, id) { return list.find((x) => x.id === id) || null; }

  function lookup(selection) {
    return {
      archetype: find(D.archetypes, selection.archetype),
      state: find(D.states, selection.state),
      taste: find(D.tastes, selection.taste),
      belonging: find(D.belongings, selection.belonging),
      habit: find(D.habits, selection.habit),
      tone: find(D.tones, selection.tone)
    };
  }

  function caption(selection) {
    const l = lookup(selection);
    const toneId = selection.tone || "positive";
    const templates = D.captionTemplates[toneId] || D.captionTemplates.positive;
    const seed = Math.abs(selection.captionSeed || 0) % templates.length;
    const tpl = templates[seed];
    return tpl
      .replace("{archetype}", l.archetype ? l.archetype.name : "당신")
      .replace("{state}", l.state ? l.state.name : "지금")
      .replace("{taste}", l.taste ? l.taste.name : "취향")
      .replace("{belonging}", l.belonging ? l.belonging.name : "소지품")
      .replace("{habit}", l.habit ? l.habit.name : "습관");
  }

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((w) => {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Renders the poster at native 720x1280 (9:16) resolution so PNG export stays crisp.
  function render(canvas, selection) {
    const W = 720, H = 1280;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    const l = lookup(selection);
    const toneId = selection.tone || "positive";
    const colors = TONE_COLORS[toneId] || TONE_COLORS.positive;

    // background
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, colors.a);
    grad.addColorStop(1, colors.b);
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 260);
    ctx.globalAlpha = 1;

    // outer blister border
    ctx.strokeStyle = colors.text;
    ctx.lineWidth = 10;
    roundRect(ctx, 20, 20, W - 40, H - 40, 32);
    ctx.stroke();

    // header
    ctx.fillStyle = colors.text;
    ctx.font = "700 26px 'Pretendard', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("2026 STARTER PACK", 56, 90);
    ctx.font = "800 30px 'Pretendard', sans-serif";
    ctx.fillText((l.archetype ? l.archetype.emoji + " " : "") + (l.archetype ? l.archetype.name : "나만의 아키타입"), 56, 140);

    // avatar disc
    ctx.beginPath();
    ctx.arc(W - 130, 110, 64, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = colors.text;
    ctx.stroke();
    ctx.font = "56px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(l.archetype ? l.archetype.emoji : "🧑", W - 130, 116);
    ctx.textBaseline = "alphabetic";

    // state pill
    ctx.textAlign = "left";
    roundRect(ctx, 56, 176, 300, 48, 24);
    ctx.fillStyle = colors.card;
    ctx.fill();
    ctx.strokeStyle = colors.text;
    ctx.lineWidth = 3;
    roundRect(ctx, 56, 176, 300, 48, 24);
    ctx.stroke();
    ctx.fillStyle = colors.text;
    ctx.font = "600 20px 'Pretendard', sans-serif";
    ctx.fillText((l.state ? l.state.emoji + " " : "") + (l.state ? l.state.name : "지금 상태"), 78, 208);

    // blister package: 3 components
    const compY = 260;
    const compH = 300;
    roundRect(ctx, 56, compY, W - 112, compH, 24);
    ctx.fillStyle = colors.card;
    ctx.fill();
    ctx.strokeStyle = colors.text;
    ctx.lineWidth = 5;
    roundRect(ctx, 56, compY, W - 112, compH, 24);
    ctx.stroke();

    ctx.font = "600 16px 'Pretendard', sans-serif";
    ctx.fillStyle = colors.text;
    ctx.globalAlpha = 0.6;
    ctx.fillText("오늘의 구성품", 80, compY + 40);
    ctx.globalAlpha = 1;

    const comps = [l.taste, l.belonging, l.habit];
    const slotW = (W - 112 - 40) / 3;
    comps.forEach((c, i) => {
      const cx = 76 + i * (slotW + 20);
      const cy = compY + 70;
      roundRect(ctx, cx, cy, slotW, compH - 100, 18);
      ctx.strokeStyle = colors.text;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.font = "44px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(c ? c.emoji : "❔", cx + slotW / 2, cy + 90);
      ctx.font = "600 17px 'Pretendard', sans-serif";
      const name = c ? c.name : "미선택";
      const lines = wrapText(ctx, name, slotW - 16);
      lines.forEach((ln, li) => {
        ctx.fillText(ln, cx + slotW / 2, cy + 130 + li * 22);
      });
    });
    ctx.textAlign = "left";

    // caption card
    const capY = compY + compH + 30;
    roundRect(ctx, 56, capY, W - 112, 160, 24);
    ctx.fillStyle = colors.card;
    ctx.fill();
    ctx.strokeStyle = colors.text;
    ctx.lineWidth = 4;
    roundRect(ctx, 56, capY, W - 112, 160, 24);
    ctx.stroke();

    ctx.fillStyle = colors.text;
    ctx.font = "700 22px 'Pretendard', sans-serif";
    const capLines = wrapText(ctx, caption(selection), W - 112 - 64);
    capLines.slice(0, 4).forEach((ln, i) => {
      ctx.fillText(ln, 88, capY + 50 + i * 32);
    });

    // meme score meter
    const score = window.PackmeState.memeScore(selection);
    const meterY = capY + 190;
    ctx.font = "600 16px 'Pretendard', sans-serif";
    ctx.fillStyle = colors.text;
    ctx.fillText("밈력 지수", 56, meterY);
    ctx.font = "800 16px 'Pretendard', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(score + " / 100", W - 56, meterY);
    ctx.textAlign = "left";

    roundRect(ctx, 56, meterY + 14, W - 112, 18, 9);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fill();
    const fillW = (W - 112) * (score / 100);
    const meterGrad = ctx.createLinearGradient(56, 0, 56 + fillW, 0);
    meterGrad.addColorStop(0, colors.a);
    meterGrad.addColorStop(1, colors.b);
    roundRect(ctx, 56, meterY + 14, fillW, 18, 9);
    ctx.fillStyle = meterGrad;
    ctx.fill();

    // footer
    ctx.font = "500 14px 'Pretendard', sans-serif";
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = colors.text;
    ctx.fillText("packme2026 · 브라우저에서만 생성됨 · 서버 저장 없음", 56, H - 50);
    ctx.globalAlpha = 1;

    return { caption: caption(selection), score };
  }

  return { render, lookup, caption, TONE_COLORS };
})();
