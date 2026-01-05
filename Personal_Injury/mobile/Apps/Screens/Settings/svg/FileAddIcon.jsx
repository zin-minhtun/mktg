import * as React from "react";
import Svg, { Path } from "react-native-svg";

function FileAddIcon() {
	return (
		<Svg
			width={24}
			height={25}
			viewBox="0 0 24 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 2.5c1.5 0 2.7 0 3.677.074-.114.286-.177.599-.177.926V4H15a2.5 2.5 0 000 5h.5v.5A2.5 2.5 0 0020 11v3.5c0 3.771 0 5.657-1.172 6.828C17.657 22.5 15.771 22.5 12 22.5c-3.771 0-5.657 0-6.828-1.172C4 20.157 4 18.271 4 14.5v-4c0-3.771 0-5.657 1.172-6.828C6.343 2.5 8.229 2.5 12 2.5zm-4 9a1 1 0 100 2h4a1 1 0 100-2H8zm0 3a1 1 0 100 2h6a1 1 0 100-2H8zm0 3a1 1 0 100 2h4a1 1 0 100-2H8z"
				fill="#939598"
			/>
			<Path
				d="M18 3.5v6M21 6.5h-6"
				stroke="#939598"
				strokeWidth={2}
				strokeLinecap="round"
			/>
		</Svg>
	);
}

export default FileAddIcon;
