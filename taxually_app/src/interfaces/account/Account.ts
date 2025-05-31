export interface Account {
    name: string,
    default_currency: string,
    auto_approve_tax_returns: boolean,
    status: AccountStatus,
    onboarding_status: AccountOnboardingStatus
}

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}

export enum AccountOnboardingStatus {
    FETCHING_REGISTRATIONS = 'FETCHING_REGISTRATIONS',
    REGISTRATIONS_FETCHED = 'REGISTRATIONS_FETCHED'
}

export interface AccountUpdateParam {
    status?: string;
    auto_approve_tax_returns?: boolean;
    onboarding_status?: string;
}

export interface Onboarding {
    onboarding_url: string;
}

export interface RedirectUrls {
    jurisdiction_selection_url: string;
    continue_onboarding_url: string;
}
