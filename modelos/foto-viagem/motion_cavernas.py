#!/usr/bin/env python3
"""Animações (motion graphics) do post "Como nasce uma caverna".

Uso: python3 motion_cavernas.py <pasta-de-saida> [m1 m2 m3 m4]
Gera MP4 1080x1350 no estilo do kit (fundo mata, traço papel, detalhe laranja).
"""
import math, os, random, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import montar as M

W, H, FPS = 1080, 1350, 30
K = M.kit()
MATA = M.rgb(K["cores"]["mata"]); PAPEL = M.rgb(K["cores"]["papel"])
SINAL = M.rgb(K["cores"]["sinal"]); PEDRA = M.rgb(K["cores"]["pedra"])
AGUA = (120, 190, 200); ROCHA = (58, 62, 58); ROCHA2 = (74, 78, 72); SOLO = (38, 66, 46)
INTER = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
INTER_R = "/usr/share/fonts/opentype/inter/Inter-Regular.otf"


def f(nome, t):
    return ImageFont.truetype(nome, t) if nome.startswith("/") else M.fonte(nome, t)


def ease(x):
    x = max(0, min(1, x)); return x * x * (3 - 2 * x)


def cabecalho(d, passo, total, titulo, texto, alfa=1.0):
    mono = f(K["fontes"]["mono"], 24)
    M.espaco(d, (56, 56), "COMO NASCE UMA CAVERNA", mono, PAPEL, 3)
    num = f"{passo:02d}/{total:02d}"
    M.espaco(d, (W - 56 - M.largura_esp(d, num, mono, 3), 56), num, mono, PAPEL, 3)
    ft = f(K["fontes"]["titulo"], 96)
    d.text((56, 112), titulo.upper(), font=ft, fill=SINAL)
    fi = f(INTER, 38)
    y = 240
    for ln in M.quebrar(d, texto, fi, W - 112):
        d.text((56, y), ln, font=fi, fill=PAPEL); y += 50
    return y


def rodape(d, txt):
    mono = f(K["fontes"]["mono"], 22)
    d.rectangle((56, H - 66, 68, H - 54), fill=SINAL)
    M.espaco(d, (84, H - 74), txt.upper(), mono, PAPEL, 3)


def estratos(d, x0, y0, x1, y1, seed=3):
    rnd = random.Random(seed)
    d.rectangle((x0, y0, x1, y1), fill=ROCHA)
    y = y0 + 30
    while y < y1:
        pts = [(x, y + 6 * math.sin(x / 90 + y)) for x in range(x0, x1 + 1, 30)]
        d.line(pts, fill=ROCHA2, width=3); y += rnd.randint(40, 70)


def salvar(frames_fn, n, saida):
    tmp = tempfile.mkdtemp()
    for i in range(n):
        frames_fn(i).save(os.path.join(tmp, f"f{i:04d}.png"))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", os.path.join(tmp, "f%04d.png"),
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart", saida], check=True)
    print("ok", saida)


