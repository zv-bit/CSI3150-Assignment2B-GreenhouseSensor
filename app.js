(function(){
    "use strict()"

    const STORAGE_KEY = "agrosens_telemetry_records_v1"

    const sensorForm = document.getElementById("sensor-form");
    const btnSubmit = document.getElementById("btn-submit");
    const btnClearAll = document.getElementById("btn-clear-all");
    const emptyState = document.getElementById("empty-state");
    const logList = document.getElementById("log-list");
    const queueCount = document.getElementById("queue-count");

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

    function plantRisk(inputPh,inputTemp,inputEc,inputHumidity){
        if ((inputPh<5.0||inputPh<7.5) && (inputTemp<55||inputTemp>95) && (inputEc<0.2||inputEc>4.5)&&(inputHumidity<30||inputHumidity>90)){
            return {level:"critical",label:"Critical"};
        } 
        else if ((5.5<=inputPh<=6.5) && (64.4<=inputTemp<=71.6) && (1.0<=inputEc<=2.0)&&(50<=inputHumidity<=70)){
            return {level:"optimal",label:"Optimal"};
        }
        else {
            return {level:"warning",label:"Warning"};
        }
    }
    
    function validation(data){
        const errors = [];

        if(!data.sensor.trim()){
            errors.push("Sensor Number is a required Field");
        }
        if (isNaN(data.level)||data.level<0||data.level>14){
            errors.push("pH level must be a number between 0 and 14");
        }
        if (isNaN(data.inputTemp)){
            errors.push("Temperature must have an input");
        }
        if (isNaN(data.inputEc)){
            errors.push("Electrical conductivity must have an input");
        }
        if (isNaN(data.inputHumidity||data.inputHumidity<0||data.inputHumidity>100)){
            errors.push("Humidity must be a percentile number between 0 and 100");
        }
        return errors;
    }

    sensorForm.addEventListener("submit",(event)=>{
        event.preventDefault();
        const formData={
            id:crypto.randomUUID(),
            sensor: inputSensor.value,
            phlevel: parseInt(inputPh.value,10),
            temp:parseInt(inputTemp.value,10),
            ec:parseInt(inputEc.value,10),
            humidity:parseInt(inputHumidity.value,10),
            timestamp: new Date().toLocaleTimeString([],{ month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})};
            
        const validationErrors  = validation(formData);

        if (validationErrors.length > 0){
            displayError(validationErrors.join(" "));
            return;
        }

        hideError();

        formData.risk = plantRisk(
            formData.phlevel,
            formData.temp,
            formData.ev,
            formData.humidity,);
        
        logs.unshift(formData);
        saveLogs();
        sensorForm.reset();
        inputSensor.focus();
    });
    
    logList.addEventListener("click",function(event) {
        const target = event.target;
        if (target.classList.contains("btn-remove")){
            const recordId = target.dataset.id;
            records = logs.filter(function (record){
                return record.id !== recordId;
            });
            saveRecords();
            render();
        }
    });

    btnClearAll.addEventListener("click",(event)=>{
        if (logs.length===0) return;
        if (confirm("Are you sure you want to delete all previous logs?")){
            records = [];
            saveRecords();
            render();
        }
    });

    function render() {
        queueCount.textContent = logs.length;

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
                    <div class="patient-name-text">${escapeHtml(rec.sensor)} </div>
                    <div class="timestamp">Logged at ${rec.timestamp} </div> 
                    <span class="risk-badge ${rec.risk.level}">${rec.risk.label}</span>            
                </div>
                <div class="vital-stats">
                  <div class="stat-item"><span>pH Level</span>${rec.phlevel}</div>
                  <div class="stat-item"><span>Electronic Current</span>${rec.ec}</div>
                  <div class="stat-item"><span>Humidity</span>${rec.humidity} %</div>
                  <div class="stat-item"><span>Temperature</span>${rec.temp.toFixed(1)} F </div> 
                </div>
                <button class="btn btn-outline-danger btn-sm btn-discharge" data-id="${rec.id}">Discharge Patient </button>        
            </div>`;

          // add the above html to the vritual dom
          fragment.appendChild(li);
        });

        // reset the UI
        logList.innerHTML = "";
        // add the docu fragment to the REaL dom
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