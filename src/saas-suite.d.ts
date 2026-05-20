export declare function buildSaasExpansionSuite(domain: any, state: any): {
    standaloneSaas: boolean;
    productSuite: string[];
    title: any;
    summary: any;
    modules: any[];
    workflows: any[];
    dashboards: any[];
    metrics: any[];
    automations: any[];
    exports: string[];
    risks: string[];
    pricing: {
        tier: string;
        price: number;
        includes: string;
    }[];
    roadmap: string[];
    records: any;
} | {
    modules: string[];
    workflows: string[];
    dashboards: string[];
    metrics: {
        label: string;
        value: number;
    }[];
    automations: string[];
    exports: string[];
    records: {
        tier: string;
        askAmount: number;
        proofScore: number;
        benefits: string[];
        inventory: number;
    }[];
    deckSlides: {
        slide: number;
        title: string;
        proofRequired: boolean;
        owner: string;
    }[];
    prospectStages: string[];
    standaloneSaas: boolean;
    productSuite: string[];
    title: any;
    summary: any;
    risks: string[];
    pricing: {
        tier: string;
        price: number;
        includes: string;
    }[];
    roadmap: string[];
} | {
    modules: string[];
    workflows: string[];
    dashboards: string[];
    metrics: {
        label: string;
        value: number;
    }[];
    automations: string[];
    exports: string[];
    records: {
        date: string;
        label: any;
        owner: string;
        channel: string;
        approval: string;
        evidenceDue: string;
    }[];
    backendContract: {
        endpoint: string;
        payload: string[];
    };
    standaloneSaas: boolean;
    productSuite: string[];
    title: any;
    summary: any;
    risks: string[];
    pricing: {
        tier: string;
        price: number;
        includes: string;
    }[];
    roadmap: string[];
} | {
    modules: string[];
    workflows: string[];
    dashboards: string[];
    metrics: {
        label: string;
        value: any;
    }[];
    automations: string[];
    exports: string[];
    records: {
        section: string;
        question: string;
        consentGate: boolean;
        quoteTag: string;
    }[];
    consentStates: string[];
    standaloneSaas: boolean;
    productSuite: string[];
    title: any;
    summary: any;
    risks: string[];
    pricing: {
        tier: string;
        price: number;
        includes: string;
    }[];
    roadmap: string[];
} | {
    modules: string[];
    workflows: string[];
    dashboards: string[];
    metrics: {
        label: string;
        value: any;
    }[];
    automations: string[];
    exports: string[];
    records: {
        name: string;
        max: number;
    }[];
    glossary: {
        term: string;
        approved: boolean;
        reviewer: string;
    }[];
    standaloneSaas: boolean;
    productSuite: string[];
    title: any;
    summary: any;
    risks: string[];
    pricing: {
        tier: string;
        price: number;
        includes: string;
    }[];
    roadmap: string[];
} | {
    modules: string[];
    workflows: string[];
    dashboards: string[];
    metrics: {
        label: string;
        value: number;
    }[];
    automations: string[];
    exports: string[];
    records: {
        channel: string;
        requiredFacts: number;
        ready: boolean;
    }[];
    confirmationQueue: {
        fact: string;
        status: string;
        source: string;
    }[];
    standaloneSaas: boolean;
    productSuite: string[];
    title: any;
    summary: any;
    risks: string[];
    pricing: {
        tier: string;
        price: number;
        includes: string;
    }[];
    roadmap: string[];
};
export declare function summarizeSaasSuite(suite: any): {
    modules: any;
    workflows: any;
    records: any;
    exports: any;
    risks: any;
    firstMetric: any;
};
export declare function buildSaasSuiteMarkdown(config: any, domain: any, state: any): string;
