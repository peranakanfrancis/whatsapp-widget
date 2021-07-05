/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const CLASS_NAME_WIDGET_TOGGLE = 'wa-widget-toggle'
const CLASS_NAME_WIDGET_CONTENT = 'wa-widget-content'
const CLASS_NAME_WIDGET_EXPANDED = 'expanded'
const CLASS_NAME_WIDGET_FORM_REQUIRED = 'required'

const SELECTOR_VALUE_TOGGLE_CHAT = 'wa-chat'
const SELECTOR_VALUE_TOGGLE_SEND = 'wa-send'

const SELECTOR_CHAT_WIDGET = '[data-chat]'
const SELECTOR_DATA_TOGGLE_CHAT = `[data-toggle="${SELECTOR_VALUE_TOGGLE_CHAT}"]`
const SELECTOR_DATA_TOGGLE_SEND = `[data-toggle="${SELECTOR_VALUE_TOGGLE_SEND}"]`
const SELECTOR_DATA_MESSAGE = `[data-message]`

const DefaultConfig = {
    name: '',
    division: '',
    photo: '',
    introduction: ''
}

const DefaultConfigType = {
    name: 'string',
    division: 'string',
    photo: 'string',
    introduction: 'string'
}

const DefaultForm = [
    {
        data: 'name',
        type: 'text',
        required: true
    }, {
        data: 'message',
        type: 'text',
        required: true
    }
]

const DefaultFormType = {
    data: 'string',
    type: 'string',
    required: 'boolean'
}

const ChatData = {}

/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */
export default class Chat {
    constructor(element, config, input) {
        if (ChatData[element.id])
            return

        this._element = element       
        this._config = this._getConfig(config)
        this._inputs =  this._getInput(input)
        this._phoneNumber = this._element.getAttribute('action')
        this._isShown = false
        this._toggleChat = ''
        this._contentElement = ''
        this._toggleSend = ''
        this._buildHTML()
        this._setEventListener()

        ChatData[element.id] = this
    }

    // PUBLIC
    toggle() {
        Object.keys(ChatData).forEach(key => {
            if (key !== this._element.id && ChatData[key]._isShown)
                ChatData[key].toggle()
        })

        this._isShown ? this._hide() : this._show()
    }

    // PRIVATE
    _sendMessage() {
        if (!/^\d+$/.test(this._phoneNumber)) {
            throw new Error('Phone number (' + this._phoneNumber + ') is invalid.')
        }

        const send_url = 'https://wa.me/'
        const inputs = this._element.querySelectorAll(SELECTOR_DATA_MESSAGE)
        let parameters = send_url + this._phoneNumber + '?text='
        let valid = true

        for (let i = 0; i < inputs.length; i++) {
            const item = inputs[i]
            if (!this._formValidation(item))
                valid = false

            const title = item.getAttribute('data-message')
            parameters += title.replace(/^./, title[0].toUpperCase()) + ': ' + item.value + '%0A'
        }

        if (valid) window.open(parameters, '_blank')
    }

