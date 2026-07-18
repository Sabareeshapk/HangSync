import { useState } from "react";

import HeroSection from "@/components/home/HeroSection";
import NameInput from "@/components/home/NameInput";
import ActionButtons from "@/components/home/ActionButtons";
import HomeFooter from "@/components/home/HomeFooter";

import PageContainer from "@/components/common/PageContainer";
import GlassCard from "@/components/common/GlassCard";

export default function Home() {
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );

  return (
    <PageContainer>
      <GlassCard>
        <HeroSection />

        <NameInput
          playerName={playerName}
          setPlayerName={setPlayerName}
        />

        <ActionButtons
          playerName={playerName}
        />

        <HomeFooter />
      </GlassCard>
    </PageContainer>
  );
}