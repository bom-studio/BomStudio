const MAX_PHONE_DIGITS = 11;

export function extractPhoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, MAX_PHONE_DIGITS);
}

export function formatPhoneNumber(value: string): string {
  const digits = extractPhoneDigits(value);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function getPhoneDigits(value: string): string {
  return extractPhoneDigits(value);
}
