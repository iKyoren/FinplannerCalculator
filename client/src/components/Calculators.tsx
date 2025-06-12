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
import { useProfile } from "@/contexts/ProfileContext";
import type { CalculatorInputs, RetirementInputs } from "@/types";

export default function Calculators() {
  const { selectedProfile } = useProfile();
  
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
  const [comparisonInputs, setComparisonInputs] = useState({
    amount: 10000,
    period: 5,
    selectedInvestments: ['cdb', 'tesouro', 'acoes']
  });
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);

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
    // Only generate recommendation if a profile has been selected
    if (!selectedProfile) {
      return;
    }
    
    try {
      await recommendationMutation.mutateAsync({
        profile: selectedProfile,
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

  const handleComparisonCalculate = () => {
    const results = comparisonInputs.selectedInvestments.map(investmentKey => {
      const investment = investmentTypes[investmentKey as keyof typeof investmentTypes];
      const monthlyRate = investment.rate / 100 / 12;
      const months = comparisonInputs.period * 12;
      
      // Fórmula de juros compostos
      const finalAmount = comparisonInputs.amount * Math.pow(1 + (investment.rate / 100), comparisonInputs.period);
      const totalReturn = finalAmount - comparisonInputs.amount;
      const percentageReturn = (totalReturn / comparisonInputs.amount) * 100;
      
      return {
        name: investment.name,
        key: investmentKey,
        rate: investment.rate,
        initialAmount: comparisonInputs.amount,
        finalAmount: Math.round(finalAmount),
        totalReturn: Math.round(totalReturn),
        percentageReturn: Math.round(percentageReturn * 100) / 100,
        risk: getRiskLevel(investmentKey),
        liquidity: getLiquidityLevel(investmentKey)
      };
    });
    
    setComparisonResults(results.sort((a, b) => b.finalAmount - a.finalAmount));
  };

  const getRiskLevel = (investmentType: string) => {
    const riskLevels: { [key: string]: string } = {
      cdb: "Baixo",
      lci: "Baixo", 
      tesouro: "Baixo",
      fiis: "Médio",
      acoes: "Alto",
      crypto: "Muito Alto"
    };
    return riskLevels[investmentType] || "Médio";
  };

  const getLiquidityLevel = (investmentType: string) => {
    const liquidityLevels: { [key: string]: string } = {
      cdb: "Alta",
      lci: "Baixa",
      tesouro: "Alta", 
      fiis: "Média",
      acoes: "Alta",
      crypto: "Alta"
    };
    return liquidityLevels[investmentType] || "Média";
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

                    {!selectedProfile && compoundResult && (
                      <Card className="bg-yellow-500/10 border-yellow-500/20">
                        <CardHeader>
                          <CardTitle className="text-lg text-yellow-600 dark:text-yellow-400">
                            Selecione seu Perfil de Investidor
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            Para receber recomendações personalizadas de investimento, primeiro selecione seu perfil de investidor na seção "Perfis de Investimento" acima.
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {recommendation && selectedProfile && (
                      <div className="space-y-4">
                        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
                          <CardHeader>
                            <CardTitle className="text-lg text-green-600 dark:text-green-400">
                              Recomendações Personalizadas IA
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">{recommendation.summary}</p>
                            {recommendation.warnings && recommendation.warnings.length > 0 && (
                              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                                <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">Alertas Importantes:</h4>
                                <ul className="space-y-1">
                                  {recommendation.warnings.map((warning: string, index: number) => (
                                    <li key={index} className="text-sm text-muted-foreground">• {warning}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {/* Investimentos Nacionais */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              🇧🇷 Investimentos Nacionais
                              <span className="text-sm text-muted-foreground">({recommendation.nationalInvestments?.length || 0} opções)</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {recommendation.nationalInvestments?.map((investment: any, index: number) => (
                              <div key={index} className="border border-border/50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-foreground">{investment.name}</h4>
                                    <div className="flex gap-2 mt-1">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        investment.risk === "Baixo" ? "bg-green-500/20 text-green-600" :
                                        investment.risk === "Médio" ? "bg-yellow-500/20 text-yellow-600" :
                                        "bg-red-500/20 text-red-600"
                                      }`}>
                                        Risco {investment.risk}
                                      </span>
                                      <span className="px-2 py-1 bg-blue-500/20 text-blue-600 rounded-full text-xs">
                                        {investment.allocation}% da carteira
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-green-600">{investment.expectedReturn}</div>
                                    <div className="text-xs text-muted-foreground">Retorno esperado</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h5 className="font-medium mb-1">Por que essa escolha:</h5>
                                    <p className="text-muted-foreground">{investment.reason}</p>
                                  </div>
                                  <div>
                                    <h5 className="font-medium mb-1">Como funciona:</h5>
                                    <p className="text-muted-foreground">{investment.theory}</p>
                                  </div>
                                </div>
                                
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <h5 className="font-medium mb-1">Como investir na prática:</h5>
                                  <p className="text-muted-foreground text-sm">{investment.practice}</p>
                                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>Valor mínimo: {formatCurrency(investment.minAmount)}</span>
                                    <span>Prazo: {investment.timeHorizon}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* Investimentos Internacionais */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              🌍 Investimentos Internacionais
                              <span className="text-sm text-muted-foreground">({recommendation.internationalInvestments?.length || 0} opções)</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {recommendation.internationalInvestments?.map((investment: any, index: number) => (
                              <div key={index} className="border border-border/50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-foreground">{investment.name}</h4>
                                    <div className="flex gap-2 mt-1">
                                      <span className={`px-2 py-1 rounded-full text-xs ${
                                        investment.risk === "Baixo" ? "bg-green-500/20 text-green-600" :
                                        investment.risk === "Médio" ? "bg-yellow-500/20 text-yellow-600" :
                                        "bg-red-500/20 text-red-600"
                                      }`}>
                                        Risco {investment.risk}
                                      </span>
                                      <span className="px-2 py-1 bg-purple-500/20 text-purple-600 rounded-full text-xs">
                                        {investment.allocation}% da carteira
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-green-600">{investment.expectedReturn}</div>
                                    <div className="text-xs text-muted-foreground">Retorno esperado</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h5 className="font-medium mb-1">Por que essa escolha:</h5>
                                    <p className="text-muted-foreground">{investment.reason}</p>
                                  </div>
                                  <div>
                                    <h5 className="font-medium mb-1">Como funciona:</h5>
                                    <p className="text-muted-foreground">{investment.theory}</p>
                                  </div>
                                </div>
                                
                                <div className="bg-muted/50 rounded-lg p-3">
                                  <h5 className="font-medium mb-1">Como investir na prática:</h5>
                                  <p className="text-muted-foreground text-sm">{investment.practice}</p>
                                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                    <span>Valor mínimo: {formatCurrency(investment.minAmount)}</span>
                                    <span>Prazo: {investment.timeHorizon}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
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

                        {selectedProfile ? (
                          <Card className="bg-card/50">
                            <CardHeader>
                              <CardTitle className="text-lg">Estratégia Recomendada</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-3">
                                {selectedProfile === "conservative" 
                                  ? "Com seu perfil conservador, priorize a segurança: 20% ações, 80% renda fixa. Foque em CDBs, Tesouro Direto e LCI/LCA."
                                  : selectedProfile === "moderate"
                                  ? "Com seu perfil moderado, equilibre risco e retorno: 50% ações, 50% renda fixa. Diversifique entre fundos DI, multimercado e ações blue chips."
                                  : "Com seu perfil agressivo, maximize o potencial de retorno: 70% ações, 30% renda fixa. Inclua ações growth, FIIs e ETFs internacionais."
                                }
                              </p>
                              <div className="bg-muted/50 p-3 rounded-lg">
                                <p className="text-sm">
                                  <strong>Dica:</strong> Revise seu plano anualmente e ajuste as contribuições conforme sua renda aumenta.
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="bg-yellow-500/10 border-yellow-500/20">
                            <CardHeader>
                              <CardTitle className="text-lg text-yellow-600 dark:text-yellow-400">
                                Selecione seu Perfil de Investidor
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground">
                                Para receber estratégias personalizadas de aposentadoria, primeiro selecione seu perfil de investidor na seção "Perfis de Investimento" acima.
                              </p>
                            </CardContent>
                          </Card>
                        )}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input Section */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="comparisonAmount">Valor a Investir (R$)</Label>
                      <Input
                        id="comparisonAmount"
                        type="number"
                        value={comparisonInputs.amount}
                        onChange={(e) => setComparisonInputs({...comparisonInputs, amount: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="comparisonPeriod">Período (anos)</Label>
                      <Input
                        id="comparisonPeriod"
                        type="number"
                        value={comparisonInputs.period}
                        onChange={(e) => setComparisonInputs({...comparisonInputs, period: Number(e.target.value)})}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Investimentos para Comparar</Label>
                      <div className="mt-2 space-y-2">
                        {Object.entries(investmentTypes).map(([key, type]) => (
                          <label key={key} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={comparisonInputs.selectedInvestments.includes(key)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setComparisonInputs({
                                    ...comparisonInputs,
                                    selectedInvestments: [...comparisonInputs.selectedInvestments, key]
                                  });
                                } else {
                                  setComparisonInputs({
                                    ...comparisonInputs,
                                    selectedInvestments: comparisonInputs.selectedInvestments.filter(item => item !== key)
                                  });
                                }
                              }}
                              className="rounded border-border"
                            />
                            <span className="text-sm">
                              {type.name} ({type.rate}% a.a.)
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleComparisonCalculate}
                      className="w-full gradient-primary hover:opacity-90 font-semibold"
                      disabled={comparisonInputs.selectedInvestments.length < 2}
                    >
                      {comparisonInputs.selectedInvestments.length < 2 
                        ? 'Selecione pelo menos 2 investimentos' 
                        : 'Comparar Investimentos'
                      }
                    </Button>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-6">
                    {comparisonResults.length > 0 && (
                      <>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Comparação de Resultados</h3>
                          <div className="space-y-3">
                            {comparisonResults.map((result, index) => (
                              <Card key={result.key} className={`${index === 0 ? 'border-green-500/50 bg-green-500/5' : 'bg-card/50'}`}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold">{result.name}</h4>
                                      {index === 0 && (
                                        <span className="bg-green-500/20 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                                          Melhor Retorno
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold text-lg">{formatCurrency(result.finalAmount)}</div>
                                      <div className="text-xs text-muted-foreground">Valor Final</div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <div className="text-muted-foreground">Ganho Total:</div>
                                      <div className="font-semibold text-green-600">
                                        {formatCurrency(result.totalReturn)} ({result.percentageReturn}%)
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">Taxa Anual:</div>
                                      <div className="font-semibold">{result.rate}%</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2 mt-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      result.risk === "Baixo" ? "bg-green-500/20 text-green-600" :
                                      result.risk === "Médio" ? "bg-yellow-500/20 text-yellow-600" :
                                      result.risk === "Alto" ? "bg-red-500/20 text-red-600" :
                                      "bg-red-600/20 text-red-700"
                                    }`}>
                                      Risco {result.risk}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-600 rounded-full text-xs">
                                      Liquidez {result.liquidity}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Chart Visualization */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Comparação Visual</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={comparisonResults}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="name" 
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={12}
                                />
                                <YAxis 
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={12}
                                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip 
                                  formatter={(value: number) => [formatCurrency(value), "Valor Final"]}
                                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px'
                                  }}
                                />
                                <Bar 
                                  dataKey="finalAmount" 
                                  fill="hsl(var(--primary))"
                                  radius={[4, 4, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        <Card className="bg-blue-500/10 border-blue-500/20">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-600 dark:text-blue-400">
                              Análise da Comparação
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>Melhor retorno:</strong> {comparisonResults[0]?.name} com ganho de {formatCurrency(comparisonResults[0]?.totalReturn)}
                              </p>
                              <p>
                                <strong>Diferença do melhor para o pior:</strong> {
                                  comparisonResults.length > 1 ? 
                                  formatCurrency(comparisonResults[0]?.totalReturn - comparisonResults[comparisonResults.length - 1]?.totalReturn) : 
                                  'N/A'
                                }
                              </p>
                              <p className="text-muted-foreground mt-3">
                                <em>Lembre-se: retornos históricos não garantem resultados futuros. 
                                Considere sempre seu perfil de risco e objetivos financeiros.</em>
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
        </Tabs>
      </div>
    </section>
  );
}
