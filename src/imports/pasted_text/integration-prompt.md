MASTER INTEGRATION PROMPT — MERGE ADVANCED FEATURES INTO THE EXISTING 11-PANEL POLAR KNOWLEDGE PORTAL

IMPORTANT ARCHITECTURE RULE
============================

The website already has exactly these 11 primary sidebar panels:

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

DO NOT create additional top-level sidebar panels.

DO NOT add sidebar items such as:
- Knowledge Graph
- Knowledge Brain
- Knowledge Gaps
- Trends
- Opportunities
- Evidence Engine
- Claim Checker
- Content Studio
- Digital Twin
- Research DNA
- Adaptive Learning
- AI Agents
- Research Rooms
- Knowledge Evolution
- Provenance
- Governance
- Data Quality
- Analytics
- Community
- Citizen Science

These are FEATURES/CAPABILITIES, not navigation sections.

The sidebar must remain clean and limited to the existing 11 panels.

Your job is to intelligently MERGE the advanced capabilities into the existing panels where they naturally belong.

==================================================
1. FIRST — ANALYZE THE EXISTING CODEBASE
==================================================

Before changing anything:

- Inspect the entire existing frontend.
- Identify the current routing structure.
- Identify all 11 sidebar routes.
- Identify reusable components.
- Identify existing cards, tables, charts, modals, drawers, tabs, detail pages and layouts.
- Identify existing mock data/API/data models.
- Identify which advanced capabilities are already implemented.
- DO NOT duplicate existing functionality.
- DO NOT create parallel versions of existing features.

Preserve the current visual identity and architecture.

Do not rebuild the website from scratch.

Do not replace working components unnecessarily.

==================================================
2. CORE PRINCIPLE
==================================================

Use this rule for every new capability:

IF a capability naturally belongs to an existing panel,
EMBED IT THERE.

IF it belongs to multiple panels,
create ONE reusable underlying component/data model
and surface it contextually in those panels.

IF it does not require navigation,
use a drawer, modal, tab, expandable section, card, contextual action, timeline, command panel or detail view.

ONLY create a new route if technically necessary.

Even then, DO NOT create a new primary sidebar item.

The goal is:

11 navigation panels
+
many deeply integrated capabilities

NOT:

30+ navigation panels.

==================================================
3. DASHBOARD — MAKE IT THE INTELLIGENCE OVERVIEW
==================================================

Do not create separate sidebar panels for Knowledge Gaps, Trends or Opportunities.

Integrate them into Dashboard.

Add/merge:

A. POLAR KNOWLEDGE PULSE

Show:
- repository growth
- new publications
- new datasets
- recent expeditions
- media additions
- research activity
- outreach activity
- recently updated knowledge

Use compact visual cards.

B. KNOWLEDGE COVERAGE

Show what areas of the repository are well represented and where coverage appears weak.

Important wording:

Use:
"Potential repository coverage gap"

Do NOT claim:
"No research exists."

This must be based on repository coverage/activity signals.

C. RESEARCH TRENDS

Show emerging repository/activity trends.

Clearly distinguish:
- repository activity
from
- scientific importance.

D. RESEARCH / OUTREACH OPPORTUNITIES

Generate explainable opportunity signals using:
- repository gaps
- trends
- relevance
- available sources
- engagement

Each opportunity must explain WHY it was surfaced.

E. INTELLIGENCE FEED

Create a feed such as:

New Expedition
↓
New Dataset
↓
New Publication
↓
New Finding
↓
New Media
↓
New Outreach Content

The dashboard should feel like the central intelligence layer of the portal.

==================================================
4. EXPEDITIONS — ADD RESEARCH DNA + CONNECTIONS
==================================================

Do NOT create a "Research DNA" sidebar panel.

Embed Research DNA inside each Expedition detail page.

For every expedition provide:

- Expedition overview
- objectives
- route
- stations
- researchers
- instruments
- observations
- datasets
- publications
- findings
- media
- related topics

Add a "Research DNA" visualization/section showing:

