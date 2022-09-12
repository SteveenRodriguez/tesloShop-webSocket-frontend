import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (token : string) => {
  // Creamos una instancia de Manager y le pasamos la url donde se encuentre el socket
  const manager = new Manager("http://localhost:3000/socket.io/socket.io.js",{
    extraHeaders: {
      hola: 'mundo',
      authentication: token,
    }
  });

  socket?.removeAllListeners();

  // accede m nbbnmos al método socket y le pasamos el argumento de namespace donde se va a conectar
  socket = manager.socket("/"); // -> / = root


  // console.log({socket})
  addListeners();
};

const addListeners = () => {
  // Se apunta al equita span con id = 'server-status'
  const serverStatusLabel = document.querySelector("#server-status")!;

  // apunta a la etiqueta que contenga el id de #clients-ul
  const clientsUl = document.querySelector("#clients-ul")!;

  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;

  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  /**
   * INTERACTUAR CON EL SOCKET
   * Si se quiere escuchar información del servido => on()
   * Si se quiere hablar con el servidor se utiliza el método emmit()
   */

  socket.on("connect", () => {
    // Se cambia la propiedad span mediante el innerHTML
    serverStatusLabel.innerHTML = "Connected";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerHTML = "Disconnected";
  });

  socket.on("clients-updated", (clients: string[]) => {
    let clientsHtml = "";
    clients.forEach((clientID) => {
      clientsHtml += `
            <li>${clientID}</li>
        `;
    });

    clientsUl.innerHTML = clientsHtml;
  });

  // Configuración del formulario
  messageForm.addEventListener("submit", (event) => {
    event.preventDefault(); //-> Evita la propagación del formulario

    if (messageInput.value.trim().length <= 0) {
      return;
    }

    socket.emit("message-from-client", {
      id: "Yo",
      message: messageInput.value,
    });

    messageInput.value = ""; //-> Se limpia el formulario
  });

  socket.on(
    "message-from-server",
    (payload: { fullName: string, message: string }) => {
      const newMessage = `
              <li>
                <strong>${payload.fullName}</strong>
                <span>${payload.message}</span>
              </li>
              `;

      const li = document.createElement("li");
      li.innerHTML = newMessage;
      messagesUl.append(li);
    }
  );
};
