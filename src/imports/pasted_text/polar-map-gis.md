========================================================
40. CRITICAL — UPGRADE POLAR MAP & GIS TO A REAL GIS MAP
========================================================

The existing:

POLAR MAP & GIS

currently uses Leaflet.

KEEP LEAFLET if it is already properly integrated.

IMPORTANT:

Leaflet is only the mapping framework.

Do NOT replace Leaflet just because it is being used.

The problem is that the current map must become a REAL,
INTERACTIVE, DATA-BACKED MAP rather than a decorative/mock map.

Do not create another sidebar panel for this.

Everything must remain inside:

POLAR MAP & GIS

========================================================
41. REMOVE MOCK / DECORATIVE MAP CONTENT
========================================================

Audit the current Polar Map & GIS implementation.

Identify:

- fake map backgrounds
- static map images
- hardcoded decorative geography
- fake station positions
- fake expedition routes
- placeholder markers
- simulated map data
- non-functional zoom controls
- non-functional layers
- fake GIS statistics

Replace them with actual geographic map functionality.

Do not leave a visually impressive but non-functional map.

========================================================
42. REAL BASEMAP
========================================================

Use a real map tile provider.

The map must load actual geographic tiles.

Possible implementations include:

- OpenStreetMap-based tiles
- ArcGIS basemap services
- another legitimate tile provider
- organization-approved tile infrastructure

Use the provider that is technically and legally appropriate for the
application.

Do not invent tile URLs.

Do not use fake URLs.

Do not hardcode an imaginary map API.

Keep the tile provider configurable through environment variables
where API keys are required.

Example architecture:

MAP_TILE_URL
MAP_API_KEY
MAP_ATTRIBUTION

Do not expose private API keys in frontend source code.

========================================================
43. POLAR-SPECIFIC MAP PROJECTION
========================================================

The portal is specifically a POLAR science platform.

Do not treat it as an ordinary world map only.

Support polar visualization appropriately.

For Antarctica, support an Antarctic polar projection such as:

EPSG:3031

For Arctic visualization, support an appropriate Arctic polar projection
such as:

EPSG:3413

Use the projection only where the selected map/layer requires it.

If Leaflet's standard Web Mercator view is retained for general
navigation, provide an appropriate polar-focused mode rather than
forcing everything into a generic world-map view.

========================================================
44. REAL ANTARCTIC / ARCTIC GEOGRAPHY
========================================================

The map must display actual geographic information including, where
available:

- Antarctica
- Arctic region
- Southern Ocean
- coastlines
- islands
- sea
- latitude/longitude
- research stations
- expedition locations
- expedition routes
- research locations

Do not draw these manually as decorative SVG shapes if real geographic
data is available.

Use GeoJSON, WMS, WMTS, vector data or another appropriate GIS format.

========================================================
45. NCPOR RESEARCH STATIONS
========================================================

Research stations must be represented using actual coordinates from
the repository/data source.

Do not invent coordinates.

For each station marker, where information exists, show:

Station name
Country / organization
Latitude
Longitude
Station type
Active period
Related expeditions
Researchers
Datasets
Publications
Media

Clicking a station should open a contextual information panel.

Example:

MAITRI

Coordinates
Expeditions
Researchers
Publications
Datasets
Media
Events

[Ask Polar about this Station]

========================================================
46. EXPEDITION ROUTES
========================================================

Display actual expedition routes when geographic route data exists.

Use:

GeoJSON / coordinate arrays / GIS data

rather than decorative lines.

When a route is selected:

show:

Expedition
Start
End
Route
Dates
Stations visited
Researchers
Related datasets
Publications
Media

Clicking the expedition should open its existing Expedition detail
page.

========================================================
47. REAL GIS LAYERS
========================================================

Create a functional layer control.

Potential layers include:

BASEMAP
- Street / Topographic
- Satellite / Imagery where available

POLAR SCIENCE
- Research Stations
- Expedition Routes
- Research Locations
- Dataset Coverage
- Publication Activity
- Media Locations

POLAR ENVIRONMENT
- Sea Ice
- Ice Shelf / Glacier information
- Oceanographic layers
- Environmental observations

Only enable layers for which real data/services are actually available.

Do NOT create fake environmental layers just to make the map look
advanced.

========================================================
48. WMS / WMTS SUPPORT
========================================================

Where appropriate, support real scientific GIS services using:

WMS
WMTS
GeoJSON
Vector tiles
GeoTIFF-derived services where appropriate

Build a reusable layer configuration system.

Example conceptual structure:

{
  id,
  name,
  type,
  source,
  attribution,
  opacity,
  visibility,
  minZoom,
  maxZoom
}

Do not hardcode every layer directly inside the map component.

========================================================
49. MAP ATTRIBUTION
========================================================

Every external basemap/data source must display appropriate attribution.

Do not remove required attribution.

Examples:

© OpenStreetMap contributors

or the appropriate attribution required by the selected provider.

========================================================
50. REAL MAP INTERACTION
========================================================

The following must actually work:

Zoom in
Zoom out
Pan
Reset view
Layer toggle
Marker selection
Route selection
Popup/detail panel
Search location
Coordinate display

Do not create buttons that only produce visual effects.

========================================================
51. LOCATION SEARCH
========================================================

Add a real location search mechanism.

User can search:

Station
Expedition
Research location
Coordinates
Place

When a repository entity is selected:

fly/zoom to its actual coordinates.

Example:

Search:

Maitri

→ map moves to actual coordinates
→ station marker selected
→ station information opens.

========================================================
52. COORDINATE INSPECTOR
========================================================

When the user moves/clicks on the map, provide:

Latitude
Longitude

where technically appropriate.

Allow coordinate display in a clear format.

For polar science users, provide useful coordinate precision.

========================================================
53. TIME-AWARE MAP
========================================================

Integrate the previously requested timeline functionality.

Allow users to explore:

Expedition activity by year
Station activity
Research activity
Dataset coverage
Publication activity
Media activity

Example:

2018 → expedition routes
2020 → new datasets
2023 → publications
2025 → recent expedition

The timeline must filter actual repository/map data.

Do not simply animate a decorative timeline.

========================================================
54. MAP → KNOWLEDGE CONNECTION
========================================================

The map must connect directly to the existing knowledge system.

Example:

Map
↓
Station
↓
Expedition
↓
Dataset
↓
Publication
↓
Finding
↓
Researcher
↓
Media

This should use the existing relationship model.

Do NOT create a separate Knowledge Graph page.

========================================================
55. MAP → POLAR KNOWLEDGE AI
========================================================

This is very important.

When the user selects:

Station
Location
Expedition route
Research region
Dataset coverage

provide:

[Ask Polar]

The AI should receive the selected geographic context.

Example:

User selects:

Maitri Station

Then clicks:

Ask Polar about this location

The Polar Knowledge AI should receive:

Selected location
Coordinates
Station
Related expeditions
Related datasets
Related publications

and answer using the available trusted repository sources.

========================================================
56. MAP → SOURCE WORKSPACE
========================================================

From a selected location/station/expedition:

allow:

[Add Related Sources]

Example:

Maitri Station

Related Sources:

 Expedition Report
 Dataset
 Publication
 Media

[Open in Polar Knowledge AI]

The same selected-source context should then be available in:

Chat
Evidence
Polar Studio

========================================================
57. DATASET SPATIAL VISUALIZATION
========================================================

Scientific Datasets should be able to connect to the map.

If a dataset contains geographic coverage:

show:

[View on Map]

Clicking it should:

- open Polar Map & GIS
- zoom to the dataset coverage
- highlight the relevant region
- show dataset metadata

Do not fabricate spatial coverage.

If spatial metadata is unavailable:

show:

"Spatial coverage unavailable for this dataset."

========================================================
58. PUBLICATION / EXPEDITION MAP LINKS
========================================================

Where geographic information exists:

Publication:

[View Research Location]

Expedition:

[View Expedition Route]

Dataset:

[View Spatial Coverage]

Media:

[View on Map]

These should all open the SAME existing Polar Map & GIS.

Do not create separate map implementations.

========================================================
59. MAP DATA ARCHITECTURE
========================================================

Separate:

MAP UI

from

MAP DATA.

Use a reusable architecture such as:

mapService
layerService
locationService
stationService
expeditionRouteService
geospatialDataService

The frontend map component should consume structured geographic data.

Do not put hundreds of hardcoded coordinates directly into the
React/HTML component.

========================================================
60. REAL DATA FIRST — MOCK DATA ONLY AS FALLBACK
========================================================

If the backend is not yet connected:

create a clearly isolated mock-data adapter.

Example:

Real API
   ↓
mapService

Fallback:

mockMapService

Do not mix mock coordinates with real coordinates.

Do not present fabricated data as real NCPOR data.

When real data becomes available, the mock adapter should be removable
without rewriting the map UI.

========================================================
61. MAP LOADING / FAILURE STATES
========================================================

Implement proper states:

Loading map...

Loading layer...

Layer unavailable

Tile service unavailable

No geographic data available

Failed to load route

Retry

Do not leave an empty map with no explanation.

========================================================
62. MAP PERFORMANCE
========================================================

Do not render thousands of markers individually if avoidable.

Use:

marker clustering
viewport-based loading
lazy loading
GeoJSON layers
vector layers
server-side filtering where appropriate

Especially optimize:

stations
media locations
research locations
dataset points

========================================================
63. MAP DESIGN
========================================================

Keep the existing NCPOR design system.

Do not make the map look like a generic Google Maps clone.

The visual hierarchy should prioritize:

Polar Research
Stations
Expeditions
Scientific datasets
Research activity

Use compact controls.

Suggested structure:

┌─────────────────────────────────────────────┐
│ Search location...              Layers     │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│              REAL POLAR MAP                 │
│                                             │
│                                             │
├─────────────────────────────────────────────┤
│ Timeline: 2015 ──────── 2026                │
└─────────────────────────────────────────────┘

When something is selected:

┌───────────────────────────────┐
│ MAITRI STATION                │
│                               │
│ Coordinates                   │
│ Expeditions       12          │
│ Publications      38          │
│ Datasets          16          │
│                               │
│ [Ask Polar]                   │
│ [View Knowledge]              │
│ [Add Sources]                 │
└───────────────────────────────┘

Adapt this to the existing UI rather than copying it literally.

========================================================
64. DO NOT ADD A NEW SIDEBAR PANEL
========================================================

Absolutely do NOT create:

Digital Twin
Polar Explorer
Real Maps
GIS Layers
Stations Map
Satellite Map
3D Map

as new sidebar navigation.

All of this belongs inside:

POLAR MAP & GIS

========================================================
65. OPTIONAL 3D — ONLY IF REAL DATA SUPPORTS IT
========================================================

If the current architecture can support a genuine 3D globe/polar
visualization using real geographic data, it may be added as an
internal view/mode:

2D Map
3D View

But this is OPTIONAL.

Do NOT create a fake 3D globe merely for visual appeal.

A high-quality functional 2D polar GIS map is better than a fake 3D
experience.

========================================================
66. FINAL MAP ACCEPTANCE TEST
========================================================

Test the following:

1. Open Polar Map & GIS.

2. Verify real geographic tiles load.

3. Zoom and pan.

4. Switch basemap if multiple real basemaps are configured.

5. Toggle research station layer.

6. Select a real station from available repository data.

7. Verify the map moves to the station's actual coordinates.

8. Open station details.

9. View related expeditions.

10. View related publications.

11. View related datasets.

12. Click an expedition route.

13. Verify the route uses real geographic coordinates.

14. Open dataset spatial coverage.

15. Verify the map displays the dataset's actual geographic extent
    where available.

16. Select a location.

17. Click "Ask Polar."

18. Verify Polar Knowledge AI receives the location context.

19. Add related sources.

20. Open Polar Studio.

21. Verify the same selected sources remain available.

22. Move the timeline.

23. Verify map content changes according to actual dated data.

24. Turn layers on/off.

25. Test unavailable layer handling.

26. Test map loading failure.

27. Test mobile/responsive behavior.

28. Verify required map/data attribution.

29. Verify no fabricated geographic information is displayed.

30. Verify the sidebar STILL contains exactly 11 panels.

========================================================
67. FINAL MAP PRINCIPLE
========================================================

The goal is NOT:

"Make a beautiful map."

The goal is:

"Make Polar Map & GIS a real scientific geographic interface for the
NCPOR knowledge repository."

It should connect:

REAL MAP
+
REAL GEOGRAPHIC DATA
+
EXPEDITIONS
+
STATIONS
+
DATASETS
+
PUBLICATIONS
+
MEDIA
+
TIMELINE
+
POLAR KNOWLEDGE AI

without creating another navigation panel.

Keep Leaflet if appropriate.

Upgrade the DATA and GIS capabilities around it.