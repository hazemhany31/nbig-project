#!/bin/bash
folders=("cmc" "cmc2" "cmc3" "lamar" "prime" "sky-hills" "zayed")

for f in "${folders[@]}"; do
    target="../$f/images"
    if [ -d "$target" ]; then
        echo "Processing $f..."
        mv "$target/ski hills44.jpg" "$target/ski-hills-44.jpg" 2>/dev/null
        mv "$target/ZX 01.jpg" "$target/ZX-01.jpg" 2>/dev/null
        mv "$target/about us.jpg" "$target/about-us.jpg" 2>/dev/null
        mv "$target/cmc 1 1.jpg" "$target/cmc-1-1.jpg" 2>/dev/null
        mv "$target/cmc 1.jpg" "$target/cmc-1.jpg" 2>/dev/null
        mv "$target/cmc 2 1.jpg" "$target/cmc-2-1.jpg" 2>/dev/null
        mv "$target/cmc 2 2.jpg" "$target/cmc-2-2.jpg" 2>/dev/null
        mv "$target/cmc 2 3.jpg" "$target/cmc-2-3.jpg" 2>/dev/null
        mv "$target/cmc 2 4.jpg" "$target/cmc-2-4.jpg" 2>/dev/null
        mv "$target/cmc 2.jpg" "$target/cmc-2.jpg" 2>/dev/null
        mv "$target/cmc 3 2.jpg" "$target/cmc-3-2.jpg" 2>/dev/null
        mv "$target/cmc 3 3.jpg" "$target/cmc-3-3.jpg" 2>/dev/null
        mv "$target/cmc 3 4.jpg" "$target/cmc-3-4.jpg" 2>/dev/null
        mv "$target/cmc 3 5.jpg" "$target/cmc-3-5.jpg" 2>/dev/null
        mv "$target/cmc 3.jpg" "$target/cmc-3.jpg" 2>/dev/null
        mv "$target/lamar 1.jpg" "$target/lamar-1.jpg" 2>/dev/null
        mv "$target/lamar 2.jpg" "$target/lamar-2.jpg" 2>/dev/null
        mv "$target/lamar 3.jpg" "$target/lamar-3.jpg" 2>/dev/null
        mv "$target/lamar 4.jpg" "$target/lamar-4.jpg" 2>/dev/null
        mv "$target/logo nbig wihte.png" "$target/logo-nbig-white.png" 2>/dev/null
        mv "$target/zayed 1.jpg" "$target/zayed-1.jpg" 2>/dev/null
        mv "$target/zayed 2.jpg" "$target/zayed-2.jpg" 2>/dev/null
        mv "$target/zayed 3.jpg" "$target/zayed-3.jpg" 2>/dev/null
        mv "$target/zayed 4.jpg" "$target/zayed-4.jpg" 2>/dev/null
    fi
done
echo "Renaming complete."
