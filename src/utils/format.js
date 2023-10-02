export function formatNumber(numstr) {
  numstr = numstr.replace(/\D/g, "");
  const regex = /(\d)(?=(\d{3})+(?!\d))/g;
  return numstr.replace(regex, "$1.");
}

export function normalizeNumber(numstr) {
  return Number(numstr.replace(/\D/g, ""));
}

export function mask(target, fn) {
  target.value = fn(target.value);
}
