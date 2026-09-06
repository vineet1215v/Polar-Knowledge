FINAL SECOND-PASS INTEGRATION
POLAR KNOWLEDGE PORTAL — SOURCE → AI → STUDIO WORKFLOW

IMPORTANT:
The website is ALREADY BUILT.

It already has exactly 11 primary sidebar panels:

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

THESE 11 PANELS ARE FINAL.

DO NOT CREATE ANY NEW PRIMARY SIDEBAR PANEL.

DO NOT ADD:
- Sources
- Studio
- Notebook
- Research Room
- Knowledge Graph
- Content Studio
- AI Agents
- Audio
- Video
- Slide Deck
- Mind Map
- Flashcards
- Quiz
- Infographic
- Reports
- Data Table
- Evidence
- Provenance
- Data Quality
- Governance
- Notifications
as new sidebar items.

Instead, integrate these capabilities INSIDE the existing 11-panel architecture.

========================================================
CORE OBJECTIVE
========================================================

Add a powerful:

SOURCE → UNDERSTAND → ASK → VERIFY → CREATE → LEARN

workflow to the existing portal.

The inspiration is the SOURCE / CHAT / STUDIO interaction pattern shown in modern AI knowledge-work tools.

BUT:

DO NOT CLONE THE REFERENCED UI.

Do not copy its branding, exact layout, colors, icons, or visual design.

Use the concept and functionality, but adapt it specifically for:

NCPOR
Polar Science
Antarctica
Arctic
Southern Ocean
Expeditions
Scientific Publications
Scientific Datasets
Research Media
Education
Scientific Outreach

The final result must feel like an NCPOR Polar Knowledge Platform.

========================================================
1. FIRST — AUDIT THE CURRENT WEBSITE
========================================================

Before coding:

Inspect the existing application completely.

Identify:

- current 11 routes
- current components
- current AI functionality
- current search
- current publication pages
- current dataset pages
- current expedition pages
- current education functionality
- current content generation
- current map
- current media
- current relationships
- existing mock/API data
- existing reusable UI components

For every proposed capability classify it as:

A. Already implemented
B. Partially implemented
C. Missing
D. Duplicate

Only implement B and C.

If an equivalent capability already exists:

EXTEND IT.

DO NOT create another implementation.

========================================================
2. MOST IMPORTANT ARCHITECTURE RULE
========================================================

The existing 11-panel navigation MUST remain unchanged.

The new capabilities should be:

- contextual
- reusable
- embedded
- progressive
- discoverable

Use:

- tabs
- drawers
- modals
- detail-page sections
- contextual action buttons
- floating panels
- command/search interfaces
- expandable cards
- workspaces

rather than sidebar navigation.

The user should feel that the existing portal has become significantly more intelligent, not that dozens of new pages were added.

========================================================
3. INTRODUCE A SHARED "SOURCE WORKSPACE" CONCEPT
========================================================

Create a reusable internal concept called:

SOURCE WORKSPACE

IMPORTANT:

This is NOT a new sidebar panel.

It should be accessible contextually.

Examples:

From a Publication:
"Open Source Workspace"

From an Expedition:
"Study this Expedition"

From a Dataset:
"Analyze Dataset"

From Media:
"Study this Source"

From Polar Knowledge AI:
"Add Sources"

The Source Workspace should allow the user to gather trusted NCPOR material into one temporary working context.

========================================================
4. SOURCE WORKSPACE — SOURCES AREA
========================================================

Inspired by the Sources area in the referenced screenshot.

Create a reusable Sources component.

Example:

SELECTED SOURCES

☑ Expedition Report 2025
☑ Antarctic Sea Ice Dataset
☑ Publication: Southern Ocean Study
☑ Station Maitri Observation Report
☑ NCPOR Research Photograph

Users should be able to:

- add sources
- remove sources
- search repository
- select publications
- select datasets
- select expeditions
- select media
- select events
- select institutional documents
- add supported external URLs if the current architecture allows
- view source metadata
- open original source

Every selected source must retain:

ID
title
type
version
date
origin
provenance
access information

========================================================
5. SOURCE SEARCH
========================================================

Do not create a separate Search sidebar panel.

The Source Workspace should provide:

Search NCPOR Knowledge

Search across:

Publications
Datasets
Expeditions
Researchers
Stations
Media
Events
Topics
Documents

Support semantic search where available.

Results should show:

Title
Type
Short description
Date
Relevance
Source status

