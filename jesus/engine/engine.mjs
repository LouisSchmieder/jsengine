import { Size } from "../util/storeUtil.mjs";
import {EngineContext} from "./engineContext.mjs";

export var engine;

export function initEngine(query) {
	engine = new Engine(document.querySelector(query))
}

let lastTimestamp;

function renderLoop(timestamp) {
	let delta = 0;
	if (lastTimestamp !== 0) {
		delta = timestamp - lastTimestamp
		lastTimestamp = timestamp
	}

	engine.callGameLoop(delta)


	let gl = engine.getContext().getGL()
	gl.clearColor(0, 0, 0, 1)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	gl.drawArrays(gl.TRIANGLES, 0, 3)

	window.requestAnimationFrame(renderLoop)
}

class Engine {

	#canvas
	#context
	#size

	gameLoop

	constructor(canvas) {
		window.addEventListener('resize', () => {
			this.updateSize()
		})

		this.#canvas = canvas
		this.updateSize()

		if (!this.#context.init()) {
			window.alert('Your browser does not support WebGL2')
			// End stuff here
		}

		this.#context.loop()
	}

	getContext() {
		return this.#context
	}

	maximize() {
		this.#canvas.width = this.#size.width
		this.#canvas.height = this.#size.height
	}

	getWindowSize() {
		return new Size(window.innerHeight, window.innerWidth)
	}

	updateSize() {
		this.#size = this.getWindowSize()
		this.maximize()
		if (this.#context)
			this.#context.delete()
		this.#context = new EngineContext(this.#canvas.getContext('webgl2'), renderLoop, this.#size)
		this.#context.init()
		this.#context.loop()

	}

	callGameLoop(delta) {
		if (this.gameLoop) {
			this.gameLoop(delta)
		}
	}

}