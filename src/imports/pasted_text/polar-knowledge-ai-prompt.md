FINAL FUNCTIONALITY + POLAR KNOWLEDGE AI INTEGRATION PROMPT

The website is already built with exactly 11 primary sidebar panels.

DO NOT create any new sidebar panel.

The existing 11 panels are:

1. Dashboard
2. Expeditions
3. Research Publications
4. Scientific Datasets
5. Media Gallery
6. Polar Map & GIS
7. Polar Knowledge (AI)
8. Education & Outreach
9. News & Announcements
10. Events & Activities
11. About NCPOR

========================================================
MAIN OBJECTIVE
========================================================

The previous implementation added many advanced features, including a
NotebookLM-inspired source/chat/studio experience.

However, the current implementation has two major problems:

1. Some features are currently only visual/mock UI and do not actually work.
2. The NotebookLM-inspired functionality is located somewhere else instead
   of being properly integrated into:

   POLAR KNOWLEDGE (AI)

Fix both problems.

DO NOT simply add more cards or buttons.

Make the existing functionality actually work.

========================================================
1. AUDIT THE CURRENT CODE FIRST
========================================================

Before changing anything, inspect the complete codebase.

Find:

- where the NotebookLM-inspired functionality currently exists
- its route
- its components
- source management
- chat implementation
- studio implementation
- AI logic
- mock data
- generated outputs
- existing API calls
- existing data models
- existing repository search
- existing publication data
- existing dataset data
- existing expedition data
- existing media data
- existing AI components

Determine which functionality is:

A. Fully functional
B. Partially functional
C. Mock/demo only
D. Broken
E. Duplicate

Do not rebuild features that already work.

Extend existing functionality where possible.

========================================================
2. MOVE THE NOTEBOOKLM-STYLE EXPERIENCE INTO
   POLAR KNOWLEDGE (AI)
========================================================

The NotebookLM-style functionality must become a CORE capability
inside the existing:

POLAR KNOWLEDGE (AI)

panel.

Do NOT create:

/notebook
/notebooklm
/studio
/sources
/chat

as new primary sidebar sections.

The user should enter:

POLAR KNOWLEDGE (AI)

and find the complete source-grounded AI workspace there.

========================================================
3. POLAR KNOWLEDGE AI — NEW INTERNAL STRUCTURE
========================================================

Inside Polar Knowledge (AI), organize the experience into a clean
workspace.

Recommended structure:

POLAR KNOWLEDGE AI

------------------------------------------------
Sources
------------------------------------------------

Selected Sources

[+ Add Sources]

Search Polar Knowledge

------------------------------------------------
Chat
------------------------------------------------

Ask questions about your selected sources.

------------------------------------------------
Studio
------------------------------------------------

Create useful outputs from selected sources.

------------------------------------------------

Do NOT necessarily copy the exact NotebookLM visual layout.

Use the existing NCPOR design system.

The important thing is the WORKFLOW.

========================================================
4. SOURCE WORKSPACE MUST ACTUALLY WORK
========================================================

Implement a real source-selection system.

Users should be able to add sources from the existing portal.

Supported internal sources should include:

- Expeditions
- Research Publications
- Scientific Datasets
- Media
- Events
- News
- Institutional documents
- Researchers
- Stations
- Topics

The user should be able to:

ADD SOURCE
REMOVE SOURCE
VIEW SOURCE
SEARCH SOURCE
SELECT MULTIPLE SOURCES
CLEAR SOURCES

Example:

Selected Sources: 4

✓ Antarctic Expedition Report 2025
✓ Southern Ocean Dataset
✓ Antarctic Climate Publication
✓ Maitri Station Report

These selected sources become the context for the AI.

========================================================
5. IMPORTANT — DO NOT REQUIRE DUPLICATE UPLOADS
========================================================

If a user is already viewing a Publication, Dataset or Expedition:

they should be able to select:

"Ask Polar"

or

"Add to Polar Knowledge"

or

"Analyze with Polar AI"

The existing entity should be directly connected to the AI source context.

Do NOT make users upload the same document again.

Example:

Research Publication
        ↓
Add to Polar Knowledge
        ↓
Polar Knowledge AI
        ↓
Source automatically selected

Same for:

Dataset
Expedition
Media
Event

========================================================
6. SOURCE SEARCH MUST USE THE EXISTING REPOSITORY
========================================================

When the user clicks:

+ Add Sources

open a source selector.

Search across the actual existing repository/data.

Example:

Search:
"Antarctic sea ice"

Results:

Publication
Dataset
Expedition
Media
Researcher
Station

Each result should have:

[Add]

Once added:

[✓ Added]

Do not use fake hardcoded results if real application data already exists.

Connect to the existing data layer/API.

========================================================
7. POLAR KNOWLEDGE CHAT MUST USE SELECTED SOURCES
========================================================

This is critical.

The chat cannot be a decorative textbox.

When the user asks:

"What were the major findings?"

the system must know which sources are selected.

