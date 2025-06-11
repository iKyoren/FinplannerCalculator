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
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-transparent bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] p-0.5 shadow-lg mb-4">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src="/attached_assets/5237471_1749608011733.png" 
                  alt="FinPlanner Logo" 
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full gradient-primary rounded-full flex items-center justify-center"><span class="text-white font-bold text-4xl md:text-5xl">F</span></div>';
                  }}
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="gradient-text">FinPlanner</span>
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground">
            Planejamento Financeiro Inteligente
          </h2>
          
          <p className="text-xl text-muted-foreground mb-2 leading-relaxed max-w-2xl mx-auto">
            Seu planejamento financeiro inteligente com IA especializada
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Descubra os melhores investimentos para seu perfil, calcule rendimentos e aprenda sobre o mercado financeiro com nossa plataforma completa
          </p>
        </div>
      </div>
    </section>
  );
}
