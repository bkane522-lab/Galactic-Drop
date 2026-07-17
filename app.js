'use strict';

const STORAGE_RELEASES = 'galactic-drop-releases-v4';
const STORAGE_FAVORITES = 'galactic-drop-favorites-v4';
const STORAGE_ANALYTICS = 'galactic-drop-analytics-v4';
const STORAGE_ACTIVE = 'galactic-drop-active-v4';
const APP_VERSION = '2.2.0-neon';

const publicArtistLinks = {
  spotify: 'https://open.spotify.com/artist/5S7JjkYJrksNO8EVfUSBUl',
  apple: 'https://music.apple.com/us/artist/1003914907'
};

const archiveLinks = {
  bamss2025: 'https://open.spotify.com/artist/2G8ibLWy13X2kQYMzueiyV',
  spotify2020: 'https://open.spotify.com/artist/4JZUArKBrDWvBWaLuUPYyq',
  spotify2015: 'https://open.spotify.com/artist/538XscJAEZopzl1B3xaglS'
};

const platforms = {
  spotify: { label: 'Spotify', icon: 'SP' },
  apple: { label: 'Apple Music', icon: 'AM' },
  youtube: { label: 'YouTube', icon: 'YT' },
  deezer: { label: 'Deezer', icon: 'DZ' },
  soundcloud: { label: 'SoundCloud', icon: 'SC' },
  bandcamp: { label: 'Bandcamp', icon: 'BC' },
  tiktok: { label: 'TikTok', icon: 'TK' },
  instagram: { label: 'Instagram', icon: 'IG' }
};

