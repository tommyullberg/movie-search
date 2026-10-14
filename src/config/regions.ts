export interface RegionOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface StreamingProvider {
  id: number;
  name: string;
  logoPath?: string;
}

export const SUPPORTED_REGIONS: RegionOption[] = [
  { code: "SE", name: "Sweden", nativeName: "Sverige", flag: "🇸🇪" },
  { code: "AD", name: "Andorra", nativeName: "Andorra", flag: "🇦🇩" },
  { code: "AT", name: "Austria", nativeName: "Österreich", flag: "🇦🇹" },
  { code: "AU", name: "Australia", nativeName: "Australia", flag: "🇦🇺" },
  { code: "BE", name: "Belgium", nativeName: "België / Belgique", flag: "🇧🇪" },
  { code: "BG", name: "Bulgaria", nativeName: "България", flag: "🇧🇬" },
  { code: "CA", name: "Canada", nativeName: "Canada", flag: "🇨🇦" },
  { code: "CH", name: "Switzerland", nativeName: "Schweiz / Suisse", flag: "🇨🇭" },
  { code: "CY", name: "Cyprus", nativeName: "Κύπρος", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", nativeName: "Česko", flag: "🇨🇿" },
  { code: "DE", name: "Germany", nativeName: "Deutschland", flag: "🇩🇪" },
  { code: "DK", name: "Denmark", nativeName: "Danmark", flag: "🇩🇰" },
  { code: "EE", name: "Estonia", nativeName: "Eesti", flag: "🇪🇪" },
  { code: "ES", name: "Spain", nativeName: "España", flag: "🇪🇸" },
  { code: "FI", name: "Finland", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "FR", name: "France", nativeName: "France", flag: "🇫🇷" },
  { code: "GB", name: "United Kingdom", nativeName: "United Kingdom", flag: "🇬🇧" },
  { code: "GR", name: "Greece", nativeName: "Ελλάδα", flag: "🇬🇷" },
  { code: "HR", name: "Croatia", nativeName: "Hrvatska", flag: "🇭🇷" },
  { code: "HU", name: "Hungary", nativeName: "Magyarország", flag: "🇭🇺" },
  { code: "IE", name: "Ireland", nativeName: "Éire", flag: "🇮🇪" },
  { code: "IS", name: "Iceland", nativeName: "Ísland", flag: "🇮🇸" },
  { code: "IT", name: "Italy", nativeName: "Italia", flag: "🇮🇹" },
  { code: "JP", name: "Japan", nativeName: "日本", flag: "🇯🇵" },
  { code: "LI", name: "Liechtenstein", nativeName: "Liechtenstein", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", nativeName: "Lietuva", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", nativeName: "Lëtzebuerg", flag: "🇱🇺" },
  { code: "LV", name: "Latvia", nativeName: "Latvija", flag: "🇱🇻" },
  { code: "MC", name: "Monaco", nativeName: "Monaco", flag: "🇲🇨" },
  { code: "MT", name: "Malta", nativeName: "Malta", flag: "🇲🇹" },
  { code: "NL", name: "Netherlands", nativeName: "Nederland", flag: "🇳🇱" },
  { code: "NO", name: "Norway", nativeName: "Norge", flag: "🇳🇴" },
  { code: "PL", name: "Poland", nativeName: "Polska", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", nativeName: "Portugal", flag: "🇵🇹" },
  { code: "RO", name: "Romania", nativeName: "România", flag: "🇷🇴" },
  { code: "RU", name: "Russia", nativeName: "Россия", flag: "🇷🇺" },
  { code: "SI", name: "Slovenia", nativeName: "Slovenija", flag: "🇸🇮" },
  { code: "SK", name: "Slovakia", nativeName: "Slovensko", flag: "🇸🇰" },
  { code: "SM", name: "San Marino", nativeName: "San Marino", flag: "🇸🇲" },
  { code: "UA", name: "Ukraine", nativeName: "Україна", flag: "🇺🇦" },
  { code: "US", name: "United States", nativeName: "United States", flag: "🇺🇸" },
];

export const REGION_PROVIDERS: Record<string, StreamingProvider[]> = {
  SE: [
    { id: 8, name: "Netflix" },
    { id: 1899, name: "Max" },
    { id: 337, name: "Disney+" },
    { id: 119, name: "Prime Video" },
    { id: 1773, name: "SkyShowtime" },
    { id: 76, name: "Viaplay" },
    { id: 350, name: "Apple TV" },
    { id: 1944, name: "TV4 Play" },
    { id: 493, name: "SVT Play" },
  ],
  US: [
    { id: 8, name: "Netflix" },
    { id: 9, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 1899, name: "Max" },
    { id: 15, name: "Hulu" },
    { id: 350, name: "Apple TV" },
    { id: 386, name: "Peacock" },
    { id: 531, name: "Paramount+" },
  ],
  GB: [
    { id: 8, name: "Netflix" },
    { id: 9, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 38, name: "BBC iPlayer" },
    { id: 350, name: "Apple TV" },
    { id: 103, name: "Channel 4" },
    { id: 100, name: "ITVX" },
    { id: 531, name: "Paramount+" },
    { id: 39, name: "NOW" },
  ],
  NO: [
    { id: 8, name: "Netflix" },
    { id: 76, name: "Viaplay" },
    { id: 459, name: "TV 2 Play" },
    { id: 460, name: "NRK TV" },
    { id: 337, name: "Disney+" },
    { id: 119, name: "Prime Video" },
    { id: 1899, name: "Max" },
    { id: 1773, name: "SkyShowtime" },
    { id: 350, name: "Apple TV" },
  ],
  DK: [
    { id: 8, name: "Netflix" },
    { id: 76, name: "Viaplay" },
    { id: 461, name: "TV 2 Play" },
    { id: 462, name: "DR TV" },
    { id: 337, name: "Disney+" },
    { id: 119, name: "Prime Video" },
    { id: 1899, name: "Max" },
    { id: 1773, name: "SkyShowtime" },
    { id: 350, name: "Apple TV" },
  ],
  FI: [
    { id: 8, name: "Netflix" },
    { id: 76, name: "Viaplay" },
    { id: 463, name: "Yle Areena" },
    { id: 464, name: "MTV Katsomo" },
    { id: 465, name: "Ruutu" },
    { id: 337, name: "Disney+" },
    { id: 119, name: "Prime Video" },
    { id: 1899, name: "Max" },
    { id: 350, name: "Apple TV" },
  ],
  DE: [
    { id: 8, name: "Netflix" },
    { id: 9, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 30, name: "WOW / Sky" },
    { id: 350, name: "Apple TV" },
    { id: 310, name: "Joyn" },
    { id: 177, name: "RTL+" },
    { id: 531, name: "Paramount+" },
  ],
  FR: [
    { id: 8, name: "Netflix" },
    { id: 119, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 381, name: "Canal+" },
    { id: 350, name: "Apple TV" },
    { id: 1898, name: "TF1+" },
    { id: 531, name: "Paramount+" },
    { id: 1899, name: "Max" },
  ],
  ES: [
    { id: 8, name: "Netflix" },
    { id: 119, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 1899, name: "Max" },
    { id: 149, name: "Movistar+" },
    { id: 350, name: "Apple TV" },
    { id: 63, name: "Filmin" },
    { id: 1773, name: "SkyShowtime" },
  ],
  IT: [
    { id: 8, name: "Netflix" },
    { id: 119, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 39, name: "NOW" },
    { id: 350, name: "Apple TV" },
    { id: 222, name: "RaiPlay" },
    { id: 531, name: "Paramount+" },
    { id: 538, name: "Mediaset Infinity" },
  ],
  NL: [
    { id: 8, name: "Netflix" },
    { id: 72, name: "Videoland" },
    { id: 337, name: "Disney+" },
    { id: 119, name: "Prime Video" },
    { id: 1899, name: "Max" },
    { id: 1773, name: "SkyShowtime" },
    { id: 350, name: "Apple TV" },
    { id: 76, name: "Viaplay" },
  ],
  PL: [
    { id: 8, name: "Netflix" },
    { id: 1899, name: "Max" },
    { id: 337, name: "Disney+" },
    { id: 119, name: "Prime Video" },
    { id: 1773, name: "SkyShowtime" },
    { id: 505, name: "Player" },
    { id: 381, name: "Canal+" },
    { id: 350, name: "Apple TV" },
    { id: 76, name: "Viaplay" },
  ],
  AT: [
    { id: 8, name: "Netflix" },
    { id: 9, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 321, name: "Sky X" },
    { id: 350, name: "Apple TV" },
    { id: 381, name: "Canal+" },
    { id: 310, name: "Joyn" },
    { id: 531, name: "Paramount+" },
  ],
  CH: [
    { id: 8, name: "Netflix" },
    { id: 119, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 350, name: "Apple TV" },
    { id: 30, name: "Sky" },
    { id: 559, name: "blue TV" },
    { id: 564, name: "Play Suisse" },
    { id: 531, name: "Paramount+" },
  ],
  BE: [
    { id: 8, name: "Netflix" },
    { id: 337, name: "Disney+" },
    { id: 119, name: "Prime Video" },
    { id: 350, name: "Apple TV" },
    { id: 475, name: "Streamz" },
    { id: 1894, name: "VRT MAX" },
    { id: 474, name: "RTBF Auvio" },
    { id: 1899, name: "Max" },
  ],
  PT: [
    { id: 8, name: "Netflix" },
    { id: 119, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 1899, name: "Max" },
    { id: 350, name: "Apple TV" },
    { id: 1773, name: "SkyShowtime" },
    { id: 483, name: "Opto" },
    { id: 63, name: "Filmin" },
  ],
  CZ: [
    { id: 8, name: "Netflix" },
    { id: 1899, name: "Max" },
    { id: 337, name: "Disney+" },
    { id: 119, name: "Prime Video" },
    { id: 484, name: "Voyo" },
    { id: 1773, name: "SkyShowtime" },
    { id: 350, name: "Apple TV" },
  ],
  IE: [
    { id: 8, name: "Netflix" },
    { id: 9, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 39, name: "NOW" },
    { id: 350, name: "Apple TV" },
    { id: 531, name: "Paramount+" },
  ],
  UA: [
    { id: 283, name: "Megogo" },
    { id: 328, name: "Sweet.tv" },
    { id: 8, name: "Netflix" },
    { id: 350, name: "Apple TV" },
    { id: 119, name: "Prime Video" },
  ],
  RU: [
    { id: 115, name: "Kinopoisk" },
    { id: 113, name: "Ivi" },
    { id: 114, name: "Okko" },
    { id: 116, name: "Amediateka" },
    { id: 396, name: "Premier" },
  ],
  CA: [
    { id: 8, name: "Netflix" },
    { id: 9, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 230, name: "Crave" },
    { id: 350, name: "Apple TV" },
    { id: 531, name: "Paramount+" },
  ],
  AU: [
    { id: 8, name: "Netflix" },
    { id: 9, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 21, name: "Stan" },
    { id: 387, name: "BINGE" },
    { id: 350, name: "Apple TV" },
    { id: 531, name: "Paramount+" },
  ],
  JP: [
    { id: 8, name: "Netflix" },
    { id: 9, name: "Prime Video" },
    { id: 337, name: "Disney+" },
    { id: 84, name: "U-NEXT" },
    { id: 15, name: "Hulu Japan" },
    { id: 350, name: "Apple TV" },
  ],
};

export const DEFAULT_PROVIDERS: StreamingProvider[] = [
  { id: 8, name: "Netflix" },
  { id: 119, name: "Prime Video" },
  { id: 337, name: "Disney+" },
  { id: 350, name: "Apple TV" },
  { id: 1899, name: "Max" },
  { id: 1773, name: "SkyShowtime" },
  { id: 531, name: "Paramount+" },
];

export function getProvidersForRegion(regionCode: string): StreamingProvider[] {
  return REGION_PROVIDERS[regionCode] || DEFAULT_PROVIDERS;
}

export function detectBrowserRegion(): string {
  try {
    const navLangs = navigator.languages || [navigator.language];
    for (const lang of navLangs) {
      if (!lang) continue;
      const parts = lang.split("-");
      if (parts.length > 1) {
        const countryCandidate = parts[parts.length - 1].toUpperCase();
        if (SUPPORTED_REGIONS.some((r) => r.code === countryCandidate)) {
          return countryCandidate;
        }
      }
      const primary = parts[0].toLowerCase();
      if (primary === "sv") return "SE";
      if (primary === "no" || primary === "nb" || primary === "nn") return "NO";
      if (primary === "da") return "DK";
      if (primary === "fi") return "FI";
      if (primary === "de") return "DE";
      if (primary === "fr") return "FR";
      if (primary === "es") return "ES";
      if (primary === "it") return "IT";
      if (primary === "nl") return "NL";
      if (primary === "pl") return "PL";
      if (primary === "pt") return "PT";
      if (primary === "uk") return "UA";
      if (primary === "ru") return "RU";
      if (primary === "el") return "GR";
      if (primary === "cs") return "CZ";
      if (primary === "hu") return "HU";
      if (primary === "ro") return "RO";
      if (primary === "bg") return "BG";
      if (primary === "hr") return "HR";
      if (primary === "sk") return "SK";
      if (primary === "sl") return "SI";
      if (primary === "et") return "EE";
      if (primary === "lv") return "LV";
      if (primary === "lt") return "LT";
      if (primary === "is") return "IS";
      if (primary === "ja") return "JP";
    }
  } catch (e) {
    console.warn("Could not detect browser locale", e);
  }
  return "SE";
}
