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
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-2 border-transparent bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] p-0.5 shadow-lg mb-3 sm:mb-4 animate-pulse-glow">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src="/attached_assets/5237471_1749608011733.png" 
                  alt="FinPlanner Logo" 
                  className="w-full h-full object-contain p-1.5 sm:p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full gradient-primary rounded-full flex items-center justify-center"><span class="text-white font-bold text-2xl sm:text-3xl md:text-4xl">F</span></div>';
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
          
          <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto px-4">
            Descubra os melhores investimentos para seu perfil, calcule rendimentos e aprenda sobre o mercado financeiro
          </p>
        </div>
      </div>
    </section>
  );
}
