#!/bin/bash
folders=("cmc" "cmc2" "cmc3" "lamar" "prime" "sky-hills" "zayed")

for f in "${folders[@]}"; do
    target="../$f"
    if [ -d "$target" ]; then
        echo "Copying .htaccess to $f..."
        cp .htaccess "$target/.htaccess"
    fi
done
echo "Copy complete."
