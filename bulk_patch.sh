#!/bin/bash
folders=("cmc" "cmc2" "cmc3" "lamar" "prime" "sky-hills" "zayed")

# New Loader Script (single-line for sed ease)
NEW_LOADER="const hideLoader = () => { const l = document.getElementById('loader'); if (l) l.classList.add('hidden'); }; window.addEventListener('load', () => setTimeout(hideLoader, 500)); setTimeout(hideLoader, 5000);"

for f in "${folders[@]}"; do
    target="../$f"
    if [ -d "$target" ]; then
        echo "Patching HTML files in $f..."
        
        # Find all HTML files in the folder (root level)
        for html in "$target"/*.html; do
            if [ -f "$html" ]; then
                echo "  Processing $html"
                
                # 1. Replace Loader script
                # Matches versions with 500, 600, or any ms
                sed -i '' "s/window.addEventListener('load', () => { setTimeout(() => document.getElementById('loader').classList.add('hidden'), [0-9]*); });/$NEW_LOADER/g" "$html"
                
                # 2. Image Refs
                sed -i '' 's/ski hills44.jpg/ski-hills-44.jpg/g' "$html"
                sed -i '' 's/cmc 1.jpg/cmc-1.jpg/g' "$html"
                sed -i '' 's/cmc 2.jpg/cmc-2.jpg/g' "$html"
                sed -i '' 's/cmc 3.jpg/cmc-3.jpg/g' "$html"
                sed -i '' 's/logo nbig wihte.png/logo-nbig-white.png/g' "$html"
                sed -i '' 's/cmc 1 1.jpg/cmc-1-1.jpg/g' "$html"
                sed -i '' 's/cmc 2 1.jpg/cmc-2-1.jpg/g' "$html"
                sed -i '' 's/cmc 3 2.jpg/cmc-3-2.jpg/g' "$html"
                
                # 3. Canonical Domain (for index.html)
                if [[ "$html" == *"index.html" ]]; then
                    sed -i '' 's/nbig.com/new-build-egypt.com/g' "$html"
                fi
            fi
        done
    fi
done
echo "Patching complete."
