// -----------------------
// Load webcam and buttons
// -----------------------

const video = document.getElementById("webcam");
const label = document.getElementById("label");
const scoreText = document.getElementById("score");
const startBtn = document.getElementById("startGame")
const retryBtn = document.getElementById("retry")
const promptDiv = document.getElementById("prompt")
let prompt = ""
const randomArray = ["Pen", "Fles", "Telefoon"];
let score = 0;
const inputFile = document.getElementById("file")

startBtn.addEventListener("click", () => randomize());
retryBtn.addEventListener("click", () => restartGame());

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
    loadCustom()
    console.log('Model Loaded!');
}

// Allows three trained objects
const options = { numLabels: 3 };

// Create a new classifier using those features and with a video element
const classifier = featureExtractor.classification(video, options);

// ------------------------------------------------
// ML5 FeatureExtractor functions + other functions
// ------------------------------------------------

// Get a prediction for that image
function classify() {
    classifier.classify(img, (err, result) => {
        if(err) console.log(err)
        if(result[0].label == prompt){
            promptDiv.innerHTML = "Correct! Ik ben "+result[0].confidence.toString().substring(2,4)+"% zeker dat dit een "+result[0].label+"is."
            speak("Correct! Ik ben "+result[0].confidence.toString().substring(2,4)+"% zeker dat dit een "+result[0].label+"is.")
            score++
            scoreText.innerHTML = "Score: "+score
        }else{
            promptDiv.innerHTML = "Dat is niet een "+prompt+". Ik ben "+result[0].confidence.toString().substring(2,4)+"% zeker dat dit een "+result[0].label+"is."
            speak("Dat is niet een "+prompt+". Ik ben "+result[0].confidence.toString().substring(2,4)+"% zeker dat dit een "+result[0].label+"is.")
        }
    })
}

// Random prompt for photo
function randomize() {
    prompt = randomArray[Math.floor((Math.random() * randomArray.length))]
    start()
}

// Start game
function start() {
    promptDiv.innerHTML = "Neem een foto van een " + prompt
    speak("Neem een foto van een " + prompt)
    promptDiv.style.display = "block"
    scoreText.style.display = "block"    
    inputFile.style.display = "inline-block"
}

// Restart game
function restartGame() {
    location.reload();
    // randomize()
    // img.style.display = "none"
    // retrybtn.style.display = "none"
    // inputFile.value = null
    // inputFile.style.display = "inline-block"
    // console.log(img.src)
    // URL.revokeObjectURL(img.src)
    // img.src = ''
}

function fileAdded() {
    inputFile.style.display = "none"
    img.src = URL.createObjectURL(event.target.files[0])
    img.style.display = "inline-block"
    classify()
    retryBtn.style.display = "inline-block"
}

// ------------
// Speak import
// ------------

// Speak functions
let synth = window.speechSynthesis

function speak(text) {
    if (synth.speaking) {
        synth.cancel()
        setTimeout(function(){
            synth.speak(text)
        }, 250); 
    }
    if (text !== '') {
        let utterThis = new SpeechSynthesisUtterance(text)
        synth.speak(utterThis)
    }
}