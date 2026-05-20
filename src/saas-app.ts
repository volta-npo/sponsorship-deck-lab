import { config } from './config.js';
import { addWorkspace, createSaasWorkspace, exportWorkspaceBundle, importWorkspaceBundle, recordWorkspaceExport, summarizeWorkspaceAnalytics, switchWorkspace } from './saas-workspace.js';

const key = `volta-oss:${config.slug}:saas-workspaces`;
let workspaceState = loadWorkspaceState();

function loadWorkspaceState() {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return createSaasWorkspace(config);
}

function saveWorkspaceState() {
  localStorage.setItem(key, JSON.stringify(workspaceState));
}

function estimateReadiness() {
  try {
    const raw = localStorage.getItem(`volta-oss:${config.slug}:workspace`);
    if (!raw) return 0;
    const state = JSON.parse(raw);
    const criteria = state.criteria || [];
    if (!criteria.length) return 0;
    return Math.round(criteria.filter((item) => item.status === 'approved').length / criteria.length * 100);
  } catch {
    return 0;
  }
}

function esc(value = '') {
  return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function download(name, content, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function renderSaasWorkspace() {
  let section = document.querySelector('#saas-workspace');
  if (!section) {
    document.querySelector('main')?.insertAdjacentHTML('afterbegin', '<section id="saas-workspace" class="panel saas-workspace" aria-label="SaaS workspace manager"></section>');
    section = document.querySelector('#saas-workspace');
  }
  const analytics = summarizeWorkspaceAnalytics(workspaceState, estimateReadiness());
  section.innerHTML = `
    <div class="v1-head">
      <div><p class="eyebrow">SaaS workspace layer</p><h2>Client portfolio dashboard</h2><p class="muted">Manage multiple clients, reviewer roles, export history, and local-first workspace bundles.</p></div>
      <div class="button-row no-print"><button id="saas-add" class="secondary">New Client</button><button id="saas-export">Export Bundle</button><label class="secondary button-like">Import Bundle<input id="saas-import" type="file" accept="application/json" hidden /></label></div>
    </div>
    <div class="v1-metrics">
      <article class="metric"><strong>${analytics.workspaceCount}</strong><span>Client workspaces</span><p>${esc(analytics.activeClient)}</p></article>
      <article class="metric"><strong>${analytics.memberCount}</strong><span>Team members</span><p>${analytics.roles.map((role) => `${role.role}: ${role.count}`).join(' · ')}</p></article>
      <article class="metric"><strong>${analytics.readiness}%</strong><span>Readiness</span><p>${analytics.exportCount} exports recorded</p></article>
    </div>
    <label>Active client<select id="saas-active">${workspaceState.workspaces.map((workspace) => `<option value="${esc(workspace.id)}" ${workspace.id === workspaceState.activeWorkspaceId ? 'selected' : ''}>${esc(workspace.name)} · ${esc(workspace.status)}</option>`).join('')}</select></label>`;
  document.querySelector('#saas-add')?.addEventListener('click', () => {
    const name = prompt('Client or workspace name?');
    if (!name) return;
    addWorkspace(workspaceState, name);
    saveWorkspaceState();
    renderSaasWorkspace();
  });
  document.querySelector('#saas-export')?.addEventListener('click', () => {
    recordWorkspaceExport(workspaceState, 'workspace-bundle');
    saveWorkspaceState();
    download(`${config.slug}-saas-workspace-bundle.json`, exportWorkspaceBundle(config, workspaceState, { readiness: analytics.readiness }));
    renderSaasWorkspace();
  });
  document.querySelector('#saas-active')?.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement;
    switchWorkspace(workspaceState, target.value);
    saveWorkspaceState();
    renderSaasWorkspace();
  });
  document.querySelector('#saas-import')?.addEventListener('change', async (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    const bundle = importWorkspaceBundle(config, await file.text());
    workspaceState = bundle.workspaceState;
    saveWorkspaceState();
    renderSaasWorkspace();
  });
}

renderSaasWorkspace();
