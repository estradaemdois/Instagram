# Guilherme Rodrigues · @guilherme.rodrigues_ofc

Perfil pessoal de viagem e aventura. Bio: "Caçando lugares que parecem mentira · Histórias escondidas pelo Brasil · A aventura começa onde o GPS termina".

## Conceito: "Lugares que parecem mentira"
Cada lugar vira um **capítulo** numerado (Capítulo 01 = Petar). O perfil funciona como um diário de campo: foto real, tratamento de cor único e uma tipografia pequena e técnica (coordenadas, data, número da lâmina) que lembra GPS e caderneta de expedição.

## Grade: cada lugar ocupa uma linha de 3 posts
| Esquerda | Meio | Direita |
|---|---|---|
| **Carrossel solo**: só o Guilherme sozinho (sem casal) + paisagens fortes intercaladas. Capa com o nome do lugar gigante | **Frase**: foto de paisagem escurecida + frase em itálico (ou foto limpa) | **Carrossel do grupo**: fotos do grupo grande + paisagens. Capa com título próprio (ex.: "A TROPA"), texto no alto se o grupo estiver embaixo |

Como o Instagram põe o post mais novo à esquerda, **publique na ordem: grupo → frase → solo**.
Reels entram fora desse ritmo.

## Cores
| Nome | Cor | Uso |
|---|---|---|
| Mata | `#14231F` | sombras, degradês, fundo |
| Papel | `#F3EEE4` | todo texto |
| Sinal | `#E8742C` | só detalhes: quadradinho da etiqueta e traço sob o título (lembra o laranja das fitas e do capacete) |
| Pedra | `#8C8577` | apoio (pouco uso) |

## Tipografia
- **Título do lugar:** Anton, caixa alta, gigante (ocupa a largura).
- **Frase:** Playfair Display itálico.
- **Etiquetas técnicas:** JetBrains Mono, caixa alta, espaçada (capítulo, coordenadas, lugar · data, 02/10).
- Fontes em `fontes/`.

## Tratamento de cor "Trilha" (igual em todas as fotos)
Saturação um pouco menor (86%), pretos levemente lavados, sombras puxadas para verde-petróleo, luzes levemente quentes e vinheta suave. É isso que deixa a grade uniforme mesmo com fotos de luzes diferentes (caverna escura, mata ao sol, céu nublado).

## Formato
Sempre 1080x1350 (4:5). Fotos verticais 9:16 são recortadas escolhendo o ponto de foco.

## Como montar
`python3 modelos/foto-viagem/montar.py producoes/<pasta>` lê o `post.json` da pasta e grava em `final/`. Layouts: `capa`, `foto`, `frase`, `limpa`.

## Voz das legendas
Primeira pessoa, tom de quem descobriu um segredo e quer contar. Temas: lugares inacreditáveis, trilha, natureza, a sensação de estar lá.
- Gancho com imagem forte e específica do lugar ("Existe um mundo debaixo do mundo").
- Detalhes concretos que só quem foi sabe (cor da água, luz entrando na rocha, rio cor de chá) e 1 curiosidade real do lugar.
- Pergunta que gere comentário (número da foto preferida, marcar quem estava, quem levaria).
- Proibido: frases genéricas de viagem e o clichê "onde o GPS termina".
