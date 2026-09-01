# Framer source mapping

This repository is a React/Next.js translation of the Framer project **Personal Website**.

## Pages captured

- `/`: Home currently contains the customized Header instance.
- `/about`: completed About composition, Navigation component, copy, and portrait.
- `/work`: WorkSection code component filling the upper 802px of a 1600×1080 breakpoint.
- `/resume`: InteractiveBook placeholder at 200×200 on a 1200×1080 breakpoint.

## Home instance overrides

The Home breakpoint is 1468×1080. Its Header instance differs from the design-page source and has:

- width 1468px, height 80px, left offset -8px
- horizontal stack, centered items, space-between distribution
- padding 22px top/bottom and 48px left/right
- original fill `#111827`
- center wordmark: `isakii`, Salvetica, 70px, `#CDBFE3`
- left and right 68×24 SVG groups preserved in `components/HomeHeader.tsx`

The fixed translucent/blurred behavior from `Header_Override.tsx` is applied in the Next.js implementation.

## Framer code translated

- `Contact_Button.tsx` → `components/ContactButton.tsx`
- `Hero_Video.tsx` → `components/HeroVideo.tsx`
- `Header_Override.tsx` → `components/withHeader.tsx`
- `Work_Section.tsx` → `components/WorkSection.tsx`
- `Examples.tsx` / `NegativeTop` → `negativeTopStyle` in `components/withHeader.tsx`
- InteractiveBook module → `components/InteractiveBook.tsx`
- Navigation canvas component and its responsive variants → `components/Navigation.tsx`
- Smooth Scroll effect → `components/SmoothScroll.tsx` (Lenis intensity 10, homepage only)
