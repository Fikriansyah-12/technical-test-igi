import numeral from "numeral";

export function fuzzySearch(text: string, haystack: string) {
  const hay = text.toLowerCase();
  let i = 0;
  let n = -1;
  let l;
  haystack = haystack.toLowerCase();

  for (; (l = haystack[i++]); ) {
    if ((n = hay.indexOf(l, n + 1)) === -1) {
      return false;
    }
  }

  return true;
}

export function formatNumber(number: number) {
  return numeral(number).format("0,0");
}

export function generateSlug(target: string) {
  const slugResult = target
    .toLowerCase()
    .replaceAll("-", "")
    .replaceAll(/[^\w\s]/g, "")
    .replaceAll("  ", " ")
    .replaceAll(" ", "-");
    
  return slugResult;
}

export function isEmailValid(email: string): boolean {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  } else {
    return false;
  }
}

export function getFullUrl() {
  return useRuntimeConfig().public.appUrl + useRoute().fullPath;
}

export function cloneJson(json: Record<string, any>) {
  return JSON.parse(JSON.stringify(json));
}

export function formatTitle(text: string): string {
  const result = text!.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function isProduction() {
  const config = useRuntimeConfig();
  return config.public.environment == "PRODUCTION";
}

export function mapJsonToType<T, U>(json: T, mappingFn: (json: T) => U): U {
  return mappingFn(json);
}

export function capitalizeFirstLetter(text: string) {
  return text
  .split(" ")
  .map(
    (word) =>
      word.charAt(0).toUpperCase() +
      word.slice(1).toLowerCase()
  )
  .join(" ");
}

// Debounce function to avoid too many calls in quick succession
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  return (...args: Parameters<T>): void => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
