import * as React from "react";
import Svg, { G, Rect, Path, Defs, Ellipse } from "react-native-svg";

const AnxiousEmoji = () => {
	return (
		<Svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} fill="none">
			<G filter="url(#a)">
				<Rect width={40} height={40} x={10} y={10} fill="#EAC83D" rx={20} />
			</G>
			<Path
				fill="#F6FAFD"
				fillOpacity={0.7}
				d="M46.148 19.101c.293-.293.2-.86-.208-1.268-.408-.407-.975-.5-1.268-.207-.293.293-.2.86.208 1.268.407.407.975.5 1.268.207ZM40.094 14.64c.147-.147.1-.43-.103-.634-.204-.204-.488-.25-.635-.104-.146.147-.1.431.104.635.204.204.488.25.634.103ZM44.16 18.021c.586-.586.399-1.722-.417-2.537-.816-.815-1.952-1.001-2.537-.415-.586.586-.4 1.722.417 2.537.815.815 1.951 1 2.537.415Z"
			/>
			<Path
				fill="#864E20"
				d="M24.5 40.52c2.003-1.506 3.66-1.449 6-1.508 2.34.06 3.997.002 6 1.51.662.547 1.5.558 1.5.363C38 38.483 34.25 37 30.5 37S23 38.483 23 40.885c0 .195.83.184 1.5-.364Z"
			/>
			<Ellipse cx={22.5} cy={27} fill="#864E20" rx={2.5} ry={3} />
			<Ellipse cx={37.5} cy={27} fill="#864E20" rx={2.5} ry={3} />
			<Path
				fill="#864E20"
				d="M42.375 23.717h-.005a3.032 3.032 0 0 1-.447-.006 4.407 4.407 0 0 1-.873-.163c-.142-.043-.285-.086-.424-.138-.14-.052-.272-.123-.408-.185a3.662 3.662 0 0 1-.391-.218c-.124-.084-.255-.158-.373-.25a4.838 4.838 0 0 1-1.217-1.31 3.737 3.737 0 0 1-.512-1.246.174.174 0 0 1 .087-.18.173.173 0 0 1 .199.023c.324.283.626.545.933.8.406.336.8.66 1.218.962.1.083.209.15.312.226l.155.116c.05.04.108.07.16.108.1.073.209.142.31.22a.052.052 0 0 1 .008.008 9.004 9.004 0 0 1 .33.221c.216.162.45.291.676.46.115.081.234.16.353.242a.173.173 0 0 1-.091.31ZM21.717 20.16v.004c.009.149.007.298-.006.447-.025.296-.08.588-.163.873-.043.142-.086.285-.138.424-.052.14-.123.272-.185.408a3.652 3.652 0 0 1-.218.391c-.084.124-.158.255-.251.373a4.837 4.837 0 0 1-1.31 1.217c-.38.245-.802.418-1.245.512a.173.173 0 0 1-.157-.286c.283-.324.545-.626.8-.933.336-.406.66-.8.962-1.218.083-.1.149-.209.226-.312l.116-.155c.04-.05.07-.108.108-.16.073-.1.142-.209.22-.31a.052.052 0 0 1 .008-.008 9.004 9.004 0 0 1 .221-.33c.162-.216.291-.45.46-.676.081-.115.159-.234.242-.353a.173.173 0 0 1 .31.091Z"
			/>
			<G filter="url(#b)">
				<Path
					fill="#1EBACA"
					d="M13 26.5c0-3.727 6.617-3.565 6.549.162A1.153 1.153 0 0 1 19.5 27c-.447 1.342-1.745 2-3.5 2s-3-1-3-2.5Z"
				/>
			</G>
			<Path
				stroke="#25A0AA"
				strokeOpacity={0.25}
				d="M13.5 26.5c0-.763.33-1.305.827-1.667.513-.373 1.224-.566 1.96-.547.737.018 1.447.245 1.958.647.497.391.818.956.804 1.72a.689.689 0 0 1-.023.189C18.675 27.895 17.645 28.5 16 28.5c-.786 0-1.416-.224-1.84-.573a1.787 1.787 0 0 1-.66-1.427Z"
			/>
			<Defs></Defs>
		</Svg>
	);
};

export default AnxiousEmoji;