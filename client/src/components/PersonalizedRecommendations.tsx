import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { getInvestmentRecommendation } from "@/lib/api";
import { TrendingUp, AlertCircle, Target, DollarSign, Info } from "lucide-react";

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
  description: string;
  howItWorks: string;
  minAmount: number;
  timeHorizon: string;
}

export default function PersonalizedRecommendations() {
  const [formData, setFormData] = useState<UserFinancialData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    leisureExpenses: 0,
    investmentProfile: "moderate",
    age: 30,
    investmentGoal: "long-term"
  });

  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [availableToInvest, setAvailableToInvest] = useState(0);

  const recommendationMutation = useMutation({
    mutationFn: async (data: UserFinancialData) => {
      // Calculate available amount
      const available = data.monthlyIncome - data.monthlyExpenses - data.leisureExpenses;
      setAvailableToInvest(available);
      
      // Generate personalized recommendations
      return generatePersonalizedRecommendations(data, available);
    },
    onSuccess: (data) => {
      setRecommendations(data);
    }
  });

  const generatePersonalizedRecommendations = (userData: UserFinancialData, availableAmount: number): InvestmentRecommendation[] => {
    const { investmentProfile, age, monthlyIncome } = userData;
    const recommendations: InvestmentRecommendation[] = [];

    // Emergency Reserve (Always first recommendation)
    const emergencyAmount = userData.monthlyExpenses * 6;
    recommendations.push({
      name: "Reserva de Emergência",
      allocation: Math.min(40, (emergencyAmount / (availableAmount * 12)) * 100),
      expectedReturn: "100% do CDI (~13% a.a.)",
      risk: "Baixo",
      reason: `Com gastos de R$ ${userData.monthlyExpenses.toLocaleString()}/mês, você precisa de R$ ${emergencyAmount.toLocaleString()} de reserva. Isso representa ${(emergencyAmount / monthlyIncome).toFixed(1)} meses da sua renda.`,
      description: "Dinheiro guardado para emergências como desemprego, problemas de saúde ou reparos urgentes.",
      howItWorks: "Invista em CDB com liquidez diária ou Tesouro Selic. O dinheiro fica disponível para saque imediato, rendendo próximo ao CDI.",
      minAmount: 1000,
      timeHorizon: "Imediato"
    });

    if (investmentProfile === "conservative" || age > 50) {
      // Conservative portfolio
      recommendations.push({
        name: "CDB de Bancos Médios",
        allocation: 35,
        expectedReturn: "110-120% do CDI (~14-15% a.a.)",
        risk: "Baixo",
        reason: `Seu perfil ${investmentProfile === "conservative" ? "conservador" : "próximo à aposentadoria"} prioriza segurança. Bancos médios pagam mais que grandes bancos.`,
        description: "Certificado de Depósito Bancário com rentabilidade superior aos grandes bancos.",
        howItWorks: "Você empresta dinheiro para o banco por um período determinado. O FGC garante até R$ 250 mil por banco. Distribua entre 3-4 bancos diferentes.",
        minAmount: 5000,
        timeHorizon: "1-3 anos"
      });

      recommendations.push({
        name: "Tesouro IPCA+",
        allocation: 25,
        expectedReturn: "IPCA + 5,5-6,5% a.a.",
        risk: "Baixo",
        reason: "Protege contra inflação e garante ganho real. Ideal para objetivos de longo prazo.",
        description: "Título público que rende inflação + taxa fixa, garantindo poder de compra.",
        howItWorks: "O governo paga IPCA (inflação) + uma taxa fixa. Se a inflação for 4% e a taxa 6%, você ganha 10% no ano.",
        minAmount: 50,
        timeHorizon: "5+ anos"
      });

    } else if (investmentProfile === "moderate") {
      // Moderate portfolio
      recommendations.push({
        name: "Fundos de Ações Diversificados",
        allocation: 30,
        expectedReturn: "12-18% a.a. (histórico)",
        risk: "Médio",
        reason: `Com R$ ${availableAmount.toLocaleString()}/mês disponível, você pode assumir mais risco para buscar maiores retornos a longo prazo.`,
        description: "Fundos que investem em ações de várias empresas, reduzindo risco individual.",
        howItWorks: "O gestor compra ações de dezenas de empresas. Você compra cotas do fundo. Se as empresas lucram, suas cotas se valorizam.",
        minAmount: 1000,
        timeHorizon: "3+ anos"
      });

      recommendations.push({
        name: "FIIs (Fundos Imobiliários)",
        allocation: 20,
        expectedReturn: "8-12% a.a. em dividendos",
        risk: "Médio",
        reason: "Diversifica para o setor imobiliário e gera renda mensal passiva. Dividendos são isentos de IR.",
        description: "Investe em imóveis comerciais sem precisar comprar um imóvel inteiro.",
        howItWorks: "O fundo compra shoppings, galpões, hospitais. Você recebe parte do aluguel todo mês. Distribua entre 8-10 FIIs diferentes.",
        minAmount: 1000,
        timeHorizon: "2+ anos"
      });

      recommendations.push({
        name: "Tesouro Prefixado",
        allocation: 15,
        expectedReturn: "10,5-11,5% a.a.",
        risk: "Baixo",
        reason: "Complementa a carteira com renda fixa de qualidade e rentabilidade garantida.",
        description: "Título público com taxa fixa definida no momento da compra.",
        howItWorks: "Você sabe exatamente quanto vai receber no vencimento. Se a taxa for 11% a.a., isso é garantido independente da economia.",
        minAmount: 50,
        timeHorizon: "2-5 anos"
      });

    } else { // aggressive
      recommendations.push({
        name: "Ações Individuais (Blue Chips)",
        allocation: 40,
        expectedReturn: "15-25% a.a. (histórico)",
        risk: "Alto",
        reason: `Seu perfil agressivo e idade de ${age} anos permitem assumir mais risco para maximizar retornos de longo prazo.`,
        description: "Ações de empresas consolidadas como Vale, Itaú, Ambev, Petrobras.",
        howItWorks: "Você se torna sócio das melhores empresas do país. Recebe dividendos e pode ganhar com valorização das ações. Estude antes de investir.",
        minAmount: 500,
        timeHorizon: "5+ anos"
      });

      recommendations.push({
        name: "ETFs Internacionais",
        allocation: 25,
        expectedReturn: "10-15% a.a. (dólar)",
        risk: "Alto",
        reason: "Diversifica geograficamente e protege contra riscos do Brasil. Essencial para carteiras agressivas.",
        description: "Fundos que replicam índices internacionais como S&P 500.",
        howItWorks: "Investe automaticamente nas 500 maiores empresas americanas ou outros índices globais. Exposição cambial protege contra desvalorização do real.",
        minAmount: 1000,
        timeHorizon: "3+ anos"
      });

      recommendations.push({
        name: "Criptomoedas (BTC/ETH)",
        allocation: 10,
        expectedReturn: "Muito volátil (±60% a.a.)",
        risk: "Alto",
        reason: `Apenas ${Math.round(availableAmount * 0.1)} reais/mês (~5% da carteira) para não comprometer patrimônio. Potencial disruptivo alto.`,
        description: "Bitcoin e Ethereum como reserva de valor digital e proteção contra inflação monetária.",
        howItWorks: "Compre mensalmente quantias pequenas (média de preços). Use exchanges confiáveis. Transfira para carteira própria acima de R$ 5.000.",
        minAmount: 100,
        timeHorizon: "5+ anos"
      });

      recommendations.push({
        name: "Fundos Multimercado",
        allocation: 15,
        expectedReturn: "CDI + 3-8% a.a.",
        risk: "Médio",
        reason: "Gestores profissionais buscam oportunidades em vários mercados para otimizar retorno vs risco.",
        description: "Fundos flexíveis que investem em ações, renda fixa, câmbio e derivativos.",
        howItWorks: "Gestores experientes ajustam a carteira conforme cenário econômico. Podem ficar defensivos em crises ou agressivos em alta.",
        minAmount: 5000,
        timeHorizon: "2+ anos"
      });
    }

    return recommendations;
  };

  const handleSubmit = () => {
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

  return (
    <section id="recomendacoes" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Recomendações Personalizadas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Receba sugestões de investimentos personalizadas baseadas na sua situação financeira e perfil de risco
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!recommendations.length ? (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Seus Dados Financeiros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="monthlyIncome">Renda Mensal Líquida (R$)</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={formData.monthlyIncome || ""}
                      onChange={(e) => setFormData({...formData, monthlyIncome: Number(e.target.value)})}
                      placeholder="Ex: 5000"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyExpenses">Gastos Essenciais Mensais (R$)</Label>
                    <Input
                      id="monthlyExpenses"
                      type="number"
                      value={formData.monthlyExpenses || ""}
                      onChange={(e) => setFormData({...formData, monthlyExpenses: Number(e.target.value)})}
                      placeholder="Ex: 3000"
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Moradia, alimentação, transporte, etc.</p>
                  </div>

                  <div>
                    <Label htmlFor="leisureExpenses">Gastos com Lazer (R$)</Label>
                    <Input
                      id="leisureExpenses"
                      type="number"
                      value={formData.leisureExpenses || ""}
                      onChange={(e) => setFormData({...formData, leisureExpenses: Number(e.target.value)})}
                      placeholder="Ex: 800"
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Entretenimento, viagens, hobbies, etc.</p>
                  </div>

                  <div>
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age || ""}
                      onChange={(e) => setFormData({...formData, age: Number(e.target.value)})}
                      placeholder="Ex: 30"
                      className="mt-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="investmentProfile">Perfil de Investidor</Label>
                    <Select
                      value={formData.investmentProfile}
                      onValueChange={(value: "conservative" | "moderate" | "aggressive") => 
                        setFormData({...formData, investmentProfile: value})
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">
                          Conservador - Priorizo segurança, aceito menores retornos
                        </SelectItem>
                        <SelectItem value="moderate">
                          Moderado - Equilibrio entre segurança e rentabilidade
                        </SelectItem>
                        <SelectItem value="aggressive">
                          Agressivo - Busco maiores retornos, aceito mais riscos
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full mt-8 gradient-primary hover:opacity-90 font-semibold text-lg py-6"
                  disabled={recommendationMutation.isPending}
                >
                  {recommendationMutation.isPending ? (
                    "Analisando seu perfil..."
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Gerar Recomendações Personalizadas
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Financial Summary */}
              <Card className="border-border/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Renda Mensal</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(formData.monthlyIncome)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gastos Totais</p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(formData.monthlyExpenses + formData.leisureExpenses)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Disponível para Investir</p>
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(availableToInvest)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Perfil</p>
                      <Badge className="text-sm capitalize">
                        {formData.investmentProfile === "conservative" ? "Conservador" : 
                         formData.investmentProfile === "moderate" ? "Moderado" : "Agressivo"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <div className="grid gap-6">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-semibold">{rec.name}</CardTitle>
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
                              Saiba Mais
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{rec.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">O que é?</h4>
                                <p className="text-muted-foreground">{rec.description}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Como funciona?</h4>
                                <p className="text-muted-foreground">{rec.howItWorks}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                <div>
                                  <p className="text-sm font-medium">Valor Mínimo</p>
                                  <p className="text-lg">{formatCurrency(rec.minAmount)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Prazo Recomendado</p>
                                  <p className="text-lg">{rec.timeHorizon}</p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                            Por que recomendamos para você:
                          </h4>
                          <p className="text-sm mt-1">{rec.reason}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="text-sm text-muted-foreground">Valor sugerido/mês:</span>
                          <span className="font-semibold">
                            {formatCurrency(availableToInvest * (rec.allocation / 100))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                        Importante: Diversificação é Fundamental
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Estas são sugestões baseadas em seu perfil. Sempre diversifique seus investimentos 
                        e nunca invista todo seu dinheiro em uma única opção. Comece gradualmente e 
                        aumente os investimentos conforme ganha experiência.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button 
                  onClick={() => {
                    setRecommendations([]);
                    setFormData({
                      monthlyIncome: 0,
                      monthlyExpenses: 0,
                      leisureExpenses: 0,
                      investmentProfile: "moderate",
                      age: 30,
                      investmentGoal: "long-term"
                    });
                  }}
                  variant="outline"
                  className="text-muted-foreground"
                >
                  Fazer Nova Análise
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}