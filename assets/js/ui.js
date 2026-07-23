/* small shared UI helpers: toast + modal open/close */
window.PackmeUI = (function () {
  function showToast(message) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  function openModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add("open");
  }

  function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove("open");
  }

  // Tiered share: native file share -> native URL share -> PNG download.
  // Returns { method, success } so callers can toast appropriately.
  function shareResult(canvas, opts) {
    opts = opts || {};
    var filename = opts.filename || "packme-result.png";
    return new Promise(function (resolve) {
      canvas.toBlob(async function (blob) {
        if (!blob) { resolve({ method: "error", success: false }); return; }
        var file;
        try { file = new File([blob], filename, { type: "image/png" }); } catch (e) { file = null; }

        try {
          if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ title: opts.title, text: opts.text, files: [file] });
            resolve({ method: "file-share", success: true });
            return;
          }
          if (navigator.share) {
            await navigator.share({ title: opts.title, text: opts.text, url: opts.url });
            resolve({ method: "url-share", success: true });
            return;
          }
        } catch (e) {
          if (e && e.name === "AbortError") { resolve({ method: "cancel", success: false }); return; }
          // fall through to download on any other share failure
        }

        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        resolve({ method: "download-fallback", success: true });
      }, "image/png");
    });
  }

  return { showToast: showToast, openModal: openModal, closeModal: closeModal, shareResult: shareResult };
})();
