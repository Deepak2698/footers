# Footers E-Commerce Design System

## Overview
This design system ensures consistency across the Footers e-commerce platform. It defines typography, colors, spacing, components, and patterns to create a premium, cohesive user experience.

## Color Palette

### Primary Colors
- **Gold Gradient**: `from-gold-400 via-gold-500 to-gold-600`
- **Gold Base**: `#fbbf24` (gold-500)
- **Gold Dark**: `#d97706` (gold-700)

### Neutral Colors (Dark Mode)
- **Background**: `#000000` (black-900)
- **Surface**: `#1a1a1a` (black-800)
- **Surface Light**: `#404040` (black-700)
- **Border**: `#666666` (black-600)
- **Text Primary**: `#f8f8f8` (black-100)
- **Text Secondary**: `#e0e0e0` (black-200)
- **Text Tertiary**: `#cccccc` (black-300)
- **Text Muted**: `#999999` (black-400)

### Neutral Colors (Light Mode)
- **Background**: `#ffffff` (white-50)
- **Surface**: `#f8fafc` (white-100)
- **Surface Light**: `#f1f5f9` (white-200)
- **Border**: `#cbd5e1` (white-300)
- **Text Primary**: `#1e293b` (white-900)
- **Text Secondary**: `#334155` (white-800)
- **Text Tertiary**: `#475569` (white-700)
- **Text Muted**: `#64748b` (white-600)

### Semantic Colors
- **Success**: Green-500 with 20% opacity background
- **Warning**: Orange-500 with 20% opacity background
- **Error**: Red-500 with 20% opacity background
- **Info**: Blue-500 with 20% opacity background

## Typography

### Font Families
- **Luxury Font**: `font-luxury` - Used for headings and premium branding
- **Modern Font**: `font-modern` - Used for body text and UI elements

### Type Scale
- **H1**: 4xl (36px) - Page titles
- **H2**: 3xl (30px) - Section headings
- **H3**: 2xl (24px) - Card titles
- **H4**: xl (20px) - Subheadings
- **Body**: base (16px) - Default text
- **Small**: sm (14px) - Secondary text
- **XSmall**: xs (12px) - Labels and captions

### Typography Classes
- `.heading-luxury` - Apply luxury font family
- `.heading-modern` - Apply modern font family
- `.text-gradient` - Gold gradient text effect

## Spacing

