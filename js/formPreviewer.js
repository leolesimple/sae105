/*
 *  Copyright (c) 2024 Léo Lesimple.
 *  Tous droits réservés.
 *
 *  Ce code source est la propriété exclusive de Léo Lesimple.
 *  Il est uniquement fourni et distribué à des fins d'évaluation et de correction.
 *  Toute autre utilisation, reproduction, distribution de ce code source est interdite.
 *
 * Le présent code est strictement personnel et ne contient aucune copie de code tiers à l'exception des lignes 41 à 61, contenant un script provenant de MDN.
 *
 *  Créé le : 21/11/2024.
 */


/*
    * Fonction permettant de prévisualiser les données entrées dans le formulaire.
    * Cette fonction permet également de vérifier la validité des données entrées par l'utilisateur.
    * Si les données sont valides, elles sont envoyées à l'API de P. Gambette.
*/
function previewerForm() {
    // Code pour la prévisualisation du titre, de l'artiste et de l'année.
    const titleInput = document.getElementById('title');
    const titlePreview = document.getElementById('titlePreview');
    const emailInput = document.getElementById('email');

    // Affichage du titre dans la balises qui lui est associée.
    titleInput.addEventListener('input', () => {
        titlePreview.textContent = titleInput.value;
    });

    const artistInput = document.getElementById('artist');
    const yearInput = document.getElementById('year');
    const artistPreview = document.getElementById('artistAndYearPreview');

    artistInput.addEventListener('input', () => {
        artistPreview.textContent = artistInput.value + ' (' + yearInput.value + ')';
    });

    yearInput.addEventListener('input', () => {
        artistPreview.textContent = artistInput.value + ' (' + yearInput.value + ')';
    });

    const explanationInput = document.getElementById('why');
    const explanationPreview = document.getElementById('explanationPreview');

    explanationInput.addEventListener('input', () => {
        explanationPreview.textContent = explanationInput.value;
    });

    // Code pour la prévisualisation de l'image de couverture.
    const coverInput = document.getElementById('cover');
    const coverPreview = document.getElementById('ArtWorkpreviewed');

    // Affichage de l'image de couverture lors de la sélection d'un fichier. avec FileReader natif en JS.
    coverInput.addEventListener('change', () => {
        const file = coverInput.files[0];
        const reader = new FileReader();

        // Affichage de l'image de couverture dans la balise img.
        reader.onload = function (e) {
            coverPreview.src = e.target.result;
        }

        reader.readAsDataURL(file);
    });

    // Code pour la prévisualisation de l'URL avec prise en charge de plusieurs plateformes et affichage d'un logo personnalisé.
    const urlInput = document.getElementById('link');
    const urlPreview = document.getElementById('linkPreview');

    // Tableau associatif des plateformes de musique avec leur URL et leur logo.
    const platformURLs = {
        "music.apple.com": ["./img/musicPlatforms/AppleMusic.svg", "apple-music"],
        "open.spotify.com": ["./img/musicPlatforms/Spotify.svg", "spotify"],
        "deezer.com": ["./img/musicPlatforms/Deezer.svg", "deezer"]
    }

    urlInput.addEventListener('input', () => {
        // Récupération et analyse de l'URL entrée par l'utilisateur.
        let url = urlInput.value;
        let urlObject;

        // Vérification de la validité de l'URL.
        try {
            urlObject = new URL(url);
        } catch (e) {
            // Affichage d'un logo générique si l'URL n'est pas valide.
            urlPreview.innerHTML = `<img src="../img/musicPlatforms/generic.svg" alt="Logo de la plateforme donnée" class="unknown" width="60">`;
            return;
        }

        // Récupération du nom de domaine de l'URL.
        let platform = urlObject.hostname;

        // Affichage d'un logo générique si la plateforme n'est pas reconnue.
        if (!platformURLs[platform]) {
            urlPreview.innerHTML = `<img src="../img/musicPlatforms/generic.svg" alt="Logo de la plateforme donnée" class="unknown" width="60">`;
            return;
        }

        urlPreview.innerHTML = `<img src="${platformURLs[platform][0]}" alt="Logo de la plateforme ${platformURLs[platform][1]}" class="${platformURLs[platform][1]}" width="60">`;
        document.getElementById('linkPreview').href = url;
    });

    // Détection de l'envoi du formulaire et envoi des données
    const submitButton = document.getElementById('submit');

    submitButton.addEventListener('click', (e) => {
        // Détruire le comportement par défaut du formulaire.
        e.preventDefault();

        // Vérification de la validité des champs avec la méthode regex.
        const regex = {
            email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            year: /^[0-9]{4}$/,
            url: /^https?:\/\/(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}\/.*$/
        }

        if (!regex.email.test(emailInput.value)) {
            emailInput.classList.add('errorInput');
            if (!document.getElementById('emailEr')) {
                // Insertion d'un message d'erreur si l'email n'est pas valide juste dessous le champ.
                emailInput.insertAdjacentHTML('afterend', '<small id="emailEr" class="error">Votre entrée ne ressemble pas à un email 🫠, email ≠ adresse postale 😉.</small>');
            }

            // Suppression du message d'erreur si l'utilisateur corrige son email.
            emailInput.addEventListener('input', () => {
                emailInput.classList.remove('errorInput');
                document.getElementById('emailEr').remove();
            });

            // Arrêt de la fonction si l'email n'est pas valide, pour éviter l'envoi de données erronées.
            return;
        } else if (!regex.year.test(yearInput.value)) {
            yearInput.classList.add('errorInput');
            if (!document.getElementById('yearEr')) {
                yearInput.insertAdjacentHTML('afterend', '<small id="yearEr" class="error">Wow, vous vivez dans un autre espace temps ? Ceci n‘est pas une année ! 😬</small>');
            }

            yearInput.addEventListener('input', () => {
                yearInput.classList.remove('errorInput');
                document.getElementById('yearEr').remove();
            });

            return;
        } else if (!regex.url.test(urlInput.value)) {
            urlInput.classList.add('errorInput');
            if (!document.getElementById('urlEr')) {
                urlInput.insertAdjacentHTML('afterend', '<small id="urlEr" class="error">Ce n‘est pas un lien malhereusement, au mieux c‘est une courroie ou une corde 🥴 </small>');
            }

            urlInput.addEventListener('input', () => {
                urlInput.classList.remove('errorInput');
                document.getElementById('urlEr').remove();
            });

            return;
        } else if (coverInput.files.length === 0) {
            coverInput.classList.add('errorInput');
            if (!document.getElementById('coverEr')) {
                coverInput.insertAdjacentHTML('afterend', '<small id="coverEr" class="error">Reprenez votre couette ! On souhaite une pochette d‘album ! 💿</small>');
            }

            coverInput.addEventListener('change', () => {
                coverInput.classList.remove('errorInput');
                document.getElementById('coverEr').remove();
            });

            return;
        } else if (titleInput.value === '') {
            titleInput.classList.add('errorInput');
            if (!document.getElementById('titleEr')) {
                titleInput.insertAdjacentHTML('afterend', '<small id="titleEr" class="error">Un titre est requis pour l‘ajout !</small>');
            }

            titleInput.addEventListener('input', () => {
                titleInput.classList.remove('errorInput');
                document.getElementById('titleEr').remove();
            });

            return;
        } else if (artistInput.value === '') {
            artistInput.classList.add('errorInput');
            if (!document.getElementById('artistEr')) {
                artistInput.insertAdjacentHTML('afterend', '<small id="artistEr" class="error">Un artiste est requis pour l‘ajout !</small>');
            }

            artistInput.addEventListener('input', () => {
                artistInput.classList.remove('errorInput');
                document.getElementById('artistEr').remove();
            });
            return;
        } else if (explanationInput.value === '') {
            explanationInput.classList.add('errorInput');
            if (!document.getElementById('explanationEr')) {
                explanationInput.insertAdjacentHTML('afterend', '<small id="explanationEr" class="error">Eh oui ! Il faut toujours justifier son choix, allez hop exercice 12 page 328 ! 🥸</small>');
            }
            explanationInput.addEventListener('input', () => {
                explanationInput.classList.remove('errorInput');
                document.getElementById('explanationEr').remove();
            });
            return;
        }


        // Envoi des données via l'API de P. Gambette
        const url = new URL('http://perso-etudiant.u-pem.fr/~gambette/portrait/api.php');

        // Ajout des paramètres à l'URL
        url.searchParams.append('format', 'json');
        url.searchParams.append('login', 'lesimple');
        url.searchParams.append('courriel', emailInput.value);
        url.searchParams.append('message', explanationInput.value);

        fetch(url, {
            method: 'GET',
            mode: 'cors' // Le mode cors est activé pour permettre la communication entre les deux serveurs.
        })
            .then(response => response.json())
            .then(data => {

                if (data.status === 'success') {
                    // Affichage d'un toast de succès si l'envoi a réussi (toast provenant de ma propre librairie).
                    Toast('valid', 'Votre musique a bien été envoyée.');
                } else {
                    Toast('error', 'Une erreur est survenue lors de l\'envoi de votre musique.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}
