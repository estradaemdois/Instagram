# Instruções para o Claude · Fábrica de Conteúdo

## Idioma (obrigatório)
Responda **sempre em português do Brasil**: mensagens, documentos, commits e comentários de código.

## Quem conduz
A responsável (Andressa) não é desenvolvedora. Explique em linguagem simples e direta.
Nunca peça senhas, tokens ou chaves pelo chat. Se aparecer um segredo no chat, avise que ficou exposto.

## Como trabalhar aqui
- ⛔ **A fábrica de vários agentes (Maestro, Sonda, Lupa etc.) foi CANCELADA pela responsável em 23/11/2026.** Não usar a skill `produzir` nem os agentes de `.claude/agents/` (ficam só como arquivo).
- **Modo de trabalho atual (o de antes):** o Claude escreve direto seguindo o kit da marca, usa fotos reais do Pexels (escuro → claro em temas difíceis), monta no modelo `modelos/remotion` (Apometria Brasil: composição `CarrosselAB`, estilo do feed do perfil, desde 24/11/2026; **imagens no padrão de referência dos implantes astrais, geradas no Gemini pela responsável a partir dos comandos do Claude — ver topo de `marcas/apometria-brasil/marca.md`**; outras marcas: `Carrossel`) e mostra para a responsável aprovar.
- Antes de criar qualquer coisa para uma marca, leia o kit em `marcas/<marca>/` (principalmente `regras.md` e `aprendizados.md`).
- Toda correção da responsável vira uma linha em `marcas/<marca>/aprendizados.md` (e em `regras.md`, se for proibição).
- Critérios dos juízes: `docs/criterios.md`. Formatos dos arquivos: `docs/formatos.md`. Arquitetura: `docs/arquitetura.md`.

## Ambiente
- Renderização em `modelos/remotion/` (Remotion 4.0.242). Fontes ficam no kit da marca (o Chrome do Remotion não carrega Google Fonts neste ambiente).
- Downloads do Pexels precisam de `User-Agent` de navegador. `www.pexels.com` pode estar bloqueado: use `WebSearch` com `allowed_domains: ["pexels.com"]` e baixe de `images.pexels.com`.
- Publicação: fica com o estúdio (repositório `estudioemdois/estudioemdois`, script `scripts/enviar-pedido.mjs`, chave `ESTUDIO_CHAVE_INTEGRACAO`). Só suba quando a responsável pedir.
