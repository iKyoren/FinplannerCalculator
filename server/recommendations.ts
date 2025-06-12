interface UserProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  leisureExpenses: number;
  investmentProfile: "conservative" | "moderate" | "aggressive";
  age: number;
  availableToInvest: number;
}

export function generateStructuredRecommendations(userProfile: UserProfile) {
  const { monthlyIncome, monthlyExpenses, leisureExpenses, investmentProfile, age, availableToInvest } = userProfile;
  
  // Análise da situação financeira
  const incomeLevel = monthlyIncome < 3000 ? "baixa" : monthlyIncome < 8000 ? "média" : "alta";
  const riskCapacity = age < 35 ? "alta" : age < 50 ? "média" : "baixa";
  
  let nationalInvestments = [];
  let internationalInvestments = [];
  let summary = "";
  let warnings = [];
  
  // Recomendações baseadas no perfil e situação financeira
  if (investmentProfile === "conservative") {
    nationalInvestments = [
      {
        name: "Tesouro Selic 2026",
        allocation: 25,
        expectedReturn: "13,75% a.a.",
        risk: "Baixo",
        reason: `Com renda ${incomeLevel} e perfil conservador, este é o investimento mais seguro do país. Ideal para sua reserva de emergência com liquidez diária.`,
        theory: "O Tesouro Selic acompanha a taxa básica de juros da economia (Selic). É um título pós-fixado, ou seja, seu rendimento varia conforme a Selic.",
        practice: "Acesse o site oficial do Tesouro Direto ou sua corretora. Invista a partir de R$ 30. A liquidez é diária com IOF apenas nos primeiros 30 dias.",
        minAmount: 100,
        timeHorizon: "Qualquer prazo",
        category: "Nacional"
      },
      {
        name: "CDB Banco Inter 105% CDI",
        allocation: 20,
        expectedReturn: "14,43% a.a.",
        risk: "Baixo",
        reason: `Para sua situação de renda ${incomeLevel}, bancos médios oferecem melhores taxas que grandes bancos. Protegido pelo FGC até R$ 250 mil.`,
        theory: "CDB é um empréstimo que você faz ao banco. O banco usa seu dinheiro para emprestar a outros clientes e divide os juros com você.",
        practice: "Abra conta no Banco Inter pelo app. Procure CDBs com rentabilidade acima de 100% do CDI. Escolha liquidez diária se precisar do dinheiro.",
        minAmount: 500,
        timeHorizon: "1-3 anos",
        category: "Nacional"
      },
      {
        name: "LCI Santander 95% CDI",
        allocation: 20,
        expectedReturn: "13,05% a.a. (isento IR)",
        risk: "Baixo",
        reason: `Sendo isento de Imposto de Renda, oferece rentabilidade líquida superior para seu perfil conservador. Adequado para ${age} anos.`,
        theory: "LCI financia o setor imobiliário. É isenta de IR para pessoa física, aumentando sua rentabilidade líquida comparada a outros investimentos.",
        practice: "Procure em bancos tradicionais como Santander, Bradesco ou Itaú. Cuidado com carência (período mínimo de permanência).",
        minAmount: 1000,
        timeHorizon: "2-5 anos",
        category: "Nacional"
      },
      {
        name: "Fundos DI Premium",
        allocation: 15,
        expectedReturn: "12,8% a.a.",
        risk: "Baixo",
        reason: `Para diversificar seus investimentos de renda fixa com gestão profissional. Adequado para ${availableToInvest > 3000 ? "seu patrimônio atual" : "começar gradualmente"}.`,
        theory: "Fundos DI investem em títulos de renda fixa que acompanham o CDI. Têm gestão profissional e diversificação automática.",
        practice: "XP, Rico ou BTG oferecem bons fundos DI. Verifique taxa de administração (máximo 1% a.a.) e histórico de performance.",
        minAmount: 1000,
        timeHorizon: "1-2 anos",
        category: "Nacional"
      },
      {
        name: "FIDC de Direitos Creditórios",
        allocation: 20,
        expectedReturn: "15,2% a.a.",
        risk: "Médio",
        reason: `Como você tem ${age} anos e renda ${incomeLevel}, pode assumir um pouco mais de risco para melhor rentabilidade.`,
        theory: "FIDCs investem em direitos creditórios de empresas (duplicatas, notas promissórias). Oferecem rentabilidade superior à renda fixa tradicional.",
        practice: "Disponível em corretoras como XP e Rico. Verifique o rating das empresas devedoras e diversificação do portfólio do fundo.",
        minAmount: 2500,
        timeHorizon: "2-4 anos",
        category: "Nacional"
      }
    ];
    
    internationalInvestments = [
      {
        name: "Treasury Bills Americanos (via ETF)",
        allocation: 25,
        expectedReturn: "5,2% a.a. + variação cambial",
        risk: "Baixo",
        reason: `Diversificação cambial essencial mesmo para conservadores. Protege contra desvalorização do real e crises locais.`,
        theory: "Treasury Bills são títulos do governo americano de curtíssimo prazo. Considerados os ativos mais seguros do mundo.",
        practice: "Invista através do ETF BIUS11 na bolsa brasileira ou diretamente via Avenue/Passfolio com câmbio otimizado.",
        minAmount: 1000,
        timeHorizon: "6 meses - 2 anos",
        category: "Internacional"
      },
      {
        name: "ETF Renda Fixa Global BNDX",
        allocation: 20,
        expectedReturn: "4,8% a.a. + variação cambial",
        risk: "Baixo",
        reason: `Exposição a títulos governamentais de países desenvolvidos. Ideal para renda ${incomeLevel} buscando estabilidade internacional.`,
        theory: "BNDX investe em títulos de governos desenvolvidos (Europa, Japão, Canadá) excluindo EUA. Oferece diversificação geográfica.",
        practice: "Compre através de corretoras internacionais como Avenue, Passfolio ou Inter Invest. Taxa de custódia baixa (0,05% a.a.).",
        minAmount: 2000,
        timeHorizon: "3-7 anos",
        category: "Internacional"
      },
      {
        name: "Certificados de Depósito Americanos",
        allocation: 15,
        expectedReturn: "5,5% a.a. + variação cambial",
        risk: "Baixo",
        reason: `CDs americanos oferecem segurança similar aos brasileiros mas com diversificação cambial importante para sua carteira.`,
        theory: "Equivalente aos CDBs brasileiros, mas emitidos por bancos americanos. Protegidos pelo FDIC até US$ 250 mil.",
        practice: "Disponível via Avenue, Stake ou Interactive Brokers. Compare taxas entre bancos americanos de diferentes portes.",
        minAmount: 5000,
        timeHorizon: "1-3 anos",
        category: "Internacional"
      },
      {
        name: "Fundos de Renda Fixa Europa",
        allocation: 20,
        expectedReturn: "3,2% a.a. + variação cambial",
        risk: "Baixo",
        reason: `Diversificação para mercados europeus estáveis. Adequado para ${age} anos com foco em preservação de capital.`,
        theory: "Fundos que investem em títulos governamentais e corporativos europeus de alta qualidade. Oferecem estabilidade e diversificação.",
        practice: "Acesse via plataformas como XP Internacional ou diretamente por corretoras europeias licenciadas no Brasil.",
        minAmount: 3000,
        timeHorizon: "2-5 anos",
        category: "Internacional"
      },
      {
        name: "REITs Conservadores Americanos",
        allocation: 20,
        expectedReturn: "8,5% a.a. + variação cambial",
        risk: "Médio",
        reason: `REITs de setores defensivos (saúde, educação) oferecem renda passiva internacional com risco controlado para seu perfil.`,
        theory: "REITs são fundos imobiliários americanos que distribuem pelo menos 90% dos lucros como dividendos. Setores defensivos têm menor volatilidade.",
        practice: "Foque em REITs de healthcare (VTR, HCP) ou storage (PSA, EXR) via Avenue ou Interactive Brokers.",
        minAmount: 4000,
        timeHorizon: "5-10 anos",
        category: "Internacional"
      }
    ];
    
    summary = `Estratégia conservadora personalizada para ${age} anos e renda ${incomeLevel}. Foco em preservação de capital com rentabilidade real positiva. Diversificação entre Brasil (60%) e exterior (40%) reduz riscos sistêmicos. Rentabilidade esperada: 11-14% a.a. com baixa volatilidade.`;
    
    warnings = [
      `Com ${availableToInvest < 1000 ? "valor inicial baixo" : "seu orçamento"}, comece pelos investimentos de menor valor mínimo`,
      "Mantenha 6 meses de gastos em Tesouro Selic antes de investir em outros ativos",
      "Evite investimentos sem garantia do FGC/FDIC acima dos limites de cobertura",
      "Rebalanceie a carteira semestralmente para manter as proporções ideais"
    ];
  }
  
  else if (investmentProfile === "moderate") {
    nationalInvestments = [
      {
        name: "Tesouro IPCA+ 2035",
        allocation: 20,
        expectedReturn: "6,2% + IPCA a.a.",
        risk: "Baixo",
        reason: `Proteção contra inflação essencial para ${age} anos. Garante poder de compra real ao longo do tempo.`,
        theory: "Título híbrido que paga taxa fixa + variação da inflação (IPCA). Protege contra perda do poder de compra.",
        practice: "Ideal para objetivos de longo prazo. Compre direto no Tesouro Direto ou via sua corretora. Melhor manter até o vencimento.",
        minAmount: 200,
        timeHorizon: "10+ anos",
        category: "Nacional"
      },
      {
        name: "Ações Blue Chips (ITUB4, VALE3, PETR4)",
        allocation: 25,
        expectedReturn: "16-22% a.a.",
        risk: "Médio",
        reason: `Para renda ${incomeLevel} e ${age} anos, ações de empresas consolidadas oferecem crescimento com risco controlado.`,
        theory: "Blue chips são ações de empresas grandes, estáveis e com histórico consistente de lucros e dividendos.",
        practice: "Compre via home broker. Foque em empresas que você entende o negócio. ITUB4 (banco), VALE3 (mineração), PETR4 (petróleo).",
        minAmount: 1000,
        timeHorizon: "5+ anos",
        category: "Nacional"
      },
      {
        name: "Fundos Imobiliários Diversificados",
        allocation: 20,
        expectedReturn: "12-15% a.a.",
        risk: "Médio",
        reason: `FIIs oferecem renda passiva mensal isenta de IR. Adequado para complementar sua renda de R$ ${monthlyIncome}.`,
        theory: "Fundos que investem em imóveis comerciais e distribuem aluguéis. Dividendos mensais isentos de IR para pessoa física.",
        practice: "Diversifique entre tipos: HGLG11 (hospitais), XPML11 (logística), MXRF11 (multimercado). Compre via corretora.",
        minAmount: 1500,
        timeHorizon: "5+ anos",
        category: "Nacional"
      },
      {
        name: "Fundos Multimercado Long & Short",
        allocation: 15,
        expectedReturn: "14-18% a.a.",
        risk: "Médio",
        reason: `Gestão ativa para capturar oportunidades em diferentes cenários. Adequado para renda ${incomeLevel} com tolerância a volatilidade.`,
        theory: "Fundos que podem comprar e vender ativos a descoberto, gerando alpha independente da direção do mercado.",
        practice: "Verde AM, Kapitalo, ARX oferecem bons fundos multimercado. Analise histórico de performance e volatilidade.",
        minAmount: 5000,
        timeHorizon: "3-7 anos",
        category: "Nacional"
      },
      {
        name: "Debêntures Incentivadas",
        allocation: 20,
        expectedReturn: "IPCA + 5-7% a.a.",
        risk: "Médio",
        reason: `Isenção de IR e rentabilidade atrativa. Para ${age} anos, oferece risco creditício controlado com benefício fiscal.`,
        theory: "Títulos de dívida de empresas para projetos de infraestrutura. Isentos de IR, oferecendo rentabilidade líquida superior.",
        practice: "Disponível via XP, Rico, BTG. Verifique rating da empresa emissora e diversifique entre diferentes emissores.",
        minAmount: 1000,
        timeHorizon: "4-8 anos",
        category: "Nacional"
      }
    ];
    
    internationalInvestments = [
      {
        name: "S&P 500 ETF (IVVB11 ou direto)",
        allocation: 30,
        expectedReturn: "10-12% a.a. + variação cambial",
        risk: "Médio",
        reason: `Exposição às 500 maiores empresas americanas. Essencial para ${age} anos construir patrimônio internacional.`,
        theory: "Índice que replica as 500 maiores empresas dos EUA por capitalização. Diversificação automática nos melhores negócios do mundo.",
        practice: "IVVB11 no Brasil (mais caro) ou VTI/SPY direto via Avenue/Passfolio (mais barato). Dollar-cost averaging mensal.",
        minAmount: 1000,
        timeHorizon: "10+ anos",
        category: "Internacional"
      },
      {
        name: "ETF Mercados Emergentes (VWO)",
        allocation: 20,
        expectedReturn: "8-15% a.a. + variação cambial",
        risk: "Alto",
        reason: `Diversificação em países emergentes com potencial de crescimento superior. Adequado para ${age} anos.`,
        theory: "VWO investe em ações de países emergentes (China, Índia, Taiwan, etc). Maior potencial de crescimento mas maior volatilidade.",
        practice: "Compre via corretoras internacionais. Considere como satélite da carteira, não como core holding.",
        minAmount: 2000,
        timeHorizon: "7+ anos",
        category: "Internacional"
      },
      {
        name: "REITs Diversificados (VNQ)",
        allocation: 15,
        expectedReturn: "9-13% a.a. + variação cambial",
        risk: "Médio",
        reason: `Setor imobiliário americano oferece diversificação e renda passiva internacional para complementar FIIs brasileiros.`,
        theory: "VNQ investe em REITs de todos os setores imobiliários americanos. Distribui dividendos trimestrais.",
        practice: "Via Avenue, Passfolio ou Interactive Brokers. Complementa bem os FIIs brasileiros com exposição cambial.",
        minAmount: 3000,
        timeHorizon: "5+ anos",
        category: "Internacional"
      },
      {
        name: "Bonds Corporativos High Grade",
        allocation: 20,
        expectedReturn: "5-7% a.a. + variação cambial",
        risk: "Baixo",
        reason: `Títulos de empresas americanas com rating AAA/AA. Estabilidade internacional para balancear ações na carteira.`,
        theory: "Debêntures de empresas americanas com excelente rating de crédito. Menor risco que ações, maior retorno que títulos governamentais.",
        practice: "ETFs como LQD ou TLT oferecem exposição diversificada. Disponível via corretoras internacionais.",
        minAmount: 4000,
        timeHorizon: "3-7 anos",
        category: "Internacional"
      },
      {
        name: "Growth Stocks Selecionadas",
        allocation: 15,
        expectedReturn: "15-25% a.a. + variação cambial",
        risk: "Alto",
        reason: `Para ${age} anos, exposição a empresas de crescimento oferece potencial de valorização superior no longo prazo.`,
        theory: "Ações de empresas com crescimento acelerado de receita/lucro. Maior volatilidade mas potencial de retorno superior.",
        practice: "Foque em setores que você entende: tecnologia (MSFT, GOOGL), saúde (JNJ, PFE), consumo (AMZN, TSLA).",
        minAmount: 5000,
        timeHorizon: "10+ anos",
        category: "Internacional"
      }
    ];
    
    summary = `Estratégia moderada para ${age} anos com renda ${incomeLevel}. Balanceamento entre renda fixa (40%) e variável (60%) para crescimento sustentável. Diversificação global reduz dependência do mercado brasileiro. Rentabilidade esperada: 14-18% a.a.`;
    
    warnings = [
      `Volatilidade moderada: prepare-se para oscilações de 15-25% em períodos de crise`,
      "Rebalanceie trimestralmente vendendo o que subiu e comprando o que caiu",
      "Mantenha disciplina em aportes mensais independente do cenário do mercado",
      `Com disponível de R$ ${availableToInvest}/mês, priorize consistência nos aportes`
    ];
  }
  
  else { // aggressive
    nationalInvestments = [
      {
        name: "Small Caps Growth (SMLL11)",
        allocation: 30,
        expectedReturn: "20-35% a.a.",
        risk: "Alto",
        reason: `Para ${age} anos com perfil agressivo, small caps oferecem potencial de crescimento excepcional no longo prazo.`,
        theory: "Empresas pequenas com potencial de crescimento acelerado. Maior volatilidade mas retornos superiores historicamente.",
        practice: "SMLL11 replica índice de small caps. Invista via home broker com aportes mensais para reduzir volatilidade de timing.",
        minAmount: 1000,
        timeHorizon: "10+ anos",
        category: "Nacional"
      },
      {
        name: "Ações Growth Selecionadas",
        allocation: 25,
        expectedReturn: "18-28% a.a.",
        risk: "Alto",
        reason: `Stock picking em empresas com crescimento superior. Adequado para renda ${incomeLevel} e tolerância a risco.`,
        theory: "Ações de empresas com crescimento de receita/lucro superior à média do mercado. Foco em inovação e expansão.",
        practice: "Magazine Luiza (MGLU3), Locaweb (LWSA3), Méliuz (CASH3). Estude fundamentals antes de investir.",
        minAmount: 2000,
        timeHorizon: "7+ anos",
        category: "Nacional"
      },
      {
        name: "Fundos de Ações Long & Short",
        allocation: 20,
        expectedReturn: "16-25% a.a.",
        risk: "Alto",
        reason: `Gestão ativa sofisticada para capturar alpha em mercados voláteis. Ideal para investidores experientes com ${age} anos.`,
        theory: "Fundos que podem comprar (long) e vender (short) ações, gerando retorno independente da direção do mercado.",
        practice: "Verde, Kapitalo, Garde oferecem estratégias long & short. Analise track record e estratégia do gestor.",
        minAmount: 10000,
        timeHorizon: "5+ anos",
        category: "Nacional"
      },
      {
        name: "Crypto via ETFs (QETH11, QBTC11)",
        allocation: 15,
        expectedReturn: "50-100% a.a. (alta volatilidade)",
        risk: "Alto",
        reason: `Para ${age} anos, exposição controlada a criptomoedas oferece potencial de crescimento exponencial.`,
        theory: "ETFs que replicam Bitcoin e Ethereum. Exposição regulada a criptomoedas sem necessidade de carteiras digitais.",
        practice: "QBTC11 (Bitcoin) e QETH11 (Ethereum) via home broker. Limite a 5-10% da carteira total.",
        minAmount: 500,
        timeHorizon: "5-10 anos",
        category: "Nacional"
      },
      {
        name: "BDRs de Growth Stocks",
        allocation: 10,
        expectedReturn: "15-30% a.a.",
        risk: "Alto",
        reason: `Acesso a empresas americanas de crescimento via bolsa brasileira. Conveniente para renda ${incomeLevel}.`,
        theory: "Brazilian Depositary Receipts replicam ações estrangeiras na bolsa brasileira. Tributação como ações nacionais.",
        practice: "Tesla (TSLA34), Apple (AAPL34), Microsoft (MSFT34) via home broker brasileiro. IOF 0,38% na compra.",
        minAmount: 1000,
        timeHorizon: "5+ anos",
        category: "Nacional"
      }
    ];
    
    internationalInvestments = [
      {
        name: "NASDAQ ETF (QQQ)",
        allocation: 35,
        expectedReturn: "12-20% a.a. + variação cambial",
        risk: "Alto",
        reason: `Exposição pura a empresas de tecnologia americanas. Para ${age} anos, essencial capturar inovação global.`,
        theory: "QQQ replica as 100 maiores empresas não-financeiras do NASDAQ. Concentração em tecnologia e inovação.",
        practice: "Compre via Avenue, Passfolio ou Interactive Brokers. Dollar-cost averaging para reduzir volatilidade.",
        minAmount: 2000,
        timeHorizon: "10+ anos",
        category: "Internacional"
      },
      {
        name: "Individual Growth Stocks",
        allocation: 25,
        expectedReturn: "20-40% a.a. + variação cambial",
        risk: "Alto",
        reason: `Stock picking internacional para renda ${incomeLevel}. Potencial de retornos excepcionais com empresas disruptivas.`,
        theory: "Seleção individual de ações com potencial de crescimento superior. Requer pesquisa fundamental profunda.",
        practice: "Tesla (TSLA), Nvidia (NVDA), Netflix (NFLX), Amazon (AMZN). Diversifique entre 8-12 empresas.",
        minAmount: 5000,
        timeHorizon: "7+ anos",
        category: "Internacional"
      },
      {
        name: "Emerging Markets ETF (VWO)",
        allocation: 15,
        expectedReturn: "10-25% a.a. + variação cambial",
        risk: "Alto",
        reason: `Mercados emergentes oferecem crescimento superior com volatilidade alta. Adequado para ${age} anos.`,
        theory: "Exposição a China, Índia, Taiwan e outros emergentes com potencial de crescimento acima da média mundial.",
        practice: "VWO via corretoras internacionais. Considere também ETFs específicos de países (FXI para China).",
        minAmount: 3000,
        timeHorizon: "10+ anos",
        category: "Internacional"
      },
      {
        name: "Innovation ETFs (ARKK, ICLN)",
        allocation: 15,
        expectedReturn: "15-35% a.a. + variação cambial",
        risk: "Alto",
        reason: `ETFs focados em inovação e disrupção. Para perfil agressivo de ${age} anos buscando crescimento exponencial.`,
        theory: "Fundos temáticos que investem em empresas de setores disruptivos como energia limpa, genomics, space exploration.",
        practice: "ARKK (inovação), ICLN (energia limpa), ARKQ (automação) via corretoras internacionais.",
        minAmount: 4000,
        timeHorizon: "10+ anos",
        category: "Internacional"
      },
      {
        name: "Cryptocurrency Direct",
        allocation: 10,
        expectedReturn: "30-200% a.a. (extrema volatilidade)",
        risk: "Alto",
        reason: `Para ${age} anos com tolerância máxima a risco, exposição direta a crypto oferece potencial transformador.`,
        theory: "Investimento direto em Bitcoin, Ethereum e outras criptomoedas através de exchanges regulamentadas.",
        practice: "Binance, Coinbase, Kraken para compra direta. Use dollar-cost averaging e limite a 5% da carteira total.",
        minAmount: 1000,
        timeHorizon: "5-15 anos",
        category: "Internacional"
      }
    ];
    
    summary = `Estratégia agressiva para ${age} anos com renda ${incomeLevel}. Foco em crescimento máximo com 80% em renda variável. Diversificação global em empresas de crescimento e setores disruptivos. Rentabilidade esperada: 18-25% a.a. com alta volatilidade.`;
    
    warnings = [
      `Alta volatilidade: prepare-se para oscilações de 30-50% em crises`,
      "Nunca invista mais de 10% em criptomoedas ou ativos especulativos",
      "Mantenha disciplina em bear markets - são oportunidades de acumulação",
      `Com R$ ${availableToInvest}/mês disponível, mantenha aportes constantes independente do mercado`
    ];
  }
  
  return {
    nationalInvestments,
    internationalInvestments,
    summary,
    warnings
  };
}