import { createClient } from '@supabase/supabase-js';
import './style.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const configured = Boolean(supabaseUrl && supabaseKey &&
  !supabaseUrl.includes('PROJECT-ID') && !supabaseKey.includes('YOUR_SUPABASE'));
const supabase = configured ? createClient(supabaseUrl, supabaseKey) : null;
const app = document.querySelector('#app');
let mode = 'signup';
let currentSession = null;
let notice = '';
let noticeError = false;

const categories = [
  ['💻','Teknologi','Tempat membahas teknologi, coding, dan gadget.'],
  ['🎮','Game','Cari teman mabar dan diskusi game favorit.'],
  ['🎵','Musik','Berbagi playlist, karya, dan rekomendasi musik.'],
  ['🎨','Desain','Inspirasi desain, ilustrasi, dan kreativitas.'],
  ['🎓','Pendidikan','Belajar bareng dan saling berbagi ilmu.'],
  ['🌱','Pengembangan Diri','Bangun kebiasaan baik bersama komunitas.']
];

function shell(content) {
  app.innerHTML = `
    <header class="nav"><div class="wrap navin">
      <a class="brand" href="#"><span class="logo">W</span> Wibisatia Web</a>
      <nav class="navlinks"><a href="#komunitas">Komunitas</a><a href="#tentang">Tentang</a></nav>
      <div class="actions"><button class="btn" id="navLogin">Masuk</button><button class="btn primary" id="navJoin">Daftar</button></div>
    </div></header>
    ${content}
    <footer class="footer"><div class="wrap footerin"><span>© ${new Date().getFullYear()} Wibisatia Web</span><span>Berbagi • Belajar • Bertumbuh</span></div></footer>`;
  document.querySelector('#navLogin')?.addEventListener('click', () => showAuth('login'));
  document.querySelector('#navJoin')?.addEventListener('click', () => showAuth('signup'));
}

function home() {
  shell(`<main>
    <section class="hero"><div class="wrap heroGrid">
      <div><span class="pill">✦ Selamat datang di Wibisatia Web! 👋</span>
        <h1>Tempat Berkumpulnya <span class="gradient">Orang-Orang Hebat</span></h1>
        <p>Komunitas online untuk berbagi ide, belajar hal baru, dan tumbuh bersama. Temukan teman dengan minat yang sama dan jadilah bagian dari sesuatu yang hebat.</p>
        <div class="ctas"><button class="btn primary" id="heroJoin">♧ Gabung Sekarang</button><a class="btn" href="#komunitas">Jelajahi Komunitas ↗</a></div>
        <p class="muted">✨ Komunitas yang ramah untuk ide, hobi, dan kolaborasi.</p>
      </div>
      <div class="art"><div class="muted">✦ Wibisatia Web / Beranda</div><h3>Komunitas Anda,<br><span class="gradient">Dunia Tanpa Batas</span></h3><p class="muted">Temukan tempatmu untuk berkembang.</p>
        <div class="tiles"><div class="tile"><b>💻</b>Teknologi</div><div class="tile"><b>🎮</b>Game</div><div class="tile"><b>🎨</b>Kreatif</div></div>
        <div class="notice">💬 Diskusi dimulai dari rasa ingin tahu. Yuk, gabung!</div>
      </div>
    </div></section>
    <section class="section wrap" id="komunitas"><h2>Jelajahi Komunitas</h2><p class="muted">Pilih minatmu dan temukan orang-orang yang satu frekuensi.</p>
      <div class="grid">${categories.map(c=>`<article class="card"><span class="emoji">${c[0]}</span><h3>${c[1]}</h3><p>${c[2]}</p></article>`).join('')}</div>
    </section>
    <section class="section wrap" id="tentang"><div class="card"><h2>Mulai perjalanan komunitasmu 🚀</h2><p class="muted">Buat akun untuk mulai menggunakan profil Wibisatia Web.</p><button class="btn primary" id="bottomJoin">Buat Akun Gratis →</button></div></section>
  </main>`);
  ['heroJoin','bottomJoin'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>showAuth('signup')));
}

