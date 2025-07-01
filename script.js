let tablica_zadań = ["obowiązki: 🧹 Posprzątaj jedno pomieszczenie",
"obowiązki: 📚 Przeczytaj 10 stron książki",
"obowiązki: 💧 Wypij 1 litr wody do południa",
"obowiązki: 📞 Zadzwoń do kogoś, z kim dawno nie rozmawiałaś",
"obowiązki: 🧘 Zrób 10 minut medytacji lub ćwiczeń oddechowych",
"obowiązki: 🚶‍♂️ Zrób 20-minutowy spacer",
"obowiązki: ❤️ Bądź freaky z Tomkiem"];
let kod = "";
let numer_zadania = 0;
let znak = "✅";
let historia = [];
let obiekt = [];

// Nowość: Funkcja do ładowania danych z JSON
async function loadZadania() {
    try {
        // Znajdź tabelę "zadania" i jej dane
        const tabela = data.find(item => item.type === "table" && item.name === "zadania");
        if (tabela && tabela.data) {
            tablica_zadań = tabela.data.map(item => item.obowiązki);
        }
    } catch (error) {
        console.error('Błąd ładowania JSON:', error);
    }
}

// window.onload teraz ładuje JSON i dopiero wtedy resztę
window.onload = async function () {
    await loadZadania(); // Najpierw załaduj zadania z pliku

    SprawdźCzasResetu();

    let dane = localStorage.getItem("zadanieElem");
    try {
        const parsed = JSON.parse(dane);
        obiekt = (parsed && typeof parsed === "object") ? parsed : {};
    } catch (e) {
        obiekt = {};  
    }

    // Załaduj historię ukończonych zadań
    let daneHist = localStorage.getItem("historia");
    try {
        historia = (daneHist && daneHist !== "null") ? JSON.parse(daneHist) : [];
    } catch {
        historia = []; 
    }

    // Generowanie HTML dla zadań
    for (let i = 0; i < tablica_zadań.length; i++) {
        let zadanieText = tablica_zadań[i];
        
        if (obiekt[i]) {
            zadanieText = obiekt[i];
        }

        kod += "<p id='zadanie" + (i + 1) + "'>" + zadanieText + "</p><br>";
    }

    // Wstaw wygenerowany kod do HTML
    document.getElementById('wykonane_zadania').innerHTML = kod;

    console.log("Załadowane zadania:", tablica_zadań);
};

// Funkcja Losowanie
function Losowanie() {
    document.querySelectorAll("#zadanie1, #zadanie2, #zadanie3, #zadanie4, #zadanie5, #zadanie6")
        .forEach(el => el.style.color = "white");

    numer_zadania = Math.floor(Math.random() * tablica_zadań.length);
    let tekst_zadania = document.getElementById("zadanie" + (numer_zadania + 1)).textContent;
    document.getElementById("zadanie" + (numer_zadania + 1)).style.color = "red";

    if (tekst_zadania.includes(znak)) {
        Losowanie(); 
    }
}

// Funkcja Ukończono
function Ukończono() {
    if (typeof numer_zadania !== "number" || isNaN(numer_zadania)) {
        alert("Najpierw wylosuj zadanie!");
        return;
    }

    let zadanieElem = document.getElementById("zadanie" + (numer_zadania + 1));

    if (!zadanieElem) {
        console.error("Nie znaleziono elementu zadania!");
        return;
    }

    if (!zadanieElem.innerText.includes(znak)) {
        zadanieElem.innerText += " " + znak;
    }

    zadanieElem.style.color = "yellow";

     // Załaduj dane z localStorage lub stwórz pusty obiekt, jeśli dane nie istnieją
     let dane = localStorage.getItem("zadanieElem");

     // Przypisanie ukończonego zadania do obiektu
     obiekt[numer_zadania.toString()] = zadanieElem.innerText;
 
     // Zapisz obiekt z powrotem do localStorage
     localStorage.setItem("zadanieElem", JSON.stringify(obiekt));

    // Sprawdź historię
    if (!historia.includes(zadanieElem.innerText)) {
        historia.push(zadanieElem.innerText);
        localStorage.setItem("historia", JSON.stringify(historia));
    }

    // Logowanie do konsoli, aby sprawdzić, czy zapisano dane
    console.log("Zapisane zadanie:", zadanieElem.innerText);
    console.log("Zapisany obiekt:", obiekt);
    console.log("Zapisana historia:", historia);

    obiekt[numer_zadania] = zadanieElem.innerText;
}

// Funkcja, która sprawdza, czy minęły 24 godziny od ostatniego resetu
function SprawdźCzasResetu() {
    const ostatniReset = localStorage.getItem("ostatniReset"); // Odczytujemy czas ostatniego resetu
    const teraz = new Date().getTime(); // Pobieramy bieżący czas w milisekundach

    // Jeśli nie ma zapisanego ostatniego resetu, ustawiamy go na teraz
    if (!ostatniReset) {
        localStorage.setItem("ostatniReset", teraz);
        return; // Jeśli reset nie miał jeszcze miejsca, nie robimy nic
    }

    const czasOdResetu = teraz - ostatniReset; // Różnica między teraz a ostatnim resetem

    // Jeśli minęły 24 godziny (86400000 ms), resetujemy dane
    if (czasOdResetu >= 8640000) { 
        ResetujDane(); // Resetowanie danych
        localStorage.setItem("ostatniReset", teraz); // Zapisujemy nową datę ostatniego resetu
    }
}

// Funkcja ResetujDane, która usuwa dane z localStorage
function ResetujDane() {
    localStorage.removeItem("zadanieElem");
    localStorage.removeItem("historia");
    location.reload(); // Odświeżenie strony po resecie danych
}


// Funkcja Historia
function Historia() {
    document.getElementById('historia').style.visibility = "visible";
    const container = document.getElementById('historia');
    container.innerHTML = ""; // Wyczyść poprzednią zawartość

    historia.forEach(zadanie => {
        const elem = document.createElement("div"); // możesz też użyć <li> i <ul>
        elem.textContent = zadanie;
        container.appendChild(elem);
    });

    // Dodaj przycisk na końcu
    const przycisk = document.createElement("button");
    przycisk.textContent = "Zamknij Okno";
    przycisk.style.marginTop = "10px";
    przycisk.onclick = function () {
        document.getElementById('historia').style.visibility = "hidden";
    };

    container.appendChild(przycisk);
}