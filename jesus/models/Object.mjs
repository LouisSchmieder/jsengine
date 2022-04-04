export class RawObject {

	#vertices
	#indices
	#position
	#rotation
	#scale

	constructor(vertices, indices, position, rotation, scale) {
		this.#vertices = vertices
		this.#indices = indices
		this.#position = position
		this.#rotation = rotation
		this.#scale = scale
	}

}