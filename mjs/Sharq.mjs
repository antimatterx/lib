export class Sharq extends Array {
  static _HTML_STRING_MATCH = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i
  static _CSS_ID_SELECTOR = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/

  constructor(selector = void undefined) {
    super()

    this._storeData = new Sharq.SharqStoreData(this)

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
    } else if (Sharq.SharqUtil.isIterable(selector)) {
      for (const target of selector) {
        this.push(target)
      }
    } else {
      this.push(selector)
    }
  }

  static SharqUtil = {
    isIterable(arg) {
      return typeof arg?.[Symbol.iterator] === 'function'
    }
  }

  static SharqStoreData = class SharqStoreData extends Map {
    constructor(target) {
      super()

      this._target = target
    }

    getSharq() {
      return this._target
    }
  }

  getStore() {
    return this._storeData
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

  _add(selector, type) {
    const sharq = new Sharq(selector)

    if (this.length > 1) {
      for (const [i, target] of this.entries()) {
        for (const selectorTarget of sharq) {
          if (!i) {
            target[type](selectorTarget)

            continue
          }

          const clone = selectorTarget.cloneNode(true)

          target[type](clone)

          if (selector instanceof Sharq) {
            selector.push(clone)
          }
        }
      }
    } else {
      for (const selectorTarget of sharq) {
        this[0][type](selectorTarget)
      }
    }

    return this
  }

  append(selector) {
    return this._add(selector, 'append')
  }

  prepend(selector) {
    return this._add(selector, 'prepend')
  }

  before(selector) {
    return this._add(selector, 'before')
  }

  after(selector) {
    return this._add(selector, 'after')
  }

  appendTo(selector) {
    new Sharq(selector).append(this)

    return this
  }

  prependTo(selector) {
    new Sharq(selector).prepend(this)

    return this
  }

  insertBefore(selector) {
    new Sharq(selector).before(this)

    return this
  }

  insertAfter(selector) {
    new Sharq(selector).after(this)

    return this
  }

  text(value = void undefined) {
    if (typeof value === 'undefined') {
      const results = []

      for (const target of this) {
        results.push(target.textContent)
      }

      return results.length === 1 ? results[0] : results
    }

    if (typeof value === 'string') {
      for (const target of this) {
        target.textContent = value
      }
    } else if (Sharq.SharqUtil.isIterable(value)) {
      let i = 0

      for (const v of value) {
        const target = this[i++]

        if (!target) {
          break
        }

        target.textContent = v
      }
    }

    return this
  }

  value(value = void undefined) {
    if (typeof value === 'undefined') {
      const results = []

      for (const target of this) {
        results.push(target.value)
      }

      return results.length === 1 ? results[0] : results
    }

    if (typeof value === 'string') {
      for (const target of this) {
        target.value = value
      }
    } else if (Sharq.SharqUtil.isIterable(value)) {
      let i = 0

      for (const v of value) {
        const target = this[i++]

        if (!target) {
          break
        }

        target.value = v
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

  click() {
    for (const target of this) {
      target.click()
    }

    return this
  }

  static _eventTargets = new Map

  static _on(target, type, listener, wrapListener) {
    if (!Sharq._eventTargets.has(target)) {
      Sharq._eventTargets.set(target, new Map)
    }

    const eventTypes = Sharq._eventTargets.get(target)

    if (!eventTypes.has(type)) {
      eventTypes.set(type, new Map)
    }

    const listeners = eventTypes.get(type)

    if (!listeners.has(listener)) {
      listeners.set(listener, new Set)
    }

    for (const realListener of listeners.get(listener).add(wrapListener)) {
      target.addEventListener(type, realListener)
    }
  }

  static _off(target, type, listener) {
    if (Sharq._eventTargets.has(target)) {
      const eventTypes = Sharq._eventTargets.get(target)

      if (eventTypes.has(type)) {
        const listeners = eventTypes.get(type)

        if (listeners.has(listener)) {
          const wrapListeners = listeners.get(listener)

          for (const realListener of wrapListeners) {
            target.removeEventListener(type, realListener)

            wrapListeners.delete(realListener)
          }

          listeners.delete(listener)
        }

        if (!listeners.size) {
          eventTypes.delete(type)
        }
      }

      if (!eventTypes.size) {
        Sharq._eventTargets.delete(target)
      }
    }
  }

  once(type, listener) {
    for (const target of this) {
      Sharq._on(target, type, listener, original => {
        Sharq._off(target, type, listener)

        return listener({ target: this, original })
      })
    }

    return this
  }

  on(type, listener) {
    for (const target of this) {
      Sharq._on(target, type, listener, original => listener({ target: this, original }))
    }

    return this
  }

  off(type, listener) {
    for (const target of this) {
      Sharq._off(target, type, listener)
    }

    return this
  }

  focus(options = void undefined) {
    for (const target of this) {
      target.focus(options)
    }

    return this
  }

  blur() {
    for (const target of this) {
      target.blur()
    }

    return this
  }
}
