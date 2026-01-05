import * as React from "react";
import Svg, { Path } from "react-native-svg";

function PaperFill() {
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
				d="M2 21.5v-14c0-1.886 0-2.828.586-3.414C3.172 3.5 4.114 3.5 6 3.5h10c.832 0 1.478 0 2.004.027A4.5 4.5 0 0014 8v3.5l-.099 9.967L11 20.5l-3 1-3-1-3 1zm19-10h-5V8a2.5 2.5 0 015 0v3.5zm-17-4a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H5a1 1 0 01-1-1z"
				fill="#939598"
			/>
		</Svg>
	);
}

export default PaperFill;
