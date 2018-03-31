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
      /**
       * Color format in one of the available values ('hex' | 'rgb').
       * When `alpha` is set to true, the format for colors with
       * alpha transparency is automatically changed to `rgba`.
       */
      format: {
        type: String,
        value: 'hex',
      },
      _alpha: {
        type: Number,
        value: 1,
      },
      _format: {
        type: String,
        computed: '_computeFormat(format, _alpha)',
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
    rangeInput.addEventListener('input', this._onInputRangeChange);
    this.picker.picker.querySelector('.color-picker-control').appendChild(rangeInput);
  }

  _setColor(color) {
    this.color = this._getFormattedColor();
  }

  _onInputRangeChange(e) {
    this._alpha = Number(e.target.value);
    this._setColor(CP._HSV2RGB(this.picker.set()));
  }

  _computeFormat(format, alpha) {
    return (alpha !== 1) ? 'rgba' : format;
  }

  _getFormattedColor() {
    const rgbValues = CP._HSV2RGB(this.picker.get());
    const getCSSColor = {
      rgb: (value) => `rgb(${value.join(', ')})`,
      rgba: (value) => `rgba(${value.concat(this._alpha).join(', ')})`,
      hex: (value) => `#${CP.RGB2HEX(value)}`,
    };
    return getCSSColor[this._format](rgbValues);
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
