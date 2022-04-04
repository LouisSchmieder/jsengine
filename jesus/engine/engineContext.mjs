import {http} from "../util/http.mjs";
import {EngineProgram} from "./engineProgram.mjs";
import {EngineBuffer} from "./engineBuffer.mjs";

export class EngineContext {

	#gl
	#shaders
	#draw
	#size
	program
	vao
	#vertexAttribute

	vertexBufferArray = [
		0, 0,
		0, 0.5,
		0.7, 0
	]

	vertexBufferSettings = {}

	constructor(ctx = new WebGL2RenderingContext(), draw, size) {
		this.#gl = ctx
		this.#shaders = []
		this.#draw = draw
		this.#size = size
		this.vertexBufferSettings = {
			size: 2,
			type: this.#gl.FLOAT,
			normalize: false,
			stride: 0,
			offset: 0
		}
	}

	init() {
		if (!this.#gl) {
			return false
		}
		let rawShaders = this.#loadShaders()
		rawShaders.forEach(val => {
			let shader = this.createShader(val.type, val.src)
			if (shader) {
				this.#shaders[val.name] = shader
			}
		})

		this.program = this.createProgram()

		this.#vertexAttribute = this.program.addAttribute('a_Position')
		let buffer = new EngineBuffer(this.#gl)
		buffer.bindBuffer(this.#gl.ARRAY_BUFFER, new Float32Array(this.vertexBufferArray), this.#gl.STATIC_DRAW)
		this.vao = buffer.createVAO()
		this.#vertexAttribute.buffer = buffer
		this.#vertexAttribute.enable(this.vertexBufferSettings)

		return true
	}

	loop() {
		console.log(this.#size)
		this.#gl.viewport(0, 0, this.#size.width, this.#size.height)

		this.program.use()
		this.#gl.bindVertexArray(this.vao)

		window.requestAnimationFrame(this.#draw)
	}

	getGL() {
		return this.#gl
	}

	createProgram() {
		let program = this.#gl.createProgram()
		for (let name in this.#shaders) {
			this.#gl.attachShader(program, this.#shaders[name])
		}
		this.#gl.linkProgram(program)

		let success = this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS)
		if (success) {
			return new EngineProgram(program, this.#gl)
		}

		console.error(this.#gl.getProgramInfoLog(program))
		this.#gl.deleteProgram(program)
	}

	#loadShaders() {
		let map = JSON.parse(http.get('jesus/shaders/shaderMap.json'))
		let data = []

		for (let e in map) {
			let dataEntry = {}
			dataEntry.type = this.#gl[map[e].type]
			dataEntry.src = http.get(`jesus/shaders/${map[e].src}`)
			dataEntry.name = map[e].name
			data.push(dataEntry)
		}
		return data
	}

	createShader(type, src) {
		let shader = this.#gl.createShader(type)
		this.#gl.shaderSource(shader, src)
		this.#gl.compileShader(shader)
		let success = this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)
		if (success) {
			return shader
		}

		console.error(this.#gl.getShaderInfoLog(shader))
		this.#gl.deleteShader(shader)
	}

	delete() {
		this.#deleteShaders()
		this.#deleteProgram()
	}

	#deleteProgram() {
		this.program.delete()
	}

	#deleteShaders() {
		for (let name in this.#shaders) {
			this.#gl.deleteShader(this.#shaders[name])
		}
	}

}