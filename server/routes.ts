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

      let response;
      try {
        response = await generateSmartChatResponse(message);
      } catch (error: any) {
        // If OpenAI fails, use educational fallback
        console.log("OpenAI error caught, using fallback:", error.message);
        response = generateEducationalFallback(message);
      }
      
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

  // Investment recommendation endpoint with AI
  app.post("/api/investment-recommendation", async (req, res) => {
    try {
      const validatedData = investmentRecommendationSchema.parse(req.body);
      const { profile, amount, timeHorizon, monthlyContribution = 0 } = validatedData;
      
      // Simular dados financeiros básicos baseados no valor de investimento
      const monthlyIncome = amount < 5000 ? 3000 : amount < 20000 ? 8000 : 15000;
      const monthlyExpenses = monthlyIncome * 0.7; // 70% dos gastos
      const leisureExpenses = monthlyIncome * 0.1; // 10% lazer
      const age = timeHorizon > 20 ? 25 : timeHorizon > 10 ? 35 : 45;
      
      const userProfile = {
        monthlyIncome,
        monthlyExpenses,
        leisureExpenses,
        investmentProfile: profile,
        age,
        availableToInvest: monthlyContribution || (monthlyIncome - monthlyExpenses - leisureExpenses)
      };

      const recommendations = await generatePersonalizedRecommendations(userProfile);
      res.json(recommendations);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      console.error("Error generating AI recommendations:", error);
      res.status(500).json({ error: "Failed to generate investment recommendation" });
    }
  });

  // Personalized AI recommendations endpoint
  app.post("/api/personalized-recommendations", async (req, res) => {
    try {
      const { monthlyIncome, monthlyExpenses, leisureExpenses, investmentProfile, age } = req.body;
      
      if (!monthlyIncome || !monthlyExpenses || !investmentProfile || !age) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const availableToInvest = monthlyIncome - monthlyExpenses - leisureExpenses;
      
      if (availableToInvest <= 0) {
        return res.status(400).json({ error: "No money available for investment" });
      }

      const userProfile = {
        monthlyIncome,
        monthlyExpenses,
        leisureExpenses,
        investmentProfile,
        age,
        availableToInvest
      };

      try {
        const recommendations = await generatePersonalizedRecommendations(userProfile);
        res.json(recommendations);
      } catch (error) {
        // Fallback para recomendações estruturadas quando OpenAI não está disponível
        console.log("OpenAI unavailable, using structured recommendations");
        const fallbackRecommendations = generateStructuredRecommendations(userProfile);
        res.json(fallbackRecommendations);
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate personalized recommendations" });
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

function generateEducationalFallback(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Handle inappropriate content with gentleness
  const inappropriateWords = ['idiota', 'burro', 'estúpido', 'merda', 'porcaria', 'lixo', 'desgraça', 'imbecil'];
  if (inappropriateWords.some(word => lowerMessage.includes(word))) {
    return 'Olá! Entendo que às vezes ficamos frustrados, mas estou aqui para te ajudar de forma tranquila. Que tal conversarmos sobre como fazer seu dinheiro render mais? Em que posso te ajudar hoje?';
  }
  
  if (lowerMessage.includes('1000') || lowerMessage.includes('mil')) {
    return 'Com R$ 1.000 você já pode começar a investir! É como plantar uma sementinha que vai crescer com o tempo. Uma ideia simples: coloque R$ 600 na poupança do governo (Tesouro Selic) que rende mais que a poupança normal, e R$ 400 em CDB de um banco digital. Em 1 ano, você teria cerca de R$ 1.130. Quer que eu explique como fazer isso passo a passo?';
  }
  
  if (lowerMessage.includes('bitcoin') || lowerMessage.includes('cripto')) {
    return 'Bitcoin é um tipo de dinheiro digital que funciona só pela internet. Ele não depende de bancos ou governo, e qualquer pessoa no mundo pode usar. O valor dele pode subir ou cair bastante, então é bom investir só uma parte pequena do seu dinheiro. Quer saber como começar com pouco?';
  }
  
  if (lowerMessage.includes('começar') || lowerMessage.includes('iniciante')) {
    return 'Que legal que você quer começar! Investir é como cuidar de uma plantinha - precisa de paciência e cuidado. Primeiro passo: guarde um dinheirinho para emergências (uns 3 meses de gastos). Segundo: comece investindo pequenos valores todo mês, tipo R$ 50 ou R$ 100. É melhor começar devagar que não começar nunca! Quer saber por onde começar?';
  }
  
  if (lowerMessage.includes('renda fixa') || lowerMessage.includes('cdb')) {
    return 'Renda fixa é como emprestar dinheiro para alguém confiável e receber de volta com um juro. O CDB é quando você empresta para o banco - eles pagam cerca de 13% por ano hoje. É bem seguro, seu dinheiro está protegido até R$ 250 mil. Exemplo: se você tem R$ 1.000, em 1 ano vira uns R$ 1.130. Quer saber como abrir uma conta para investir?';
  }
  
  if (lowerMessage.includes('ações') || lowerMessage.includes('bolsa')) {
    return 'Ações são como comprar um pedacinho de uma empresa. Se a empresa vai bem, você ganha dinheiro. Se vai mal, pode perder. É tipo ser sócio de uma padaria - se ela vende muito pão, você lucra! Algumas empresas ainda pagam uma "mesada" chamada dividendo. Comece estudando empresas que você conhece, como bancos ou supermercados. Quer que eu explique como funciona na prática?';
  }
  
  if (lowerMessage.includes('fiis') || lowerMessage.includes('fundos imobiliários')) {
    return 'FII é como comprar um pedacinho de vários imóveis juntos - shoppings, prédios, galpões. Você recebe uma parte do aluguel todo mês, direto na sua conta! É como ter um imóvel para alugar, mas sem dor de cabeça de inquilino. O legal é que você pode começar com R$ 100. Quer saber como escolher um bom FII?';
  }
  
  // Enhanced default response
  return 'Olá! Sou o DinDin, seu amigo para assuntos de dinheiro! Estou aqui para te explicar investimentos de um jeito simples, como se estivesse conversando com um amigo. Posso te ajudar com poupança, investimentos, ou qualquer dúvida sobre como fazer seu dinheiro render mais. O que você gostaria de saber?';
}

function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Filtrar conteúdo inadequado
  const inappropriateWords = ['idiota', 'burro', 'estúpido', 'merda', 'porcaria', 'lixo'];
  if (inappropriateWords.some(word => lowerMessage.includes(word))) {
    return 'Compreendo que você possa estar frustrado, mas estou aqui para ajudá-lo com educação financeira de forma respeitosa. Como posso auxiliá-lo com seus investimentos hoje?';
  }
  
  if (lowerMessage.includes('bitcoin') || lowerMessage.includes('cripto')) {
    return 'Bitcoin é uma moeda digital descentralizada criada em 2009. **Como funciona:** Utiliza tecnologia blockchain (cadeia de blocos) que registra todas as transações de forma transparente e imutável. **Exemplo prático:** Imagine um livro contábil digital que todos podem ver, mas ninguém pode alterar. **Riscos:** Alta volatilage (pode variar ±60% ao ano). **Dica para iniciantes:** Comece com apenas 2-5% da carteira total e nunca invista mais do que pode perder.';
  }
  
  if (lowerMessage.includes('renda fixa') || lowerMessage.includes('renda variável')) {
    return '**Renda Fixa:** Rentabilage previsível no momento da aplicação. **Exemplos:** CDB (13% a.a.), Tesouro Direto (11% a.a.), LCI/LCA (9-11% a.a.). **Renda Variável:** Rentabilage varia conforme o mercado. **Exemplos:** Ações (IBOVESPA +21% em 2023), FIIs (10-15% a.a.). **Analogia:** Renda fixa é como um empréstimo que você faz para o banco/governo, renda variável é como se tornar sócio de empresas. **Proporção sugerida:** 60% renda fixa + 40% variável para perfil equilibrado.';
  }
  
  if (lowerMessage.includes('diversificar') || lowerMessage.includes('carteira')) {
    return '**Diversificação:** "Não colocar todos os ovos na mesma cesta". **Exemplo prático:** Se você tem R$ 10.000, distribua assim: R$ 3.500 em renda fixa (CDB/Tesouro), R$ 4.000 em ações brasileiras, R$ 1.500 em FIIs, R$ 1.000 em investimentos internacionais. **Benefício:** Se um setor cair, outros podem compensar. **Dica importante:** Rebalanceie a cada 3 meses, vendendo o que subiu muito e comprando o que caiu para manter as proporções.';
  }
  
  if (lowerMessage.includes('perfil') || lowerMessage.includes('conservador') || lowerMessage.includes('agressivo') || lowerMessage.includes('moderado')) {
    return '**Conservador (Baixo Risco):** 80% renda fixa, 20% ações. Retorno esperado: 8-12% a.a. **Exemplo:** Aposentado que precisa de renda estável. **Moderado (Risco Equilibrado):** 50% renda fixa, 50% renda variável. Retorno: 12-18% a.a. **Exemplo:** Pessoa de 30-50 anos poupando para casa própria. **Agressivo (Alto Risco):** 20% renda fixa, 80% renda variável. Retorno: 18-30% a.a. **Exemplo:** Jovem de 20-35 anos com longo prazo. **Como escolher:** Considere sua age, objetivos e quanto consegue dormir tranquilo se perder 20% em um mês.';
  }
  
  if (lowerMessage.includes('cdb')) {
    return '**CDB (Certificado de Depósito Bancário):** Você empresta dinheiro para o banco e ele paga juros. **Rentabilage atual:** 13% a.a. (100% do CDI). **Segurança:** Garantido pelo FGC até R$ 250 mil por banco. **Exemplo prático:** R$ 10.000 em CDB por 1 ano = R$ 11.300 (R$ 1.300 de lucro). **Tributação:** IR regressivo (22,5% até 180 dias, 15% após 2 anos). **Dica:** Prefira bancos médios que pagam mais que grandes bancos.';
  }
  
  if (lowerMessage.includes('tesouro direto')) {
    return '**Tesouro Direto:** Você empresta dinheiro para o governo brasileiro. **Tipos:** Tesouro Selic (pós-fixado, 13,25% a.a.), Tesouro IPCA+ (6,2% + inflação), Tesouro Prefixado (10,5% a.a.). **Vantagens:** Mais seguro do Brasil, aplicação mínima R$ 30. **Exemplo:** R$ 1.000 no Tesouro IPCA+ 2029 rende 6,2% + inflação ao ano. **Como comprar:** Pelo site oficial ou corretoras. **Taxa:** 0,1% a.a. de custódia. **Ideal para:** Reserva de emergência e objetivos de longo prazo.';
  }
  
  if (lowerMessage.includes('ações') || lowerMessage.includes('bolsa')) {
    return '**Ações:** Você compra uma pequena parte de uma empresa. **Como ganhar:** Dividendos (empresa distribui lucros) + Valorização (preço da ação sobe). **Exemplo:** VALE3 pagou R$ 3,50 de dividendos por ação em 2023. **Horário:** Bolsa funciona 10h-17h em dias úteis. **Como começar:** Abra conta em corretora, estude a empresa (balanços, DRE), comece com R$ 500-1000. **Dica de ouro:** Invista apenas em empresas que você entende o negócio. Se não sabe como a empresa ganha dinheiro, não invista.';
  }
  
  if (lowerMessage.includes('fiis') || lowerMessage.includes('fundos imobiliários')) {
    return '**FIIs (Fundos de Investimento Imobiliário):** Você investe em imóveis sem precisar comprá-los. **Como funciona:** O fundo compra shoppings, galpões, edifícios e você recebe parte do aluguel. **Rentabilage:** 8-12% a.a. em dividendos + valorização das cotas. **Exemplo:** HGLG11 (hospital) paga cerca de R$ 1,10 por cota/mês. **Vantagem:** Dividendos isentos de IR para pessoa física. **Como escolher:** Veja o tipo de imóvel, localização, vacancy (taxa de desocupação) e histórico de pagamentos.';
  }
  
  if (lowerMessage.includes('risco') || lowerMessage.includes('riscos')) {
    return '**Tipos de Risco:** 1) **Mercado** - preços sobem/descem (ex: ações caem 30% em crise). 2) **Crédito** - empresa/banco quebra (ex: Banco Lehman Brothers). 3) **Liquidez** - dificuldade para vender (ex: imóvel demora meses). 4) **Inflação** - dinheiro perde poder de compra (ex: poupança rende 6%, inflação 5% = ganho real 1%). **Como reduzir:** Diversifique entre classes, prazos e países. **Regra básica:** Maior rentabilage = maior risco. Não existe almoço grátis nos investimentos.';
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

function generateStructuredRecommendations(userProfile: any) {
  const { monthlyIncome, monthlyExpenses, leisureExpenses, investmentProfile, age, availableToInvest } = userProfile;
  
  // Função auxiliar para formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Análise detalhada da situação financeira
  const incomeLevel = monthlyIncome < 3000 ? "baixa" : monthlyIncome < 8000 ? "média" : monthlyIncome < 15000 ? "alta" : "muito alta";
  const totalSavingsCapacity = availableToInvest * 12; // Capacidade anual de investimento
  
  let nationalInvestments = [];
  let internationalInvestments = [];
  let summary = "";
  let warnings = [];
  
  // 5 INVESTIMENTOS NACIONAIS PERSONALIZADOS baseados na situação específica
  if (investmentProfile === "conservative") {
    nationalInvestments = [
      {
        name: availableToInvest < 500 ? "Tesouro Selic (mínimo R$ 30)" : "Tesouro Selic 2026",
        allocation: 25,
        expectedReturn: "13,75% a.a.",
        risk: "Baixo",
        reason: `Para ${age} anos com renda ${incomeLevel} e ${formatCurrency(availableToInvest)} mensais, é o investimento mais seguro. ${incomeLevel === "baixa" ? "Com renda menor, segurança é fundamental." : "Base sólida para sua carteira."}`,
        theory: "É como emprestar dinheiro para o governo brasileiro. Eles pagam juros que acompanham a Selic (taxa básica).",
        practice: `${availableToInvest < 500 ? "Comece com R$ 30 no site do Tesouro Direto. Aumente aos poucos." : "Use corretora ou site oficial. Liquidez diária, sem pegadinhas."}`,
        minAmount: 30,
        timeHorizon: "Qualquer prazo",
        category: "Nacional"
      },
      {
        name: incomeLevel === "baixa" ? "CDB Nubank 100% CDI" : "CDB Inter 105% CDI",
        allocation: 20,
        expectedReturn: incomeLevel === "baixa" ? "13,75% a.a." : "14,4% a.a.",
        risk: "Baixo",
        reason: `${incomeLevel === "baixa" ? "Com renda menor, bancos digitais gratuitos são ideais - sem taxas que comem seu rendimento." : "Bancos médios pagam mais que os grandes. Seu dinheiro protegido até R$ 250 mil."}`,
        theory: "É como emprestar para o banco. Eles usam seu dinheiro para dar empréstimos e dividem os juros com você.",
        practice: `${incomeLevel === "baixa" ? "Baixe o app do Nubank, é gratuito e simples." : "App do Inter - compare sempre as taxas oferecidas."}`,
        minAmount: incomeLevel === "baixa" ? 1 : 500,
        timeHorizon: "1-3 anos",
        category: "Nacional"
      },
      {
        name: totalSavingsCapacity > 50000 ? "LCI Bradesco 95% CDI" : "LCA Caixa 90% CDI",
        allocation: 20,
        expectedReturn: totalSavingsCapacity > 50000 ? "13,05% a.a. (sem IR)" : "12,4% a.a. (sem IR)",
        risk: "Baixo",
        reason: `${totalSavingsCapacity > 50000 ? "Com boa capacidade de poupança, LCI de banco grande não cobra IR - economia real." : "LCA da Caixa é mais acessível e também livre de IR - vantagem fiscal importante."}`,
        theory: "Financia construção de casas (LCI) ou agronegócio (LCA). Governo não cobra IR para incentivar esses setores.",
        practice: `${totalSavingsCapacity > 50000 ? "Vá na agência ou use app do banco. Valor alto mas vale pela isenção." : "Caixa tem valores menores. Cuidado com prazo mínimo de 90 dias."}`,
        minAmount: totalSavingsCapacity > 50000 ? 5000 : 1000,
        timeHorizon: "2-5 anos",
        category: "Nacional"
      },
      {
        name: age < 45 ? "Tesouro IPCA+ 2035" : "Tesouro IPCA+ 2029",
        allocation: 15,
        expectedReturn: "6,2% + inflação por ano",
        risk: "Baixo",
        reason: `${age < 45 ? "Aos " + age + " anos, você tem tempo para investimentos longos. Este sempre ganha da inflação até a aposentadoria." : "Aos " + age + " anos, prazo mais curto é melhor. Ainda protege contra inflação."}`,
        theory: "Se a inflação for 4%, você ganha 6,2% + 4% = 10,2% no total. Seu dinheiro nunca perde valor.",
        practice: `${age < 45 ? "Compre e esqueça até 2035. Não se preocupe com sobe e desce." : "Prazo menor reduz oscilações. Segure até o vencimento."}`,
        minAmount: 30,
        timeHorizon: age < 45 ? "10+ anos" : "5-8 anos",
        category: "Nacional"
      },
      {
        name: monthlyIncome > 8000 ? "Debênture CPFL (isenta IR)" : "CDB Prefixado 13,5%",
        allocation: 20,
        expectedReturn: monthlyIncome > 8000 ? "12% a.a. (sem IR)" : "13,5% a.a.",
        risk: "Médio",
        reason: `${monthlyIncome > 8000 ? "Com renda de " + formatCurrency(monthlyIncome) + ", debêntures isentas são ideais - financia energia elétrica do país." : "CDB prefixado garante rentabilidade certa, sem depender de oscilações da Selic."}`,
        theory: `${monthlyIncome > 8000 ? "Empresas de energia emitem esses títulos. Governo dá isenção de IR para estimular investimento em infraestrutura." : "Taxa já definida na hora da compra. Você sabe exatamente quanto vai receber no final."}`,
        practice: `${monthlyIncome > 8000 ? "Disponível na XP, Rico, BTG. Verifique se a empresa tem bom rating." : "Bancos menores oferecem taxas melhores. Compare antes de escolher."}`,
        minAmount: monthlyIncome > 8000 ? 1000 : 500,
        timeHorizon: "3-6 anos",
        category: "Nacional"
      }
    ];
    
    // 5 INVESTIMENTOS INTERNACIONAIS PERSONALIZADOS
    internationalInvestments = [
      {
        name: availableToInvest < 1000 ? "Tesouro Americano (via Avenue fracionado)" : "US Treasury Bills direto",
        allocation: 25,
        expectedReturn: "5,2% a.a. + dólar",
        risk: "Baixo",
        reason: `${availableToInvest < 1000 ? "Com valor menor disponível, corretoras brasileiras permitem investir em títulos americanos fracionados. Proteção do dólar sem muito dinheiro." : "Com " + formatCurrency(availableToInvest) + " mensais, pode investir direto no governo americano - máxima segurança mundial."}`,
        theory: "É como emprestar para o governo americano. Eles são considerados o pagador mais confiável do mundo.",
        practice: `${availableToInvest < 1000 ? "Use Avenue ou XP. Comece com US$ 50. Proteção do dólar + segurança americana." : "Interactive Brokers ou TD Ameritrade para valores maiores. Mínimo US$ 100."}`,
        minAmount: availableToInvest < 1000 ? 300 : 600,
        timeHorizon: "6 meses a 2 anos",
        category: "Internacional"
      },
      {
        name: incomeLevel === "baixa" ? "ETF Bonds Municipal (VTEB)" : "ETF Bonds Total (BND)",
        allocation: 20,
        expectedReturn: incomeLevel === "baixa" ? "4,8% a.a. + dólar" : "5,5% a.a. + dólar",
        risk: "Baixo",
        reason: `${incomeLevel === "baixa" ? "Bonds municipais americanos são isentos de imposto federal. Perfeito para quem tem pouco e quer eficiência fiscal." : "BND diversifica em todo mercado de bonds americano. Para renda maior, oferece exposição completa e segura."}`,
        theory: `${incomeLevel === "baixa" ? "Cidades americanas emitem bonds para fazer obras. São muito seguros e têm benefício fiscal." : "ETF que investe em milhares de bonds americanos. Diversificação máxima em renda fixa americana."}`,
        practice: `${incomeLevel === "baixa" ? "Compre via corretoras brasileiras. Foque em ETFs de bonds municipais para aproveitar benefício fiscal." : "Disponível em qualquer corretora internacional. Reinvista automaticamente os dividendos."}`,
        minAmount: 500,
        timeHorizon: "2-5 anos",
        category: "Internacional"
      },
      {
        name: age > 50 ? "ETF Dividendos Defensivos (SCHD)" : "ETF Dividendos Altos (VYM)",
        allocation: 20,
        expectedReturn: age > 50 ? "7,5% a.a. + dólar" : "8,2% a.a. + dólar",
        risk: "Médio",
        reason: `${age > 50 ? "Aos " + age + " anos, foque em dividendos de empresas defensivas. SCHD investe em empresas que pagam dividendos crescentes há décadas." : "Aos " + age + " anos, VYM oferece dividendos altos de empresas sólidas americanas. Boa forma de ter renda em dólar."}`,
        theory: `${age > 50 ? "SCHD seleciona empresas com histórico de crescimento consistente de dividendos. Foco em qualidade e sustentabilidade." : "VYM investe nas empresas que pagam os maiores dividendos do mercado americano. Foco em renda."}`,
        practice: `${age > 50 ? "Via Avenue, XP ou corretoras internacionais. Receba dividendos a cada 3 meses em dólar." : "Disponível em corretoras brasileiras e internacionais. Dividendos pagos a cada 3 meses."}`,
        minAmount: 1000,
        timeHorizon: age > 50 ? "3-8 anos" : "5-10 anos",
        category: "Internacional"
      },
      {
        name: totalSavingsCapacity > 100000 ? "Realty Income (O)" : "ETF REITs (VNQ)",
        allocation: 20,
        expectedReturn: totalSavingsCapacity > 100000 ? "9,5% a.a. + dólar" : "8,8% a.a. + dólar",
        risk: "Médio",
        reason: `${totalSavingsCapacity > 100000 ? "Com alta capacidade de poupança, pode investir no REIT mais sólido dos EUA. Paga dividendo todo mês há 30 anos." : "Com " + formatCurrency(totalSavingsCapacity) + " de capacidade anual, ETF de REITs oferece diversificação em imóveis americanos."}`,
        theory: `${totalSavingsCapacity > 100000 ? "Realty Income é o 'Walmart dos REITs'. Aluga imóveis para empresas estáveis com contratos longos." : "VNQ investe em centenas de REITs americanos. Diversificação total no mercado imobiliário americano."}`,
        practice: `${totalSavingsCapacity > 100000 ? "Compre ações individuais via corretora internacional. Dividendo mensal, não trimestral." : "Disponível em corretoras brasileiras. Dividendos a cada 3 meses de dezenas de REITs."}`,
        minAmount: totalSavingsCapacity > 100000 ? 3000 : 1000,
        timeHorizon: "7-15 anos",
        category: "Internacional"
      },
      {
        name: monthlyIncome > 10000 ? "ETF Small Cap Value (VTWO)" : "ETF Mercado Total (VTI)",
        allocation: 15,
        expectedReturn: monthlyIncome > 10000 ? "11,5% a.a. + dólar" : "10,2% a.a. + dólar",
        risk: "Médio",
        reason: `${monthlyIncome > 10000 ? "Com renda alta de " + formatCurrency(monthlyIncome) + ", pode assumir risco de small caps americanas para maior retorno. Ainda dentro do perfil conservador." : "VTI oferece exposição a todo mercado americano de forma conservadora. Para " + age + " anos e perfil conservador, é a dose certa de ações."}`,
        theory: `${monthlyIncome > 10000 ? "Small caps americanas de valor têm potencial de crescimento superior. Empresas menores, mas sólidas financeiramente." : "VTI replica todo mercado acionário americano. Warren Buffett recomenda para aposentadoria."}`,
        practice: `${monthlyIncome > 10000 ? "Via corretoras internacionais. Monitore mais de perto - small caps são mais voláteis." : "Investimento automático mensal via corretoras. Estratégia de longo prazo."}`,
        minAmount: 2000,
        timeHorizon: monthlyIncome > 10000 ? "8-12 anos" : "10+ anos",
        category: "Internacional"
      }
    ];
    
    summary = `Estratégia conservadora para ${age} anos, renda ${incomeLevel} (${formatCurrency(monthlyIncome)}) e ${formatCurrency(availableToInvest)} mensais. ${incomeLevel === "baixa" ? "Foco total em segurança e produtos sem taxa." : "Equilibrio entre segurança e rentabilidade superior."} Diversificação Brasil (50%) e exterior (50%) protege contra riscos do país. Rentabilidade esperada: 11-14% ao ano.`;
    
    warnings = [
      `${availableToInvest < 500 ? "Com valor mensal baixo, comece pelo Tesouro Selic e CDB do Nubank. Sem pressa." : "Implemente a estratégia gradualmente, priorizando investimentos de menor valor mínimo."}`,
      `${age > 50 ? "Mantenha ao menos 8 meses de gastos em reserva de emergência antes de investir." : "Construa reserva de emergência de 6 meses antes de partir para investimentos."}`,
      `${incomeLevel === "baixa" ? "Evite produtos com taxas altas que corroem o rendimento. Prefira bancos digitais gratuitos." : "Compare sempre as taxas - diferença de 0,5% ao ano impacta muito no longo prazo."}`,
      "Rebalanceie a carteira a cada 6 meses para manter as proporções ideais entre nacional e internacional."
    ];
  }
  
  // PERFIL MODERADO - Recomendações simplificadas
  else if (investmentProfile === "moderate") {
    nationalInvestments = [
      {
        name: "Tesouro IPCA+ 2035",
        allocation: 20,
        expectedReturn: "6,2% + inflação",
        risk: "Baixo",
        reason: `Para ${age} anos, protege seu dinheiro da inflação ao longo do tempo.`,
        theory: "Sempre rende acima da inflação, mantendo seu poder de compra.",
        practice: "Compre no Tesouro Direto e mantenha até o vencimento.",
        minAmount: 30,
        timeHorizon: "10+ anos",
        category: "Nacional"
      },
      {
        name: "Ações de bancos (ITUB4)",
        allocation: 20,
        expectedReturn: "15-20% ao ano",
        risk: "Médio",
        reason: `Com renda ${incomeLevel}, pode ter ações de bancos sólidos que pagam dividendos.`,
        theory: "Bancos grandes como Itaú são estáveis e pagam dividendos regularmente.",
        practice: "Compre via corretora e receba dividendos a cada 6 meses.",
        minAmount: 100,
        timeHorizon: "5+ anos",
        category: "Nacional"
      },
      {
        name: "Fundos Imobiliários",
        allocation: 20,
        expectedReturn: "12-15% ao ano",
        risk: "Médio", 
        reason: `FIIs geram renda mensal sem IR, complementando sua renda atual.`,
        theory: "Como ter vários imóveis para alugar, mas sem dor de cabeça.",
        practice: "Diversifique entre tipos: shopping, escritórios, galpões.",
        minAmount: 100,
        timeHorizon: "5+ anos",
        category: "Nacional"
      },
      {
        name: "CDB 110% CDI",
        allocation: 20,
        expectedReturn: "15% ao ano",
        risk: "Baixo",
        reason: `Rentabilidade superior mantendo segurança para seu perfil.`,
        theory: "Bancos menores pagam mais para captar dinheiro.",
        practice: "Procure em bancos digitais como C6 ou Original.",
        minAmount: 500,
        timeHorizon: "2-3 anos",
        category: "Nacional"
      },
      {
        name: "Ações de mineração (VALE3)",
        allocation: 20,
        expectedReturn: "18-25% ao ano",
        risk: "Médio",
        reason: `Vale é líder mundial em minério, com bons dividendos.`,
        theory: "Empresas de commodities se beneficiam da demanda global.",
        practice: "Acompanhe preço do minério de ferro e dividendos.",
        minAmount: 100,
        timeHorizon: "5+ anos",
        category: "Nacional"
      }
    ];
    
    internationalInvestments = [
      {
        name: "S&P 500 ETF",
        allocation: 25,
        expectedReturn: "10-12% + dólar",
        risk: "Médio",
        reason: `As 500 maiores empresas americanas, essencial para ${age} anos.`,
        theory: "Apple, Microsoft, Google - as melhores empresas do mundo.",
        practice: "Compre via Avenue ou XP com aportes mensais.",
        minAmount: 100,
        timeHorizon: "10+ anos",
        category: "Internacional"
      },
      {
        name: "REITs americanos",
        allocation: 20,
        expectedReturn: "9-12% + dólar",
        risk: "Médio",
        reason: `Imóveis americanos pagam dividendos em dólar trimestralmente.`,
        theory: "Como FIIs brasileiros, mas em dólar americano.",
        practice: "VNQ diversifica em todo mercado imobiliário americano.",
        minAmount: 500,
        timeHorizon: "7+ anos",
        category: "Internacional"
      },
      {
        name: "Bonds corporativos",
        allocation: 20,
        expectedReturn: "6-8% + dólar",
        risk: "Baixo",
        reason: `Títulos de empresas americanas sólidas para equilibrar ações.`,
        theory: "Empresas como Apple e Microsoft emitem bonds seguros.",
        practice: "ETF LQD oferece diversificação automática.",
        minAmount: 1000,
        timeHorizon: "5+ anos",
        category: "Internacional"
      },
      {
        name: "Ações de crescimento",
        allocation: 20,
        expectedReturn: "15-25% + dólar",
        risk: "Alto",
        reason: `Para ${age} anos, exposição a empresas de tecnologia inovadoras.`,
        theory: "Empresas que crescem receita mais rápido que a média.",
        practice: "Tesla, Netflix, Amazon via corretoras internacionais.",
        minAmount: 1000,
        timeHorizon: "10+ anos",
        category: "Internacional"
      },
      {
        name: "Mercados emergentes",
        allocation: 15,
        expectedReturn: "12-18% + dólar",
        risk: "Alto",
        reason: `Diversificação em países emergentes com potencial superior.`,
        theory: "China, Índia e outros países em crescimento acelerado.",
        practice: "ETF VWO oferece exposição diversificada e simples.",
        minAmount: 1000,
        timeHorizon: "8+ anos",
        category: "Internacional"
      }
    ];
    
    summary = `Estratégia moderada para ${age} anos, equilibrando segurança (40%) e crescimento (60%). Diversificação global reduz riscos. Rentabilidade esperada: 14-18% ao ano.`;
    
    warnings = [
      "Prepare-se para oscilações de 20-30% em crises",
      "Rebalanceie a cada 3 meses vendendo o que subiu",
      "Mantenha aportes mensais constantes",
      "Não se desespere com quedas temporárias"
    ];
  }
  
  // PERFIL AGRESSIVO
  else {
    nationalInvestments = [
      {
        name: "Ações de crescimento",
        allocation: 25,
        expectedReturn: "20-35% ao ano",
        risk: "Alto",
        reason: `Para ${age} anos com perfil agressivo, ações de crescimento oferecem máximo potencial.`,
        theory: "Empresas que crescem receita rapidamente, reinvestindo lucros para expansão.",
        practice: "Foque em tecnologia, biotecnologia e empresas inovadoras.",
        minAmount: 100,
        timeHorizon: "10+ anos",
        category: "Nacional"
      },
      {
        name: "Small Caps brasileiras",
        allocation: 25,
        expectedReturn: "25-40% ao ano",
        risk: "Alto",
        reason: `Empresas menores têm potencial de crescimento superior para investidores agressivos.`,
        theory: "Small caps podem se tornar as grandes empresas do futuro.",
        practice: "ETF SMLL11 ou ações individuais via análise fundamentalista.",
        minAmount: 500,
        timeHorizon: "10+ anos",
        category: "Nacional"
      },
      {
        name: "Criptomoedas",
        allocation: 15,
        expectedReturn: "Muito variável",
        risk: "Muito Alto",
        reason: `Para perfil agressivo, cripto oferece exposição a nova economia digital.`,
        theory: "Moedas digitais que podem revolucionar o sistema financeiro.",
        practice: "Bitcoin e Ethereum via exchanges como Mercado Bitcoin.",
        minAmount: 100,
        timeHorizon: "5+ anos",
        category: "Nacional"
      },
      {
        name: "FIIs de desenvolvimento",
        allocation: 20,
        expectedReturn: "15-25% ao ano",
        risk: "Alto",
        reason: `FIIs de projetos em desenvolvimento têm maior potencial de valorização.`,
        theory: "Fundos que constroem novos empreendimentos imobiliários.",
        practice: "Pesquise FIIs focados em desenvolvimento urbano e logística.",
        minAmount: 100,
        timeHorizon: "7+ anos",
        category: "Nacional"
      },
      {
        name: "Opções e derivativos",
        allocation: 15,
        expectedReturn: "Muito variável",
        risk: "Muito Alto",
        reason: `Para investidores sofisticados, derivativos amplificam retornos.`,
        theory: "Instrumentos que multiplicam exposição a movimentos de preços.",
        practice: "Estude muito antes de operar. Comece com simuladores.",
        minAmount: 1000,
        timeHorizon: "Curto prazo",
        category: "Nacional"
      }
    ];
    
    internationalInvestments = [
      {
        name: "NASDAQ ETF",
        allocation: 30,
        expectedReturn: "15-25% + dólar",
        risk: "Alto",
        reason: `Exposição às empresas de tecnologia mais inovadoras do mundo.`,
        theory: "Apple, Google, Tesla - empresas que moldam o futuro.",
        practice: "QQQ ou via corretoras brasileiras com ETFs internacionais.",
        minAmount: 500,
        timeHorizon: "10+ anos",
        category: "Internacional"
      },
      {
        name: "Ações individuais growth",
        allocation: 25,
        expectedReturn: "20-50% + dólar",
        risk: "Muito Alto",
        reason: `Stock picking em empresas disruptivas para máximo crescimento.`,
        theory: "Empresas que podem multiplicar valor em poucos anos.",
        practice: "Tesla, Nvidia, startups via corretoras internacionais.",
        minAmount: 1000,
        timeHorizon: "5-10 anos",
        category: "Internacional"
      },
      {
        name: "Mercados emergentes agressivos",
        allocation: 20,
        expectedReturn: "18-30% + dólar",
        risk: "Alto",
        reason: `Países emergentes com crescimento acelerado e maior risco.`,
        theory: "Economias que crescem mais rápido que países desenvolvidos.",
        practice: "ETFs específicos de China, Índia, Vietnam.",
        minAmount: 1000,
        timeHorizon: "8+ anos",
        category: "Internacional"
      },
      {
        name: "Criptomoedas globais",
        allocation: 15,
        expectedReturn: "Extremamente variável",
        risk: "Muito Alto",
        reason: `Exposição global a criptomoedas e blockchain.`,
        theory: "Revolução financeira digital em escala mundial.",
        practice: "Binance, Coinbase ou ETFs de cripto americanos.",
        minAmount: 500,
        timeHorizon: "3-7 anos",
        category: "Internacional"
      },
      {
        name: "Setores disruptivos",
        allocation: 10,
        expectedReturn: "25-60% + dólar",
        risk: "Muito Alto",
        reason: `Setores que podem revolucionar a economia global.`,
        theory: "Inteligência artificial, energia renovável, biotecnologia.",
        practice: "ETFs temáticos como ARKK, ICLN, ARKG.",
        minAmount: 1000,
        timeHorizon: "5-15 anos",
        category: "Internacional"
      }
    ];
    
    summary = `Estratégia agressiva para ${age} anos buscando máximo crescimento. Alto risco, alto retorno. Diversificação global em setores disruptivos. Rentabilidade esperada: 20-35% ao ano com alta volatilidade.`;
    
    warnings = [
      "Prepare-se para perdas de até 50% em crises",
      "Invista apenas dinheiro que pode perder",
      "Rebalanceie mensalmente controlando emoções",
      "Estude muito antes de investir em derivativos"
    ];
  }
  
  return {
    nationalInvestments,
    internationalInvestments,
    summary,
    warnings
  };
}

// Simplified compound interest calculation
function calculateCompoundInterest(data: z.infer<typeof compoundInterestSchema>) {
  const { principal, monthlyContribution, annualRate, years } = data;
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  
  // Future value of principal
  const principalFV = principal * Math.pow(1 + monthlyRate, months);
  
  // Future value of monthly contributions (annuity)
  const contributionsFV = monthlyContribution * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  const totalFinal = principalFV + contributionsFV;
  const totalInvested = principal + (monthlyContribution * months);
  const totalInterest = totalFinal - totalInvested;
  
  return {
    totalInvested,
    totalInterest,
    finalAmount: totalFinal,
    recommendation: "Mantenha aportes constantes e foque no longo prazo."
  };
}

// Simplified retirement calculation  
function calculateRetirement(data: z.infer<typeof retirementCalculationSchema>) {
  const { currentAge, retirementAge, desiredIncome, currentSavings } = data;
  const yearsToRetirement = retirementAge - currentAge;
  const monthsToRetirement = yearsToRetirement * 12;
  
  // Assume 4% safe withdrawal rate and 8% annual return
  const totalNeeded = desiredIncome * 25; // 4% rule
  const futureValueOfCurrentSavings = currentSavings * Math.pow(1.08, yearsToRetirement);
  const additionalNeeded = Math.max(0, totalNeeded - futureValueOfCurrentSavings);
  
  // Monthly contribution needed
  const monthlyRate = 0.08 / 12;
  const monthlyNeeded = additionalNeeded / 
    ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);
  
  return {
    yearsToRetirement,
    totalNeeded,
    monthlyNeeded: Math.max(0, monthlyNeeded),
    futureValueOfCurrentSavings
  };
}
