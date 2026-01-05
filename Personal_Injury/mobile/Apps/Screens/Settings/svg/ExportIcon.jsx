import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ExportIcon() {
	return (
		<Svg
			width={24}
			height={25}
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path d="M7 10.5l5-5m0 0l5 5m-5-5V12" stroke="#939598" strokeWidth={2} />
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11 13.5V17a1 1 0 102 0v-3.5h5a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h5z"
				fill="#939598"
			/>
		</Svg>
	);
}

export default ExportIcon;
