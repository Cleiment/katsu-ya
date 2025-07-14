/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,jsx,ts,tsx}'],
    safelist: [
        'max-w-md',
        'max-w-xl',
        'max-w-2xl',
        'max-w-3xl',
        'max-w-4xl',
        'max-w-6xl',
        'text-amber-800',
        'text-amber-700',
        'bg-amber-50',
        'bg-amber-100',
        'text-gray-900'
    ],
    theme: {
        extend: {
            colors: {
                'yellow-pastel': '#fed980',
                'orange-pastel': '#ff9b81',
                'red-pastel': '#ff81a6',
                'blue-pastel': '#81a6ff',
                brown: '#3c2a21',
                'dark-brown': '#211b0b',
                'light-brown': '#A18050'
            },
            transitionProperty: {
                margin: 'margin'
            }
        }
    },
    plugins: []
}
