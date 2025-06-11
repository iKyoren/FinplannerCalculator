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
      <main className="space-y-4">
        <Hero />
        <div className="container-compact">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <MarketData />
              <Calculators />
            </div>
            <div className="space-y-6">
              <Education />
              <InvestmentProfiles />
            </div>
          </div>
          <div className="mt-6">
            <PersonalizedRecommendations />
          </div>
        </div>
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  );
}
