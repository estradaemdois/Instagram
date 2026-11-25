# Continuidade · Fábrica de Conteúdo (atualizado 23/11/2026)

> ⛔ **23/11/2026: a responsável CANCELOU o sistema de vários agentes.** Voltar ao modo direto (o Claude escreve seguindo o kit, fotos reais do Pexels, modelo `Carrossel` igual ao do alcoolismo). O resto deste documento é histórico.


**Para retomar numa sessão nova, peça:**
> "Leia `docs/continuidade.md` e continue a partir dele."

Branch de trabalho: `claude/nifty-albattani-owiail` (ainda não está no `main`).


## ⏭️ Próximo passo imediato (23/11/2026)
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
| `2026-11-23-apometria-prosperidade` | Carrossel 5 | Texto aprovado; faltam imagens (Gemini) |

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


## Enviados ao estúdio em 26/11/2026 (aguardando aprovação)
- Carrossel "Um trabalho de magia perde a força sozinho?" (6 lâminas, legenda técnica) — 02/12 às 15h · pedido b3592804-130e-4ee8-b7c0-573d9d3b017d
- 4 stories da magia — 02/12 às 15h10, 15h30, 18h e 21h · pedidos 9fcab287…, 834439fe…, 1959c948…, 58a40148…
- Carrossel "Chips e implantes astrais" (capa em vídeo do Gemini + 5 lâminas, legenda técnica ajustada) — 28/11 às 15h · pedido 8c21a862-5bb9-486a-99d8-b1580888f669
- 4 stories dos implantes — 28/11 às 15h10, 15h30, 18h e 21h · pedidos 53723dfb…, 93fb9c31…, a3e4ff6a…, 232b86a7…
- Atenção: a integração do estúdio (Vercel) recusa envios acima de ~4,5 MB (erro 413). Comprimir vídeo (crf 27) e JPG (qualidade 82) antes de enviar. Reels de 25 s (15–17 MB) precisam ser comprimidos para caber.
- 26/11: carrossel da magia substituído — NOVO pedido 1b9e6264-123a-4d0e-9f48-5c29e898de21 (2 vídeos do Gemini + 4 fotos, última lâmina "Identificar, desfazer e proteger"), 02/12 às 15h. O pedido ANTIGO b3592804… (só fotos) deve ser excluído pela responsável. Stories da magia (9fcab287…, 834439fe…, 1959c948…, 58a40148…) continuam valendo.
- 25/11: 10 stories de depoimento enviados (aguardando aprovação), print às 12h e comentário às 12h05 — 26/11 (dep. 1), 29/11 (2), 01/12 (3), 03/12 (4), 05/12 (5). Pedidos 1fd8e889/01222462, 468387c9/1afc0c43, 27c65e12/1b8c2359, 3d2c3513/655e16d1, c89992fa/a6c27d07.
- Reels do Paulo "Sobre prosperidade": sem cortes, 1,1x, moldura + símbolo, 85 s · producoes/2026-11-26-apometria-paulo-prosperidade/final/reels.mp4 (ainda não enviado ao estúdio).
