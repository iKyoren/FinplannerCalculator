import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMarketData } from "@/hooks/useMarketData";
import { TrendingUp, TrendingDown, Building, Bitcoin, BarChart3, Minus, User } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function MarketData() {
  const { data: marketData, isLoading } = useMarketData();
  const [selectedProfile, setSelectedProfile] = useState<"conservative" | "moderate" | "aggressive">("moderate");

  const performanceData = [
    { month: 'Jan', CDI: 13.2, IBOVESPA: 15.2, Bitcoin: 25.5 },
    { month: 'Fev', CDI: 13.4, IBOVESPA: 12.8, Bitcoin: -15.2 },
    { month: 'Mar', CDI: 13.5, IBOVESPA: 18.5, Bitcoin: 45.8 },
    { month: 'Abr', CDI: 13.6, IBOVESPA: 14.2, Bitcoin: -8.5 },
    { month: 'Mai', CDI: 13.7, IBOVESPA: 16.8, Bitcoin: 32.1 },
    { month: 'Jun', CDI: 13.6, IBOVESPA: 13.2, Bitcoin: -22.3 },
    { month: 'Jul', CDI: 13.5, IBOVESPA: 19.5, Bitcoin: 38.7 },
    { month: 'Ago', CDI: 13.6, IBOVESPA: 11.8, Bitcoin: -5.8 },
    { month: 'Set', CDI: 13.65, IBOVESPA: 17.2, Bitcoin: 28.4 },
    { month: 'Out', CDI: 13.7, IBOVESPA: 20.1, Bitcoin: -18.2 },
    { month: 'Nov', CDI: 13.65, IBOVESPA: 14.5, Bitcoin: 42.1 },
    { month: 'Dez', CDI: 13.65, IBOVESPA: 16.8, Bitcoin: -12.5 },
  ];

  const allocationData = {
    conservative: [
      { name: 'Renda Fixa', value: 70, color: '#22c55e' },
      { name: 'Ações', value: 20, color: '#3b82f6' },
      { name: 'FIIs', value: 10, color: '#f59e0b' }
    ],
    moderate: [
      { name: 'Renda Fixa', value: 40, color: '#22c55e' },
      { name: 'Ações', value: 35, color: '#3b82f6' },
      { name: 'FIIs', value: 20, color: '#f59e0b' },
      { name: 'Crypto', value: 5, color: '#a855f7' }
    ],
    aggressive: [
      { name: 'Ações', value: 50, color: '#3b82f6' },
      { name: 'Renda Fixa', value: 20, color: '#22c55e' },
      { name: 'FIIs', value: 15, color: '#f59e0b' },
      { name: 'Crypto', value: 10, color: '#a855f7' },
      { name: 'Internacional', value: 5, color: '#ef4444' }
    ]
  };

  const getIcon = (symbol: string) => {
    switch (symbol) {
      case 'CDI':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'SELIC':
        return <Building className="h-5 w-5 text-yellow-400" />;
      case 'BTC':
        return <Bitcoin className="h-5 w-5 text-yellow-400" />;
      case 'IBOV':
        return <BarChart3 className="h-5 w-5 text-blue-400" />;
      default:
        return <TrendingUp className="h-5 w-5 text-blue-400" />;
    }
  };

  const getTrendIcon = (changePercent: number) => {
    if (changePercent > 0) {
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    } else if (changePercent < 0) {
      return <TrendingDown className="h-4 w-4 text-red-400" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = (changePercent: number) => {
    if (changePercent > 0) {
      return "text-green-400";
    } else if (changePercent < 0) {
      return "text-red-400";
    } else {
      return "text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <section id="mercado" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Dados de Mercado em Tempo Real
            </h2>
            <p className="text-muted-foreground text-lg">Carregando dados do mercado...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-5 w-5 bg-muted rounded"></div>
                    </div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="mercado" className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Monitoramento de Mercado
          </h1>
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Dados de Mercado
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Acompanhe indicadores financeiros em tempo real e analise a performance dos principais investimentos do mercado brasileiro
          </p>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {marketData?.map((item: any) => (
            <Card key={item.symbol} className="card-hover border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-muted-foreground font-medium">{item.name}</h3>
                  {getIcon(item.symbol)}
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">
                  {item.symbol === 'BTC' ? `R$ ${parseFloat(item.price).toLocaleString('pt-BR')}` :
                   item.symbol === 'IBOV' ? parseFloat(item.price).toLocaleString('pt-BR') :
                   `${parseFloat(item.price).toFixed(2)}%`}
                </div>
                <div className={`text-sm flex items-center gap-1 ${getTrendColor(parseFloat(item.changePercent))}`}>
                  {getTrendIcon(parseFloat(item.changePercent))}
                  {parseFloat(item.changePercent) === 0 ? 'Sem alteração' : 
                   `${parseFloat(item.changePercent) > 0 ? '+' : ''}${parseFloat(item.changePercent).toFixed(2)}% hoje`}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investment Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Performance de Investimentos (12 meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `${value}%`}
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        color: '#111827',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [
                        `${Number(value).toFixed(1)}%`,
                        name
                      ]}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Legend 
                      wrapperStyle={{
                        paddingTop: '20px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="CDI" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      dot={{ fill: '#22c55e', strokeWidth: 2 }}
                      name="CDI"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="IBOVESPA" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      name="IBOVESPA"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Bitcoin" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', strokeWidth: 2 }}
                      name="Bitcoin"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Investment Rates Comparison */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Comparativo de Taxas Atuais</CardTitle>
              <p className="text-sm text-muted-foreground">Rendimentos anuais aproximados</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">Poupança</span>
                      <span className="text-sm font-bold text-green-800 dark:text-green-300">6,8%</span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">Isento IR, liquidez diária</p>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-300">CDI</span>
                      <span className="text-sm font-bold text-blue-800 dark:text-blue-300">11,2%</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">100% CDI, IR regressivo</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Tesouro Selic</span>
                      <span className="text-sm font-bold text-purple-800 dark:text-purple-300">11,5%</span>
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Governo, liquidez diária</p>
                  </div>

                  <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-300">IBOVESPA</span>
                      <span className="text-sm font-bold text-orange-800 dark:text-orange-300">+8,2%</span>
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">12 meses, alta volatilidade</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    * Dados aproximados baseados no cenário atual. Rentabilidade passada não garante resultados futuros.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
