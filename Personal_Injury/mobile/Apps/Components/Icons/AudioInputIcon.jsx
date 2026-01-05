import Svg, { Rect, Path } from "react-native-svg";

const AudioInputIcon = () => {
	return (
		<Svg width="22" height="22" viewBox="0 0 18 18" fill="none">
			<Rect x="6" y="1.5" width="6" height="9.75" rx="3" fill="white" />
			<Path
				d="M3.5 8.25C3.5 9.70869 4.07946 11.1076 5.11091 12.1391C6.14236 13.1705 7.54131 13.75 9 13.75C10.4587 13.75 11.8576 13.1705 12.8891 12.1391C13.9205 11.1076 14.5 9.70869 14.5 8.25"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M9 15.75V14.25"
				stroke="white"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
};

export default AudioInputIcon;
