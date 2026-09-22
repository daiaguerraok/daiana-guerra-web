#!/usr/bin/env python3
"""Genera las versiones livianas de las fotos: WebP en tres anchos (480, 960 y
el original, hasta 1440). El sitio elige el que necesita según la pantalla.
Correr después de agregar fotos:  python3 optimizar-fotos.py
Necesita Pillow:  pip install pillow
"""
import os, sys
from PIL import Image, ImageOps
CARPETAS=['fotos','casos']
ANCHOS=[480,960]
def variantes(p):
    base=p[:-4]
    im=ImageOps.exif_transpose(Image.open(p)).convert('RGB'); w,h=im.size
    salidas={base+'.webp':im}
    for a in ANCHOS:
        if w>a: salidas[f'{base}-{a}.webp']=im.resize((a,round(h*a/w)),Image.LANCZOS)
    for dst,img in salidas.items():
        if not os.path.exists(dst) or os.path.getmtime(dst)<os.path.getmtime(p):
            img.save(dst,'WEBP',quality=80,method=6)
    return len(salidas)
n=0
for c in CARPETAS:
    for root,_,fs in os.walk(c):
        for f in fs:
            if f.lower().endswith('.jpg'): n+=variantes(os.path.join(root,f))
print('listo:',n,'archivos WebP')
