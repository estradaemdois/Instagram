# Continuidade · Fábrica de Conteúdo (atualizado 23/11/2026)

**Para retomar numa sessão nova, peça:**
> "Leia `docs/continuidade.md` e continue a partir dele."

Branch de trabalho: `claude/nifty-albattani-owiail` (ainda não está no `main`).


## ⏭️ Próximo passo imediato (23/11/2026)
**Atualização (23/11, sessão do Kling):** o Kling não abriu na sessão. Lâminas 2 e 3 geradas no vidIQ e aprovadas pelo Olho; 1, 4 e 5 são fotos do Pexels provisórias (ver `producoes/2026-11-23-apometria-prosperidade/imagens/origem.md`). vidIQ ficou com ~13 créditos até 15/12. Lâminas montadas no modelo novo `CarrosselCena` (`final/lamina-1..5.jpg`, legenda e hashtags com #explorer em `final/`). Falta: aprovação da responsável; se ela quiser, refazer 1, 4 e 5 no Kling (sessão nova, `imagens/s2.jpg` como referência) e remontar com `node scripts/montar.mjs`. Depois, enviar ao estúdio só quando ela pedir.

**Carrossel "Prosperidade" (`producoes/2026-11-23-apometria-prosperidade/`)**: roteiro v3 APROVADO (Lupa 8,83 + Guardiã) e comandos visuais aprovados pelo Crivo em `07-prompts-gemini.md`. **Falta gerar as 5 imagens.** ✅ A responsável já autorizou o **Kling** (23/11): usar a skill `kling-ai:kling-ai-generate-image` (text_to_image, 4:5, 2K, 1 imagem por lâmina), seguindo as regras de cobrança do plugin (mostrar resumo e pedir o "pode gerar" antes). Gemini API fica como alternativa.
1. Conferir se a chave existe: `env | grep -c GEMINI_API_KEY` (não imprimir o valor).
2. Gerar as 5 imagens pela API do Gemini (modelo de imagem do Gemini; formato vertical 4:5), usando "ESTILO DA SÉRIE" + COMANDO de cada lâmina; salvar em `imagens/s1.jpg`…`s5.jpg` recortadas para 1080x1350.
3. Olho confere cada imagem contra "Conferir na imagem"; refazer só a que falhar.
4. Moldura monta com o modelo de carrossel. A responsável quer **visual novo** (imagem ocupando a lâmina inteira, texto no espaço vazio da cena; a lâmina 3 tem o texto embaixo). Ajustar o degradê para não virar "faixa verde" igual aos anteriores.
5. Enviar as lâminas e a legenda (está em `04-roteiro.md`).

Se não houver `GEMINI_API_KEY`: a responsável pode autorizar o Kling (conector `kling-ai` já aparece, precisa de autorização em claude.ai/customize/connectors) ou gerar no Gemini do navegador e mandar as imagens.

## Produções até agora
| Pasta | Formato | Situação |
|---|---|---|
| `2026-11-14-apometria-alcoolismo` | Carrossel 7 | Aprovado, rascunho no estúdio |
| `2026-11-15-apometria-pesadelos` | Carrossel 8 | Pronto, mas reprovado no visual/linguagem; não publicar |
| `2026-11-15-apometria-reels-01` | Reels 47 s | Pronto (narração vidIQ, cenas do astral em motion graphics); aguardando opinião |
| `2026-11-23-apometria-prosperidade` | Carrossel 5 | Texto aprovado; montado (5 lâminas); 2 e 3 do vidIQ, 1/4/5 do Pexels; aguardando aprovação |

## Ferramentas (decisão de 23/11)
- **vidIQ: só pesquisa** (comentários, outliers, palavras-chave). ~40 créditos restantes no ciclo até 15/12.
- **Criação de imagens/vídeos: Gemini** (via `GEMINI_API_KEY`) ou Kling (após autorização).

## Onde estamos (histórico de 15/11)
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
