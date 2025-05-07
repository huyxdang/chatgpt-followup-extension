// content.js
const widget = document.createElement("div");
widget.id = "followup-widget";
widget.innerHTML = `
  <div style="position: fixed; bottom: 20px; right: 20px; width: 300px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 12px; border-radius: 8px; font-family: sans-serif; z-index: 9999;">
    <strong>Follow-Up Assistant</strong>
    <div id="chat-area" style="max-height: 200px; overflow-y: auto; font-size: 14px; margin-top: 8px;"></div>
    <textarea id="followup-input" placeholder="Ask a follow-up..." style="width: 100%; margin-top: 8px;"></textarea>
    <button id="followup-send" style="margin-top: 6px; width: 100%;">Send</button>
    <input id="openai-key" placeholder="Paste API Key" style="width: 100%; margin-top: 6px; font-size: 12px;"/>
  </div>
`;
document.body.appendChild(widget);

let messageHistory = [
  { role: "system", content: "You are a helpful assistant focused on explaining follow-up questions about ChatGPT content." }
];

document.getElementById("followup-send").addEventListener("click", async () => {
  const input = document.getElementById("followup-input");
  const chatArea = document.getElementById("chat-area");
  const apiKey = document.getElementById("openai-key").value.trim();
  const question = input.value.trim();
  if (!question || !apiKey) return;

  messageHistory.push({ role: "user", content: question });
  chatArea.innerHTML += `<div><strong>You:</strong> ${question}</div>`;
  input.value = "";

  chatArea.innerHTML += `<div><em>GPT is thinking...</em></div>`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messageHistory,
        temperature: 0.7
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "No reply.";
    messageHistory.push({ role: "assistant", content: reply });
    chatArea.innerHTML += `<div><strong>GPT:</strong> ${reply}</div>`;
    chatArea.scrollTop = chatArea.scrollHeight;
  } catch (e) {
    chatArea.innerHTML += `<div style='color:red;'>Error: ${e.message}</div>`;
  }
});
