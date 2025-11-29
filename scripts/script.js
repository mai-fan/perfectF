document.addEventListener('DOMContentLoaded', () => {
    const conteneur = document.getElementById('contenu-dynamique');
    const boutons = document.querySelectorAll('.btn-filtre');
    
    // Variable pour stocker les données une fois chargées
    let toutesLesDonnees = [];

    // --- 1. Récupération des données ---
    fetch('https://github.com/mai-fan/perfectF/blob/main/data/data.json')
        .then(response => {
            if (!response.ok) throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            return response.json();
        })
        .then(data => {
            toutesLesDonnees = data; // On sauvegarde les données
            afficherElements(toutesLesDonnees); // On affiche tout au début
        })
        .catch(error => {
            console.error('Erreur:', error);
            conteneur.textContent = 'Erreur de chargement des données.';
        });

    // --- 2. Gestion des clics sur les boutons ---
    boutons.forEach(btn => {
        btn.addEventListener('click', () => {
            // A. Gestion visuelle (enlever la classe 'actif' des autres)
            boutons.forEach(b => b.classList.remove('actif'));
            btn.classList.add('actif');

            // B. Filtrage des données
            const filtreDemande = btn.getAttribute('data-filter'); // 'tout', 'reel' ou 'anime'
            
            if (filtreDemande === 'tout') {
                afficherElements(toutesLesDonnees);
            } else {
                // On garde uniquement les éléments dont le "type" correspond au bouton
                const donneesFiltrees = toutesLesDonnees.filter(item => item.type === filtreDemande);
                afficherElements(donneesFiltrees);
            }
        });
    });

    // --- 3. Fonction d'affichage (Réutilisable) ---
    function afficherElements(liste) {
        // Étape cruciale : On vide le conteneur avant d'ajouter les nouveaux éléments
        conteneur.innerHTML = '';

        if (liste.length === 0) {
            conteneur.innerHTML = '<p style="text-align:center;">Aucun élément trouvé pour cette catégorie.</p>';
            return;
        }

        liste.forEach(element => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-carte'); 

            // Titre
            const nomElement = document.createElement('h2');
            nomElement.textContent = element.nom;
            itemDiv.appendChild(nomElement);

            // Description
            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = element.description;
            itemDiv.appendChild(descriptionElement);

            // Galerie
            const mediaDiv = document.createElement('div');
            mediaDiv.classList.add('media-galerie');

            // --- VIDÉOS ---
            if (element.videos && element.videos.length > 0) {
                element.videos.forEach(video => {
                    if (video.source === 'mp4') {
                        const videoEl = document.createElement('video');
                        videoEl.src = video.url;
                        videoEl.loop = true;
                        videoEl.muted = true;
                        videoEl.autoplay = true;
                        videoEl.playsInline = true;
                        videoEl.controls = true;
                        videoEl.classList.add('media-video');
                        mediaDiv.appendChild(videoEl);
                    } else if (video.source === 'youtube') {
                        const videoFrame = document.createElement('iframe');
                        videoFrame.src = video.url;
                        videoFrame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                        videoFrame.setAttribute('allowfullscreen', '');
                        videoFrame.classList.add('media-video');
                        mediaDiv.appendChild(videoFrame);
                    }
                });
            }

            // --- IMAGES ---
            if (element.images && element.images.length > 0) {
                element.images.forEach(imageUrl => {
                    const imageElement = document.createElement('img');
                    imageElement.src = imageUrl;
                    imageElement.alt = `Image ${element.nom}`;
                    imageElement.classList.add('media-image');
                    mediaDiv.appendChild(imageElement);
                });
            }

            itemDiv.appendChild(mediaDiv);
            conteneur.appendChild(itemDiv);
        });
    }
});
