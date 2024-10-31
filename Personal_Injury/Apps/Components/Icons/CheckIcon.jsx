import Svg, { Path } from "react-native-svg";

const CheckIcon = ({ isActive }) => {
	return (
		<Svg
			width="18"
			height="18"
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M13 1L7.04591 10.5265C6.34446 11.6489 5.99374 12.21 5.46739 12.2324C4.94105 12.2547 4.544 11.7253 3.74991 10.6665L1 7"
				stroke={isActive ? "white" : "#939598"}
				stroke-width="1.8"
				stroke-linecap="round"
			/>
		</Svg>
	);
};

export default CheckIcon;
