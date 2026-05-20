function text(state, id, fallback = '') {
    return String(state.values?.[id] || fallback);
}
function num(state, id, fallback = 0) {
    const value = Number(state.values?.[id] || fallback);
    return Number.isFinite(value) ? value : fallback;
}
function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next.toISOString().slice(0, 10);
}
function rowCards(domain, state) {
    return (state.rows || []).map((row, index) => ({
        id: row.id || `suite-row-${index + 1}`,
        label: row.label,
        status: row.approved ? 'approved' : row.value ? 'draft' : 'missing',
        score: Number(row.score || 0),
        owner: text(state, 'owner-reviewer', 'Volta reviewer'),
        evidence: row.value || `Evidence needed for ${row.label}`
    }));
}
function base(domain, state, summary) {
    const records = rowCards(domain, state);
    return {
        standaloneSaas: true,
        productSuite: ['Client portal', 'Team review queue', 'Evidence locker', 'Export center', 'Analytics console'],
        title: domain.title,
        summary,
        modules: [],
        workflows: [],
        dashboards: [],
        metrics: [],
        automations: [],
        exports: ['workspace bundle JSON', 'owner handoff Markdown', 'CSV operating tables', 'audit log digest'],
        risks: ['missing owner approval', 'unverified evidence', 'stale assumptions'],
        pricing: [
            { tier: 'Starter', price: 19, includes: 'single client workspace and local exports' },
            { tier: 'Team', price: 79, includes: '10 client workspaces, mentor review, reusable templates' },
            { tier: 'Chapter', price: 249, includes: 'portfolio dashboards, cohort reporting, shared playbooks' }
        ],
        roadmap: ['shared user accounts', 'optional encrypted sync', 'scheduled reminders', 'public API adapters'],
        records
    };
}
export function buildSaasExpansionSuite(domain, state) {
    const client = text(state, 'organization-client', domain.sampleClient || 'Client');
    const goal = text(state, 'primary-goal', domain.purpose);
    const rows = rowCards(domain, state);
    const suite = base(domain, state, `${client}: ${goal}`);
    if (domain.kind === 'funnel-calculator') {
        const monthlyVolume = num(state, 'monthly-volume', 120);
        const value = num(state, 'dollar-value-cost', 45);
        const confidence = Math.max(0.1, Math.min(1, num(state, 'confidence-percent', 80) / 100));
        const stages = ['Visitors', 'Leads', 'Qualified', 'Proposal', 'Won'].map((stage, index) => {
            const conversion = Math.max(8, 72 - index * 13);
            const entrants = Math.round(monthlyVolume * Math.pow(0.62, index));
            const exits = Math.round(entrants * conversion / 100);
            const lost = Math.max(0, entrants - exits);
            const leakValue = Math.round(lost * value * confidence);
            return { stage, entrants, exits, conversion, lost, leakValue, sensitivity: { conservative: Math.round(leakValue * 0.65), base: leakValue, aggressive: Math.round(leakValue * 1.35) } };
        });
        return {
            ...suite,
            modules: ['Funnel stage modeler', 'Leak value estimator', 'Experiment backlog', 'Scenario sensitivity lab', 'Owner ROI board'],
            workflows: ['Map traffic sources', 'Quantify stage dropoff', 'Prioritize leak experiments', 'Assign owner and threshold', 'Review recovered revenue'],
            dashboards: ['Stage conversion waterfall', 'Monthly leak value', 'Experiment readiness', 'Sensitivity spread'],
            metrics: [
                { label: 'estimatedMonthlyLeak', value: stages.reduce((sum, stage) => sum + stage.leakValue, 0) },
                { label: 'highestLeakStage', value: stages.slice().sort((a, b) => b.leakValue - a.leakValue)[0].stage },
                { label: 'confidenceAdjustedValue', value: confidence }
            ],
            automations: ['Flag leaks above $500/month', 'Create 14-day experiment from highest leak', 'Require metric, duration, threshold, owner, rollback', 'Generate owner-safe finance disclaimer'],
            exports: [...suite.exports, 'funnel waterfall CSV', 'experiment backlog CSV', 'ROI scenario Markdown'],
            risks: [...suite.risks, 'conversion assumption not evidence-backed', 'experiment has no rollback rule'],
            records: stages.map((stage, index) => ({ ...stage, experiment: rows[index % rows.length]?.label || 'Conversion test', owner: text(state, 'owner-reviewer', 'Owner') }))
        };
    }
    if (domain.kind === 'cashflow') {
        const startingCash = num(state, 'dollar-value-cost', 2500);
        const inflow = Math.round(num(state, 'monthly-volume', 120) * 12);
        const expense = Math.round(num(state, 'minutes-per-item', 15) * 35);
        const floor = Math.round(startingCash * 0.35);
        const records = Array.from({ length: 13 }, (_, index) => {
            const week = index + 1;
            const recurringInflow = week % 2 === 0 ? inflow : Math.round(inflow * 0.45);
            const recurringExpense = expense + (week % 4 === 0 ? Math.round(expense * 1.8) : 0);
            const baseCash = Math.round(startingCash + (recurringInflow - recurringExpense) * week);
            return { week, recurringInflow, recurringExpense, conservative: Math.round(baseCash * 0.82), base: baseCash, optimistic: Math.round(baseCash * 1.15), floorAlert: baseCash < floor, ownerAction: baseCash < floor ? 'pull expense lever or accelerate receivables' : 'monitor' };
        });
        return {
            ...suite,
            modules: ['13-week forecast engine', 'Recurring item scheduler', 'Cash floor alerting', 'Scenario comparison', 'Owner decision memo'],
            workflows: ['Capture assumptions', 'Classify recurring inflows', 'Classify recurring expenses', 'Review floor alerts', 'Export owner summary'],
            dashboards: ['Runway by week', 'Cash floor alerts', 'Scenario spread', 'Receivable dependency'],
            metrics: [
                { label: 'runwayWeeks', value: records.filter((week) => week.base >= 0).length },
                { label: 'floorAlerts', value: records.filter((week) => week.floorAlert).length },
                { label: 'endingCash', value: records[12].base }
            ],
            automations: ['Escalate weeks below safety floor', 'Require label/source for every recurring assumption', 'Suggest owner actions for negative weeks', 'Create weekly review reminders'],
            exports: [...suite.exports, '13-week forecast CSV', 'scenario comparison JSON', 'owner cash memo Markdown'],
            records
        };
    }
    if (domain.kind === 'deck-builder') {
        const threshold = num(state, 'review-threshold', 85);
        const tiers = ['Community', 'Growth', 'Anchor', 'Legacy'].map((tier, index) => ({ tier, askAmount: (index + 1) * 2500, proofScore: Math.min(100, threshold + index * 3), benefits: ['logo placement', 'impact story', 'volunteer moment', 'sponsor report'].slice(0, index + 1), inventory: 8 - index }));
        const slides = ['Problem and audience', 'Community proof', 'Program model', 'Sponsor tiers', 'Use of funds', 'Activation plan', 'Measurement', 'Next step'].map((title, index) => ({ slide: index + 1, title, proofRequired: index !== 7, owner: text(state, 'owner-reviewer', 'Deck owner') }));
        return {
            ...suite,
            modules: ['Sponsor tier calculator', 'Deck outline builder', 'Prospect CRM', 'Benefit inventory', 'Objection-response bank'],
            workflows: ['Define sponsor persona', 'Map proof to claims', 'Price tiers', 'Build outreach sequence', 'Track prospect stage'],
            dashboards: ['Pipeline value', 'Proof strength', 'Benefit inventory', 'Ask clarity'],
            metrics: [{ label: 'pipelineValue', value: tiers.reduce((sum, tier) => sum + tier.askAmount, 0) }, { label: 'deckSlides', value: slides.length }, { label: 'averageProof', value: Math.round(tiers.reduce((sum, tier) => sum + tier.proofScore, 0) / tiers.length) }],
            automations: ['Block claims without proof', 'Warn when benefits exceed inventory', 'Generate sponsor follow-up sequence', 'Flag asks without use-of-funds mapping'],
            exports: [...suite.exports, 'sponsor tier CSV', 'deck outline Markdown', 'prospect CRM CSV', 'objection bank JSON'],
            records: tiers,
            deckSlides: slides,
            prospectStages: ['identified', 'qualified', 'contacted', 'meeting booked', 'proposal sent', 'closed won']
        };
    }
    if (domain.kind === 'calendar' || domain.kind === 'content-calendar') {
        const start = new Date(text(state, 'start-date', '2026-03-10'));
        const cadence = Math.max(1, num(state, 'cadence-days', 7));
        const count = domain.kind === 'content-calendar' ? 90 : 18;
        const records = Array.from({ length: count }, (_, index) => ({ date: addDays(start, index * cadence), label: rows[index % rows.length]?.label || 'Scheduled work', owner: text(state, 'owner-reviewer', 'Owner'), channel: domain.kind === 'content-calendar' ? ['Instagram', 'Email', 'Web', 'Google Business Profile'][index % 4] : 'Compliance', approval: index % 5 === 0 ? 'owner-review' : 'ready', evidenceDue: addDays(start, index * cadence - num(state, 'review-buffer-days', 3)) }));
        const isContent = domain.kind === 'content-calendar';
        return {
            ...suite,
            modules: isContent ? ['30/60/90 calendar generator', 'Channel constraint engine', 'Approval workflow', 'Backend scoring adapter', 'Publishing export hub'] : ['Recurring rule engine', 'ICS generator', 'Jurisdiction library', 'Evidence retention log', 'Overdue escalation center'],
            workflows: isContent ? ['Capture owner voice', 'Generate 90-day calendar', 'Route approvals', 'Export channel plans', 'Sync backend score'] : ['Select jurisdiction', 'Generate recurrence', 'Assign evidence owner', 'Export ICS', 'Escalate overdue items'],
            dashboards: isContent ? ['Cadence health', 'Approval queue', 'Local hook coverage', 'Channel mix'] : ['Deadline coverage', 'Overdue risk', 'Evidence readiness', 'Jurisdiction map'],
            metrics: [{ label: isContent ? 'scheduledPosts' : 'scheduledDeadlines', value: records.length }, { label: 'approvalQueue', value: records.filter((record) => record.approval === 'owner-review').length }, { label: 'cadenceDays', value: cadence }],
            automations: isContent ? ['Block publishing without owner approval', 'Flag channels missing CTA', 'Generate 30/60/90 CSV views', 'Prepare optional backend scoring payload'] : ['Generate standards-compliant ICS entries', 'Escalate before evidence due date', 'Require legal disclaimer', 'Create completion log reminders'],
            exports: [...suite.exports, isContent ? '30/60/90 content CSV' : 'ICS calendar file', 'approval queue CSV', 'evidence log Markdown'],
            records,
            backendContract: isContent ? { endpoint: '/score', payload: ['client', 'channel', 'localHook', 'approvalStatus'] } : undefined
        };
    }
    if (domain.kind === 'interview') {
        const script = ['Origin', 'Turning point', 'Customer promise', 'Community role', 'Proof moment', 'Future vision'].map((section, index) => ({ section, question: `What should customers understand about your ${section.toLowerCase()}?`, consentGate: index > 1, quoteTag: ['mission', 'trust', 'proof'][index % 3] }));
        return {
            ...suite,
            modules: ['Branching interview script', 'Consent state machine', 'Quote approval CRM', 'Sensitive-topic redaction', 'Story arc builder'],
            workflows: ['Prepare script', 'Capture consent', 'Tag quotes', 'Route founder approvals', 'Export channel story pack'],
            dashboards: ['Consent coverage', 'Quote quality', 'Story arc completion', 'Redaction queue'],
            metrics: [{ label: 'scriptSections', value: script.length }, { label: 'consentGates', value: script.filter((item) => item.consentGate).length }, { label: 'approvedQuotes', value: rows.filter((row) => row.status === 'approved').length }],
            automations: ['Block quote export until channel consent is approved', 'Flag sensitive topics for mentor review', 'Generate founder-safe paraphrases', 'Produce quote approval sheet'],
            exports: [...suite.exports, 'interview script Markdown', 'quote approval CSV', 'redaction log JSON', 'story pack Markdown'],
            records: script,
            consentStates: ['not requested', 'requested', 'approved for internal', 'approved for public', 'revoked']
        };
    }
    if (domain.kind === 'caption-lab') {
        const platforms = [{ name: 'Instagram', max: 2200 }, { name: 'Facebook', max: 63206 }, { name: 'Google Business Profile', max: 1500 }, { name: 'SMS', max: 160 }];
        const glossary = ['neighborhood phrase', 'owner voice', 'local landmark', 'seasonal hook', 'bilingual CTA'].map((term) => ({ term, approved: true, reviewer: text(state, 'owner-reviewer', 'Reviewer') }));
        return {
            ...suite,
            modules: ['Locale glossary', 'Caption variant engine', 'Translation-review workflow', 'Platform validators', 'Bias/stereotype checker'],
            workflows: ['Build tone card', 'Generate locale variants', 'Validate platform fit', 'Route translation review', 'Capture owner approval'],
            dashboards: ['Local voice fit', 'CTA coverage', 'Translation review queue', 'Platform length health'],
            metrics: [{ label: 'glossaryTerms', value: glossary.length }, { label: 'platformValidators', value: platforms.length }, { label: 'reviewQueue', value: rows.filter((row) => row.label.toLowerCase().includes('review')).length }],
            automations: ['Flag generic phrasing', 'Require bilingual reviewer', 'Warn when caption exceeds platform limit', 'Block stereotypes and unsupported cultural claims'],
            exports: [...suite.exports, 'locale glossary CSV', 'caption variants JSON', 'platform validation report Markdown'],
            records: platforms,
            glossary
        };
    }
    if (domain.kind === 'channel-pack') {
        const facts = ['event name', 'date', 'time', 'location', 'price', 'deadline', 'contact', 'accessibility note'].map((fact, index) => ({ fact, status: index < 4 ? 'confirmed' : 'needs-owner-check', source: text(state, 'evidence-source', 'flyer intake') }));
        const channels = ['Instagram caption', 'Facebook post', 'Email blurb', 'Web snippet', 'SMS reminder', 'Alt text'].map((channel) => ({ channel, requiredFacts: facts.filter((fact) => fact.status === 'confirmed').length, ready: channel === 'Alt text' || facts.filter((fact) => fact.status === 'confirmed').length >= 4 }));
        return {
            ...suite,
            modules: ['Manual/OCR intake', 'Fact confirmation queue', 'Channel adapter engine', 'Alt-text assistant', 'Event validator'],
            workflows: ['Capture source flyer', 'Confirm extracted facts', 'Generate channel copy', 'Write image accessibility text', 'Export owner-ready pack'],
            dashboards: ['Fact completeness', 'Channel readiness', 'Accessibility coverage', 'Owner confirmation queue'],
            metrics: [{ label: 'confirmedFacts', value: facts.filter((fact) => fact.status === 'confirmed').length }, { label: 'channelAssets', value: channels.length }, { label: 'ownerChecks', value: facts.filter((fact) => fact.status !== 'confirmed').length }],
            automations: ['Block event posts without date/time/location', 'Require alt text for image posts', 'Flag price/deadline ambiguity', 'Generate channel-specific formatting'],
            exports: [...suite.exports, 'confirmed facts CSV', 'channel copy pack Markdown', 'accessibility checklist JSON'],
            records: channels,
            confirmationQueue: facts
        };
    }
    return suite;
}
export function summarizeSaasSuite(suite) {
    return {
        modules: suite.modules.length,
        workflows: suite.workflows.length,
        records: suite.records.length,
        exports: suite.exports.length,
        risks: suite.risks.length,
        firstMetric: suite.metrics[0]?.label || 'readiness'
    };
}
export function buildSaasSuiteMarkdown(config, domain, state) {
    const suite = buildSaasExpansionSuite(domain, state);
    const summary = summarizeSaasSuite(suite);
    const lines = [`# ${config.title} Standalone SaaS Suite`, '', suite.summary, '', '## Product modules'];
    suite.modules.forEach((module) => lines.push(`- ${module}`));
    lines.push('', '## Workflows');
    suite.workflows.forEach((workflow) => lines.push(`- ${workflow}`));
    lines.push('', '## Dashboards and metrics');
    suite.dashboards.forEach((dashboard) => lines.push(`- ${dashboard}`));
    suite.metrics.forEach((metric) => lines.push(`- **${metric.label}:** ${metric.value}`));
    lines.push('', '## Automations');
    suite.automations.forEach((automation) => lines.push(`- ${automation}`));
    lines.push('', '## Export products');
    suite.exports.forEach((item) => lines.push(`- ${item}`));
    lines.push('', '## SaaS operating summary', `- Modules: ${summary.modules}`, `- Workflows: ${summary.workflows}`, `- Records: ${summary.records}`, `- Export types: ${summary.exports}`);
    lines.push('', '## Sample records', '```json', JSON.stringify(suite.records.slice(0, 5), null, 2), '```');
    return lines.join('\n');
}
//# sourceMappingURL=saas-suite.js.map