Expedition
   ↓
Research Questions
   ↓
Methods
   ↓
Observations
   ↓
Datasets
   ↓
Findings
   ↓
Publications
   ↓
Outreach

Add:

"Explore Connected Knowledge"

This should reveal relationships between the expedition and other repository entities.

Add a knowledge timeline showing how knowledge from the expedition evolved.

Add contextual:

"Ask Polar about this Expedition"

The AI must receive the expedition context automatically.

==================================================
5. RESEARCH PUBLICATIONS — ADD EVIDENCE + EVOLUTION
==================================================

Do NOT create separate Evidence or Knowledge Evolution panels.

Integrate them into publication details.

Every publication detail page should contain:

- Abstract
- Authors
- Research domain
- Key findings
- Methodology
- Related datasets
- Related expeditions
- Related researchers
- Related stations
- Related topics
- Citations
- Evidence

Add:

"EVIDENCE"

For important claims/findings show:

Claim
↓
Supporting source
↓
Evidence location
↓
Confidence/status

Clearly distinguish:

Source-backed
Synthesis
Insufficient evidence

Never make unsupported claims appear as established scientific facts.

Add:

"Knowledge Evolution"

Show:
- version history
- what changed
- evidence changes
- metadata changes
- related downstream content affected by changes

Add:

"Ask Polar about this Publication"

The AI should automatically use the publication as context.

==================================================
6. SCIENTIFIC DATASETS — ADD QUALITY + PROVENANCE
==================================================

Do NOT create separate Data Quality or Provenance sidebar panels.

Integrate them directly into Dataset detail pages.

Dataset page should include:

- dataset description
- scientific domain
- temporal coverage
- spatial coverage
- variables
- units
- instruments
- expedition relationship
- station/location
- related publications
- related findings
- visualization
- download/access information

Add:

DATA QUALITY

Show:

Metadata completeness score
████████░░ 82%

Then show issues such as:

Missing temporal resolution
Incomplete instrument metadata
Missing spatial reference

Do not hide data quality problems.

Add:

PROVENANCE

Show:

Dataset
↓
Expedition
↓
Instrument
↓
Observation
↓
Processing
↓
Publication/Finding

Include:
- source
- version
- timestamp
- processing information
- responsible organization/person where appropriate

Add dataset comparison where meaningful.

Add:

"Ask Polar about this Dataset"

==================================================
7. MEDIA GALLERY — CONNECT MEDIA TO SCIENCE
==================================================

Do NOT create a separate Media Intelligence panel.

Each media item should optionally contain:

- expedition
- location
- station
- researcher
- scientific topic
- publication
- dataset
- event
- date
- source
- license/access information

Add:

"Scientific Context"

When viewing an image/video:

Related Expedition
Related Research
Related Publication
Related Dataset
Related Location

Add:

"Create Story from this Source"

This connects Media Gallery to the content-generation workflow.

==================================================
8. POLAR MAP & GIS — UPGRADE INTO POLAR EXPLORER
==================================================

Do NOT create a separate Digital Twin sidebar panel.

Upgrade the existing Polar Map & GIS.

Add contextual modes:

- Map
- Timeline
- Station view
- Expedition routes
- Research activity
- Dataset coverage
- Publication activity
- Media locations
- Environmental/scientific layers where available

When the user clicks a location/station/route:

open a contextual knowledge panel.

Example:

STATION
↓
Expeditions
↓
Researchers
↓
Datasets
↓
Publications
↓
Media
↓
Topics
↓
Events

Add timeline controls so users can explore how polar activity/knowledge changes over time.

Add:

"Ask Polar about this location"

The AI receives the selected geographic context.

If 3D functionality already exists or is technically appropriate, use it as an enhancement to this panel, NOT as another navigation item.

==================================================
9. POLAR KNOWLEDGE (AI) — MAKE THIS THE EVIDENCE-BACKED AI LAYER
==================================================

This is where the strongest AI capabilities belong.

Do NOT create separate sidebar panels for:

