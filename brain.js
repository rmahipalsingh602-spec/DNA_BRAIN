const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

/* 🔥 FIREBASE CONFIG (APNA CONFIG DALO) */
const firebaseConfig = {
  apiKey: "AIzaSyCZTbBYBflQf7oQ6dEPZc-FsgGWJ2lnAe4",
  authDomain: "dna-memory-brain.firebaseapp.com",
  projectId: "dna-memory-brain",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* 🧠 MEMORY */
let memory = JSON.parse(localStorage.getItem("dnaMemory")) || {
  name: null,
  language: "hi",
  knowledge: []
};

/* UI */
function addMessage(text, sender, speak=false) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (speak && sender === "ai") speakText(text);
}

/* 🔊 VOICE OUTPUT */
function speakText(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "hi-IN";
  speechSynthesis.speak(msg);
}

/* 🎤 VOICE INPUT */
function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return alert("Voice not supported");
  const recog = new SR();
  recog.lang = "hi-IN";
  recog.start();
  recog.onresult = e => {
    userInput.value = e.results[0][0].transcript;
    sendMessage();
  };
}

/* 🧠 LEARNING */
function learn(text) {
  if (text.toLowerCase().includes("mera naam")) {
    memory.name = text.split(" ").pop();
  }

  memory.knowledge.push(text);
  localStorage.setItem("dnaMemory", JSON.stringify(memory));

  db.collection("brains").doc("global").set({
    knowledge: firebase.firestore.FieldValue.arrayUnion(text)
  }, { merge: true });
}

/* 🧠 AUTO REPLY ENGINE (FIXED) */
function generateReply(text) {
  const t = text.toLowerCase();

  if (t.includes("hello") || t.includes("hi"))
    return "Ram Ram sa 🙏 main DNA Memory Brain hoon";

  if (t.includes("kiya") || t.includes("kya"))
    return "Haan bolo sa, main sun raha hoon 🙂";

  if (t.includes("marwadi"))
    return "Ram Ram sa! Mhane Marwadi bhi aave hai 😄";

  if (t.includes("tum kaun ho"))
    return "Main DNA Memory Brain hoon, jo seekhta bhi hai 🧠";

  if (memory.name)
    return `Samjha ${memory.name} 👍 tumne bola: "${text}"`;

  return "Achha 👍 main ye baat yaad rakh raha hoon";
}

/* 🚀 SEND */
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  learn(text);

  const reply = generateReply(text);
  addMessage(reply, "ai", true);

  userInput.value = "";
}

/* 👋 WELCOME */
addMessage(
  memory.name
    ? `Ram Ram ${memory.name} 👋`
    : "Ram Ram sa 🙏 main DNA Memory Brain hoon",
  "ai",
  true
);
