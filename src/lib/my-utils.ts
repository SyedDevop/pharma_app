export const CurrencyFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  minimumIntegerDigits: 2,
});
export const rupeesFmt = (v: number | string) => CurrencyFmt.format(Number(v));
export const formatRs = (v: number) => CurrencyFmt.format(v).replace("₹", "Rs ");
