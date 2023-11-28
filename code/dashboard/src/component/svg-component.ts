import { html } from 'lit-html';

export class SvgComponent extends HTMLElement {

    render() {
        return html`
      <svg>
        <!-- Hier kannst du den Inhalt deines SVGs platzieren -->
        <circle cx="25" cy="25" r="20" stroke="black" stroke-width="3" fill="red" />
      </svg>
    `;
    }
}

customElements.define("svg-component", SvgComponent)
