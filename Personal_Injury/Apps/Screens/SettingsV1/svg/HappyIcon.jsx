import * as React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";

function HappyIcon() {
	return (
		<Svg
			width={24}
			height={25}
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Circle
				cx={12}
				cy={12.5}
				r={10}
				stroke="#939598"
				strokeWidth={2}
				strokeLinecap="round"
			/>
			<Path
				d="M9.402 14a3 3 0 005.196 0"
				stroke="#939598"
				strokeWidth={2}
				strokeLinecap="round"
			/>
			<Rect
				x={6.875}
				y={8.375}
				width={3.25}
				height={2.25}
				rx={1.125}
				fill="#939598"
				stroke="#939598"
				strokeWidth={0.25}
				strokeLinecap="round"
			/>
			<Rect
				x={13.875}
				y={8.375}
				width={3.25}
				height={2.25}
				rx={1.125}
				fill="#939598"
				stroke="#939598"
				strokeWidth={0.25}
				strokeLinecap="round"
			/>
		</Svg>
	);
}

export default HappyIcon;
