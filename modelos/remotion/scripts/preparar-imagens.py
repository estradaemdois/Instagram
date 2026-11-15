#!/usr/bin/env python3
"""Moldura · etapa 1: baixa e trata as imagens pedidas no storyboard.

Uso: python3 -I scripts/preparar-imagens.py ../../producoes/<pasta-da-producao>
Lê 07-storyboard.json -> "imagens": [{arquivo, url, foco:[x,y], zoom, brilho, saturacao}]
Grava em <producao>/imagens/<arquivo> já em 1080x1350 (4:5).
"""
import json, sys, urllib.request, io, os
from PIL import Image, ImageEnhance

prod = sys.argv[1]
sb = json.load(open(os.path.join(prod, "07-storyboard.json"), encoding="utf-8"))
destino = os.path.join(prod, "imagens"); os.makedirs(destino, exist_ok=True)
W, H = 1080, 1350
for im in sb["imagens"]:
    saida = os.path.join(destino, im["arquivo"])
    if im.get("url"):
        req = urllib.request.Request(im["url"], headers={"User-Agent": "Mozilla/5.0 (fabrica-de-conteudo)"})
        dados = urllib.request.urlopen(req, timeout=60).read()
        img = Image.open(io.BytesIO(dados)).convert("RGB")
    else:  # imagem já colocada na pasta (ex.: do Google Drive)
        img = Image.open(os.path.join(destino, im.get("original", im["arquivo"]))).convert("RGB")
    fx, fy = im.get("foco", [0.5, 0.5]); zoom = im.get("zoom", 1.0)
    r = max(W / img.width, H / img.height) * zoom
    img = img.resize((round(img.width * r), round(img.height * r)), Image.LANCZOS)
    l = min(max(0, round(img.width * fx - W / 2)), img.width - W)
    t = min(max(0, round(img.height * fy - H / 2)), img.height - H)
    img = img.crop((l, t, l + W, t + H))
    img = ImageEnhance.Brightness(img).enhance(im.get("brilho", 1.0))
    img = ImageEnhance.Color(img).enhance(im.get("saturacao", 1.0))
    img.save(saida, quality=92)
    print("ok", im["arquivo"])
