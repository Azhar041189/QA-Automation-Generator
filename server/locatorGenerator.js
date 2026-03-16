function locator(el) {

    if (el.id) return `#${el.id}`

    if (el.name) return `[name="${el.name}"]`

    if (el.text) return `text=${el.text}`

    return el.tag.toLowerCase()

}

module.exports = { locator }