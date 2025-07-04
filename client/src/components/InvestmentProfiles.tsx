import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Scale, Rocket, Check } from "lucide-react";
import { useProfile } from "@/contexts/ProfileContext";
import type { InvestmentProfile, ProfileData } from "@/types";

export default function InvestmentProfiles() {
  const [localSelectedProfile, setLocalSelectedProfile] = useState<InvestmentProfile | null>(null);
  const { setSelectedProfile } = useProfile();

  const profiles: Record<InvestmentProfile, ProfileData & { icon: any }> = {
    conservative: {
      name: "Conservador",
      color: "success",
      description: "Ideal para quem prioriza a segurança e preservação do capital.",
      expectedReturn: "8-12% a.a.",
      riskLevel: "Baixo",
      timeHorizon: "Curto/Médio",
      characteristics: [
        "Baixo risco de perda do capital",
        "Retornos previsíveis",
        "Liquidez diária na maioria dos produtos",
        "Proteção contra a inflação"
      ],
      investments: [
        "Poupança (6-8% a.a.)",
        "CDB (10-12% a.a.)",
        "Tesouro Direto (11% a.a.)",
        "LCI/LCA (9-11% a.a.)"
      ],
      icon: Shield
    },
    moderate: {
      name: "Moderado",
      color: "warning",
      description: "Equilibra segurança e rentabilidade, aceitando algum risco.",
      expectedReturn: "12-18% a.a.",
      riskLevel: "Médio",
      timeHorizon: "Médio/Longo",
      characteristics: [
        "Risco controlado",
        "Diversificação de ativos",
        "Retornos superiores à renda fixa",
        "Horizonte de médio a longo prazo"
      ],
      investments: [
        "Fundos DI (12-14% a.a.)",
        "Fundos Multimercado (15-18% a.a.)",
        "Ações Blue Chips (12-20% a.a.)",
        "FIIs (10-15% a.a.)"
      ],
      icon: Scale
    },
    aggressive: {
      name: "Agressivo",
      color: "danger",
      description: "Busca máxima rentabilidade, aceitando alta volatilidade.",
      expectedReturn: "18-30% a.a.",
      riskLevel: "Alto",
      timeHorizon: "Longo",
      characteristics: [
        "Alto potencial de retorno",
        "Alta volatilidade",
        "Necessário conhecimento avançado",
        "Horizonte de longo prazo obrigatório"
      ],
      investments: [
        "Ações Growth (15-30% a.a.)",
        "Criptomoedas (20-50% a.a.)",
        "ETFs Internacionais (10-25% a.a.)",
        "Opções e Derivativos"
      ],
      icon: Rocket
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success':
        return {
          border: 'hover:border-green-400',
          bg: 'bg-green-400/20',
          text: 'text-green-400',
          button: 'btn-success hover:bg-green-600'
        };
      case 'warning':
        return {
          border: 'hover:border-yellow-400',
          bg: 'bg-yellow-400/20',
          text: 'text-yellow-400',
          button: 'btn-warning hover:bg-yellow-600'
        };
      case 'danger':
        return {
          border: 'hover:border-red-400',
          bg: 'bg-red-400/20',
          text: 'text-red-400',
          button: 'btn-danger hover:bg-red-600'
        };
      default:
        return {
          border: 'hover:border-primary',
          bg: 'bg-primary/20',
          text: 'text-primary',
          button: 'bg-primary hover:bg-primary/90'
        };
    }
  };

  const scrollToRecommendations = () => {
    const element = document.getElementById("recomendacoes");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProfileSelect = (profile: InvestmentProfile) => {
    setLocalSelectedProfile(profile);
    setSelectedProfile(profile); // Atualiza o contexto global
    // Redirecionar automaticamente para recomendações
    setTimeout(() => {
      scrollToRecommendations();
    }, 300);
  };

  return (
    <section id="perfis" className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Análise de Perfil
          </h1>
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Perfis de Investimento
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra qual estratégia de investimento combina com seus objetivos financeiros e tolerância ao risco
          </p>
        </div>

        {/* Profile Selection Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(profiles).map(([key, profile]) => {
            const colors = getColorClasses(profile.color);
            const IconComponent = profile.icon;
            
            return (
              <Card key={key} className={`card-hover border-border/50 transition-all ${colors.border} h-full flex flex-col`}>
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`${colors.text} h-8 w-8`} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{profile.name}</h3>
                    <div className={`${colors.text} font-semibold`}>{profile.riskLevel} Risco</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Retorno esperado:</span>
                      <span className="text-foreground font-semibold">{profile.expectedReturn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risco:</span>
                      <span className={`${colors.text} font-semibold`}>{profile.riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prazo ideal:</span>
                      <span className="text-foreground font-semibold">{profile.timeHorizon}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-grow">
                    <h4 className="font-semibold text-foreground">Principais investimentos:</h4>
                    <ul className="space-y-2">
                      {profile.investments.map((investment, index) => (
                        <li key={index} className="flex items-center text-muted-foreground text-sm">
                          <Check className={`${colors.text} mr-2 h-4 w-4 flex-shrink-0`} />
                          {investment}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <Button 
                      onClick={() => handleProfileSelect(key as InvestmentProfile)}
                      className="w-full gradient-primary hover:opacity-90 font-semibold py-3 text-base transition-opacity whitespace-nowrap"
                    >
                      Escolher Este Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          </div>
        </div>

        {/* Selected Profile Info Section */}
        {localSelectedProfile && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-center mb-6 text-foreground">
              Análise
            </h3>
            <Card className="border-border/50 animate-fade-in-up">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Perfil Selecionado: <span className="gradient-text">{profiles[localSelectedProfile].name}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Características</h4>
                    <ul className="space-y-2">
                      {profiles[localSelectedProfile].characteristics.map((characteristic: string, index: number) => (
                        <li key={index} className="flex items-center text-muted-foreground">
                          <Check className={`${getColorClasses(profiles[localSelectedProfile].color).text} mr-2 h-4 w-4`} />
                          {characteristic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Investimentos Recomendados</h4>
                    <ul className="space-y-2">
                      {profiles[localSelectedProfile].investments.map((investment: string, index: number) => (
                        <li key={index} className="flex items-center text-muted-foreground">
                          <Check className={`${getColorClasses(profiles[localSelectedProfile].color).text} mr-2 h-4 w-4`} />
                          {investment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground mb-3">{profiles[localSelectedProfile].description}</p>
                  <Button onClick={scrollToRecommendations} className="gradient-primary hover:opacity-90">
                    Ver Recomendações Personalizadas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}