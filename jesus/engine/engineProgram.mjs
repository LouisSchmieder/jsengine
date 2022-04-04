import {Attribute} from "./attribute.mjs";

export class EngineProgram {

	#program
	#gl
	attributes = []

	constructor(program, gl) {
		this.#program = program
		this.#gl = gl
	}

	addAttribute(location) {
		this.attributes[location] = new Attribute(this.#program, location, this.#gl)
		return this.attributes[location]
	}

	use() {
		this.#gl.useProgram(this.#program)
	}

	delete() {
		this.#gl.deleteProgram(this.#program)
	}

}