function showAuth(nextMode = 'signup', message = '', isError = false) {
  mode = nextMode; notice = message; noticeError = isError;
  const isLogin = mode === 'login';
  shell(`<main class="wrap">
    <section class="authBox">
      <a class="muted" href="#" id="backHome">← Kembali ke beranda</a>
      <h2 id="authTitle">${isLogin?'Selamat datang kembali':'Gabung Wibisatia Web'}</h2>
      <p class="muted">${isLogin?'Masuk ke akun komunitasmu.':'Buat akun dan mulai bergabung dengan komunitas.'}</p>
      <div class="tabs"><button class="btn ${isLogin?'on':''}" id="loginTab">Masuk</button><button class="btn ${!isLogin?'on':''}" id="signupTab">Daftar</button></div>
      ${notice?`<div class="notice ${noticeError?'error':''}" role="status">${escapeHtml(notice)}</div>`:''}
      ${!configured?`<div class="notice error">Database belum dikonfigurasi. Ikuti langkah di README.md untuk menghubungkan Supabase sebelum mendaftar atau masuk.</div>`:''}
      <form id="authForm">
        <div class="field ${isLogin?'hidden':''}" id="nameField"><label for="displayName">Nama tampilan</label><input id="displayName" name="displayName" autocomplete="name" placeholder="Nama kamu" ${isLogin?'':'required'} maxlength="60"></div>
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" placeholder="nama@email.com" required></div>
        <div class="field"><label for="password">Kata sandi</label><input id="password" name="password" type="password" autocomplete="${isLogin?'current-password':'new-password'}" placeholder="Minimal 8 karakter" minlength="8" required></div>
        <button class="btn primary full" id="submitBtn" type="submit" ${configured?'':'disabled'}>${isLogin?'Masuk':'Buat akun'}</button>
      </form>
      <p class="muted" style="font-size:11px">Dengan melanjutkan, gunakan email yang kamu miliki dan kata sandi yang unik.</p>
    </section>
  </main>`);
  $('#backHome').addEventListener('click',e=>{e.preventDefault();home()});
  $('#loginTab').addEventListener('click',()=>showAuth('login'));
  $('#signupTab').addEventListener('click',()=>showAuth('signup'));
  $('#authForm').addEventListener('submit',handleAuth);
}

function $(selector){return document.querySelector(selector)}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

async function handleAuth(event) {
  event.preventDefault();
  if (!supabase) return;
  const form = new FormData(event.currentTarget);
  const email = String(form.get('email')).trim();
  const password = String(form.get('password'));
  const displayName = String(form.get('displayName') || '').trim();
  const button = $('#submitBtn');
  button.disabled = true; button.textContent = 'Memproses...';
  try {
    if (mode === 'signup') {
      if (displayName.length < 2) throw new Error('Nama tampilan harus terdiri dari minimal 2 karakter.');
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { display_name: displayName } }
      });
      if (error) throw error;
      if (data.session) {
        await renderDashboard(data.session);
      } else {
        showAuth('login', 'Pendaftaran diterima. Cek email untuk verifikasi, lalu masuk.');
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await renderDashboard(data.session);
    }
  } catch (error) {
    showAuth(mode, friendlyError(error.message), true);
  }
}

function friendlyError(message) {
  if (/invalid login credentials/i.test(message)) return 'Email atau kata sandi tidak cocok.';
  if (/user already registered/i.test(message)) return 'Email ini sudah terdaftar. Silakan masuk.';
  if (/password should be at least/i.test(message)) return 'Kata sandi terlalu pendek.';
  if (/email not confirmed/i.test(message)) return 'Verifikasi email terlebih dahulu sebelum masuk.';
  return message || 'Terjadi kesalahan. Coba lagi.';
}

async function renderDashboard(session) {
  currentSession = session;
  const { data: { user } } = await supabase.auth.getUser();
  const fallbackName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Anggota';
  const { data: profile } = await supabase.from('profiles').select('display_name,created_at').eq('id', user.id).maybeSingle();
  const name = profile?.display_name || fallbackName;
  shell(`<main class="wrap"><section class="authBox">
    <div class="profile"><div class="avatar">${escapeHtml(name.charAt(0).toUpperCase())}</div><div><h2>Halo, ${escapeHtml(name)}! 👋</h2><p class="muted">Kamu sudah masuk ke Wibisatia Web.</p></div></div>
    <div class="notice">Akun aktif: <strong>${escapeHtml(user.email || '')}</strong></div>
    <div class="card"><h3>Profil komunitas</h3><p class="muted">Nama: ${escapeHtml(name)}</p><p class="muted">ID akun: ${escapeHtml(user.id)}</p></div>
    <button class="btn primary full" id="signOut">Keluar dari akun</button>
    <button class="btn full" id="dashHome">Kembali ke beranda</button>
  </section></main>`);
  $('#signOut').addEventListener('click', async()=>{
    const {error}=await supabase.auth.signOut();
    if(error){showAuth('login',error.message,true);return}
    currentSession=null;home();showAuth('login','Kamu berhasil keluar.');
  });
  $('#dashHome').addEventListener('click',home);
}

async function init() {
  home();
  if (!configured) return;
  const {data:{session}} = await supabase.auth.getSession();
  if(session) await renderDashboard(session);
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') { currentSession=null; home(); }
  });
}
init();
