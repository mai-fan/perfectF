document.addEventListener('DOMContentLoaded', () => {
    const conteneur = document.getElementById('contenu-dynamique');
    const boutons = document.querySelectorAll('.btn-filtre');
    
    // --- CONFIGURATION IMPORTANTE ---
    // C'est ici qu'on force le chemin vers votre projet GitHub
    // Le '/' à la fin est important !
    const urlBaseProjet = "https://mai-fan.github.io/perfectF/"; 

    let toutesLesDonnees = [];

    // On utilise le lien RAW pour être sûr de charger le JSON à jour
    fetch('https://raw.githubusercontent.com/mai-fan/perfectF/main/data/data.json')
        .then(response => {
            if (!response.ok) throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            return response.json();
        })
        .then(data => {
            toutesLesDonnees = data;
            afficherElements(toutesLesDonnees);
        })
        .catch(error => {
            console.error('Erreur:', error);
            conteneur.innerHTML = '<p style="color:white; text-align:center;">Erreur de chargement. Vérifiez la console (F12).</p>';
        });

    // --- Gestion des Filtres (Reste identique) ---
    boutons.forEach(btn => {
        btn.addEventListener('click', () => {
            boutons.forEach(b => b.classList.remove('actif'));
            btn.classList.add('actif');
            const filtreDemande = btn.getAttribute('data-filter');
            
            if (filtreDemande === 'tout') {
                afficherElements(toutesLesDonnees);
            } else {
                const donneesFiltrees = toutesLesDonnees.filter(item => item.type === filtreDemande);
                afficherElements(donneesFiltrees);
            }
        });
    });

    // --- Fonction d'affichage avec CORRECTION DES LIENS ---
    function afficherElements(liste) {
        conteneur.innerHTML = '';

        if (liste.length === 0) {
            conteneur.innerHTML = '<p style="text-align:center; color: #aaa;">Aucun élément trouvé.</p>';
            return;
        }

        liste.forEach(element => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-carte'); 

            const nomElement = document.createElement('h2');
            nomElement.textContent = element.nom;
            itemDiv.appendChild(nomElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = element.description;
            itemDiv.appendChild(descriptionElement);

            const mediaDiv = document.createElement('div');
            mediaDiv.classList.add('media-galerie');

            // --- VIDÉOS ---
            if (element.videos && element.videos.length > 0) {
                element.videos.forEach(video => {
                    if (video.source === 'mp4') {
                        const videoEl = document.createElement('video');
                        
                        // ICI : On ajoute l'URL du projet devant le chemin du JSON
                        // Ex: "https://.../perfectF/" + "videos/kurocoss.mp4"
                        videoEl.src = urlBaseProjet + video.url;
                        
                        videoEl.loop = true;
                        videoEl.muted = true;
                        videoEl.autoplay = true;
                        videoEl.playsInline = true;
                        videoEl.controls = true;
                        videoEl.classList.add('media-video');
                        mediaDiv.appendChild(videoEl);
                    } 
                    // Pour YouTube, c'est déjà un lien complet, on ne touche pas
                    else if (video.source === 'youtube') {
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
                    
                    // ICI : On ajoute aussi l'URL du projet devant le chemin de l'image
                    imageElement.src = urlBaseProjet + imageUrl;
                    
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
