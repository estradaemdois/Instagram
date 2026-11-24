#!/usr/bin/env python3
"""Animações técnicas do post "Gêiseres del Tatio".

Uso: FUNDO=<foto> python3 motion_tatio.py <saida> [ciclo erupcao jefe numeros]
"""
import math, os, random, sys
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar as M
import motion_cavernas as C
from motion_cavernas import (W, H, FPS, K, MATA, PAPEL, SINAL, PEDRA, AGUA, ROCHA, ROCHA2,
                             INTER, INTER_R, f, ease, estratos, salvar)

TOPO = "GÊISERES DEL TATIO · ATACAMA"
MAGMA = (196, 84, 40)
VAPOR = (235, 232, 226)
FONTE = "Fonte: Munoz-Saez et al. · UC Berkeley/USGS"


def cab(d, passo, total, titulo, texto):
    mono = f(K["fontes"]["mono"], 24)
    M.espaco(d, (56, 56), TOPO, mono, PAPEL, 3)
    num = f"{passo:02d}/{total:02d}"
    M.espaco(d, (W - 56 - M.largura_esp(d, num, mono, 3), 56), num, mono, PAPEL, 3)
    d.text((56, 112), titulo.upper(), font=f(K["fontes"]["titulo"], 96), fill=SINAL)
    fi = f(INTER, 38); y = 240
    for ln in M.quebrar(d, texto, fi, W - 112):
        d.text((56, y), ln, font=fi, fill=PAPEL); y += 50


def rod(d, txt):
    C.rodape(d, txt)


def nuvem_vapor(img, cx, base, altura, larg, alfa, seed, t):
    """Coluna de vapor macia (partículas desfocadas)."""
    cam = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dc = ImageDraw.Draw(cam)
    rnd = random.Random(seed)
    for k in range(70):
        p = (k / 70 + t * 0.25 + rnd.random() * 0.05) % 1
        y = base - p * altura
        x = cx + (rnd.random() - 0.5) * larg * (0.3 + p) + 18 * math.sin(t * 1.5 + k)
        r = 10 + 46 * p
        a = int(150 * alfa * (1 - p) ** 0.8)
        dc.ellipse((x - r, y - r, x + r, y + r), fill=VAPOR + (a,))
    cam = cam.filter(ImageFilter.GaussianBlur(10))
    img.paste(cam, (0, 0), cam)