Conceptually:

User Question
+
Selected Sources
+
Relevant Repository Knowledge
        ↓
Polar AI
        ↓
Answer
        ↓
Evidence / Sources

The answer should display citations/source references.

========================================================
8. CONTEXTUAL AI
========================================================

If AI is opened from:

Expedition

automatically use that expedition as context.

If opened from:

Publication

use that publication.

If opened from:

Dataset

use that dataset.

If opened from:

Map location

use the location and related knowledge.

If opened from:

Media

use the media metadata and connected scientific sources.

This should all feed the SAME Polar Knowledge AI.

Do not create separate AI implementations.

========================================================
9. SOURCE-GROUNDED ANSWERS
========================================================

Every important AI answer should support:

Answer

Sources

Evidence

Confidence/status

Use labels such as:

✓ Source-backed

≈ Synthesized from selected sources

⚠ Insufficient evidence

If the system cannot support an answer from the available sources:

say:

"Insufficient evidence available in the selected sources."

Do NOT fabricate an answer.

========================================================
10. EVIDENCE VIEW
========================================================

Inside Polar Knowledge AI, allow the user to expand an answer.

Example:

AI ANSWER

Antarctic sea-ice conditions changed significantly...

[View Evidence]

Then:

CLAIM
Antarctic sea-ice conditions changed...

SUPPORTING SOURCES

Publication A
Dataset B
Expedition C

This should be a functional interaction.

Do not just display decorative evidence cards.

========================================================
11. SOURCE CONFLICT DETECTION
========================================================

If selected sources contain conflicting information:

do not silently combine them.

Show:

⚠ Potential source conflict

Source A:
...

Source B:
...

Then explain the difference.

If automatic conflict detection cannot yet be implemented reliably,
provide the architecture and UI for it but do not fake a result.

========================================================
12. POLAR STUDIO MUST LIVE INSIDE POLAR KNOWLEDGE AI
========================================================

The NotebookLM-style Studio functionality must be moved into:

POLAR KNOWLEDGE (AI)

Do NOT create a Studio sidebar.

Inside Polar Knowledge AI provide:

[Studio]

or

[Create]

with tools such as:

Audio Overview
Slide Deck
Video Overview
Mind Map
Report
Flashcards
Quiz
Infographic
Data Table

Only show tools that can actually be implemented.

========================================================
13. MAKE STUDIO FUNCTIONAL — NOT MOCK
========================================================

This is extremely important.

Do not create buttons that merely show:

"Generated successfully"

without actually producing something.

Each tool must have a real workflow.

For example:

REPORT

Selected Sources
↓
Generate
↓
Processing
↓
Generated Report
↓
Preview
↓
Source References
↓
Edit
↓
Save

Same principle for every other tool.

========================================================
14. REPORT GENERATION
========================================================

From selected sources:

generate a structured report.

Example:

Title
Executive Summary
Research Context
Key Findings
Evidence
Limitations
References

The report must be based on selected source content.

If actual LLM integration is available:

use it.

If not:

implement the complete service/interface architecture and clearly
separate the generation layer from the UI.

Do not pretend an AI call happened if it did not.

========================================================
15. MIND MAP
========================================================

Generate a functional visual relationship map from selected sources.

Example:

ANTARCTIC SEA ICE
        |
  ┌─────┼─────┐
  |     |     |
Expedition Dataset Publication
  |           |
Station      Finding
  |
Researcher

Use the existing relationship/knowledge graph data.

Allow:

- zoom
- pan
- node selection
- open entity
- inspect relationship

Do not create a new Knowledge Graph sidebar.

========================================================
16. SLIDE DECK
========================================================

Generate a structured slide deck from selected sources.

Each slide should contain:

Title
Content
Source references

Example:

Slide 1 — Expedition Overview
Slide 2 — Research Objective
Slide 3 — Methodology
Slide 4 — Observations
Slide 5 — Dataset
Slide 6 — Findings
Slide 7 — Scientific Context
Slide 8 — References

Allow preview.

If export infrastructure exists, connect to it.

If export does not exist, generate a real preview rather than a fake
download button.

========================================================
17. AUDIO OVERVIEW
========================================================

Create an actual source-grounded audio workflow.

At minimum:

Selected Sources
↓
Generate Audio Script
↓
Preview Script
↓
Audio Generation if supported

If text-to-speech infrastructure is available, use it.

If not, do NOT pretend an audio file was generated.

Provide a functional script/preview state and keep the generation
service replaceable.

========================================================
18. VIDEO OVERVIEW
========================================================

Create a functional video storyboard workflow.

Generate:

Scene
Narration
Visual suggestion
Source

Example:

Scene 1
Scene 2
Scene 3

If actual video rendering is not implemented:

do NOT display a fake "video generated."

Instead provide:

"Storyboard ready"

with a proper preview.

========================================================
19. FLASHCARDS
========================================================

Integrate with:

EDUCATION & OUTREACH

