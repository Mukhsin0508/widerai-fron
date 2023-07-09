let mainImage = document.querySelector("#main-image");

let voice = 1;
const voiceSelector = document.querySelector("#voice");
voiceSelector.onchange = (e) => {
  voice = parseInt(e.target.value, 10);
};

window.onload = () => {
  const button = document.getElementById("speak-button");
  button.addEventListener("click", () => {
    speakText("Hello there! Welcome to Wider AI!");
  });
};

function speakText(text) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  if (voices.length !== 0) {
    utterance.voice = voices[1];
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  }
}


if ("webkitSpeechRecognition" in window) {
  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-En";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let mic = document.querySelector("#mic");
  let blob = document.querySelector("#blob");
  mic.onclick = () => {
    speechSynthesis.cancel();
    mainImage.src = "./assets/images/white-logo.svg";
    mainImage.classList.remove("loader");
    recognition.start();
    blob.classList.remove("hidden");
    mic.classList.remove("mic-gradient");
  };

  recognition.onresult = (e) => {
    const result = e.results[0][0].transcript;
    e.target.value = `${result}`;

    blob.classList.add("hidden");
    mic.classList.add("mic-gradient");

    let searchText = e.target.value;
    console.log(searchText);
    mainImage.src = "./assets/____2-min.gif";
    mainImage.classList.add("loader");
    fetch("http://localhost:3000", {
      method: "POST",
      headers: { message: searchText },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        const utterance = new SpeechSynthesisUtterance(res?.reply);
        // utterance.voice = speechSynthesis.getVoices()[0];
        const timer = setInterval(function () {
          let voices = speechSynthesis.getVoices();
          if (voices.length !== 0) {
            utterance.voice = voices[voice];
            utterance.lang = "en-US";
            speechSynthesis.speak(utterance);
            clearInterval(timer);
          }
        }, 200);
      })
      .finally(() => {
        mainImage.src = "./assets/images/white-logo.svg";
        mainImage.classList.remove("loader");
      });
  };
} else {
  console.log("Speech Recognition Not Available");
}

function loadVoices() {
  let voices = window.speechSynthesis
    .getVoices()
    .map((x) => [x.name, x.lang].join("\t"))
    .join("\r\n");

  console.log(voices);
}
// loadVoices();
window.speechSynthesis.onvoiceschanged = function (e) {
  // loadVoices();
};
