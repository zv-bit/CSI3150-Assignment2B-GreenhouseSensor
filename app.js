(function(){
    "use strict";

    const STORAGE_KEY = "agrosens_telemetry_records_v1"

    const sensorForm = document.getElementById("sensor-form");
    const btnClearAll = document.getElementById("btn-clear-all");
    const emptyState = document.getElementById("empty-state");
    const logList = document.getElementById("log-list");
    const logCount = document.getElementById("log-count");
    const errorBanner = document.getElementById("form-error-banner");

    const inputEc = document.getElementById("electrical");
    const inputHumidity = document.getElementById("humidity");
    const inputSensor = document.getElementById("sensor-number");
    const inputPh = document.getElementById("ph-level");
    const inputTemp = document.getElementById("tempurature");

    let logs = loadLogs();
    render();

    function loadLogs(){
        try{
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored):[];
        } catch (error){
            console.error("Failed to load logs from data storage", error);
            return[];
        }
    }

    function saveLogs(){
        try {
            localStorage.setItem(STORAGE_KEY,JSON.stringify(logs));
        } catch (error) {
            console.error("Failed to write to your data storage",error);
        }
    }

function plantRisk(inputPh, inputTemp, inputEc, inputHumidity) {

    if ((inputPh<5.0||inputPh>7.5)&&(inputTemp<55||inputTemp>95)&&(inputEc<0.2||inputEc>4.5)&&(inputHumidity<30||inputHumidity>90)) 
    {
        return { level: "critical", label: "Critical" };
    }
    else if ((inputPh>=5.5&&inputPh<=6.5)&&(inputTemp>=64.4&&inputTemp<=71.6)&&(inputEc>=1.0&&inputEc<=2.0)&&(inputHumidity>=50&&inputHumidity<=70))
    {
        return { level: "optimal", label: "Optimal" };
    }
    else {
        return { level: "warning", label: "Warning" };
    }
}
    
    function validation(data){
        const errors = [];

        if(!data.sensor.trim()){
            errors.push("Sensor Number is a required Field");
        }
        if (isNaN(data.phlevel)||data.phlevel<0||data.phlevel>14){
            errors.push("pH level must be a number between 0 and 14");
        }
        if (isNaN(data.temp)){
            errors.push("Temperature must have an input");
        }
        if (isNaN(data.elect)){
            errors.push("Electrical conductivity must have an input");
        }
        if (isNaN(data.humidity||data.humidity<0||data.humidity>100)){
            errors.push("Humidity must be a percentile number between 0 and 100");
        }
        return errors;
    }

    sensorForm.addEventListener("submit",(event)=>{
        event.preventDefault();
        const formData={
            id:crypto.randomUUID(),
            sensor: inputSensor.value,
            phlevel: parseFloat(inputPh.value),
            temp:parseFloat(inputTemp.value),
            elect:parseFloat(inputEc.value),
            humidity:parseFloat(inputHumidity.value),
            timestamp: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
            
        const validationErrors  = validation(formData);

        if (validationErrors.length > 0){
            displayError(validationErrors.join(" "));
            return;
        }

        hideError();

        formData.risk = plantRisk(
            formData.phlevel,
            formData.temp,
            formData.elect,
            formData.humidity,);
        
        logs.unshift(formData);
        saveLogs();
        sensorForm.reset();
        inputSensor.focus();
        render();
    });
    
    logList.addEventListener("click",function(event) {
        const target = event.target;
        if (target.classList.contains("btn-remove")){
            const logId = target.dataset.id;
            logs = logs.filter(function (logged){
                return logged.id !== logId;
            });
            saveLogs();
            render();
        }
    });

    btnClearAll.addEventListener("click",(event)=>{
        if (logs.length===0) return;
        if (confirm("Are you sure you want to delete all previous logs?")){
            logs = [];
            saveLogs();
            render();
        }
    });

    function render() {
        logCount.textContent = logs.length;

        if (logs.length === 0) {
          emptyState.classList.remove("hidden");
          logList.innerHTML = "";
          return;
        }

        emptyState.classList.add("hidden");

        const fragment = document.createDocumentFragment();

        logs.forEach(function (rec) {
          const li = document.createElement("li");
          li.className = "sensor-card status-" + rec.risk.level;

          // create our dynamic card
          li.innerHTML = `<div class="card-top">
                <div>
                    <div class="sensor-name-text">Sensor: ${escapeHtml(rec.sensor)} </div>
                    <span class="warning-badge ${rec.risk.level}">${rec.risk.label}</span>
                    <div class="timestamp">Logged at ${rec.timestamp} </div> 
                </div>
                <div class="sensor-stats">
                  <div class="stat-item"><span>pH Level: </span>${rec.phlevel}</div>
                  <div class="stat-item"><span>Temperature: </span>${rec.temp.toFixed(1)} F </div> 
                  <div class="stat-item"><span>E-Current: </span>${rec.elect}</div>
                  <div class="stat-item"><span>Humidity: </span>${rec.humidity} %</div>
                </div>
                <button class="btn btn-outline-danger btn-sm btn-remove" data-id="${rec.id}">Remove Log</button>        
            </div>`;

          fragment.appendChild(li);
        });


        logList.innerHTML = "";
        logList.appendChild(fragment);
    }

    function displayError(message){
        errorBanner.textContent=message;
        errorBanner.classList.remove("hidden");
    }

    function hideError(){
      errorBanner.textContent="";
      errorBanner.classList.add("hidden");
    }

    function escapeHtml(str) {
        return str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
    }


})();