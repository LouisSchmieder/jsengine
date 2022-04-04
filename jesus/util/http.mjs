class Http {

	constructor() {
	}

	static #xml(method, path) {
		let req = new XMLHttpRequest()
		req.withCredentials = true
		req.open(method, path, false)
		req.send();
		return req;
	}

	get(/*string*/path) {
		let req = Http.#xml('GET', path)

		if (req.readyState === 4 && req.status === 200) {
			return req.responseText
		}
		return ""
	}

}

export const http = new Http()