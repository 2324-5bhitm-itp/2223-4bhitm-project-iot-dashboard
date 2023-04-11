//template Temperatures
const temperatures = [20, 23, 25, 28, 30, 32, 30, 28, 25, 23, 20, 18];

// create a canvas element and get its context
const canvasLine = document.getElementById('temperature_line_chart');
canvasLine.width = 200;
canvasLine.height = 200;
const ctxLine = canvasLine.getContext('2d');

// create a new chart object
const chartLine = new Chart(ctxLine, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Temperature',
      data: temperatures,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 40
      }
    }
  }
});



// Set up the data
const currentTemp = 25;
const thresholds = [{
    label: 'Low',
    value: 50,
    color: '#FF6384'
  },
  {
    label: 'Medium',
    value: 75,
    color: '#36A2EB'
  },
  {
    label: 'High',
    value: 100,
    color: '#FFCE56'
  },
];

// Create the chart
const canvasDough = document.getElementById('temperature_dough_chart');
canvasDough.width = 200;
canvasDough.height = 200;
const ctxDough = canvasDough.getContext('2d');

var threshold1 = 10;
var threshold2 = 20;
var threshold3 = 30;

const chartDough = new Chart(ctxDough, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [currentTemp, threshold1 - currentTemp, threshold2 - threshold1, threshold3 - threshold2, 100 - threshold3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
    }],
    labels: [
      'Current Temperature',
      'Below Threshold 1',
      'Between Thresholds 1 and 2',
      'Between Thresholds 2 and 3',
      'Above Threshold 3'
    ]
  },
  options: {
    maintainAspectRatio: true,
    title: {
      display: true,
      text: 'Temperature Doughnut Chart'
    },
    legend: {
      position: 'bottom'
    }
  }
});