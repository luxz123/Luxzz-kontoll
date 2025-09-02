// konfigurasi
const CORRECT_PASS = "2611";
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const pwInput = document.getElementById('pw');
const okBtn = document.getElementById('okBtn');
const helpBtn = document.getElementById('helpBtn');
const msgEl = document.getElementById('msg');

// helper fullscreen (user gesture required)
async function goFullscreen() {
  try {
    const el = document.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen();
    else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) await el.msRequestFullscreen();
    return true;
  } catch (e) {
    return false;
  }
}

function showOverlay() {
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  // push state supaya back tombol tidak langsung menutup page (simulasi)
  try { history.pushState({ kiosk: true }, '', location.href); } catch (e) { }
  pwInput.value = "";
  pwInput.focus();
}

function hideOverlay() {
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  // exit fullscreen if active (best-effort)
  if (document.fullscreenElement) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
  // clear message
  msgEl.textContent = "";
  // try to pop the extra history state
  try { history.back(); } catch (e) { }
}

// start simulation on button
startBtn.addEventListener('click', async () => {
  await goFullscreen();
  showOverlay();
});

// OK - check password
okBtn.addEventListener('click', () => {
  const v = pwInput.value.trim();
  if (v === CORRECT_PASS) {
    msgEl.style.color = 'lime';
    msgEl.textContent = "Password benar — simulasi dihentikan.";
    setTimeout(hideOverlay, 450);
  } else {
    msgEl.style.color = '#ff9090';
    msgEl.textContent = "Password salah. Coba lagi.";
    pwInput.value = "";
    pwInput.focus();
  }
});

// help button (contoh)
helpBtn.addEventListener('click', () => {
  msgEl.style.color = '#9fb3c8';
  msgEl.textContent = "Ini simulasi edukasi. Password yang digunakan pada demo adalah '2611'.";
});

// block context menu to keep "feel" (non-destructive)
document.addEventListener('contextmenu', e => {
  if (overlay.classList.contains('show')) e.preventDefault();
});

// try to reduce back navigation (best-effort)
window.addEventListener('popstate', () => {
  if (overlay.classList.contains('show')) {
    // immediately push state back and show hint
    try { history.pushState({ kiosk: true }, '', location.href); } catch (e) { }
    msgEl.style.color = '#ffd6d6';
    msgEl.textContent = "Tombol navigasi dibatasi simulasi. Masukkan password untuk keluar.";
    setTimeout(() => {
      if (overlay.classList.contains('show')) msgEl.textContent = "";
    }, 2200);
  }
});

// optional: prevent accidental form submit on enter
pwInput.addEventListener('keydown', (ev) => {
  if (ev.key === 'Enter