import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbf0',
          100: '#fff6e0',
          500: '#FF9F1C',
          600: '#e68a15',
          700: '#cc740e',
        },
        success: '#2ECC71',
        critical: '#E74C3C',
        moderate: '#F39C12',
        minor: '#3498DB',
        gray: {
          900: '#2C3E50',
          600: '#7F8C8D',
          200: '#ecf0f1',
          50: '#f9fafb',
        },
      },
      borderRadius: {
        lg: '12px',
      },
      spacing: {
        safe: 'max(1rem, env(safe-area-inset-bottom))',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
}
export default config
