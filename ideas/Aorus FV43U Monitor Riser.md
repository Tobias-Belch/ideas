# Project Brief: Slim, Stable Monitor Riser for Gigabyte Aorus FV43U

## Goal
Design and build **two compact risers** to raise a **Gigabyte Aorus FV43U** monitor by **150 mm**, allowing a laptop to sit open in front of the screen, while remaining **stable on a standing desk that exhibits some wobble**.

## Key constraints
- Minimal footprint (significantly less than current 380 mm depth)
- Very high lateral stability
- No permanent modification of the monitor
- Clean, furniture-grade appearance
- Buildable with woodworking tools + consumer 3D printer

## Monitor & Desk Context
- Monitor weight (with stand): ~10 kg total (~5 kg per foot)
- Stand type: two independent metal feet
- Desk depth: 900 mm
- Desk type: height-adjustable standing desk (prone to small lateral oscillations)
- Primary instability risk: **micro-movement and walking**, not static tipping

## Final Riser Geometry (Per Foot)

### Overall Dimensions
- **Height:** 150 mm (fixed)
- **Width (left–right):** 190 mm
- **Depth (front–back):** 85 mm

This footprint provides ≈12° equivalent lateral tip margin and strong resistance to dynamic sway, while reducing depth usage by ~78% vs. the original setup.

## Structural Layout
Layered vertical stack (bottom → top):

1. **Bottom damping layer**
   - 3–5 mm rubber or cork–rubber composite
   - Shore A ≈ 50–60
   - Covers ≥80% of base area

2. **Wooden structural core**
   - Height: 120 mm  
   - Width: 190 mm  
   - Depth: 85 mm  
   - Material:
     - Hardwood (oak, beech, maple), **or**
     - Laminated birch plywood  
   - Chamfered edges (~5 mm) to reduce visual bulk

3. **3D-printed locking cradle**
   - Height: 20 mm
   - Width: ~160 mm
   - Depth: ~70 mm
   - Material: PLA+ (non-structural)
   - Mechanically bonded to wood (VHB tape or screws from below)

**Total height:** 150 mm

## Locking Mechanism (Critical Feature)

### Type
**Shallow mechanical foot pocket (parking-curb style)**

### Geometry
- Pocket depth: **4–5 mm**
- Wall thickness: **≥4 mm**
- Clearance: **+0.5 mm per side** relative to monitor foot
- Rear stop: **6 mm vertical lip**
- Bottom of pocket: flat (monitor foot rests on solid surface)

### Function
- Prevents lateral sliding in all directions
- Blocks forward/backward movement during desk oscillation
- Does **not** trap the foot vertically (lift-off removal remains possible)
- Relies on geometry, not friction alone

## 3D Printing Parameters (PLA+)
- Print orientation: flat on build plate
- Walls: 4–5 perimeters
- Infill: 25–30% (gyroid or cubic)
- Layer height: 0.2 mm
- Internal fillets: 1–2 mm at pocket corners

PLA+ is acceptable because it carries **no bending load** and only experiences compression and contact forces.

## Stability Strategy (Standing Desk Optimized)
- Wide stance (190 mm) resists lateral acceleration
- Shallow depth (85 mm) minimizes oscillation leverage
- Bottom rubber layer damps desk motion and prevents “walking”
- Mechanical foot lock eliminates slow creep over time
## Material Choice Rationale
- **Wood (preferred):**
  - High damping
  - Light enough for standing desk motors
  - Easy to shape and iterate
- **Concrete:** explicitly avoided due to poor dynamic behavior, high mass, and desk wear risk

## Status
This design is considered:
- Mechanically safe
- Optimized for minimal bulk
- Ready for CAD modeling and fabrication
- Suitable for further refinement (visual tapering, material finish, cradle contouring)

### Possible Next Iterations
- CAD-ready dimensioned drawings
- Exact cradle contour matching the FV43U foot
- Further depth reduction trade-off analysis
- Visual slimming (tapers, shadow grooves)
- STL generation for the cradle
