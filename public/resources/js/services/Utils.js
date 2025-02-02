const Utils = {
    parseRequestURL: () => {

        let url = window.location.pathname
        let r = url.split("/")
        let request = {
            resourse : null,
            id : null,
            verb : null
        }
        request.resource = r[1]
        request.id = r[2]
        request.verb = r[3]

        return request
    }

    ,sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    ,removeElemFromArray(arr, elem) {
        const index = arr.indexOf(elem)
        arr.splice(index, 1)
    }
}

export default Utils