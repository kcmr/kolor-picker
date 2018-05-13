import {html} from '@polymer/polymer/polymer-element.js';

export const tpl = html`
<button on-click="show" title="[[buttonTitle]]" class="btn-picker" tabindex="0" id="btn">
  <slot name="color-indicator">
    <span tabindex="-1" class="current-color" style$="background-color: [[color]]"></span>
  </slot>
</button>

<input type="hidden" id="input" value="[[color]]">
<input type="range" class="input-range" id="range" min="0" max="1" step="0.01" value="1" hidden>
<div id="picker" class="picker-wrapper"></div>
`;
