# Sainik Exam Prep

## Current State
The app has a full-stack exam prep platform for RIMC, Sainik School, RMS, and Navodaya with:
- Backend APIs: addQuestion, addStudyNote, createMockTest
- Admin Panel with tabs: Add Question, Create Test, Add Note, Payments
- Mock Tests and Study Notes pages that display backend data
- Currently the backend has minimal content

## Requested Changes (Diff)

### Add
- A "Seed Content" tab in the Admin Panel with a button to bulk-load comprehensive syllabus content
- Comprehensive seed data utility file covering all 4 exams x 4 subjects with real syllabus topics
- Study notes seed: 3 notes per subject per exam = 48 notes total (manageable size)
- Question seed: 8 questions per subject per exam = 128 questions total
- Mock test seed: 3 tests per exam = 12 tests total (each using seeded questions)
- Progress tracking UI showing how many items have been seeded and progress bar
- Seed runs in batches (sequential await calls) to avoid timeout

### Modify
- AdminPage.tsx: Add "Seed Content" tab (5th tab) alongside existing tabs
- The seed function calls addQuestion, addStudyNote, createMockTest sequentially

### Remove
- Nothing removed

## Implementation Plan
1. Create src/utils/seedData.ts with comprehensive content arrays:
   - Questions for each exam x subject combo (8 per combo = 128 total)
   - Study notes for each exam x subject combo (3 per combo = 48 total)
   - Mock test definitions referencing question indices
2. Create SeedContentPanel component in AdminPage.tsx:
   - "Seed Study Notes" button, "Seed Questions" button, "Seed Mock Tests" button
   - Progress state with count display
   - Runs through seed data arrays and calls backend APIs in sequence
   - Shows success/error toast on completion
3. Add 5th tab "Seed" to AdminPage tab list
4. Ensure seed data covers real syllabus topics for each exam
