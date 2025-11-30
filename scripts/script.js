document.addEventListener('DOMContentLoaded', () => {
    const conteneur = document.getElementById('contenu-dynamique');
    const boutonsFiltre = document.querySelectorAll('.btn-filtre'); // Les boutons normaux
    
    // --- Éléments pour le Hasard ---
    const btnHasard = document.getElementById('btn-hasard');
    const modal = document.getElementById('modal-choix');
    const btnFermerModal = document.getElementById('btn-fermer-modal');
    const boutonsChoix = document.querySelectorAll('.btn-choix'); // Les boutons dans le pop-up

    // --- CONFIGURATION ---
    const urlBaseProjet = "https://mai-fan.github.io/perfectF/"; 

    let toutesLesDonnees = [];

    // --- 1. CHARGEMENT DES DONNÉES ---
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
            conteneur.innerHTML = '<p style="color:white; text-align:center;">Erreur chargement.</p>';
        });

    // --- 2. GESTION DES FILTRES CLASSIQUES ---
    boutonsFiltre.forEach(btn => {
        // On ignore le bouton hasard ici, il a sa propre logique
        if(btn.id === 'btn-hasard') return;

        btn.addEventListener('click', () => {
            boutonsFiltre.forEach(b => b.classList.remove('actif'));
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

    // --- 3. LOGIQUE DU BOUTON HASARD ---
    
    // A. Ouvrir le modal
    btnHasard.addEventListener('click', () => {
        modal.classList.remove('cache'); // On enlève la classe qui cache
    });

    // B. Fermer le modal (Bouton Annuler)
    btnFermerModal.addEventListener('click', () => {
        modal.classList.add('cache');
    });

    // C. Quand on clique sur un choix dans le modal (Reel, Anime, Peu importe)
    boutonsChoix.forEach(btn => {
        btn.addEventListener('click', () => {
            const choix = btn.getAttribute('data-choix');
            let candidats = [];

            // 1. On filtre selon le choix
            if (choix === 'tout') {
                candidats = toutesLesDonnees;
            } else {
                candidats = toutesLesDonnees.filter(item => item.type === choix);
            }

            // 2. Vérification de sécurité
            if (candidats.length === 0) {
                alert("Aucun élément trouvé pour cette catégorie !");
                return;
            }

            // 3. TIRAGE AU SORT (Magie !)
            const indexHasard = Math.floor(Math.random() * candidats.length);
            const gagnant = candidats[indexHasard];

            // 4. On affiche SEULEMENT le gagnant
            // On le met dans un tableau [] car la fonction afficherElements attend une liste
            afficherElements([gagnant]);

            // 5. On ferme le modal et on décoche les filtres
            modal.classList.add('cache');
            boutonsFiltre.forEach(b => b.classList.remove('actif'));
            btnHasard.classList.add('actif'); // On illumine le bouton hasard
        });
    });


    // --- 4. FONCTION D'AFFICHAGE (Inchangée) ---
    function afficherElements(liste) {
        conteneur.innerHTML = '';

        if (liste.length === 0) {
            conteneur.innerHTML = '<p style="text-align:center; color: #aaa;">Rien à afficher.</p>';
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

            if (element.videos && element.videos.length > 0) {
                element.videos.forEach(video => {
                    if (video.source === 'mp4') {
                        const videoEl = document.createElement('video');
                        videoEl.src = urlBaseProjet + video.url;
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

            if (element.images && element.images.length > 0) {
                element.images.forEach(imageUrl => {
                    const imageElement = document.createElement('img');
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
