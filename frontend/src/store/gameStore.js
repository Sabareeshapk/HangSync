import { create } from "zustand";

const useGameStore = create((set) => ({
  player: {
    name: "",
    identity: "", // host | guest
  },

  room: JSON.parse(localStorage.getItem("room")) || null,

  game: null,

  setPlayer: (player) => set({ player }),

  setRoom: (room) => set({ room }),

  setGame: (game) => set({ game }),

  resetGame: () =>
    set({
      room: null,
      game: null,
    }),
}));

export default useGameStore;