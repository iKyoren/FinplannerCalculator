import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { getInvestmentRecommendation } from "@/lib/api";
import { useProfile } from "@/contexts/ProfileContext";
import { TrendingUp, AlertCircle, Target, DollarSign, Info, Star, Shield, Zap } from "lucide-react";

interface UserFinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  leisureExpenses: number;
  investmentProfile: "conservative" | "moderate" | "aggressive";
  age: number;
  investmentGoal: string;
}

interface InvestmentRecommendation {
  name: string;
  allocation: number;
  expectedReturn: string;
  risk: "Baixo" | "Médio" | "Alto";
  reason: string;
  theory: string;
  practice: string;
  minAmount: number;
  timeHorizon: string;
  category: "Nacional" | "Internacional";
}

interface RecommendationResponse {
  nationalInvestments: InvestmentRecommendation[];
  internationalInvestments: InvestmentRecommendation[];
  summary: string;
  warnings: string[];
}

const topBrokers = [
  {
    name: "XP Investimentos",
    rating: 4.8,
    strengths: ["Maior corretora do Brasil", "Research de qualidade", "Plataforma completa"],
    fees: "Taxa zero para ações e fundos",
    minAmount: "R$ 0",
    platforms: ["Web", "App", "HomebrokerXP"],
    highlights: "Mais de 3 milhões de clientes, IPO na Nasdaq em 2020",
    category: "Premium"
  },
  {
    name: "Nu Invest",
    rating: 4.6,
    strengths: ["Interface simples", "Integração com Nubank", "Taxa zero"],
    fees: "Taxa zero para ações, FIIs e ETFs",
    minAmount: "R$ 1",
    platforms: ["App Nubank", "Web"],
    highlights: "Crescimento de 400% em clientes em 2023",
    category: "Digital"
  },
  {
    name: "Rico Investimentos",
    rating: 4.5,
    strengths: ["Educação financeira", "Atendimento especializado", "Variedade de produtos"],
    fees: "Taxa zero para ações e fundos",
    minAmount: "R$ 0",
    platforms: ["Rico App", "Web", "Rico Pro"],
    highlights: "Adquirida pelo BTG Pactual em 2017, foco em democratização",
    category: "Completa"
  },
  {
    name: "Inter Invest",
    rating: 4.4,
    strengths: ["Banco digital completo", "Cashback em investimentos", "Interface moderna"],
    fees: "Taxa zero para ações e FIIs",
    minAmount: "R$ 1",
    platforms: ["App Inter", "Web"],
    highlights: "Único banco digital com super app completo",
    category: "Digital"
  },
  {
    name: "Clear Corretora",
    rating: 4.7,
    strengths: ["Foco em day trade", "Plataforma profissional", "Análises técnicas"],
    fees: "R$ 2,90 por ordem de ações",
    minAmount: "R$ 0",
    platforms: ["Clear Pro", "ProfitChart", "Mobile"],
    highlights: "Líder em operações de day trade no Brasil",
    category: "Trader"
  }
];

