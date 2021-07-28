let socket_admin_id = null;
let emailUser = null;
let socket = null;

function Mediator(evento) {
  if(evento === "email"){
    if(validaEmail()){return true}
  }else if(evento == "send"){
    enviarmensagem();
  }else{
    alert("evento não existente")
  }
}


document.querySelector("#email").addEventListener("blur", (event) => {
  Mediator("email");
});


document
  .querySelector("#send_message_button")
  .addEventListener("click", (event) => {
    Mediator("send");
  });



document.querySelector("#start_chat").addEventListener("click", (event) => {
  const email = document.getElementById("email").value;
  emailUser = email;
  const text = document.getElementById("txt_help").value;

  if (Mediator("email") && text.length >= 1) {
    const chat_help = document.getElementById("chat_help");
    chat_help.style.display = "none";

    const chat_in_support = document.getElementById("chat_in_support");
    chat_in_support.style.display = "block";

    socket = io();

    socket.on("connect", () => {
      const params = {
        email,
        text,
      };
      socket.emit("client_first_access", params, (call, err) => {
        if (err) {
          console.err(err);
        } else {
          console.log(call);
        }
      });
    });

    socket.on("client_list_all_messages", (messages) => {
      var template_client = document.getElementById(
        "message-user-template"
      ).innerHTML;
      var template_admin = document.getElementById("admin-template").innerHTML;

      messages.forEach((message) => {
        if (message.admin_id === null) {
          const rendered = Mustache.render(template_client, {
            message: message.text,
            email,
          });

          document.getElementById("messages").innerHTML += rendered;
        } else {
          const rendered = Mustache.render(template_admin, {
            message_admin: message.text,
          });

          document.getElementById("messages").innerHTML += rendered;
        }
      });
    });

    socket.on("admin_send_to_client", (message) => {
      socket_admin_id = message.socket_id;

      const template_admin =
        document.getElementById("admin-template").innerHTML;

      const rendered = Mustache.render(template_admin, {
        message_admin: message.text,
      });

      document.getElementById("messages").innerHTML += rendered;
    });
  } else {
    alert("Verifica sua menssage");
  } 
});



  function validaEmail() {
    field = document.getElementById("email");
    span = document.getElementById("invalidEmail");
    usuario = document
      .getElementById("email")
      .value.substring(0, field.value.indexOf("@"));
    dominio = document
      .getElementById("email")
      .value.substring(field.value.indexOf("@") + 1, field.value.length);
    btn_start = document.getElementById("start_chat");

    if (
      usuario.length >= 1 &&
      dominio.length >= 3 &&
      usuario.search("@") == -1 &&
      dominio.search("@") == -1 &&
      usuario.search(" ") == -1 &&
      dominio.search(" ") == -1 &&
      dominio.search(".") != -1 &&
      dominio.indexOf(".") >= 1 &&
      dominio.lastIndexOf(".") < dominio.length - 1
    ) {
      field.style.backgroundColor = "rgb(95 242 99 / 60%)";
      field.classList.remove("invalid");
      span.style.visibility = "hidden";
      btn_start.style.visibility = "visible";
      return true;
    } else {
      field.classList.add("invalid");
      span.style.visibility= "visible"
      btn_start.style.visibility = "hidden";
      return false;
    }
  }

  function enviarmensagem() {
    const text = document.getElementById("message_user");

    const params = {
      text: text.value,
      socket_admin_id,
    };

    socket.emit("client_send_to_admin", params);

    const template_client = document.getElementById(
      "message-user-template"
    ).innerHTML;

    const rendered = Mustache.render(template_client, {
      message: text.value,
      email: emailUser,
    });

    document.getElementById("messages").innerHTML += rendered;

    text.value = "";
  }