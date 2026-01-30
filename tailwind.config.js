/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['Space Grotesk', 'sans-serif'],
                body: ['Noto Sans', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: '#d6582e', // New primary copper
                'background-light': '#f8f6f6',
                'background-dark': '#201613',
                'surface-dark': '#2a1e1a',
                'text-muted': '#c3a297',
                copper: {
                    light: '#FFCAA6',
                    DEFAULT: '#D6582C',
                    dark: '#803015',
                },
                dark: {
                    DEFAULT: '#050510',
                    card: '#0F1020',
                }
            },
            backgroundImage: {
                'cosmic-gradient': 'linear-gradient(180deg, rgba(32,22,19,1) 0%, rgba(45,30,25,1) 50%, rgba(32,22,19,1) 100%)',
                'glow': 'radial-gradient(circle at center, rgba(214, 88, 46, 0.15) 0%, rgba(32, 22, 19, 0) 70%)',
                'text-gradient-copper': 'linear-gradient(90deg, #FFFFFF 0%, #E8A87C 50%, #D6582E 100%)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'music-bar-1': 'musicBar 1s ease-in-out infinite',
                'music-bar-2': 'musicBar 1s ease-in-out infinite 0.2s',
                'music-bar-3': 'musicBar 1s ease-in-out infinite 0.4s',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                musicBar: {
                    '0%, 100%': { height: '4px' },
                    '50%': { height: '12px' },
                }
            }
        },
    },
    plugins: [],
}
