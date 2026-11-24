#!/usr/bin/env python3
"""Montador de posts de viagem (perfil pessoal @guilherme.rodrigues_ofc).

Uso:  python3 montar.py <pasta-da-producao>
Lê <pasta>/post.json e grava as lâminas em <pasta>/final/.

Cada lâmina tem um "layout":
  capa   → foto + nome do lugar gigante + coordenadas + frase
  foto   → foto limpa, só a etiqueta pequena (lugar · data) e o número
  frase  → foto escurecida + frase grande em itálico
  limpa  → foto sem nenhum texto
"""
import json, sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps, ImageEnhance

W, H = 1080, 1350
AQUI = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.join(AQUI, "..", "..", "marcas", "guilherme-rodrigues")


def kit():
    with open(os.path.join(KIT, "identidade.json")) as f:
        return json.load(f)


def fonte(nome, tam):
    return ImageFont.truetype(os.path.join(KIT, "fontes", nome), tam)


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# ---------- tratamento de cor "Trilha" (igual em todas as fotos) ----------
def tratar(img, ajuste=None):
    a = {"brilho": 1.0, "contraste": 1.0, "saturacao": 1.0}
    a.update(ajuste or {})
    img = img.convert("RGB")
    img = ImageEnhance.Brightness(img).enhance(a["brilho"])
    img = ImageEnhance.Contrast(img).enhance(1.06 * a["contraste"])
    img = ImageEnhance.Color(img).enhance(0.86 * a["saturacao"])
    r, g, b = img.split()
    # pretos levemente "lavados" (fade) + sombras puxadas para verde-petróleo
    # e altas luzes levemente quentes
    def curva(c, sombra, luz):
        return c.point(lambda v: int(min(255, max(0, 14 + sombra + v * (226 - sombra + luz) / 255))))
    r = curva(r, -4, 6)
    g = curva(g, 0, 2)
    b = curva(b, 4, -8)
    img = Image.merge("RGB", (r, g, b))
    # vinheta suave
    mask = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(mask)
    mx, my = int(img.width * 0.08), int(img.height * 0.08)
    d.ellipse((-mx, -my, img.width + mx, img.height + my), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(img.width // 6))
    escuro = ImageEnhance.Brightness(img).enhance(0.72)
    return Image.composite(img, escuro, mask)


def recortar(img, foco=(0.5, 0.5), zoom=1.0):
    img = ImageOps.exif_transpose(img)
    alvo = W / H
    iw, ih = img.size
    if iw / ih > alvo:
        ch = ih / zoom
        cw = ch * alvo
    else:
        cw = iw / zoom
        ch = cw / alvo
    cx, cy = foco[0] * iw, foco[1] * ih
    x0 = min(max(cx - cw / 2, 0), iw - cw)
    y0 = min(max(cy - ch / 2, 0), ih - ch)
    return img.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.LANCZOS)


def degrade(img, de=0.45, forca=0.85, topo=False):
    """Escurece de baixo (ou de cima) para dar leitura ao texto."""
    g = Image.new("L", (1, H))
    for y in range(H):
        t = (y / H - de) / (1 - de) if not topo else ((1 - y / H) - de) / (1 - de)
        g.putpixel((0, y), int(255 * forca * max(0, min(1, t)) ** 1.6))
    g = g.resize((W, H))
    preto = Image.new("RGB", (W, H), (8, 14, 13))
    return Image.composite(preto, img, g)


def espaco(d, xy, texto, f, cor, letra=0):
    """Texto com espaçamento entre letras."""
    x, y = xy
    for ch in texto:
        d.text((x, y), ch, font=f, fill=cor)
        x += d.textlength(ch, font=f) + letra
    return x


def largura_esp(d, texto, f, letra):
    return sum(d.textlength(ch, font=f) + letra for ch in texto) - letra


def etiqueta(d, k, texto, pos="baixo", numero=None):
    """Etiqueta pequena em fonte mono: '▲ PETAR · 20.11.26'."""
    f = fonte(k["fontes"]["mono"], 24)
    cor = rgb(k["cores"]["papel"])
    y = H - 74 if pos == "baixo" else 56
    d.rectangle((56, y + 8, 68, y + 20), fill=rgb(k["cores"]["sinal"]))
    espaco(d, (84, y), texto.upper(), f, cor, 3)
    if numero:
        larg = largura_esp(d, numero, f, 3)
        espaco(d, (W - 56 - larg, y), numero, f, cor, 3)


def quebrar(d, texto, f, larg):
    linhas, atual = [], ""
    for p in texto.split():
        t = (atual + " " + p).strip()
        if d.textlength(t, font=f) <= larg:
            atual = t
        else:
            linhas.append(atual)
            atual = p
    linhas.append(atual)
    return linhas


def capa(img, k, l):
    img = degrade(img, 0.38, 0.92)
    d = ImageDraw.Draw(img)
    papel, sinal = rgb(k["cores"]["papel"]), rgb(k["cores"]["sinal"])
    mono = fonte(k["fontes"]["mono"], 24)
    # topo: capítulo + coordenadas
    espaco(d, (56, 56), l.get("capitulo", "").upper(), mono, papel, 3)
    coord = l.get("coordenadas", "")
    espaco(d, (W - 56 - largura_esp(d, coord, mono, 3), 56), coord, mono, papel, 3)
    # título gigante (ajusta o tamanho para caber)
    titulo = l["titulo"].upper()
    tam = 330
    while True:
        ft = fonte(k["fontes"]["titulo"], tam)
        if largura_esp(d, titulo, ft, 4) <= W - 112 or tam < 120:
            break
        tam -= 6
    bb = d.textbbox((0, 0), titulo, font=ft)
    alt = bb[3] - bb[1]
    base = H - 150
    espaco(d, (52, base - alt - bb[1]), titulo, ft, papel, 4)
    # frase em itálico acima do título
    if l.get("frase"):
        fi = fonte(k["fontes"]["italico"], 50)
        y = base - alt - 34 - 60
        d.text((58, y), l["frase"], font=fi, fill=papel)
    # linha + local
    d.rectangle((58, base + 34, 58 + 70, base + 38), fill=sinal)
    espaco(d, (150, base + 22), l.get("local", "").upper(), mono, papel, 3)
    return img


def frase(img, k, l):
    img = ImageEnhance.Brightness(img).enhance(0.62)
    img = degrade(img, 0.3, 0.6)
    d = ImageDraw.Draw(img)
    fi = fonte(k["fontes"]["italico"], l.get("tamanho", 76))
    linhas = quebrar(d, l["frase"], fi, W - 160)
    alt_l = int(fi.size * 1.22)
    y = (H - alt_l * len(linhas)) // 2 - 20
    for ln in linhas:
        d.text((80, y), ln, font=fi, fill=rgb(k["cores"]["papel"]))
        y += alt_l
    d.rectangle((82, y + 30, 82 + 70, y + 34), fill=rgb(k["cores"]["sinal"]))
    return img


def main(pasta):
    k = kit()
    with open(os.path.join(pasta, "post.json")) as f:
        dados = json.load(f)
    for post in dados.get("posts", [dados]):
        montar_post(pasta, k, post)


def montar_post(pasta, k, post):
    saida = os.path.join(pasta, "final", post.get("nome", "post"))
    os.makedirs(saida, exist_ok=True)
    total = len(post["laminas"])
    for i, l in enumerate(post["laminas"], 1):
        foto = Image.open(os.path.join(pasta, "bruto", l["foto"]))
        img = tratar(recortar(foto, l.get("foco", (0.5, 0.5)), l.get("zoom", 1.0)), l.get("ajuste"))
        lay = l.get("layout", "foto")
        if lay == "capa":
            img = capa(img, k, l)
        elif lay == "frase":
            img = frase(img, k, l)
        if lay in ("foto", "frase") and l.get("etiqueta"):
            img = degrade(img, 0.82, 0.55) if lay == "foto" else img
            num = f"{i:02d}/{total:02d}" if total > 1 else None
            etiqueta(ImageDraw.Draw(img), k, l["etiqueta"], numero=num)
        img.save(os.path.join(saida, f"{i:02d}.jpg"), quality=94)
        print("ok", saida, i)


if __name__ == "__main__":
    main(sys.argv[1])
