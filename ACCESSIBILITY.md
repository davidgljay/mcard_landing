# Accessibility notes

Stated plainly, in the spirit of the site's own [Assurances](/assurances/) page: what
was checked, what was fixed, and what's worth re-checking after future edits.

## What was checked (manual pass, no automated CI tooling yet)

- **Landmarks & structure** — `<header>`/`banner`, `<nav aria-label="Primary">`,
  `<main>`, `<footer>`/`contentinfo` are present on both pages; verified via the
  accessibility tree (Chrome DevTools / browser automation), not just visually.
  Each page has exactly one `<h1>`; headings step down without skipping levels.
- **Images** — every content image (card photos, step illustrations) has real
  `alt` text; decorative icons in the examples grid use `alt=""`.
- **Forms** — every input/textarea has a real `<label for>` (not just a
  `placeholder`); the role checkboxes sit in a `<fieldset>`/`<legend>` so their
  group question is announced.
- **Color contrast** — computed the palette combinations actually used against
  WCAG AA (4.5:1 normal text / 3:1 large text). `#63ae22` (green-500) read below
  3:1 on white and was demoted to decorative-only use (borders, badge fills,
  dots); body/link text uses `#3f7a13` (green-600, ~5.25:1) instead. The muted
  label color was changed from `#8a887c` (~3.57:1, fails) to `#5c6b71` (~5.5:1).
- **Focus states** — added a visible `:focus-visible` outline (not just
  `:hover`) to every link, button, and form control; added a skip-to-content
  link as the first focusable element on the page.
- **Card-stack interaction** — the rotate control is a real `<button>` with an
  `aria-label` and works from the keyboard (Enter/Space) with no drag required;
  it's the accessible equivalent of dragging. The cards themselves are
  `tabindex="-1"` (decorative imagery whose captions are already read from the
  page), so dragging isn't the only way to reach the stack's one stateful
  action.
- **Motion** — `prefers-reduced-motion: reduce` is honored both globally (CSS)
  and specifically in `card-stack.js` (rotate/snap-back apply instantly,
  skipping the transition, when the user has that preference set).
- **Touch targets** — nav links, buttons, and checkboxes are sized to ≥44px on
  the touch axis.
- **Assurances index** — collapses to a horizontally-scrollable chip row under
  900px rather than disappearing; labeled `<nav aria-label="Assurances index">`.

## Known gaps / re-check next time content changes

- No automated axe-core/Lighthouse CI check is wired up yet — this was a manual
  pass. If a linting step is added later, run it against both `/` and
  `/assurances/`.
- The "Try It Out" hero button is intentionally non-interactive (disabled
  feature, "Coming soon" badge) and isn't in the tab order — revisit its markup
  once the feature ships and the button becomes real.
- Color contrast was checked for the combinations used today; any new color
  pairing added to `_data/*.yml`-driven content (e.g. a new badge or tag style)
  should be checked again before shipping.
