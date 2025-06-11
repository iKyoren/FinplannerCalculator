import { Button } from "@/components/ui/button";
import { TrendingUp, Play } from "lucide-react";

export default function Hero() {
  const scrollToCalculators = () => {
    const element = document.getElementById("calculadoras");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToMarketData = () => {
    const element = document.getElementById("mercado");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8">
            <img 
              src="/attached_assets/5237471_1749607344387.png" 
              alt="FinPlanner Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">FinPlanner</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4 leading-relaxed max-w-2xl mx-auto">
            Seu planejamento financeiro inteligente com IA especializada
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Descubra os melhores investimentos para seu perfil, calcule rendimentos e aprenda sobre o mercado financeiro com nossa plataforma completa
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToCalculators}
              size="lg" 
              className="gradient-primary hover:opacity-90 transition-opacity font-semibold"
            >
              Começar Agora
            </Button>
            <Button 
              onClick={scrollToMarketData}
              variant="outline" 
              size="lg" 
              className="font-semibold"
            >
              <Play className="mr-2 h-4 w-4" />
              Ver Demonstração
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
