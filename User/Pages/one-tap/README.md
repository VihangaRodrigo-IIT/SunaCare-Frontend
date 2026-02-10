# One Tap Animal Emergency Report Frontend

A modern, mobile-first frontend for reporting animal emergencies using React, Next.js, TypeScript, and Tailwind CSS.

## Features

- ⚡ **One-Tap Reporting** - Report animal emergencies in 4 simple steps
- 📍 **GPS Location** - Automatic location detection with fallback manual entry
- 📸 **Photo Upload** - Attach up to 5 photos to document the situation
- 🎯 **Severity Levels** - Critical, Moderate, or Minor classification
- 📱 **Mobile First** - Fully responsive design optimized for mobile devices
- 🏥 **Real-time Tracking** - Track report status with unique ticket ID
- ♿ **Accessible** - WCAG 2.1 AA compliant with proper contrast and touch targets

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.3 with PostCSS
- **Form Handling**: react-hook-form 7.48 + zod 3.22 validation
- **HTTP Client**: axios 1.6
- **Maps**: @react-google-maps/api 2.19
- **UI Components**: react-icons 4.12, react-spinners 0.13
- **Notifications**: react-hot-toast 2.4

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Edit `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000 in browser
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
Frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Home page with CTA
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Global styles
│   │   └── report/
│   │       ├── start/           # Location selection
│   │       ├── details/         # Animal & severity details
│   │       ├── review/          # Report review
│   │       └── success/         # Submission confirmation
│   │
│   ├── components/
│   │   ├── Common/              # Shared components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── ProgressIndicator.tsx
│   │   ├── ReportFlow/          # Report flow components
│   │   │   ├── ReportButton.tsx
│   │   │   ├── AnimalTypeSelector.tsx
│   │   │   ├── SeveritySelector.tsx
│   │   │   ├── PhotoUpload.tsx
│   │   │   └── DescriptionField.tsx
│   │   └── Map/                 # Map components
│   │       └── AddressSearchBar.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   │   └── api.ts              # Axios client with JWT interceptor
│   ├── types/                   # TypeScript definitions
│   │   ├── report.ts
│   │   └── validation.ts
│   └── styles/                  # Additional styles
│
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── next.config.js
```

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with report button |
| `/report/start` | Step 1: Location selection |
| `/report/details` | Step 2: Animal details & photos |
| `/report/review` | Step 3: Review before submit |
| `/report/success` | Step 4: Confirmation & tracking |
| `/reports/[ticket_id]` | Report status tracking page |

## Authentication

Reports require user authentication. The API client automatically includes JWT token from localStorage:

```typescript
// Token from localStorage
const token = localStorage.getItem('authToken')

// Automatically added to all requests
Authorization: Bearer <token>

// 401 errors redirect to /login
```

## Form Validation

Using zod for type-safe validation:

```typescript
// Example from components
const reportSchema = z.object({
  location: locationSchema,
  animal: animalDetailsSchema,
  severity: z.enum(['critical', 'moderate', 'minor']),
  description: z.string().min(20),
})
```

## Color Palette

- **Primary**: #FF6B35 (Orange) - Main actions
- **Success**: #2ECC71 (Green) - Positive feedback
- **Critical**: #E74C3C (Red) - High urgency
- **Moderate**: #F39C12 (Orange) - Medium urgency
- **Minor**: #3498DB (Blue) - Low urgency

## Accessibility

- ✓ WCAG 2.1 AA compliant
- ✓ 44x44px minimum touch targets
- ✓ 4.5:1 color contrast ratio
- ✓ Keyboard navigation support
- ✓ Screen reader friendly
- ✓ Mobile viewport meta tag

## API Integration

The app expects these API endpoints:

```
POST /api/reports              # Submit report
GET  /api/reports/:ticketId    # Get report status
POST /api/upload               # Upload photos
GET  /api/geocode              # Reverse geocode coordinates
```

See `API_CONTRACTS.md` for full specification.

## Development Tips

- Use `npm run dev` for hot reload
- Check TypeScript errors: `npm run type-check`
- Lint code: `npm run lint`
- Format code: `npm run format`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## License

© 2024 One Tap Emergency Report

## Support

For issues or questions:
- Emergency: 1-800-ANIMAL-1
- Technical: support@onetap.local
