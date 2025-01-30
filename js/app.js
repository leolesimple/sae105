/*
 *  Copyright (c) 2024 Léo Lesimple.
 *  Tous droits réservés.
 *
 *  Ce code source est la propriété exclusive de Léo Lesimple.
 *  Toute reproduction, distribution, modification ou utilisation de ce code,
 *  en tout ou en partie, sans autorisation écrite préalable est strictement interdite.
 *
 * Le présent code est strictement personnel et ne contient aucune copie de code tiers.
 *
 *  Créé le : 21/11/2024.
 */

/*
    *  Fonction processData :
    * Fonction permettant de traiter les données reçues par la requête fetch en les ajoutant au DOM.
* */
function processData() {
    return function (element) {
        const section = document.createElement('section');
        section.classList.add('musicSection', `${element.id}Section`);
        section.id = element.id;
        section.setAttribute('data-bg', element.gradient_img);

        // Si l'élément est une musique, on ajoute un template spécifique à la page.
        if (element.type === 'music') {
            section.innerHTML = `
            <div class="artWorkContainer" id="${element.id}Container">
                <img src="./img/artworks/${element.cover}" class="artWork" id="${element.id}Artwork" alt="ArtWork de l'album ${element.title} de ${element.artist}.">
                <a href="${element.AppleMusicURL}" target="_blank" class="badge" id="${element.id}Badge">
                    <img src="./img/badgeAppleMusic.svg" alt="Ecouter ${element.title} sur Apple Music" width="150">
                </a>
                <div class="audio-player" id="${element.id}Player">
                    <div id="${element.id}ProgressCircle" class="progress-circle"></div>
                    <button  aria-label="Play/Pause" title="Play/pause" id="${element.id}PlayPauseBtn" class="play-pause-btn"></button>
                    <audio id="${element.id}Audio" src="./music/${element.musicAudio15Sec}"></audio>
                </div>
            </div>
            <h1 class="hugeTitle centered ${element.theme === 'light' ? 'light' : ''}" id="${element.id}Title">${element.title}</h1>
            <h2 class="hugeTitle centered artistName ${element.theme === 'light' ? 'light' : ''}" id="${element.id}Artist">${element.artist} (${element.year})</h2>
            <p class="albumText ${element.theme === 'light' ? 'light' : ''}" id="${element.id}Text">${element.explanation}</p>
        `;

            // Ajout de la section au DOM
            document.querySelector('main').appendChild(section);

            // Activation et initialisation des événements au scroll.
            handleScrollForSection(element.id);

            // Activation des contrôles audio
            setupAudioControls(element.id);
        } else {
            // Sinon on ajoute l'élément brut à la page en admettant que le contenu est clé en main.
            document.querySelector('aside').innerHTML += element.html;

            // Initialisation des éléments du footer et du formulaire.
            if (element.id === 'form') {
                previewerForm();
            } else if (element.id === 'footer') {
                initFooter();
            }
        }
    }
}

/*
    *  Fonction setupAudioControls :
    * Fonction permettant d'initialiser les contrôles audio pour un élément donné.
    * @param {string} id - L'identifiant de l'élément audio.
*/
function setupAudioControls(id) {
    const audio = document.getElementById(`${id}Audio`);
    const playPauseBtn = document.getElementById(`${id}PlayPauseBtn`);
    const progressCircle = document.getElementById(`${id}ProgressCircle`);

    // Gestion de l'événement de clic sur le bouton play/pause
    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) {
            // Pause tous les autres audios
            document.querySelectorAll('audio').forEach((otherAudio) => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                    const otherPlayBtn = document.getElementById(`${otherAudio.id.replace('Audio', 'PlayPauseBtn')}`);
                    otherPlayBtn.classList.remove("pause");
                }
            });

            // Joue l'audio actuel
            audio.play();
            playPauseBtn.classList.add("pause");
        } else {
            // Met en pause l'audio actuel
            audio.pause();
            playPauseBtn.classList.remove("pause");
        }
    });

    // Gestion de l'événement de mise à jour du temps de l'audio
    audio.addEventListener("timeupdate", () => {
        const progress = (audio.currentTime / audio.duration) * 360;
        progressCircle.style.background = `conic-gradient(rgba(255, 255, 255, 0.17) ${progress}deg, rgba(255, 255, 255, 0.17) ${progress}deg 360deg)`;
    });

    // Remet le bouton play à son état initial à la fin de l'audio
    audio.addEventListener("ended", () => {
        playPauseBtn.classList.remove("pause");
    });
}

