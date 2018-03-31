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
    };
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
    this._onInputRangeChange = this._onInputRangeChange.bind(this);
    ['change', 'input'].forEach((event) => {
      rangeInput.addEventListener(event, this._onInputRangeChange);
    });
    this.picker.picker.querySelector('.color-picker-control').appendChild(rangeInput);
  }

  _setColor(color) {
    this.color = this._getFormattedColor(color);
  }

  _onInputRangeChange(e) {
    const rgbValues = CP._HSV2RGB(this.picker.set());
    const isAlpha = Number(e.target.value) !== 1;
    const rgbColor = (isAlpha)
      ? `rgba(${rgbValues.concat(e.target.value).join(', ')})`
      : `rgb(${rgbValues.join(', ')})`;
    this.color = rgbColor;
  }

  _getFormattedColor(color) {
    const formatted = `#${color}`;
    return (this.uppercase) ? formatted.toUpperCase() : formatted;
  }

  /**
   * Shows the color picker.
   */
  show() {
    this.picker.enter();
  }

  /**
   * Hides the color picker.
   */
  hide() {
    this.picker.exit();
  }
}

window.customElements.define(KolorPicker.is, KolorPicker);
