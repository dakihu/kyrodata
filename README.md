# KyroData — Landing page

Site statique (HTML / CSS / JS séparés), prêt à déployer sur Vercel.

## Structure

```
kyrodata-landing/
├── index.html    → structure de la page
├── styles.css    → styles globaux, animations, responsive
├── script.js     → interactions (compteurs, carrousel, FAQ, formulaire…)
└── README.md
```

Le fichier `index.html` charge les polices **Inter** et **JetBrains Mono**
depuis Google Fonts (les polices d'origine étaient des fichiers opaques du
bundle et ont été remplacées par leur équivalent public).

## Déploiement sur Vercel

### Option 1 — Interface web (le plus simple)
1. Va sur https://vercel.com/new
2. Glisse-dépose le dossier `kyrodata-landing` (ou connecte le repo Git).
3. Framework Preset : **Other**. Rien d'autre à configurer.
4. Deploy.

### Option 2 — CLI
```bash
npm i -g vercel
cd kyrodata-landing
vercel          # préversion
vercel --prod   # production
```

### Option 3 — Git
Pousse le dossier dans un repo GitHub/GitLab, puis importe-le sur Vercel.
Vercel détecte automatiquement un site statique et sert `index.html`.

## Test en local

```bash
cd kyrodata-landing
python3 -m http.server 3000
# puis ouvre http://localhost:3000
```
