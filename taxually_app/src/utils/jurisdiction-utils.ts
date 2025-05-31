import {TaxJurisdiction, TaxJurisdictionStatus, TaxJurisdictionTaxCollectionData} from "../interfaces/jurisdictions";
import {TaxJurisdictionTaxData} from "../views/pages/jurisdictions/Jurisdictions";

/**
 * Groups an array of JurisdictionSelection objects into two lists: one for 'OPTED_OUT' or 'PRE_ONBOARDING' and one for all other statuses.
 *
 * @param {TaxJurisdictionTaxData[]} jurisdictions - An array of JurisdictionSelection objects.
 * @returns {{ optedOut: TaxJurisdictionTaxData[], others: TaxJurisdictionTaxData[] }} - An object with two keys: 'optedOut' for jurisdictions with status 'OPTED_OUT' and 'others' for all other statuses.
 *
 * @example
 * const jurisdictions: JurisdictionSelection[] = [
 *     { jurisdiction_id: '1', country_code: 'US', jurisdiction_name: 'California', tax_type: 'Sales', status: JurisdictionStatus.PRE_ONBOARDING, isSelected: true },
 *     { jurisdiction_id: '2', country_code: 'US', jurisdiction_name: 'New York', tax_type: 'Sales', status: JurisdictionStatus.OPTED_OUT, isSelected: false }
 * ];
 *
 * const groupedJurisdictions = groupJurisdictionsByStatus(jurisdictions);
 * console.log(groupedJurisdictions.notSubscribed); // Outputs array of jurisdictions with status OPTED_OUT or PRE_ONBOARDING
 * console.log(groupedJurisdictions.others); // Outputs array of jurisdictions with all other statuses
 */
export function groupJurisdictionsByStatus(jurisdictions: TaxJurisdictionTaxData[]):
    { notSubscribed: TaxJurisdictionTaxData[], others: TaxJurisdictionTaxData[] } {
    return jurisdictions.reduce<{ notSubscribed: TaxJurisdictionTaxData[], others: TaxJurisdictionTaxData[] }>((
        acc,
        jurisdiction) => {

        // Filter out jurisdictions with the 'EXPIRED' status
        if (jurisdiction.status === TaxJurisdictionStatus.EXPIRED) {
            return acc;
        }

        if (jurisdiction.status === TaxJurisdictionStatus.PRE_ONBOARDING ||
            jurisdiction.status === TaxJurisdictionStatus.OPTED_OUT_FROM_FILING) {
            acc.notSubscribed.push(jurisdiction);
        } else {
            acc.others.push(jurisdiction);
        }
        return acc;
    }, { notSubscribed: [], others: [] });
}


/**
 * Populates a list of TaxJurisdictionTaxData by merging TaxJurisdiction and TaxJurisdictionTaxCollectionData lists.
 *
 * @param {TaxJurisdiction[]} jurisdictions - List of tax jurisdictions.
 * @param {TaxJurisdictionTaxCollectionData[]} taxCollections - List of tax collection data for jurisdictions.
 * @returns {TaxJurisdictionTaxData[]} - List of TaxJurisdictionTaxData with merged information.
 *
 * @example
 * const jurisdictions: TaxJurisdiction[] = [
 *     { jurisdiction_id: '1', country_code: 'US', jurisdiction_name: 'California', filing_start_date: '2023-01-01', status: TaxJurisdictionStatus.READY_TO_FILE }
 * ];
 * const taxCollections: TaxJurisdictionTaxCollectionData[] = [
 *     { jurisdiction_id: '1', tax_collected: 1000, currency_code: 'USD' }
 * ];
 * const result = populateTaxJurisdictionTaxData(jurisdictions, taxCollections);
 * console.log(result);
 */
export function populateTaxJurisdictionTaxData(
    jurisdictions: TaxJurisdiction[],
    taxCollections: TaxJurisdictionTaxCollectionData[]
): TaxJurisdictionTaxData[] {
    // Create a map for quick lookup of tax collection data by jurisdiction_id
    const taxCollectionMap: { [key: string]: TaxJurisdictionTaxCollectionData } = {};
    taxCollections.forEach(collection => {
        taxCollectionMap[collection.jurisdiction_id] = collection;
    });

    // Merge jurisdiction data with tax collection data
    return jurisdictions.map(jurisdiction => {
        const collectionData = taxCollectionMap[jurisdiction.jurisdiction_id] || { tax_collected: null, currency_code: '' };
        return {
            ...jurisdiction,
            tax_collected: collectionData.tax_collected,
            currency_code: collectionData.currency_code
        };
    });
}

/**
 * Populates a list of TaxJurisdictionTaxData with default null values.
 *
 * @param {TaxJurisdiction[]} jurisdictions - List of tax jurisdictions.
 * @returns {TaxJurisdictionTaxData[]} - List of TaxJurisdictionTaxData with default null values.
 *
 * @example
 * const taxCollections: TaxJurisdictionTaxCollectionData[] = [
 *     { jurisdiction_id: '1', tax_collected: null, currency_code: null }
 * ];
 * const result = populateDefaultLoaderTaxJurisdictionTaxData(jurisdictions);
 * console.log(result);
 */
export function populateDefaultLoaderTaxJurisdictionTaxData(jurisdictions: TaxJurisdiction[]): TaxJurisdictionTaxData[] {
    // Merge jurisdiction data with tax collection data
    return jurisdictions.map(jurisdiction => {
        return {
            ...jurisdiction,
            tax_collected: null,
            currency_code: null
        };
    });
}

/**
 * Converts a JurisdictionStatus enum value to a human-readable string.
 *
 * This function takes a JurisdictionStatus enum value and returns a user-friendly
 * string representation of that status. It's useful for displaying status
 * information in the UI in a more readable format.
 *
 * @param {TaxJurisdictionStatus} status - The jurisdiction status to convert.
 * @returns {string} A human-readable string representing the jurisdiction status.
 *
 * @example
 * const status = JurisdictionStatus.CONFIGURED;
 * const readableStatus = getReadableJurisdictionStatus(status);
 * console.log(readableStatus); // Outputs: "Configured"
 *
 * @throws {never} This function will never throw an error. If an unknown status
 *                 is provided, it will return "Unknown Status".
 *
 * @note This function handles all current JurisdictionStatus enum values.
 *       If new statuses are added to the enum, this function should be updated
 *       to include them.
 *
 * @see JurisdictionStatus for the full list of possible status values.
 */
export function getReadableJurisdictionStatus(status: TaxJurisdictionStatus): string { // max length 15
    switch (status) {
        case TaxJurisdictionStatus.PRE_ONBOARDING:
            return 'Not started';
        case TaxJurisdictionStatus.ONBOARDING:
            return 'Onboarding';
        case TaxJurisdictionStatus.READY_TO_FILE:
            return 'Ready to file';
        case TaxJurisdictionStatus.OPTED_OUT_FROM_FILING:
            return 'Not started';
        case TaxJurisdictionStatus.SCHEDULED_FOR_FILING:
            return 'Scheduled';
        case TaxJurisdictionStatus.NEEDS_ATTENTION:
            return 'Needs attention';
        case TaxJurisdictionStatus.EXPIRED:
            return 'Expired';
        case TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_PROGRESS:
            return 'Info required';
        case TaxJurisdictionStatus.REGISTRATION_APPLICATION_IN_REVIEW:
            return 'Under review';
        case TaxJurisdictionStatus.PENDING_AUTHORITY_APPROVAL:
            return 'Pending approval';
        default:
            return 'Unknown status';
    }
}
