export const formatPhoneNumber = (value) => {
  if (!value) return null;
  const numericValue = value.replace(/[^\d]/g, "");
  const tenDigits = numericValue.slice(0, 10);

  if (tenDigits.length <= 3) return tenDigits;
  if (tenDigits.length <= 6) {
    return `(${tenDigits.slice(0, 3)}) ${tenDigits.slice(3)}`;
  }
  return `(${tenDigits.slice(0, 3)}) ${tenDigits.slice(3, 6)}-${tenDigits.slice(
    6,
    10
  )}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return null;
  // Split the DD-MM-YYYY string into components
  const [month, day, year] = dateString.split("-");

  // Reassemble and return in the required YYYY-MM-DD format
  // Note: The month is 0-indexed in the Date constructor, but here we just
  // re-order the strings, which is simpler and safer for YYYY-MM-DD.
  return `${year}-${month}-${day}`;
};

export const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
