import pymupdf
import os

pdf_dm = r"C:\Users\blakm\OneDrive\Desktop\RPG\DND\DnD 5.5e - Livro do Mestre - Herois Anonimos.pdf"
pdf_player = r"C:\Users\blakm\OneDrive\Desktop\RPG\DND\DnD 5.5 - Livro do Jogador (2024) - Erratas Agosto.pdf"

out_dir = r"public\assets\dnd55e"
os.makedirs(out_dir, exist_ok=True)

# 1. Extract Greyhawk maps from DMG
print("Extracting Greyhawk maps from DMG...")
doc_d = pymupdf.open(pdf_dm)
for p in range(140, 165):
    if p < len(doc_d):
        for idx, img in enumerate(doc_d[p].get_images()):
            xref = img[0]
            base_img = doc_d.extract_image(xref)
            w, h = base_img["width"], base_img["height"]
            if w >= 900 and len(base_img["image"]) > 200000:
                ext = base_img["ext"]
                fname = f"greyhawk_map_p{p+1}_{w}x{h}.{ext}"
                fpath = os.path.join(out_dir, fname)
                with open(fpath, "wb") as f:
                    f.write(base_img["image"])
                size_kb = len(base_img["image"]) // 1024
                print(f"Saved: {fname} ({w}x{h}, {size_kb} KB)")

# Also check for city of greyhawk map or world map specifically
for p in [353, 354, 355]:
    if p < len(doc_d):
        for idx, img in enumerate(doc_d[p].get_images()):
            xref = img[0]
            base_img = doc_d.extract_image(xref)
            w, h = base_img["width"], base_img["height"]
            if w >= 1000:
                ext = base_img["ext"]
                fname = f"dm_appendix_map_p{p+1}_{w}x{h}.{ext}"
                fpath = os.path.join(out_dir, fname)
                with open(fpath, "wb") as f:
                    f.write(base_img["image"])
                print(f"Saved appendix: {fname}")

# 2. Extract key artwork from Player Book
print("\nExtracting Player's Handbook artwork...")
doc_p = pymupdf.open(pdf_player)
saved_p = 0
for p in range(len(doc_p)):
    for idx, img in enumerate(doc_p[p].get_images()):
        xref = img[0]
        base_img = doc_p.extract_image(xref)
        w, h = base_img["width"], base_img["height"]
        if w >= 1400 and h >= 800 and len(base_img["image"]) > 500000:
            ext = base_img["ext"]
            fname = f"player_art_p{p+1}_{w}x{h}.{ext}"
            fpath = os.path.join(out_dir, fname)
            if not os.path.exists(fpath):
                with open(fpath, "wb") as f:
                    f.write(base_img["image"])
                saved_p += 1
                size_kb = len(base_img["image"]) // 1024
                print(f"Saved Player Art: {fname} ({w}x{h}, {size_kb} KB)")
            if saved_p >= 15:
                break
    if saved_p >= 15:
        break

print(f"\nDone! Extracted images to {out_dir}")
