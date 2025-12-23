# Project Rules

## CSS Architecture

### globals.css
Bevat alle gedeelde styles:
- CSS variabelen (colors, fonts, spacing)
- Button classes (.btn, .btn-social, .btn-icon)
- Container classes (.container, .container.medium, .container.small)
- Reset styles
- Lenis smooth scroll styles

### Component CSS (*.module.css)
Bevat alleen component-specifieke styling:
- Layout voor die specifieke component
- Positionering
- Component-unieke aanpassingen

## Units

**Gebruik altijd `em` voor:**
- padding
- margin
- width/height
- gap
- letter-spacing
- font-sizes (via variabelen)

**Uitzondering:** borders mogen `px` zijn voor scherpe lijnen.

## Git

**NOOIT zelfstandig pushen naar GitHub.**
Alleen pushen wanneer expliciet gevraagd door de gebruiker.

## Variabelen

### Colors
- `--color-white`
- `--color-black`
- `--color-dark`
- `--color-gray`
- `--color-light`
- `--color-accent`

### Fonts
- `--font-primary` (Chaney)
- `--font-secondary` (Neue Haas Grotesk)
- `--font-mono` (Plaid Mono)
- `--font-h1` t/m `--font-h4`
- `--font-par`
- `--font-small`

### Scaling
- `--size-container`
- `--size-font`
