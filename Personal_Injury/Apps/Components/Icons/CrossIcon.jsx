import Svg, { Rect, Path } from "react-native-svg";

const CrossIcon = ({ isActive }) => {
	return (
		<Svg
			width="18"
			height="18"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M15.2806 14.2194C15.3503 14.289 15.4056 14.3718 15.4433 14.4628C15.481 14.5539 15.5004 14.6514 15.5004 14.75C15.5004 14.8485 15.481 14.9461 15.4433 15.0372C15.4056 15.1282 15.3503 15.2109 15.2806 15.2806C15.2109 15.3503 15.1282 15.4056 15.0372 15.4433C14.9461 15.481 14.8485 15.5004 14.75 15.5004C14.6514 15.5004 14.5539 15.481 14.4628 15.4433C14.3718 15.4056 14.289 15.3503 14.2194 15.2806L7.99999 9.0603L1.78061 15.2806C1.63988 15.4213 1.44901 15.5004 1.24999 15.5004C1.05097 15.5004 0.860095 15.4213 0.719365 15.2806C0.578634 15.1399 0.499573 14.949 0.499573 14.75C0.499573 14.551 0.578634 14.3601 0.719365 14.2194L6.93968 7.99999L0.719365 1.78061C0.578634 1.63988 0.499573 1.44901 0.499573 1.24999C0.499573 1.05097 0.578634 0.860095 0.719365 0.719365C0.860095 0.578634 1.05097 0.499573 1.24999 0.499573C1.44901 0.499573 1.63988 0.578634 1.78061 0.719365L7.99999 6.93968L14.2194 0.719365C14.3601 0.578634 14.551 0.499573 14.75 0.499573C14.949 0.499573 15.1399 0.578634 15.2806 0.719365C15.4213 0.860095 15.5004 1.05097 15.5004 1.24999C15.5004 1.44901 15.4213 1.63988 15.2806 1.78061L9.0603 7.99999L15.2806 14.2194Z"
				fill={isActive ? "#A22222" : "#939598"}
			/>
		</Svg>
	);
};

export default CrossIcon;
