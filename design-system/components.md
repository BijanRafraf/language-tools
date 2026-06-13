# Component Guidance

Styling examples in this file use Tailwind utility classes because that is the primary implementation pattern for this site.

## Page Shell

Use this for primary pages such as the home page and simple tools.

- Center content inside a paper surface.
- Keep the main content width between `max-w-2xl` and `max-w-6xl` depending on whether the page is utility-first or profile-first.
- Apply a strong left rail to anchor the page.
- Separate major sections with thin horizontal dividers.

Reference structure:

```tsx
<main className="container m-auto my-12 max-w-6xl bg-stone-50 p-8 text-rose-950 dark:bg-stone-900 dark:text-rose-50">
  <div className="border-l-4 border-rose-950 dark:border-rose-700">
    <section className="ml-6">...</section>
    <hr className="my-3 border-0 border-t border-rose-950 dark:border-rose-700" />
    <section className="ml-6">...</section>
  </div>
</main>
```

- Compose layout, spacing, and color with utilities on the element itself.
- Avoid introducing one-off global classes when an existing utility combination is enough.
- If a pattern repeats often, prefer a React component abstraction over a standalone CSS helper class.

## Typography

### H1

- Use for page identity only.
- Size range: `text-5xl` or token equivalent.
- Weight: bold.
- Pair with a supporting image or icon when it improves recognition.

### H2

- Use for section labels.
- Size range: `text-xl`.
- Weight: bold.
- Keep spacing tight to preserve the editorial rhythm.

### H3

- Use for items nested within a section, such as event titles or capability groups.
- Usually appears beside an icon or directly above supporting metadata.

### Body Copy

- Default to `text-sm` or `text-base` depending on density.
- Favor short paragraphs with readable line length.
- Use muted text only for supplementary information, never for the primary narrative.

## Navigation

The current site uses plain anchor navigation. Keep it simple.

- Use list-based nav for in-page jumps.
- Prefer visible bullets or markers over pills or tabs.
- Use brand-accent markers rather than changing all text color.

Recommended utility pattern:

```tsx
<ul className="list-disc pl-5 marker:text-rose-700 dark:marker:text-rose-400">
  <li><a href="#about">About</a></li>
  <li><a href="#experience">Experience</a></li>
</ul>
```

## Action Buttons

The pomodoro buttons establish the main interactive pattern for the site.

### Default Action

- Filled with the brand ink color.
- Inverse text.
- Rounded on the trailing edge only.
- Medium shadow so the control reads as tactile.

### Hover

- Shift to the brighter rose hover color.
- Keep movement minimal. If motion is used, limit it to a subtle lift of 1 to 2 pixels.

### Focus

- Use a strong visible ring.
- Focus treatment should be at least as noticeable as hover.

### Active or Running State

- Reserve cyan for currently selected or currently running timer state.
- Append a simple textual indicator if needed, as the current `*` pattern does.
- Avoid using cyan on multiple unrelated elements simultaneously.

Reference structure:

```tsx
<button
  className={isActive
    ? "rounded-e-xl border border-l-0 border-cyan-950 bg-cyan-950 px-3 py-1.5 font-semibold text-rose-50 shadow-md hover:bg-cyan-900 focus:outline-none focus:ring focus:ring-cyan-700 focus:ring-opacity-75 dark:border-cyan-800 dark:bg-cyan-800 dark:hover:bg-cyan-700 dark:focus:ring-cyan-500"
    : "rounded-e-xl border border-l-0 border-rose-950 bg-rose-950 px-3 py-1.5 font-semibold text-rose-50 shadow-md hover:bg-rose-900 focus:outline-none focus:ring focus:ring-rose-700 focus:ring-opacity-75 dark:border-rose-700 dark:bg-rose-900 dark:hover:bg-rose-800 dark:focus:ring-rose-500"}
>
  Focus
</button>
```

## Form Inputs

The timer duration inputs suggest a minimal form language.

- Use narrow inputs for numeric controls.
- Prefer low-chrome backgrounds like muted paper.
- Keep controls aligned to a visible grid.
- Do not over-style utility inputs; clarity matters more than novelty.

Recommended rules:

- background: `bg-stone-100 dark:bg-stone-800`
- text: `text-rose-950 dark:text-rose-50`
- width sized to expected content
- visible focus ring using `focus:ring-rose-700 dark:focus:ring-rose-500`

## Lists and Metadata

Use bulleted lists for contact details, technologies, and event metadata.

- Marker color should carry the accent, not the text itself.
- Metadata can be displayed in `text-sm`.
- Secondary values can use muted text and italic styling sparingly.

## Icons and Imagery

- Use icons to support scanning, not decorate empty space.
- Keep icon size compact in content sections.
- The headshot pattern works because it is paired with the site title and not repeated elsewhere.
- Prefer circular imagery for personal identity and simple line icons for metadata.

## Progress and Time-Based UI

The timer page introduces a second class of component: utility feedback.

- Progress visuals should be centered and given generous whitespace.
- Status color may use the active cyan family.
- Supporting controls should remain in the brand rose family so status and action are visually distinct.

## Page Patterns

### Profile Page

Use when content is biographical or portfolio-like.

- Header with identity block.
- Anchor nav.
- Sequential sections for about, contact, events, and experience.
- Wide layout up to page max width.

### Utility Tool Page

Use when task completion matters more than narrative.

- Title and brief explanatory copy.
- Compact configuration controls.
- Clear call-to-action stack.
- Large centered output area.
- Narrower layout than the profile page.

## Accessibility Rules

- Maintain clear contrast between paper surfaces and ink text.
- Do not rely on color alone for timer state changes.
- Ensure keyboard focus is visible on all links, inputs, and buttons.
- Keep body text readable against the stone and rose palette.
- Use descriptive `alt` text for identity images and meaningful icons.

## Dark Mode Rules

- Follow browser preference automatically with `prefers-color-scheme`.
- Express dark mode in components with Tailwind `dark:` utilities rather than separate dark-theme stylesheets.
- Keep the same semantic mapping in dark mode: canvas, paper, ink, accent, and active should all retain their roles.
- Increase rose and cyan lightness in dark contexts instead of changing to unrelated hues.
- Preserve the paper-on-canvas contrast so panels still feel framed and intentional.
- Treat muted text carefully in dark mode; it should soften, not disappear.

## Do Not

- Introduce bright new colors without assigning them a specific semantic role.
- Replace the editorial layout with card grids unless the content truly requires it.
- Use heavy animation or decorative gradients that compete with the content.
- Turn navigation into a complex menu system for this scale of site.
