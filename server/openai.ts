import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

// Debug: verificar se a chave está carregada
console.log("OpenAI API Key status:", process.env.OPENAI_API_KEY ? "Loaded" : "Not loaded");

interface UserFinancialProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  leisureExpenses: number;
  investmentProfile: "conservative" | "moderate" | "aggressive";
  age: number;
  availableToInvest: number;
}

export async function generatePersonalizedRecommendations(profile: UserFinancialProfile) {
  const prompt = `
Como especialista em educação financeira brasileira, analise este perfil e gere recomendações personalizadas:

PERFIL DO USUÁRIO:
- Renda mensal: R$ ${profile.monthlyIncome.toLocaleString()}
- Gastos essenciais: R$ ${profile.monthlyExpenses.toLocaleString()}
- Gastos com lazer: R$ ${profile.leisureExpenses.toLocaleString()}
- Disponível para investir: R$ ${profile.availableToInvest.toLocaleString()}
- Idade: ${profile.age} anos
- Perfil: ${profile.investmentProfile}

INSTRUÇÕES OBRIGATÓRIAS:
1. Gere EXATAMENTE 10 recomendações de investimentos:
   - 5 INVESTIMENTOS NACIONAIS (Brasil)
   - 5 INVESTIMENTOS INTERNACIONAIS (exterior)

2. Para cada investimento, inclua:
   - Nome específico do investimento
   - Porcentagem sugerida da carteira (%)
   - Retorno esperado anual
   - Nível de risco (Baixo/Médio/Alto)
   - Justificativa PERSONALIZADA baseada nos dados financeiros específicos
   - Como funciona na TEORIA (conceito)
   - Como funciona na PRÁTICA (passos concretos)
   - Valor mínimo para começar
   - Prazo recomendado
   - Categoria (Nacional/Internacional)

3. DIVERSIFICAÇÃO INTELIGENTE:
   - Escolha investimentos diferentes baseados no perfil de risco
   - Considere a situação financeira específica (renda, gastos, sobra)
   - Adapte as opções para a idade e horizonte temporal
   - Explique PORQUÊ cada investimento faz sentido para ESTA pessoa

4. LINGUAGEM DIDÁTICA:
   - Use exemplos práticos com valores reais
   - Explique termos técnicos de forma simples
   - Dê passos concretos de como investir

Responda em JSON com este formato:
{
  "nationalInvestments": [
    {
      "name": "string",
      "allocation": number,
      "expectedReturn": "string",
      "risk": "Baixo|Médio|Alto",
      "reason": "string - justificativa personalizada",
      "theory": "string - como funciona conceitualmente",
      "practice": "string - como investir na prática",
      "minAmount": number,
      "timeHorizon": "string",
      "category": "Nacional"
    }
  ],
  "internationalInvestments": [
    {
      "name": "string",
      "allocation": number,
      "expectedReturn": "string",
      "risk": "Baixo|Médio|Alto",
      "reason": "string - justificativa personalizada",
      "theory": "string - como funciona conceitualmente",
      "practice": "string - como investir na prática",
      "minAmount": number,
      "timeHorizon": "string",
      "category": "Internacional"
    }
  ],
  "summary": "string - resumo da estratégia completa para este perfil",
  "warnings": ["string"] - alertas específicos para esta situação
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em educação financeira brasileira com 15 anos de experiência. Suas recomendações são práticas, didáticas e personalizadas para cada situação financeira específica."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    throw new Error("Erro ao gerar recomendações personalizadas");
  }
}

export async function generateEducationalContent(topic: string, userContext?: string) {
  const prompt = `
Como especialista em educação financeira, explique de forma didática e prática o tema: "${topic}"

${userContext ? `Contexto do usuário: ${userContext}` : ""}

INSTRUÇÕES:
1. Use linguagem simples e didática
2. Inclua exemplos práticos com valores em reais
3. Explique conceitos complexos com analogias
4. Seja específico sobre como implementar na prática
5. Inclua alertas e dicas importantes

Responda em JSON:
{
  "title": "string",
  "explanation": "string - explicação principal",
  "practicalExample": "string - exemplo com valores reais",
  "tips": ["string"] - dicas práticas,
  "warnings": ["string"] - alertas importantes
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    throw new Error("Erro ao gerar conteúdo educacional");
  }
}

