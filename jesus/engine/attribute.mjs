export class Attribute {

	#program
	#location
	#gl
	buffer

	constructor(program, location, gl) {
		this.#program = program
		this.#gl = gl
		this.#location = this.#gl.getAttribLocation(this.#program, location)
		console.log(this)
	}

	enable({size, type, normalize, stride, offset}) {
		this.#gl.enableVertexAttribArray(this.#location)
		this.#gl.vertexAttribPointer(this.#location, size, type, normalize, stride, offset)
	}

}