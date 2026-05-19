export declare const WORKSPACE_ROLES: readonly ["owner", "mentor", "student", "client"];
export declare function createSaasWorkspace(config: any, now?: string): {
    version: string;
    activeWorkspaceId: string;
    workspaces: {
        id: string;
        name: any;
        client: any;
        segment: any;
        role: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        members: {
            id: string;
            name: any;
            role: string;
        }[];
        metrics: {
            readiness: number;
            exports: number;
            approvals: number;
        };
        exportHistory: any[];
    }[];
    auditLog: {
        at: string;
        event: string;
        actor: string;
        detail: string;
    }[];
};
export declare function getActiveWorkspace(workspaceState: any): any;
export declare function addWorkspace(workspaceState: any, name: any, now?: string): {
    id: string;
    name: string;
    client: string;
    segment: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    members: {
        id: string;
        name: string;
        role: string;
    }[];
    metrics: {
        readiness: number;
        exports: number;
        approvals: number;
    };
    exportHistory: any[];
};
export declare function switchWorkspace(workspaceState: any, id: any, now?: string): any;
export declare function recordWorkspaceExport(workspaceState: any, type: any, now?: string): {
    id: string;
    type: any;
    at: string;
    actor: string;
};
export declare function summarizeWorkspaceAnalytics(workspaceState: any, readiness?: number): {
    activeClient: any;
    workspaceCount: any;
    memberCount: any;
    exportCount: any;
    readiness: number;
    roles: {
        role: "owner" | "mentor" | "student" | "client";
        count: any;
    }[];
};
export declare function exportWorkspaceBundle(config: any, workspaceState: any, appState: any): string;
export declare function importWorkspaceBundle(config: any, raw: any): any;
