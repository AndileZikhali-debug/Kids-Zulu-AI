const GROQ_API_KEY = "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";

const messagesDiv = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const SYSTEM_PROMPT = `Wena uyi-AI umngane othandekayo wezingane ezincane. 
Phendula kuphela ngesiZulu esilula. 
Gcina izimpendulo zakho zimfushane, ezijabulisayo, futhi ezifundisayo. 
Yiba nomusa, ukhuthaze izingane, futhi ungakhulumi ngezinto ezilimazayo.`;

function addMessage(text, isUser) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    msgDiv.textContent = text;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function getAIResponse(userMessage) {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300,
                temperature: 0.85
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Groq API Error:", data);
            return "ERROR: " + (data.error?.message || "Unknown error") + "\n\nSicela ubheke i-Console (F12).";
        }

        return data.choices[0].message.content;

    } catch (error) {
        console.error("Network Error:", error);
        return "Ayikwazi ukuxhumana ne-Groq. Hlola inethiwekhi noma i-API key.";
    }
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = "";

    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.textContent = "Iyacabanga... 🧠";
    messagesDiv.appendChild(typing);

    const reply = await getAIResponse(text);
    typing.remove();
    addMessage(reply, false);
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

window.onload = () => {
    addMessage("Sawubona mngane wami! 🎉 Ngingu uMngane Wami. Ungathanda ukukhuluma ngani?", false);
};
