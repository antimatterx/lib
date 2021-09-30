//@ts-check

class SharqStore extends Map {
  constructor(target) {
    super()

    this._target = target
  }

  close() {
    return this._target
  }
}

class Sharq extends Array {
  static _HTML_STRING_MATCH = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i
  static _CSS_ID_SELECTOR = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/

  constructor(selector = void undefined) {
    super()

    this._store = new SharqStore(this)

    if (typeof selector === 'undefined') {
      return this
    }

    if (typeof selector === 'string') {
      if (selector.startsWith('<') && selector.endsWith('>') && selector.length > 2) {
        const htmlStringMatch = selector.match(Sharq._HTML_STRING_MATCH)

        if (htmlStringMatch) {
          this.push(document.createElement(htmlStringMatch[1]))
        }
      } else if (Sharq._CSS_ID_SELECTOR.test(selector)) {
        const element = document.getElementById(selector)

        if (element) {
          this.push(element)
        }
      } else {
        for (const element of document.querySelectorAll(selector)) {
          this.push(element)
        }
      }
    } else if (Sharq._isIterable(selector)) {
      for (const target of selector) {
        this.push(target)
      }
    } else {
      this.push(selector)
    }
  }

  static _isIterable(obj) {
    return typeof obj?.[Symbol.iterator] === 'function'
  }

  static _isWindow(obj) {
    return typeof obj !== 'undefined' && obj?.window === obj
  }

  store() {
    return this._store
  }

  storeSize() {
    return this._store.size
  }

  storeClear() {
    this._store.clear()

    return this
  }

  storeDelete(key) {
    this._store.delete(key)

    return this
  }

  storeGet(key) {
    this._store.get(key)

    return this
  }

  storeHas(key) {
    return this._store.has(key)
  }

  storeSet(key, value) {
    this._store.set(key, value)

    return this
  }

  do(func) {
    func(this)

    return this
  }

  get(index = 0) {
    return this[index]
  }

  eq(index = 0) {
    return new Sharq(this[index])
  }

  to(targetNode, type = 'append') {
    if (type === 'append' || type === 'prepend' || type === 'before' || type === 'after') {
      for (const target of this) {
        targetNode[type](target)
      }
    }

    return this
  }

  appendTo(parentNode) {
    for (const target of this) {
      parentNode.append(target)
    }

    return this
  }

  prependTo(parentNode) {
    for (const target of this) {
      parentNode.prepend(target)
    }

    return this
  }

  insertBefore(targetNode) {
    for (const target of this) {
      targetNode.before(target)
    }

    return this
  }

  insertAfter(targetNode) {
    for (const target of this) {
      targetNode.after(target)
    }

    return this
  }

  text(value = void undefined) {
    if (typeof value === 'undefined') {
      const results = []

      for (const target of this) {
        results.push(Sharq._isWindow(target) ? void undefined : target.textContent)
      }

      return results.length === 1 ? results[0] : results
    }

    if (typeof value === 'string') {
      for (const target of this) {
        if (!Sharq._isWindow(target)) {
          target.textContent = value
        }
      }
    } else if (Sharq._isIterable(value)) {
      let i = 0

      for (const v of value) {
        const target = this[i++]

        if (!target) {
          break
        }

        if (!Sharq._isWindow(target)) {
          target.textContent = v
        }
      }
    }

    return this
  }

  value(value = void undefined) {
    if (typeof value === 'undefined') {
      const results = []

      for (const target of this) {
        results.push(Sharq._isWindow(target) ? void undefined : target.value)
      }

      return results.length === 1 ? results[0] : results
    }

    if (typeof value === 'string') {
      for (const target of this) {
        if (!Sharq._isWindow(target)) {
          target.value = value
        }
      }
    } else if (Sharq._isIterable(value)) {
      let i = 0

      for (const v of value) {
        const target = this[i++]

        if (!target) {
          break
        }

        if (!Sharq._isWindow(target)) {
          target.value = v
        }
      }
    }

    return this
  }

  prop(propertiesOrPropertyName) {
    if (typeof propertiesOrPropertyName === 'string') {
      const results = []

      for (const target of this) {
        results.push(target[propertiesOrPropertyName])
      }

      return results.length === 1 ? results[0] : results
    }

    for (const [k, v] of Object.entries(propertiesOrPropertyName)) {
      for (const target of this) {
        target[k] = v
      }
    }

    return this
  }

  attr(attributesOrQualifiedName) {
    if (typeof attributesOrQualifiedName === 'string') {
      const results = []

      for (const target of this) {
        results.push(target.getAttribute(attributesOrQualifiedName))
      }

      return results.length === 1 ? results[0] : results
    }

    for (const v of Object.entries(attributesOrQualifiedName)) {
      for (const target of this) {
        target.setAttribute(...v)
      }
    }

    return this
  }

  style(styles) {
    for (const [k, v] of Object.entries(styles)) {
      for (const target of this) {
        target.style[k] = v
      }
    }

    return this
  }

  _eventTargets = new Map

  _on(target, type, listener, wrapListener) {
    if (!this._eventTargets.has(target)) {
      this._eventTargets.set(target, new Map)
    }

    const eventTypes = this._eventTargets.get(target)

    if (!eventTypes.has(type)) {
      eventTypes.set(type, new Map)
    }

    const eventListeners = eventTypes.get(type)

    if (!eventListeners.has(listener)) {
      eventListeners.set(listener, wrapListener)
    }

    target.addEventListener(type, eventListeners.get(listener))

    return this
  }

  _off(target, type, listener) {
    if (this._eventTargets.has(target)) {
      const eventTypes = this._eventTargets.get(target)

      if (eventTypes.has(type)) {
        const eventListeners = eventTypes.get(type)

        if (eventListeners.has(listener)) {
          const wrapListener = eventListeners.get(listener)

          target.removeEventListener(type, wrapListener)

          eventListeners.delete(listener)
        }

        if (!eventListeners.size) {
          eventTypes.delete(type)
        }
      }

      if (!eventTypes.size) {
        this._eventTargets.delete(target)
      }
    }

    return this
  }

  once(type, listener) {
    for (const target of this) {
      this._on(target, type, listener, original => {
        this._off(target, type, listener)

        return listener({ target: this, original })
      })
    }

    return this
  }

  on(type, listener) {
    for (const target of this) {
      this._on(target, type, listener, original => listener({ target: this, original }))
    }

    return this
  }

  off(type, listener) {
    for (const target of this) {
      this._off(target, type, listener)
    }

    return this
  }

  click() {
    for (const target of this) {
      if (target instanceof HTMLElement) {
        target.click()
      }
    }

    return this
  }

  focus(options = void undefined) {
    for (const target of this) {
      if (target instanceof HTMLElement) {
        target.focus(options)
      }
    }

    return this
  }
}