const defaultReleases = [
  {
    id: 'starlight-kizomba', title: 'STARLIGHT KIZOMBA', artist: 'DJ Kizomba Galactic', type: 'single', year: '2026', mood: 'Futuriste',
    description: 'Une Kizomba futuriste portée par une énergie profonde, élégante et cosmique.', cover: 'assets/cover-starlight-v2.png', audio: '',
    links: { spotify:'', apple:'', youtube:'', deezer:'', soundcloud:'', bandcamp:'', tiktok:'', instagram:'' }
  },
  {
    id: 'lovely', title: 'LOVELY', artist: 'DJ Kizomba Galactic', type: 'single', year: '2026', mood: 'Sensuel',
    description: 'Une fusion Kizomba chaude et immersive, pensée pour les danseurs et les vidéos courtes.', cover: 'assets/cover-lovely.svg', audio: '',
    links: { spotify:'https://open.spotify.com/track/14O3imAUWmx8ob6TdOWKng', apple:'', youtube:'', deezer:'', soundcloud:'', bandcamp:'', tiktok:'', instagram:'' }
  },
  {
    id: 'ma-vie', title: 'MA VIE', artist: 'DJ Kizomba Galactic', type: 'single', year: '2026', mood: 'Univers Kizomba',
    description: 'Titre officiel de DJ Kizomba Galactic disponible sur Spotify.', cover: 'assets/cover-ma-vie.svg', audio: '',
    links: { spotify:'https://open.spotify.com/track/4yavyNpvlCe7zJHC6Vhgxl', apple:'', youtube:'', deezer:'', soundcloud:'', bandcamp:'', tiktok:'', instagram:'' }
  },
  {
    id: 'voice-frequency', title: 'VOICE FREQUENCY', artist: 'DJ Kizomba Galactic', type: 'single', year: '2026', mood: 'Univers Kizomba',
    description: 'Titre officiel de DJ Kizomba Galactic disponible sur Spotify.', cover: 'assets/cover-voice-frequency.svg', audio: '',
    links: { spotify:'https://open.spotify.com/track/7geCEU7GAmAwdDUUeP40bc', apple:'', youtube:'', deezer:'', soundcloud:'', bandcamp:'', tiktok:'', instagram:'' }
  },
  {
    id: 'kiz-x-rayon-2', title: 'KIZ X RAYON 2', artist: 'DJ Kizomba Galactic', type: 'single', year: '2026', mood: 'Deep',
    description: 'Kizomba moderne, profondeur galactique et énergie de piste.', cover: 'assets/cover-rayon.svg', audio: '',
    links: { spotify:'', apple:'', youtube:'', deezer:'', soundcloud:'', bandcamp:'', tiktok:'', instagram:'' }
  },
  {
    id: 'waka-poka', title: 'WAKA POKA', artist: 'DJ Kizomba Galactic', type: 'single', year: '2026', mood: 'Afro Club',
    description: 'Un drop afro-électronique énergique, direct et fédérateur.', cover: 'assets/cover-waka.svg', audio: '',
    links: { spotify:'', apple:'', youtube:'', deezer:'', soundcloud:'', bandcamp:'', tiktok:'', instagram:'' }
  },
  {
    id: 'level-up', title: 'LEVEL UP', artist: 'DJ Kizomba Galactic', type: 'single', year: '2026', mood: 'Stadium',
    description: 'Une montée en puissance entre club, Afro et univers galactique.', cover: 'assets/cover-level.svg', audio: '',
    links: { spotify:'', apple:'', youtube:'', deezer:'', soundcloud:'', bandcamp:'', tiktok:'', instagram:'' }
  }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let releases = loadJson(STORAGE_RELEASES, defaultReleases);
let favorites = new Set(loadJson(STORAGE_FAVORITES, []));
let analytics = loadJson(STORAGE_ANALYTICS, { plays: 0, shares: 0, favorites: 0, platformClicks: {}, releaseViews: {} });
let activeRelease = releases.find(item => item.id === storageGet(STORAGE_ACTIVE)) || releases[0];
let activeFilter = 'all';
let promoMode = 'caption';
let deferredInstallPrompt = null;

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function storageGet(key) { try { return window.localStorage.getItem(key); } catch { return null; } }
function storageSet(key, value) { try { window.localStorage.setItem(key, value); return true; } catch { return false; } }
function loadJson(key, fallback) {
  try {
    const parsed = JSON.parse(storageGet(key));
    return parsed ?? clone(fallback);
  } catch { return clone(fallback); }
}
function saveState() {
  storageSet(STORAGE_RELEASES, JSON.stringify(releases));
  storageSet(STORAGE_FAVORITES, JSON.stringify([...favorites]));
  storageSet(STORAGE_ANALYTICS, JSON.stringify(analytics));
  storageSet(STORAGE_ACTIVE, activeRelease?.id || '');
}
function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
}
function validUrl(value = '') { return /^https?:\/\//i.test(value.trim()) ? value.trim() : ''; }
function slugify(value = '') { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}
function typeLabel(type) { return type === 'album' ? 'ALBUM / EP' : type === 'mix' ? 'MIX' : 'SINGLE'; }
function appUrl(release = activeRelease) {
  const base = location.href.split('#')[0].split('?')[0];
  return `${base}?drop=${encodeURIComponent(release.id)}`;
}
function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2300);
}
async function copyText(text, message = 'Copié') {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const area = document.createElement('textarea');
    area.value = text; document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
  }
  toast(message);
}
function incrementMetric(key, nestedKey) {
  if (nestedKey) analytics[key][nestedKey] = (analytics[key][nestedKey] || 0) + 1;
  else analytics[key] = (analytics[key] || 0) + 1;
  saveState();
  renderCommunityStats();
}

function routeTo(route) {
  $$('.screen').forEach(screen => screen.classList.toggle('active', screen.dataset.screen === route));
  $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.route === route));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', `#${route}`);
  if (route === 'explore') renderExplore();
  if (route === 'studio') renderStudioList();
  if (route === 'community') renderCommunityStats();
}

function renderHero() {
  if (!activeRelease) return;
  $('#heroCover').src = activeRelease.cover || 'assets/cover-default.svg';
  $('#heroCover').alt = `Pochette de ${activeRelease.title}`;
  $('#heroType').textContent = `NOUVEAU ${typeLabel(activeRelease.type)}`;
  $('#heroTitle').textContent = activeRelease.title;
  $('#heroArtist').textContent = activeRelease.artist || 'DJ Kizomba Galactic';
  $('#heroDescription').textContent = activeRelease.description || 'Nouvelle sortie de DJ Kizomba Galactic.';
  $('#favoriteButton').classList.toggle('active', favorites.has(activeRelease.id));
  $('#favoriteButton').setAttribute('aria-label', favorites.has(activeRelease.id) ? 'Retirer des favoris' : 'Ajouter aux favoris');
  const audio = $('#audioPlayer');
  audio.pause();
  const audioUrl = validUrl(activeRelease.audio);
  if (audioUrl) audio.src = audioUrl;
  else { audio.removeAttribute('src'); audio.load(); }
  $('#heroPlay').classList.remove('playing');
  $('#heroPlay').innerHTML = playIcon();
  $('#listenMainButton').innerHTML = `${playIcon()} ÉCOUTER`;
  $('#audioProgress').value = 0;
  $('#currentTime').textContent = '0:00';
  $('#duration').textContent = '0:00';
  renderPlatforms();
  renderHomeTracks();
  analytics.releaseViews[activeRelease.id] = (analytics.releaseViews[activeRelease.id] || 0) + 1;
  saveState();
}

