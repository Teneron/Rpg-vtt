import fitz
import os

phb_path = r'C:\Users\blakm\OneDrive\Desktop\RPG\DND\DnD 5.5 - Livro do Jogador (2024) - Erratas Agosto.pdf'
dmg_path = r'C:\Users\blakm\OneDrive\Desktop\RPG\DND\DnD 5.5e - Livro do Mestre - Herois Anonimos.pdf'

class_dir = r'c:\Users\blakm\OneDrive\Desktop\RPG\rpg-tabletop\public\assets\classes'
dmg_dir = r'c:\Users\blakm\OneDrive\Desktop\RPG\rpg-tabletop\public\assets\dmg'
os.makedirs(class_dir, exist_ok=True)
os.makedirs(dmg_dir, exist_ok=True)

doc_phb = fitz.open(phb_path)

class_pages = {
    'barbarian': 56,
    'bard': 64,
    'warlock': 74,
    'cleric': 86,
    'druid': 96,
    'sorcerer': 108,
    'ranger': 122,
    'fighter': 132,
    'rogue': 142,
    'wizard': 152,
    'monk': 164,
    'paladin': 172
}

print("Extracting class artwork...")
for c_name, pno in class_pages.items():
    page = doc_phb[pno]
    images = page.get_images()
    best_img = None
    max_bytes = 0
    for i, img in enumerate(images):
        xref = img[0]
        base_img = doc_phb.extract_image(xref)
        w, h = base_img["width"], base_img["height"]
        data = base_img["image"]
        if len(data) > max_bytes and w > 200 and h > 200:
            max_bytes = len(data)
            best_img = (base_img, base_img["ext"])
    
    if best_img:
        out_path = os.path.join(class_dir, f"{c_name}.{best_img[1]}")
        with open(out_path, "wb") as f:
            f.write(best_img[0]["image"])
        print(f"-> Saved {c_name} to {out_path} ({max_bytes} bytes)")
    else:
        # Check next page if class splash is across 2 pages
        page_next = doc_phb[pno+1]
        for img in page_next.get_images():
            xref = img[0]
            base_img = doc_phb.extract_image(xref)
            w, h = base_img["width"], base_img["height"]
            data = base_img["image"]
            if len(data) > max_bytes and w > 200 and h > 200:
                max_bytes = len(data)
                best_img = (base_img, base_img["ext"])
        if best_img:
            out_path = os.path.join(class_dir, f"{c_name}.{best_img[1]}")
            with open(out_path, "wb") as f:
                f.write(best_img[0]["image"])
            print(f"-> Saved {c_name} (from p+1) to {out_path} ({max_bytes} bytes)")

print("\nExtracting DMG art...")
doc_dmg = fitz.open(dmg_path)

# Let's inspect chapter pages in DMG
# Bastions is around p. 333 (index 332)
# Greyhawk is around p. 148 (index 147)
# Magic items is around p. 217 (index 216)
dmg_targets = {
    'bastions': 332,
    'greyhawk_city': 147,
    'magic_items': 216,
    'dm_screen_art': 8
}

for d_name, pno in dmg_targets.items():
    page = doc_dmg[pno]
    best_img = None
    max_bytes = 0
    for img in page.get_images():
        xref = img[0]
        base_img = doc_dmg.extract_image(xref)
        w, h = base_img["width"], base_img["height"]
        data = base_img["image"]
        if len(data) > max_bytes and w > 200 and h > 200:
            max_bytes = len(data)
            best_img = (base_img, base_img["ext"])
    if best_img:
        out_path = os.path.join(dmg_dir, f"{d_name}.{best_img[1]}")
        with open(out_path, "wb") as f:
            f.write(best_img[0]["image"])
        print(f"-> Saved DMG {d_name} to {out_path} ({max_bytes} bytes)")

print("Done extracting artworks!")
