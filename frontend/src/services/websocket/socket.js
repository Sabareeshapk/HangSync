let socket = null;

const listeners = {};

export const connectSocket = (roomCode, player) => {
  if (socket) {
    socket.close();
  }

  socket = new WebSocket(
    `${import.meta.env.VITE_WS_URL}/ws/rooms/${roomCode}/?player=${player}`
);

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");
  };

  socket.onclose = () => {
    console.log("❌ WebSocket Closed");
  };

  socket.onerror = (error) => {
    console.error(error);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("📩", data);

    const callback = listeners[data.type];

    if (callback) {
      callback(data);
    }
  };

  return socket;
};

export const on = (eventName, callback) => {
  listeners[eventName] = callback;
};

export const send = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};