function playIcon() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7 8 5-8 5z"/></svg>'; }
function pauseIcon() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7v10M15 7v10"/></svg>'; }
function heartIcon() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.1a5 5 0 0 0 0-7.1Z"/></svg>'; }

function toggleAudio() {
  const audio = $('#audioPlayer');
  if (!audio.getAttribute('src')) {
    const firstLink = Object.entries(activeRelease.links || {}).find(([, value]) => validUrl(value));
    if (firstLink) openPlatform(firstLink[0], firstLink[1]);
    else toast('Ajoute un extrait audio ou un lien d’écoute dans le Studio');
    return;
  }
  if (audio.paused) {
    audio.play().then(() => {
      $('#heroPlay').classList.add('playing');
      $('#heroPlay').innerHTML = pauseIcon();
      $('#listenMainButton').innerHTML = `${pauseIcon()} PAUSE`;
      incrementMetric('plays');
    }).catch(() => toast('Impossible de lire cet extrait'));
  } else {
    audio.pause();
    $('#heroPlay').classList.remove('playing');
    $('#heroPlay').innerHTML = playIcon();
    $('#listenMainButton').innerHTML = `${playIcon()} ÉCOUTER`;
  }
}

function renderPlatforms() {
  const grid = $('#platformGrid');
  grid.innerHTML = '';
  Object.entries(platforms).slice(0, 6).forEach(([key, platform]) => {
    const releaseUrl = validUrl(activeRelease.links?.[key]);
    const publicUrl = validUrl(publicArtistLinks[key] || '');
    const url = releaseUrl || publicUrl;
    const status = releaseUrl ? 'Ouvrir la sortie' : publicUrl ? 'Profil artiste' : 'À connecter';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `platform-card${url ? ' connected' : ''}`;
    button.innerHTML = `<span class="platform-icon">${platform.icon}</span><span><strong>${platform.label}</strong><small>${status}</small></span>`;
    button.addEventListener('click', () => url ? openPlatform(key, url) : openEditor(activeRelease));
    grid.append(button);
  });
}
function openPlatform(key, url) {
  incrementMetric('platformClicks', key);
  window.open(url, '_blank', 'noopener');
}

function renderHomeTracks() {
  const container = $('#homeTrackList');
  container.innerHTML = '';
  releases.filter(item => item.id !== activeRelease.id).slice(0, 3).forEach(release => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'mini-track';
    button.innerHTML = `<img src="${escapeHtml(release.cover || 'assets/cover-default.svg')}" alt=""><span><strong>${escapeHtml(release.title)}</strong><small>${escapeHtml(release.mood || typeLabel(release.type))} · ${escapeHtml(release.year || '')}</small></span><span class="track-play">${playIcon()}</span>`;
    button.addEventListener('click', () => selectRelease(release, true));
    container.append(button);
  });
}

function selectRelease(release, goHome = false) {
  activeRelease = release;
  saveState();
  renderHero();
  if (goHome) routeTo('listen');
}

function renderExplore() {
  const query = ($('#searchInput').value || '').trim().toLowerCase();
  const filtered = releases.filter(release => {
    const matchesType = activeFilter === 'all' || (activeFilter === 'favorite' ? favorites.has(release.id) : release.type === activeFilter);
    const text = `${release.title} ${release.artist} ${release.description} ${release.mood}`.toLowerCase();
    return matchesType && text.includes(query);
  });
  $('#releaseCount').textContent = `${filtered.length} son${filtered.length > 1 ? 's' : ''}`;
  const grid = $('#releaseGrid'); grid.innerHTML = '';
  filtered.forEach(release => {
    const card = document.createElement('article'); card.className = 'release-card';
    card.innerHTML = `<img src="${escapeHtml(release.cover || 'assets/cover-default.svg')}" alt="Pochette de ${escapeHtml(release.title)}"><button type="button" class="card-favorite ${favorites.has(release.id) ? 'active' : ''}" aria-label="Favori">${heartIcon()}</button><div class="release-card-body"><span class="release-type">${typeLabel(release.type)}</span><h3>${escapeHtml(release.title)}</h3><p>${escapeHtml(release.mood || release.artist)}</p></div>`;
    card.addEventListener('click', event => {
      if (event.target.closest('.card-favorite')) return;
      selectRelease(release, true);
    });
    $('.card-favorite', card).addEventListener('click', () => toggleFavorite(release.id));
    grid.append(card);
  });
  $('#emptyState').hidden = filtered.length > 0;
}

