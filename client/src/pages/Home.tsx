import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MarketData from "@/components/MarketData";
import Education from "@/components/Education";
import Brokers from "@/components/Brokers";
import InvestmentProfiles from "@/components/InvestmentProfiles";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import Calculators from "@/components/Calculators";
import ChatAssistant from "@/components/ChatAssistant";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-0">
        {/* 1. Apresentação do projeto (Hero) */}
        <Hero />
        
        {/* 2. Tópicos e informações (Education) */}
        <Education />
        
        {/* 3. Gráficos e dados de mercado */}
        <MarketData />
        
        {/* 4. Selecionar o perfil investidor */}
        <InvestmentProfiles />
        
        {/* 5. Recomendação personalizada */}
        <PersonalizedRecommendations />
        
        {/* 6. Calculadoras (Juros compostos, aposentadoria etc) */}
        <Calculators />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  );
}