Allow:

"Add to Sources"

========================================================
6. CHAT — USE THE EXISTING POLAR KNOWLEDGE (AI)
========================================================

DO NOT create a separate Chat sidebar panel.

The existing:

POLAR KNOWLEDGE (AI)

must become the primary AI workspace.

Add a source-aware conversation mode.

Example:

Sources: 4

User:
"What were the major findings from these Antarctic expeditions?"

AI:
answer

Then:

Sources
Evidence
Related Knowledge
Confidence

The AI must answer primarily from selected/trusted sources.

========================================================
7. SOURCE-GROUNDED AI
========================================================

Every answer should preserve source grounding.

For each important claim show:

CLAIM
↓
SOURCE
↓
EVIDENCE

Possible statuses:

✓ Source-backed
≈ Synthesized from sources
⚠ Insufficient evidence

If sources disagree:

⚠ Conflicting evidence detected

Show:

Source A
Source B
Difference

Never fabricate scientific information.

========================================================
8. CONTEXTUAL AI FROM EXISTING PANELS
========================================================

The same AI system must work contextually from:

Expedition
Publication
Dataset
Media
Map location
Education content
Event
News

Example:

Publication page:
"Ask Polar about this Publication"

Dataset:
"Ask Polar about this Dataset"

Expedition:
"Ask Polar about this Expedition"

Map:
"Ask Polar about this Location"

Education:
"Ask Polar"

These should open the same Polar Knowledge AI system with the selected context automatically attached.

========================================================
9. STUDIO — DO NOT CREATE A STUDIO SIDEBAR
========================================================

This is the most important addition inspired by the screenshot.

Create a reusable:

POLAR STUDIO

capability.

BUT:

POLAR STUDIO MUST NOT BE A NEW SIDEBAR PANEL.

It should be accessible through:

- Polar Knowledge (AI)
- Publication detail
- Expedition detail
- Dataset detail
- Media detail
- Education & Outreach
- News & Announcements

Example button:

"Create with Polar Studio"

or:

"Open Studio"

The Studio operates on the selected trusted sources.

========================================================
10. POLAR STUDIO OUTPUTS
========================================================

Inside Polar Studio, provide output tools.

Do NOT make each output a navigation panel.

Provide a Studio workspace/grid/drawer with:

AUDIO OVERVIEW
SLIDE DECK
VIDEO OVERVIEW
MIND MAP
REPORT
FLASHCARDS
QUIZ
INFOGRAPHIC
DATA TABLE

Only show options relevant to the selected source.

========================================================
11. AUDIO OVERVIEW
========================================================

Allow the user to generate an audio-style explanation from selected sources.

Example:

Sources:
3 Antarctic publications

Output:

"Antarctic Sea-Ice Research — Audio Overview"

Include:

- generated script
- speakers/roles if supported
- scientific citations
- source list
- generation status

IMPORTANT:

Audio content must remain grounded in selected sources.

Do not invent findings.

========================================================
12. SLIDE DECK
========================================================

Generate a presentation from trusted sources.

Example:

"Antarctic Expedition 2025 — Research Overview"

Generate:

Slide 1 — Overview
Slide 2 — Research Objective
Slide 3 — Expedition Route
Slide 4 — Methods
Slide 5 — Major Observations
Slide 6 — Dataset
Slide 7 — Findings
Slide 8 — Publications
Slide 9 — Significance
Slide 10 — References

Each scientific claim should retain its source.

Allow:

- preview
- edit
- regenerate section
- reorder
- export if supported by the existing application

========================================================
13. VIDEO OVERVIEW
========================================================

Generate a video-storyboard concept from trusted sources.

Output:

Scene
Narration
Visual suggestion
Source

Example:

Scene 1:
Antarctic expedition introduction

Scene 2:
Research vessel / station

Scene 3:
Observation

Scene 4:
Dataset

Scene 5:
Scientific finding

Scene 6:
Conclusion

This can initially be a storyboard/script if actual video generation infrastructure does not exist.

DO NOT fake an actual rendered video.

========================================================
14. MIND MAP
========================================================

Generate a visual knowledge map from selected sources.

Example:

ANTARCTIC SEA ICE
│
├── Expedition
│
├── Researchers
│
├── Observations
│
├── Dataset
│
├── Publications
│
├── Findings
│
├── Climate
│
└── Related Media

Use the existing knowledge relationship model.

Do not create a Knowledge Graph sidebar.

