# Formatos de cada etapa (o que cada agente entrega)

Toda produção mora em `producoes/AAAA-MM-DD-<marca>-<tema>/`. Os arquivos são numerados na ordem em que acontecem:

| Arquivo | Quem escreve | Formato | Conteúdo |
|---|---|---|---|
| `00-pedido.md` | Maestro | Texto | Pedido da responsável, nas palavras dela: marca, tema, formato, pedidos especiais |
| `01-pesquisa.md` | Sonda | Texto | Dores com frases reais e fonte, perguntas, mitos, vocabulário, conceitos, cuidados, fontes |
| `02-pauta.md` | Bússola | Texto | Ângulo, dor de entrada, promessa, formato, estrutura por lâmina, clima visual, chamada, riscos |
| `03-ganchos.md` | Faísca + Lupa | Texto | 10 ganchos (5 padrões) + ranking top 3 da Lupa |
| `04-roteiro.md` | Pena | Texto | Versão N, "o que mudou", lâminas (rótulo/título/texto/chamada), legenda, hashtags |
| `05-critica-lupa.md` | Lupa | Texto | Por versão: 6 notas, justificativas, média, veredito, mudanças pedidas |
| `06-parecer-guardia.md` | Guardiã | Texto | Por versão: APROVADO/VETADO, problemas (regra · onde · trecho · troca), checklist |
| `07-storyboard.json` | Lente | JSON | Imagens (url, foco, zoom, brilho, saturação) e lâminas (textos finais, imagem, tom, topo) |
| `imagens/` | Moldura | JPG 1080x1350 | Fotos já recortadas e tratadas |
| `final/` | Moldura | JPG + TXT | `lamina-N.jpg`, `_grade.jpg`, `legenda.txt`, `hashtags.txt` |
| `08-critica-olho.md` | Olho | Texto | Por rodada: lâmina · OK/AJUSTAR · problema · ação · quem corrige |
| `09-resumo.md` | Maestro | Texto | Resumo, notas finais, voltas, correções da responsável |

## Marcação de texto (vale para roteiro e storyboard)
- `*trecho*` → itálico na cor de destaque da marca. Pontuação logo depois fica colada e na cor normal (`*ciclos*,`).
- ` / ` (barra com espaços) → quebra de linha no título.

## `07-storyboard.json` em detalhe
```json
{
  "marca": "apometria-brasil",          // nome da pasta em marcas/
  "formato": "carrossel",               // carrossel | post (post = 1 lâmina)
  "imagens": [{
    "arquivo": "s1.jpg",                // nome salvo em imagens/
    "url": "https://images.pexels.com/photos/ID/pexels-photo-ID.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "original": "IMG_2122.jpg",         // em vez de url: foto já colocada em imagens/ (ex.: Drive)
    "fonte": "Pexels ID",               // só para controle interno (não vai na legenda)
    "foco": [0.5, 0.45],                // ponto (x, y de 0 a 1) que fica no centro do recorte
    "zoom": 1.0,                        // > 1 aproxima
    "brilho": 1.0, "saturacao": 1.0     // < 1 escurece / tira cor
  }],
  "laminas": [{
    "rotulo": "O QUE É OBSESSÃO",
    "titulo": "Uma influência que / *se instala aos poucos*.",
    "texto": "Texto de apoio…",
    "imagem": "s2.jpg",
    "tom": "escuro",                    // escuro | marca | claro
    "topo": 560,                        // opcional: posição do bloco de texto (px)
    "chamada": "Arraste para o lado  →" // opcional
  }]
}
```
