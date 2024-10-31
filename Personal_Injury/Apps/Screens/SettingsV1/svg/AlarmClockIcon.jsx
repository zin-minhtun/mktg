import * as React from "react"
import Svg, { Path } from "react-native-svg"

function AlarmClockIcon() {
  return (
    <Svg
      width={24}
      height={25}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M5 4.5l-2 2M19 4.5l2 2"
        stroke="#939598"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 20.5a8 8 0 100-16 8 8 0 000 16zm2.78-9.875a1 1 0 10-1.56-1.25l-1.428 1.784-2.237-1.491a1 1 0 10-1.11 1.664l2.81 1.873a1.25 1.25 0 001.67-.26l1.856-2.32z"
        fill="#939598"
      />
    </Svg>
  )
}

export default AlarmClockIcon
