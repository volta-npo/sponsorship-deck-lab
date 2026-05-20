export function validateDomainDefinition(domain) {
    for (const key of ['kind', 'title', 'purpose', 'fields', 'artifacts', 'checks']) {
        if (!domain[key] || (Array.isArray(domain[key]) && domain[key].length === 0))
            throw new Error(`missing domain.${key}`);
    }
    if (domain.fields.length < 4)
        throw new Error('domain tool needs at least 4 fields');
    if (domain.artifacts.length < 3)
        throw new Error('domain tool needs at least 3 artifacts');
    return true;
}
export function createDomainState(domain) {
    validateDomainDefinition(domain);
    const values = {};
    domain.fields.forEach((field, index) => { values[field.id] = field.default ?? (field.type === 'number' ? (index + 1) * 10 : field.type === 'color' ? '#2563eb' : field.type === 'date' ? '2026-03-10' : ''); });
    return {
        version: '3-domain',
        values,
        rows: domain.rows.map((row, index) => ({ id: `domain-row-${index + 1}`, label: row, value: index < 3 ? 'Complete draft' : '', score: index < 3 ? 8 : 0, approved: index < 2 })),
        generated: [],
        updatedAt: new Date().toISOString()
    };
}
export function calculateDomain(domain, state) {
    const nums = domain.fields.filter(f => f.type === 'number').map(f => Number(state.values[f.id] || 0));
    const sum = nums.reduce((a, b) => a + b, 0);
    const average = nums.length ? Math.round(sum / nums.length) : 0;
    const rows = state.rows || [];
    const rowScore = rows.length ? Math.round(rows.reduce((a, r) => a + Number(r.score || 0), 0) / (rows.length * 10) * 100) : 0;
    const approved = rows.filter(r => r.approved).length;
    const completeness = Math.round((Object.values(state.values || {}).filter(v => String(v).trim()).length / domain.fields.length) * 100);
    const kind = domain.kind;
    let primary = rowScore;
    let secondary = completeness;
    let insight = `${approved}/${rows.length} domain rows approved`;
    if (kind.includes('calculator') || kind === 'budget' || kind === 'cashflow' || kind === 'funnel-calculator') {
        primary = Math.max(0, Math.min(999, sum));
        secondary = average;
        insight = `Calculated from ${nums.length} numeric inputs`;
    }
    else if (kind.includes('calendar')) {
        primary = rows.filter(r => String(r.value).trim()).length;
        secondary = rowScore;
        insight = `${primary} dated milestones or deadlines populated`;
    }
    else if (kind.includes('matrix') || kind.includes('grader') || kind.includes('scorecard')) {
        primary = rowScore;
        secondary = approved;
        insight = `${approved} approved scoring rows`;
    }
    else if (kind.includes('builder') || kind.includes('lab') || kind.includes('pack') || kind.includes('editor')) {
        primary = completeness;
        secondary = rowScore;
        insight = `${domain.artifacts.length} generated artifacts available`;
    }
    return { primary, secondary, completeness, rowScore, approved, insight, releaseReady: completeness >= 80 && rowScore >= 75 };
}
export function buildAdvancedDomainModel(domain, state) {
    const calc = calculateDomain(domain, state);
    const values = state.values || {};
    const rows = state.rows || [];
    const approvedRows = rows.filter((row) => row.approved).length;
    const getNumber = (id, fallback = 0) => Number(values[id] || fallback);
    const threshold = getNumber('review-threshold', 85);
    const packages = ['Community', 'Growth', 'Anchor'].map((tier, index) => ({ tier, askAmount: (index + 1) * 2500, benefits: [`${tier} recognition`, 'Impact report', 'Volunteer/storytelling asset'], proofScore: Math.min(100, threshold + index * 5), nextStep: 'Attach proof, audience reach, use of funds, and objection responses' }));
    return { model: 'Sponsor revenue workspace', primaryOutput: 'tiered sponsor packages with proof-backed asks', dashboards: ['Pipeline value', 'Proof strength', 'Ask clarity'], workflows: ['Persona fit', 'Impact proofing', 'Package pricing', 'Outreach handoff'], records: packages, automationRules: ['Block packages without use-of-funds mapping', 'Require proof for every public claim'], enterpriseReadiness: calc.releaseReady && threshold >= 80 && approvedRows >= Math.ceil(rows.length / 2) };
}
export function generateDomainSaasPlan(config, domain, state) {
    const calc = calculateDomain(domain, state);
    const model = buildAdvancedDomainModel(domain, state);
    return { product: config.title, category: config.category, idealCustomer: config.persona || domain.sampleClient, planTiers: [{ name: 'Starter', price: 19, audience: 'single owner/operator', limits: '1 active workspace, local exports' }, { name: 'Team', price: 79, audience: 'student pod or small agency', limits: '10 clients, shared review queue, CSV/Markdown packs' }, { name: 'Chapter', price: 249, audience: 'Volta chapter or nonprofit cohort', limits: 'unlimited local workspaces, mentor dashboards, sponsor reporting' }], clientPortal: ['Client intake', 'Evidence locker', 'Approval center', 'Export archive'], analytics: model.dashboards, automations: model.automationRules, roadmap: ['Multi-client workspace switcher', 'Role-based mentor/owner review', 'Template library and reusable snippets', 'Scheduled reminders and status digests', 'Optional backend sync without weakening local-first privacy'], readinessScore: Math.min(100, Math.round(((calc.completeness + calc.rowScore) / 2 + (model.enterpriseReadiness ? 100 : 70)) / 2)) };
}
export function generateDomainArtifacts(config, domain, state) {
    const calc = calculateDomain(domain, state);
    const model = buildAdvancedDomainModel(domain, state);
    const values = Object.fromEntries(domain.fields.map(f => [f.label, state.values[f.id] || '']));
    return domain.artifacts.map((artifact, index) => ({
        id: `artifact-${index + 1}`,
        title: artifact,
        body: `${artifact} for ${config.title}: ${calc.insight}. SaaS-grade output: ${model.primaryOutput}. Key inputs: ${Object.entries(values).slice(0, 4).map(([k, v]) => `${k}: ${v || 'not set'}`).join('; ')}.`
    }));
}
export function buildDomainMarkdown(config, domain, state) {
    const calc = calculateDomain(domain, state);
    const model = buildAdvancedDomainModel(domain, state);
    const saas = generateDomainSaasPlan(config, domain, state);
    const lines = [`# ${config.title} Domain Tool Export`, '', `**Tool:** ${domain.title}`, `**Purpose:** ${domain.purpose}`, `**Readiness:** ${calc.releaseReady ? 'Ready' : 'Needs work'}`, `**Insight:** ${calc.insight}`, `**Advanced model:** ${model.model}`, `**SaaS readiness:** ${saas.readinessScore}/100`, '', '## Inputs'];
    domain.fields.forEach(f => lines.push(`- **${f.label}:** ${state.values[f.id] || 'Not set'}`));
    lines.push('', '## Work Items');
    state.rows.forEach(r => lines.push(`- ${r.approved ? '[x]' : '[ ]'} **${r.label}** — ${r.value || 'No value'} (${r.score}/10)`));
    lines.push('', '## Generated Artifacts');
    generateDomainArtifacts(config, domain, state).forEach(a => lines.push(`- **${a.title}:** ${a.body}`));
    lines.push('', '## SaaS Expansion Plan');
    saas.planTiers.forEach(tier => lines.push(`- **${tier.name} ($${tier.price}/mo):** ${tier.audience}; ${tier.limits}`));
    lines.push('', '## Automation Rules');
    model.automationRules.forEach(rule => lines.push(`- ${rule}`));
    lines.push('', '## Validation Checks');
    domain.checks.forEach(c => lines.push(`- ${c}`));
    return lines.join('\n');
}
export { buildSaasExpansionSuite, buildSaasSuiteMarkdown, summarizeSaasSuite } from './saas-suite.js';
export function applyDomainSample(domain) {
    const state = createDomainState(domain);
    domain.fields.forEach((field, index) => {
        if (field.type === 'number')
            state.values[field.id] = field.sample ?? (index + 2) * 15;
        else if (field.type === 'date')
            state.values[field.id] = field.sample ?? `2026-03-${String(index + 10).padStart(2, '0')}`;
        else
            state.values[field.id] = field.sample ?? `${field.label} sample`;
    });
    state.rows = state.rows.map((row, index) => ({ ...row, value: `${row.label} completed with sample evidence`, score: index < 6 ? 9 : 8, approved: true }));
    return state;
}
//# sourceMappingURL=domain-core.js.map