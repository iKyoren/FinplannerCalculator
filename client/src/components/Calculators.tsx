import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { calculateCompoundInterest, calculateRetirement, getInvestmentRecommendation } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import type { CalculatorInputs, RetirementInputs } from "@/types";

export default function Calculators() {
  const [compoundInputs, setCompoundInputs] = useState<CalculatorInputs>({
    initialAmount: 10000,
    monthlyContribution: 500,
    interestRate: 12,
    timePeriod: 10,
    investmentType: "cdb"
  });

  const [retirementInputs, setRetirementInputs] = useState<RetirementInputs>({
    currentAge: 30,
    retirementAge: 60,
    desiredIncome: 5000,
    currentSavings: 50000
  });

  const [compoundResult, setCompoundResult] = useState<any>(null);
  const [retirementResult, setRetirementResult] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  const compoundMutation = useMutation({
    mutationFn: calculateCompoundInterest,
    onSuccess: (data) => {
      setCompoundResult(data);
      generateChartData();
      generateRecommendation();
    }
  });

  const retirementMutation = useMutation({
    mutationFn: calculateRetirement,
    onSuccess: (data) => setRetirementResult(data)
  });

  const recommendationMutation = useMutation({
    mutationFn: getInvestmentRecommendation,
    onSuccess: (data) => setRecommendation(data)
  });

  const [chartData, setChartData] = useState<any[]>([]);

  const investmentTypes = {
    cdb: { name: "CDB", rate: 12 },
    lci: { name: "LCI/LCA", rate: 10 },
    tesouro: { name: "Tesouro Direto", rate: 11 },
    acoes: { name: "Ações", rate: 15 },
    fiis: { name: "FIIs", rate: 13 },
    crypto: { name: "Criptomoedas", rate: 25 }
  };

  const generateChartData = () => {
    const data = [];
    const { initialAmount, monthlyContribution, interestRate, timePeriod } = compoundInputs;
    const monthlyRate = interestRate / 100 / 12;
    let currentValue = initialAmount;

    for (let year = 0; year <= timePeriod; year++) {
      if (year > 0) {
        for (let month = 0; month < 12; month++) {
          currentValue = (currentValue + monthlyContribution) * (1 + monthlyRate);
        }
      }
      data.push({
        year: `Ano ${year}`,
        value: Math.round(currentValue)
      });
    }
    setChartData(data);
  };

  const generateRecommendation = async () => {
    const profile = compoundInputs.interestRate <= 10 ? "conservative" : 
                   compoundInputs.interestRate <= 15 ? "moderate" : "aggressive";
    
    try {
      await recommendationMutation.mutateAsync({
        profile,
        amount: compoundInputs.initialAmount,
        timeHorizon: compoundInputs.timePeriod,
        monthlyContribution: compoundInputs.monthlyContribution
      });
    } catch (error) {
      console.error("Error getting recommendation:", error);
    }
  };

  const handleCompoundCalculate = () => {
    compoundMutation.mutate(compoundInputs);
  };

  const handleRetirementCalculate = () => {
    retirementMutation.mutate(retirementInputs);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <section id="calculadoras" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Calculadoras Financeiras
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simule seus investimentos, calcule rendimentos e planeje sua aposentadoria com ferramentas precisas
          </p>
        </div>

        <Tabs defaultValue="compound" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-6xl grid-cols-3 h-auto p-1">
              <TabsTrigger value="compound" className="text-xs sm:text-sm px-1 sm:px-3 py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                Juros Compostos
              </TabsTrigger>
              <TabsTrigger value="retirement" className="text-xs sm:text-sm px-1 sm:px-3 py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                Aposentadoria
              </TabsTrigger>
              <TabsTrigger value="comparison" className="text-xs sm:text-sm px-1 sm:px-3 py-3 whitespace-nowrap overflow-hidden text-ellipsis">
                Comparar
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Compound Interest Calculator */}
          <TabsContent value="compound">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Calculadora de Juros Compostos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="initialAmount">Valor Inicial (R$)</Label>
                      <Input
                        id="initialAmount"
                        type="number"
                        value={compoundInputs.initialAmount}
                        onChange={(e) => setCompoundInputs({...compoundInputs, initialAmount: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="monthlyContribution">Contribuição Mensal (R$)</Label>
                      <Input
                        id="monthlyContribution"
                        type="number"
                        value={compoundInputs.monthlyContribution}
                        onChange={(e) => setCompoundInputs({...compoundInputs, monthlyContribution: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="interestRate">Taxa de Juros Anual (%)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.1"
                        value={compoundInputs.interestRate}
                        onChange={(e) => setCompoundInputs({...compoundInputs, interestRate: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timePeriod">Período (anos)</Label>
                      <Input
                        id="timePeriod"
                        type="number"
                        value={compoundInputs.timePeriod}
                        onChange={(e) => setCompoundInputs({...compoundInputs, timePeriod: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="investmentType">Tipo de Investimento</Label>
                      <Select
                        value={compoundInputs.investmentType}
                        onValueChange={(value) => {
                          const selectedType = investmentTypes[value as keyof typeof investmentTypes];
                          setCompoundInputs({
                            ...compoundInputs, 
                            investmentType: value,
                            interestRate: selectedType.rate
                          });
                        }}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(investmentTypes).map(([key, type]) => (
                            <SelectItem key={key} value={key}>
                              {type.name} ({type.rate}% a.a.)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleCompoundCalculate}
                      className="w-full gradient-primary hover:opacity-90 font-semibold"
                      disabled={compoundMutation.isPending}
                    >
                      {compoundMutation.isPending ? 'Calculando...' : 'Calcular'}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {compoundResult && (
                      <Card className="bg-card/50">
                        <CardHeader>
                          <CardTitle className="text-lg">Resultados</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valor Investido:</span>
                            <span className="text-foreground font-semibold">
                              {formatCurrency(compoundResult.totalInvested)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Juros Ganhos:</span>
                            <span className="text-green-400 font-semibold">
                              {formatCurrency(compoundResult.totalInterest)}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-border pt-3">
                            <span className="text-muted-foreground">Valor Final:</span>
                            <span className="text-foreground font-bold text-xl">
                              {formatCurrency(compoundResult.finalAmount)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {recommendation && (
                      <Card className="bg-card/50">
                        <CardHeader>
                          <CardTitle className="text-lg">Recomendação IA</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{recommendation.recommendation}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Nível de Risco:</span>
                              <span className="font-semibold">{recommendation.riskLevel}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Retorno Esperado:</span>
                              <span className="font-semibold">{recommendation.expectedReturn}% a.a.</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {chartData.length > 0 && (
                      <div className="h-64">
                        <h4 className="text-lg font-semibold mb-4">Crescimento do Investimento</h4>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis 
                              stroke="hsl(var(--muted-foreground))" 
                              fontSize={12}
                              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip 
                              formatter={(value) => [formatCurrency(Number(value)), 'Valor']}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={3}
                              dot={{ fill: 'hsl(var(--primary))' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retirement Calculator */}
          <TabsContent value="retirement">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Calculadora de Aposentadoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="currentAge">Idade Atual</Label>
                      <Input
                        id="currentAge"
                        type="number"
                        value={retirementInputs.currentAge}
                        onChange={(e) => setRetirementInputs({...retirementInputs, currentAge: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="retirementAge">Idade Desejada para Aposentadoria</Label>
                      <Input
                        id="retirementAge"
                        type="number"
                        value={retirementInputs.retirementAge}
                        onChange={(e) => setRetirementInputs({...retirementInputs, retirementAge: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="desiredIncome">Renda Mensal Desejada (R$)</Label>
                      <Input
                        id="desiredIncome"
                        type="number"
                        value={retirementInputs.desiredIncome}
                        onChange={(e) => setRetirementInputs({...retirementInputs, desiredIncome: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="currentSavings">Valor Já Investido (R$)</Label>
                      <Input
                        id="currentSavings"
                        type="number"
                        value={retirementInputs.currentSavings}
                        onChange={(e) => setRetirementInputs({...retirementInputs, currentSavings: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <Button 
                      onClick={handleRetirementCalculate}
                      className="w-full gradient-primary hover:opacity-90 font-semibold"
                      disabled={retirementMutation.isPending}
                    >
                      {retirementMutation.isPending ? 'Calculando...' : 'Calcular Aposentadoria'}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {retirementResult && (
                      <>
                        <Card className="bg-card/50">
                          <CardHeader>
                            <CardTitle className="text-lg">Plano de Aposentadoria</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Anos para aposentar:</span>
                              <span className="text-foreground font-semibold">
                                {retirementResult.yearsToRetirement} anos
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Valor necessário:</span>
                              <span className="text-yellow-400 font-semibold">
                                {formatCurrency(retirementResult.totalNeeded)}
                              </span>
                            </div>
                            <div className="flex justify-between border-t border-border pt-3">
                              <span className="text-muted-foreground">Investimento mensal:</span>
                              <span className="text-foreground font-bold text-xl">
                                {formatCurrency(retirementResult.monthlyNeeded)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-card/50">
                          <CardHeader>
                            <CardTitle className="text-lg">Estratégia Recomendada</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-3">
                              {retirementResult.yearsToRetirement > 20 
                                ? "Com mais de 20 anos para aposentar, você pode adotar uma estratégia agressiva com 70% em ações e 30% em renda fixa."
                                : retirementResult.yearsToRetirement > 10
                                ? "Com 10-20 anos para aposentar, uma estratégia moderada é ideal: 50% ações, 50% renda fixa."
                                : "Com menos de 10 anos para aposentar, priorize a segurança: 30% ações, 70% renda fixa."
                              }
                            </p>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm">
                                <strong>Dica:</strong> Revise seu plano anualmente e ajuste as contribuições conforme sua renda aumenta.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Comparison */}
          <TabsContent value="comparison">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Comparador de Investimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Esta funcionalidade estará disponível em breve. 
                    Use as outras calculadoras para analisar seus investimentos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
