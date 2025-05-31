/**
 * Truncates a string and appends an ellipsis (...) if its length exceeds a specified limit.
 *
 * @param {string} input - The input string to be truncated.
 * @param {number} maxLength - The maximum allowed length of the string before truncation.
 * @returns {string} - The truncated string with ellipsis if it exceeds the specified length, otherwise the original string.
 */
export function truncateStringWithEllipsis(input: string, maxLength: number): string {
    if (input.length <= maxLength) {
        return input;
    }
    return input.substring(0, maxLength) + '...';
}

/**
 * Extracts the file name from the Content-Disposition header.
 *
 * The Content-Disposition header is typically used to indicate if the content
 * is expected to be displayed inline in the browser or treated as an attachment
 * to be downloaded. It often includes a `filename` parameter specifying the
 * suggested name for the downloaded file.
 *
 * This function parses the Content-Disposition header to extract the file name.
 * If the header is missing or the filename cannot be determined, a default
 * filename is returned.
 *
 * @param header - The Content-Disposition header value as a string.
 *                  This is usually obtained from the response headers.
 * @returns The extracted file name if present, or a default name ("downloaded-file") if not.
 */
export const getFileNameFromContentDisposition = (header: string | null): string => {
    if (!header) return 'downloaded-file'; // Default file name if header is not present

    // Regular expression to match the filename parameter in the Content-Disposition header
    const filenameRegex = /filename[^;=\n]*=[\s]*(['"]?)(.*?)\1/;
    const matches = filenameRegex.exec(header);

    // Return the extracted filename or a default name if extraction fails
    return matches?.[2] ?? 'downloaded-file';
};


/**
 * Formats a given amount as a currency string based on the provided currency code.
 *
 * This function takes a monetary amount and a three-letter ISO currency code as inputs and returns
 * a string formatted according to the locale and currency symbol associated with that currency code.
 * If the amount is null or undefined, the function returns '0.00'.
 *
 * @param {number | null | undefined} amount - The monetary amount to format. If null or undefined, '0.00' is returned.
 * @param {string} currencyCode - The three-letter ISO currency code representing the currency to format the amount in.
 * @param roundToNearestWhole - Optional parameter to round to the nearest whole number.
 * @returns {string} - A string representing the formatted currency amount.
 *
 * @example
 * // Returns "$1,234,567.89"
 * formatCurrencyWithCode(1234567.89, 'USD', false);
 *
 * @example
 * // Returns "€1.234.567,89"
 * formatCurrencyWithCode(1234567.89, 'EUR', false);
 *
 * @example
 * // Returns "₹1,23,456.89"
 * formatCurrencyWithCode(123456.89, 'INR', false);
 *
 * @example
 * // Returns "0.00"
 * formatCurrencyWithCode(null, 'USD', false);
 */
export function formatCurrencyWithCode(amount: number | null | undefined,
                                       currencyCode: string,
                                       roundToNearestWhole = false): string {
    if (amount === null || amount === undefined) {
        return roundToNearestWhole ? '0' : '0.00';
    }

    const currencySymbols: { [key: string]: string } = {
        AED: 'د.إ',
        AFN: '؋',
        ALL: 'L',
        AMD: '֏',
        ANG: 'ƒ',
        AOA: 'Kz',
        ARS: '$',
        AUD: '$',
        AWG: 'ƒ',
        AZN: '₼',
        BAM: 'KM',
        BBD: '$',
        BDT: '৳',
        BGN: 'лв',
        BHD: '.د.ب',
        BIF: 'FBu',
        BMD: '$',
        BND: '$',
        BOB: 'Bs.',
        BRL: 'R$',
        BSD: '$',
        BTN: 'Nu.',
        BWP: 'P',
        BYN: 'Br',
        BZD: '$',
        CAD: '$',
        CDF: 'FC',
        CHF: 'CHF',
        CLP: '$',
        CNY: '¥',
        COP: '$',
        CRC: '₡',
        CUP: '$',
        CVE: '$',
        CZK: 'Kč',
        DJF: 'Fdj',
        DKK: 'kr',
        DOP: '$',
        DZD: 'دج',
        EGP: '£',
        ERN: 'Nfk',
        ETB: 'Br',
        EUR: '€',
        FJD: '$',
        FKP: '£',
        FOK: 'kr',
        GBP: '£',
        GEL: '₾',
        GGP: '£',
        GHS: '₵',
        GIP: '£',
        GMD: 'D',
        GNF: 'FG',
        GTQ: 'Q',
        GYD: '$',
        HKD: '$',
        HNL: 'L',
        HRK: 'kn',
        HTG: 'G',
        HUF: 'Ft',
        IDR: 'Rp',
        ILS: '₪',
        IMP: '£',
        INR: '₹',
        IQD: 'ع.د',
        IRR: '﷼',
        ISK: 'kr',
        JEP: '£',
        JMD: '$',
        JOD: 'د.ا',
        JPY: '¥',
        KES: 'KSh',
        KGS: 'с',
        KHR: '៛',
        KID: '$',
        KMF: 'CF',
        KRW: '₩',
        KWD: 'د.ك',
        KYD: '$',
        KZT: '₸',
        LAK: '₭',
        LBP: 'ل.ل',
        LKR: 'Rs',
        LRD: '$',
        LSL: 'L',
        LYD: 'ل.د',
        MAD: 'د.م.',
        MDL: 'L',
        MGA: 'Ar',
        MKD: 'ден',
        MMK: 'K',
        MNT: '₮',
        MOP: 'MOP$',
        MRU: 'UM',
        MUR: '₨',
        MVR: 'ރ.',
        MWK: 'MK',
        MXN: '$',
        MYR: 'RM',
        MZN: 'MT',
        NAD: '$',
        NGN: '₦',
        NIO: 'C$',
        NOK: 'kr',
        NPR: '₨',
        NZD: '$',
        OMR: 'ر.ع.',
        PAB: 'B/.',
        PEN: 'S/',
        PGK: 'K',
        PHP: '₱',
        PKR: '₨',
        PLN: 'zł',
        PYG: '₲',
        QAR: 'ر.ق',
        RON: 'lei',
        RSD: 'дин.',
        RUB: '₽',
        RWF: 'FRw',
        SAR: 'ر.س',
        SBD: '$',
        SCR: '₨',
        SDG: 'ج.س.',
        SEK: 'kr',
        SGD: '$',
        SHP: '£',
        SLL: 'Le',
        SOS: 'Sh',
        SRD: '$',
        SSP: '£',
        STN: 'Db',
        SYP: '£',
        SZL: 'L',
        THB: '฿',
        TJS: 'SM',
        TMT: 'T',
        TND: 'د.ت',
        TOP: 'T$',
        TRY: '₺',
        TTD: '$',
        TVD: '$',
        TWD: 'NT$',
        TZS: 'Sh',
        UAH: '₴',
        UGX: 'Sh',
        USD: '$',
        UYU: '$U',
        UZS: 'soʻm',
        VES: 'Bs.S',
        VND: '₫',
        VUV: 'Vt',
        WST: 'T',
        XAF: 'FCFA',
        XCD: '$',
        XDR: 'SDR',
        XOF: 'CFA',
        XPF: '₣',
        YER: '﷼',
        ZAR: 'R',
        ZMW: 'ZK',
        ZWL: '$'
    };

    const currencyLocales: { [key: string]: string } = {
        AED: 'ar-AE',
        AFN: 'fa-AF',
        ALL: 'sq-AL',
        AMD: 'hy-AM',
        ANG: 'nl-AW',
        AOA: 'pt-AO',
        ARS: 'es-AR',
        AUD: 'en-AU',
        AWG: 'nl-AW',
        AZN: 'az-AZ',
        BAM: 'bs-BA',
        BBD: 'en-BB',
        BDT: 'bn-BD',
        BGN: 'bg-BG',
        BHD: 'ar-BH',
        BIF: 'fr-BI',
        BMD: 'en-BM',
        BND: 'ms-BN',
        BOB: 'es-BO',
        BRL: 'pt-BR',
        BSD: 'en-BS',
        BTN: 'dz-BT',
        BWP: 'en-BW',
        BYN: 'be-BY',
        BZD: 'en-BZ',
        CAD: 'en-CA',
        CDF: 'fr-CD',
        CHF: 'de-CH',
        CLP: 'es-CL',
        CNY: 'zh-CN',
        COP: 'es-CO',
        CRC: 'es-CR',
        CUP: 'es-CU',
        CVE: 'pt-CV',
        CZK: 'cs-CZ',
        DJF: 'fr-DJ',
        DKK: 'da-DK',
        DOP: 'es-DO',
        DZD: 'ar-DZ',
        EGP: 'ar-EG',
        ERN: 'ti-ER',
        ETB: 'am-ET',
        EUR: 'de-DE',
        FJD: 'en-FJ',
        FKP: 'en-FK',
        FOK: 'fo-FO',
        GBP: 'en-GB',
        GEL: 'ka-GE',
        GGP: 'en-GG',
        GHS: 'en-GH',
        GIP: 'en-GI',
        GMD: 'en-GM',
        GNF: 'fr-GN',
        GTQ: 'es-GT',
        GYD: 'en-GY',
        HKD: 'zh-HK',
        HNL: 'es-HN',
        HRK: 'hr-HR',
        HTG: 'ht-HT',
        HUF: 'hu-HU',
        IDR: 'id-ID',
        ILS: 'he-IL',
        IMP: 'en-IM',
        INR: 'hi-IN',
        IQD: 'ar-IQ',
        IRR: 'fa-IR',
        ISK: 'is-IS',
        JEP: 'en-JE',
        JMD: 'en-JM',
        JOD: 'ar-JO',
        JPY: 'ja-JP',
        KES: 'en-KE',
        KGS: 'ky-KG',
        KHR: 'km-KH',
        KID: 'en-KI',
        KMF: 'ar-KM',
        KRW: 'ko-KR',
        KWD: 'ar-KW',
        KYD: 'en-KY',
        KZT: 'kk-KZ',
        LAK: 'lo-LA',
        LBP: 'ar-LB',
        LKR: 'si-LK',
        LRD: 'en-LR',
        LSL: 'st-LS',
        LYD: 'ar-LY',
        MAD: 'ar-MA',
        MDL: 'ro-MD',
        MGA: 'fr-MG',
        MKD: 'mk-MK',
        MMK: 'my-MM',
        MNT: 'mn-MN',
        MOP: 'zh-MO',
        MRU: 'ar-MR',
        MUR: 'en-MU',
        MVR: 'dv-MV',
        MWK: 'en-MW',
        MXN: 'es-MX',
        MYR: 'ms-MY',
        MZN: 'pt-MZ',
        NAD: 'en-NA',
        NGN: 'en-NG',
        NIO: 'es-NI',
        NOK: 'no-NO',
        NPR: 'ne-NP',
        NZD: 'en-NZ',
        OMR: 'ar-OM',
        PAB: 'es-PA',
        PEN: 'es-PE',
        PGK: 'en-PG',
        PHP: 'fil-PH',
        PKR: 'ur-PK',
        PLN: 'pl-PL',
        PYG: 'es-PY',
        QAR: 'ar-QA',
        RON: 'ro-RO',
        RSD: 'sr-RS',
        RUB: 'ru-RU',
        RWF: 'rw-RW',
        SAR: 'ar-SA',
        SBD: 'en-SB',
        SCR: 'en-SC',
        SDG: 'ar-SD',
        SEK: 'sv-SE',
        SGD: 'en-SG',
        SHP: 'en-SH',
        SLL: 'en-SL',
        SOS: 'so-SO',
        SRD: 'nl-SR',
        SSP: 'en-SS',
        STN: 'pt-ST',
        SYP: 'ar-SY',
        SZL: 'en-SZ',
        THB: 'th-TH',
        TJS: 'tg-TJ',
        TMT: 'tk-TM',
        TND: 'ar-TN',
        TOP: 'to-TO',
        TRY: 'tr-TR',
        TTD: 'en-TT',
        TVD: 'en-TV',
        TWD: 'zh-TW',
        TZS: 'sw-TZ',
        UAH: 'uk-UA',
        UGX: 'en-UG',
        USD: 'en-US',
        UYU: 'es-UY',
        UZS: 'uz-UZ',
        VES: 'es-VE',
        VND: 'vi-VN',
        VUV: 'bi-VU',
        WST: 'sm-WS',
        XAF: 'fr-XA',
        XCD: 'en-XC',
        XDR: 'en-XD',
        XOF: 'fr-XO',
        XPF: 'fr-XP',
        YER: 'ar-YE',
        ZAR: 'en-ZA',
        ZMW: 'en-ZM',
        ZWL: 'en-ZW'
    };

    const currencySymbol = currencySymbols[currencyCode] || currencyCode;
    const locale = currencyLocales[currencyCode] || 'en-US';

    return `${currencySymbol}${amount.toLocaleString(locale, {
        minimumFractionDigits: roundToNearestWhole ? 0 : 2,
        maximumFractionDigits: roundToNearestWhole ? 0 : 2
    })}`;
}