export default function PersonalizedRecommendations() {
  const { selectedProfile } = useProfile();
  const [formData, setFormData] = useState<UserFinancialData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    leisureExpenses: 0,
    investmentProfile: "moderate",
    age: 30,
    investmentGoal: "long-term"
  });

  // Atualiza o perfil quando selecionado na análise de perfil
  useEffect(() => {
    if (selectedProfile) {
      setFormData(prev => ({
        ...prev,
        investmentProfile: selectedProfile
      }));
    }
  }, [selectedProfile]);

  const [nationalRecommendations, setNationalRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [internationalRecommendations, setInternationalRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [availableToInvest, setAvailableToInvest] = useState(0);

  const recommendationMutation = useMutation({
    mutationFn: async (data: UserFinancialData) => {
      const available = data.monthlyIncome - data.monthlyExpenses - data.leisureExpenses;
      setAvailableToInvest(available);
      
      const response = await fetch('/api/personalized-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyIncome: data.monthlyIncome,
          monthlyExpenses: data.monthlyExpenses,
          leisureExpenses: data.leisureExpenses,
          investmentProfile: data.investmentProfile,
          age: data.age
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }
      
      return response.json();
    },
    onSuccess: (data: RecommendationResponse) => {
      if (data.nationalInvestments && data.internationalInvestments) {
        setNationalRecommendations(data.nationalInvestments);
        setInternationalRecommendations(data.internationalInvestments);
        setSummary(data.summary);
        setWarnings(data.warnings || []);
      }
    }
  });

  const handleSubmit = () => {
    if (!selectedProfile) {
      alert("Por favor, primeiro selecione seu perfil de investidor na seção 'Análise de Perfil' acima.");
      return;
    }

    if (formData.monthlyIncome <= 0 || formData.monthlyExpenses <= 0) {
      alert("Por favor, preencha todos os campos com valores válidos.");
      return;
    }

    if (formData.monthlyExpenses + formData.leisureExpenses >= formData.monthlyIncome) {
      alert("Seus gastos são maiores ou iguais à sua renda. Revise suas finanças antes de investir.");
      return;
    }

    recommendationMutation.mutate(formData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case "Baixo": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Médio": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Alto": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Premium": return <Star className="w-4 h-4 text-yellow-500" />;
      case "Digital": return <Zap className="w-4 h-4 text-blue-500" />;
      case "Trader": return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case "Completa": return <Shield className="w-4 h-4 text-green-500" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const renderRecommendationCard = (rec: InvestmentRecommendation, index: number) => (
    <Card key={index} className="card-hover border-border/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{rec.name}</CardTitle>
            <Badge className="mt-2 text-xs bg-primary/10 text-primary border-primary/20">
              {rec.category}
            </Badge>
            <div className="flex items-center gap-3 mt-2">
              <Badge className={getRiskColor(rec.risk)}>
                Risco {rec.risk}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {rec.allocation}% da carteira
              </span>
              <span className="text-sm font-medium text-green-600">
                {rec.expectedReturn}
              </span>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-1" />
                Detalhes
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{rec.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">💡 Como funciona na teoria</h4>
                  <p className="text-muted-foreground">{rec.theory}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🚀 Como investir na prática</h4>
                  <p className="text-muted-foreground">{rec.practice}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Valor mínimo:</span>
                    <p className="text-lg font-bold text-primary">{formatCurrency(rec.minAmount)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Prazo recomendado:</span>
                    <p className="text-lg font-bold text-primary">{rec.timeHorizon}</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Por que foi recomendado para você?</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{rec.reason}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <section id="recomendacoes" className="section-spacing">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Recomendações Personalizadas</h2>
        <p className="text-lg text-muted-foreground">
          Receba sugestões de investimentos baseadas no seu perfil financeiro e objetivos
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="card-compact">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Seus Dados Financeiros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyIncome">Renda Mensal (R$)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="5000"
                  value={formData.monthlyIncome || ""}
                  onChange={(e) => setFormData({...formData, monthlyIncome: parseFloat(e.target.value) || 0})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="monthlyExpenses">Gastos Mensais (R$)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  placeholder="3000"
                  value={formData.monthlyExpenses || ""}
                  onChange={(e) => setFormData({...formData, monthlyExpenses: parseFloat(e.target.value) || 0})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="leisureExpenses">Gastos com Lazer (R$)</Label>
                <Input
                  id="leisureExpenses"
                  type="number"
                  placeholder="800"
                  value={formData.leisureExpenses || ""}
                  onChange={(e) => setFormData({...formData, leisureExpenses: parseFloat(e.target.value) || 0})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  value={formData.age || ""}
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 30})}
                  className="mt-2"
                />
              </div>

              {!selectedProfile && (
                <div className="md:col-span-2">
                  <Card className="bg-yellow-500/10 border-yellow-500/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-yellow-600 dark:text-yellow-400">
                        Selecione seu Perfil de Investidor
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Para receber recomendações personalizadas, primeiro selecione seu perfil de investidor na seção "Análise de Perfil" acima.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {selectedProfile && (
                <div className="md:col-span-2">
                  <Label>Perfil de Investidor Selecionado</Label>
                  <div className="mt-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {selectedProfile === 'conservative' ? 'Conservador' :
                       selectedProfile === 'moderate' ? 'Moderado' : 'Agressivo'}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Perfil definido na análise de perfil será usado para suas recomendações
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={handleSubmit} 
              className="w-full gradient-primary"
              disabled={recommendationMutation.isPending || !selectedProfile}
            >
              {recommendationMutation.isPending ? "Gerando recomendações..." : 
               !selectedProfile ? "Selecione seu perfil primeiro" : "Gerar Recomendações"}
            </Button>
          </CardContent>
        </Card>

        {/* Summary Info */}
        <Card className="card-compact">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                1. Preencha seus dados financeiros no formulário ao lado
              </p>
              <p>
                2. Seu perfil de investidor será usado automaticamente (selecionado na análise de perfil)
              </p>
              <p>
                3. Receba recomendações personalizadas baseadas em IA e dados do mercado
              </p>
              <p>
                4. Analise as sugestões e consulte as corretoras recomendadas para investir
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {(nationalRecommendations.length > 0 || internationalRecommendations.length > 0) && (
        <div className="mt-8 space-y-8">
          {/* Summary */}
          {summary && (
            <Card className="card-compact">
              <CardHeader>
                <CardTitle>Estratégia Personalizada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{summary}</p>
                {availableToInvest > 0 && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <p className="font-medium">Valor disponível para investir: {formatCurrency(availableToInvest)}/mês</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                  <AlertCircle className="w-5 h-5" />
                  Alertas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-600 dark:text-yellow-400">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* National Investments */}
          {nationalRecommendations.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4">💰 Investimentos Nacionais</h3>
              <div className="grid gap-4">
                {nationalRecommendations.map((rec, index) => renderRecommendationCard(rec, index))}
              </div>
            </div>
          )}

          {/* International Investments */}
          {internationalRecommendations.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4">🌍 Investimentos Internacionais</h3>
              <div className="grid gap-4">
                {internationalRecommendations.map((rec, index) => renderRecommendationCard(rec, index))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}