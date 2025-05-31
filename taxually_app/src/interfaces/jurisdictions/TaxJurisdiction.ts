export interface TaxJurisdiction {
    jurisdiction_id: string,
    jurisdiction_code: string,
    country_code: string,
    jurisdiction_name: string,
    filing_start_date: string,
    status: TaxJurisdictionStatus
}

export enum TaxJurisdictionStatus {
    PRE_ONBOARDING = 'PRE_ONBOARDING',
    ONBOARDING = 'ONBOARDING',
    READY_TO_FILE = 'READY_TO_FILE',
    OPTED_OUT_FROM_FILING = 'OPTED_OUT_FROM_FILING',
    SCHEDULED_FOR_FILING = 'SCHEDULED_FOR_FILING',
    NEEDS_ATTENTION = 'NEEDS_ATTENTION',
    EXPIRED = 'EXPIRED',
    REGISTRATION_APPLICATION_IN_PROGRESS = 'REGISTRATION_APPLICATION_IN_PROGRESS',
    REGISTRATION_APPLICATION_IN_REVIEW = 'REGISTRATION_APPLICATION_IN_REVIEW',
    PENDING_AUTHORITY_APPROVAL = 'PENDING_AUTHORITY_APPROVAL'
}
