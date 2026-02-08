/**
 * Climate Dashboard - Main Application
 */

const state = {
    co2Data: null,
    temperatureData: null,
    seaIceData: null,
    charts: {},
    isDarkMode: true
};

const CONFIG = {
    dataPath: './data/',
    chartColors: {
        co2: { current: '#f97316', previous: '#fb923c80' },
        temperature: { positive: '#ef4444', negative: '#3b82f6' },
        seaIce: { colors: ['#22d3ee', '#14b8a6', '#6366f1', '#a855f7', '#ec4899'], median: '#6b728080' }
    }
};

const utils = {
    formatNumber: (num, dec = 2) => num == null ? '--' : Number(num).toFixed(dec),
    formatDate: (str) => str ? new Date(str).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--',
    getMonthName: (m) => ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][m - 1] || '',
    showError: (id, msg) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = `<div class="error-message flex items-center justify-center h-full"><div class="text-center"><svg class="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg><p class="text-sm">${msg}</p></div></div>`;
    }
};

async function fetchData(file) {
    try {
        const res = await fetch(`${CONFIG.dataPath}${file}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (e) { console.error(`Error fetching ${file}:`, e); return null; }
}

async function loadAllData() {
    const [co2, temp, ice] = await Promise.all([
        fetchData('co2_monthly.json'),
        fetchData('temperature_anomaly.json'),
        fetchData('sea_ice_extent.json')
    ]);
    state.co2Data = co2; state.temperatureData = temp; state.seaIceData = ice;
    return !!(co2 || temp || ice);
}

// Update Summary Stats
function updateStats() {
    // CO2 Stats
    if (state.co2Data && state.co2Data.data && state.co2Data.data.length > 0) {
        const latestCO2 = state.co2Data.data[state.co2Data.data.length - 1];
        const previousYearCO2 = state.co2Data.data.find(d =>
            d.year === latestCO2.year - 1 && d.month === latestCO2.month
        );

        // Update date
        const co2Date = document.getElementById('co2-date');
        if (co2Date) co2Date.textContent = `${utils.getMonthName(latestCO2.month)} ${latestCO2.year} •`;

        // Calculate Difference (Main KPI)
        let change = 0;
        if (previousYearCO2) {
            change = latestCO2.average - previousYearCO2.average;
        }

        const kpiEl = document.getElementById('co2-kpi');
        if (kpiEl) {
            kpiEl.textContent = (change >= 0 ? '+' : '') + utils.formatNumber(change, 2);
            // Color logic: Increase (bad) -> Red, Decrease (good) -> Teal
            kpiEl.className = `text-3xl font-bold ${change >= 0 ? 'text-climate-accent-red' : 'text-climate-accent-teal'}`;
        }

        // Absolute Value (Subtitle)
        const absEl = document.getElementById('co2-absolute');
        if (absEl) {
            absEl.innerHTML = `
                <div class="flex flex-col sm:inline">
                    <span>Aktuell: <span class="text-climate-text-primary font-medium">${utils.formatNumber(latestCO2.average, 2)} ppm</span></span>
                    <span class="text-climate-text-secondary text-[10px] sm:text-xs opacity-75 sm:ml-1">(Änderung zum Vorjahr)</span>
                </div>
            `;
        }
    }

    // Temperature Stats
    if (state.temperatureData && state.temperatureData.data && state.temperatureData.data.length > 0) {
        const latestTemp = state.temperatureData.data[state.temperatureData.data.length - 1];
        document.getElementById('current-temp').textContent =
            (latestTemp.anomaly >= 0 ? '+' : '') + utils.formatNumber(latestTemp.anomaly, 2);

        // Update date
        const tempDate = document.getElementById('temp-date');
        if (tempDate) tempDate.textContent = `${utils.getMonthName(latestTemp.month)} ${latestTemp.year} •`;

        if (state.temperatureData.baseline) {
            document.getElementById('temp-baseline').textContent = state.temperatureData.baseline;
        }
    }

    // Sea Ice Stats
    if (state.seaIceData && state.seaIceData.data) {
        const years = Object.keys(state.seaIceData.data).sort().reverse();
        if (years.length > 0) {
            const latestYear = years[0];
            const latestYearData = state.seaIceData.data[latestYear];
            const latestMonth = latestYearData[latestYearData.length - 1];

            if (latestMonth) {
                // Update date
                const iceDate = document.getElementById('ice-date');
                if (iceDate) iceDate.textContent = `${utils.getMonthName(latestMonth.month)} ${latestYear} •`;

                // Calculate Difference (Main KPI)
                let diff = 0;
                if (state.seaIceData.median && state.seaIceData.median[latestMonth.month]) {
                    const median = state.seaIceData.median[latestMonth.month];
                    diff = latestMonth.extent - median;
                }

                const kpiEl = document.getElementById('ice-kpi');
                if (kpiEl) {
                    kpiEl.textContent = (diff >= 0 ? '+' : '') + utils.formatNumber(diff, 2);
                    // Color logic: Decrease (bad) -> Red, Increase (good) -> Teal
                    kpiEl.className = `text-3xl font-bold ${diff >= 0 ? 'text-climate-accent-teal' : 'text-climate-accent-red'}`;
                }

                // Absolute Value (Subtitle)
                const absEl = document.getElementById('ice-absolute');
                if (absEl) {
                    absEl.innerHTML = `
                        <div class="flex flex-col sm:inline">
                            <span>Ausdehnung: <span class="text-climate-text-primary font-medium">${utils.formatNumber(latestMonth.extent, 2)} Mio. km²</span></span>
                            <span class="text-climate-text-secondary text-[10px] sm:text-xs opacity-75 sm:ml-1">(Diff. zum 1981-2010 Mittel)</span>
                        </div>
                    `;
                }
            }
        }
    }
    const upd = state.co2Data?.last_updated || state.temperatureData?.last_updated || state.seaIceData?.last_updated;
    if (upd) document.getElementById('last-updated').textContent = utils.formatDate(upd);
}

function getChartBase() {
    const dk = state.isDarkMode;
    return {
        chart: { background: 'transparent', toolbar: { show: true }, animations: { enabled: true, easing: 'easeinout', speed: 800 } },
        theme: { mode: dk ? 'dark' : 'light' },
        grid: { borderColor: dk ? '#374151' : '#e5e7eb', strokeDashArray: 4 },
        tooltip: { theme: dk ? 'dark' : 'light', style: { fontSize: '12px' } },
        legend: { labels: { colors: dk ? '#9ca3af' : '#4b5563' } },
        xaxis: { labels: { style: { colors: dk ? '#9ca3af' : '#4b5563' } }, axisBorder: { color: dk ? '#374151' : '#e5e7eb' } },
        yaxis: { labels: { style: { colors: dk ? '#9ca3af' : '#4b5563' } } }
    };
}

// Helper to calculate monthly averages for a baseline period
function getMonthlyBaseline(data, startYear, endYear) {
    const monthlySums = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);

    data.forEach(d => {
        if (d.year >= startYear && d.year <= endYear && d.month >= 1 && d.month <= 12) {
            monthlySums[d.month - 1] += d.average;
            monthlyCounts[d.month - 1]++;
        }
    });

    return monthlySums.map((sum, i) => monthlyCounts[i] > 0 ? sum / monthlyCounts[i] : null);
}

function renderCO2Chart() {
    const el = document.getElementById('co2-chart');
    if (!el || !state.co2Data?.data?.length) { utils.showError('co2-chart', 'CO₂-Daten nicht verfügbar'); return; }

    // Group data by year
    const dataByYear = {};
    state.co2Data.data.forEach(d => {
        if (!dataByYear[d.year]) dataByYear[d.year] = new Array(12).fill(null);
        if (d.month >= 1 && d.month <= 12) dataByYear[d.year][d.month - 1] = d.average;
    });

    const outputYears = Object.keys(dataByYear).sort().reverse().slice(0, 5); // Last 5 years
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

    const series = outputYears.map(year => ({
        name: year,
        data: dataByYear[year]
    }));

    // Add Baseline (1991-2020)
    // Note: CO2 baseline is tricky because of the strong trend. 
    // An average of 1991-2020 (~385ppm) will be much lower than 2026 (~430ppm).
    // But this visualizes the pure 'Change' effectively.
    // Alternatively, we could detrend, but user asked for "CO2 Konzentration" (absolute).
    const baselineData = getMonthlyBaseline(state.co2Data.data, 1991, 2020);
    series.push({ name: '1991-2020 Mittel', data: baselineData });

    const base = getChartBase();

    // Vibrant colors for recent years, Grey for baseline
    // 2026 (Bright), 2025... fade out. Baseline is Grey.
    const colors = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#9ca3af'];

    const opts = {
        ...base,
        chart: { ...base.chart, type: 'line', height: '100%' },
        series: series,
        colors: colors.slice(0, series.length),
        stroke: {
            curve: 'smooth',
            width: series.map((_, i) => i === series.length - 1 ? 2 : 3), // Baseline thinner
            dashArray: series.map((_, i) => i === series.length - 1 ? 5 : 0) // Baseline dashed
        },
        markers: { size: 0, hover: { size: 6 } },
        xaxis: {
            ...base.xaxis,
            categories: months,
            labels: { style: { colors: state.isDarkMode ? '#9ca3af' : '#4b5563' } }
        },
        yaxis: {
            ...base.yaxis,
            title: { text: 'CO₂ (ppm)', style: { color: state.isDarkMode ? '#9ca3af' : '#4b5563' } },
            labels: {
                style: { colors: state.isDarkMode ? '#9ca3af' : '#4b5563' },
                formatter: (value) => value.toFixed(0)
            }
        },
        legend: { ...base.legend, position: 'top', horizontalAlign: 'center' },
        tooltip: { ...base.tooltip, y: { formatter: v => v ? v.toFixed(2) + ' ppm' : 'N/A' } }
    };

    if (state.charts.co2) state.charts.co2.destroy();
    state.charts.co2 = new ApexCharts(el, opts); state.charts.co2.render();
}

function renderTemperatureChart() {
    const el = document.getElementById('temperature-chart');
    if (!el || !state.temperatureData?.data?.length) { utils.showError('temperature-chart', 'Temperaturdaten nicht verfügbar'); return; }
    const data = state.temperatureData.data.slice(-360);
    const base = getChartBase();
    const opts = {
        ...base, chart: { ...base.chart, type: 'bar', height: '100%' },
        series: [{ name: 'Anomalie', data: data.map(d => ({ x: `${d.year}-${String(d.month).padStart(2, '0')}`, y: d.anomaly })) }],
        plotOptions: { bar: { borderRadius: 0, columnWidth: '95%', colors: { ranges: [{ from: -10, to: 0, color: CONFIG.chartColors.temperature.negative }, { from: 0, to: 10, color: CONFIG.chartColors.temperature.positive }] } } },
        dataLabels: { enabled: false },
        xaxis: { ...base.xaxis, type: 'category', labels: { rotate: -45, hideOverlappingLabels: true, formatter: v => { if (!v) return ''; const p = v.split('-'); return p[1] === '01' ? p[0] : ''; } }, tickAmount: 10 },
        yaxis: { ...base.yaxis, title: { text: 'Anomalie (°C)', style: { color: state.isDarkMode ? '#9ca3af' : '#4b5563' } }, labels: { formatter: v => v.toFixed(1) } },
        tooltip: { ...base.tooltip, x: { formatter: v => { const p = v.split('-'); return `${utils.getMonthName(parseInt(p[1]))} ${p[0]}`; } }, y: { formatter: v => (v >= 0 ? '+' : '') + v.toFixed(2) + '°C' } }
    };
    if (state.charts.temperature) state.charts.temperature.destroy();
    state.charts.temperature = new ApexCharts(el, opts); state.charts.temperature.render();
}

function renderSeaIceChart() {
    const el = document.getElementById('seaice-chart');
    if (!el || !state.seaIceData?.data) { utils.showError('seaice-chart', 'Meereis-Daten nicht verfügbar'); return; }
    const years = Object.keys(state.seaIceData.data).sort().reverse().slice(0, 5);
    const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const series = years.map(y => {
        const yd = state.seaIceData.data[y], md = new Array(12).fill(null);
        yd.forEach(d => { if (d.month >= 1 && d.month <= 12) md[d.month - 1] = d.extent; });
        return { name: y, data: md };
    });
    if (state.seaIceData.median) {
        const md = new Array(12).fill(null);
        Object.keys(state.seaIceData.median).forEach(m => { const i = parseInt(m) - 1; if (i >= 0 && i < 12) md[i] = state.seaIceData.median[m]; });
        series.push({ name: '1981-2010 Median', data: md });
    }
    const base = getChartBase();

    // Cyan Gradient for Sea Ice (Strongest to Palest)
    // Matches the style of CO2 chart (Vibrant -> Faded)
    const gradientColors = ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#cffafe'];
    const colors = gradientColors.slice(0, years.length);

    if (state.seaIceData.median) colors.push('#9ca3af'); // Grey for median

    const opts = {
        ...base, chart: { ...base.chart, type: 'line', height: '100%' },
        series, colors, stroke: { curve: 'smooth', width: series.map((_, i) => i === series.length - 1 && state.seaIceData.median ? 2 : 3), dashArray: series.map((_, i) => i === series.length - 1 && state.seaIceData.median ? 5 : 0) },
        markers: { size: 0, hover: { size: 6 } }, xaxis: { ...base.xaxis, categories: months },
        yaxis: { ...base.yaxis, title: { text: 'Ausdehnung (Mio. km²)', style: { color: state.isDarkMode ? '#9ca3af' : '#4b5563' } }, min: 0, max: 18, tickAmount: 6 },
        legend: { ...base.legend, position: 'top', horizontalAlign: 'center' },
        tooltip: { ...base.tooltip, y: { formatter: v => v ? v.toFixed(2) + ' Mio. km²' : 'N/A' } }
    };
    if (state.charts.seaIce) state.charts.seaIce.destroy();
    state.charts.seaIce = new ApexCharts(el, opts); state.charts.seaIce.render();
}

function renderAllCharts() { renderCO2Chart(); renderTemperatureChart(); renderSeaIceChart(); }

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle'), sun = document.getElementById('sun-icon'), moon = document.getElementById('moon-icon');
    const saved = localStorage.getItem('theme'), prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.isDarkMode = saved ? saved === 'dark' : prefDark;
    update();
    toggle.addEventListener('click', () => { state.isDarkMode = !state.isDarkMode; localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light'); update(); renderAllCharts(); });
    function update() { document.body.classList.toggle('light', !state.isDarkMode); sun.classList.toggle('hidden', state.isDarkMode); moon.classList.toggle('hidden', !state.isDarkMode); }
}

function hideLoading() { const o = document.getElementById('loading-overlay'); if (o) o.classList.add('hidden'); }

async function init() {
    console.log('🌍 Climate Dashboard initializing...');
    initThemeToggle();
    const ok = await loadAllData();
    if (ok) { updateStats(); renderAllCharts(); console.log('✅ Dashboard loaded'); }
    else { utils.showError('co2-chart', 'Daten nicht verfügbar'); utils.showError('temperature-chart', 'Daten nicht verfügbar'); utils.showError('seaice-chart', 'Daten nicht verfügbar'); }
    hideLoading();
}

let resizeTO; window.addEventListener('resize', () => { clearTimeout(resizeTO); resizeTO = setTimeout(() => Object.values(state.charts).forEach(c => c?.resize()), 250); });
document.addEventListener('DOMContentLoaded', init);
