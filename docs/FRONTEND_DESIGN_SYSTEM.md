# Browtiful Strokes — Frontend Design System

## 1. Color Palette
The color system is rooted in the organic heritage of henna, botanical oils, and Rajasthani aesthetics:

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Forest Green** (`forest`) | `#173D2D` | Primary headers, footer, high-contrast badges, brand anchors |
| **Henna Olive** (`olive`) | `#556B2F` | Accents, secondary badges, organic highlights, botanical cues |
| **Warm Cream** (`cream`) | `#FBF6EC` | Primary page background, light cards, spacious clean canvas |
| **Soft Beige** (`beige`) | `#EFE2CC` | Border lines, subtle card containers, dividers |
| **Muted Gold** (`gold`) | `#B6924B` | Interactive highlights, active pills, star ratings, CTA borders |
| **Charcoal** (`charcoal`) | `#222222` | Primary typography, maximum readability |
| **Terracotta** (`terracotta`) | `#C85A32` | Sale flags, bestseller tags, error indicators |

## 2. Typography
* **Serif Headings**:
  * Font Family: `Playfair Display`, `Cormorant Garamond`, serif
  * Usage: Section titles (`<h1>`, `<h2>`, `<h3>`), modal titles, hero slogans
* **Sans-Serif Body & Interface**:
  * Font Family: `Inter`, `Manrope`, system-ui, sans-serif
  * Usage: Product descriptions, prices, buttons, inputs, table cells, form labels

## 3. Spacing & Elevation
* Containers: Max width 1280px (`max-w-7xl`), centered with responsive horizontal padding (`px-4 sm:px-6 md:px-8`).
* Rounded Corners: Standardized to `rounded-xl` for cards and `rounded-full` for chips/pills.
* Shadows: Subtle warm shadows (`shadow-sm`, `shadow-md hover:shadow-lg`) avoiding harsh black dropshadows.
