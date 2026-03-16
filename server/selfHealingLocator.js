function healLocator(oldLocator, elements) {

    const match = elements.find(el =>
        el.text === "Login" || el.text === "Sign in" || el.text === "Submit"
    )

    if (match) {
        if (match.id) return `#${match.id}`
        if (match.name) return `[name="${match.name}"]`
        return match.tag.toLowerCase()
    }

    return oldLocator
}

module.exports = { healLocator }