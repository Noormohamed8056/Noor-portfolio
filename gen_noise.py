import os
import base64
from PIL import Image
import random

img = Image.new('L', (128, 128))
pixels = img.load()
for x in range(img.size[0]):
    for y in range(img.size[1]):
        pixels[x, y] = random.randint(0, 255)

img.save('noise.png')
with open('noise.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')
    print(b64)
