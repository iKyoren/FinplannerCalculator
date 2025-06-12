import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, Zap, Shield, TrendingUp } from "lucide-react";

export default function Brokers() {
  const topBrokers = [
    {
      name: "XP Investimentos",
      rating: 4.8,
      strengths: ["Maior corretora do Brasil", "Research de qualidade", "Plataforma completa"],
      fees: "Taxa zero para ações e fundos",
      minAmount: "R$ 0",
      platforms: ["Web", "App", "HomebrokerXP"],
      highlights: "Mais de 3 milhões de clientes, IPO na Nasdaq em 2020",
      category: "Completa",
      icon: Users
    },
    {
      name: "Rico Investimentos",
      rating: 4.7,
      strengths: ["Tecnologia inovadora", "Sem taxas abusivas", "Educação financeira"],
      fees: "Taxa zero para ações",
      minAmount: "R$ 0",
      platforms: ["App Rico", "Web", "API"],
      highlights: "Foco em democratização dos investimentos",
      category: "Digital",
      icon: Zap
    },
    {
      name: "Clear Corretora",
      rating: 4.6,
      strengths: ["Plataforma profissional", "Day trade", "Análise técnica"],
      fees: "R$ 2,49 por operação",
      minAmount: "R$ 0",
      platforms: ["Clear", "ProfitChart", "API"],
      highlights: "Ideal para traders ativos e investidores experientes",
      category: "Trader",
      icon: TrendingUp
    },
    {
      name: "Inter Invest",
      rating: 4.5,
      strengths: ["Integração bancária", "CDB próprio", "Sem taxas"],
      fees: "Taxa zero",
      minAmount: "R$ 1",
      platforms: ["App Inter", "Web"],
      highlights: "Conta corrente + investimentos em um só lugar",
      category: "Digital",
      icon: Shield
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Premium": return <Star className="w-4 h-4 text-yellow-500" />;
      case "Digital": return <Zap className="w-4 h-4 text-blue-500" />;
      case "Trader": return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case "Completa": return <Shield className="w-4 h-4 text-green-500" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <section id="corretoras" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Corretoras Recomendadas
          </h1>
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Melhores Corretoras 2025
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ranking baseado em dados da B3, Anefac e avaliações de clientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topBrokers.map((broker, index) => (
            <Card key={index} className="card-hover border-border/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(broker.category)}
                    <CardTitle className="text-lg font-semibold">{broker.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{broker.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{broker.highlights}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-foreground">Taxas:</span>
                    <p className="text-muted-foreground">{broker.fees}</p>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Mínimo:</span>
                    <p className="text-muted-foreground">{broker.minAmount}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-foreground mb-2 block">Pontos Fortes:</span>
                  <ul className="space-y-1">
                    {broker.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <span className="font-medium text-foreground mb-2 block">Plataformas:</span>
                  <div className="flex flex-wrap gap-1">
                    {broker.platforms.map((platform, idx) => (
                      <span key={idx} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}