function handleScrollForSection(idSection) {
    let isBodyScrollActive = true;
    let main = document.querySelector('main');
    let body = document.querySelector('body');

    // Gestion du scroll du main et du background
    window.addEventListener('scroll', function () {
        let scroll = window.scrollY;
        let scrollLimit = window.innerHeight * 2; // 200vh

        // Animation du main en fonction du scroll du body
        // On utilise requestAnimationFrame pour éviter les problèmes de performances.
        window.requestAnimationFrame(function () {
            if (scroll < scrollLimit && isBodyScrollActive) {
                let radius = (scroll / scrollLimit) * 20;
                let position = (scroll / scrollLimit) * 20;
                main.style.borderRadius = `${radius}px`;
                main.style.position = 'fixed';
                main.style.top = `${position}px`;
                main.style.right = `${position}px`;
                main.style.left = `${position}px`;
                main.style.bottom = `${position}px`;
                main.style.height = `calc(100vh - ${position * 2}px)`;
            } else if (scroll >= scrollLimit && isBodyScrollActive) {
                main.classList.add('scrolled');
                body.style.overflow = 'hidden';
                isBodyScrollActive = false;
            }
        });

        let lastMainScrollTop = 0;

        // Lorsque le main est scrollé, on attribue la couleur de fond de la section en fonction du scroll et on fige l'animation entre main et body.
        main.addEventListener('scroll', function () {
            let mainScroll = main.scrollTop;

            window.requestAnimationFrame(function () {
                if (mainScroll < lastMainScrollTop && mainScroll <= 0 && !isBodyScrollActive) {
                    main.classList.remove('scrolled');
                    body.style.overflow = 'scroll';
                    isBodyScrollActive = true;
                }

                lastMainScrollTop = mainScroll;

                // Récupération des sections et de leurs backgrounds, selon le scroll du main on change le background du main en visant la section la plus visible à l'écran.
                let sections = document.querySelectorAll('section.musicSection');
                let sectionBackgrounds = Array.from(sections).map(section => section.getAttribute('data-bg'));
                let currentIndex = Math.floor(mainScroll / (135 * window.innerHeight / 100));

                if (currentIndex < sectionBackgrounds.length) {
                    main.style.backgroundImage = `url(./img/gradients/${sectionBackgrounds[currentIndex]})`;
                }
            });
        });
    });

    let lastMainScrollTop = 0;

    main.addEventListener('scroll', function () {
        let mainScroll = main.scrollTop;

        window.requestAnimationFrame(function () {
            if (mainScroll < lastMainScrollTop && mainScroll <= 0 && !isBodyScrollActive) {
                main.classList.remove('scrolled');
                body.style.overflow = 'scroll';
                isBodyScrollActive = true;
            }

            lastMainScrollTop = mainScroll;

            let section = document.querySelector(`#${idSection}`);
            let sectionBg = section.getAttribute('data-bg');

            if (mainScroll >= section.offsetHeight * 0.3) {
                main.style.backgroundImage = `url(./img/gradients/${sectionBg})`;
            } else {
                main.style.backgroundImage = 'url(./img/gradients/143.jpg)';
            }
        });
    });

    let artwork = document.getElementById(`${idSection}Artwork`);
    let container = document.getElementById(`${idSection}Container`);
    let section = document.getElementById(idSection);
    let artist = document.getElementById(`${idSection}Artist`);
    let title = document.getElementById(`${idSection}Title`);
    let badge = document.getElementById(`${idSection}Badge`);
    let player = document.getElementById(`${idSection}Player`);

    /*
     Si l'artwork est visible au milieu (horizontalement) de la fenêtre, on ajoute des classes pour afficher la step two, soit le texte, le fichier audio, l'artwork plus petit et le badge.
     On ajoute également une classe pour afficher le texte de l'artiste.
     Si l'artwork se retrouve dans la moitié basse de la fenêtre, on revient au style initial.
     */
    main.addEventListener('scroll', function () {
        let rect = artwork.getBoundingClientRect();
        let artworkMiddle = rect.top + rect.height / 2;
        let viewportMiddle = window.innerHeight / 2;

        let titleRect = title.getBoundingClientRect();
        let titleMiddle = titleRect.top + titleRect.height / 2;
        let titleViewportMiddle = window.innerHeight / 2;

        if (artworkMiddle <= viewportMiddle || titleMiddle <= titleViewportMiddle) {
            artwork.classList.add('smallArtwork');
            section.classList.add('stepTwo');
            container.classList.add('positionUp');
            artist.classList.add('artistAppear');
            badge.classList.add('badgeAppear');
            player.classList.add('playerAppear');
        } else {
            artwork.classList.remove('smallArtwork');
            section.classList.remove('stepTwo');
            container.classList.remove('positionUp');
            artist.classList.remove('artistAppear');
            badge.classList.remove('badgeAppear');
            player.classList.remove('playerAppear');
        }

        let artistRect = artist.getBoundingClientRect();
        let artistMiddle = artistRect.top + artistRect.height / 2;
        let artistViewportMiddle = window.innerHeight / 2;

        let musicalText = document.getElementById(`${idSection}Text`);

        if (artistMiddle <= artistViewportMiddle) {
            musicalText.classList.add('musicalTextAppear');
        } else {
            musicalText.classList.remove('musicalTextAppear');
        }
    });
}