- Claim Checker
- Evidence Engine
- AI Agents
- Knowledge Brain
- Knowledge Graph

Integrate them here.

A. EVIDENCE-BACKED ANSWERS

Every important answer should show:

Answer
↓
Sources
↓
Evidence
↓
Confidence/status

Provide citations/references back to repository objects.

B. CLAIM VERIFICATION

Allow users to inspect claims.

Example:

CLAIM
"Sea-ice concentration decreased..."

Status:
 Supported

Sources:
Publication A
Dataset B
Expedition C

C. CONFLICT DETECTION

If credible repository sources disagree:

show:

"Conflicting evidence detected"

Then show:

Source A
vs
Source B

Explain the disagreement rather than silently selecting one.

D. RELATED KNOWLEDGE

Every AI answer should provide a contextual relationship rail:

Related Expeditions
Related Publications
Related Datasets
Related Researchers
Related Stations
Related Media

E. SPECIALIST AI MODES

Do NOT make each agent a sidebar item.

Inside Polar Knowledge, provide contextual specialist modes such as:

Research Assistant
Data Analyst
Expedition Assistant
Education Assistant
Outreach Assistant

These should share the same underlying evidence/repository layer.

F. CONTEXTUAL AI

Whenever AI is launched from:

Expedition
Publication
Dataset
Map
Media
Education content

automatically pass that context into the AI.

==================================================
10. EDUCATION & OUTREACH — ADD ADAPTIVE LEARNING
==================================================

Do NOT create a separate Adaptive Learning panel.

Embed it inside Education & Outreach.

Add:

- learner level
- diagnostic quiz
- recommended learning path
- topic progression
- quizzes
- challenges
- achievement/progress

Example:

Student selects:
"Antarctic Climate"

System determines current level.

Then recommends:

1. Polar Basics
2. Antarctic Ice
3. Climate Processes
4. Sea-Ice Science
5. Advanced Research

Learning recommendations must be connected to actual repository sources.

Add:

"Ask Polar for Students"

Answers should be simplified according to learner level.

Maintain source transparency.

==================================================
11. NEWS & ANNOUNCEMENTS — ADD CONTENT STUDIO
==================================================

Do NOT create a Content Studio sidebar panel.

Integrate content generation into News & Announcements.

Add:

"Create from Source"

Available from:

Publication
Expedition
Dataset
Media
Event

The system should transform ONE trusted source into multiple audience formats:

Scientific summary
News article
Public article
Social media post
Educational explanation
Infographic concept
Video script

Important:

All generated content must retain:

Source
↓
Claims
↓
Evidence
↓
Generated content

Generated content is NOT automatically official.

Use review workflow before publication.

==================================================
12. EVENTS & ACTIVITIES — CONNECT THE KNOWLEDGE GRAPH
==================================================

Do not create a Knowledge Graph panel.

For every event/activity show relationships to:

- expedition
- researcher
- publication
- dataset
- station
- education program
- media
- news

Example:

Event
↓
Researchers
↓
Research
↓
Publication
↓
Dataset
↓
Outreach

This makes Events part of the same knowledge ecosystem.

==================================================
13. ABOUT NCPOR — INSTITUTIONAL KNOWLEDGE
==================================================

Keep About NCPOR focused on institutional information.

Add structured sections for:

- research domains
- facilities
- stations
- programs
- institutional activities
- major initiatives
- organizational knowledge

Connect these to the relevant repository entities.

Do not overload this section with unrelated platform features.

==================================================
14. GLOBAL KNOWLEDGE GRAPH — ONE UNDERLYING MODEL
==================================================

DO NOT create a Knowledge Graph sidebar item.

Implement it as an underlying relationship/data model.

Entities may include:

Researcher
Expedition
Project
Publication
Dataset
Finding
Station
Location
Media
Topic
Event
Education Content
News

Relationships:

Researcher → Expedition
Expedition → Dataset
Dataset → Publication
Publication → Finding
Finding → Topic
Station → Expedition
Location → Station
Publication → Media
Researcher → Publication

