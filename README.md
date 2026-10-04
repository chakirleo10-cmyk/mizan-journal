# Mizan Journal

Un journal spirituel léger, pensé pour être déployé sur Netlify en version statique.

## Structure

```text
mizan-journal/
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── netlify.toml
├── README.md
└── .gitignore
```

## Déploiement Netlify

1. Créer un compte sur Netlify.
2. Glisser déposer le dossier contenant ces fichiers, ou connecter un dépôt GitHub.
3. Publier le site.
4. Pour un site statique, le dossier racine est celui qui contient `index.html`.

## Fonctionnement

- Journal personnel avec humeur / énergie / sommeil
- suivi des 5 prières
- note Qur'an & tadabbur
- adhkar / intentions / tawbah
- mini quiz quotidien
- sauvegarde locale avec `localStorage`

## Pour lancer localement

Ouvre simplement `index.html` dans le navigateur.

Ou utilise un serveur local simple :

```bash
python -m http.server 8000
```

Puis visite : http://localhost:8000
