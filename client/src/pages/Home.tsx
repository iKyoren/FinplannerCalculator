import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MarketData from "@/components/MarketData";
import Education from "@/components/Education";
import InvestmentProfiles from "@/components/InvestmentProfiles";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import Calculators from "@/components/Calculators";
import ChatAssistant from "@/components/ChatAssistant";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <MarketData />
        <Education />
        <InvestmentProfiles />
        <PersonalizedRecommendations />
        <Calculators />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  );
}
