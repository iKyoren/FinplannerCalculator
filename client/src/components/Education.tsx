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
                      className="p-0 h-auto text-primary hover:text-secondary transition-colors font-medium"
                      onClick={() => setSelectedContent(content)}
                    >
                      Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{selectedContent?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img 
                        src={selectedContent?.imageUrl} 
                        alt={selectedContent?.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <p className="text-muted-foreground leading-relaxed">
                        {selectedContent?.content}
                      </p>
                      <div className="bg-card/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Características principais:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {selectedContent?.category === 'cryptocurrency' && (
                            <>
                              <li>• Moeda digital descentralizada</li>
                              <li>• Tecnologia blockchain</li>
                              <li>• Alta volatilidade</li>
                              <li>• Potencial de grandes retornos</li>
                            </>
                          )}
                          {selectedContent?.category === 'investments' && (
                            <>
                              <li>• Renda fixa: previsibilidade e segurança</li>
                              <li>• Renda variável: maior potencial de ganhos</li>
                              <li>• Diversificação reduz riscos</li>
                              <li>• Escolha baseada no perfil de risco</li>
                            </>
                          )}
                          {selectedContent?.category === 'portfolio' && (
                            <>
                              <li>• Redução de riscos através da diversificação</li>
                              <li>• Balanceamento entre diferentes ativos</li>
                              <li>• Revisão periódica da carteira</li>
                              <li>• Alinhamento com objetivos pessoais</li>
                            </>
                          )}
                        </ul>
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
