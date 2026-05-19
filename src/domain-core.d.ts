export declare function validateDomainDefinition(domain: any): boolean;
export declare function createDomainState(domain: any): {
    version: string;
    values: {};
    rows: any;
    generated: any[];
    updatedAt: string;
};
export declare function calculateDomain(domain: any, state: any): {
    primary: number;
    secondary: number;
    completeness: number;
    rowScore: number;
    approved: any;
    insight: string;
    releaseReady: boolean;
};
export declare function buildAdvancedDomainModel(domain: any, state: any): {
    model: string;
    primaryOutput: string;
    dashboards: string[];
    workflows: string[];
    records: {
        tier: string;
        askAmount: number;
        benefits: string[];
        proofScore: number;
        nextStep: string;
    }[];
    automationRules: string[];
    enterpriseReadiness: boolean;
};
export declare function generateDomainSaasPlan(config: any, domain: any, state: any): {
    product: any;
    category: any;
    idealCustomer: any;
    planTiers: {
        name: string;
        price: number;
        audience: string;
        limits: string;
    }[];
    clientPortal: string[];
    analytics: string[];
    automations: string[];
    roadmap: string[];
    readinessScore: number;
};
export declare function generateDomainArtifacts(config: any, domain: any, state: any): any;
export declare function buildDomainMarkdown(config: any, domain: any, state: any): string;
export declare function applyDomainSample(domain: any): {
    version: string;
    values: {};
    rows: any;
    generated: any[];
    updatedAt: string;
};
