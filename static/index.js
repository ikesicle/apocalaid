const questions = [
    // This will help us triage the patient
    {
        question: "Is the patient in a safe location?",
        type: "tf",
        options: ["Yes", "No"],
        intensityYes: 0,
        intensityNo: 0
    },
    {
        question: "Does the patient need medical aid?",
        type: "tf",
        options: ["Yes", "No"],
        intensityYes: 0,
        intensityNo: 0
    },
    {
        question: "Is the patient conscious?",
        type: "tf",
        options: ["Yes", "No"],
        intensityYes: 0,
        intensityNo: 0 
    },
    {
        question: "Is the patient breathing?",
        type: "tf",
        options: ["Yes", "No"],
        intensityYes: 0,
        intensityNo: 0
    },
    {
        question: "Is the patient bleeding?",
        type: "tf",
        options: ["Yes", "No"],
        intensityYes: 0,
        intensityNo: 0
    },
    {
        question: "Will the patient be able to walk or drive?",
        type: "tf",
        options: ["Yes", "No"],
        intensityYes: 0,
        intensityNo: 0
    },
    {
        question: "Does the patient have a fever/sore throat/cold?",
        type: "tf",
        options: ["Yes", "No"],
        intensityYes: +2,
        intensityNo: 0
    },
    {
        question: "Does the patient have broken bones or severe pain in their limbs?",
        type: "tf",
        options: ["Yes", "No"],
        intensityYes: +3,
        intensityNo: 0       
    },
    {
        question: "Does the patient have trouble breathing (but are able to breath)?",
        type: "tf",
        options: ["Yes", "No"],
        intensityYes: +5,
        intensityNo: 0
    }
];
function tryCenter() {
    if (navigator.geolocation) {
        console.log("Getting loc");
        navigator.geolocation.getCurrentPosition((value) => {
            map.setView([value.coords.latitude, value.coords.longitude], 14);
            console.log([value.coords.latitude, value.coords.longitude])
        }, null, {timeout: 10});
        return;
    }
    console.log("Failed loc");
    notify("Location is required to center.")
}


const map = L.map('map'); // creates a map named map
const latlongdisplay = document.getElementById("lat_disp");
map.setView([51.505, -0.09], 13);
tryCenter();
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const notifbar = document.getElementById("notif_bar");
var currentnc = 0;
var triageIntensity = 0;
var questionIndex = 0;
var currentQuestion;
function notify(text, autoclose = true) {
    notifbar.textContent = text;
    notifbar.style.transform = "translateY(0)";
    clearTimeout(currentnc);
    if (autoclose) {
        currentnc = setTimeout(() => {
            notifbar.style.transform = "translateY(-100%)";
            
        }, 5000)
    }
}
var isQuestionnaireOpened = false;
function onMapMove(_) {
    let pos = map.getCenter();
    latlongdisplay.textContent = `${pos.lat.toFixed(4)} N ${pos.lng.toFixed(4)} W`
}

const questionnaire = document.getElementById("questionnaire");
function openQuestionnaire() {
    isQuestionnaireOpened = true;
    questionnaire.style.height = "80%";
    questionnaire.style.opacity = "1";
    questionIndex = 0;
    serveQuestionnaire();
}

function closeQuestionnaire() {
    isQuestionnaireOpened = false;
    questionnaire.style.height = "0";
    questionnaire.style.opacity = "0";
}
function toggleQuestionnaire() {
    if (isQuestionnaireOpened) {
        closeQuestionnaire();
        return;
    }
    openQuestionnaire();
}

function serveQuestionnaire() {
    // Serve the questionnaire question by question
    intensity = 0;
    // Serve the first question
    currentQuestion = questions[questionIndex];
    
    // serve the question in the questionnaire div box
    
    questionnaire.innerHTML = `<h1 class="title is-3">${currentQuestion.question}</h1>
    <div>
        <button class="option button is-success" onclick="answerQuestion(true)">${currentQuestion.options[0]}</button>
        <button class="option button is-danger" onclick="answerQuestion(false)">${currentQuestion.options[1]}</button>
    </div>`;
}

function questionnaireFinal(intensity) {
    if (intensity >= 5) {
        closeQuestionnaire();
        notify("Your condition is serious. An ambulance is on the way.")
        return;
    }
    if (intensity >= 3) {
        questionnaire.innerHTML = `
        <h1 class="title is-3">You may need medical attention</h1>
        <p>Due to the uptick of healthcare issues we've been seeing, new temporary hospitals have been set up at convention centres and city halls nearby. Here are a list of nearby healthcare centres that can treat your condition, sorted by distance and wait times:</p>
        <h1 class="subtitle is-4" style="margin-top: 10px;">Vishnu Satish Central Hospital</h1>
        <p>Six patients ahead of you in line</p>
        <p>Two orthopedic doctors</p>
        <p>15 minute drive</p>
        <p>6 minute wait time</p>
        <button class="button is-success">Book</button>
        <h1 class="subtitle is-4" style="margin-top: 10px;">Brampton City Hall Temporary Healthcare Centre</h1>
        <p>15 patients ahead of you in line</p>
        <p>One orthopedic doctor</p>
        <p>2 minute drive</p>
        <p>34 minute wait time</p>
        <button class="button is-success">Book</button>

        `
        return;
    }
    if (intensity > 0) {
        questionnaire.innerHTML = `
        <h1 class="title is-3">HealthGPT's response:</h1>
        <p>
        There are several steps you can take to treat a sore throat and fever:

    Rest: Get plenty of rest to help your body fight off the infection.

    Drink plenty of fluids: Staying hydrated is important when you're sick. Drink water, broth, and other clear fluids to help ease your sore throat.

    Gargle with salt water: Mix 1/4 to 1/2 teaspoon of salt in 8 ounces of warm water and gargle several times a day to soothe your sore throat.

    Use a humidifier: A humidifier can help moisten the air and soothe your throat.

    Take over-the-counter pain relievers: Acetaminophen or ibuprofen can help relieve pain and reduce fever. Follow the instructions on the package carefully.

    Try throat lozenges or sprays: These can help numb your throat and provide temporary relief.

    Treat underlying conditions: If your sore throat and fever are caused by a bacterial infection, your doctor may prescribe antibiotics.

    It's important to see a doctor if your symptoms persist or get worse, especially if you have difficulty swallowing, trouble breathing, or a high fever.
    </p>
    <button class="option button" onclick="closeQuestionnaire()">OK</button>
    `
        return;
    }
}

function answerQuestion(answer) {
    if (answer){
        triageIntensity += currentQuestion.intensityYes;
    } else {
        triageIntensity += currentQuestion.intensityNo;
    }
    console.log(triageIntensity);
    // Serve the next question
    questionIndex++;
    // Check if we have reached the end of the questionnaire
    if (questionIndex >= questions.length) {
        questionnaireFinal(triageIntensity);
        return;
    }
    currentQuestion = questions[questionIndex];
    questionnaire.innerHTML = `<h1 class="title is-3">${currentQuestion.question}</h1>
    <div class="items-center">
        <button class="option button is-success" onclick="answerQuestion(true)">${currentQuestion.options[0]}</button>
        <button class="option button is-danger" onclick="answerQuestion(false)">${currentQuestion.options[1]}</button>
    </div>`;

}
map.on("move", onMapMove)
onMapMove(0);