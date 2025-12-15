const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

// 🧠 MEMORY
let memory = JSON.parse(localStorage.getItem("dnaMemory")) || {
  name: null,
  messages: [],
  habits: {}
};

// UI
function addMessage(text, sender, speak=false) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  if (speak && sender === "ai") speakText(text);
}

// 🔊 VOICE OUTPUT
function speakText(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "hi-IN";
  speechSynthesis.speak(msg);
}

// 🎤 VOICE INPUT
function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return alert("Voice supported nahi");
  const recog = new SR();
  recog.lang = "hi-IN";
  recog.start();
  recog.onresult = e => {
    userInput.value = e.results[0][0].transcript;
    sendMessage();
  };
}

// 🧠 MEMORY SAVE
function remember(text) {
  if (text.toLowerCase().includes("mera naam")) {
    memory.name = text.split(" ").pop();
  }
  memory.messages.push(text);
  localStorage.setItem("dnaMemory", JSON.stringify(memory));
}

// 😊 EMOTION
function emotion(text) {
  text = text.toLowerCase();
  if (text.includes("thak") || text.includes("tired")) return "tired";
  if (text.includes("sad") || text.includes("dukhi")) return "sad";
  if (text.includes("happy") || text.includes("khush")) return "happy";
  return null;
}

// ⚡ FAST REPLY
function instantReply(text) {
  const e = emotion(text);
  if (e === "tired") return "Tum thode tired lag rahe ho 😴 rest kar lo.";
  if (e === "sad") return "Main hoon na ❤️ bolo.";
  if (e === "happy") return "Aaj mood achha hai 😄";
  if (text.toLowerCase().includes("tum mujhe jaante ho"))
    return memory.name ? `Haan ${memory.name}, main yaad rakhta hoon 🙂` : "Naam batao 🙂";
  return null;
}

// 🚀 SEND
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  remember(text);

  const quick = instantReply(text);
  if (quick) {
    addMessage(quick, "ai", true);
    userInput.value = "";
    return;
  }

  addMessage("Main sun raha hoon… 🧠", "ai", true);
  userInput.value = "";
}

// 👋 WELCOME
addMessage(
  memory.name ? `Welcome back ${memory.name} 👋` : "Hello! Main DNA Memory Brain hoon",
  "ai",
  true
);
