export const v3 = {
    "productName": "Sponsorship Deck Lab",
    "productTier": "release",
    "category": "Finance & Grants",
    "acceptance": [
        "sensitive data warning shown",
        "evidence-backed claims only",
        "calculations are deterministic",
        "funder-ready export generated"
    ],
    "capabilities": [
        "Domain-specific workbench: Sponsor Package Builder",
        "Operational table: Sponsor packages",
        "Local autosave with no backend dependency",
        "JSON production bundle export/import",
        "CSV operational table export",
        "Markdown release certification export",
        "Print-ready handoff and release packet",
        "Integrity hash for release evidence"
    ],
    "schemas": [
        "workspace.version:string",
        "workspace.updatedAt:iso-date",
        "releaseGate.status:enum",
        "releaseGate.evidence:string",
        "releaseGate.owner:string",
        "releaseGate.severity:enum",
        "bundle.product.slug:string",
        "bundle.certification.hash:string"
    ],
    "qualityGates": [
        "All exports work offline",
        "Privacy and data handling documented",
        "No blocked critical gates",
        "Every certified claim has evidence",
        "Import rejects wrong product bundles",
        "Release hash is deterministic",
        "Client-safe markdown contains no secrets",
        "CSV contains every operational row",
        "Claims need proof",
        "Benefits must be deliverable",
        "Ask amount maps to impact"
    ],
    "releaseChecklist": [
        "Core workflow completes from empty state to export",
        "Sample data demonstrates realistic Volta field usage",
        "JSON export/import round trip validated",
        "Markdown certification packet generated",
        "CSV operational export generated",
        "Print view produces client-safe handoff",
        "No raw passwords or secrets stored",
        "Local-first privacy model documented",
        "Keyboard-accessible controls present",
        "Owner/mentor review gates represented",
        "Evidence required for launch-ready claims",
        "Release certification hash generated",
        "Proof Strength reaches production threshold",
        "Package Fit is documented with evidence",
        "Ask Clarity has no unresolved blocker",
        "Deck outline verified",
        "Sponsor package CSV verified",
        "Outreach brief verified"
    ],
    "operations": [
        "Operate as a static local-first OSS product.",
        "Privacy: client data stays in the browser unless the user exports it.",
        "Backups: use JSON production bundle export after every client session.",
        "Recovery: import a previously exported production bundle.",
        "Release: certify all gates before public client handoff.",
        "Support: triage issues by blocked, critical, high, normal severity."
    ],
    "testPlan": [
        "Definition schema tests",
        "Initial non-certified state test",
        "Certification happy path test",
        "Export/import round-trip test",
        "Wrong-slug rejection test",
        "Markdown safety test",
        "CSV completeness test",
        "Integrity mutation test",
        "Self-audit test",
        "Blocked/critical gate tests"
    ]
};
//# sourceMappingURL=v3.js.map