# ---------- 1. Sistema hidrotermal ----------
def ciclo(saida):
    n = FPS * 9
    def quadro(i):
        t = i / FPS
        img = Image.new("RGB", (W, H), MATA); d = ImageDraw.Draw(img)
        cab(d, 1, 3, "O sistema", "Em El Tatio, água de origem meteórica infiltra a leste, em maior altitude, desce por falhas, é aquecida por calor magmático e volta à superfície no campo.")
        # relevo: planície dos gêiseres à esquerda, cordilheira à direita
        sup = [(0, 640), (380, 640), (560, 600), (760, 520), (900, 470), (W, 450)]
        d.polygon(sup + [(W, 1260), (0, 1260)], fill=(92, 74, 62))
        for yy in range(700, 1260, 42):
            d.line([(0, yy), (W, yy - 50)], fill=(102, 84, 70), width=2)
        # neve nos picos
        d.polygon([(860, 482), (900, 470), (W, 450), (W, 470), (930, 492)], fill=PAPEL)
        # câmara magmática
        g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dg = ImageDraw.Draw(g)
        pul = 0.85 + 0.15 * math.sin(t * 2)
        dg.ellipse((300, 1120, 820, 1340), fill=MAGMA + (int(230 * pul),))
        g = g.filter(ImageFilter.GaussianBlur(22)); img.paste(g, (0, 0), g)
        # reservatório
        d.ellipse((140, 900, 560, 1020), fill=(60, 96, 110))
        # falhas
        for fx in (820, 930):
            d.line([(fx, 520), (fx - 60, 760), (fx - 120, 1000)], fill=(40, 32, 28), width=6)
        # fluxo: recarga (azul) descendo pelas falhas → reservatório → subida (laranja)
        rota_desce = [(880, 500), (830, 720), (760, 940), (560, 980)]
        rota_sobe = [(330, 930), (300, 800), (260, 660), (240, 640)]
        def fluxo(pts, off, cor, w):
            seg = []
            for a, b in zip(pts, pts[1:]):
                L = math.dist(a, b); s = max(2, int(L / 6))
                seg += [(a[0] + (b[0] - a[0]) * k / s, a[1] + (b[1] - a[1]) * k / s) for k in range(s)]
            for k in range(len(seg) - 1):
                if ((k + off) // 4) % 3 != 2:
                    d.line([seg[k], seg[k + 1]], fill=cor, width=w)
        off = int(t * 18)
        fluxo(rota_desce, -off, AGUA, 7)
        fluxo(rota_sobe, -off, SINAL, 7)
        # gêiseres + vapor
        for gx in (180, 250, 320):
            d.ellipse((gx - 12, 634, gx + 12, 646), fill=(30, 26, 24))
        for k, gx in enumerate((180, 250, 320)):
            nuvem_vapor(img, gx, 630, 170, 60, 0.9, k, t + k)
        d = ImageDraw.Draw(img)
        mono = f(K["fontes"]["mono"], 22)
        def rot(txt, x, y, cor=PAPEL): M.espaco(d, (x, y), txt, mono, cor, 3)
        rot("CAMPO DE GÊISERES", 40, 670)
        rot("RECARGA · A LESTE, MAIS ALTO", 520, 420, AGUA)
        rot("FALHAS", 900, 640)
        rot("RESERVATÓRIO >200 °C", 160, 1040, SINAL)
        rot("CALOR MAGMÁTICO", 420, 1190, VAPOR)
        rod(d, FONTE + " (2018)")
        return img
    salvar(quadro, n, saida)


# ---------- 2. Mecanismo da erupção ----------
def erupcao(saida):
    n = FPS * 10
    CX, TOP, BOT = 540, 640, 1220

    def quadro(i):
        t = i / FPS
        img = Image.new("RGB", (W, H), MATA); d = ImageDraw.Draw(img)
        cab(d, 2, 3, "A erupção", "Mecanismo geral dos gêiseres: a água acima pressiona a de baixo, que passa do ponto de ebulição sem ferver. Quando a pressão cai, vira vapor de uma vez.")
        estratos(d, 0, TOP, W, BOT, seed=21)
        # conduto com estreitamento
        cond = [(CX - 26, TOP), (CX - 22, 760), (CX - 10, 800), (CX - 34, 860), (CX - 70, 960), (CX - 110, 1100), (CX - 90, 1200),
                (CX + 90, 1200), (CX + 110, 1100), (CX + 70, 960), (CX + 34, 860), (CX + 10, 800), (CX + 22, 760), (CX + 26, TOP)]
        d.polygon(cond, fill=(14, 22, 20))
        fase = (t % 10)
        # aquecimento: cor da água vai de azul a laranja; bolhas
        aq = ease(fase / 6)
        cor = tuple(int(AGUA[j] * (1 - aq) + SINAL[j] * aq) for j in range(3))
        nivel = TOP + 10 if fase < 6.5 else TOP + 10 + 400 * ease((fase - 6.5) / 1.5)
        inner = [(x * 0.9 + CX * 0.1, max(y, nivel)) for x, y in cond]
        d.polygon(inner, fill=cor)
        rnd = random.Random(int(t * 10))
        nb = int(30 * aq)
        for _ in range(nb):
            by = rnd.uniform(max(nivel, 900), 1180); bx = CX + rnd.uniform(-60, 60) * (by - 760) / 440
            d.ellipse((bx - 5, by - 5, bx + 5, by + 5), outline=PAPEL, width=2)
        # erupção
        if 6.2 < fase < 9.2:
            e = ease((fase - 6.2) / 0.6) * (1 - ease((fase - 8.4) / 0.8))
            jet = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dj = ImageDraw.Draw(jet)
            alt = 170 * e
            dj.polygon([(CX - 16, TOP), (CX + 16, TOP), (CX + 60, TOP - alt), (CX - 60, TOP - alt)], fill=VAPOR + (int(230 * e),))
            for k in range(30):
                yy = TOP - rnd.uniform(0, alt); xx = CX + rnd.uniform(-1, 1) * (20 + (TOP - yy) * 0.25)
                dj.ellipse((xx - 14, yy - 14, xx + 14, yy + 14), fill=VAPOR + (int(180 * e),))
            jet = jet.filter(ImageFilter.GaussianBlur(4)); img.paste(jet, (0, 0), jet)
            d = ImageDraw.Draw(img)
        nuvem_vapor(img, CX, TOP, 150, 50, 0.5, 3, t); d = ImageDraw.Draw(img)
        mono = f(K["fontes"]["mono"], 22)
        def rot(txt, x, y, cor=PAPEL): M.espaco(d, (x, y), txt, mono, cor, 3)
        rot("ESTREITAMENTO", CX + 60, 790)
        rot("ÁGUA SUPERAQUECIDA", CX + 130, 1060, SINAL)
        if 6.2 < fase < 9.2:
            rot("QUEDA DE PRESSÃO: VAPOR", 640, 560, VAPOR)
        fs = f(INTER_R, 28)
        d.text((56, 1190), "A 4.300 m, a água ferve a cerca de 86 °C.", font=fs, fill=PAPEL)
        rod(d, "Fontes: NPS Yellowstone · Munoz-Saez et al.")
        return img
    salvar(quadro, n, saida)


# ---------- 3. El Jefe: 132 s ----------
def jefe(saida):
    n = FPS * 9
    def quadro(i):
        t = i / FPS
        img = Image.new("RGB", (W, H), MATA); d = ImageDraw.Draw(img)
        cab(d, 3, 3, "El Jefe", "Um dos gêiseres mais regulares já medidos: em 2012, entrou em erupção a cada 132 segundos (±2 s) durante seis dias.")
        # relógio: 132 s comprimidos em 7,5 s de animação
        s = min(132, 132 * t / 7.5)
        cx, cy, r = 540, 860, 250
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=(60, 72, 68), width=18)
        ang = -90 + 360 * s / 132
        d.arc((cx - r, cy - r, cx + r, cy + r), -90, ang, fill=SINAL, width=18)
        fn = f(K["fontes"]["titulo"], 150)
        txt = f"{int(s):d} s"
        w = d.textlength(txt, font=fn)
        d.text((cx - w / 2, cy - 100), txt, font=fn, fill=PAPEL)
        mono = f(K["fontes"]["mono"], 24)
        fasea = "RECARGA E AQUECIMENTO" if s < 110 else "ERUPÇÃO"
        w2 = M.largura_esp(d, fasea, mono, 3)
        M.espaco(d, (cx - w2 / 2, cy + 80), fasea, mono, SINAL if s >= 110 else PAPEL, 3)
        if s >= 110:
            nuvem_vapor(img, cx, cy - r - 10, 200, 70, ease((s - 110) / 10), 5, t); d = ImageDraw.Draw(img)
        fs = f(INTER_R, 28)
        y = 1160
        for ln in M.quebrar(d, "Bolsões laterais no conduto acumulam vapor e liberam a erupção quando enchem: a chamada “armadilha de bolhas”.", fs, W - 112):
            d.text((56, y), ln, font=fs, fill=PAPEL); y += 38
        rod(d, FONTE + " (2015)")
        return img
    salvar(quadro, n, saida)


