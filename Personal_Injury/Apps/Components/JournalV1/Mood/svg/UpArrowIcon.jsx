import * as React from "react";
import Svg, { G, Mask, Path, Defs, ClipPath } from "react-native-svg";

const UpArrowIcon = () => {
	return (
		<Svg
			width={44}
			height={44}
			viewBox="0 0 44 44"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<G clipPath="url(#clip0_2779_21141)">
				<Mask
					id="a"
					style={{
						maskType: "luminance",
					}}
					maskUnits="userSpaceOnUse"
					x={0}
					y={0}
					width={44}
					height={44}
				>
					<Path
						d="M22 2c11.046 0 20 8.954 20 20s-8.954 20-20 20S2 33.046 2 22 10.954 2 22 2z"
						fill="#fff"
						stroke="#fff"
						strokeWidth={4}
						strokeLinejoin="round"
					/>
					<Path
						d="M31 25l-9-9-9 9"
						stroke="#000"
						strokeWidth={4}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</Mask>
				<G mask="url(#a)">
					<Path d="M-2 46h48V-2H-2v48z" fill="#00B8DF" />
				</G>
			</G>
			<Defs>
				<ClipPath id="clip0_2779_21141">
					<Path
						fill="#fff"
						transform="matrix(1 0 0 -1 0 44)"
						d="M0 0H44V44H0z"
					/>
				</ClipPath>
			</Defs>
		</Svg>
	);
};

export default UpArrowIcon;
