let covidChart = null;

// Fetch national summary
fetch('https://api.rootnet.in/covid19-in/stats/latest')
    .then(res => res.json())
    .then(data => {
        const summary = data.data.summary;
        document.getElementById("covidSummaryContainer").innerHTML = `
        <h3 class="mb-4 text-danger">Official Data Of Covid-19</h3>
        <div class="data-row fs-5 text-primary"><span>Total:</span> <span>${summary.total}</span></div>
        <div class="data-row fs-5 text-warning-emphasis"><span>Indian:</span> <span>${summary.confirmedCasesIndian}</span></div>
        <div class="data-row fs-5 text-white"><span>Foreign:</span> <span>${summary.confirmedCasesForeign}</span></div>
        <div class="data-row fs-5 text-success"><span>Discharged:</span> <span>${summary.discharged}</span></div>
        <div class="data-row fs-5 text-warning"><span>Deaths:</span> <span>${summary.deaths}</span></div>
    `;
    });

// Fetch state-specific data and show line chart 
function fetchStateCovidData() {
    const stateName = document.getElementById("stateInput").value.trim();

    if (stateName === "") {
        alert("Please Enter The State Name");
        return;
    }

    fetch('https://api.rootnet.in/covid19-in/stats/latest')
        .then(res => res.json())
        .then(data => {
            const stateList = data.data.regional;
            const stateData = stateList.find(item => item.loc.toLowerCase() === stateName.toLowerCase());

            const chartWrapper = document.querySelector('.chart-wrapper');

            if (!stateData) {
                alert(`No data found for "${stateName}"`); 
                if (covidChart) covidChart.destroy();      
                chartWrapper.style.display = 'none';      
                return;
            }


            document.getElementById("stateCovidContainer").innerHTML = `
            <h2 class="text-info">${stateData.loc} :</h2>
            <div class="row mt-3">
                <div class="col-6 p-2 fs-5 text-white">Confirmed Indian: ${stateData.confirmedCasesIndian}</div>
                <div class="col-6 p-2 fs-5 text-warning">Confirmed Foreign: ${stateData.confirmedCasesForeign}</div>
                <div class="col-6 p-2 fs-5 text-success">Discharged: ${stateData.discharged}</div>
                <div class="col-6 p-2 fs-5 text-danger">Deaths: ${stateData.deaths}</div>
                <div class="col-12 p-2 fs-5 mt-1 fw-bold text-primary">Total Confirmed: ${stateData.totalConfirmed}</div>
            </div>
        `;

            // Show the chart container

            chartWrapper.style.display = 'block';

            const ctx = document.getElementById('stateCovidChart').getContext('2d');
            if (covidChart) covidChart.destroy();

            covidChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Confirmed Indian', 'Confirmed Foreign', 'Discharged', 'Total Confirmed', 'Deaths'],
                    datasets: [{
                        label: `${stateData.loc} Covid Data`,
                        data: [
                            stateData.confirmedCasesIndian,
                            stateData.confirmedCasesForeign,
                            stateData.discharged,
                            stateData.totalConfirmed,
                            stateData.deaths
                        ],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointBackgroundColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        pointRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, 
                    plugins: { legend: { display: true } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        });
}