function toggleFavorite(id = activeRelease.id) {
  if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
  analytics.favorites = favorites.size;
  saveState();
  renderHero(); renderExplore(); renderCommunityStats();
  toast(favorites.has(id) ? 'Ajouté aux favoris' : 'Retiré des favoris');
}

function renderStudioList() {
  const container = $('#studioReleaseList'); container.innerHTML = '';
  releases.forEach(release => {
    const row = document.createElement('article'); row.className = 'studio-release';
    row.innerHTML = `<img src="${escapeHtml(release.cover || 'assets/cover-default.svg')}" alt=""><span><strong>${escapeHtml(release.title)}</strong><small>${typeLabel(release.type)} · ${escapeHtml(release.year || '')}</small></span><span class="release-menu"><button type="button" aria-label="Modifier">${editIcon()}</button><button type="button" class="danger" aria-label="Supprimer">${trashIcon()}</button></span>`;
    const [editButton, deleteButton] = $$('.release-menu button', row);
    editButton.addEventListener('click', () => openEditor(release));
    deleteButton.addEventListener('click', () => deleteRelease(release));
    container.append(row);
  });
}
function editIcon() { return '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4"/></svg>'; }
function trashIcon() { return '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"/></svg>'; }

function openEditor(release = null) {
  const form = $('#releaseForm'); form.reset();
  $('#releaseEditorTitle').textContent = release ? 'Modifier la sortie' : 'Ajouter une sortie';
  form.elements.id.value = release?.id || '';
  if (release) {
    ['title','type','year','mood','description','cover','audio'].forEach(key => form.elements[key].value = release[key] || '');
    Object.keys(platforms).forEach(key => form.elements[key].value = release.links?.[key] || '');
  } else form.elements.year.value = String(new Date().getFullYear());
  $('#releaseEditorModal').showModal();
}

function saveReleaseFromForm(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const id = data.id || `${slugify(data.title)}-${Date.now().toString().slice(-5)}`;
  const release = {
    id, title: data.title.trim(), artist: 'DJ Kizomba Galactic', type: data.type, year: data.year.trim() || String(new Date().getFullYear()),
    mood: data.mood.trim(), description: data.description.trim(), cover: validUrl(data.cover) || (releases.find(item => item.id === id)?.cover || 'assets/cover-default.svg'),
    audio: validUrl(data.audio), links: {}
  };
  Object.keys(platforms).forEach(key => release.links[key] = validUrl(data[key]));
  const index = releases.findIndex(item => item.id === id);
  if (index >= 0) releases[index] = release; else releases.unshift(release);
  activeRelease = release;
  saveState(); renderHero(); renderExplore(); renderStudioList(); populatePromoSelect();
  $('#releaseEditorModal').close();
  toast(index >= 0 ? 'Sortie mise à jour' : 'Sortie ajoutée');
}

function deleteRelease(release) {
  if (releases.length <= 1) { toast('Il faut conserver au moins une sortie'); return; }
  if (!confirm(`Supprimer « ${release.title} » de cet appareil ?`)) return;
  releases = releases.filter(item => item.id !== release.id);
  favorites.delete(release.id);
  if (activeRelease.id === release.id) activeRelease = releases[0];
  saveState(); renderHero(); renderExplore(); renderStudioList(); populatePromoSelect();
  toast('Sortie supprimée');
}

function shareRelease(release = activeRelease) {
  incrementMetric('shares');
  const data = { title: `${release.title} — DJ Kizomba Galactic`, text: `Écoute ${release.title}, le nouveau drop de DJ Kizomba Galactic.`, url: appUrl(release) };
  if (navigator.share) navigator.share(data).catch(() => {});
  else copyText(`${data.text}\n${data.url}`, 'Lien de la sortie copié');
}
function shareApp() {
  incrementMetric('shares');
  const data = { title: 'Galactic Drop', text: 'Découvre les sorties de DJ Kizomba Galactic.', url: location.href.split('#')[0] };
  if (navigator.share) navigator.share(data).catch(() => {});
  else copyText(`${data.text}\n${data.url}`, 'Lien de l’application copié');
}

