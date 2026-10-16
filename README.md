4.1 
● Upon opening the site application, the UI will show a portal for the greenhouse 
employees to log sensor information. If the user has made previous recordings, those 
would be there as well. 
● While the user enters sensor data, there will be a passively running javascript file that 
will be checking if the data entered is correctly in the constraints. If the data is out of 
bounds, a notification will appear somewhere on the page informing the user of their 
mistake before they can enter it. 
● When the user submits the information, the portal will calculate and display an 
environmental status tag alerting them as to whether or not the greenhouse is in a(n) 
“Optimal”, “Warning”, or a “Critical Hazard” state. 
● Upon receiving a valid submission, the site will show a card somewhere on the screen 
with the previously mentioned status tag, as well as relevant information to that sensor. 
● Users can interact with the output portion by removing an individual log or the whole list. 
● A complete user interaction with this website (assuming they only add and/or delete one 
log per use) would go as follows: 
○ The user would open the site to check on the log on a tablet that a co-worker has 
entered, and they see that there is a “critical” tag on one of the sensors. They 
leave whatever space they were in to find the greenhouse with the offending 
sensor, losing the internet signal, but keeping the data in the page because it was 
saved locally. After reconnecting and inspecting the sensor, as well as likely 
clearing up what was causing the warning to occur, they would manually enter a 
new log, but accidentally enter a negative pH, throwing an error to the page. 
They correct the error and enter logs that return an “optimal” result. Satisfied with 
this new result, they would delete the older log as it no longer is correct for the 
current situation. 
4.2 
Gulf of Execution - Each entry field will be paired with a <label> tag containing a 
descriptor. Every descriptor will do as the name insists and describe the unit necessary. 
Examples of this can and likely will include “pH (0-14)”, “Temperature (F)”, or “Humidity (%)”. To 
avoid incorrect input, numerical fields would have to be labeled in HTML with a “type=’number’” 
element, which should immediately flag the user to know that they need to use numbers. 
Gulf of Evaluation - After a user clicks the “Record Reading” button, the site will use 
Javascript to calculate the given information and compare it against the values given to 
determine the correct status badge to output. 
System Constraint - To avoid impossible scientific values from being entered, I will use 
the “min=” and “max=” semantic tags with the range of 0.0 and 14.0 respectively. These tags will 
flag the user after submission that the field can only accept numbers. 
Visual Feedback State - JavaScript is able to listen for the input event on each sensor 
field, so if a value falls out of bounds it would trigger an error class in CSS that will likely make 
the border red and cause a dialogue bubble explaining what went wrong. Once the error is 
removed, it reverts to normal. 
Error Recovery - The software should be able to automatically get rid of most errors like 
out of bounds numbers, or incorrect information types in certain fields. In the case of test data 
insertions however, each data card will have a delete button on it and the entire log history will 
have a purge feature that would get rid of everything 
4.3 
● <body> 
○ <header class=”portal-header”>  
■ <div class=”header-content”> (max-width, margins, flex, space-between, 
centered) [STATIC] 
● <div class=”logo”> [STATIC] 
○ <span class=”icon”> [STATIC] 
○ <h1> company name  [STATIC] 
● <div class=”warnings”> [STATIC] 
○ <span class=”count” id=”queue”> [DYNAMIC] 
○ <main class=”portal-container”> (max-width, padding, display:grid, gap, width) 
[STATIC] 
■ <aside class=”form-panel”> [STATIC] 
● <h2 class=”title”> [STATIC] 
■ <div class=”alert”> [DYNAMIC] 
■ <form id=”logger”> [STATIC] 
● <div class=”form-group”> (flex, column) [STATIC] 
○ <label for=”obj1” class=”form-label”> [STATIC] 
○ <input type=”number” name=”sensor-num” 
id=”sensor-num” class=”form-control” placeholder=”Sensor 
#” required> [DYNAMIC] 
● <div class=”form-group”> (flex, column) [STATIC] 
○ <label for=”obj2” class=”form-label”> [STATIC] 
○ <input type=”number” name=”ph-log” id=”ph-log” 
class=”form-control” placeholder=”pH %” min=”0.0” 
max=”14.0” required> [DYNAMIC] 
● <div class=”form-group”> (flex, column) [STATIC] 
○ <label for=”obj3” class=”form-label”> [STATIC] 
○ <input type=”date” name=”water-date” id=”water-date” 
class=”form-control” placeholder=”Last watering” required> 
[DYNAMIC] 
● <button type=”submit” id=”submit” class=”btn primary”> 
[DYNAMIC]  
■ <section class=”panel log-panel”> (flex grid) [STATIC]  
● <div class=”log-header”> [STATIC]  
○ <h2 class=”title”> [STATIC]  
○ <button id=”purge-btn” class=”btn purge”> [STATIC]  
● <div id=”empty” class=”empty”> [DYNAMIC] 
●  <ul id=”log-list” class=”log-grid”> (text-align:center, display: block) 
[DYNAMIC] 
○ <footer> [STATIC]  
4.4 
cosnt logGreenhouseSensorData = { 
id: "int", // Unique numeric identifier 
plantName: "String", // Specific plant species  
phPercent: "double", // logged pH level 
lastWater: "int", // preferred date format (YYYY-MM-DD)  
manual: "bool", // Check if log is manually created 
};  
