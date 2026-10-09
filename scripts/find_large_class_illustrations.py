import fitz
import os

phb_path = r'C:\Users\blakm\OneDrive\Desktop\RPG\DND\DnD 5.5 - Livro do Jogador (2024) - Erratas Agosto.pdf'
class_dir = r'c:\Users\blakm\OneDrive\Desktop\RPG\rpg-tabletop\public\assets\classes'
os.makedirs(class_dir, exist_ok=True)

doc = fitz.open(phb_path)

ranges = {
    'barbarian': (56, 64),
    'bard': (64, 74),
    'warlock': (74, 86),
    'cleric': (86, 96),
    'druid': (96, 108),
    'sorcerer': (108, 122),
    'ranger': (122, 132),
    'fighter': (132, 142),
    'rogue': (142, 152),
    'wizard': (152, 164),
    'monk': (164, 172),
    'paladin': (172, 181),
}

for c_name, (start_p, end_p) in ranges.items():
    best_img = None
    max_bytes = 0
    best_page = 0
    for p in range(start_p, end_p):
        page = doc[p]
        for img in page.get_images():
            xref = img[0]
            base_img = doc.extract_image(xref)
            data = base_img["image"]
            w = base_img["width"]
            h = base_img["height"]
            # Exclude full page background textures (which are usually 850x1100 with small compression or repeated)
            # We want character art:
            if len(data) > max_bytes and w >= 300 and h >= 300:
                max_bytes = len(data)
                best_img = (base_img, base_img["ext"])
                best_page = p + 1
    
    if best_img:
        out_path = os.path.join(class_dir, f"{c_name}.{best_img[1]}")
        with open(out_path, "wb") as f:
            f.write(best_img[0]["image"])
        print(f"Saved {c_name} from page {best_page} ({max_bytes} bytes, {best_img[0]['width']}x{best_img[0]['height']})")
    else:
        print(f"No large image found for {c_name}")
