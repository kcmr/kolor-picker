/**
 * `<kolor-picker>` displays a color picker with support for multiple color formats and alpha transparency.
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
       */
      color: {
        type: String,
        value: '#000',
        notify: true,
      },
      /**
       * Set to true to enable alpha selector.
       */
      alpha: {
        type: Boolean,
        value: false,
      },
      /**
       * Format for colors without alpha. ('rgb' | 'hex').
       * Colors with alpha are always in 'rgba' format.
       */
      format: {
        type: String,
        value: 'hex',
      },
      _alphaValue: {
        type: Number,
        value: 1,
      },
      _format: {
        type: String,
        computed: '_computeFormat(format, _alphaValue)',
      },
    };
  }

  static get observers() {
    return [
      '_alphaChanged(alpha, _rangeControl)',
    ];
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
      this.picker.on('change', this._setColor.bind(this));
      this._addAlphaControl();
    }, 1);
  }

  _setColor() {
    this.color = this._getFormattedColor();
    this._setAlphaControlColor();
  }

  _getFormattedColor() {
    const rgbData = CP._HSV2RGB(this.picker.get());
    const getCSSColor = {
      rgb: (value) => `rgb(${value.join(', ')})`,
      rgba: (value) => `rgba(${value.concat(this._alphaValue).join(', ')})`,
      hex: (value) => `#${CP.RGB2HEX(value)}`,
    };
    return getCSSColor[this._format](rgbData);
  }

  _setAlphaControlColor() {
    if (this._rangeControl && this.alpha) {
      document.documentElement.style.setProperty('--kolor-picker-solid-color', this._getSolidHexColor());
    }
  }

  _getSolidHexColor() {
    const rgbData = CP._HSV2RGB(this.picker.get());
    return `#${CP.RGB2HEX(rgbData)}`;
  }

  _addAlphaControl() {
    this._rangeControl = this.$.range.cloneNode();
    this.picker.picker.querySelector('.color-picker-control').appendChild(this._rangeControl);
  }

  _alphaChanged(alpha, rangeControl) {
    if (!rangeControl) {
      return;
    }

    if (alpha) {
      this._enableAlphaControl();
    } else {
      this._disableAlphaControl();
    }
  }

  _enableAlphaControl() {
    this._rangeControl.hidden = false;
    this._rangeControl.addEventListener('input', this._onInputRangeChange);
  }

  _disableAlphaControl() {
    this._rangeControl.hidden = true;
    this._rangeControl.removeEventListener('input', this._onInputRangeChange);
  }

  _onInputRangeChange(e) {
    this._alphaValue = Number(e.target.value);
    this._setColor();
  }

  _computeFormat(format, alphaValue) {
    return (alphaValue !== 1) ? 'rgba' : format;
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
