//import Chart from '../node_modules/chart.js/auto'

// (async function() {
//   const data = [
//     { year: 2010, count: 10 },
//     { year: 2011, count: 20 },
//     { year: 2012, count: 15 },
//     { year: 2013, count: 25 },
//     { year: 2014, count: 22 },
//     { year: 2015, count: 30 },
//     { year: 2016, count: 28 },
//   ];

//   new Chart(
//     document.getElementById('acquisitions'),
//     {
//       type: 'bar',
//       data: {
//         labels: data.map(row => row.year),
//         datasets: [
//           {
//             label: 'Acquisitions by year',
//             data: data.map(row => row.count)
//           }
//         ]
//       }
//     }
//   );
// })();



// create an array of temperature data
const temperatures = [20, 23, 25, 28, 30, 32, 30, 28, 25, 23, 20, 18];

// create a canvas element and get its context
const canvas = document.getElementById('temperature_line_chart');
const ctx = canvas.getContext('2d');

// create a new chart object
const chartLine = new Chart(ctx, {
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
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 40
      }
    }
  }
});


// create a canvas element and get its context
const canvasDogg = document.getElementById('temperature_dogg_chart');
const ctxDogg = canvasDogg.getContext('2d');

// create a new chart object
const chartPie = new Chart(ctxDogg, {
  type: 'pie',
  data: {
    labels: ['today'],
    datasets: [{
      label: 'Temperature',
      data: temperatures,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  },
  options: {
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
const ctxDough = document.getElementById('temperature_dough_chart').getContext('2d');
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
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'Temperature Doughnut Chart'
    },
    legend: {
      position: 'bottom'
    }
  }
});