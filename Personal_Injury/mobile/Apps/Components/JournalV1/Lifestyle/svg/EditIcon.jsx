import * as React from "react";
import Svg, { Path } from "react-native-svg";

const EditIcon = () => {
	return (
		<Svg
			width={18}
			height={19}
			viewBox="0 0 18 19"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M8.58 2.34H2.685A1.685 1.685 0 001 4.024v11.792a1.685 1.685 0 001.685 1.685h11.791a1.684 1.684 0 001.685-1.685V9.92"
				stroke="#003361"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M13.95 2.023a1.787 1.787 0 112.527 2.527l-7.592 7.592c-.2.2-.447.346-.718.426l-2.42.707a.422.422 0 01-.522-.522l.707-2.42c.08-.271.227-.518.427-.717l7.59-7.593z"
				stroke="#003361"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	);
};

export default EditIcon;