The mind map is a user-facing visualization of connected knowledge.

========================================================
15. REPORT GENERATOR
========================================================

Allow users to create structured reports from selected sources.

Examples:

Expedition Report Summary
Literature Review
Research Brief
Executive Brief
Topic Report
Scientific Summary

Structure:

Title
Executive Summary
Sources
Research Context
Methods
Findings
Evidence
Limitations
References

Every generated statement should preserve provenance.

========================================================
16. FLASHCARDS
========================================================

Primarily integrate this into:

EDUCATION & OUTREACH

But allow creation from Polar Studio.

Example:

Topic:
Antarctic Oceanography

Flashcard:

Q:
What is sea-ice concentration?

A:
...

Source:
Publication / Dataset

Allow:

- difficulty
- topic
- number of cards
- regenerate
- review

========================================================
17. QUIZ GENERATOR
========================================================

Integrate primarily into:

EDUCATION & OUTREACH.

Allow Polar Studio to generate quizzes from trusted sources.

Types:

Multiple choice
True/False
Conceptual
Scenario-based
Research interpretation

Each question should have:

Answer
Explanation
Source

Example:

Question:
Which observation was reported during Expedition X?

Correct Answer:
...

Source:
Expedition Report

========================================================
18. INFOGRAPHIC GENERATOR
========================================================

Integrate primarily into:

MEDIA GALLERY

and

NEWS & ANNOUNCEMENTS

Allow creation of:

Scientific infographic
Expedition infographic
Dataset infographic
Polar awareness infographic
Research timeline

Show:

Title
Facts
Visual structure
Sources

Never generate unsupported statistics.

========================================================
19. DATA TABLE GENERATOR
========================================================

This is especially important for:

SCIENTIFIC DATASETS

Allow users to ask:

"Create a comparison table of these datasets."

Example:

| Dataset | Region | Period | Variable | Instrument |
|---|---|---|---|---|

Allow:

- select fields
- filter
- sort
- compare
- export where supported

All values must originate from repository data.

========================================================
20. ONE SOURCE → MANY OUTPUTS
========================================================

This should become a major differentiator.

A user selects:

ONE trusted publication.

Then Polar Studio can generate:

Publication
↓
Scientific Summary
↓
Report
↓
Slide Deck
↓
Audio Overview
↓
Video Storyboard
↓
Infographic
↓
Quiz
↓
Flashcards
↓
News Article
↓
Social Content

BUT all outputs must retain:

Source
Claim
Evidence
Provenance
Version

This is the:

"Create Once, Disseminate Intelligently"

workflow.

========================================================
21. OUTPUT LINEAGE
========================================================

Every generated artifact must remember:

Created from:
[Source]

Generated:
[date/time]

Source version:
[vX]

Claims:
[number]

Evidence:
[number]

Status:
Draft / Under Review / Approved / Published

Add:

"View Source"

"View Evidence"

"Regenerate"

"View Version"

========================================================
22. IMPORTANT — GENERATED CONTENT GOVERNANCE
========================================================

Generated content must NEVER automatically become official NCPOR content.

Workflow:

Generate
↓
Draft
↓
Review
↓
Request Changes / Reject
↓
Approve
↓
Publish

This applies to:

News
Reports
Infographics
Slides
Educational content
Social content
Video scripts
Audio scripts

========================================================
23. POLAR STUDIO + EDUCATION
========================================================

When a student/educator opens Education & Outreach:

provide contextual actions:

Create Quiz
Create Flashcards
Create Study Guide
Create Mind Map
Create Simplified Explanation

All generated from trusted Polar sources.

Allow difficulty:

Beginner
Intermediate
Advanced
Researcher

========================================================
24. POLAR STUDIO + RESEARCH
========================================================

When a researcher opens:

Publication
Dataset
Expedition

show contextual:

Analyze
Summarize
Compare
Create Report
Create Slide Deck
Create Mind Map
Ask Polar

Do not overwhelm the page.

Use a single:

"AI Tools"
or
"Create with Polar Studio"

entry point.

========================================================
25. POLAR STUDIO + OUTREACH
========================================================

For News & Announcements / Media Gallery:

provide:

Create Public Summary
Create News Article
Create Infographic
Create Social Post
Create Video Storyboard
Create Educational Explanation

Again:

All content remains source-grounded.

========================================================
26. SOURCE COLLECTION FROM MULTIPLE PANELS
========================================================

