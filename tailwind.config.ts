import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: ['class'],
	content: [
	'./pages/**/*.{js,ts,jsx,tsx,mdx}',
	'./components/**/*.{js,ts,jsx,tsx,mdx}',
	'./app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
	extend: {
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
		colors: {
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			primary: {
				'25': '#var(--primary-450-hex)',
				'50': 'rgb(var(--primary-50))',
				'100': 'rgb(var(--primary-100))',
				'200': 'rgb(var(--primary-200))',
				'300': 'rgb(var(--primary-300))',
				'400': 'rgb(var(--primary-400))',
				'500': 'rgb(var(--primary-500))',
				'600': 'rgb(var(--primary-600))',
				'700': 'rgb(var(--primary-700))',
				'800': 'rgb(var(--primary-800))',
				'900': 'rgb(var(--primary-900))',
				'950': 'rgb(var(--primary-950))',
				DEFAULT: 'rgb(var(--primary-600))',
				foreground: 'hsl(var(--primary-foreground))'
			},
			secondary: {
				'50': 'rgb(var(--secondary-50))',
				'100': 'rgb(var(--secondary-100))',
				'200': 'rgb(var(--secondary-200))',
				'300': 'rgb(var(--secondary-300))',
				'400': 'rgb(var(--secondary-400))',
				'500': 'rgb(var(--secondary-500))',
				'600': 'rgb(var(--secondary-600))',
				'700': 'rgb(var(--secondary-700))',
				'800': 'rgb(var(--secondary-800))',
				'900': 'rgb(var(--secondary-900))',
				'950': 'rgb(var(--secondary-950))',
				DEFAULT: 'rgb(var(--secondary-600))',
				foreground: 'hsl(var(--secondary-foreground))'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			accent: {
				DEFAULT: 'hsl(var(--accent))',
				foreground: 'hsl(var(--accent-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
			}
		},

		keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        heartbeat: 'heartbeat 10s ease-in-out infinite',
      },
    
	}
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
