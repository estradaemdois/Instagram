#!/usr/bin/env python3
"""Comprime as lâminas de um carrossel para caber no envio direto ao estúdio.

Uso: python3 compactar.py <pasta-origem> <pasta-saida> [limite_bytes]
Alvo: soma dos arquivos <= limite (padrão 3,1 MB, que vira ~4,2 MB em base64).
"""
import os, subprocess, sys
from PIL import Image

orig, saida = sys.argv[1], sys.argv[2]
limite = int(sys.argv[3]) if len(sys.argv) > 3 else 3_100_000
os.makedirs(saida, exist_ok=True)
itens = sorted(f for f in os.listdir(orig) if f.endswith((".jpg", ".mp4")))
n = len(itens)
orc = limite / n  # orçamento médio por item


def jpg(src, dst, alvo):
    im = Image.open(src).convert("RGB")
    for q in range(88, 40, -4):
        im.save(dst, quality=q, optimize=True, progressive=True)
        if os.path.getsize(dst) <= alvo:
            return q
    return q


def mp4(src, dst, alvo):
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                         "-of", "csv=p=0", src]).strip())
    kbps = max(120, int(alvo * 8 / dur / 1000 * 0.92))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-an", "-c:v", "libx264", "-preset", "slow",
                    "-b:v", f"{kbps}k", "-maxrate", f"{int(kbps*1.3)}k", "-bufsize", f"{kbps*2}k",
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst], check=True)
    return kbps


# vídeos recebem 1,6x o orçamento médio; fotos dividem o resto
nv = sum(f.endswith(".mp4") for f in itens)
alvo_v = orc * 1.6 if nv else 0
alvo_f = (limite - alvo_v * nv) / max(1, n - nv)
total = 0
for f in itens:
    src, dst = os.path.join(orig, f), os.path.join(saida, f)
    if f.endswith(".jpg"):
        q = jpg(src, dst, alvo_f); info = f"q{q}"
    else:
        k = mp4(src, dst, alvo_v); info = f"{k}kbps"
    total += os.path.getsize(dst)
    print(f, os.path.getsize(dst) // 1024, "KB", info)
print("TOTAL", round(total / 1e6, 2), "MB  base64≈", round(total * 4 / 3 / 1e6, 2), "MB")
