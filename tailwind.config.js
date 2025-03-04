/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            keyframes: {
                slideDownAndFade: {
                    from: { opacity: 0, transform: "translateY(-5px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                slideUpAndFade: {
                    from: { opacity: 0, transform: "translateY(5px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                },
                fadeIn: {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
            },
            animation: {
                slideDownAndFade: "slideDownAndFade 0.2s ease-out",
                slideUpAndFade: "slideUpAndFade 0.2s ease-out",
                fadeIn: "fadeIn 0.3s ease-in-out",
            },
        },
    },
    plugins: [],
    safelist: [
        "data-[state=open]:animate-slideDownAndFade",
        "data-[state=closed]:animate-slideUpAndFade",
        "data-[side=top]:animate-slideUpAndFade",
        "data-[side=bottom]:animate-slideDownAndFade",
        "data-[side=left]:animate-slideLeftAndFade",
        "data-[side=right]:animate-slideRightAndFade",
    ],
};