# ---------- 4. Números ----------
def numeros(saida, fundo):
    n = FPS * 7
    bg = M.tratar(M.recortar(Image.open(fundo), (0.5, 0.5)))
    bg = Image.eval(bg, lambda v: int(v * 0.40)).filter(ImageFilter.GaussianBlur(3))
    itens = [(4300, "~{:d} m", "de altitude, nos Andes do Atacama"),
             (80, "~{:d}", "gêiseres ativos"),
             (86, "{:d} °C", "ponto de ebulição da água ali"),
             (170, "120–{:d}", "MW de calor liberado pelo sistema"),
             (3, "{:d}º", "maior campo de gêiseres do mundo")]

    def quadro(i):
        t = i / FPS
        img = bg.copy(); d = ImageDraw.Draw(img)
        mono = f(K["fontes"]["mono"], 24)
        M.espaco(d, (56, 56), TOPO, mono, PAPEL, 3)
        d.text((56, 112), "EL TATIO EM NÚMEROS", font=f(K["fontes"]["titulo"], 96), fill=SINAL)
        y = 300
        for k, (val, fmt, rot) in enumerate(itens):
            a = ease((t - 0.3 - k * 0.45) / 1.4)
            v = int(round(val * a)) if a < 1 else val
            txt = fmt.format(v)
            if val == 4300: txt = txt.replace("4300", "4.300")
            fn = f(K["fontes"]["titulo"], 112)
            cor = tuple(int(c * min(1, a * 2)) for c in PAPEL)
            d.text((56, y), txt, font=fn, fill=cor)
            fr = f(INTER, 30)
            d.text((56 + d.textlength("~4.300 m", font=fn) + 30, y + 50), rot, font=fr, fill=cor)
            d.line([(56, y + 175), (W - 56, y + 175)], fill=tuple(int(c * 0.35) for c in PAPEL), width=1)
            y += 190
        rod(d, "Fontes: Munoz-Saez et al. 2018 · Wikipedia")
        return img
    salvar(quadro, n, saida)


if __name__ == "__main__":
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    q = sys.argv[2:] or ["ciclo", "erupcao", "jefe", "numeros"]
    if "ciclo" in q: ciclo(os.path.join(out, "t1-ciclo.mp4"))
    if "erupcao" in q: erupcao(os.path.join(out, "t2-erupcao.mp4"))
    if "jefe" in q: jefe(os.path.join(out, "t3-jefe.mp4"))
    if "numeros" in q: numeros(os.path.join(out, "t4-numeros.mp4"), os.environ["FUNDO"])