Expose these relationships contextually through:

"Related Knowledge"
"Explore Connections"
"View Research DNA"
"See Evidence"
"Related Content"

The user should never need a separate Knowledge Graph page just to understand relationships.

==================================================
15. GLOBAL PROVENANCE LAYER
==================================================

Implement provenance across the entire platform.

Whenever information is displayed, generated, summarized, transformed or used by AI, preserve its source.

For repository objects show:

Source
Source type
Source ID
Version
Date
Evidence location
License/access information where applicable

For AI answers:

Claim
↓
Source
↓
Evidence

For generated content:

Source
↓
Claim
↓
Generated output

For educational content:

Source
↓
Scientific concept
↓
Learning material

Make provenance visible without clutter.

Use a compact:

"View Sources"
"Evidence"
"Provenance"

drawer/modal rather than permanently filling the UI.

==================================================
16. VERSIONING + CHANGE IMPACT
==================================================

Integrate version history into Publications, Datasets, Expeditions and other versioned knowledge objects.

Show:

Version 1
Version 2
Version 3

Allow:

"What changed?"

Show:

- metadata changes
- scientific content changes
- evidence changes
- relationship changes

Most importantly:

"Downstream Impact"

If a source changes, identify affected:

- AI answers
- generated content
- educational content
- summaries
- derived knowledge

Do not silently leave outdated derived content looking current.

==================================================
17. GOVERNANCE + RBAC + APPROVAL
==================================================

Do NOT create a Governance sidebar panel.

Implement governance into the existing content/repository workflows.

Support role concepts such as:

Researcher
Contributor
Reviewer
Approver
Publisher
Administrator

Workflow:

Draft
↓
Submitted
↓
Under Review
↓
Request Changes / Rejected
↓
Approved
↓
Published
↓
Archived

Critical rule:

AI-generated content MUST NOT automatically become official published content.

Normal users must not bypass approval.

Add audit history:

Who
What
When
Action
Previous state
New state

Display this contextually in admin/review areas.

==================================================
18. KNOWLEDGE INGESTION PIPELINE
==================================================

Do NOT create an Ingestion sidebar panel.

Integrate ingestion into the repository/admin workflows.

Pipeline:

Upload / Import
↓
Parse
↓
OCR where necessary
↓
Metadata extraction
↓
Chunking
↓
Embedding/indexing
↓
Entity/relationship extraction
↓
Validation
↓
Repository

Show processing status.

Example:

 Uploaded
 Parsed
 Metadata extracted
 Indexed
 Relationship review required
 Published

Failures must be visible and retryable.

==================================================
19. PERSONAL KNOWLEDGE SPACE
==================================================

Do NOT create another sidebar item called "My Workspace."

Instead, add contextual actions:

 Save
 Bookmark
 Add to Collection
Follow

Allow users to save:

- publications
- datasets
- expeditions
- researchers
- stations
- topics
- media

A compact profile/header drawer can contain:

My Saved Knowledge
My Collections
Recently Viewed
Following

Keep this out of the main sidebar.

==================================================
20. FOLLOW + NOTIFICATIONS
==================================================

Add contextual:

Follow Expedition
Follow Researcher
Follow Topic
Follow Station
Follow Dataset

When followed content changes:

New publication
New dataset
Updated expedition
New media
New event

surface notifications through a notification center/header rather than another sidebar panel.

==================================================
21. ADMIN / SYSTEM HEALTH
==================================================

Do NOT create a public System Health sidebar item.

For administrators, provide contextual monitoring for:

- ingestion failures
- indexing failures
- metadata quality
- API health
- AI retrieval health
- processing queues
- content review queues
- publication pipeline

Keep this restricted to administrators.

==================================================
22. ACCESSIBILITY
==================================================

Apply accessibility globally across the existing 11 panels.

Ensure:

