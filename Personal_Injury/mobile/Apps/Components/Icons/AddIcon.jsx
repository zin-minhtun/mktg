import Svg, { Rect, Path, G, Defs, ClipPath } from "react-native-svg";

const AddIcon = () => {
	return (
		<Svg
			width="42"
			height="42"
			viewBox="0 0 42 42"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<G clip-path="url(#clip0_3727_9317)">
				<Path
					d="M31.5 22.75H22.75V31.5C22.75 32.4625 21.9625 33.25 21 33.25C20.0375 33.25 19.25 32.4625 19.25 31.5V22.75H10.5C9.5375 22.75 8.75 21.9625 8.75 21C8.75 20.0375 9.5375 19.25 10.5 19.25H19.25V10.5C19.25 9.5375 20.0375 8.75 21 8.75C21.9625 8.75 22.75 9.5375 22.75 10.5V19.25H31.5C32.4625 19.25 33.25 20.0375 33.25 21C33.25 21.9625 32.4625 22.75 31.5 22.75Z"
					fill="white"
				/>
			</G>
			<Defs>
				<ClipPath id="clip0_3727_9317">
					<Rect width="42" height="42" fill="white" />
				</ClipPath>
			</Defs>
		</Svg>
	);
};

export default AddIcon;
