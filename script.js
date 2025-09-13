document.addEventListener("DOMContentLoaded", function () {
    setupCalendar();
    document.getElementById("editModeButton").addEventListener("click", toggleEditMode);  // Button Event Listener hinzufügen
});

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let weekStart = 1; // Standard: Sonntag (0), Montag wäre (1)
let editMode = false; // Variable für den Bearbeitungsmodus

// Speichern der Änderungen in localStorage
function saveChanges(day, shiftValue, colorValue) {
    const savedData = JSON.parse(localStorage.getItem("calendarData")) || {};
    savedData[`${currentYear}-${currentMonth}-${day}`] = { shift: shiftValue, color: colorValue };
    localStorage.setItem("calendarData", JSON.stringify(savedData));
}

// Wiederherstellen der Änderungen aus localStorage
function restoreChanges(dayElement, day) {
    const savedData = JSON.parse(localStorage.getItem("calendarData")) || {};
    const key = `${currentYear}-${currentMonth}-${day}`;
    if (savedData[key]) {
        const { shift, color } = savedData[key];
        const shiftInput = dayElement.querySelector(".shift-input");
        const colorPicker = dayElement.querySelector(".color-picker");
        const shiftDisplay = dayElement.querySelector(".shift-display");

        // Wiederherstellen der Farbe
        if (colorPicker) {
            colorPicker.value = color;
            dayElement.style.backgroundColor = color;
        }

        // Wiederherstellen des shift-Werts und im sichtbaren Bereich anzeigen
        if (shiftInput) {
            shiftInput.value = shift;
        }
        if (shiftDisplay) {
            shiftDisplay.textContent = shift || ''; // Text für die Schicht anzeigen
        }
    }
}

function setupCalendar() {
    createCalendar();
    document.getElementById("prevMonth").addEventListener("click", () => changeMonth(-1));
    document.getElementById("nextMonth").addEventListener("click", () => changeMonth(1));
    document.getElementById("weekStartSelect").addEventListener("change", (e) => {
        weekStart = parseInt(e.target.value);
        createCalendar();
    });
}

function toggleEditMode() {
    editMode = !editMode; // Bearbeitungsmodus umschalten
    const shiftInputs = document.querySelectorAll('.shift-input');
    const colorPickers = document.querySelectorAll('.color-picker');
    const shiftDisplays = document.querySelectorAll('.shift-display');

    // Alle Schicht-Inputs und Farb-Picker je nach Bearbeitungsmodus ein- oder ausblenden
    shiftInputs.forEach(input => {
        input.style.display = editMode ? 'inline' : 'none';  // Sichtbarkeit steuern
    });
    colorPickers.forEach(input => {
        input.style.display = editMode ? 'inline' : 'none';  // Sichtbarkeit steuern
    });
    shiftDisplays.forEach(display => {
        display.style.display = editMode ? 'none' : 'inline';  // Schicht-Wert im Text anzeigen, wenn nicht im Bearbeitungsmodus
    });

    // Button Text ändern, um den Benutzer zu informieren
    document.getElementById("editModeButton").textContent = editMode ? 'Bearbeitungsmodus deaktivieren' : 'Bearbeitungsmodus aktivieren';

    // Wenn der Bearbeitungsmodus deaktiviert wird, müssen wir die Änderungen anzeigen
    if (!editMode) {
        updateShiftValues();
    }
}

// Diese Funktion stellt sicher, dass die Schicht-Werte auch nach dem Deaktivieren des Bearbeitungsmodus korrekt angezeigt werden.
function updateShiftValues() {
    const days = document.querySelectorAll('.day');
    days.forEach(dayElement => {
        const dayText = dayElement.querySelector('.day-text');
        const day = parseInt(dayText.textContent);
        const shiftDisplay = dayElement.querySelector('.shift-display');
        
        // Daten aus localStorage abrufen und anzeigen
        const savedData = JSON.parse(localStorage.getItem("calendarData")) || {};
        const key = `${currentYear}-${currentMonth}-${day}`;
        if (savedData[key]) {
            const { shift } = savedData[key];
            shiftDisplay.textContent = shift || '';  // Schichtwert anzeigen
        }
    });
}

function createCalendar() {
    const calendar = document.getElementById("calendar");
    const header = document.getElementById("calendar-header");
    calendar.innerHTML = ""; // Kalender leeren
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Monat und Jahr setzen
    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    header.innerText = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Wochentage anpassen
    const weekDays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const adjustedWeekDays = [...weekDays.slice(weekStart), ...weekDays.slice(0, weekStart)];
    let weekRow = document.createElement("div");
    weekRow.classList.add("week-row");
    adjustedWeekDays.forEach(day => {
        let dayElement = document.createElement("div");
        dayElement.classList.add("weekday");
        dayElement.innerText = day;
        weekRow.appendChild(dayElement);
    });
    calendar.appendChild(weekRow);
    
    // Leere Felder für den ersten Tag des Monats auffüllen
    let week = document.createElement("div");
    week.classList.add("week");
    let startOffset = (firstDay - weekStart + 7) % 7;
    for (let i = 0; i < startOffset; i++) {
        let emptyCell = document.createElement("div");
        emptyCell.classList.add("day", "empty");
        week.appendChild(emptyCell);
    }
    
    // Tage des Monats einfügen
    for (let day = 1; day <= daysInMonth; day++) {
        let dayElement = document.createElement("div");
        dayElement.classList.add("day");

        // Erstellen eines sichtbaren Textes für den Tag (immer sichtbar)
        let dayText = document.createElement("span");
        dayText.classList.add("day-text");
        dayText.textContent = day;  // Zeigt den Tag des Monats an
        dayElement.appendChild(dayText);

        // Erstellen eines sichtbaren Textes für die Schicht (immer sichtbar)
        let shiftDisplay = document.createElement("span");
        shiftDisplay.classList.add("shift-display");
        shiftDisplay.style.display = "inline"; // Immer sichtbar
        dayElement.appendChild(shiftDisplay);

        // Schicht Input (wird im Bearbeitungsmodus angezeigt)
        dayElement.innerHTML += `<input type='text' class='shift-input' placeholder='Schicht' style='display:none;'>`; 

        let colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.classList.add("color-picker");
        colorPicker.style.display = "none";  // Standardmäßig ausblenden
        colorPicker.addEventListener("input", (e) => {
            changeDayColor(dayElement, e.target.value);
            saveChanges(day, dayElement.querySelector(".shift-input").value, e.target.value); // Änderungen speichern
        });
        dayElement.appendChild(colorPicker);
        
        week.appendChild(dayElement);
        
        // Änderungen wiederherstellen
        restoreChanges(dayElement, day);

        // shift-input Änderungen speichern
        const shiftInput = dayElement.querySelector(".shift-input");
        shiftInput.addEventListener("change", (e) => {
            saveChanges(day, e.target.value, dayElement.querySelector(".color-picker").value); // Änderungen speichern
        });
        
        // Neue Zeile beginnen, wenn Woche voll
        if ((startOffset + day) % 7 === 0) {
            calendar.appendChild(week);
            week = document.createElement("div");
            week.classList.add("week");
        }
    }
    
    // Falls noch leere Felder am Ende fehlen, auffüllen
    while (week.children.length < 7) {
        let emptyCell = document.createElement("div");
        emptyCell.classList.add("day", "empty");
        week.appendChild(emptyCell);
    }
    calendar.appendChild(week);
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    createCalendar();
}

function changeDayColor(dayElement, color) {
    dayElement.style.backgroundColor = color;
}
