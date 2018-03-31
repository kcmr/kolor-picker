/**
 * `<kolor-picker>` displays a color picker with support for multiple color formats (hex, rgb, rgba) and transparency.
 *
 * @summary Polymer 2 element that displays a color picker.
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @extends {Polymer.Element}
 */
class KolorPicker extends Polymer.Element {
  static get is() {
    return 'kolor-picker';
  }

  static get properties() {
    return {
      /**
       * Initial color of the picker in one of the allowed formats: HEX, RGB, RGBA.
       * Named colors are not supported.
       */
      color: {
        type: String,
        value: '#000',
        notify: true,
      },
      /**
       * Set to true to uppercase HEX values.
       */
      uppercase: {
        type: Boolean,
        value: false,
      },
      /**
       * Set to true to enable alpha selector.
       */
      alpha: {
        type: Boolean,
        value: false,
      },
      _alpha: {
        type: Number,
        value: 1,
      },
    };
  }

  constructor() {
    super();
    this._onClickOutside = this._onClickOutside.bind(this);
    this._onInputRangeChange = this._onInputRangeChange.bind(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onClickOutside);
  }

  ready() {
    super.ready();
    this._initializePicker();
  }

  _initializePicker() {
    setTimeout(() => {
      this.picker = new CP(this.$.input, false, this.$.picker);
      this.alpha && this._addAlphaControl();
      this.picker.on('change', this._setColor.bind(this));
    }, 1);
  }

  _addAlphaControl() {
    const rangeInput = this.$.range.cloneNode();
    rangeInput.hidden = false;
    ['change', 'input'].forEach((event) => {
      rangeInput.addEventListener(event, this._onInputRangeChange);
    });
    this.picker.picker.querySelector('.color-picker-control').appendChild(rangeInput);
  }

  _setColor(color) {
    this.color = this._getFormattedColor(color);
  }

  _onInputRangeChange(e) {
    this._alpha = Number(e.target.value);
    this._setColor(CP._HSV2RGB(this.picker.set()));
  }

  _getFormattedColor(color) {
    const rgbValues = CP._HSV2RGB(this.picker.get());
    return (this._alpha !== 1)
      ? `rgba(${rgbValues.concat(this._alpha).join(', ')})`
      : `rgb(${rgbValues.join(', ')})`;
  }

  /**
   * Shows the color picker.
   */
  show() {
    this.picker.enter();
    document.addEventListener('click', this._onClickOutside);
  }

  /**
   * Hides the color picker.
   */
  hide() {
    this.picker.exit();
  }

  _onClickOutside(e) {
    if (e.composedPath().indexOf(this) === -1) {
      document.removeEventListener('click', this._onClickOutside);
      this.hide();
    }
  }
}

window.customElements.define(KolorPicker.is, KolorPicker);
