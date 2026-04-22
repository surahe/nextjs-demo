export interface RouteItem {
    title: string;
    url: string;
    isActive?: boolean;
    hideInMenu?: boolean;
    iconKey?: string;
    activeIconKey?: string;
    items?: RouteItem[];
}

export interface RouteValidationResult {
    valid: boolean;
    invalidUrls: string[];
}
