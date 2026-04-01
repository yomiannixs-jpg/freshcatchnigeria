
let adminSupabase = null;

function getAdminSupabase(){
  if (adminSupabase) return adminSupabase;
  const conf = window.APP_CONFIG || {};
  if (!window.supabase || !conf.supabaseUrl || conf.supabaseUrl.includes('YOUR_PROJECT') || !conf.supabaseAnonKey || conf.supabaseAnonKey.includes('YOUR_SUPABASE')) {
    return null;
  }
  adminSupabase = window.supabase.createClient(conf.supabaseUrl, conf.supabaseAnonKey);
  return adminSupabase;
}

function showAuthMessage(text, type=''){
  const el = document.getElementById('authMessage') || document.getElementById('adminNotice');
  if (!el) return;
  el.textContent = text;
  el.className = 'notice';
  if (type === 'success') el.classList.add('success');
  if (type === 'error') el.classList.add('error');
}

async function requireAdminAuth(){
  const supa = getAdminSupabase();
  if (!supa) {
    showAuthMessage('Set Supabase URL and anon key in config.js before using admin authentication.', 'error');
    return null;
  }
  const { data, error } = await supa.auth.getSession();
  if (error || !data.session) {
    window.location.href = './admin-login.html';
    return null;
  }
  const userEl = document.getElementById('adminUser');
  if (userEl) userEl.textContent = data.session.user.email || '';
  return data.session;
}

async function loginAdmin(email, password){
  const supa = getAdminSupabase();
  if (!supa) {
    showAuthMessage('Supabase is not configured yet.', 'error');
    return;
  }
  const { error } = await supa.auth.signInWithPassword({ email, password });
  if (error) {
    showAuthMessage(error.message, 'error');
    return;
  }
  window.location.href = window.APP_CONFIG?.adminRedirectAfterLogin || './admin.html';
}

async function signupAdmin(email, password){
  const supa = getAdminSupabase();
  if (!supa) {
    showAuthMessage('Supabase is not configured yet.', 'error');
    return;
  }
  const { error } = await supa.auth.signUp({ email, password });
  if (error) {
    showAuthMessage(error.message, 'error');
    return;
  }
  showAuthMessage('Account created. Check your email if confirmation is required, then log in.', 'success');
}

async function logoutAdmin(){
  const supa = getAdminSupabase();
  if (!supa) return;
  await supa.auth.signOut();
  window.location.href = './admin-login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      loginAdmin(
        document.getElementById('email').value.trim(),
        document.getElementById('password').value
      );
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      signupAdmin(
        document.getElementById('email').value.trim(),
        document.getElementById('password').value
      );
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutAdmin);
  }
});


async function getAdminAccessToken(){
  const supa = getAdminSupabase();
  if (!supa) return "";
  const { data } = await supa.auth.getSession();
  return data?.session?.access_token || "";
}
