export const config = {
  "number": 19,
  "slug": "sponsorship-deck-lab",
  "title": "Sponsorship Deck Lab",
  "category": "Finance & Grants",
  "tagline": "A repeatable deck structure for turning community impact into sponsor-ready partnership asks.",
  "persona": "Volta chapters and allied nonprofits seeking sponsors.",
  "gap": "Small nonprofits often have impact but no polished sponsor narrative.",
  "niche": "Community org sponsorship enablement.",
  "metric": "sponsor conversations launched with complete decks",
  "modules": [
    "Sponsor persona cards",
    "Impact proof sections",
    "Package builder",
    "Objection handling notes"
  ],
  "theme": {
    "accent": "#16a34a",
    "accent2": "#86efac",
    "emoji": "\ud83d\udcb8",
    "metricLabel": "Funding readiness",
    "workflow": [
      "Collect verified facts",
      "Map requirements to evidence",
      "Score readiness",
      "Export funder-ready packet"
    ],
    "privacy": "Financial and grant materials can be sensitive. Keep exports local and label confidential notes."
  },
  "statuses": [
    "not-started",
    "blocked",
    "in-progress",
    "ready",
    "approved"
  ],
  "criteria": [
    {
      "id": "sponsor-persona-cards",
      "label": "Sponsor persona cards",
      "weight": 15,
      "defaultStatus": "not-started",
      "guidance": "Implement and verify sponsor persona cards with evidence that a Volta student pod, mentor, and owner can understand."
    },
    {
      "id": "impact-proof-sections",
      "label": "Impact proof sections",
      "weight": 15,
      "defaultStatus": "not-started",
      "guidance": "Implement and verify impact proof sections with evidence that a Volta student pod, mentor, and owner can understand."
    },
    {
      "id": "package-builder",
      "label": "Package builder",
      "weight": 15,
      "defaultStatus": "not-started",
      "guidance": "Implement and verify package builder with evidence that a Volta student pod, mentor, and owner can understand."
    },
    {
      "id": "objection-handling-notes",
      "label": "Objection handling notes",
      "weight": 15,
      "defaultStatus": "not-started",
      "guidance": "Implement and verify objection handling notes with evidence that a Volta student pod, mentor, and owner can understand."
    },
    {
      "id": "evidence-quality",
      "label": "Evidence quality",
      "weight": 10,
      "defaultStatus": "not-started",
      "guidance": "Attach proof, source notes, screenshots, owner confirmation, or reviewer rationale."
    },
    {
      "id": "owner-handoff",
      "label": "Owner handoff",
      "weight": 10,
      "defaultStatus": "not-started",
      "guidance": "Make the output understandable and maintainable by a nontechnical owner."
    },
    {
      "id": "mission-alignment",
      "label": "Mission alignment",
      "weight": 10,
      "defaultStatus": "not-started",
      "guidance": "Show how this advances digital equity, student growth, or pro bono delivery."
    },
    {
      "id": "qa-safety",
      "label": "QA and safety",
      "weight": 10,
      "defaultStatus": "not-started",
      "guidance": "Resolve privacy, accessibility, accuracy, and operational risks before handoff."
    }
  ],
  "templates": {
    "actions": [
      "Run a real Volta scenario for Sponsorship Deck Lab and capture baseline evidence.",
      "Complete the sponsor persona cards workflow with owner-safe notes.",
      "Resolve all blocked rubric items and add evidence for every ready item.",
      "Export the handoff packet and review it with a mentor before client use."
    ]
  },
  "sample": {
    "clientName": "Eastside Youth Arts Collective",
    "chapter": "NYC",
    "studentLead": "Volta Student Lead",
    "notes": "Grant and finance readiness project for a small community nonprofit. Sponsorship Deck Lab sample.",
    "evidencePrefix": "Sponsorship Deck Lab",
    "evidence": [
      "Discovery call notes captured with owner confirmation.",
      "Public digital footprint reviewed and summarized.",
      "Mentor QA comments attached before handoff."
    ]
  }
};
