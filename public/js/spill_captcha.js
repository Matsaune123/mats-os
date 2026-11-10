const grid = document.getElementById('captcha-grid');
        const statusDiv = document.getElementById('status');
        const tiles = [];

        // Generer ruter med falske minneadresser
        for (let i = 0; i < 9; i++) {
            let tile = document.createElement('div');
            
            // Inline styling for the tiles for å matche MATS-OS looken
            tile.style.aspectRatio = '1';
            tile.style.border = '1px dashed var(--border)';
            tile.style.display = 'flex';
            tile.style.justifyContent = 'center';
            tile.style.alignItems = 'center';
            tile.style.cursor = 'pointer';
            tile.style.fontSize = '11px';
            tile.style.userSelect = 'none';
            tile.style.transition = 'all 0.1s';
            tile.style.color = 'var(--text-dim)';
            
            tile.textContent = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0');
            
            tile.addEventListener('click', function() {
                // Toggle farger ved klikk
                if (this.dataset.selected === 'true') {
                    this.dataset.selected = 'false';
                    this.style.background = 'transparent';
                    this.style.color = 'var(--text-dim)';
                    this.style.borderStyle = 'dashed';
                } else {
                    this.dataset.selected = 'true';
                    this.style.background = 'var(--primary-color)';
                    this.style.color = 'var(--background)';
                    this.style.borderStyle = 'solid';
                }
                
                // Kaos-mekanikk: Endre status på en tilfeldig annen rute
                let randomTile = tiles[Math.floor(Math.random() * tiles.length)];
                if (randomTile !== this) {
                    if (randomTile.dataset.selected === 'true') {
                        randomTile.dataset.selected = 'false';
                        randomTile.style.background = 'transparent';
                        randomTile.style.color = 'var(--text-dim)';
                        randomTile.style.borderStyle = 'dashed';
                    } else {
                        randomTile.dataset.selected = 'true';
                        randomTile.style.background = 'var(--primary-color)';
                        randomTile.style.color = 'var(--background)';
                        randomTile.style.borderStyle = 'solid';
                    }
                }
                
                document.getElementById('error-msg').style.visibility = 'hidden';
                statusDiv.textContent = 'Status: Behandler inndata...';
            });
            
            grid.appendChild(tile);
            tiles.push(tile);
        }

        // Valideringsknapp som alltid feiler
        document.getElementById('verify-btn').addEventListener('click', function() {
            const errorMsg = document.getElementById('error-msg');
            const selectedCount = tiles.filter(t => t.dataset.selected === 'true').length;
            
            if (selectedCount === 0) {
                errorMsg.textContent = "VELG MINST ÉN RUTE.";
                statusDiv.textContent = 'Status: Feilkode 0x00 - Tomt valg.';
            } else {
                errorMsg.textContent = "FEIL. PRØV IGJEN.";
                statusDiv.textContent = 'Status: Algoritme mismatch. Sannsynlighet for bot: 99.9%.';
                
                // Resetter rutenettet for å bygge mer frustrasjon
                tiles.forEach(t => {
                    t.dataset.selected = 'false';
                    t.style.background = 'transparent';
                    t.style.color = 'var(--text-dim)';
                    t.style.borderStyle = 'dashed';
                    t.textContent = '0x' + Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0');
                });
            }
            errorMsg.style.visibility = 'visible';
        });