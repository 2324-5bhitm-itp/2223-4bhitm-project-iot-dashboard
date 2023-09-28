export class SvgComponent {
    svgContainer: HTMLDivElement;

    constructor() {
        this.svgContainer = document.createElement('div');
        this.svgContainer.innerHTML = `
      <h2>SVG Component</h2>
      <svg id="svg-container" width="400" height="400"></svg>
    `;
        this.loadSvg();
    }

    private loadSvg() {
        const svgUrl = '../../resources/svg/first-floor.svg'; // Pfad zum SVG-Bild

        // Lade das SVG-Bild
        fetch(svgUrl)
            .then(response => response.text())
            .then(svgData => {
                // Füge das SVG-Bild dem Container hinzu
                const svgContainer = this.svgContainer.querySelector('#svg-container');
                if (svgContainer) {
                    svgContainer.innerHTML = svgData;
                }
            })
            .catch(error => {
                console.error('Fehler beim Laden des SVG-Bildes:', error);
            });
    }

}
