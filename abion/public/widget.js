(function () {
  "use strict";

  var ABION_API = (window.AbionConfig && window.AbionConfig.apiUrl) || (window.location.origin + "/api/widget");
  var BRAND_COLOR = (window.AbionConfig && window.AbionConfig.color) || "#0A1F44";
  var GREETING = (window.AbionConfig && window.AbionConfig.greeting) || "Hi! 👋 How can I help you today?";
  var BUSINESS_NAME = (window.AbionConfig && window.AbionConfig.businessName) || "Abion AI";

  // Generate or retrieve session ID
  var sessionId = localStorage.getItem("abion_session_id");
  if (!sessionId) {
    sessionId = "widget_" + Math.random().toString(36).slice(2) + "_" + Date.now();
    localStorage.setItem("abion_session_id", sessionId);
  }

  // Inject styles
  var style = document.createElement("style");
  style.textContent = [
    "#abion-widget-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:" + BRAND_COLOR + ";border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;z-index:99999;transition:transform .2s;}",
    "#abion-widget-btn:hover{transform:scale(1.08);}",
    "#abion-widget-btn svg{width:26px;height:26px;fill:white;}",
    "#abion-chat-box{position:fixed;bottom:92px;right:24px;width:340px;max-width:calc(100vw - 48px);height:480px;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);display:none;flex-direction:column;overflow:hidden;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}",
    "#abion-chat-box.open{display:flex;}",
    "#abion-chat-header{background:" + BRAND_COLOR + ";color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}",
    "#abion-chat-header span{font-size:14px;font-weight:700;}",
    "#abion-chat-header button{background:none;border:none;color:rgba(255,255,255,.7);cursor:pointer;font-size:18px;line-height:1;padding:0;}",
    "#abion-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}",
    ".abion-msg{max-width:80%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;word-break:break-word;}",
    ".abion-msg.bot{background:#f1f5f9;color:#1e293b;align-self:flex-start;border-bottom-left-radius:4px;}",
    ".abion-msg.user{background:" + BRAND_COLOR + ";color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}",
    ".abion-msg.typing{background:#f1f5f9;color:#94a3b8;align-self:flex-start;}",
    "#abion-chat-input-row{padding:12px;border-top:1px solid #e2e8f0;display:flex;gap:8px;flex-shrink:0;}",
    "#abion-chat-input{flex:1;border:1px solid #cbd5e1;border-radius:24px;padding:9px 14px;font-size:13px;outline:none;}",
    "#abion-chat-input:focus{border-color:" + BRAND_COLOR + ";}",
    "#abion-chat-send{width:36px;height:36px;border-radius:50%;background:" + BRAND_COLOR + ";border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}",
    "#abion-chat-send:disabled{opacity:.5;cursor:default;}",
    "#abion-chat-send svg{width:15px;height:15px;fill:white;}",
    "@media(max-width:400px){#abion-chat-box{right:0;bottom:0;width:100%;max-width:100%;height:100%;border-radius:0;}#abion-widget-btn{bottom:16px;right:16px;}}",
  ].join("");
  document.head.appendChild(style);

  // Build HTML
  var btn = document.createElement("button");
  btn.id = "abion-widget-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>';

  var box = document.createElement("div");
  box.id = "abion-chat-box";
  box.innerHTML = [
    '<div id="abion-chat-header">',
    '  <span>' + BUSINESS_NAME + '</span>',
    '  <button id="abion-close-btn" aria-label="Close chat">&times;</button>',
    '</div>',
    '<div id="abion-chat-messages"></div>',
    '<div id="abion-chat-input-row">',
    '  <input id="abion-chat-input" type="text" placeholder="Type a message..." autocomplete="off" />',
    '  <button id="abion-chat-send" aria-label="Send">',
    '    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
    '  </button>',
    '</div>',
  ].join("");

  document.body.appendChild(btn);
  document.body.appendChild(box);

  var messagesEl = document.getElementById("abion-chat-messages");
  var inputEl = document.getElementById("abion-chat-input");
  var sendBtn = document.getElementById("abion-chat-send");
  var closeBtn = document.getElementById("abion-close-btn");
  var isOpen = false;
  var greeted = false;

  function addMessage(text, type) {
    var msg = document.createElement("div");
    msg.className = "abion-msg " + type;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  function openChat() {
    isOpen = true;
    box.classList.add("open");
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white"/></svg>';
    if (!greeted) {
      greeted = true;
      addMessage(GREETING, "bot");
    }
    setTimeout(function () { inputEl.focus(); }, 100);
  }

  function closeChat() {
    isOpen = false;
    box.classList.remove("open");
    btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>';
  }

  async function sendMessage() {
    var text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = "";
    sendBtn.disabled = true;
    addMessage(text, "user");

    var typingEl = addMessage("Typing...", "bot typing");

    try {
      var res = await fetch(ABION_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });

      var data = await res.json();
      typingEl.remove();

      if (data.response) {
        addMessage(data.response, "bot");
      } else {
        addMessage("Sorry, I couldn't get a response. Try again?", "bot");
      }
    } catch (e) {
      typingEl.remove();
      addMessage("Connection error. Please try again.", "bot");
    }

    sendBtn.disabled = false;
    inputEl.focus();
  }

  btn.addEventListener("click", function () { isOpen ? closeChat() : openChat(); });
  closeBtn.addEventListener("click", closeChat);
  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
})();