function populatePromoSelect() {
  const select = $('#promoReleaseSelect'); select.innerHTML = '';
  releases.forEach(release => {
    const option = document.createElement('option'); option.value = release.id; option.textContent = release.title; select.append(option);
  });
  select.value = activeRelease.id;
  renderPromo();
}
function promoRelease() { return releases.find(item => item.id === $('#promoReleaseSelect').value) || activeRelease; }
function renderPromo() {
  const release = promoRelease();
  let content = '';
  if (promoMode === 'caption') {
    content = `🚀 NOUVEAU DROP : ${release.title}\n\n${release.description || 'Le nouvel univers de DJ Kizomba Galactic est disponible.'}\n\n🎧 Écoute maintenant : ${appUrl(release)}\n\nCrée ta vidéo, partage le son et identifie @DJKizombaGalactic pour être repartagé.\n\nUn son. Tous les réseaux. Une seule destination.`;
  } else if (promoMode === 'hashtags') {
    content = '#DJKizombaGalactic #GalacticDrop #Kizomba #UrbanKiz #KizombaMusic #KizombaDance #Tarraxo #AfroElectronic #NewMusic #IndependentArtist #DanceMusic #KizombaLovers';
  } else {
    content = `J-14 — annoncer le titre et montrer un détail de la pochette\nJ-7 — publier un extrait de 10 à 15 secondes\nJ-3 — lancer le compte à rebours et partager le lien unique\nJour J — publier le Reel principal + Story + WhatsApp\nJ+2 — repartager les premières vidéos de danseurs\nJ+7 — publier un extrait différent et remercier la communauté\nJ+14 — partager les coulisses ou une version DJ`;
  }
  $('#promoOutput').textContent = content;
}

function renderAnalytics() {
  const clicks = Object.values(analytics.platformClicks || {}).reduce((sum, value) => sum + value, 0);
  const views = Object.values(analytics.releaseViews || {}).reduce((sum, value) => sum + value, 0);
  const cards = [
    ['Lectures', analytics.plays || 0, 'Extraits lancés dans l’application'],
    ['Partages', analytics.shares || 0, 'Partages ou copies de liens'],
    ['Clics plateformes', clicks, 'Ouvertures Spotify, YouTube, etc.'],
    ['Vues de sorties', views, 'Ouvertures des fiches sur cet appareil']
  ];
  $('#analyticsGrid').innerHTML = cards.map(([label, value, note]) => `<article class="analytics-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`).join('');
}
function renderCommunityStats() {
  $('#favoriteCount').textContent = favorites.size;
  $('#shareCount').textContent = analytics.shares || 0;
  $('#playCount').textContent = analytics.plays || 0;
}

