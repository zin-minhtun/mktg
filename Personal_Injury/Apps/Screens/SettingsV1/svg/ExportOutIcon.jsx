import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ExportOutIcon() {
  return (
    <Svg
      width={24}
      height={25}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M21 3.5v-1h1v1h-1zm-9.293 10.707a1 1 0 01-1.414-1.414l1.414 1.414zM20 11.5v-8h2v8h-2zm1-7h-8v-2h8v2zm.707-.293l-10 10-1.414-1.414 10-10 1.414 1.414z"
        fill="#939598"
      />
      <Path
        d="M20 15.5v0c0 1.87 0 2.804-.402 3.5a3 3 0 01-1.098 1.098c-.696.402-1.63.402-3.5.402h-5c-2.828 0-4.243 0-5.121-.879C4 18.743 4 17.328 4 14.5v-5c0-1.87 0-2.804.402-3.5A3 3 0 015.5 4.902C6.196 4.5 7.13 4.5 9 4.5v0"
        stroke="#939598"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default ExportOutIcon
