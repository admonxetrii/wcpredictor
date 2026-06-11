# WC 2026 Predictor - Project Guidelines & Agent Instructions

**Project Name:** WC 2026 Predictor
**Description:** An internal company portal for forecasting FIFA World Cup 2026 matches.

## System Architecture
* **Framework:** Next.js (App Router) serving as both frontend and backend.
* **Database:** PostgreSQL, utilizing Prisma ORM for schema management and type-safe queries.
* **Styling & UI:** Tailwind CSS, Framer Motion (for the animated landing page), and a modern component library (like shadcn/ui or MUI) for complex dashboard elements.
* **Authentication:** NextAuth.js (Credentials provider or Email magic links) with Admin/User role-based access control.

## Agent Roles & Responsibilities

When working on this project, adhere to the following agent roles depending on the task. Whenever a prompt is given with specific tags or instructions, assume the relevant agent persona and execute accordingly.

### Agent 1 — Product Architect & System Planner
**Scope:** Requirements, system design, database models, Next.js route structure, and core logic specification.
**Deliverables:**
* **Core Feature Scope:**
    * Immersive, animated landing page.
    * Registration flow requiring any Google SSO login for first time and a one-time "Final Tournament Winner" prediction.
    * Admin dashboard to approve/activate users (based on manual fee payment).
    * Interactive dashboard for predictions, locked 1 hour before kickoff based on precise timezone handling (accounting for both Nepal and US local times).
    * Automated point calculation engine and global leaderboard.
* **Data Models (Prisma Schema Outline):**
    * `User` (id, email, status, finalWinnerPrediction, totalPoints, role).
    * `Match` (id, teamA, teamB, kickoffTime, actualScoreA, actualScoreB, actualGameTime, stage).
    * `Prediction` (id, userId, matchId, predictedScoreA, predictedScoreB, predictedGameTime, pointsAwarded).
* **Point Calculation Logic (Strict Rules):**
    * **10 Jumbo Points:** If the user's registration "Final Winner" prediction matches the actual tournament winner.
    * **3 Points:** Correctly predicting the match winner, but not the exact score.
    * **5 Points:** Correctly predicting both the winner AND the exact goal score. (Note: Penalty shootout goals are added to the final score. E.g., 1-1 after extra time, 5-4 penalties = 6-5 final score).
    * **+2 Points:** In Knockout stages, correctly predicting the Game Time (Full Time, Extra Time, Penalty).
    * **Unique Predictor Prize:** In Knockout stages, if 4 or fewer users score a perfect 7 points on a match, flag them for a special prize.
* **Constraint:** Do not write implementation code. Only produce planning documents, Next.js folder structures, and the Prisma schema outline.

### Agent 2 — Backend & Database Engineer
**Scope:** Implement all server-side logic, API routes, database operations, and the point-calculation algorithm.
**Deliverables:**
* **Database Setup:** Complete `schema.prisma` file.
* **Server Actions / API Routes:**
    * Authentication and Admin activation logic.
    * Match seeding script (fetching or structuring mock FIFA 2026 schedule data).
    * Prediction submission handler (must strictly reject any submission or edit where `currentTime >= match.kickoffTime - 1 hour`).
* **Point Calculation Engine:** A centralized utility function that takes a `Match` and a `Prediction` and accurately outputs the points based on Agent 1's strict rules, including the "Unique Predictor" logic.
* **Constraints:** Ensure database queries are optimized. Use Next.js Server Actions where possible to minimize client-side fetching overhead.

### Agent 3 — Frontend & UI/UX Engineer
**Scope:** Build all React components, page layouts, animations, and client-side validation.
**Deliverables:**
* **Pages:**
    * `/` - High-energy, animated landing page (using Framer Motion) resembling a premium sports platform.
    * `/register` - Form including the unchangeable "Final Winner" dropdown.
    * `/dashboard` - The main hub showing upcoming matches, user's current points, and prediction status.
    * `/predict/[matchId]` - The betting interface. Needs clear visual indicators if a match is locked.
    * `/leaderboard` - Interactive, sortable table showing rankings.
    * `/admin` - Table interface for admins to toggle user `isActive` status.
* **UX Requirements:**
    * Responsive, mobile-first design.
    * Dashboard must utilize progress bars, intuitive state indicators (Locked/Open), and clear visual hierarchy.
    * Real-time localized countdown timers showing exactly how long until the prediction window closes.
* **Constraints:** Use functional components and hooks. Ensure loading states (skeletons) are present for all data fetching.

### Agent 4 — Integration Engineer & QA
**Scope:** Connect the frontend components to the backend actions, verify edge cases, and finalize deployment readiness.
**Deliverables:**
* **Integration:** Bind Agent 3's UI to Agent 2's server actions.
* **Timezone & Edge Case Testing Strategy:**
    * [ ] Verify the 1-hour locking mechanism works flawlessly across different user timezones.
    * [ ] Verify penalty shootout score aggregations format correctly.
    * [ ] Verify users cannot change their "Final Winner" prediction post-registration.
    * [ ] Verify inactive users are completely blocked from making match predictions.
* **Setup Documentation:** Provide the exact terminal commands to install dependencies, push the Prisma schema, and run the Next.js development server.

## Collaboration & Handoff Rules:
1. Agent 1 provides the architecture, Prisma schema, and route structure.
2. Agents 2 and 3 generate the Next.js code for their respective domains based on Agent 1's blueprint.
3. Agent 4 provides the final integration wiring and startup instructions.
4. **Handoff Format:** Clearly mark all code blocks with their respective file paths (e.g., `// src/app/page.tsx` or `// prisma/schema.prisma`).

---
*Note for AI Agents: Always scan and adhere to these guidelines when working on any task related to this project. Before starting any work, verify which Agent persona you are embodying based on the user's prompt.*
