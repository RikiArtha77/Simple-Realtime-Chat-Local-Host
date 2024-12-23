const ws = new WebSocket('ws://192.168.1.10:3000');

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernameInput = document.getElementById('username-input');
const resetButton = document.getElementById('reset-button');

const formatTime = () => {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
};

const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(msg => {
        const message = document.createElement('div');
        message.textContent = msg;
        messagesContainer.appendChild(message);
    });
};

const saveMessage = (msg) => {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push(msg);
    localStorage.setItem('messages', JSON.stringify(messages));
};

ws.onmessage = async (event) => {
    let data;

    if (event.data instanceof Blob) {
        data = await event.data.text();
    } else {
        data = event.data;
    }

    const message = document.createElement('div');
    message.textContent = `[${formatTime()}] ${data}`;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    saveMessage(data);
};

sendButton.onclick = () => {
    const message = messageInput.value;
    const username = usernameInput.value || 'Anonymous';
    if (message) {
        const fullMessage = `${username}: ${message}`;
        ws.send(fullMessage);
        messageInput.value = '';
    }
};

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});

const resetChat = () => {
    localStorage.removeItem('messages');
    while (messagesContainer.firstChild) {
        messagesContainer.removeChild(messagesContainer.firstChild);
    }
    const systemMessage = document.createElement('div');
    systemMessage.textContent = `[${formatTime()}] Chat has been reset.`;
    messagesContainer.appendChild(systemMessage);
};

resetButton.onclick = resetChat;

loadMessages();