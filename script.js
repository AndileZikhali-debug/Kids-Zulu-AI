const OPENAI_API_KEY = "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"; // ← Replace with your key

const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const SYSTEM_PROMPT = `Wena uyi-AI umngane othandekayo wezingane. 
Phendula kuphela ngesiZulu (isiZulu). 
Gcina izimpendulo zakho zimfushane, ezijabulisayo, futhi ezifundisayo. 
Sebenzisa ulimi olulula lwezingane. 
Ungalokothi ukhulume ngezinto ezilimazayo, ezithukuthelisayo, noma ezingafanele izingane. 
Yiba nomusa futhi ukhuthaze izingane.`;

// Add a message to chat
function addMessage(text, isUser) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Call OpenAI
async function getAIResponse(userMessage) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // cheaper & fast, or use gpt-3.5-turbo
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300,
                temperature: 0.8
            })
        });

        if (!response.ok) throw new Error("Iphutha le-API");

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error(error);
        return "Uxolo mngane, kukhona inkinga. Zama futhi! 🌟";
    }
}

// Handle sending message
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = "";

    // Show typing indicator
    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.textContent = "Iyacabanga... 🧠";
    messagesDiv.appendChild(typing);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    const reply = await getAIResponse(text);
    
    // Remove typing
    typing.remove();
    addMessage(reply, false);
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Welcome message
window.onload = () => {
    addMessage("Sawubona mngane wami! 🎉 Ngingu uMngane Wami. Ungathanda ukukhuluma ngani namuhla?", false);
};
