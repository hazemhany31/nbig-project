# Sky Hills floor-plan image edits

Mode: built-in `image_gen.imagegen` (no CLI fallback).

Each image was inspected before editing and each result was visually checked. The tool returned 1492 × 1054 PNG images; it increased pixel dimensions despite the prompt requesting preservation. Original files were subsequently moved to the dated backup by the integration workflow.

## ground-90-a.png

Original source: `/Users/hazemhany/websites/NBIG-PROJECT/images/floor-plans/ground-85-real.png`

Archived source: `/Users/hazemhany/websites/.sky-hills-backups/2026-11-07/main/images/floor-plans/ground-85-real.png`

Output: `/Users/hazemhany/websites/NBIG-PROJECT/images/floor-plans/ground-90-a.png`

Exact prompt:

```text
Use case: text-localization. Asset type: floor plan image on real estate website. Image 1 is the edit target. Make a precise localized text edit only. Replace the top two heading lines with exactly "Type 2 - Ground Floor" and "Total Area 90 m²", matching the existing black sans-serif font, size, left alignment and beige background at the same position. Replace old area 85 with 90. Constraints: preserve absolutely everything else in the input unchanged, including the entire floor-plan geometry, wall and door positions and thicknesses, windows, furniture, garden, all labels, every number and dimension in the green table, colors, image dimensions, margins and framing. No cropping, rescaling, redrawing, added decorations, watermark or extra text. Only edit the title and area text.
```

## ground-90-b.png

Original source: `/Users/hazemhany/websites/NBIG-PROJECT/images/floor-plans/ground-88-real.png`

Archived source: `/Users/hazemhany/websites/.sky-hills-backups/2026-11-07/main/images/floor-plans/ground-88-real.png`

Output: `/Users/hazemhany/websites/NBIG-PROJECT/images/floor-plans/ground-90-b.png`

Exact prompt:

```text
Use case: text-localization. Asset type: floor plan image on real estate website. Image 1 is the edit target. Make a precise localized text edit only. Replace the top two heading lines with exactly "Type 2 - Ground Floor" and "Total Area 90 m²", matching the existing black sans-serif font, size, left alignment and beige background at the same position. Replace old area 88 with 90. Constraints: preserve absolutely everything else in the input unchanged, including the entire floor-plan geometry, wall and door positions and thicknesses, windows, furniture, garden, all labels, every number and dimension in the green table, colors, image dimensions, margins and framing. No cropping, rescaling, redrawing, added decorations, watermark or extra text. Only edit the title and area text.
```

## typical-120.png

Original source: `/Users/hazemhany/websites/NBIG-PROJECT/images/floor-plans/typical-115-real.png`

Archived source: `/Users/hazemhany/websites/.sky-hills-backups/2026-11-07/main/images/floor-plans/typical-115-real.png`

Output: `/Users/hazemhany/websites/NBIG-PROJECT/images/floor-plans/typical-120.png`

Exact prompt:

```text
Use case: text-localization. Asset type: floor plan image on real estate website. Image 1 is the edit target. Make a precise localized text edit only. Replace the top two heading lines with exactly "Type 2 - Typical Floor" and "Total Area 120 m²", matching the existing black sans-serif font, size, left alignment and beige background at the same position. Replace old area 115 with 120. Constraints: preserve absolutely everything else in the input unchanged, including the entire floor-plan geometry, wall and door positions and thicknesses, windows, furniture, garden, all labels, every number and dimension in the green table, colors, image dimensions, margins and framing. No cropping, rescaling, redrawing, added decorations, watermark or extra text. Only edit the title and area text.
```

## typical-145.png

Original source: `/Users/hazemhany/websites/NBIG-PROJECT/images/floor-plans/first-135-real.png`

Archived source: `/Users/hazemhany/websites/.sky-hills-backups/2026-11-07/main/images/floor-plans/first-135-real.png`

Output: `/Users/hazemhany/websites/NBIG-PROJECT/images/floor-plans/typical-145.png`

Exact prompt:

```text
Use case: text-localization. Asset type: floor plan image on real estate website. Image 1 is the edit target. Make a precise localized text edit only. Replace the top two heading lines with exactly "Type 2 - Typical Floor" and "Total Area 145 m²", matching the existing black sans-serif font, size, left alignment and beige background at the same position. Replace old area 135 with 145 and change First Floor to Typical Floor. Constraints: preserve absolutely everything else in the input unchanged, including the entire floor-plan geometry, wall and door positions and thicknesses, windows, furniture, garden, all labels, every number and dimension in the green table, colors, image dimensions, margins and framing. No cropping, rescaling, redrawing, added decorations, watermark or extra text. Only edit the title and area text.
```

# Supplied architectural render originals

These three JPEGs were copied directly from the supplied originals. No image generation or architectural edits were used.

| Original | Integrated path |
| --- | --- |
| `/Users/hazemhany/Downloads/WhatsApp Image 2026-11-05 at 11.34.43 (1).jpeg` | `images/sky-hills/courtyard-gardens.jpg` |
| `/Users/hazemhany/Downloads/WhatsApp Image 2026-11-05 at 11.34.43.jpeg` | `images/sky-hills/courtyard-view.jpg` |
| `/Users/hazemhany/Downloads/WhatsApp Image 2026-11-05 at 11.34.42 (3).jpeg` | `images/sky-hills/facade.jpg` |

