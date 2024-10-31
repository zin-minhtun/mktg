import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CameraFillIcon(props) {
	return (
		<Svg
			width={40}
			height={40}
			viewBox="0 0 40 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.09 13.335A3.09 3.09 0 005 16.425v10.91c0 2.828 0 4.242.879 5.121.878.879 2.293.879 5.121.879h18c2.828 0 4.243 0 5.121-.879.879-.879.879-2.293.879-5.121v-10.91a3.09 3.09 0 00-3.09-3.09 3.09 3.09 0 01-2.764-1.709L27.772 8.88c-.538-1.076-.807-1.614-1.29-1.912-.483-.299-1.085-.299-2.287-.299h-8.39c-1.202 0-1.804 0-2.287.299-.483.298-.752.836-1.29 1.912l-1.374 2.747a3.09 3.09 0 01-2.764 1.709zm16.577 8.333a4.667 4.667 0 11-9.334 0 4.667 4.667 0 019.334 0zm2 0a6.667 6.667 0 11-13.334 0 6.667 6.667 0 0113.334 0z"
				fill="#939598"
			/>
		</Svg>
	);
}

export default CameraFillIcon;
