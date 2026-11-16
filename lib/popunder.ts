export interface PopunderConfig {
  /** Master toggle to enable or disable popunder ads globally */
  enabled: boolean;
  /** sessionStorage key used to track per-session frequency capping */
  storageKey: string;
  /** Maximum number of popunders allowed per visitor session */
  maxPerSession: number;
  /**
   * Optional direct popunder / smartlink URL (configured via NEXT_PUBLIC_POPUNDER_URL).
   * Leave empty when relying solely on the provider scripts below.
   */
  directUrl: string;
  /** Existing centralized ad-network popunder/script URLs */
  providerScripts: readonly string[];
  /** CSS selectors for interactive elements that should not trigger a popunder */
  ignoredSelectors: string;
}

export const POPUNDER_CONFIG: PopunderConfig = {
  enabled: process.env.NEXT_PUBLIC_POPUNDER_ENABLED !== "false",
  storageKey: "wingpoll_popunder_session_count",
  maxPerSession: 1,
  directUrl: (process.env.NEXT_PUBLIC_POPUNDER_URL || "").trim(),
  providerScripts: [
    "https://abscloud.org/1/7adfc76466f73edaa573b97b204a9561",
    "https://bauval.org/14/08e451d279eff3066ce389c4216337f3",
  ],
  ignoredSelectors:
    'a, button, input, select, textarea, label, form, [role="button"], [download], [data-no-popunder="true"]',
};

