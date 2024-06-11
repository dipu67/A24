document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const form = document.querySelector("#message-form");
  const submit = document.querySelector("#submit");
  const inputmsg = document.querySelector("#message-input");
  const messageList = document.querySelector("#msgList");
  const currentUser = 'dipu';
  console.log(inputmsg.value);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("message", inputmsg.value);
    inputmsg.value = "";
  });

  socket.on("msg", function (chat) {
    console.log(chat);
    const li = document.createElement("li");
    
    if (chat.user.username) {
      li.classList.add ('sent')
   } else {
    li.classList.add('received');
  }
    
    li.innerHTML = `<p> ${chat.user.name} :</p> <p> ${chat.data} </p> `;
    messageList.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
  });
  messages.scrollTop = messages.scrollHeight;
  console.log(messages.scrollTop);
});
