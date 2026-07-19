import api from "./api";

export const createRoom = async (hostName) => {
  const response = await api.post("/rooms/create/", {
    host_name: hostName,
  });

  return response.data;
};

export const getRoom = async (roomCode) => {
  const response = await api.get(`/rooms/${roomCode}/`);

  return response.data;
};

export const joinRoom = async (roomCode, guestName) => {
  const response = await api.post("/rooms/join/", {
    room_code: roomCode,
    guest_name: guestName,
  });

  return response.data;
};

export const startGame = async (roomCode) => {
  const response = await api.post("/rooms/start/", {
    room_code: roomCode,
  });

  return response.data;
};