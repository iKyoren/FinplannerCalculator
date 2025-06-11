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

export default function PersonalizedRecommendations() {
  const [formData, setFormData] = useState<UserFinancialData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    leisureExpenses: 0,
    investmentProfile: "moderate",
    age: 30,
    investmentGoal: "long-term"
  });

  const [nationalRecommendations, setNationalRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [internationalRecommendations, setInternationalRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [availableToInvest, setAvailableToInvest] = useState(0);

  const recommendationMutation = useMutation({
    mutationFn: async (data: UserFinancialData) => {
      // Calculate available amount
      const available = data.monthlyIncome - data.monthlyExpenses - data.leisureExpenses;
      setAvailableToInvest(available);
      
      return await getInvestmentRecommendation({
        monthlyIncome: data.monthlyIncome,
        monthlyExpenses: data.monthlyExpenses,
        leisureExpenses: data.leisureExpenses,
        investmentProfile: data.investmentProfile,
        age: data.age,
        availableToInvest: available
      });
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