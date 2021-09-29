export class DlmStore extends Map {
  constructor(target) {
    super()

    this._target = target
  }

  close() {
    return this._target
  }
}

export class Dlm {
  constructor(element) {
    this._element = element
    this._eventData = new Map
    this._storeData = new DlmStore(this)
  }

  static new(query) {
    return new Dlm(
      query instanceof Element || query === window ? query
        : query.startsWith('<') && query.endsWith('>') ? document.createElement(query.slice(1, -1))
          : document.querySelector(query)
    )
  }

  store() {
    return this._storeData
  }

  get() {
    return this._element
  }

  to(targetElement, type = 'append') {
    if (targetElement instanceof Dlm) {
      targetElement = targetElement._element
    }

    if (type === 'append' || type === 'prepend' || type === 'before' || type === 'after') {
      targetElement[type](this._element)
    }

    return this
  }

  text(value = void undefined) {
    if (typeof value === 'undefined') {
      return this._element.textContent
    }

    this._element.textContent = value

    return this
  }

  value(value = void undefined) {
    if (typeof value === 'undefined') {
      return this._element.value
    }

    this._element.value = value

    return this
  }

  prop(propertiesOrPropertyName) {
    if (typeof propertiesOrPropertyName === 'string') {
      return this._element[propertiesOrPropertyName]
    }

    for (const [k, v] of Object.entries(propertiesOrPropertyName)) {
      this._element[k] = v
    }

    return this
  }

  attr(attributesOrQualifiedName) {
    if (typeof attributesOrQualifiedName === 'string') {
      return this._element.getAttribute(attributesOrQualifiedName)
    }

    for (const v of Object.entries(attributesOrQualifiedName)) {
      this._element.setAttribute(...v)
    }

    return this
  }

  style(styles) {
    for (const [k, v] of Object.entries(styles)) {
      this._element.style[k] = v
    }

    return this
  }

  _on(type, listener, listenerWrapper) {
    if (!this._eventData.has(type)) {
      this._eventData.set(type, new WeakMap)
    }

    const listenerData = this._eventData.get(type)

    if (!listenerData.has(listener)) {
      listenerData.set(listener, listenerWrapper)
    }

    this._element.addEventListener(type, listenerData.get(listener))

    return this
  }

  once(type, listener) {
    return this._on(type, listener, original => {
      listener({ target: this, original })
      this.off(type, listener)
    })
  }

  on(type, listener) {
    return this._on(type, listener, original => void listener({ target: this, original }))
  }

  off(type, listener) {
    if (this._eventData.has(type)) {
      const listenerData = this._eventData.get(type)

      if (listenerData.has(listener)) {
        this._element.removeEventListener(type, listenerData.get(listener))
        listenerData.delete(listener)

        if (!listenerData.size) {
          this._eventData.delete(type)
        }
      }
    }

    return this
  }

  click() {
    this._element.click()

    return this
  }

  focus(options = void undefined) {
    this._element.focus(options)

    return this
  }
}
