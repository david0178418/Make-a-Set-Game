import { Box } from '@mui/material';
import { Card, ColorValues, CountValues, Enum, FillValues, ShapeValues } from '@/types';

interface Props {
	flipped?: boolean;
	card?: Card;
	selected?: boolean;
	onClick?(): void;
}

export default
function PlayingCard(props: Props) {
	const {
		onClick,
		selected,
		// TODO: Integrate "flipping" animation into this component.
		flipped: flippedOverride,
		// TODO: Rename prop when batch of work is done.
		card: face,
	} = props;
	const flipped = flippedOverride || !face;

	return (
		<Box
			width="108px"
			maxWidth="100%"
			border="2px solid black"
			padding="5px"
			display="flex"
			borderRadius="10px"
			boxShadow="3px 3px 4px #000"
			onClick={onClick}
			bgcolor={selected ? 'red' : 'white'}
			sx={{
				cursor: onClick && 'pointer',
				aspectRatio: '.65',
			}}
		>
			<Box
				flex="1"
				bgcolor="white"
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				sx={{
					background: flipped ?
						`repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px,#465298 20px)` :
						''
				}}
			>
				{!flipped && Array(CountValues[face.count]).fill(0).map((_, i) => (
					<Shape
						key={i}
						color={ColorValues[face.color]}
						fill={FillValues[face.fill]}
						type={ShapeValues[face.shape]}
					/>
				))}
			</Box>
		</Box>
	);
}

interface ShapeProps {
	color: string;
	fill: Enum<typeof FillValues>;
	type: Enum<typeof ShapeValues>;
}

function Shape(props: ShapeProps) {
	const {
		color,
		fill,
		type,
	} = props;
	const fillColor = (fill === 'outline' ? 'none' : color);
	const opacity = fill === 'filled' ? '59' : '';

	return (
		<Box
			width="40%"
			textAlign="center"
			sx={{ aspectRatio: 1 }}
		>
			{type === 'triangle' && (
				<Triangle
					stroke={color}
					fill={fillColor+opacity}
				/>
			)}
			{type === 'circle' && (
				<Circle
					stroke={color}
					fill={fillColor+opacity}
				/>
			)}
			{type === 'square' && (
				<Square
					stroke={color}
					fill={fillColor+opacity}
				/>
			)}
		</Box>
	);
}

interface SvgShapeProps {
	stroke: string;
	fill: string;
}

function Triangle(props: SvgShapeProps) {
	const { fill, stroke } = props;
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<polygon
				points="50,15 90,85 10,85"
				fill={fill}
				stroke={stroke}
				strokeWidth={10}
			/>
		</svg>
	);
}

function Circle(props: SvgShapeProps) {
	const { fill, stroke } = props;
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<circle
				cx="50"
				cy="50"
				r="40"
				fill={fill}
				stroke={stroke}
				strokeWidth={10}
			/>
		</svg>
	);
}

function Square(props: SvgShapeProps) {
	const { fill, stroke } = props;
	return (
		<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
			<rect
				x="10"
				y="10"
				width="80"
				height="80"
				fill={fill}
				stroke={stroke}
				strokeWidth={10}
			/>
		</svg>
	);
}
