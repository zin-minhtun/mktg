import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ChatFillIcon() {
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
				d="M20 11.5c0-2.809 0-4.213-.674-5.222a4.002 4.002 0 00-1.104-1.104C17.213 4.5 15.81 4.5 13 4.5h-2c-2.809 0-4.213 0-5.222.674a4 4 0 00-1.104 1.104C4 7.287 4 8.69 4 11.5c0 2.809 0 4.213.674 5.222.292.437.667.812 1.104 1.104.881.589 2.064.663 4.222.673v.001l1.106 2.211a1 1 0 001.788 0L14 18.5v-.001c2.158-.01 3.34-.084 4.222-.673a4.003 4.003 0 001.104-1.104C20 15.713 20 14.31 20 11.5zm-12 1a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"
				fill="#939598"
			/>
		</Svg>
	);
}

export default ChatFillIcon;
