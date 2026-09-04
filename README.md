# Zembo Live Lounge

Crée « Zembo2.0 » : le prototype mobile d'une application sociale de divertissement en direct (Talk Shows, tables de discussion, jeux sociaux, salles communautaires). Objectif n°1 : que l'app donne la sensation d'une VRAIE app native iOS (comme TikTok), pas d'un site web. Tout le contenu est en français. Ne connecte aucun backend : données mock uniquement.

======================
1. DESIGN SYSTEM (à mettre dans index.css + tailwind.config en tokens)
======================
Identité : noir profond + or premium. L'or est un ACCENT, jamais saturant.
- --bg: #000000 ; --surface: #121212 ; --surface-2: #1A1A1A ; --elevated: #1F1F1F
- --gold: #D4AF37 ; --gold-light: #F0D77A ; --gold-dark: #A8862B ; --gold-text: #E3C062
- Dégradé or (boutons principaux, bouton +) : linear-gradient(135deg, #F5D67A 0%, #D4AF37 55%, #B8862B 100%), texte noir dessus
- Bordure or subtile : rgba(212,175,55,0.28) ; bordure neutre : rgba(255,255,255,0.08)
- Texte : primaire #FFFFFF, secondaire #9A9A9A, tertiaire #6B6B6B
- Accents sélectifs : violet #8B5CF6 (Talk Show), vert #3DDC84 (Play & Fun), bleu #3B82F6 (World Room), rose #EC4899, rouge #EF4444 UNIQUEMENT pour les badges LIVE et alertes
- Rayons : cartes 20px, boutons 14px, pills 999px
- Police : Inter (Google Fonts), poids 400/500/600/700. Titres serrés (-0.02em)
- Cartes : fond --surface, bordure 1px or subtile OU neutre, ombre très légère. Pas d'effet casino, pas de feu d'artifice, pas de gros glow.
- Wordmark « ZEMBO » : lettres capitales fines, letter-spacing 0.18em, couleur or ; à gauche un petit icône rond or (cercle avec un trait diagonal stylisé, en SVG).

======================
2. COQUILLE NATIVE (le plus important)
======================
- Conteneur app : largeur max 430px centré sur desktop (fond noir autour), plein écran sur mobile. Hauteur 100dvh, overflow hidden, le contenu scrolle à l'intérieur. Respecter env(safe-area-inset-top/bottom).
- CSS global : overscroll-behavior: none ; -webkit-tap-highlight-color: transparent ; user-select: none sur l'UI ; scrollbars masquées partout ; scroll-behavior fluide ; -webkit-overflow-scrolling: touch.
- Installer framer-motion et react-router-dom.
- Barre d'onglets basse FLOTTANTE en forme de pilule (comme un dock iOS) : fond rgba(18,18,18,0.85) + backdrop-blur, bordure neutre, rayon 999px, marges 12px, padding pour safe-area. 5 éléments : Accueil (icône maison), Live (icône ondes radio), bouton central « + » (cercle or dégradé de 60px, légèrement surélevé au-dessus du dock, ombre dorée douce), Messages (icône bulle, petit point or de notification), Profil (icône personne). Onglet actif en or avec une petite barre or de 24px sous le label ; inactifs en #9A9A9A. Icônes lucide-react, labels 11px.
- Transitions (framer-motion AnimatePresence) : changement d'onglet = fondu + translation Y 8px sur 180ms ; page « poussée » (ex. ouvrir un live) = slide depuis la droite 260ms avec easing iOS [0.32,0.72,0,1], retour = slide vers la droite ; feuille (sheet) = spring depuis le bas + fond assombri, fermeture par glissement vers le bas (drag) ou tap dehors.
- Feedback tactile : tout élément pressable (cartes, boutons, avatars, onglets) fait scale 0.96 pendant l'appui (whileTap), 80ms.
- Carrousels horizontaux : scroll-snap-type x mandatory, snap-align start, gouttières 16px, scrollbar invisible.
- Skeletons shimmer (or très sombre) pendant 500ms simulés au premier chargement de chaque page.
- Header : sticky, fond noir avec backdrop-blur quand on scrolle.
- Routes : « / » Accueil, « /live » Live, « /messages », « /profile », « /world », « /play », « /talk-show/:id », « /table/:id », « /quiz/:id ». Pour l'instant, les pages autres que l'Accueil affichent un placeholder propre (header ZEMBO + titre + texte « Bientôt ») avec le même dock. On les construira une par une ensuite.
- Le bouton « + » central ouvre la feuille de création (section 4).

======================
3. PAGE D'ACCUEIL (route « / ») — reproduire fidèlement, dans cet ordre
======================
a) Header : à gauche icône rond or + wordmark « ZEMBO » ; à droite cloche avec badge or « 7 » (chiffre noir) puis icône loupe. Tout en or/blanc, fond noir.
b) Salutation : « Bonsoir Deena ✨ » en 28px bold blanc ; dessous en gris « Des vraies conversations. Des connexions réelles. » À droite une pill bordure or : icône personnes + « 1.2K en ligne » + point vert.
c) Rangée de 6 raccourcis circulaires (scroll horizontal) : cercle 64px fond #161616, bordure 1px or subtile, icône or au centre (lucide : flame, mic, users, gamepad-2, globe, smile). Sous chaque cercle : label blanc 13px puis compteur gris 12px. Données : Débats 1.3K / Open Mic 896 / Tables 642 / Jeux 1.1K / Monde 732 / Confessions 589.
d) Fine ligne séparatrice neutre.
e) Section « EN DIRECT MAINTENANT » : à gauche icône ondes radio or + titre en capitales blanc 14px letter-spacing ; à droite « Tout voir › » en or. Carrousel de cartes live 250px de large × 360px de haut, rayon 20px, bordure or subtile : photo plein cadre (placeholder https://i.pravatar.cc/400?img=N ou unsplash portrait) avec dégradé noir en bas ; en haut à gauche pill « LIVE » (fond noir 70%, texte or, point rouge qui pulse) ; en haut à droite pill sombre « 👥 342 » ; en bas : titre blanc bold 2 lignes, catégorie en or 13px, puis rangée de 5 mini-avatars empilés + « +18 ». Données : « Peut-on pardonner une infidélité ? » / Débat / 342 / +18 ; « Storytime : Mon pire date 😅 » / Storytime / 281 / +24 ; « Open Mic — Montre ton talent 🎤 » / Open Mic / 187 / +12 ; « Argent & couple : parlons vrai » / Débat / 156 / +9. Tap sur une carte → navigue vers /talk-show/1 (transition slide).
f) Section « QUE VEUX-TU FAIRE ? » : grille 2 colonnes × 2 lignes, cartes carrées rayon 20px, fond --surface, bordure or subtile. Chaque carte : zone illustration en haut (icône lucide 40px dans un halo doux de la couleur d'accent), titre en capitales bold or 15px, sous-titre gris 12px 2 lignes, en bas une petite pill sombre avec icône personnes + nombre. Cartes : TALK SHOW (halo violet, icône mic) « Débats, Opinions, Confessions » 124 ; ZEMBO TABLES (halo or, icône users-round) « Petites discussions en groupe » 86 ; PLAY & FUN (halo bleu→rose, icône gamepad-2) « Jeux, Quizz, Défis » 212 ; WORLD ROOM (halo or, icône globe) « Rencontre des gens du monde entier » 309. Tap → /talk-show/1, /table/1, /play, /world.
g) Section « TABLES POPULAIRES » : icône table or + titre capitales ; à droite « Rejoindre une table » en or + petit rond or avec « + ». Carrousel de cartes 250px : photo de groupe en haut (placeholder unsplash people/dinner) avec, centré sur la photo, un badge circulaire 64px fond noir bordure or contenant icône personnes + « 6/6 » en or ; dessous titre blanc bold 2 lignes, sous-titre or 12px, puis bouton outline or plein largeur « Rejoindre ». Données : « L'amour aujourd'hui : qu'est-ce qui change ? » Table de discussion 6/6 ; « Argent & couple : parlons vrai » Table de discussion 5/6 ; « Voyage : ton pays préféré et pourquoi ? » Table fun 6/6.
h) Section « POUR TOI » (icône étoile or) ; à droite « Personnaliser » en or + icône sliders. Bannière plein largeur rayon 20px, fond dégradé très sombre avec léger reflet or dans les coins, bordure or subtile : icône ✨ or à gauche, texte blanc « Rejoins des conversations qui correspondent à tes intérêts. », bouton or dégradé « Découvrir » texte noir à droite.
i) Espace bas de 110px pour ne pas passer sous le dock.