# ---------- M1: chuva + CO2 do solo = ácido carbônico ----------
def m1(saida):
    n = FPS * 8; rnd = random.Random(1)
    gotas = [(rnd.randint(120, 960), rnd.uniform(0, 1)) for _ in range(46)]
    bolhas = [(rnd.randint(100, 980), rnd.uniform(0, 1)) for _ in range(11)]
    fr = [(260, 0), (520, 0), (800, 0)]
    TOP, SOLO_Y, ROCHA_Y = 470, 700, 840

    def quadro(i):
        t = i / FPS
        img = Image.new("RGB", (W, H), MATA); d = ImageDraw.Draw(img)
        cabecalho(d, 1, 3, "A receita", "A chuva atravessa o solo da mata, absorve gás carbônico e vira um ácido fraco.")
        # nuvem
        for cx, r in ((330, 60), (400, 80), (480, 62), (560, 50)):
            d.ellipse((cx - r, TOP + 10 - r // 2, cx + r, TOP + 10 + r), fill=(90, 100, 96))
        # mata (copas) + solo
        d.rectangle((0, SOLO_Y, W, ROCHA_Y), fill=SOLO)
        for x in range(30, W, 95):
            d.ellipse((x - 46, SOLO_Y - 70, x + 46, SOLO_Y + 10), fill=(46, 92, 60))
            d.rectangle((x - 5, SOLO_Y - 10, x + 5, SOLO_Y + 30), fill=(60, 45, 30))
        estratos(d, 0, ROCHA_Y, W, 1230)
        for fx, _ in fr:
            d.line([(fx, ROCHA_Y), (fx + 20, ROCHA_Y + 130), (fx - 10, ROCHA_Y + 260), (fx + 15, 1230)], fill=MATA, width=7)
        mono = f(K["fontes"]["mono"], 22)
        M.espaco(d, (40, SOLO_Y + 60), "SOLO DA MATA", mono, PAPEL, 3)
        M.espaco(d, (40, ROCHA_Y + 22), "CALCÁRIO · ~600 MILHÕES DE ANOS", mono, PAPEL, 3)
        # bolhas de CO2 subindo do solo
        fco = f(INTER, 22)
        for bx, ph in bolhas:
            p = (t / 2.5 + ph) % 1
            y = ROCHA_Y - 20 - p * 110
            if p < 0.85:
                d.text((bx, y), "CO₂", font=fco, fill=(200, 210, 200))
        # gotas: azul no céu → laranja depois do solo (ácido)
        for gx, ph in gotas:
            p = (t / 1.6 + ph) % 1
            y = TOP + 60 + p * (1220 - TOP - 60)
            if y > ROCHA_Y:
                # escorre para a fratura mais próxima
                alvo = min(fr, key=lambda q: abs(q[0] - gx))[0]
                k = ease((y - ROCHA_Y) / 120); gxx = gx + (alvo - gx) * k
            else:
                gxx = gx
            cor = AGUA if y < SOLO_Y + 40 else SINAL
            d.ellipse((gxx - 5, y - 11, gxx + 5, y + 5), fill=cor)
        # fórmula
        a = ease((t - 2.5) / 1.2)
        if a > 0:
            caixa = Image.new("RGBA", (W, H), (0, 0, 0, 0)); dc = ImageDraw.Draw(caixa)
            dc.rounded_rectangle((150, 1130 - 10, 930, 1250), radius=18, fill=MATA + (int(235 * a),))
            ff = f(INTER, 46)
            txt = "H₂O + CO₂ → H₂CO₃"
            w = dc.textlength(txt, font=ff)
            dc.text(((W - w) / 2, 1132), txt, font=ff, fill=PAPEL + (int(255 * a),))
            sub = "água + gás carbônico = ácido carbônico"
            fs = f(INTER_R, 26); w2 = dc.textlength(sub, font=fs)
            dc.text(((W - w2) / 2, 1200), sub, font=fs, fill=SINAL + (int(255 * a),))
            img.paste(caixa, (0, 0), caixa)
        rodape(ImageDraw.Draw(img), "Petar · Vale do Ribeira")
        return img
    salvar(quadro, n, saida)


# ---------- M2: a fresta vira túnel, o túnel vira salão ----------
def m2(saida):
    n = FPS * 9
    Y0, Y1 = 440, 1250

    def quadro(i):
        t = i / FPS; p = ease((t - 0.8) / 6.5)
        img = Image.new("RGB", (W, H), MATA); d = ImageDraw.Draw(img)
        cabecalho(d, 2, 3, "Gota a gota", "O ácido entra pelas fraturas e dissolve o calcário. A fresta vira túnel; o túnel, salão.")
        estratos(d, 0, Y0 + 80, W, Y1, seed=5)
        d.rectangle((0, Y0, W, Y0 + 80), fill=SOLO)
        # fratura
        fr = [(540, Y0 + 80), (560, 640), (520, 800), (560, 960), (540, Y1)]
        d.line(fr, fill=MATA, width=6)
        # cavidade crescendo (elipse + ruído)
        cx, cy = 540, 930
        rx, ry = 20 + 400 * p, 10 + 190 * p
        pts = []
        for k in range(72):
            a = k / 72 * 2 * math.pi
            rr = 1 + 0.08 * math.sin(5 * a + 1) + 0.05 * math.sin(11 * a)
            pts.append((cx + rx * rr * math.cos(a), cy + ry * rr * math.sin(a) * (0.75 if math.sin(a) > 0 else 1.15)))
        d.polygon(pts, fill=(12, 20, 18))
        # rio no fundo da cavidade
        if p > 0.15:
            yb = cy + ry * 0.68
            larg = rx * 0.6
            onda = [(cx - larg + x, yb + 4 * math.sin(x / 25 + t * 6)) for x in range(0, int(2 * larg), 12)]
            if len(onda) > 1: d.line(onda, fill=AGUA, width=6)
        # gente pra escala
        if p > 0.85:
            a = ease((p - 0.85) / 0.15)
            hx, hy = cx + 120, cy + ry * 0.62
            cor = tuple(int(c * a + 12 * (1 - a)) for c in PAPEL)
            d.ellipse((hx - 9, hy - 70, hx + 9, hy - 52), fill=cor)
            d.pieslice((hx - 13, hy - 80, hx + 13, hy - 58), 180, 360, fill=tuple(int(c * a) for c in (60, 120, 220)))
            d.line([(hx, hy - 52), (hx, hy - 20)], fill=cor, width=6)
            d.line([(hx, hy - 20), (hx - 9, hy)], fill=cor, width=5); d.line([(hx, hy - 20), (hx + 9, hy)], fill=cor, width=5)
            d.line([(hx, hy - 45), (hx + 14, hy - 30)], fill=cor, width=5)
            mono = f(K["fontes"]["mono"], 20)
            M.espaco(d, (hx + 26, hy - 64), "VOCÊ AQUI", mono, cor, 2)
        # contador de tempo
        anos = int(5_000_000 * p)
        txt = "0 anos" if anos < 1000 else (f"{anos/1e6:.1f} milhões de anos".replace(".", ",") if anos >= 1_000_000 else f"{anos//1000} mil anos")
        fc = f(K["fontes"]["titulo"], 64)
        w = d.textlength(txt.upper(), font=fc)
        d.text(((W - w) / 2, 1140), txt.upper(), font=fc, fill=SINAL)
        rodape(d, "Escala de tempo ilustrativa")
        return img
    salvar(quadro, n, saida)


# ---------- M3: gota → canudinho → estalactite + estalagmite → coluna ----------
def m3(saida):
    n = FPS * 10
    TETO, CHAO = 470, 1180
    X = 540

    def quadro(i):
        t = i / FPS; p = ease((t - 0.3) / 8.4)
        img = Image.new("RGB", (W, H), MATA); d = ImageDraw.Draw(img)
        cabecalho(d, 3, 3, "Anel por anel", "Dentro da caverna, a gota perde gás carbônico pro ar e deixa um anel de calcita.")
        estratos(d, 0, 380, W, TETO, seed=7); estratos(d, 0, CHAO, W, 1290, seed=9)
        # estalactite: primeiro tubo fino (canudinho), depois engrossa em cone
        comp = 40 + 330 * p
        base = 14 + 70 * max(0, (p - 0.3) / 0.7)
        d.polygon([(X - base, TETO), (X + base, TETO), (X + 9, TETO + comp), (X - 9, TETO + comp)], fill=(214, 204, 186))
        for k in range(0, int(comp), 14):
            w = base + (9 - base) * k / max(comp, 1)
            d.line([(X - w, TETO + k), (X + w, TETO + k)], fill=(190, 178, 160), width=2)
        # estalagmite (cresce a partir de p>0.25)
        q = max(0, (p - 0.25) / 0.75)
        alt = 300 * q; bb = 30 + 110 * q
        if alt > 2:
            d.polygon([(X - bb, CHAO), (X + bb, CHAO), (X + 16, CHAO - alt), (X - 16, CHAO - alt)], fill=(200, 190, 170))
        # gota
        fim_gota = CHAO - alt
        ini = TETO + comp
        ciclo = (t * 1.3) % 1
        if p < 0.97:
            if ciclo < 0.45:
                r = 4 + 8 * ciclo / 0.45
                d.ellipse((X - r, ini, X + r, ini + 2 * r), fill=AGUA)
                # CO2 escapando
                fco = f(INTER, 22)
                d.text((X + 28, ini - 10 - 40 * ciclo), "CO₂", font=fco, fill=(200, 210, 200))
            else:
                y = ini + (fim_gota - ini) * ease((ciclo - 0.45) / 0.5)
                d.ellipse((X - 7, y, X + 7, y + 16), fill=AGUA)
        else:
            # coluna: preenche o vão
            d.rectangle((X - 18, ini - 5, X + 18, fim_gota + 5), fill=(208, 198, 178))
        # rótulos
        mono = f(K["fontes"]["mono"], 24)
        def rot(txt, y, ativo):
            cor = SINAL if ativo else PEDRA
            d.line([(X + 150, y + 12), (X + 60, y + 12)], fill=cor, width=2)
            M.espaco(d, (X + 162, y), txt, mono, cor, 3)
        if p < 0.3:
            rot("CANUDINHO", TETO + comp / 2, True)
        else:
            rot("ESTALACTITE", TETO + comp / 2, True)
        if q > 0.1:
            rot("ESTALAGMITE", CHAO - alt / 2 - 10, True)
        if p >= 0.97:
            fc = f(K["fontes"]["titulo"], 72)
            txt = "COLUNA"
            d.text((X - 380, (ini + fim_gota) / 2 - 40), txt, font=fc, fill=SINAL)
        rodape(d, "Frações de milímetro por ano")
        return img
    salvar(quadro, n, saida)


# ---------- M4: ficha técnica do PETAR (números contando) ----------
def m4(saida, fundo):
    n = FPS * 7
    bg = M.tratar(M.recortar(Image.open(fundo), (0.5, 0.55)))
    bg = Image.eval(bg, lambda v: int(v * 0.42)).filter(ImageFilter.GaussianBlur(3))
    itens = [(1958, "{:d}", "ano de criação do parque"),
             (35.7, "{:.1f} mil", "hectares de área protegida"),
             (300, "{:d}+", "cavernas cadastradas"),
             (200, "~{:d} m", "altura do portal da Casa de Pedra"),
             (600, "~{:d} mi", "anos de idade do calcário")]

    def quadro(i):
        t = i / FPS
        img = bg.copy(); d = ImageDraw.Draw(img)
        mono = f(K["fontes"]["mono"], 24)
        M.espaco(d, (56, 56), "COMO NASCE UMA CAVERNA", mono, PAPEL, 3)
        d.text((56, 112), "PETAR EM NÚMEROS", font=f(K["fontes"]["titulo"], 96), fill=SINAL)
        y = 300
        for k, (val, fmt, rot) in enumerate(itens):
            a = ease((t - 0.3 - k * 0.45) / 1.4)
            v = val * a
            if fmt.startswith("{:d}") or "{:d}" in fmt:
                v = int(round(v)) if a < 1 else int(val)
                txt = fmt.format(v)
            else:
                txt = fmt.format(v).replace(".", ",")
            fn = f(K["fontes"]["titulo"], 120)
            cor = tuple(int(c * min(1, a * 2)) for c in PAPEL)
            d.text((56, y), txt, font=fn, fill=cor)
            fr = f(INTER, 34)
            d.text((56 + d.textlength("~600 mi", font=fn) + 40, y + 52), rot, font=fr, fill=tuple(int(c * min(1, a * 2)) for c in PAPEL))
            d.line([(56, y + 175), (W - 56, y + 175)], fill=tuple(int(c * 0.35) for c in PAPEL), width=1)
            y += 190
        rodape(d, "Fontes: ALESP · Semil-SP · USP")
        return img
    salvar(quadro, n, saida)


if __name__ == "__main__":
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    quais = sys.argv[2:] or ["m1", "m2", "m3"]
    if "m1" in quais: m1(os.path.join(out, "m1.mp4"))
    if "m2" in quais: m2(os.path.join(out, "m2.mp4"))
    if "m3" in quais: m3(os.path.join(out, "m3.mp4"))
    if "m4" in quais: m4(os.path.join(out, "m4.mp4"), os.environ["FUNDO_M4"])
