# Rocket Building & Launching Game - TODO

## Step 1: Create Core HTML and CSS
- [x] Create space/index.html with canvas, UI panels, and script imports
- [x] Create space/css/style.css for builder grid UI, flight HUD, part palettes, staging panel

## Step 2: Create JavaScript Modules
- [x] space/js/constants.js - Physics constants, part IDs, scale factors
- [x] space/js/rocketparts.js - Part database (command modules, fuel tanks, engines, fairings, decouplers, adapters)
- [x] space/js/solarsystem.js - Solar system: Sun + planets with atmospheres, gravity wells
- [x] space/js/physics.js - Gravity model, thrust curves, drag, fuel burn, staging events, orbital elements
- [x] space/js/builder.js - Grid-snapping VAB, drag-and-drop, attach rules, staging config, save/load
- [x] space/js/renderer.js - Canvas camera, rocket/planet rendering, orbit lines, trajectory prediction
- [x] space/js/controls.js - Input handling for builder and flight modes
- [x] space/js/game.js - Main game loop, mode switching, state management

## Step 3: Integration & Testing
- [x] Test builder mode (grid snapping, part attachment, staging)
- [x] Test flight mode (physics, staging, orbit lines)
- [x] Test solar system traversal and map view
- [x] Ensure all controls are documented in UI

