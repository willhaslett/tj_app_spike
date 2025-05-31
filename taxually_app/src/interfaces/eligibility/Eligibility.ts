export interface Eligibility {
    account_id: string,
    filing: {
        eligible: boolean,
        billed_by: string
    },
    registrations: {
        eligible: boolean,
        billed_by: string
    }
}
