(function(){
    "use strict()"

    const STORAGE_KEY = "agrosens_telemetry_records_v1"

    const sensorForm = document.getElementById("sensor-form");
    const sensorNumber = document.getElementById("sensor-number");
    const phLevel = document.getElementById("ph-level");
    const temperature = document.getElementById("tempurature");
    const btnSubmit = document.getElementById("btn-submit");
    const btnClearAll = document.getElementById("btn-clear-all");
    const emptyState = document.getElementById("empty-state");
    const logList = document.getElementById("log-list");

    let logs = loadLogs();
    render();


})