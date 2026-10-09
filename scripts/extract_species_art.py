import fitz
import os

pdf_path = r'C:\Users\blakm\OneDrive\Desktop\RPG\DND\DnD 5.5 - Livro do Jogador (2024) - Erratas Agosto.pdf'
out_dir = r'c:\Users\blakm\OneDrive\Desktop\RPG\rpg-tabletop\public\assets\species'
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)

# Let's map species pages from TOC:
# p. 192: Aasimar (index 191)
# p. 193: Anão (index 192)
# p. 194: Draconato (index 193)
# p. 195-196: Elfo (index 194-195)
# p. 197: Gnomo (index 196)
# p. 198: Golias (index 197)
# p. 199: Humano (index 198)
# p. 200: Orc (index 199)
# p. 201: Pequenino / Halfling (index 200)
# p. 202-203: Tiferino / Tiefling (index 201-202)

species_map = {
    191: 'aasimar',
    192: 'dwarf',
    193: 'dragonborn',
    194: 'elf_1',
    195: 'elf_2',
    196: 'gnome',
    197: 'goliath',
    198: 'human',
    199: 'orc',
    200: 'halfling',
    201: 'tiefling_1',
    202: 'tiefling_2'
}

print("Scanning species pages...")
for pno, name in species_map.items():
    page = doc[pno]
    images = page.get_images()
    print(f"Page {pno+1} ({name}): {len(images)} images")
    best_img = None
    max_bytes = 0
    for i, img in enumerate(images):
        xref = img[0]
        base_img = doc.extract_image(xref)
        img_bytes = base_img["image"]
        w = base_img["width"]
        h = base_img["height"]
        ext = base_img["ext"]
        print(f"  img {i}: {w}x{h}, {len(img_bytes)} bytes, ext={ext}")
        if len(img_bytes) > max_bytes and w > 200 and h > 200:
            max_bytes = len(img_bytes)
            best_img = (base_img, ext)
    
    if best_img:
        out_path = os.path.join(out_dir, f"{name}.{best_img[1]}")
        with open(out_path, "wb") as f:
            f.write(best_img[0]["image"])
        print(f"-> Saved best image for {name} to {out_path} ({max_bytes} bytes)")
    else:
        # Also render page as pixmap to be sure we have a visual representation!
        pix = page.get_pixmap(dpi=150)
        out_path = os.path.join(out_dir, f"{name}_page.jpg")
        pix.save(out_path)
        print(f"-> Rendered page pixmap for {name} to {out_path}")

print("Species extraction completed!")
