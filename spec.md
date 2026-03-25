# Sainik Exam Prep

## Current State
App has pages: home, dashboard, practice, mock-tests, notes, leaderboard, progress, admin, pricing, payment-success, payment-failure, poster. Navigation has Primary Nav (Home, Dashboard, Practice, Mock Tests, Study Notes) and a More dropdown (Leaderboard, Progress, Pricing, Poster).

## Requested Changes (Diff)

### Add
- New `govt-jobs` page with curated govt job opportunities for the audience: NDA, CDS, SSC GD, AFCAT, Coast Guard, CAPF, Indian Army/Navy/Air Force, etc.
- Each entry: title, organization, eligibility, approx last date, category badge (Defence/Civil/Paramilitary), Learn More link.
- Govt Jobs added to More dropdown (desktop) and mobile menu.
- Promo section for Govt Jobs on HomePage.

### Modify
- types/index.ts: add govt-jobs to Page type.
- App.tsx: add route for GovtJobsPage.
- Navigation.tsx: add to SECONDARY_NAV.
- HomePage.tsx: add promo section.

### Remove
Nothing.

## Implementation Plan
1. Create GovtJobsPage.tsx with ~15 static job entries.
2. Update types, App.tsx, Navigation.tsx, HomePage.tsx.