function exportData() {
  const payload = { app: 'Galactic Drop', version: APP_VERSION, exportedAt: new Date().toISOString(), releases, favorites: [...favorites], analytics };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = `galactic-drop-sauvegarde-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(url);
  toast('Sauvegarde téléchargée');
}
function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result);
      if (!Array.isArray(payload.releases) || !payload.releases.length) throw new Error('Format invalide');
      releases = payload.releases;
      favorites = new Set(Array.isArray(payload.favorites) ? payload.favorites : []);
      analytics = payload.analytics || { plays:0, shares:0, favorites:0, platformClicks:{}, releaseViews:{} };
      activeRelease = releases[0]; saveState(); renderAll(); $('#dataModal').close(); toast('Sauvegarde restaurée');
    } catch { toast('Ce fichier de sauvegarde est invalide'); }
  };
  reader.readAsText(file);
}
function resetCatalogue() {
  if (!confirm('Revenir au catalogue de démonstration ? Les modifications locales seront supprimées.')) return;
  releases = clone(defaultReleases); favorites = new Set(); activeRelease = releases[0];
  analytics = { plays:0, shares:0, favorites:0, platformClicks:{}, releaseViews:{} };
  saveState(); renderAll(); $('#dataModal').close(); toast('Catalogue réinitialisé');
}

function loadFromQuery() {
  const id = new URLSearchParams(location.search).get('drop');
  const found = releases.find(item => item.id === id);
  if (found) activeRelease = found;
}
function renderAll() {
  renderHero(); renderExplore(); renderStudioList(); renderCommunityStats(); populatePromoSelect();
}

function bindEvents() {
  $$('[data-route]').forEach(button => button.addEventListener('click', () => routeTo(button.dataset.route)));
  $('#heroPlay').addEventListener('click', toggleAudio);
  $('#listenMainButton').addEventListener('click', toggleAudio);
  $('#favoriteButton').addEventListener('click', () => toggleFavorite());
  $('#shareReleaseButton').addEventListener('click', () => shareRelease());
  $('#shareAppButton').addEventListener('click', shareApp);
  $('#shareCommunityButton').addEventListener('click', shareApp);
  $('#platformSettingsButton').addEventListener('click', () => openEditor(activeRelease));
  $('#searchInput').addEventListener('input', renderExplore);
  $$('.mood-chip').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter; $$('.mood-chip').forEach(item => item.classList.toggle('active', item === button)); renderExplore();
  }));
  $('#openReleaseEditor').addEventListener('click', () => openEditor());
  $('#releaseForm').addEventListener('submit', saveReleaseFromForm);
  $('#openPromoTool').addEventListener('click', () => { populatePromoSelect(); $('#promoModal').showModal(); });
  $('#smartLinkTool').addEventListener('click', () => copyText(appUrl(), 'Smart Link copié'));
  $('#openAnalytics').addEventListener('click', () => { renderAnalytics(); $('#analyticsModal').showModal(); });
  $('#openDataManager').addEventListener('click', () => $('#dataModal').showModal());
  $('#copyBookingButton').addEventListener('click', () => copyText('@DJKizombaGalactic', 'Compte Instagram copié'));
  $('#toggleArchivesButton').addEventListener('click', () => {
    const section = $('#musicArchives');
    const isOpen = !section.hidden;
    section.hidden = isOpen;
    $('#toggleArchivesButton').setAttribute('aria-expanded', String(!isOpen));
    if (!isOpen) section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('#aboutAppButton').addEventListener('click', () => $('#aboutModal').showModal());
  $$('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
  $$('.promo-tab').forEach(button => button.addEventListener('click', () => {
    promoMode = button.dataset.promo; $$('.promo-tab').forEach(item => item.classList.toggle('active', item === button)); renderPromo();
  }));
  $('#promoReleaseSelect').addEventListener('change', renderPromo);
  $('#copyPromoButton').addEventListener('click', () => copyText($('#promoOutput').textContent, 'Contenu promotionnel copié'));
  $('#resetAnalyticsButton').addEventListener('click', () => {
    if (!confirm('Réinitialiser les statistiques locales ?')) return;
    analytics = { plays:0, shares:0, favorites:favorites.size, platformClicks:{}, releaseViews:{} }; saveState(); renderAnalytics(); renderCommunityStats(); toast('Statistiques réinitialisées');
  });
  $('#exportDataButton').addEventListener('click', exportData);
  $('#importDataInput').addEventListener('change', event => event.target.files[0] && importData(event.target.files[0]));
  $('#resetCatalogueButton').addEventListener('click', resetCatalogue);
  const audio = $('#audioPlayer');
  audio.addEventListener('loadedmetadata', () => $('#duration').textContent = formatTime(audio.duration));
  audio.addEventListener('timeupdate', () => {
    $('#currentTime').textContent = formatTime(audio.currentTime);
    $('#audioProgress').value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  });
  audio.addEventListener('ended', () => { $('#heroPlay').classList.remove('playing'); $('#heroPlay').innerHTML = playIcon(); $('#listenMainButton').innerHTML = `${playIcon()} ÉCOUTER`; });
  $('#audioProgress').addEventListener('input', event => { if (audio.duration) audio.currentTime = (event.target.value / 100) * audio.duration; });

  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstallPrompt = event; $('#installButton').hidden = false; });
  $('#installButton').addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; $('#installButton').hidden = true;
  });
  window.addEventListener('appinstalled', () => toast('Galactic Drop est installé'));
}

loadFromQuery();
bindEvents();
renderAll();
const initialRoute = location.hash.replace('#','');
if (['listen','explore','studio','community','profile'].includes(initialRoute)) routeTo(initialRoute);
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
