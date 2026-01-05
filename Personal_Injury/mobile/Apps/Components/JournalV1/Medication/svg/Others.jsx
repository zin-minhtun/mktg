import React from "react";
import Svg, { Rect, Path, ClipPath, Defs } from "react-native-svg";

const Others = () => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="54"
            height="54"
            viewBox="0 0 86 86"
            fill="none"
        >
            {/* Rounded Rectangle Background */}
            <Rect width="86" height="86" rx="43" fill="#EDECF4" />

            {/* Plus Icon */}
            <Defs>
                <ClipPath id="clip0_6057_39819">
                    <Rect width="54" height="54" fill="white" transform="translate(16 16)" />
                </ClipPath>
            </Defs>
            <Path
                d="M56.5 45.25H45.25V56.5C45.25 57.7375 44.2375 58.75 43 58.75C41.7625 58.75 40.75 57.7375 40.75 56.5V45.25H29.5C28.2625 45.25 27.25 44.2375 27.25 43C27.25 41.7625 28.2625 40.75 29.5 40.75H40.75V29.5C40.75 28.2625 41.7625 27.25 43 27.25C44.2375 27.25 45.25 28.2625 45.25 29.5V40.75H56.5C57.7375 40.75 58.75 41.7625 58.75 43C58.75 44.2375 57.7375 45.25 56.5 45.25Z"
                fill="#939598"
                clipPath="url(#clip0_6057_39819)"
            />
        </Svg>
    );
};

export default Others;
