import os
from PIL import Image

src_dir = r"C:\Users\User\.gemini\antigravity-ide\brain\3ba712f2-d674-4e96-bf26-c8362bbfcd7a"
dest_dir = r"D:\MY PORTFOLIO\assets\images\expertise"

files = {
    "xp_1_1790591324733.jpg": "xp-1.webp",
    "xp_2_1790591338165.jpg": "xp-2.webp",
    "xp_3_1790591355414.jpg": "xp-3.webp",
    "xp_4_1790591369833.jpg": "xp-4.webp",
}

for src_name, dest_name in files.items():
    src_path = os.path.join(src_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    
    if os.path.exists(src_path):
        with Image.open(src_path) as img:
            # Resize to exactly 1200x1200 using Lanczos resampling
            img = img.resize((1200, 1200), Image.Resampling.LANCZOS)
            
            # Save as WebP with quality 80
            img.save(dest_path, "WEBP", quality=80, method=6)
            print(f"Saved {dest_path}")
            size_kb = os.path.getsize(dest_path) / 1024
            print(f"Size: {size_kb:.2f} KB")
    else:
        print(f"Source file not found: {src_path}")
