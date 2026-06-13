# Personal Site Design System

This design system translates the existing site into a reusable set of foundations, tokens, and component rules. It is based on the current visual language in `src/pages/index.tsx`, `src/pages/pomodoro.tsx`, and the interaction pattern in `src/components/button.tsx`.

## Implementation Model

Styling is authored through Tailwind utility classes.

- Tailwind utilities are the primary styling surface for pages and components.
- `tailwind.preset.js` captures the reusable theme primitives the utilities should reference.
- Component guidance in this directory should be applied as utility combinations directly in JSX.

## Design Intent

The site already has a clear point of view:

- Editorial, single-column content framed like a printed profile sheet.
- Warm neutral surfaces with a deep rose ink color.
- Sparse use of accent color, reserved for active or in-progress states.
- Rounded controls that still feel structured because they sit against strong borders and dividers.
- Dense information presented with simple hierarchy instead of heavy chrome.

This system preserves that direction and makes it repeatable.

## Core Principles

1. Let content lead.
   Use strong type hierarchy, dividers, and spacing before introducing decorative UI.
2. Keep the palette restrained.
   Rose is the brand ink. Cyan is reserved for active state and progress-oriented UI.
3. Use paper-over-canvas layering.
   Pages should feel like a card or sheet placed on a muted background.
4. Make interaction obvious.
   Hover, focus, and active states should change color and affordance clearly.
5. Prefer section rhythm over complex layout.
   Most pages should stack content blocks separated by rules, borders, or spacing.

## Files

- `tailwind.preset.js`: Tailwind-ready theme extension that maps the system into reusable utilities.
- `components.md`: component specs, interaction rules, and utility-first composition guidance.

## Recommended Usage

1. Merge `tailwind.preset.js` into the site Tailwind config.
2. Build pages and components with Tailwind utility classes directly in JSX.
3. Use `components.md` as the source of approved utility patterns and interaction rules.

## System Summary

- Canvas: muted stone background.
- Surface: light stone paper panels.
- Primary ink: deep rose.
- Secondary text: softened stone.
- Active accent: deep cyan.
- Layout: narrow, centered reading width with strong left border anchoring major content.
- Motion: quick, subtle transitions only on state changes.

## Applicability

This system is suited for:

- personal profile pages
- writing or notes pages
- utility tools like the pomodoro page
- event and experience listings

It is not intended for dashboard-heavy or highly decorative product UI without expansion.
