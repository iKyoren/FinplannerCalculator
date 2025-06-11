import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchEducationalContent } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function Education() {
  const { data: educationalContent, isLoading } = useQuery({
    queryKey: ["/api/educational-content"],
    queryFn: fetchEducationalContent,
  });

  const [selectedContent, setSelectedContent] = useState<any>(null);

  if (isLoading) {
    return (
      <section id="educacao" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Educação Financeira
            </h2>
            <p className="text-muted-foreground text-lg">Carregando conteúdo educativo...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="educacao" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            Educação Financeira
          </h2>
          <p className="text-muted-foreground text-lg">Aprenda sobre investimentos com nosso conteúdo especializado</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {educationalContent?.map((content: any) => (
            <Card key={content.id} className="card-hover border-border/50 overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={content.imageUrl} 
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-foreground">{content.title}</h3>
                <p className="text-muted-foreground mb-4">{content.description}</p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto gradient-text hover:opacity-80 transition-opacity font-medium"
                      onClick={() => setSelectedContent(content)}
                    >
                      Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl gradient-text">{selectedContent?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <img 
                        src={selectedContent?.imageUrl} 
                        alt={selectedContent?.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="prose prose-invert max-w-none">
                        <p className="text-muted-foreground leading-relaxed text-base">
                          {selectedContent?.content}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                          <h4 className="font-semibold mb-4 gradient-text">Características principais:</h4>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {selectedContent?.category === 'cryptocurrency' && (
                              <>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Moeda digital descentralizada
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Tecnologia blockchain
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Alta volatilidade (risco elevado)
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Potencial de grandes retornos
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Recomendado máximo 5% da carteira
                                </li>
                              </>
                            )}
                            {selectedContent?.category === 'investments' && (
                              <>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Renda fixa: previsibilidade e segurança
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Renda variável: maior potencial de ganhos
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Diversificação reduz riscos
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Escolha baseada no perfil de risco
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Proteção contra inflação
                                </li>
                              </>
                            )}
                            {selectedContent?.category === 'portfolio' && (
                              <>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Redução de riscos através da diversificação
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Balanceamento entre diferentes ativos
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Revisão periódica da carteira
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Alinhamento com objetivos pessoais
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full logo-gradient"></div>
                                  Rebalanceamento trimestral recomendado
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                        
                        <div className="bg-card/50 p-6 rounded-lg border border-border/50">
                          <h4 className="font-semibold mb-4 gradient-text">Rentabilidades Históricas:</h4>
                          <div className="space-y-3 text-sm">
                            {selectedContent?.category === 'cryptocurrency' && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Bitcoin (2023):</span>
                                  <span className="text-green-400 font-semibold">+156%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Ethereum (2023):</span>
                                  <span className="text-green-400 font-semibold">+91%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Volatilidade média:</span>
                                  <span className="text-red-400 font-semibold">±60%</span>
                                </div>
                              </>
                            )}
                            {selectedContent?.category === 'investments' && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">CDB (2023):</span>
                                  <span className="text-green-400 font-semibold">13.2%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">IBOVESPA (2023):</span>
                                  <span className="text-green-400 font-semibold">21.2%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Tesouro IPCA+:</span>
                                  <span className="text-green-400 font-semibold">6.2% + IPCA</span>
                                </div>
                              </>
                            )}
                            {selectedContent?.category === 'portfolio' && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Carteira Conservadora:</span>
                                  <span className="text-green-400 font-semibold">10-12%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Carteira Moderada:</span>
                                  <span className="text-green-400 font-semibold">14-18%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Carteira Agressiva:</span>
                                  <span className="text-green-400 font-semibold">18-25%</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-card/50 to-card/30 p-6 rounded-lg border border-border/50">
                        <h4 className="font-semibold mb-3 gradient-text">Recomendação FinPlanner:</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {selectedContent?.category === 'cryptocurrency' && 
                            "Para iniciantes, recomendamos começar com apenas 2-5% da carteira em criptomoedas, focando em Bitcoin e Ethereum. Estude bastante antes de investir e nunca invista mais do que pode perder."
                          }
                          {selectedContent?.category === 'investments' && 
                            "Uma carteira balanceada deve ter 60-70% em renda fixa para segurança e 30-40% em renda variável para crescimento. Ajuste conforme seu perfil de risco e objetivos."
                          }
                          {selectedContent?.category === 'portfolio' && 
                            "Diversifique entre classes de ativos, setores e geografias. Mantenha uma reserva de emergência e revise sua carteira a cada 3 meses para rebalanceamento."
                          }
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
