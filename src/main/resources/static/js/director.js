// Director Portal Logic

// Mock Data
const dataStore = {
    payment: {
        daily: { total: '15,000,000', label: "Today's Revenue", click: 6000000, payme: 5000000, cash: 4000000 },
        weekly: { total: '95,500,000', label: "This Week's Revenue", click: 40000000, payme: 35000000, cash: 20500000 },
        monthly: { total: '380,200,000', label: "This Month's Revenue", click: 150000000, payme: 130200000, cash: 100000000 }
    },
    attendance: {
        daily: { labels: ['8-A', '8-B', '9-A', '9-B', '10-A'], data: [98, 95, 99, 92, 100] },
        weekly: { labels: ['8-A', '8-B', '9-A', '9-B', '10-A'], data: [96, 94, 98, 93, 99] },
        monthly: { labels: ['8-A', '8-B', '9-A', '9-B', '10-A'], data: [95, 92, 97, 95, 98] }
    }
};

let revenueChartInstance = null;
let attendanceChartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();

    // Initialize charts
    initRevenueChart('daily');
    initAttendanceChart('daily');
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.getAttribute('href') && item.getAttribute('href').includes('index.html')) return;
            e.preventDefault();
            // In a real MVP, sections could be separated, but current Director view shows everything in one long scrolling page (Overview mode)
            // Just simulate active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// Chart Configurations
function initRevenueChart(period) {
    const ctx = document.getElementById('revenueChart').getContext('2d');

    // Destroy previous instance
    if(revenueChartInstance) {
        revenueChartInstance.destroy();
    }

    const d = dataStore.payment[period];

    revenueChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Click', 'Payme', 'Cash'],
            datasets: [{
                data: [d.click, d.payme, d.cash],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // Click blue
                    'rgba(139, 92, 246, 0.8)', // Payme purple
                    'rgba(16, 185, 129, 0.8)'  // Cash green
                ],
                borderColor: 'transparent',
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#cbd5e1', padding: 20, font: { family: 'Outfit', size: 13 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ' ' + new Intl.NumberFormat('uz-UZ').format(context.raw) + ' UZS';
                        }
                    }
                }
            }
        }
    });

    // Update stats boxes above
    updateStatsGrid(period);
}

function initAttendanceChart(period) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');

    if(attendanceChartInstance) {
        attendanceChartInstance.destroy();
    }

    const d = dataStore.attendance[period];

    attendanceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: d.labels,
            datasets: [{
                label: 'Attendance Rate (%)',
                data: d.data,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 80,
                    max: 100,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8b949e' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#8b949e', font: { family: 'Outfit' } }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw + '% Present';
                        }
                    }
                }
            }}
        });
}

    function updateStatsGrid(period) {
        const d = dataStore.payment[period];

        document.getElementById('statLabel1').innerText = d.label;
        document.getElementById('statVal1').innerText = d.total + ' UZS';

        document.getElementById('statVal2').innerText = new Intl.NumberFormat('uz-UZ').format(d.click) + ' UZS';
        document.getElementById('statVal3').innerText = new Intl.NumberFormat('uz-UZ').format(d.payme) + ' UZS';
        document.getElementById('statVal4').innerText = new Intl.NumberFormat('uz-UZ').format(d.cash) + ' UZS';
    }

    function handleRevenueFilter(e) {
        const period = e.target.value;
        initRevenueChart(period);
    }

    function handleAttendanceFilter(e) {
        const period = e.target.value;
        initAttendanceChart(period);
    }
