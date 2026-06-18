# Payflow brand assets

Source files for the Payflow logo. These are **not** served by the web app
(they live outside `frontend/public/` on purpose).

- `logo-512.png` — 512×512 raster version of the logo (lime square + double
  forward-chevron). Used as the GitHub organization avatar and anywhere a
  raster logo is needed.
- `make-logo-png.ps1` — regenerates `logo-512.png` from scratch using Windows
  PowerShell + System.Drawing. Run it to produce a different size by changing
  the `$size` variable.

The live favicon / in-app mark is the SVG at `frontend/public/logo.svg` and the
`Logo` React component at `frontend/src/components/Logo.jsx`.
