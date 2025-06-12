import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Calculator, DollarSign, Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface Investment {
  id: string;
  name: string;
  type: "renda_fixa" | "renda_variavel" | "cripto";
  rate: number;
  risk: "baixo" | "medio" | "alto";
  minAmount: number;
  liquidity: "diaria" | "30d" | "90d" | "1ano" | "longo";
  taxation: "ir_regressivo" | "ir_fixo" | "isento";
  fees: number;
}

const investments: Investment[] = [
  {
    id: "poupanca",
    name: "Poupança",
    type: "renda_fixa",
    rate: 6.8,
    risk: "baixo",
    minAmount: 0,
    liquidity: "diaria",
    taxation: "isento",
    fees: 0
  },
  {
    id: "cdb",
    name: "CDB 100% CDI",
    type: "renda_fixa",
    rate: 13.75,
    risk: "baixo",
    minAmount: 100,
    liquidity: "diaria",
    taxation: "ir_regressivo",
    fees: 0
  },
  {
    id: "tesouro_selic",
    name: "Tesouro Selic",
    type: "renda_fixa",
    rate: 13.65,
    risk: "baixo",
    minAmount: 30,
    liquidity: "diaria",
    taxation: "ir_regressivo",
    fees: 0.1
  },
  {
    id: "lci",
    name: "LCI",
    type: "renda_fixa",
    rate: 12.5,
    risk: "baixo",
    minAmount: 1000,
    liquidity: "90d",
    taxation: "isento",
    fees: 0
  },
  {
    id: "acoes",
    name: "Ações IBOVESPA",
    type: "renda_variavel",
    rate: 15.5,
    risk: "alto",
    minAmount: 100,
    liquidity: "diaria",
    taxation: "ir_fixo",
    fees: 0
  },
  {
    id: "fiis",
    name: "FIIs",
    type: "renda_variavel",
    rate: 12.8,
    risk: "medio",
    minAmount: 100,
    liquidity: "diaria",
    taxation: "isento",
    fees: 0
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    type: "cripto",
    rate: 25.0,
    risk: "alto",
    minAmount: 50,
    liquidity: "diaria",
    taxation: "ir_fixo",
    fees: 0.5
  }
];

export default function InvestmentComparator() {
  const [selectedInvestments, setSelectedInvestments] = useState<string[]>(["cdb", "acoes", "fiis"]);
  const [amount, setAmount] = useState(10000);
  const [period, setPeriod] = useState(5);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  const calculateReturns = () => {
    const results = selectedInvestments.map(id => {
      const investment = investments.find(inv => inv.id === id)!;
      const monthlyRate = investment.rate / 100 / 12;
      const months = period * 12;
      
      // Cálculo básico de juros compostos
      const finalAmount = amount * Math.pow(1 + monthlyRate, months);
      const profit = finalAmount - amount;
      
      // Aplicar taxas e impostos
      let netProfit = profit;
      
      if (investment.taxation === "ir_regressivo") {
        const irRate = period >= 2 ? 0.15 : period >= 1 ? 0.175 : 0.20;
        netProfit = profit * (1 - irRate);
      } else if (investment.taxation === "ir_fixo") {
        netProfit = profit * 0.85; // 15% IR
      }
      
      netProfit -= (finalAmount * investment.fees / 100); // Taxas
      
      return {
        name: investment.name,
        finalAmount: amount + netProfit,
        profit: netProfit,
        profitPercent: (netProfit / amount) * 100,
        risk: investment.risk,
        type: investment.type
      };
    });
    
    setComparisonData(results.sort((a, b) => b.finalAmount - a.finalAmount));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "baixo": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "medio": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "alto": return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "renda_fixa": return "#22c55e";
      case "renda_variavel": return "#3b82f6";
      case "cripto": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Comparador de Investimentos</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Compare diferentes investimentos lado a lado e veja qual oferece melhor retorno para seu perfil
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Configurações */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="amount">Valor a Investir (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="period">Período (anos)</Label>
                <Input
                  id="period"
                  type="number"
                  value={period}
                  onChange={(e) => setPeriod(Number(e.target.value))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Investimentos para Comparar</Label>
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                  {investments.map((investment) => (
                    <div key={investment.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={investment.id}
                        checked={selectedInvestments.includes(investment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvestments([...selectedInvestments, investment.id]);
                          } else {
                            setSelectedInvestments(selectedInvestments.filter(id => id !== investment.id));
                          }
                        }}
                        className="rounded border-border"
                      />
                      <label htmlFor={investment.id} className="text-sm font-medium flex-1">
                        {investment.name}
                      </label>
                      <Badge className={`text-xs ${getRiskColor(investment.risk)}`}>
                        {investment.risk}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={calculateReturns}
                className="w-full gradient-primary"
                disabled={selectedInvestments.length === 0}
              >
                Comparar Investimentos
              </Button>
            </CardContent>
          </Card>

          {/* Resultados */}
          <div className="lg:col-span-2">
            {comparisonData.length > 0 && (
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="table">Tabela</TabsTrigger>
                  <TabsTrigger value="chart">Gráfico</TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="space-y-4">
                  {comparisonData.map((item, index) => (
                    <Card key={index} className="relative overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: getTypeColor(item.type) }}
                      />
                      <CardContent className="p-6 pl-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <Badge className={`mt-1 ${getRiskColor(item.risk)}`}>
                              Risco {item.risk}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(item.finalAmount)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Lucro: {formatCurrency(item.profit)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Rentabilidade:</span>
                            <span className="ml-2 font-semibold text-green-600">
                              {item.profitPercent.toFixed(1)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Posição:</span>
                            <span className="ml-2 font-semibold">
                              {index + 1}º lugar
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="chart">
                  <Card>
                    <CardContent className="p-6">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              fontSize={12}
                            />
                            <YAxis 
                              tickFormatter={(value) => formatCurrency(value)}
                              fontSize={12}
                            />
                            <Tooltip 
                              formatter={(value: any) => [formatCurrency(value), "Valor Final"]}
                              labelStyle={{ color: '#111827' }}
                              contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                            />
                            <Bar 
                              dataKey="finalAmount" 
                              fill="#3b82f6"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>

        {/* Resumo e Recomendações */}
        {comparisonData.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Melhor Investimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                    {comparisonData[0]?.name}
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    Retorno de {formatCurrency(comparisonData[0]?.profit)} em {period} anos
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Diversificação Recomendada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Renda Fixa (Segurança)</span>
                    <span className="font-semibold">50%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Renda Variável (Crescimento)</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Criptomoedas (Especulação)</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      💡 Diversificar reduz riscos e pode aumentar retornos no longo prazo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}