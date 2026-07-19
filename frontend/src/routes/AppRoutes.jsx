import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home/Home";
import JoinRoom from "@/pages/JoinRoom/JoinRoom";
import WaitingRoom from "@/pages/WaitingRoom/WaitingRoom";
import Game from "@/pages/Game/Game";
import NotFound from "@/pages/NotFound/NotFound";
// import Game from "@/pages/Game/Game";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/join-room"
          element={<JoinRoom />}
        />

        <Route
          path="/waiting-room"
          element={<WaitingRoom />}
        />

        <Route
          path="/game/:roomCode"
          element={<Game />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

        <Route path="/game" element={<Game />} />

      </Routes>
    </BrowserRouter>
  );
}