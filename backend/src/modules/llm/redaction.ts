const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const INDIAN_PHONE_PATTERN =
  /\b(?:\+91[\s-]?)?(?:0[\s-]?)?[6-9]\d{9}\b/g;
const GENERIC_SECRET_PATTERN =
  /\b(?:sk|pk|rk|ghp|gho|ghu|pat)_[A-Za-z0-9_\-]{8,}\b/g;
const ASSIGNMENT_SECRET_PATTERN =
  /\b(?:password|passwd|token|secret|api[_-]?key)\b\s*[:=]\s*["']?[^"',\s]+["']?/gi;

export const redactPII = (text: string): string => {
  return text
    .replace(EMAIL_PATTERN, "[REDACTED_EMAIL]")
    .replace(INDIAN_PHONE_PATTERN, "[REDACTED_PHONE]")
    .replace(GENERIC_SECRET_PATTERN, "[REDACTED_SECRET]")
    .replace(ASSIGNMENT_SECRET_PATTERN, "[REDACTED_SECRET]");
};

export const createPreview = (text: string, maxLength = 500): string => {
  const redacted = redactPII(text);

  if (redacted.length <= maxLength) {
    return redacted;
  }

  return `${redacted.slice(0, maxLength)}...`;
};
