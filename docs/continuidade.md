# Continuidade · Fábrica de Conteúdo (atualizado 15/11/2026)

**Para retomar numa sessão nova, peça:**
> "Leia `docs/continuidade.md` e continue a partir dele."

Branch de trabalho: `claude/nifty-albattani-owiail` (ainda não está no `main`).

## Onde estamos
1. Fábrica montada (Fase 1): 9 agentes + Maestro (`.claude/agents/`, `.claude/skills/produzir/`), critérios (`docs/criterios.md`), kit da Apometria (`marcas/apometria-brasil/`), modelo de carrossel (`modelos/remotion/`).
2. Produção de teste "pesadelos recorrentes" (`producoes/2026-11-15-apometria-pesadelos/`): concluída, 8 lâminas. **A responsável não gostou**: linguagem ainda genérica e **visual idêntico ao carrossel anterior**. Não publicar.
3. vidIQ conectado e funcionando (comentários do YouTube, outliers de Instagram/TikTok, palavras-chave). Plano com **150 créditos/mês, 5 por busca**: usar com moderação. Primeira pesquisa salva em `marcas/apometria-brasil/pesquisa/`.
4. Kling: a responsável gerou uma chave (a primeira ficou exposta no chat; pedimos para apagar e gerar outra). A nova deve estar no ambiente como `KLING_API_KEY`. Conferir com `env | grep -c KLING` (sem imprimir o valor) e testar a API antes de qualquer geração.

## O que a responsável pediu (15/11) e ainda NÃO foi feito
Ver também `marcas/apometria-brasil/aprendizados.md`.
- **Juiz de tema (Termômetro)**: julgar se o assunto é interessante/em alta antes de escrever (dados do vidIQ).
- **Linguagem natural de verdade**, usando o vocabulário real do público (pasta `pesquisa/`).
- **Conteúdo autêntico com imagens/vídeos gerados por IA (Kling)** que representem fielmente o processo do astral descrito no texto/narração. O modelo visual atual (foto + faixa verde) **não é mais o padrão**.
- **Juiz de crédito (Crivo)**: aprovar cada comando visual antes de gerar (fidelidade ao texto, viabilidade, necessidade). Gerar imagem primeiro, animar depois.
- **Edição profissional + som** que gere sentimento (apreensão/medo → alívio): agentes Voz (narração), Eco (som), Corte (edição, legendas, motion graphics).
- **Vídeos do terapeuta (Paulo) falando** + cenas geradas como representação. Confirmar se os vídeos da pasta "Terapia" do Drive são dele.
- **Curador**: usar material existente da internet só em temas muito interessantes e com direito de uso.
- **Agentes especialistas** (persona profissional em cada etapa) e **base de conhecimento do Paulo** (agente Mestre).
- **Aperfeiçoamento contínuo**: calibração dos juízes com as decisões dela + métricas dos posts.
- Ela quer **agentes e subagentes de verdade** (equipes com líder). Explicado: no Claude Code não há subagente dentro de subagente; para isso, versão "empresa" na plataforma da Anthropic (Managed Agents), que exige conta de API. Ela preferiu ver a produção primeiro.

## Nova equipe proposta (a construir)
Radar (tendências) · Sonda (dores/objeções) · Mestre (apometria/base do Paulo) · **Termômetro** (juiz do tema) · Faísca · Pena · Lupa · Guardiã · **Visionária** (diretora de arte do astral) · **Crivo** (juiz antes de gerar) · **Prisma** (Kling) · **Curador** · **Voz** · **Eco** · **Corte** · Olho.

## Ferramentas e chaves (ambiente)
| Serviço | Situação |
|---|---|
| vidIQ (conector) | ✅ conectado |
| Google Drive (conector) | ✅ conectado |
| Kling | chave a cadastrar como `KLING_API_KEY` |
| ElevenLabs | `ELEVENLABS_API_KEY` (pendente) |
| Apify | `APIFY_TOKEN` (pendente) |
| YouTube Data API | `YOUTUBE_API_KEY` (opcional, o vidIQ já cobre) |
| Rede | liberar reddit.com, quora.com, api.elevenlabs.io, api.apify.com (api.klingai.com já responde) |

## Avisos
- Chave da integração do estúdio também foi exposta no chat (14/11): lembrar a responsável de revogar em Saúde do sistema.
- Nunca gravar chaves em arquivos do repositório.
