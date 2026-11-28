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
- 26/11: Reels "Sobre prosperidade" enviado ao estúdio (aguardando aprovação) — 29/11 às 15h · pedido bb9a9aae-570d-4bfd-bac6-fe371a6111c7. Versão comprimida (540p, 3,2 MB) por causa do limite de ~4,5 MB da integração; para qualidade total, trocar o vídeo no pedido pelo final/reels.mp4.

## Depoimentos novos no estúdio (26/11/2026) — 1 a cada 3 dias, print 12h + comentário 12h05
```
2026-11-27 01-relatorios 5ad892f2-11d9-4093-bf55-7abf1af0531d ee41f94b-4924-49d5-9091-ad51c77ad54b
2026-11-30 02-maria f21ec24d-d39c-4066-a622-b006c9a6aea6 31d42030-6294-456a-bd93-d0f0e8062d28
2026-12-03 03-sandra1 b84223a4-6c98-4687-a81f-ae18f70fe862 cbe9c4cd-7ae6-4cca-9894-fd193bd43048
2026-12-06 04-raquel1 da9e04b4-a286-41b5-bd58-4de1a853c8e6 3e502b6f-4c47-4e1a-b4c6-72b728c20341
2026-12-09 05-cibele 3e6b157e-d39d-4a68-836e-7de89762eadf 98cce593-3c30-422f-8dd9-4c02e0d8be5e
2026-12-12 06-ana 7d7fd294-7222-49ea-a33e-61e32600680d 0a5d115d-259a-4224-9ca0-795842b29641
2026-12-15 07-cristina b52f4f66-e71f-41ea-8f76-c421b1dc99ca 357f1977-58ef-48f8-a84a-73919eb52184
2026-12-18 08-daniel 28c767fd-28c5-4d21-82b4-4428ad544917 034090e2-3974-44bb-838b-cf20c2de582f
2026-12-21 09-eliaspaz 48ad45ac-7404-4d2d-8735-4660585a4d6b d2342bd8-5fd2-4712-8b9b-87ab3c51481e
2026-12-24 10-elisandra 84c24d94-1c97-44f7-a41a-9538545a0a35 4a433520-9a4e-4397-b77f-000411a8aeb4
2026-12-27 11-emilia 0deccba4-7e01-4cf3-b5a8-ca911483b332 db5c47a2-572b-41f4-af07-0cacc1f7e0e0
2026-12-30 12-felipe 2115b03c-ec48-43ba-8971-ed5b61cd7e3d 5ba3f003-0be6-4c1e-b6c9-b37d1613460e
2027-01-02 13-graciele 37357173-52f8-4550-89dc-e688c61260bb 0ce758bf-a6e1-4020-8ab5-5f41f3684c58
2027-01-05 14-heloisa 255b860d-62b7-4f15-b6d4-b29714f3069c 7439b6bb-cf7e-4e56-b2cc-21be156bde9b
2027-01-08 15-isabel dfd2faff-9615-417b-abc2-a649dfdf0ec6 88d65031-ddc4-4715-8e83-bf1c06a109ab
2027-01-11 16-mariaduas 86305239-e688-4fb2-a221-c076c4fb2f06 35731489-b5d8-45a0-9fbd-6f568780a44f
2027-01-14 17-mariaf 715931fd-4fb6-42d6-b158-867bc4db9f71 42098062-e794-44e4-9750-18d34723e581
2027-01-17 18-nelia 577ebb06-0566-4146-b352-316b0f9fd655 5a0ab413-95d4-443c-8ab1-970a04f00c6d
2027-01-20 19-nervosa 496a7e53-8f22-47b2-a024-da32bb74f9e3 a30f6b35-ffb5-40fa-8dd0-64b4639c9e5f
2027-01-23 20-raquel2 2de6f59e-1c7d-4657-8525-15f075bcb1c0 7b206ab2-35b6-4539-a3e2-b4877846a597
2027-01-26 21-ridel a2dcbc60-d96f-4747-bec1-41d550276e0d 781ba8c7-19b9-46c9-9db3-7e04ba649fe8
2027-01-29 22-sandra2 d95ad535-3bff-47da-8a35-89ca43321bf6 f44c72fc-784f-46f6-bc48-c351d4dc6bfa
2027-02-01 23-vinicius aa3a8b12-f83a-400b-bd86-8484b394d675 e83749df-76db-4b84-8cc5-ab621f5616ad
```
- Os 10 stories de depoimento antigos (pedidos 1fd8e889/01222462, 468387c9/1afc0c43, 27c65e12/1b8c2359, 3d2c3513/655e16d1, c89992fa/a6c27d07) devem ser EXCLUÍDOS pela responsável (a integração não exclui).
- Story de véspera da magia: 26/11 às 19h.
- 26/11: Reels 'Por que fazer Apometria?' enviado ao estúdio (aguardando aprovação) — 01/12 às 15h. Versão 540p comprimida; arquivo em boa qualidade: producoes/2026-11-26-apometria-paulo-uma-vez/final/reels-final.mp4 (21,5 MB).
- 27/11: story em vídeo de véspera da magia enviado — 01/12 às 19h (véspera do carrossel de 02/12). O story estático de véspera (445a4f1f, 26/11 19h) ficou obsoleto.
- 28/11: carrossel da magia com capa nova (vídeo do plano físico → espiritual) enviado — 28/11 às 18h · pedido fb215eba-8e18-493f-a594-0a180b43b436. 4 stories da magia reenviados para 28/11 (18h10, 18h30, 20h, 21h30). A remarcação pela integração falhou (função integracao_remarcar_pedido não existe no banco — migração 20261119000019 não aplicada). EXCLUIR: carrossel antigo 1b9e6264… e b3592804…, stories antigos da magia de 02/12 (9fcab287, 834439fe, 1959c948, 58a40148), story de suspense 3b30a4a9 (01/12) e 445a4f1f (26/11).
