// Affiliate configuration
// Tools listed here have affiliate programs and get UTM tracking parameters appended.
// Add new affiliate partners by adding their perk ID to this map.
// The `ref` field is an optional affiliate/referral code to append.

export interface AffiliateConfig {
  hasAffiliate: boolean;
  ref?: string; // optional referral code param
}

export const AFFILIATES: Record<string, AffiliateConfig> = {
  // Dev Tools
  "cursor-pro": { hasAffiliate: true },
  "jetbrains-ides": { hasAffiliate: true },
  "replit-pro": { hasAffiliate: true },
  "frontend-masters": { hasAffiliate: true },
  "codecademy-student": { hasAffiliate: true },

  // Cloud
  "digitalocean-credits": { hasAffiliate: true, ref: "studentperks" },
  "heroku-credits": { hasAffiliate: true },
  "namecheap-edu": { hasAffiliate: true },

  // Design
  "figma-education": { hasAffiliate: true },
  "canva-student": { hasAffiliate: true },
  "adobe-creative-cloud": { hasAffiliate: true },

  // Security
  "nordvpn-student": { hasAffiliate: true, ref: "studentperks" },
  "surfshark-student": { hasAffiliate: true },
  "1password-student": { hasAffiliate: true },
  "dashlane-student": { hasAffiliate: true },

  // Music & Streaming
  "spotify-student": { hasAffiliate: true },
  "amazon-prime-student": { hasAffiliate: true },

  // Food
  "hellofresh-student": { hasAffiliate: true },
  "doordash-student": { hasAffiliate: true },

  // Hardware
  "samsung-student": { hasAffiliate: true },
  "hp-student": { hasAffiliate: true },
  "dell-student": { hasAffiliate: true },
  "backmarket-student": { hasAffiliate: true },

  // Learning
  "skillshare-student": { hasAffiliate: true },
  "coursera-edu": { hasAffiliate: true },
};

// Build a tracked URL with UTM parameters
export function buildTrackedUrl(baseUrl: string, perkId: string): string {
  const config = AFFILIATES[perkId];
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("utm_source", "studentperks");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", "perks");
    if (config?.ref) {
      url.searchParams.set("ref", config.ref);
    }
    return url.toString();
  } catch {
    // If URL parsing fails, append manually
    const sep = baseUrl.includes("?") ? "&" : "?";
    let tracked = `${baseUrl}${sep}utm_source=studentperks&utm_medium=referral&utm_campaign=perks`;
    if (config?.ref) tracked += `&ref=${config.ref}`;
    return tracked;
  }
}
