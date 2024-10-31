/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./App.{js,jsx,ts,tsx}", "./Apps/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				raleway: ["Raleway", "sans-serif"],
				ralewaySemiBold: ["RalewaySemiBold", "sans-serif"],
				ralewayBold: ["RalewayBold", "sans-serif"],
			},

			// Custom color
			colors: {
				primaryLightBlue: "#EBFCFF",
				primaryBlue: "#00B8DF",
				primaryDarkBlue: "#003361",
			},
		},
	},
	plugins: [],
};