======================
4. FEUILLE « + » (création) — reproduire fidèlement
======================
S'ouvre depuis le bouton + : sheet plein écran qui monte du bas (spring), fond noir, le dock reste visible. Contenu :
- Petit wordmark « ZEMBO » or centré en haut.
- Titre centré 30px bold : « Que veux-tu » (blanc) puis « créer aujourd'hui ? » (or) sur deux lignes.
- Sous-titre gris centré : « Partage, joue, débat, connecte-toi avec ta communauté ✨ ».
- Grille 2×2 de grandes cartes (hauteur ~210px, rayon 22px, fond --surface) avec une bordure 1px de la couleur d'accent et un halo très léger de cette couleur : 
  • Talk Show (or) — icône mic — « Lance un débat, une discussion ou ton émission en direct. » — chips : Débat, Storytime, Open Mic — bouton rond or avec flèche →
  • Zembo Table (violet) — icône table/users — « Réunis 4 à 10 personnes autour d'une table interactive. » — chips : Discussions, Jeux, Cartes — bouton rond violet →
  • Play & Fun (vert) — icône gamepad — « Lance un jeu et défie ta communauté. » — chips : Quiz, Défis, Tu préfères ? — bouton rond vert →
  • World Room (bleu) — icône globe — « Crée un espace communautaire autour d'un thème, d'une ville ou d'une passion. » — chips : Culture, Ville, Communauté — bouton rond bleu →
  Chips : pill fond #1F1F1F texte blanc 11px. Titre carte blanc 20px bold, description gris 13px.
- Dessous, une rangée pleine largeur rayon 20px bordure neutre : icône calendrier orange à gauche, « Planifier un événement » blanc bold + pill « Bientôt », sous-titre gris « Programme un Live pour plus tard », chevron › à droite.
- Bouton rond « X » centré (fond #1A1A1A, bordure neutre) sous la rangée pour fermer.
- Tap sur une carte → ferme la sheet puis navigue vers la route correspondante.

======================
5. QUALITÉ
======================
- Composants réutilisables : AppShell, TabBar, ScreenHeader, LiveCard, TableCard, CategoryCircle, SectionTitle, Sheet, Skeleton, PressableScale.
- Aucun texte en anglais dans l'UI. Aucune scrollbar visible. Aucun élément qui déborde sur 390px de large.
- Pense « app », pas « site » : pas de liens soulignés, pas de hover states, tout au tap.
Commence par livrer la coquille + l'Accueil + la feuille « + » complets et polis.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://zembolounge.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/77440460-217d-4771-96f2-b713b83aac97).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
