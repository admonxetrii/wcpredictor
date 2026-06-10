// ─── Point Values ────────────────────────────────────────────────────────────
export const POINTS = {
  /** Correctly predicting the match winner (but not exact score) */
  CORRECT_WINNER: 3,
  /** Correctly predicting winner AND exact score */
  EXACT_SCORE: 5,
  /** Knockout: correctly predicting the game time (FT/ET/PEN) */
  CORRECT_GAME_TIME: 2,
  /** Final Winner prediction matches the actual tournament winner */
  FINAL_WINNER_BONUS: 10,
  /** Max possible points per knockout match (exact score + game time) */
  MAX_KNOCKOUT_MATCH: 7,
  /** Unique Predictor threshold — if ≤ this many users score perfect 7, flag them */
  UNIQUE_PREDICTOR_THRESHOLD: 4,
} as const;

// ─── Match Stages ────────────────────────────────────────────────────────────
export const STAGES = {
  GROUP: "GROUP",
  ROUND_OF_32: "ROUND_OF_32",
  ROUND_OF_16: "ROUND_OF_16",
  QUARTER_FINAL: "QUARTER_FINAL",
  SEMI_FINAL: "SEMI_FINAL",
  THIRD_PLACE: "THIRD_PLACE",
  FINAL: "FINAL",
} as const;

export type Stage = (typeof STAGES)[keyof typeof STAGES];

// ─── Game Time (for knockout predictions) ────────────────────────────────────
export const GAME_TIMES = {
  FULL_TIME: "FULL_TIME",
  EXTRA_TIME: "EXTRA_TIME",
  PENALTY: "PENALTY",
} as const;

export type GameTime = (typeof GAME_TIMES)[keyof typeof GAME_TIMES];

// ─── User Roles ──────────────────────────────────────────────────────────────
export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ─── Prediction Lock ─────────────────────────────────────────────────────────
/** Predictions lock this many milliseconds before kickoff */
export const LOCK_BEFORE_KICKOFF_MS = 60 * 60 * 1000; // 1 hour

// ─── Tournament Dates ────────────────────────────────────────────────────────
export const TOURNAMENT_START = new Date("2026-06-11T00:00:00Z");
export const TOURNAMENT_END = new Date("2026-07-19T23:59:59Z");

// ─── Knockout Stage Labels ──────────────────────────────────────────────────
export const STAGE_LABELS: Record<Stage, string> = {
  GROUP: "Group Stage",
  ROUND_OF_32: "Round of 32",
  ROUND_OF_16: "Round of 16",
  QUARTER_FINAL: "Quarterfinals",
  SEMI_FINAL: "Semifinals",
  THIRD_PLACE: "Third Place",
  FINAL: "Final",
};

// ─── Team Flags Mapping ──────────────────────────────────────────────────────
export const TEAM_FLAGS: Record<string, string> = {
  MEX: "🇲🇽", RSA: "🇿🇦", KOR: "🇰🇷", CZE: "🇨🇿",
  CAN: "🇨🇦", BIH: "🇧🇦", QAT: "🇶🇦", SUI: "🇨🇭",
  BRA: "🇧🇷", MAR: "🇲🇦", HAI: "🇭🇹", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  USA: "🇺🇸", PAR: "🇵🇾", AUS: "🇦🇺", TUR: "🇹🇷",
  GER: "🇩🇪", CUW: "🇨🇼", CIV: "🇨🇮", ECU: "🇪🇨",
  NED: "🇳🇱", JPN: "🇯🇵", SWE: "🇸🇪", TUN: "🇹🇳",
  BEL: "🇧🇪", EGY: "🇪🇬", IRN: "🇮🇷", NZL: "🇳🇿",
  ESP: "🇪🇸", CPV: "🇨🇻", KSA: "🇸🇦", URU: "🇺🇾",
  FRA: "🇫🇷", SEN: "🇸🇳", IRQ: "🇮🇶", NOR: "🇳🇴",
  ARG: "🇦🇷", ALG: "🇩🇿", AUT: "🇦🇹", JOR: "🇯🇴",
  POR: "🇵🇹", COD: "🇨🇩", UZB: "🇺🇿", COL: "🇨🇴",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", CRO: "🇭🇷", GHA: "🇬🇭", PAN: "🇵🇦",
  TBD: "🏳️",
};

export function getTeamFlag(code: string): string {
  return TEAM_FLAGS[code] || "🏳️";
}

export const TEAM_NAMES: Record<string, string> = {
  MEX: 'Mexico', RSA: 'South Africa', KOR: 'South Korea', CZE: 'Czechia', 
  CAN: 'Canada', BIH: 'Bosnia and Herzegovina', QAT: 'Qatar', SUI: 'Switzerland', 
  BRA: 'Brazil', MAR: 'Morocco', HAI: 'Haiti', SCO: 'Scotland', 
  USA: 'United States', PAR: 'Paraguay', AUS: 'Australia', TUR: 'Türkiye', 
  GER: 'Germany', CUW: 'Curaçao', CIV: 'Ivory Coast', ECU: 'Ecuador', 
  NED: 'Netherlands', JPN: 'Japan', SWE: 'Sweden', TUN: 'Tunisia', 
  BEL: 'Belgium', EGY: 'Egypt', IRN: 'Iran', NZL: 'New Zealand', 
  ESP: 'Spain', CPV: 'Cabo Verde', KSA: 'Saudi Arabia', URU: 'Uruguay', 
  FRA: 'France', SEN: 'Senegal', IRQ: 'Iraq', NOR: 'Norway', 
  ARG: 'Argentina', ALG: 'Algeria', AUT: 'Austria', JOR: 'Jordan', 
  POR: 'Portugal', COD: 'DR Congo', UZB: 'Uzbekistan', COL: 'Colombia', 
  ENG: 'England', CRO: 'Croatia', GHA: 'Ghana', PAN: 'Panama',
  TBD: 'TBD'
};

export function getTeamName(code: string): string {
  return TEAM_NAMES[code] || code;
}
