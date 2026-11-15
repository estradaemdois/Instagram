# Arquitetura da Fábrica de Conteúdo

## Ideia central
Em vez de um "super prompt", uma **linha de montagem** com especialistas. Cada um faz uma coisa, deixa um arquivo e passa o bastão.
**Juízes separados** avaliam o trabalho dos criadores sem ver o raciocínio deles, só o resultado, e devolvem com instruções concretas.
Duas **aprovações humanas** acontecem nos pontos que importam: antes de gastar com imagem/vídeo e antes de publicar.

## Três camadas (o que torna reaproveitável)

| Camada | O que é | Muda por negócio? |
|---|---|---|
| **Kit da marca** (`marcas/<marca>/`) | Identidade visual, voz, regras proibidas, público, aprendizados, exemplos, fontes, logo | **Sim**: um kit por perfil |
| **Agentes** (`.claude/agents/`, `docs/criterios.md`) | Quem faz o quê, como é julgado, o que entrega | Não |
| **Motor** (`.claude/skills/produzir/`, `modelos/`) | Ordem das etapas, voltas, aprovações, renderização | Não |

Um negócio novo = um kit novo. Os agentes e o motor são os mesmos.

## Decisões e porquês
1. **Começar no Claude Code, sem infraestrutura nova.** Os agentes são subagentes e o Maestro é uma skill. Afinamos instruções e critérios com custo baixo antes de automatizar.
2. **Arquivos numerados por etapa.** Dá para ver exatamente quem fez o quê, retomar de qualquer ponto e aprender com o histórico.
3. **Juízes com regra de parada.** Lupa: nota ≥ 8,5 e nenhum critério < 7, até 3 voltas. Guardiã: veto item a item. Olho: até 2 voltas. Evita loop infinito e gasto à toa.
4. **Modelos por tarefa.** Criação e julgamento: Opus (mais capaz). Pesquisa e montagem: Sonnet (mais barato, suficiente).
5. **Imagem real antes de vídeo gerado.** Banco de imagens/Drive + modelo próprio já entregam a qualidade da marca. Vídeo por IA (caro por segundo) entra depois, com o crítico visual protegendo o gasto.
6. **Aprendizado contínuo.** Cada correção da responsável vira regra ou aprendizado no kit, e todos os agentes leem antes de criar.

## Próximas fases

| Fase | O que entra | Observação |
|---|---|---|
| **1 · agora** | Carrossel e post, ponta a ponta, com os 10 agentes | Em uso |
| **2 · Reels** | Lente gera roteiro de cenas 9:16; Moldura usa o modelo de Reels (frases centralizadas, piano, −14 LUFS); Olho confere quadros-chave | Modelo de Reels já existe em `estudioemdois/docs/10-projeto-claude/modelo-reel-remotion/`: trazer para `modelos/` e deixar genérico |
| **3 · Analista de desempenho** | Novo agente lê os números de cada post (estúdio/Meta) e mantém um **banco de ganchos** com o que funciona por marca; a Lupa passa a julgar com base em dados | Precisa das métricas do estúdio |
| **4 · Voz e vídeo por IA** | Narração (ElevenLabs), cenas geradas (Kling/Runway/Fal) com áudio guiando a duração, crítico visual em quadros | Custo por segundo: só depois da aprovação 1 |
| **5 · Automação** | O mesmo fluxo rodando sozinho (Claude API / Managed Agents) a partir de uma fila de temas; aprovações numa tela "Pautas" do estúdio | Quando os critérios estiverem estáveis |
