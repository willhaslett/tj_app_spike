import {TaxReturnFilingSelection} from "../views/pages/filings/Filings";
import {TaxReturnFiling, TaxReturnFilingApprovalUpdateParam, TaxReturnStatus} from "../interfaces/tax-return";

/**
 * Converts a TaxReturnStatus enum value to a human-readable string.
 *
 * This function takes a TaxReturnStatus enum value and returns a user-friendly
 * string representation of that status. It's useful for displaying status
 * information in the UI in a more readable format.
 *
 * @param {TaxReturnStatus} status - The tax return status to convert.
 * @returns {string} A human-readable string representing the tax return status.
 *                   Returns "Unknown Status" for any unrecognized status.
 *
 * @example
 * const status = TaxReturnStatus.AWAITING_APPROVAL;
 * const readableStatus = getReadableTaxReturnStatus(status);
 * console.log(readableStatus); // Outputs: "Awaiting Approval"
 *
 * @example
 * const unknownStatus = 'INVALID_STATUS' as TaxReturnStatus;
 * console.log(getReadableTaxReturnStatus(unknownStatus)); // Outputs: "Unknown Status"
 *
 * @see TaxReturnStatus for the full list of possible status values.
 */
export function getReadableTaxReturnStatus(status: TaxReturnStatus): string {
    switch (status) {
        case TaxReturnStatus.FETCHING_DATA:
            return 'Fetching data';
        case TaxReturnStatus.AWAITING_APPROVAL:
            return 'Awaiting approval';
        case TaxReturnStatus.PENDING_FILING:
            return 'Pending filing';
        case TaxReturnStatus.FILED:
            return 'Filed';
        case TaxReturnStatus.ERROR:
            return 'Error';
        default:
            return 'Unknown status';
    }
}

/**
 * Converts an array of TaxReturnFiling objects to TaxReturnFilingSelection objects.
 *
 * This function takes an array of TaxReturnFiling objects and returns a new array
 * of TaxReturnFilingSelection objects. Each returned object includes all properties
 * of the original TaxReturnFiling plus an `isSelected` property defaulted to true.
 *
 * @param {TaxReturnFiling[]} taxReturns - The array of tax returns to convert.
 * @returns {TaxReturnFilingSelection[]} An array of TaxReturnFilingSelection objects.
 *
 * const selectableTaxReturns = createTaxReturnFilingSelections(taxReturns);
 * console.log(selectableTaxReturns[0].isSelected); // Outputs: true
 *
 * @see TaxReturnFiling
 * @see TaxReturnFilingSelection
 */
export function createTaxReturnFilingSelections(
    taxReturns: TaxReturnFiling[]
): TaxReturnFilingSelection[] {
    return taxReturns.map(taxReturn => ({
        ...taxReturn,
        isSelected: true
    }));
}

/**
 * Returns a list of tax_return_ids for jurisdiction tax returns that are both awaiting approval and selected.
 *
 * @param taxReturns - An array of TaxReturnFilingSelection objects to filter.
 * @returns An array of TaxReturnFilingApprovalUpdateParam that meet the criteria.
 */
export function getSelectedAwaitingApprovalTaxReturns(taxReturns: TaxReturnFilingSelection[]): TaxReturnFilingApprovalUpdateParam[] {
    return taxReturns
        .filter(tr =>
            tr.status === TaxReturnStatus.AWAITING_APPROVAL && tr.isSelected
        )
        .map(tr => {
            return {
                tax_return_id: tr.tax_return_id,
                country_code: tr.country_code
            }
        });
}

/**
 * Groups an array of TaxReturnFilingSelection objects by their status.
 *
 * @param {TaxReturnFilingSelection[]} taxReturns - An array of TaxReturnFilingSelection objects.
 * @returns {Record<TaxReturnStatus, TaxReturnFilingSelection[]>} - An object with keys as TaxReturnStatus and values as arrays of TaxReturnFilingSelection objects.
 *
 * const groupedTaxReturns = groupTaxReturnsByStatus(taxReturns);
 * console.log(groupedTaxReturns[TaxReturnStatus.FETCHING_DATA]); // Outputs array of tax returns with status FETCHING_DATA
 * console.log(groupedTaxReturns[TaxReturnStatus.FILED]); // Outputs array of tax returns with status FILED
 */
export function groupTaxReturnsByStatus(taxReturns: TaxReturnFilingSelection[]): Record<TaxReturnStatus, TaxReturnFilingSelection[]> {
    return taxReturns.reduce<Record<TaxReturnStatus, TaxReturnFilingSelection[]>>((acc, taxReturn) => {
        if (!acc[taxReturn.status]) {
            acc[taxReturn.status] = [];
        }
        acc[taxReturn.status].push(taxReturn);
        return acc;
    }, {
        [TaxReturnStatus.FETCHING_DATA]: [],
        [TaxReturnStatus.AWAITING_APPROVAL]: [],
        [TaxReturnStatus.PENDING_FILING]: [],
        [TaxReturnStatus.FILED]: [],
        [TaxReturnStatus.ERROR]: []
    });
}
