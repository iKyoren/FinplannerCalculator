import { Button } from "@/components/ui/button";

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
    <section className="relative py-8 sm:py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full border-2 border-transparent bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] p-0.5 shadow-lg mb-3 sm:mb-4 animate-pulse-glow">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src="/attached_assets/1000039624_1749767113981.png" 
                  alt="FinPlanner Logo" 
                  className="w-full h-full object-contain p-1 sm:p-1.5 md:p-2 lg:p-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full gradient-primary rounded-full flex items-center justify-center"><span class="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">F</span></div>';
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4 text-center animate-slide-in px-2">
              <span className="bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] bg-clip-text text-transparent">
                FinPlanner
              </span>
            </h1>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground text-center mb-3 sm:mb-4 px-2">
              Planejamento Financeiro Inteligente
            </h2>
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-2 leading-relaxed max-w-2xl mx-auto px-4">
            Seu planejamento financeiro inteligente com IA especializada
          </p>
          
          <p className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto px-4">
            Descubra os melhores investimentos para seu perfil, calcule rendimentos e aprenda sobre o mercado financeiro
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto px-4">
            <Button 
              onClick={scrollToCalculators}
              size="lg"
              className="w-full sm:w-auto gradient-primary hover:opacity-90 font-semibold text-base px-8 py-3 shadow-lg transition-all duration-300 hover:scale-105"
            >
              Começar Agora
            </Button>
            <Button 
              onClick={scrollToMarketData}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-primary/30 hover:border-primary/60 text-primary hover:bg-primary/10 font-semibold text-base px-8 py-3 transition-all duration-300"
            >
              Ver Mercado
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
