import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, PieChart, BarChart3, Target } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    { text: "Inicializando sistema financeiro...", icon: DollarSign },
    { text: "Carregando dados de mercado...", icon: TrendingUp },
    { text: "Preparando análises...", icon: PieChart },
    { text: "Configurando assistente IA...", icon: BarChart3 },
    { text: "Finalizando carregamento...", icon: Target }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update phase based on progress
        const phaseIndex = Math.floor(newProgress / 20);
        if (phaseIndex < phases.length && phaseIndex !== currentPhase) {
          setCurrentPhase(phaseIndex);
        }
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete, currentPhase, phases.length]);

  const CurrentIcon = phases[currentPhase]?.icon || DollarSign;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center px-8">
        {/* Logo animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full border-2 border-transparent bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] p-0.5 shadow-2xl animate-pulse">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <div className="w-full h-full gradient-primary rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-2xl">F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title with gradient */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2 animate-fade-in-up">
          <span className="bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] bg-clip-text text-transparent">
            FinPlanner
          </span>
        </h1>

        <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          Planejamento Financeiro Inteligente
        </p>

        {/* Loading phase indicator */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center justify-center mb-4">
            <CurrentIcon className="w-6 h-6 text-primary mr-3 animate-spin" />
            <span className="text-sm text-muted-foreground">
              {phases[currentPhase]?.text || "Carregando..."}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mx-auto mb-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#1fb5d6] to-[#a855f7] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <div className="text-center p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Análise de Mercado</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
            <PieChart className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Recomendações IA</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/30">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Metas Personalizadas</p>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-secondary/30 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }}></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "2s" }}></div>
    </div>
  );
}