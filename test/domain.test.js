import test from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/config.js';
import { domain } from '../src/domain.js';
import { validateDomainDefinition, calculateDomain, generateDomainArtifacts, buildDomainMarkdown, applyDomainSample, buildAdvancedDomainModel, generateDomainSaasPlan, buildSaasExpansionSuite, buildSaasSuiteMarkdown, summarizeSaasSuite } from '../src/domain-core.js';
test('domain tool definition is purpose-built', () => {
    assert.equal(validateDomainDefinition(domain), true);
    assert.ok(domain.kind.length > 3);
    assert.ok(domain.fields.length >= 4);
    assert.ok(domain.rows.length >= 6);
});
test('domain sample becomes release ready', () => {
    const state = applyDomainSample(domain);
    const calc = calculateDomain(domain, state);
    assert.equal(calc.releaseReady, true);
    assert.ok(calc.completeness >= 80);
    assert.ok(calc.rowScore >= 75);
});
test('domain artifacts and markdown are product-specific', () => {
    const state = applyDomainSample(domain);
    const artifacts = generateDomainArtifacts(config, domain, state);
    const md = buildDomainMarkdown(config, domain, state);
    assert.equal(artifacts.length, domain.artifacts.length);
    assert.match(md, new RegExp(config.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(md, new RegExp(domain.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});
test('advanced domain model exposes SaaS-grade workflows', () => {
    const state = applyDomainSample(domain);
    const model = buildAdvancedDomainModel(domain, state);
    const plan = generateDomainSaasPlan(config, domain, state);
    assert.ok(model.records.length >= 3);
    assert.ok(model.dashboards.length >= 3);
    assert.ok(model.automationRules.length >= 2);
    assert.ok(plan.planTiers.length >= 3);
    assert.ok(plan.readinessScore >= 80);
});
test('expanded SaaS suite exposes standalone product operations', () => {
    const state = applyDomainSample(domain);
    const suite = buildSaasExpansionSuite(domain, state);
    const summary = summarizeSaasSuite(suite);
    const markdown = buildSaasSuiteMarkdown(config, domain, state);
    assert.equal(suite.standaloneSaas, true);
    assert.ok(suite.modules.length >= 5);
    assert.ok(suite.workflows.length >= 5);
    assert.ok(suite.dashboards.length >= 4);
    assert.ok(suite.automations.length >= 4);
    assert.ok(suite.exports.length >= 6);
    assert.ok(suite.records.length >= 4);
    assert.equal(summary.records, suite.records.length);
    assert.match(markdown, /Standalone SaaS Suite/);
});
//# sourceMappingURL=domain.test.js.map