- keyboard navigation
- visible focus
- semantic HTML
- ARIA where appropriate
- sufficient contrast
- accessible tables
- accessible charts
- screen-reader labels
- reduced-motion support
- usable modal/drawer navigation

Do not treat accessibility as a separate page.

==================================================
23. UI/UX RULE — PREVENT CLUTTER
==================================================

The website must NOT become overloaded.

Use:

- tabs
- accordions
- drawers
- modals
- contextual panels
- expandable cards
- detail-page sections
- command/search interfaces
- progressive disclosure

Do not display every capability simultaneously.

Example:

Publication page:

Overview | Findings | Evidence | Connections | Evolution

NOT:

20 separate cards for every feature.

Example:

Dataset page:

Overview | Data | Quality | Provenance | Connections

Example:

AI page:

Ask | Evidence | Related Knowledge | Specialist Mode

==================================================
24. REUSABLE COMPONENT ARCHITECTURE
==================================================

Create reusable components where appropriate:

<ProvenancePanel />
<EvidencePanel />
<KnowledgeConnections />
<VersionHistory />
<ChangeImpact />
<DataQualityPanel />
<AuditTimeline />
<ReviewWorkflow />
<RelatedKnowledge />
<ContextualAskPolar />
<SaveButton />
<FollowButton />
<NotificationCenter />

These should be reusable across the 11 existing panels.

Do not implement the same feature separately in every page.

==================================================
25. DATA MODEL
==================================================

Use a common entity model.

Every major repository entity should support, where applicable:

id
title
type
description
metadata
sources
version
createdAt
updatedAt
relationships
topics
status
provenance
evidence
permissions

This allows the entire portal to behave as ONE knowledge system instead of disconnected pages.

==================================================
26. IMPORTANT TRUST RULES
==================================================

Never fabricate:

- scientific findings
- citations
- datasets
- researchers
- expedition information
- evidence
- statistics

If evidence is unavailable, clearly state:

"Insufficient evidence available in the repository."

If repository coverage is incomplete, use:

"Potential repository coverage gap."

Do not confuse:

"No information in the repository"

with

"No scientific research exists."

AI-generated synthesis must be distinguishable from source-backed claims.

==================================================
27. FINAL USER EXPERIENCE
==================================================

The final architecture should feel like:

                 POLAR KNOWLEDGE PORTAL
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   REPOSITORY        INTELLIGENCE      OUTREACH
        │                │                │
Expeditions         Polar AI          Education
Publications        Evidence          News
Datasets            Connections        Media
Media               Trends             Events
Map                 Gaps
                    Opportunities

But navigation remains only:

Dashboard
Expeditions
Research Publications
Scientific Datasets
Media Gallery
Polar Map & GIS
Polar Knowledge (AI)
Education & Outreach
News & Announcements
Events & Activities
About NCPOR

==================================================
28. END-TO-END INTEGRATION TEST
==================================================

After implementation, verify this complete flow:

Dashboard
→ identify a repository coverage gap
→ open related Expedition
→ inspect Research DNA
→ open Dataset
→ inspect Data Quality
→ inspect Provenance
→ open related Publication
→ inspect Findings
→ inspect Evidence
→ detect possible source conflict if applicable
→ ask Polar using that context
→ inspect cited sources
→ generate an educational explanation
→ create outreach/news content from the trusted source
→ submit for review
→ approve
→ publish
→ show resulting content relationship back to the source
→ show version/change impact if the source is updated.

The entire flow must work as ONE connected knowledge ecosystem.

==================================================
29. MOST IMPORTANT IMPLEMENTATION CONSTRAINT
==================================================

DO NOT increase the number of sidebar panels.

Do not create navigation clutter.

The innovation should come from:

DEPTH OF INTEGRATION

not

NUMBER OF MENU ITEMS.

The existing 11 panels are the information architecture.

The advanced capabilities are intelligence layers operating inside those panels.

Before finishing, inspect the sidebar and confirm that it still contains exactly the original 11 primary panels.

Also verify that no duplicate feature, duplicate route, or redundant navigation has been introduced.