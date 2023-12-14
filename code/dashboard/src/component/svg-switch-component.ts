import { html, render } from "lit-html";

interface SvgSwitchProps {
    paths: Record<string, string>;
    selectedPath: string;
    onPathChange: (path: string) => void;
}

export class SvgSwitchComponent extends HTMLElement {
    private props: SvgSwitchProps;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.props = {
            paths: {},
            selectedPath: "",
            onPathChange: () => {},
        };
    }

    connectedCallback() {
        this.render();
    }

    setProps(props: SvgSwitchProps) {
        this.props = { ...this.props, ...props };
        this.render();
    }

    render() {
        const { paths, selectedPath, onPathChange } = this.props;

        const options = Object.entries(paths).map(([name, path]) =>
            html`
        <option value="${path}" selected="${path === selectedPath}">
          ${name}
        </option>
      `
        );

        const handleChange = (event: Event) => {
            const target = event.target as HTMLSelectElement;
            const selectedPath = target.value;
            this.props.onPathChange(selectedPath);
        };


        render(
            html`
        <select @change="${handleChange}" style="font-size: larger; padding: 1%">
          ${options}
        </select>
      `,
            this.shadowRoot!
        );
    }
}

customElements.define("svg-switch", SvgSwitchComponent);
