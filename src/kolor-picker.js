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
    };
  }

  ready() {
    super.ready();
    this._initializePicker();
  }

  /* global CP */
  _initializePicker() {
    this.picker = new CP(this.$.input, false, this.$.picker);
    this.picker.on('change', this._setColor.bind(this));
  }

  _setColor(color) {
    this.color = this._getFormattedColor(color);
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