export async function generateSmartChatResponse(message: string, userProfile?: any) {
  const prompt = `
Como DinDin, o assistente financeiro educativo do Brasil, responda à pergunta: "${message}"

${userProfile ? `Contexto do usuário: ${JSON.stringify(userProfile)}` : ""}

REGRAS FUNDAMENTAIS PARA RESPOSTAS DIDÁTICAS:

1. ESTRUTURA OBRIGATÓRIA - Use sempre esta ordem:
   📋 **RESPOSTA SIMPLES**: Responda em 1-2 frases diretas
   🎯 **EXEMPLO PRÁTICO**: Dê um exemplo concreto com valores em reais
   💡 **COMO FAZER**: 3 passos práticos para implementar
   ⚠️ **ATENÇÃO**: 1-2 alertas importantes
   🚀 **PRÓXIMO PASSO**: Uma ação concreta que a pessoa pode fazer hoje

2. LINGUAGEM PARA INICIANTES:
   - Use palavras simples, evite jargões
   - Quando usar termo técnico, explique entre parênteses
   - Faça analogias com o dia a dia
   - Use valores concretos (ex: R$ 100, R$ 1.000)
   - Seja específico, não genérico

3. EXEMPLOS PRÁTICOS OBRIGATÓRIOS:
   - Sempre inclua valores em reais brasileiros
   - Use situações reais (salário de R$ 3.000, gasto de R$ 200)
   - Mostre cálculos simples passo a passo
   - Compare com coisas conhecidas (preço de um cafezinho, conta de luz)

4. FORMATO VISUAL:
   - Use emojis para organizar as seções
   - Faça listas numeradas para processos
   - Destaque números importantes
   - Separe bem as informações

5. PROIBIDO:
   - Respostas longas e confusas
   - Múltiplos conceitos misturados
   - Linguagem técnica sem explicação
   - Informações genéricas sem exemplos
   - Respostas desorganizadas

EXEMPLO DE RESPOSTA IDEAL:
📋 **RESPOSTA SIMPLES**: CDB é como emprestar dinheiro para o banco e receber juros por isso.

🎯 **EXEMPLO PRÁTICO**: Se você empresta R$ 1.000 para o banco por 1 ano a 100% do CDI (13% ao ano), receberá cerca de R$ 1.130 no final.

💡 **COMO FAZER**:
1. Abra conta em um banco digital (Nubank, Inter)
2. Procure CDBs com rentabilidade acima de 100% do CDI
3. Invista apenas dinheiro que não precisará usar

⚠️ **ATENÇÃO**: Só invista valores acima de R$ 250.000 se o banco tiver garantia do FGC.

🚀 **PRÓXIMO PASSO**: Compare as ofertas de CDB de 3 bancos diferentes hoje mesmo.

SEMPRE siga este formato RIGOROSAMENTE.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é DinDin, o GÊNIO das finanças brasileiras - combinando 20 anos de experiência em mercado financeiro com extrema gentileza e didática. Você é PhD em Economia, ex-gestor de fundos multibilionários, especialista em mercado de capitais, análise fundamentalista e behavioralista. Sua missão é democratizar o conhecimento financeiro com carinho extremo, transformando conceitos complexos em linguagem simples. Você conhece profundamente: macro/microeconomia, valuation, derivativos, análise técnica, psicologia do investidor, e todos os produtos do mercado brasileiro."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return response.choices[0].message.content || "Oi! Desculpe, não consegui processar sua pergunta direito. Pode me contar novamente o que gostaria de saber sobre investimentos? Estou aqui para te ajudar!";
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    throw error; // Re-throw to be caught by the fallback system
  }
}