but allow generation from Polar Knowledge AI.

Generate:

Question
Answer
Source
Difficulty

Allow:

Next
Previous
Flip
Regenerate
Save

========================================================
20. QUIZ
========================================================

Generate functional quizzes from selected sources.

Each question should have:

Question
Options
Correct Answer
Explanation
Source

Track:

Score
Progress
Completed questions

Do not generate unsupported facts.

========================================================
21. INFOGRAPHIC
========================================================

Generate an infographic structure from trusted source information.

Include:

Title
Key facts
Statistics where available
Visual sections
Source references

If actual image generation is not connected:

generate a real infographic layout/preview.

Do not create a fake generated-image placeholder.

========================================================
22. DATA TABLE
========================================================

This should connect strongly to:

SCIENTIFIC DATASETS.

Allow:

Select datasets
Select fields
Compare
Filter
Sort

Generate an actual table from available dataset metadata/data.

Example:

Dataset | Region | Period | Variable | Instrument

Allow source references.

========================================================
23. ONE SOURCE → MANY OUTPUTS
========================================================

Make this a core Polar Knowledge AI capability.

Example:

User selects:

1 Publication
1 Dataset
1 Expedition

Then:

Polar Knowledge AI

can:

Ask
Analyze
Compare
Summarize
Verify

Then:

Polar Studio

can create:

Report
Slide Deck
Mind Map
Quiz
Flashcards
Infographic
Audio Script
Video Storyboard
Data Table

This should all use the SAME selected-source context.

Do not make the user select the sources again for every tool.

========================================================
24. SOURCE STATE MUST PERSIST
========================================================

If the user selects:

Publication A
Dataset B
Expedition C

then opens:

Chat

and later:

Studio

the same sources remain selected.

Example:

Selected Sources: 3

[Chat] [Studio]

Switching between Chat and Studio must NOT clear the source context.

========================================================
25. SOURCE DETAILS
========================================================

When a source is selected, allow:

View Source
Remove Source
View Metadata
View Provenance

Show:

Title
Type
Date
Version
Origin
Related entities

========================================================
26. SOURCE VERSIONING
========================================================

If a source has versions:

show:

Version 2.1

If an artifact was generated from Version 2.0:

show:

⚠ Source updated since this artifact was created.

Allow:

Review Changes
Regenerate
Keep Existing Version

========================================================
27. GENERATED ARTIFACT HISTORY
========================================================

Inside Polar Knowledge AI, provide a compact:

Recent Work

section.

Example:

Antarctic Research Report
3 sources
Draft

Sea Ice Mind Map
4 sources
Saved

Expedition Quiz
2 sources
Approved

This is NOT a new sidebar panel.

========================================================
28. SAVE / COLLECTION
========================================================

Allow users to save:

sources
AI conversations
generated reports
mind maps
quizzes
flashcards
slide decks

Use the existing profile/header area or contextual drawer.

Do not create another sidebar panel.

========================================================
29. GOVERNANCE
========================================================

Generated official content must follow:

Draft
→ Review
→ Approval
→ Publish

AI-generated content must NOT automatically become official NCPOR content.

This applies especially to:

News
Reports
Infographics
Educational content
Social content

========================================================
30. FIX BROKEN / NON-FUNCTIONAL UI
========================================================

Search the current code for:

- buttons with no action
- fake generation states
- hardcoded demo responses
- placeholder charts
- non-functional search
- fake download buttons
- dead routes
- empty modals
- forms that don't save
- source buttons that do nothing
- AI buttons that only change UI
- studio tools that only show a toast
- links that lead nowhere

For each:

either implement the actual functionality
OR
remove/hide the feature until its functionality exists.

DO NOT leave fake functionality in the final product.

========================================================
31. REALISTIC IMPLEMENTATION STRATEGY
========================================================

Do not attempt to build a fake full AI backend only for visual appearance.

Separate the application into:

UI
↓
Service Layer
↓
Repository/Data Layer
↓
AI/Generation Layer

For example:

sourceService
aiService
studioService
provenanceService
knowledgeService
generationService

Use adapters so actual AI/API providers can be connected cleanly.

If the application currently uses mock data:

keep the mock layer isolated.

Do not mix fake data directly into UI components.

========================================================
32. POLAR KNOWLEDGE AI ARCHITECTURE
========================================================

The final Polar Knowledge AI experience should conceptually be:

                    POLAR KNOWLEDGE AI
                           |
             ┌─────────────┴─────────────┐
             |                           |
          SOURCES                       CHAT
             |                           |
      Select trusted                Ask questions
      Polar knowledge                    |
             |                           |
             └─────────────┬─────────────┘
                           |
                      EVIDENCE
                           |
                    RELATED KNOWLEDGE
                           |
                      POLAR STUDIO
                           |
       ┌─────────┬─────────┼─────────┬─────────┐
       |         |         |         |         |
     Report    Slides    Mind Map   Quiz    Infographic
       |
     Audio / Video / Flashcards / Data Table