### Scale
- **xs**: 0.5rem (8px)
- **sm**: 0.75rem (12px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Layout Spacing
- `.section-padding` - `px-4 sm:px-6 lg:px-8 py-12`
- `.container-custom` - `max-w-7xl mx-auto`
- `.container-narrow` - `max-w-4xl mx-auto`

## Components

### Buttons

#### Primary Button
```html
<button class="btn-primary">Button Text</button>
```
- Gold gradient background
- Black text
- Rounded corners (lg)
- Hover: Scale and shadow effect
- Focus: Ring outline

#### Secondary Button
```html
<button class="btn-secondary">Button Text</button>
```
- Dark background with gold border
- Gold text
- Rounded corners (lg)
- Hover: Background change

#### Outline Button
```html
<button class="btn-outline">Button Text</button>
```
- Transparent background with gold border
- Gold text
- Rounded corners (lg)
- Hover: Gold background, black text

#### Button Sizes
- `.btn-sm` - Small size (px-4 py-2 text-sm)
- `.btn-lg` - Large size (px-8 py-4 text-lg)

### Cards

#### Base Card
```html
<div class="card">Card Content</div>
```
- Dark background
- Border
- Rounded corners (xl)
- Shadow effect
- Hover: Enhanced shadow

#### Product Card
```html
<div class="product-card">Product Content</div>
```
- Optimized for product display
- Hover: Scale and gold shadow
- Overflow hidden for images

#### Card Hover Effect
```html
<div class="card card-hover">Card Content</div>
```
- Adds scale and shadow on hover

### Inputs

#### Base Input
```html
<input class="input-field" placeholder="Placeholder text" />
```
- Dark background
- Border
- Rounded corners (lg)
- Focus: Gold border and ring
- Placeholder styling

### Badges

#### Base Badge
```html
<span class="badge">Badge Text</span>
```
- Pill shape (rounded-full)
- Small padding
- Medium font weight

#### Badge Variants
- `.badge-success` - Green
- `.badge-warning` - Orange
- `.badge-error` - Red
- `.badge-info` - Blue

### Tables

#### Base Table
```html
<table class="table">
  <thead>
    <tr>
      <th>Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data</td>
    </tr>
  </tbody>
</table>
```
- Full width
- Collapsed borders
- Header styling
- Row hover effect

### Modals/Dialogs

#### Modal Structure
```html
<div class="modal-overlay">
  <div class="modal-content">
    Modal Content
  </div>
</div>
```
- Backdrop blur
- Centered content
- Max width constraint
- Scrollable if needed

### Navigation

#### Navbar Link
```html
<a class="navbar-link">Link Text</a>
```
- Hover: Gold color
- Focus: Gold color
- Smooth transition

#### Category Pill
```html
<button class="category-pill">Category</button>
```
- Pill shape
- Border
- Hover: Gold border and text
- Focus: Ring outline

## Animations

### Fade In
```html
<div class="fade-in">Content</div>
```
- Opacity transition (0.3s)

### Slide Up
```html
<div class="slide-up">Content</div>
```
- Translate Y + opacity (0.3s)

### Slide Down
```html
<div class="slide-down">Content</div>
```
- Translate Y + opacity (0.3s)

### Built-in Tailwind Animations
- `animate-pulse` - Loading skeleton effect
- `animate-shimmer` - Gold shimmer effect
- `animate-float` - Floating animation
- `animate-bounce` - Bounce effect

## Shadows

### Shadow Variants
- `shadow-black` - Subtle black shadow
- `shadow-black-lg` - Enhanced black shadow
- `shadow-gold` - Gold-tinted shadow
- `shadow-gold-lg` - Enhanced gold shadow

## Utilities

### Text Effects
- `.text-shadow-gold` - Gold text shadow

### Background Effects
- `.bg-gold-shimmer` - Shimmer gradient background

## Responsive Breakpoints

- **Mobile**: < 640px (default)
- **Tablet**: 640px - 1024px (sm, md)
- **Laptop**: 1024px - 1280px (lg)
- **Desktop**: > 1280px (xl, 2xl)

## Accessibility

### Focus States
All interactive elements include:
- `focus:outline-none`
- `focus:ring-2`
- `focus:ring-gold-500`
- `focus:ring-offset-2`
- `focus:ring-offset-black-900`

### ARIA Labels
- Use semantic HTML elements
- Add `aria-label` for icon-only buttons
- Use `role` where appropriate
- Include `aria-expanded` for toggle elements

### Color Contrast
- All text meets WCAG AA standards
- Gold on black: High contrast
- White on dark: High contrast
- Semantic colors use 20% opacity backgrounds

## Usage Guidelines

### When to Use Luxury Font
- Page titles (H1, H2)
- Brand elements
- Premium product names
- Hero sections

### When to Use Modern Font
- Body text
- UI labels
- Form inputs
- Navigation

### When to Use Gold Gradient
- Primary actions
- Important highlights
- Brand elements
- Call-to-action buttons

### When to Use Dark Backgrounds
- Product cards
- Modals
- Sidebar
- Footer

## Custom Components

### Skeleton Loaders
Located in `src/components/SkeletonLoader.tsx`
- `Skeleton` - Base skeleton component
- `ProductCardSkeleton` - Product card loading state
- `ProductDetailSkeleton` - Product detail loading state
- `CategoryCardSkeleton` - Category card loading state
- `TableRowSkeleton` - Table row loading state

### Image Zoom
Located in `src/components/ImageZoom.tsx`
- Zoom in/out functionality
- Pan when zoomed
- Fullscreen view
- Reset zoom button

## Theme Support

### Dark Mode (Default)
- Black backgrounds
- Gold accents
- White text
- High contrast

### Light Mode
- White backgrounds
- Gold accents
- Dark text
- Maintained contrast

Theme is controlled via `ThemeContext` and persisted in localStorage.