    _buildHTML() {
        if (this._element.innerHTML) return false

        this._verifyInput(this._inputs)

        const TOGGLE = document.createElement('a')
        const ids = '#' + this._element.id
        TOGGLE.href = ids
        TOGGLE.classList.add(CLASS_NAME_WIDGET_TOGGLE)
        TOGGLE.setAttribute('data-toggle', SELECTOR_VALUE_TOGGLE_CHAT)
        TOGGLE.setAttribute('data-target', ids)
        TOGGLE.innerHTML =
				`<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 800 800" width="800" height="800"><defs><clipPath id="_clipPath_A3g8G5hPEGG2L0B6hFCxamU4cc8rfqzQ"><rect width="800" height="800"/></clipPath></defs><g clip-path="url(#_clipPath_A3g8G5hPEGG2L0B6hFCxamU4cc8rfqzQ)"><g><path d=" M 787.59 800 L 12.41 800 C 5.556 800 0 793.332 0 785.108 L 0 14.892 C 0 6.667 5.556 0 12.41 0 L 787.59 0 C 794.444 0 800 6.667 800 14.892 L 800 785.108 C 800 793.332 794.444 800 787.59 800 Z " fill="rgb(37,211,102)"/></g><g><path d=" M 508.558 450.429 C 502.67 447.483 473.723 433.24 468.325 431.273 C 462.929 429.308 459.003 428.328 455.078 434.22 C 451.153 440.114 439.869 453.377 436.434 457.307 C 433 461.236 429.565 461.729 423.677 458.78 C 417.79 455.834 398.818 449.617 376.328 429.556 C 358.825 413.943 347.008 394.663 343.574 388.768 C 340.139 382.873 343.207 379.687 346.155 376.752 C 348.804 374.113 352.044 369.874 354.987 366.436 C 357.931 362.999 358.912 360.541 360.875 356.614 C 362.837 352.683 361.857 349.246 360.383 346.299 C 358.912 343.352 347.136 314.369 342.231 302.579 C 337.451 291.099 332.597 292.654 328.983 292.472 C 325.552 292.301 321.622 292.265 317.698 292.265 C 313.773 292.265 307.394 293.739 301.996 299.632 C 296.6 305.527 281.389 319.772 281.389 348.752 C 281.389 377.735 302.487 405.731 305.431 409.661 C 308.376 413.592 346.949 473.062 406.015 498.566 C 420.062 504.634 431.03 508.256 439.581 510.969 C 453.685 515.451 466.521 514.818 476.666 513.302 C 487.978 511.613 511.502 499.06 516.409 485.307 C 521.315 471.55 521.315 459.762 519.842 457.307 C 518.371 454.851 514.446 453.377 508.558 450.429 Z  M 401.126 597.117 L 401.047 597.117 C 365.902 597.104 331.431 587.661 301.36 569.817 L 294.208 565.572 L 220.08 585.017 L 239.866 512.743 L 235.21 505.332 C 215.604 474.149 205.248 438.108 205.264 401.1 C 205.307 293.113 293.17 205.257 401.204 205.257 C 453.518 205.275 502.693 225.674 539.673 262.696 C 576.651 299.716 597.004 348.925 596.983 401.258 C 596.939 509.254 509.078 597.117 401.126 597.117 Z  M 567.816 234.565 C 523.327 190.024 464.161 165.484 401.124 165.458 C 271.24 165.458 165.529 271.161 165.477 401.085 C 165.46 442.617 176.311 483.154 196.932 518.892 L 163.502 641 L 288.421 608.232 C 322.839 627.005 361.591 636.901 401.03 636.913 L 401.126 636.913 L 401.127 636.913 C 530.998 636.913 636.717 531.2 636.77 401.274 C 636.794 338.309 612.306 279.105 567.816 234.565" fill-rule="evenodd" fill="rgb(255,255,255)"/></g></g></svg>`
        const HTML_ELEMENT_WIDGET_MAIN = 
            `${TOGGLE.outerHTML}
            <div class="${CLASS_NAME_WIDGET_CONTENT} chat-tab">
                <header class="chat-header">
                    <div class="chat-admin-picture">
                        <img src="${this._config.photo}" alt="${this._config.name}'s Photos">
                    </div>
                    <div class="chat-admin-details">
                        <h4>${this._config.name}</h4>
                        <p><small>${this._config.division}</small></p>
                    </div>
                </header>
                <div class="chat-content">
                    <div class="chat-item">
                        <p>${this._config.introduction}</p>
                    </div>
                </div>
                ${this._buildInputs(this._inputs).outerHTML}
            </div>`

        this._element.innerHTML = HTML_ELEMENT_WIDGET_MAIN
    }