A user should be able to build a source set from different parts of the portal.

Example:

From Expedition:
"Add to Workspace"

From Publication:
"Add to Workspace"

From Dataset:
"Add to Workspace"

From Media:
"Add to Workspace"

Then:

Open Polar Knowledge AI
or
Open Polar Studio

The workspace contains all selected sources.

This is extremely important.

The user should NOT need to manually upload the same content again.

========================================================
27. TEMPORARY WORKSPACE — NO SIDEBAR
========================================================

If a workspace is required:

use:

- header action
- floating tray
- right-side drawer
- contextual workspace

Example:

Selected Sources (4)

[Open AI] [Open Studio] [Clear]

Do NOT create:

"My Workspace"

as a new primary sidebar panel.

========================================================
28. RESEARCHER WORKFLOW
========================================================

Support this flow:

Publication
↓
Add to Workspace
↓
Dataset
↓
Add to Workspace
↓
Expedition
↓
Add to Workspace
↓
Open Polar Knowledge AI
↓
Ask question
↓
Inspect evidence
↓
Open Polar Studio
↓
Create Report
↓
Create Slide Deck
↓
Create Mind Map

Everything remains connected.

========================================================
29. STUDENT WORKFLOW
========================================================

Support:

Education & Outreach
↓
Choose topic
↓
Select trusted sources
↓
Ask Polar
↓
Generate simplified explanation
↓
Generate Flashcards
↓
Generate Quiz
↓
Take Quiz
↓
Review Sources

========================================================
30. OUTREACH WORKFLOW
========================================================

Support:

Publication
↓
Create with Polar Studio
↓
Scientific Summary
↓
Infographic
↓
News Article
↓
Video Storyboard
↓
Social Content
↓
Review
↓
Approve
↓
Publish

This creates a direct bridge from science to public outreach.

========================================================
31. DASHBOARD — SURFACE STUDIO ACTIVITY
========================================================

Do not create a Studio dashboard.

Instead, Dashboard may show:

Recent AI Work
Recent Generated Content
Recently Used Sources
Pending Reviews
Knowledge Trends
New Publications
New Datasets

Example:

RECENT WORK

Antarctic Sea-Ice Research Brief
3 sources
Draft

Expedition 2025 Slide Deck
5 sources
Under Review

Climate Education Quiz
2 sources
Approved

========================================================
32. KNOWLEDGE CONNECTIONS
========================================================

Use the existing underlying relationship model.

Studio should understand relationships between:

Publication
Dataset
Expedition
Researcher
Finding
Station
Location
Media
Topic
Event

Example:

Selected Publication
↓
Related Dataset
↓
Related Expedition
↓
Related Station
↓
Related Media

Allow:

"Add Related Sources"

This should be powered by the existing knowledge graph/relationship layer.

========================================================
33. SOURCE TRUST AND VERSIONING
========================================================

When a source is updated:

show its version.

Example:

Source:
Antarctic Dataset

Version:
v2.1

Updated:
2026-08-12

If a generated artifact was created from v2.0:

show:

⚠ Source updated since this artifact was generated.

Actions:

Review Changes
Update Artifact
Keep Existing Version

This creates trustworthy knowledge evolution.

========================================================
34. SOURCE CONFLICTS
========================================================

If selected sources contain conflicting information:

DO NOT silently merge them.

Show:

⚠ Potential Source Conflict

Source A:
Value / statement

Source B:
Value / statement

Allow the AI to explain:

- what differs
- possible reason
- which evidence supports each
- what cannot be concluded

========================================================
35. DESIGN RULE
========================================================

The Studio must NOT make the existing website visually cluttered.

Use a compact interaction such as:

[ AI Tools ]

Opening it reveals:

┌──────────────────────────────┐
│ POLAR STUDIO                 │
│                              │
│ Audio Overview   Slide Deck  │
│ Video Overview   Mind Map    │
│ Report           Flashcards  │
│ Quiz             Infographic │
│ Data Table                    │
│                              │
│ Based on 5 selected sources  │
└──────────────────────────────┘

Adapt this to the existing design system.

Do not blindly copy the screenshot.

========================================================
36. EXISTING 11-PANEL MAPPING
========================================================

Use this mapping:

DASHBOARD
→ Intelligence
→ Recent AI work
→ Recent generated outputs
→ Knowledge trends

EXPEDITIONS
→ Research DNA
→ Source Workspace
→ Ask Polar
→ Create with Polar Studio

