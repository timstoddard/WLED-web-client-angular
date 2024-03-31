const matchFullString = (regex: string) => `^${regex}$`;

// TODO handle white channel with this?
const hexDigit = `[\\da-fA-F]`;
const HEX_BASE_REGEX = `#?(${hexDigit}{3}|${hexDigit}{6})`;
export const HEX_REGEX = matchFullString(HEX_BASE_REGEX);

const IPV4_ADDRESS_BASE_REGEX = new Array(4).fill('(\\d{1,2}|[01]\\d\\d|2[0-4]\\d|25[0-5])').join('\\.');
/**
 * IPv4 address format:
 * - exactly 4 parts with a dot in between
 * - all parts must be within range [0-255]
 * - captures each part in a separate group
 */
export const IPV4_ADDRESS_REGEX = matchFullString(IPV4_ADDRESS_BASE_REGEX);

const hostnameLetter = `a-zA-Z0-9`;
const hostnameToken = `[${hostnameLetter}][${hostnameLetter}-]{0,61}`;
const HOSTNAME_BASE_REGEX = `(${hostnameToken}[.]?)*${hostnameToken}`;
export const HOSTNAME_REGEX = matchFullString(HOSTNAME_BASE_REGEX);

export const IPV4_ADDRESS_OR_HOSTNAME_REGEX = matchFullString(`(${IPV4_ADDRESS_BASE_REGEX}|${HOSTNAME_BASE_REGEX})`);
