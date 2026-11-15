# Fábrica de Conteúdo · Instagram

Sistema de agentes que transforma **um tema** em **uma peça pronta para publicar** (lâminas + legenda + hashtags),
com pesquisa real, juízes que avaliam o trabalho uns dos outros e duas aprovações da responsável.
A publicação em si fica com o **estúdio** (estudioemdois), que agenda e posta.

Começamos pela **Apometria Brasil**. Para outro negócio, basta criar o kit da marca (veja `docs/como-adicionar-marca.md`).

## A equipe

| | Agente | Função | Entrega |
|---|---|---|---|
| 🎼 | **Maestro** | Coordena tudo e conversa com você | `00-pedido.md`, `09-resumo.md` |
| 🔎 | **Sonda** | Pesquisa o que o público real sente, pergunta e diz | `01-pesquisa.md` |
| 🧭 | **Bússola** | Define ângulo, formato, estrutura e clima | `02-pauta.md` |
| ✨ | **Faísca** | Cria 10 ganchos em 5 padrões | `03-ganchos.md` |
| ✒️ | **Pena** | Escreve lâminas, legenda e hashtags | `04-roteiro.md` |
| 🔍 | **Lupa** · juíza | Dá nota ao texto (retenção e clareza) e escolhe o gancho | `05-critica-lupa.md` |
| 🛡️ | **Guardiã** · juíza | Veta o que quebra regras da marca ou da Meta | `06-parecer-guardia.md` |
| 🎨 | **Lente** | Escolhe e enquadra as imagens, monta o storyboard | `07-storyboard.json` |
| 🖼️ | **Moldura** | Monta as lâminas finais no modelo da marca | `final/` |
| 👁️ | **Olho** · juiz | Confere cada lâmina como quem vê no celular | `08-critica-olho.md` |

## O fluxo

```
Você: "carrossel sobre X para a apometria"
   │
 Maestro ─► Sonda ─► Bússola ─► Faísca ─► Lupa (escolhe gancho)
                                              │
                    ┌──── Pena ◄── volta (até 3x) ──┐
                    └──► Lupa ──► Guardiã ──────────┘
                                   │
                    ✋ APROVAÇÃO 1: você aprova o roteiro (antes de gastar com imagem)
                                   │
                 Lente ─► Moldura ─► Olho (volta até 2x)
                                   │
                    ✋ APROVAÇÃO 2: você aprova as lâminas
                                   │
             final/ pronto  ─►  (se pedir) rascunho no estúdio
```

## Como usar
Numa sessão do Claude Code com este repositório, peça em linguagem normal, por exemplo:
> "Produzir carrossel para a apometria sobre pesadelos recorrentes."

O Maestro avisa em uma linha a cada etapa e para nas duas aprovações. Tudo fica salvo em `producoes/<data>-<marca>-<tema>/`.

## Pastas

| Pasta | O que tem |
|---|---|
| `.claude/agents/` | Um arquivo por agente: quem é, o que lê, como trabalha, o que entrega |
| `.claude/skills/produzir/` | O roteiro do Maestro |
| `marcas/<marca>/` | **Kit da marca**: identidade, voz, regras, público, aprendizados, exemplos, fontes, logo |
| `marcas/_modelo/` | Kit em branco para um negócio novo |
| `docs/` | Arquitetura, critérios dos juízes, formatos dos arquivos, como adicionar marca, **continuidade** |
| `modelos/remotion/` | Modelo visual (carrossel/post) que lê o kit da marca + o storyboard |
| `producoes/` | Uma pasta por peça, com todas as etapas (o histórico da fábrica) |