RESEARCH PUBLICATIONS
→ Evidence
→ Provenance
→ Versioning
→ Source Workspace
→ Ask Polar
→ Studio

SCIENTIFIC DATASETS
→ Data Quality
→ Provenance
→ Comparison
→ Data Table
→ Ask Polar
→ Studio

MEDIA GALLERY
→ Scientific Context
→ Infographic
→ Video Storyboard
→ Outreach outputs

POLAR MAP & GIS
→ Contextual sources
→ Location knowledge
→ Ask Polar
→ Add location-linked sources

POLAR KNOWLEDGE (AI)
→ Source Workspace
→ Chat
→ Evidence
→ Claim verification
→ Conflict detection
→ Related Knowledge
→ Polar Studio

EDUCATION & OUTREACH
→ Adaptive Learning
→ Flashcards
→ Quiz
→ Study Guide
→ Mind Map
→ Student AI

NEWS & ANNOUNCEMENTS
→ Create from Source
→ Reports
→ News
→ Social Content
→ Infographics
→ Review workflow

EVENTS & ACTIVITIES
→ Related sources
→ Research connections
→ Outreach generation

ABOUT NCPOR
→ Institutional knowledge
→ Research domains
→ Facilities
→ Stations
→ Programs

========================================================
37. DO NOT CREATE DUPLICATE AI SYSTEMS
========================================================

There must be ONE underlying Polar AI system.

There must be ONE underlying source model.

There must be ONE provenance system.

There must be ONE relationship/knowledge model.

There must be ONE generation/governance pipeline.

Different panels should simply provide different entry points.

========================================================
38. REUSABLE COMPONENTS
========================================================

Where appropriate create reusable components such as:

<SourceWorkspace />
<SourceSelector />
<SourceSearch />
<SourceCard />
<ContextualAskPolar />
<PolarStudio />
<StudioToolCard />
<EvidencePanel />
<ProvenancePanel />
<KnowledgeConnections />
<VersionHistory />
<ChangeImpact />
<ConflictPanel />
<GeneratedArtifact />
<ReviewWorkflow />
<SaveButton />
<FollowButton />

Do not duplicate the implementation across pages.

========================================================
39. IMPORTANT PRODUCT PRINCIPLE
========================================================

The portal should evolve from:

"Repository where users browse information"

into:

"Polar Knowledge Environment where users can gather trusted knowledge, ask questions, verify evidence, understand relationships, and transform knowledge into useful outputs."

The core loop should become:

COLLECT
↓
UNDERSTAND
↓
ASK
↓
VERIFY
↓
CONNECT
↓
CREATE
↓
REVIEW
↓
PUBLISH
↓
LEARN

========================================================
40. FINAL VALIDATION
========================================================

Before finishing:

Verify the sidebar contains EXACTLY the original 11 panels.

No new sidebar panel for:

Sources
Studio
Chat
Audio
Video
Slides
Mind Map
Reports
Flashcards
Quiz
Infographic
Data Table
Evidence
Provenance
Knowledge Graph
Research DNA
Governance
Notifications
Workspace

Verify that these capabilities are embedded contextually.

Verify that a user can:

1. Open a Publication
2. Add it to Source Workspace
3. Add a related Dataset
4. Add an Expedition
5. Open Polar Knowledge AI
6. Ask a source-grounded question
7. Inspect evidence
8. Open Polar Studio
9. Generate a Report
10. Generate a Slide Deck
11. Generate a Mind Map
12. Generate Flashcards
13. Generate a Quiz
14. Generate an Infographic
15. Generate a Data Table where applicable
16. Generate an outreach/news artifact
17. See source provenance
18. See source version
19. See conflicts when applicable
20. Submit generated content for review
21. Approve it through governance
22. Trace the final output back to the original sources

DO NOT add unnecessary UI.

DO NOT create duplicate pages.

DO NOT create duplicate AI systems.

DO NOT create sidebar clutter.

PRESERVE THE EXISTING DESIGN SYSTEM.

The final experience should feel like:

NCPOR POLAR KNOWLEDGE PORTAL
+
SOURCE-GROUNDED AI
+
POLAR STUDIO
+
SCIENTIFIC KNOWLEDGE GRAPH
+
EVIDENCE & PROVENANCE
+
EDUCATION
+
OUTREACH

ALL INSIDE THE EXISTING 11-PANEL ARCHITECTURE.