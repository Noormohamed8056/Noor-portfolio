import os
import fitz  # PyMuPDF
from PIL import Image
import io

cert_dir = r"d:\MY PORTFOLIO\assets\certificates"

for filename in os.listdir(cert_dir):
    if filename.lower().endswith(".pdf"):
        pdf_path = os.path.join(cert_dir, filename)
        webp_filename = filename[:-4] + ".webp"
        webp_path = os.path.join(cert_dir, webp_filename)
        
        try:
            doc = fitz.open(pdf_path)
            # Render first page to an image
            page = doc.load_page(0)
            pix = page.get_pixmap(dpi=200) # High quality
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            img.save(webp_path, "WEBP", quality=85)
            print(f"Converted {filename} to {webp_filename}")
        except Exception as e:
            print(f"Error converting {filename}: {e}")
