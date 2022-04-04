export class EngineBuffer {

	#buffer
	#gl

	constructor(gl) {
		this.#gl = gl
		this.#buffer = this.#gl.createBuffer()
	}

	bindBuffer(type, data, usage) {
		this.#gl.bindBuffer(type, this.#buffer)
		this.#gl.bufferData(type, data, usage)
	}

	createVAO() {
		let vao = this.#gl.createVertexArray()
		this.#gl.bindVertexArray(vao)
		return vao
	}

}