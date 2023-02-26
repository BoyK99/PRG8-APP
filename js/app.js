// -----------------------
// Load webcam and buttons
// -----------------------

// Random vars
const video = document.getElementById("webcam");
const label = document.getElementById("label");
const score = document.getElementById("score");
const promptDiv = document.getElementById("prompt")
const randomArray = ["Pen", "Fles", "Telefoon"];
let prompt = ""
let scoreText = 0;

// Constants for buttons TRAINING ONLY
const labelOneBtn = document.querySelector("#labelOne");
const labelTwoBtn = document.querySelector("#labelTwo");
const labelThreeBtn = document.querySelector("#labelThree");
const trainbtn = document.querySelector("#train");
const savebtn = document.querySelector("#save");

// Object buttons TRAINING ONLY
labelOneBtn.addEventListener("click", () => classifier.addImage('pen'));
labelTwoBtn.addEventListener("click", () => classifier.addImage('fles'));
labelThreeBtn.addEventListener("click", () => classifier.addImage('telefoon'));

// Train buttons TRAINING ONLY
trainbtn.addEventListener("click", () => classifier.train((lossValue) => { console.log('Loss is', lossValue) }));
savebtn.addEventListener("click", () => saveModel() && console.log('Model is gesaved'));

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}

// -------------------------
// Load ML5 FeatureExtractor
// -------------------------

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);

function loadCustom(){
    featureExtractor.load('./model/model.json')
    console.log("Custom model loaded")
}

// When the model is loaded
function modelLoaded() {
    // loadCustom()
    console.log('Model Loaded!');
}

// Allows three trained objects
const options = { numLabels: 3 };

// Create a new classifier using those features and with a video element
const classifier = featureExtractor.classification(video, options);

// ------------------------------------------------
// ML5 FeatureExtractor functions + other functions
// ------------------------------------------------

// Save model TRAINING ONLY
function saveModel() {
    label.innerText = 'Model saved.';
    featureExtractor.save();
}

// Retrain the network TRAINING ONLY
function train() {
    classifier.train((lossValue) => {
        if (lossValue === null) {
            label.innerText = 'Training Completed';
        } else {
            label.innerText = 'Loss is ' + lossValue;
        }
    });
}

