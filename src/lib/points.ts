import { POINTS, STAGES, type Stage, type GameTime } from "./constants";

interface MatchResult {
  actualScoreA: number;
  actualScoreB: number;
  actualGameTime: GameTime | null;
  stage: Stage;
}

interface UserPrediction {
  predictedScoreA: number;
  predictedScoreB: number;
  predictedGameTime: GameTime | null;
}

export interface PointBreakdown {
  winnerPoints: number;
  scorePoints: number;
  gameTimePoints: number;
  total: number;
  isPerfectKnockout: boolean;
}

/**
 * Determines the match outcome from scores.
 * Returns "A" if team A wins, "B" if team B wins, "DRAW" for a draw.
 */
function getOutcome(scoreA: number, scoreB: number): "A" | "B" | "DRAW" {
  if (scoreA > scoreB) return "A";
  if (scoreB > scoreA) return "B";
  return "DRAW";
}

/**
 * Checks if a stage is a knockout stage (where game time prediction applies).
 */
function isKnockoutStage(stage: Stage): boolean {
  return stage !== STAGES.GROUP;
}

/**
 * Calculate points for a single prediction against the actual match result.
 *
 * Rules (from AGENT_INSTRUCTIONS.md):
 * - 3 pts: Correctly predicting the match winner (not exact score)
 * - 5 pts: Correctly predicting winner AND exact goal score
 *   (Note: Penalty shootout goals are added to final score.
 *    E.g., 1-1 after ET, 5-4 penalties = 6-5 final score)
 * - +2 pts: In Knockout stages, correctly predicting Game Time (FT/ET/PEN)
 * - 10 pts: "Jumbo" bonus if user's Final Winner prediction matches champion
 *   (handled separately, not in this function)
 *
 * Max per group match: 5 pts (exact score)
 * Max per knockout match: 7 pts (exact score 5 + game time 2)
 */
export function calculateMatchPoints(
  match: MatchResult,
  prediction: UserPrediction
): PointBreakdown {
  const breakdown: PointBreakdown = {
    winnerPoints: 0,
    scorePoints: 0,
    gameTimePoints: 0,
    total: 0,
    isPerfectKnockout: false,
  };

  const actualOutcome = getOutcome(match.actualScoreA, match.actualScoreB);
  const predictedOutcome = getOutcome(
    prediction.predictedScoreA,
    prediction.predictedScoreB
  );

  // Check if the predicted outcome matches the actual outcome
  const correctOutcome = actualOutcome === predictedOutcome;

  if (!correctOutcome) {
    // Wrong outcome — no points at all
    return breakdown;
  }

  // Check for exact score match
  const exactScore =
    prediction.predictedScoreA === match.actualScoreA &&
    prediction.predictedScoreB === match.actualScoreB;

  if (exactScore) {
    // Exact score match — 5 points (NOT 3 + 5)
    breakdown.scorePoints = POINTS.EXACT_SCORE;
  } else {
    // Correct winner but not exact score — 3 points
    breakdown.winnerPoints = POINTS.CORRECT_WINNER;
  }

  // Knockout bonus: correct game time prediction
  if (
    isKnockoutStage(match.stage) &&
    prediction.predictedGameTime !== null &&
    match.actualGameTime !== null &&
    prediction.predictedGameTime === match.actualGameTime
  ) {
    breakdown.gameTimePoints = POINTS.CORRECT_GAME_TIME;
  }

  breakdown.total =
    breakdown.winnerPoints + breakdown.scorePoints + breakdown.gameTimePoints;

  // Flag perfect knockout prediction (7 points = 5 exact + 2 game time)
  if (isKnockoutStage(match.stage) && breakdown.total === POINTS.MAX_KNOCKOUT_MATCH) {
    breakdown.isPerfectKnockout = true;
  }

  return breakdown;
}

/**
 * Check if a "Unique Predictor Prize" should be flagged for a match.
 * In knockout stages, if 4 or fewer users scored a perfect 7 on a match,
 * they get flagged for a special prize.
 */
export function shouldFlagUniquePredictors(
  perfectCount: number
): boolean {
  return perfectCount > 0 && perfectCount <= POINTS.UNIQUE_PREDICTOR_THRESHOLD;
}