    _buildInputs(inputs) {
        const form = document.createElement('div')
        form.classList.add('chat-form')

        inputs.forEach(input => {
            let newInput = document.createElement('input')
            newInput.type = input.type
            newInput.setAttribute('data-message', input.data)
            newInput.placeholder = input.data.replace(/^./, input.data[0].toUpperCase())
            newInput.required = input.required
            form.appendChild(newInput)
        })

        const button = document.createElement('button')
        button.classList.add('chat-send')
        button.type = 'submit'
        button.setAttribute('data-toggle', SELECTOR_VALUE_TOGGLE_SEND)
        button.innerHTML = '<strong>Send</strong>'
        form.appendChild(button)

        return form
    }

    _setEventListener() {
        this._toggleChat = document.querySelector(SELECTOR_DATA_TOGGLE_CHAT + '[data-target="#' + this._element.id + '"]')
        this._contentElement = this._element.getElementsByClassName(CLASS_NAME_WIDGET_CONTENT).item(0)
        this._toggleSend = this._element.querySelector(SELECTOR_DATA_TOGGLE_SEND)

        if (this._toggleChat) {
            this._toggleChat.addEventListener("click", (e) => {
                e.preventDefault()
                this.toggle()
            })
        }
        if (this._toggleSend) {
            this._toggleSend.addEventListener('click', (e) => {
                e.preventDefault()
                this._sendMessage()
            })
        }
    }

    _show() {
        this._element.classList.add(CLASS_NAME_WIDGET_EXPANDED)
        this._toggleChat.classList.add(CLASS_NAME_WIDGET_EXPANDED)
        this._contentElement.classList.add(CLASS_NAME_WIDGET_EXPANDED)
        this._isShown = true
    }

    _hide() {
        this._element.classList.remove(CLASS_NAME_WIDGET_EXPANDED)
        this._toggleChat.classList.remove(CLASS_NAME_WIDGET_EXPANDED)
        this._contentElement.classList.remove(CLASS_NAME_WIDGET_EXPANDED)
        this._isShown = false
    }

    _formValidation(formElement) {
        if (!formElement.required) return true

        formElement.classList.remove(CLASS_NAME_WIDGET_FORM_REQUIRED)

        switch (formElement.type) {
            case 'email':
                if (!/^\S+@\S+$/.test(formElement.value)) {
                    formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED)
                    return false
                }
                break
            default:
                if (formElement.value == '' || formElement.value == null) {
                    formElement.classList.add(CLASS_NAME_WIDGET_FORM_REQUIRED)
                    return false
                }
                break
        }
        return true
    }

    _getConfig(config) {
        config = {
            ...DefaultConfig,
            ...config
        }
        this._typeCheck(config, DefaultConfigType)
        return config
    }

    _getInput(inputs) {
        if (typeof inputs === 'undefined' || inputs.length === 0)
            return DefaultForm
        
        return inputs
    }

    _verifyInput(inputs) {
        inputs.forEach(input => {
            this._typeCheck(input, DefaultFormType)
        })
    }

    _typeCheck(config, configTypes) {
        Object.keys(configTypes).forEach(property => {
            const expectedTypes = configTypes[property]
            const value = config[property]
            const valueType = value && this._isElement(value) ?
                'element' :
                this._toType(value)

            if (!new RegExp(expectedTypes).test(valueType)) {
                throw new Error(
                    `WhatsApp Widget: ` +
                    `Option "${property}" provided type "${valueType}" ` +
                    `but expected type "${expectedTypes}".`)
            }
        })
    }

    _isElement(obj) {
        (obj[0] || obj).nodeType
    }

    // AngusCroll (https://goo.gl/pxwQGp)
    _toType(obj) {
        if (obj === null || obj === undefined) {
            return `${obj}`
        }

        return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
    }
}

document.body.onload = () => {
    const chatSelector = document.querySelectorAll(SELECTOR_CHAT_WIDGET)
    for (let i = 0; i < chatSelector.length; i++) {
        const element = chatSelector[i]
        const data = new Chat(element, {}, []) // eslint-disable-line no-unused-vars
    }
}
