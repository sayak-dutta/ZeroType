# Design System Strategy: The Ethereal Utility

This document outlines the visual language and structural logic for the design system. Our goal is to transform a utility-focused "Scan-to-Intent" application into a high-end digital experience. We are moving away from generic, grid-locked templates toward an **Editorial Minimalism**—a style characterized by breathing room, tonal depth, and a sense of weightlessness.

---

## 1. Creative North Star: "The Ethereal Utility"
The "Ethereal Utility" concept rejects the cluttered, high-contrast nature of traditional utility apps. Instead, it treats the mobile screen as a curated gallery. We achieve this through:
*   **Intentional Asymmetry:** Offsetting header elements or using varied card widths to create a dynamic, non-templated flow.
*   **Atmospheric Depth:** Using "light neumorphism"—not as a dated trend, but as a method of creating soft, tactile surfaces that feel integrated into the background.
*   **The "Silent" UI:** The interface should disappear until needed, allowing the user's intent to take center stage.

---

## 2. Colors & Surface Logic
The palette is rooted in a high-key, "Arctic" aesthetic. We use shifts in tone rather than lines to define architecture.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit directly on a `surface` background to create a soft distinction.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following tiers to create depth:
*   **Base Layer:** `surface` (#F5F7FA) – The canvas of the app.
*   **Secondary Sections:** `surface-container-low` (#EEF1F4) – For grouping related utility items.
*   **Elevated Elements:** `surface-container-lowest` (#FFFFFF) – Reserved for primary cards and interactive modules to provide a "lifted" feel.

### The "Glass & Gradient" Rule
To elevate the Sky Blue (`primary`) accent, avoid flat fills for large areas. Use subtle gradients from `primary` (#0058BA) to `primary-container` (#6C9FFF) at a 135° angle. For floating overlays or bottom sheets, apply **Glassmorphism**: use `surface` at 80% opacity with a 20px backdrop blur to maintain a premium, atmospheric feel.

---

## 3. Typography: Editorial Authority
We utilize **Inter** as our typographic backbone. The scale is designed to create a clear "Visual Shout" versus a "Quiet Whisper."

*   **Display & Headline:** Use `display-md` or `headline-lg` for scan results or primary intents. These should have a slight negative letter-spacing (-0.02em) to feel tighter and more "designed."
*   **Body & Labels:** Use `body-md` for descriptions. Always ensure `on-surface-variant` is used for secondary text to maintain a soft contrast that reduces eye strain.
*   **Hierarchy Tip:** Pair a `display-sm` header with a `label-md` (All Caps, +0.05em tracking) directly above it to create a sophisticated, editorial header style.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "heavy" for this system. We use **Tonal Layering** and **Ambient Shadows.**

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container` background. The natural delta in lightness provides enough "lift" for the human eye without a shadow.
*   **Ambient Shadows:** When a Floating Action Button (FAB) or a primary card requires a shadow, use a large blur (24px to 40px) at a very low opacity (4%–8%). The shadow color must be a tinted version of `on-surface` (#2C2F32), never pure black.
*   **The "Ghost Border" Fallback:** If a container lacks contrast on a specific background, use a **Ghost Border**: `outline-variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Floating Action Button (FAB)
The heart of the "Scan" intent. 
*   **Style:** Large, `full` roundedness, using the `primary` to `primary_container` gradient.
*   **Shadow:** An ambient shadow using the `primary` tint to make the button appear to glow softly rather than cast a dark shadow.

### Cards & Lists
*   **Structure:** No dividers. Use `spacing-6` (2rem) between list items or a subtle background shift to `surface-container-high` for hovered/pressed states.
*   **Radius:** Use `xl` (1.5rem) for main containers to reinforce the "Soft Minimalist" feel.

### Input Fields
*   **Style:** Minimalistic "pill" shapes using `full` roundedness.
*   **State:** Use `surface-container-low` for the default state. Upon focus, transition the background to `surface-container-lowest` and apply a `primary` Ghost Border (20% opacity).

### Bottom Sheets
*   **Style:** `xl` (1.5rem) top-only corner radius. 
*   **Texture:** Apply a 10% opacity `surface-tint` to the background to give the sheet a slight "Sky Blue" luminescence, making it feel part of the brand.

### Chips (Selection & Filter)
*   **Style:** Use `surface-container-high` for unselected and the vibrant `primary` for selected states. 
*   **Animation:** Use a "Scale & Bounce" transition (0.3s) to make the utility feel responsive and premium.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use white space as a structural element. If a screen feels crowded, increase the spacing to `spacing-8` or `spacing-10`.
*   **Do** use `primary` sparingly. It is a "laser beam" that guides the user to the "Intent."
*   **Do** ensure all icons are "Line Art" style with a consistent 1.5px or 2px stroke weight to match the Inter typeface.

### Don’t:
*   **Don’t** use 100% black (#000000) for text. Always use `on-surface` (#2C2F32) to keep the aesthetic soft.
*   **Don’t** use sharp corners. The minimum radius should be `md` (0.75rem), except for the "full" rounded pills.
*   **Don’t** use standard "Material Blue." Stick strictly to the `primary` Sky Blue (#0058BA) and its variants to maintain the Arctic identity.