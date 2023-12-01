import { html, render } from "lit-html";
import { SvgSwitchComponent } from "./svg-switch-component";

export class SvgComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.renderSvgSwitch();
    }

    async fetchSvg(path: string): Promise<string> {
        const response = await fetch(path);
        const svgText = await response.text();
        return svgText;
    }

    async renderSvg(path: string) {
        const svgContent = await this.fetchSvg(path);

        const svgDocument = new DOMParser().parseFromString(
            svgContent,
            "image/svg+xml"
        );
        const svgElement = svgDocument.documentElement;

        svgElement.setAttribute("width", "800");
        svgElement.setAttribute("height", "800");

        render(html`<div class="svg-container">${svgElement}</div>`, this.shadowRoot!);
    }

    renderSvgSwitch() {
        const svgSwitchElement = document.createElement("svg-switch") as SvgSwitchComponent;
        svgSwitchElement.setProps({
            paths: {
                "First Floor": "../../resources/svg/first-floor.svg",
                "Second Floor": "../../resources/svg/second-floor.svg",
                "Third Floor": "../../resources/svg/third-floor.svg",
            },
            selectedPath: "../../resources/svg/first-floor.svg",
            onPathChange: (path) => this.renderSvg(path),
        });

        this.shadowRoot?.appendChild(svgSwitchElement);
    }
}

customElements.define("svg-component", SvgComponent);
