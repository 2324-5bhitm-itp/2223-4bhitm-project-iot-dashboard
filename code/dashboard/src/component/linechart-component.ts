/*import Chart from 'chart.js/auto'

const { Client } = require('pg')

// Configuration for PostgreSQL
const dbConfig = {
    user: 'your_username',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 5432, // Change this to the appropriate port if needed
};

// Create a PostgreSQL client
const client = new Client(dbConfig);

class ChartComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    connectedCallback() {
        this.render()
        this.firstUpdated()
    }

// Connect to the PostgreSQL database
client.connect();

// Query to fetch data from the Measurement table
const query = 'SELECT timestamp, value FROM Measurement ORDER BY timestamp';

// Execute the query
client.query(query, (err, result) => {
    if (err) {
        console.error('Error executing query', err);
        client.end();
        return;
    }

    // Extract data from the query result
    const data = result.rows.map(row => ({
        x: new Date(row.timestamp), // Convert timestamp to a Date object
        y: row.value,
    }));

    // Create a line chart using Chart.js
    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(point => point.x.toISOString()), // X-axis labels (timestamps)
            datasets: [{
                label: 'Measurement Values',
                data: data,
                borderColor: 'blue',
                fill: false,
            }],
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day', // Adjust the time unit as needed
                    },
                },
                y: {
                    // Add y-axis configuration here if needed
                },
            },
        },
    });

    // Disconnect from the PostgreSQL database
    client.end();
});

}

customElements.define('linechart-component', ChartComponent)
*/