/* PACKME 2026 — shared poster viewer: read from URL, show reactions, start a friend's own version */

(async function () {
  var D = window.PACKME_DATA;
  var selection = window.PackmeState.readFromLocation();

  if (!selection || !window.PackmeState.isComplete(selection)) {
    document.getElementById("emptyState").style.display = "flex";
    document.getElementById("content").style.display = "none";
    return;
  }

  if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }

  var frame = document.getElementById("posterFrame");
  var canvas = document.getElementById("posterCanvas");
  try {
    frame.setAttribute("data-tone", selection.tone || "positive");
    PackmePoster.render(canvas, selection);
  } catch (e) {
    console.error("shared poster render failed", e);
    PackmeUI.showToast("포스터를 그리는 데 문제가 생겼어요. 새로고침해 주세요.");
  }

  var l = PackmePoster.lookup(selection);
  var summary = document.getElementById("summaryBox");
  summary.innerHTML =
    row("아키타입", l.archetype ? l.archetype.emoji + " " + l.archetype.name + " — " + l.archetype.tagline : "-") +
    row("현재 상태", l.state ? l.state.emoji + " " + l.state.name + " — " + l.state.tagline : "-") +
    row("구성품", [l.taste, l.belonging, l.habit].filter(Boolean).map(function (c) { return c.emoji + " " + c.name; }).join(" · ")) +
    row("결과 톤", l.tone ? l.tone.name + " — " + l.tone.desc : "-");

  function row(k, v) {
    return '<div class="row gap-16 align-center"><div class="t-sm" style="min-width:70px;">' + k + '</div><div class="t-md">' + v + '</div></div>';
  }

  // reactions are purely visual (not persisted) — highlight only, per spec
  var reactionRow = document.getElementById("reactionRow");
  D.reactions.forEach(function (r, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn " + (i === 0 ? "primary" : "secondary");
    btn.textContent = r.label;
    btn.addEventListener("click", function () {
      reactionRow.querySelectorAll(".btn").forEach(function (b) { b.classList.remove("picked"); });
      btn.classList.add("picked");
    });
    reactionRow.appendChild(btn);
  });

  document.getElementById("makeMyOwnBtn").addEventListener("click", function () {
    // A friend's version must never carry over the shared selection — start fully independent.
    window.PackmeState.clear();
    window.location.href = "create.html";
  });

  var shareUrl = window.location.href.split("#")[0];

  document.getElementById("shareBtn").addEventListener("click", async function () {
    try {
      var result = await PackmeUI.shareResult(canvas, {
        title: "친구의 2026 스타터팩",
        text: "이 스타터팩 인정해? 반박하려면 네 버전으로 증명해봐",
        url: shareUrl,
        filename: "packme2026-friend-starterpack.png"
      });
      if (result.method === "download-fallback") PackmeUI.showToast("공유 대신 이미지로 저장했어요");
      else if (result.method === "cancel") { /* no-op */ }
      else if (result.success) PackmeUI.showToast("공유했어요");
      else PackmeUI.showToast("공유에 실패했어요. 이미지를 저장해 보세요.");
    } catch (e) {
      console.error("share failed", e);
      PackmeUI.showToast("공유에 실패했어요.");
    }
  });

  document.getElementById("copyLinkBtn").addEventListener("click", function () {
    var done = function () { PackmeUI.showToast("링크를 복사했어요"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(done, done);
    } else {
      var tmp = document.createElement("input");
      tmp.value = shareUrl;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      tmp.remove();
      done();
    }
  });

  function drawQr(target) {
    var ok = PackmeQR.drawQRCode(target, shareUrl, { cellSize: 4, margin: 8 });
    if (!ok) {
      var ctx = target.getContext("2d");
      ctx.fillStyle = "#f4f3f1";
      ctx.fillRect(0, 0, target.width, target.height);
      ctx.fillStyle = "#6b6b70";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("링크가 길어 QR 생성 불가", target.width / 2, target.height / 2);
    }
  }

  document.getElementById("showQrBtn").addEventListener("click", function () {
    drawQr(document.getElementById("qrModalCanvas"));
    PackmeUI.openModal("qrModal");
  });
  document.getElementById("closeQrModal").addEventListener("click", function () {
    PackmeUI.closeModal("qrModal");
  });
  document.getElementById("qrModal").addEventListener("click", function (e) {
    if (e.target.id === "qrModal") PackmeUI.closeModal("qrModal");
  });
})();
