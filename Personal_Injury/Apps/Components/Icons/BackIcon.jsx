import Svg, { Path } from "react-native-svg";

const BackIcon = ({ isActive }) => {
	return (
		<Svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M15.09 4.07992L8.56996 10.5999C7.79996 11.3699 7.79996 12.6299 8.56996 13.3999L15.09 19.9199"
				stroke="#221F20"
				stroke-width="1.5"
				stroke-miterlimit="10"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</Svg>
	);
};

export default BackIcon;