// Récupération des données du fichier JSON via la méthode fetch
fetch('./json/music.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(processData());
    });

// On bloque sommairement Safari qui ne sait pas gérer les animations de manière fluide.
window.addEventListener('DOMContentLoaded', () => {
    if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
        Toast('error', 'Ce site n’est pas compatible avec Safari. Veuillez utiliser un autre navigateur.');
        document.querySelector('body').classList.add('safari');
    }
});

// Initialisation des éléments du footer et du formulaire ainsi que de l'élément permettant d'y accéder.
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    const aside = document.querySelector('aside');

    // Gestion de l'affichage du bouton pour remonter en haut de la page et accéder au formulaire/droits.
    main.addEventListener('scroll', () => {
        let scrollToFormBtn = document.getElementById('scrollToForm');
        //scrollTop at 50% of the main scroll
        if (main.scrollTop >= main.scrollHeight / 2) {
            scrollToFormBtn.classList.add('visible');
        } else {
            scrollToFormBtn.classList.remove('visible');
        }
    });

    document.getElementById("formButton").addEventListener('click', () => {
        main.classList.add('asideVisible');
        aside.classList.add('asideVisible');
        previewerForm();
        document.getElementById("backMusic").addEventListener('click', () => {
            main.classList.remove('asideVisible');
            aside.classList.remove('asideVisible');
        });
    });

    document.getElementById("backToTop").addEventListener('click', () => {
        main.scrollTop = 2;
    });
});

function initFooter() {
    document.querySelectorAll('.toggleContent').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const text = document.getElementById(targetId);
            if (text.classList.contains('expanded')) {
                text.classList.remove('expanded');
                button.textContent = "Voir plus...";
            } else {
                text.classList.add('expanded');
                button.textContent = "Voir moins...";
            }
        });
    });
}



