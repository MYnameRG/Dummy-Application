const button = document.getElementById('button');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const statusText = document.getElementById('status');
const nameBox = document.getElementById('name-box');

const toData = new URLSearchParams(location.search)?.get("to");
const fromData = new URLSearchParams(location.search)?.get("from");

// Load Chats
loadChats();

/**
 * Load Chats
*/
function loadChats() {
  Http
    .get('/api/v1/users/load-chats?room=' + roomId)
    .then(resp => resp.json())
    .then(resp => {
      var allChatsTemplate = document.getElementById('all-chats-template'),
        allChatsTemplateHtml = allChatsTemplate.innerHTML,
        template = Handlebars.compile(allChatsTemplateHtml);
      var allMessages = document.getElementById('messages');
      allMessages.innerHTML = template({
        chats: [...resp.room_chats]
      });
    });
}

const socket = io({
  auth: {
    from: fromData,
    to: toData
  }
});

button.addEventListener('click', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('send_message', input.value);
    input.value = '';
  }
});

socket.on("connect", () => {
  nameBox.innerText = toData?.split(":")[1];
  statusText.innerText = (socket.connected == true) ? "Connected!" : "Diconnected!";
});

socket.on('recieve_message', (data) => {
  const item = document.createElement('li');
  item.textContent = data?.msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});