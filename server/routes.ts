import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";
import { generateSmartChatResponse, generatePersonalizedRecommendations } from "./openai";

const investmentRecommendationSchema = z.object({
  profile: z.enum(["conservative", "moderate", "aggressive"]),
  amount: z.number(),
  timeHorizon: z.number(),
  monthlyContribution: z.number().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Market data endpoint
  app.get("/api/market-data", async (req, res) => {
    try {
      const marketData = await storage.getMarketData();
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // Educational content endpoint
  app.get("/api/educational-content", async (req, res) => {
    try {
      const content = await storage.getEducationalContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch educational content" });
    }
  });

  // Get specific educational content
  app.get("/api/educational-content/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.getEducationalContentById(id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch educational content" });
    }
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await generateSmartChatResponse(message);
      
      const chatMessage = await storage.saveChatMessage({
        userId: userId || null,
        message,
        response,
      });

      res.json({ response, messageId: chatMessage.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Investment recommendation endpoint
  app.post("/api/investment-recommendation", async (req, res) => {
    try {
      const validatedData = investmentRecommendationSchema.parse(req.body);
      const recommendation = generateInvestmentRecommendation(validatedData);
      res.json(recommendation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to generate investment recommendation" });
    }
  });

  // Calculator endpoints
  app.post("/api/calculate/compound-interest", async (req, res) => {
    try {
      const { initialAmount, monthlyContribution, interestRate, timePeriod } = req.body;
      
      const monthlyRate = interestRate / 100 / 12;
      const months = timePeriod * 12;
      
      let futureValue = initialAmount;
      for (let month = 0; month < months; month++) {
        futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
      }
      
      const totalInvested = initialAmount + (monthlyContribution * months);
      const totalInterest = futureValue - totalInvested;
      
      res.json({
        totalInvested,
        totalInterest,
        finalAmount: futureValue,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate compound interest" });
    }
  });

  app.post("/api/calculate/retirement", async (req, res) => {
    try {
      const { currentAge, retirementAge, desiredIncome, currentSavings } = req.body;
      
      const yearsToRetirement = retirementAge - currentAge;
      const totalNeeded = desiredIncome * 12 / 0.04; // 4% withdrawal rule
      
      const futureValueOfCurrentSavings = currentSavings * Math.pow(1.10, yearsToRetirement);
      const stillNeeded = Math.max(0, totalNeeded - futureValueOfCurrentSavings);
      
      const monthlyRate = 0.10 / 12;
      const monthsToRetirement = yearsToRetirement * 12;
      const monthlyNeeded = stillNeeded * monthlyRate / (Math.pow(1 + monthlyRate, monthsToRetirement) - 1);
      
      res.json({
        yearsToRetirement,
        totalNeeded,
        monthlyNeeded,
        futureValueOfCurrentSavings,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate retirement plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Filtrar conteúdo inadequado
  const inappropriateWords = ['idiota', 'burro', 'estúpido', 'merda', 'porcaria', 'lixo'];
  if (inappropriateWords.some(word => lowerMessage.includes(word))) {
    return 'Compreendo que você possa estar frustrado, mas estou aqui para ajudá-lo com educação financeira de forma respeitosa. Como posso auxiliá-lo com seus investimentos hoje?';
  }
  
  if (lowerMessage.includes('bitcoin') || lowerMessage.includes('cripto')) {
    return 'Bitcoin é uma moeda digital descentralizada criada em 2009. **Como funciona:** Utiliza tecnologia blockchain (cadeia de blocos) que registra todas as transações de forma transparente e imutável. **Exemplo prático:** Imagine um livro contábil digital que todos podem ver, mas ninguém pode alterar. **Riscos:** Alta volatilidade (pode variar ±60% ao ano). **Dica para iniciantes:** Comece com apenas 2-5% da carteira total e nunca invista mais do que pode perder.';
  }
  
  if (lowerMessage.includes('renda fixa') || lowerMessage.includes('renda variável')) {
    return '**Renda Fixa:** Rentabilidade previsível no momento da aplicação. **Exemplos:** CDB (13% a.a.), Tesouro Direto (11% a.a.), LCI/LCA (9-11% a.a.). **Renda Variável:** Rentabilidade varia conforme o mercado. **Exemplos:** Ações (IBOVESPA +21% em 2023), FIIs (10-15% a.a.). **Analogia:** Renda fixa é como um empréstimo que você faz para o banco/governo, renda variável é como se tornar sócio de empresas. **Proporção sugerida:** 60% renda fixa + 40% variável para perfil equilibrado.';
  }
  
  if (lowerMessage.includes('diversificar') || lowerMessage.includes('carteira')) {
    return '**Diversificação:** "Não colocar todos os ovos na mesma cesta". **Exemplo prático:** Se você tem R$ 10.000, distribua assim: R$ 3.500 em renda fixa (CDB/Tesouro), R$ 4.000 em ações brasileiras, R$ 1.500 em FIIs, R$ 1.000 em investimentos internacionais. **Benefício:** Se um setor cair, outros podem compensar. **Dica importante:** Rebalanceie a cada 3 meses, vendendo o que subiu muito e comprando o que caiu para manter as proporções.';
  }
  
  if (lowerMessage.includes('perfil') || lowerMessage.includes('conservador') || lowerMessage.includes('agressivo') || lowerMessage.includes('moderado')) {
    return '**Conservador (Baixo Risco):** 80% renda fixa, 20% ações. Retorno esperado: 8-12% a.a. **Exemplo:** Aposentado que precisa de renda estável. **Moderado (Risco Equilibrado):** 50% renda fixa, 50% renda variável. Retorno: 12-18% a.a. **Exemplo:** Pessoa de 30-50 anos poupando para casa própria. **Agressivo (Alto Risco):** 20% renda fixa, 80% renda variável. Retorno: 18-30% a.a. **Exemplo:** Jovem de 20-35 anos com longo prazo. **Como escolher:** Considere sua idade, objetivos e quanto consegue dormir tranquilo se perder 20% em um mês.';
  }
  
  if (lowerMessage.includes('cdb')) {
    return '**CDB (Certificado de Depósito Bancário):** Você empresta dinheiro para o banco e ele paga juros. **Rentabilidade atual:** 13% a.a. (100% do CDI). **Segurança:** Garantido pelo FGC até R$ 250 mil por banco. **Exemplo prático:** R$ 10.000 em CDB por 1 ano = R$ 11.300 (R$ 1.300 de lucro). **Tributação:** IR regressivo (22,5% até 180 dias, 15% após 2 anos). **Dica:** Prefira bancos médios que pagam mais que grandes bancos.';
  }
  
  if (lowerMessage.includes('tesouro direto')) {
    return '**Tesouro Direto:** Você empresta dinheiro para o governo brasileiro. **Tipos:** Tesouro Selic (pós-fixado, 13,25% a.a.), Tesouro IPCA+ (6,2% + inflação), Tesouro Prefixado (10,5% a.a.). **Vantagens:** Mais seguro do Brasil, aplicação mínima R$ 30. **Exemplo:** R$ 1.000 no Tesouro IPCA+ 2029 rende 6,2% + inflação ao ano. **Como comprar:** Pelo site oficial ou corretoras. **Taxa:** 0,1% a.a. de custódia. **Ideal para:** Reserva de emergência e objetivos de longo prazo.';
  }
  
  if (lowerMessage.includes('ações') || lowerMessage.includes('bolsa')) {
    return '**Ações:** Você compra uma pequena parte de uma empresa. **Como ganhar:** Dividendos (empresa distribui lucros) + Valorização (preço da ação sobe). **Exemplo:** VALE3 pagou R$ 3,50 de dividendos por ação em 2023. **Horário:** Bolsa funciona 10h-17h em dias úteis. **Como começar:** Abra conta em corretora, estude a empresa (balanços, DRE), comece com R$ 500-1000. **Dica de ouro:** Invista apenas em empresas que você entende o negócio. Se não sabe como a empresa ganha dinheiro, não invista.';
  }
  
  if (lowerMessage.includes('fiis') || lowerMessage.includes('fundos imobiliários')) {
    return '**FIIs (Fundos de Investimento Imobiliário):** Você investe em imóveis sem precisar comprá-los. **Como funciona:** O fundo compra shoppings, galpões, edifícios e você recebe parte do aluguel. **Rentabilidade:** 8-12% a.a. em dividendos + valorização das cotas. **Exemplo:** HGLG11 (hospital) paga cerca de R$ 1,10 por cota/mês. **Vantagem:** Dividendos isentos de IR para pessoa física. **Como escolher:** Veja o tipo de imóvel, localização, vacancy (taxa de desocupação) e histórico de pagamentos.';
  }
  
  if (lowerMessage.includes('risco') || lowerMessage.includes('riscos')) {
    return '**Tipos de Risco:** 1) **Mercado** - preços sobem/descem (ex: ações caem 30% em crise). 2) **Crédito** - empresa/banco quebra (ex: Banco Lehman Brothers). 3) **Liquidez** - dificuldade para vender (ex: imóvel demora meses). 4) **Inflação** - dinheiro perde poder de compra (ex: poupança rende 6%, inflação 5% = ganho real 1%). **Como reduzir:** Diversifique entre classes, prazos e países. **Regra básica:** Maior rentabilidade = maior risco. Não existe almoço grátis nos investimentos.';
  }
  
  if (lowerMessage.includes('calcular') || lowerMessage.includes('retorno') || lowerMessage.includes('rendimento') || lowerMessage.includes('juros compostos')) {
    return '**Juros Compostos:** "Juros sobre juros" - Einstein chamou de 8ª maravilha do mundo. **Fórmula:** M = C × (1 + i)^t. **Exemplo prático:** R$ 500/mês por 20 anos a 12% a.a. = R$ 493.233 (investiu R$ 120.000, ganhou R$ 373.233). **Dica visual:** Use nossa calculadora para simular. **Segredo:** Comece cedo, seja consistente. Diferença entre começar aos 25 ou 35 anos pode ser R$ 500.000 na aposentadoria. **Regra 72:** Para dobrar o dinheiro, divida 72 pela taxa (ex: 72÷12% = 6 anos).';
  }
  
  if (lowerMessage.includes('reserva de emergência')) {
    return '**Reserva de Emergência:** 6-12 meses dos seus gastos mensais em investimentos líquidos. **Exemplo:** Gasta R$ 3.000/mês? Reserve R$ 18.000-36.000. **Onde investir:** CDB com liquidez diária, Tesouro Selic, conta remunerada. **Não use:** Poupança (rende pouco), ações (muito voláteis). **Quando usar:** Desemprego, emergência médica, reforma urgente. **Dica:** Monte primeiro a reserva, depois invista em renda variável. É como ter um para-quedas antes de pular de paraquedas.';
  }
  
  if (lowerMessage.includes('imposto') || lowerMessage.includes('ir') || lowerMessage.includes('tributação')) {
    return '**Tributação nos Investimentos:** **Renda Fixa:** IR regressivo - 22,5% (até 180 dias) → 15% (acima de 2 anos). **Ações:** 15% sobre ganho em vendas acima de R$ 20.000/mês. **FIIs:** Isentos de IR nos dividendos. **Exemplo:** CDB R$ 1.000 de lucro em 1 ano = IR R$ 200 (20%). **Dica:** Mantenha planilha de controle e considere o IR líquido nas comparações. **Come-cotas:** Fundos pagam IR antecipadamente em maio e novembro.';
  }
  
  if (lowerMessage.includes('inflação')) {
    return '**Inflação:** Aumento geral dos preços, que reduz o poder de compra. **IPCA 2023:** 4,62% a.a. **Exemplo prático:** Se você guardou R$ 1.000 no colchão, hoje vale R$ 954 em poder de compra. **Como se proteger:** Invista em ativos que rendem acima da inflação. **Tesouro IPCA+:** Garante ganho real. **Ações:** Empresas repassam inflação nos preços. **Poupança:** Rende apenas 70% da Selic quando ela está abaixo de 8,5% - péssimo contra inflação.';
  }
  
  return 'Fico feliz em ajudar! Sou especializado em educação financeira e posso explicar qualquer conceito de forma clara e prática. Tenho conhecimento sobre investimentos, planejamento financeiro, tributação e estratégias para diferentes perfis. O que gostaria de aprender hoje? Use nossas calculadoras para simular cenários específicos!';
}

function generateInvestmentRecommendation(data: z.infer<typeof investmentRecommendationSchema>) {
  const { profile, amount, timeHorizon, monthlyContribution = 0 } = data;
  
  let recommendation = '';
  let suggestedAllocation: Record<string, number> = {};
  let expectedReturn = 0;
  
  switch (profile) {
    case 'conservative':
      expectedReturn = 0.10; // 10% a.a.
      suggestedAllocation = {
        'Poupança/CDB': 40,
        'Tesouro Direto': 30,
        'LCI/LCA': 20,
        'Fundos DI': 10,
      };
      recommendation = 'Para seu perfil conservador, recomendamos focar em renda fixa com liquidez e segurança. O CDB e Tesouro Direto são ideais para preservar o capital com rentabilidade superior à poupança.';
      break;
      
    case 'moderate':
      expectedReturn = 0.14; // 14% a.a.
      suggestedAllocation = {
        'Renda Fixa': 50,
        'Ações Blue Chips': 25,
        'FIIs': 15,
        'Fundos Multimercado': 10,
      };
      recommendation = 'Seu perfil moderado permite uma boa diversificação entre renda fixa e variável. Mantenha uma base sólida em renda fixa e diversifique em ações de empresas consolidadas.';
      break;
      
    case 'aggressive':
      expectedReturn = 0.18; // 18% a.a.
      suggestedAllocation = {
        'Ações Growth': 40,
        'Ações Value': 20,
        'FIIs': 15,
        'ETFs Internacionais': 15,
        'Criptomoedas': 5,
        'Renda Fixa': 5,
      };
      recommendation = 'Como investidor agressivo, você pode explorar ativos de maior risco e retorno. Foque em ações de crescimento e diversifique internacionalmente, mantendo apenas uma pequena reserva em renda fixa.';
      break;
  }
  
  // Calculate projected values
  const futureValue = (amount + monthlyContribution * 12 * timeHorizon) * Math.pow(1 + expectedReturn, timeHorizon);
  const totalInvested = amount + monthlyContribution * 12 * timeHorizon;
  const totalGains = futureValue - totalInvested;
  
  return {
    recommendation,
    suggestedAllocation,
    expectedReturn: expectedReturn * 100,
    projectedValue: futureValue,
    totalInvested,
    totalGains,
    riskLevel: profile === 'conservative' ? 'Baixo' : profile === 'moderate' ? 'Médio' : 'Alto',
  };
}
