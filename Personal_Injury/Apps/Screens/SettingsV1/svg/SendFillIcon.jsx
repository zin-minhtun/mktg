import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SendFillIcon() {
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
				d="M9.94 13.148L7.691 12.4c-2.353-.784-3.53-1.176-3.53-1.897 0-.721 1.177-1.113 3.53-1.898l8.513-2.837c1.656-.552 2.484-.828 2.921-.391.437.437.161 1.265-.39 2.92l-2.839 8.514c-.784 2.353-1.176 3.53-1.897 3.53-.72 0-1.113-1.177-1.897-3.53l-.75-2.247 4.354-4.354a1 1 0 00-1.414-1.414l-4.354 4.353z"
				fill="#939598"
			/>
		</Svg>
	);
}

export default SendFillIcon;
