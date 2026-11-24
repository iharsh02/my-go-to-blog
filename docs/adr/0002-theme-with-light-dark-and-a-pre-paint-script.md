# Theme with light-dark() tokens and a pre-paint script

Colors are CSS variables written as `light-dark(light, dark)`, and the active theme is chosen by setting `data-theme` on `<html>` from an inline script that runs before first paint (so a saved Light/Dark/System choice never flashes). We chose this over a `.dark` class with duplicated token blocks because each token is declared once, and without JavaScript `color-scheme: light dark` still follows the OS.

## Consequences

- `light-dark()` only accepts colors, so box shadows are swapped per theme in separate `--elev-*` rules.
- Switching themes adds `.theme-switching` (transitions off), forces a style flush by reading a computed style, and removes the class on the next frame. Without the flush, the browser batches the class change with the color change and every element animates its colors piece by piece.
