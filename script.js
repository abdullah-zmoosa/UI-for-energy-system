document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    populatePanelStatus();
    setInterval(updateCharts, 5000); // Update every 5 seconds
    document.getElementById('disableAll').addEventListener('click', disableAllPanels);
    document.getElementById('enableAll').addEventListener('click', enableAllPanels);
    document.getElementById('startVoiceCommand').addEventListener('click', startVoiceCommand);
});

function initializeCharts() {
    window.solarRadianceChart = new Chart(document.getElementById('solarRadianceChart').getContext('2d'), {
        type: 'bar',
        data: generateSolarRadianceData(),
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    window.powerOutputChart = new Chart(document.getElementById('powerOutputChart').getContext('2d'), {
        type: 'line',
        data: generatePowerOutputData(),
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    window.energyStorageChart = new Chart(document.getElementById('energyStorageChart').getContext('2d'), {
        type: 'bar',
        data: generateEnergyStorageData(),
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function generateSolarRadianceData() {
    return {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
        datasets: [{
            label: 'Solar Radiance (kW/m²)',
            data: Array.from({ length: 8 }, () => (Math.random() * 0.8).toFixed(2)),
            backgroundColor: '#0072ff'
        }]
    };
}

function generatePowerOutputData() {
    return {
        labels: ['-5s', '-4s', '-3s', '-2s', '-1s', 'Now'],
        datasets: [{
            label: 'Power Output (kW)',
            data: Array.from({ length: 6 }, () => (Math.random() * 0.5).toFixed(2)),
            backgroundColor: '#0072ff',
            borderColor: '#0072ff',
            fill: false
        }]
    };
}

function generateEnergyStorageData() {
    return {
        labels: ['1', '2', '3'],
        datasets: [{
            label: 'Energy Storage (kWh)',
            data: Array.from({ length: 3 }, () => (Math.random() * 20).toFixed(2)),
            backgroundColor: '#0072ff'
        }]
    };
}

function updateCharts() {
    window.solarRadianceChart.data = generateSolarRadianceData();
    window.solarRadianceChart.update();

    window.powerOutputChart.data = generatePowerOutputData();
    window.powerOutputChart.update();

    window.energyStorageChart.data = generateEnergyStorageData();
    window.energyStorageChart.update();
}

function populatePanelStatus() {
    const panelStatusTable = document.getElementById('panelStatusTable');
    panelStatusTable.innerHTML = ''; // Clear existing rows

    for (let i = 1; i <= 8; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" checked></td>
            <td>${i}</td>
            <td>${(Math.random() * 0.8).toFixed(2)} kW/m²</td>
            <td>24.00 V</td>
            <td>${(Math.random() * 5).toFixed(2)} A</td>
        `;
        panelStatusTable.appendChild(row);
    }
}

function disableAllPanels() {
    document.querySelectorAll('#panelStatusTable input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
}

function enableAllPanels() {
    document.querySelectorAll('#panelStatusTable input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
    });
}

function startVoiceCommand() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support the Web Speech API. Please use Google Chrome.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = event => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
    };

    recognition.onerror = event => {
        console.error('Speech recognition error:', event.error);
    };
}

function handleVoiceCommand(command) {
    const resultElement = document.getElementById('voiceCommandResult');
    if (command.includes('disable all')) {
        disableAllPanels();
        resultElement.textContent = 'Command Result: All panels disabled.';
    } else if (command.includes('enable all')) {
        enableAllPanels();
        resultElement.textContent = 'Command Result: All panels enabled.';
    } else {
        resultElement.textContent = `Command Result: Unknown command "${command}".`;
    }
}
