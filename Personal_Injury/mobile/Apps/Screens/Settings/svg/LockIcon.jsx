import * as React from "react";
import Svg, { Path } from "react-native-svg";

function LockIcon() {
	return (
		<Svg
			width={24}
			height={25}
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				d="M16 8.5v-1a4 4 0 00-4-4v0a4 4 0 00-4 4v1"
				stroke="#939598"
				strokeWidth={2}
				strokeLinecap="round"
			/>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3.879 8.379C3 9.257 3 10.672 3 13.5v1c0 3.771 0 5.657 1.172 6.828C5.343 22.5 7.229 22.5 11 22.5h2c3.771 0 5.657 0 6.828-1.172C21 20.157 21 18.271 21 14.5v-1c0-2.828 0-4.243-.879-5.121C19.243 7.5 17.828 7.5 15 7.5H9c-2.828 0-4.243 0-5.121.879zM12 15.5a1 1 0 100-2 1 1 0 000 2zm3-1a3.001 3.001 0 01-2 2.83v2.17h-2v-2.17a3.001 3.001 0 114-2.83z"
				fill="#939598"
			/>
		</Svg>
	);
}

export default LockIcon;
