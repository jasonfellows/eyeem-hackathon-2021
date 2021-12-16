import { sdBox, opSmoothUnion } from './modules/sdf'
import { map } from './modules/num'
import { length, rot, sub, vec2, add, mulN, addN, subN } from './modules/vec2'
import { sort } from './modules/sort'

const chars = window.fxhash + "   ......------"

export const settings = {
	// renderer : 'canvas',
	// Settings available only
	// for the 'canvas' renderer
	// canvasOffset : {
	// 	x : 'auto',
	// 	y : 20
	// },
	// canvasSize : {
	// 	width : 575,
	// 	height : 575
	// },
	// Universal settings
	// cols : 67,
	// rows : 33,
	backgroundColor : 'black',
	// color : 'black',
	fps: 30,
}

function transform(p, trans, rot) {
	const s = Math.sin(-rot)
	const c = Math.cos(-rot)
	const dx = p.x - trans.x
	const dy = p.y - trans.y
	return {
		x : dx * c - dy * s,
		y : dx * s + dy * c,
	}
}

const colors = ['#ffba1e', '#ff6e4f', '#e0618d', '#b066d9', '#6b61e4', '#345de7']

export function box(p, size) {
	const dx = Math.max(Math.abs(p.x) - size.x, 0)
	const dy = Math.max(Math.abs(p.y) - size.y, 0)
	// return the distance from the point
	return Math.sqrt(dx * dx + dy * dy)
}

export function main(coord, context, cursor, buffer) {
	const t  = context.time * 0.0002
	const m = Math.min(context.cols, context.rows)
	const a = context.metrics.aspect

	const center = vec2(
		2.0 * (coord.x - context.cols / 2) / m * a,
		2.0 * (coord.y - context.rows / 2) / m
	)

	const st = center

	let ani = Math.abs(Math.sin(context.time * 0.0013)) * 0.3
	const size = map(Math.sin(context.time * 0.0023), -1, 0.3, 0.3, 0.4)
	const tWeight = 0.29 * size * 2.59

	const horizontalPoint = vec2(
		center.x,
		center.y + tWeight
	)

	const verticalPoint = vec2(
		center.x,
		center.y - (size / 2)
	)

	const vertical = box(verticalPoint, { x: size - tWeight, y: size })
	const horizontal = box(horizontalPoint, { x: size, y: size - tWeight })

	let tShape = opSmoothUnion(horizontal, vertical, 0)

	for (let i=0;i<3;i++) {
		const o = i * 3
		const v = vec2(Math.sin(t * 3 + o), Math.cos(t * 2 + o))
		add(st, v, st)

		const ang = -t + length(subN(st, 0.5))
		rot(st, ang, st)
	}

	mulN(st, 0.6, st)

	const s = Math.cos(t) * 2.0
	let c = Math.sin(st.x * 3.0 + s) + Math.sin(st.y * 21)
	c = map(Math.sin(c * 0.5), -1, 1, 0, 1)

	const index = Math.floor(c * (chars.length - 1))
	const color = Math.floor(c * (colors.length - 1))

	return {
		// backgroundColor: tShape == 0 ? colors[0] : 'black',
		char: tShape == 0 ? '$' : chars[index],
		color: tShape == 0 ? '#b2f7e9' : colors[color]
	}
}

// import { drawInfo } from './modules/drawbox.js'

// // This function is called after the main loop and is useful
// // to manipulate the buffer; in this case with a window overlay.
// export function post(context, cursor, buffer) {
// 	// An extra object can be passed to drawInfo to alter the default style
// 	drawInfo(context, cursor, buffer, {
// 		color : 'white', backgroundColor : 'royalblue', shadowStyle : 'gray'
// 	})
// }

