// Funktion zum Anzeigen des Registrierungsformulars
function showRegistration() {
    document.querySelector('.selectionContainer').style.display = 'none';
    document.getElementById('registrationContainer').style.display = 'block';
  }
  
  // Funktion zum Anzeigen des Loginformulars
  function showLogin() {
    document.querySelector('.selectionContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
  }
  
  // Funktion zur Validierung der Registrierung
  function validateRegistration(event) {
    event.preventDefault(); // Verhindert das Standard-Formularverhalten
  
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
  
    // Basis-Email-Validierung
    if (!isValidEmail(email)) {
      showCustomPrompt('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
  
    // Passwort-Längenprüfung
    if (password.length < 6) {
      showCustomPrompt('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }
  
    // Registrierung erfolgreich
    showCustomPrompt('Registrierung erfolgreich!');
  
    // Benutzer speichern
    saveUser(email, password, 'registration');
    
    // Registrierungsformular schließen und Login-Fenster anzeigen
    document.getElementById('registrationContainer').style.display = 'none';
    showLogin();
    
  }
  
  // Funktion zur Validierung des Logins
  function validateLogin(event) {
    event.preventDefault(); // Verhindert das Standard-Formularverhalten
  
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    // Basis-Email-Validierung
    if (!isValidEmail(email)) {
      showCustomPrompt('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
  
    // Passwort-Längenprüfung
    if (password.length < 6) {
      showCustomPrompt('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }
  
    // Login-Prozess
    loginUser(email, password);
  }
  
  // Funktion zur Email-Validierung
  function isValidEmail(email) {
    // Einfache E-Mail-Validierung mit regulärem Ausdruck
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Funktion zum Speichern des Benutzers (Registrierung)
  function saveUser(email, password, type) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Überprüfen, ob Benutzer bereits existiert
    const userExists = users.some(user => user.email === email);
  
    if (userExists) {
      showCustomPrompt("Benutzer existiert bereits!");
    } else {
      // Neuen Benutzer hinzufügen
      users.push({ email: email, password: password });
      localStorage.setItem("users", JSON.stringify(users));
      showCustomPrompt("Benutzer angelegt!");
  
      // Eingabefelder leeren
      if (type === 'registration') {
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
      }
    }
  }
  
  // Funktion zum Verarbeiten des Logins
  function loginUser(email, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Suche nach dem Benutzer
    const user = users.find(user => user.email === email && user.password === password);
  
    if (user) {
      // showCustomPrompt("Login erfolgreich!");
      // Hier kannst du weiterleiten oder den Login-Status speichern
         window.location.href = "dashboard.html";
         window.onload = createCalendar;
    } else {
      showCustomPrompt("Ungültige E-Mail oder Passwort.");
    }
  }
  
  // Funktion zum Anzeigen des benutzerdefinierten Prompts
  function showCustomPrompt(message) {
    document.getElementById('promptMessage').innerText = message;
    document.getElementById('customPrompt').style.display = 'flex';
  }
  
  // Funktion zum Schließen des benutzerdefinierten Prompts
  function closePrompt() {
    document.getElementById('customPrompt').style.display = 'none';
  }
  
  // Funktion zum Verarbeiten des Prompts
  function submitPrompt() {
    // Hier kannst du zusätzliche Aktionen ausführen, wenn der Benutzer auf "OK" klickt
    closePrompt();
  }
 
