import * as React from "react";
import Svg, { Path } from "react-native-svg";

function FavoriteFillIcon() {
	return (
		<Svg
			width={24}
			height={25}
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M4.45 14.408l6.953 6.531c.24.225.36.338.5.366a.5.5 0 00.193 0c.142-.028.261-.14.5-.366l6.953-6.53a5.203 5.203 0 00.549-6.983l-.31-.399c-1.968-2.536-5.918-2.111-7.301.787a.54.54 0 01-.974 0C10.13 4.916 6.18 4.49 4.212 7.027l-.31.4a5.203 5.203 0 00.549 6.981z"
				fill="#939598"
				stroke="#939598"
				strokeWidth={2}
			/>
		</Svg>
	);
}

export default FavoriteFillIcon;
