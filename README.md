# Knowledge Learning – Plateforme e-learning

## Présentation

Ce projet est une plateforme d’e-learning/e-commerce permettant :
- aux utilisateurs de s’inscrire, d’acheter des cursus ou des leçons,
- de suivre leur progression,
- et d’obtenir des certifications une fois un cursus terminé.

Le projet utilise **Node.js**, **Express**, **MongoDB** et le moteur de templates **EJS**.

---

## Prérequis

Avant de lancer le projet, assurez-vous d’avoir :

- [Node.js](https://nodejs.org/) (v18.x ou supérieur)
- [MongoDB](https://www.mongodb.com/) installé et lancé localement
- Un compte Stripe (clé API test) si vous activez le paiement
- Git (pour cloner le dépôt)

---

## Installation

1. Clonez le repository :

```bash
git clone https://github.com/FloDevs/Knowledge
cd Knowledge
```

2. Installez les dépendances :

```bash 
npm install
```
3. Créer et Configurer le fichier .env à la racine :

MONGODB_URI= URL DE VOTRE BASE DE DONNEES
JWT_SECRET= VOTRE CODE SECRET JWT
SESSION_SECRET= VOTRE CODE SECRET DE SESSION
EMAIL_USER= VOTRE EMAIL POUR ENVOYER LA CONFIRMATION DU MAIL CLIENT 
EMAIL_PASS= MOT DE PASSE DE VOTRE EMAIL (POUR LES SERVICES)
BASE_URL=http://localhost:3000/auth OU VOTRE NOM DE SERVICE SI HEBERGE AVEC à la fin /auth 
STRIPE_SECRET_KEY= VOTRE CLE SECRETE DE TEST FOURNI PAR STRIPE
DOMAIN=http://localhost:3000 OU VOTRE NOM DE SERVICE SI HEBERGE
NODE_ENV=production   # Mettre "production" si le projet est hébergé. Laisser vide ou ne pas inclure pour un usage local.

4. Importer les données json contenu dans le dossier "data" :

Lancer le script present dans le dossier scripts avec :

```bash 
node scripts/importData.js

```
Crée un utilisateur admin avec :

```bash 
node scripts/createAdmin.js

```

Cette admin pourra se connecter avec ces identifiants:

email= admin@example.com
mot de passe = Superpassword1!

Crée un achat pour initialisé la base de donnée avec le reste des models :

```bash 
node scripts/createPurchase.js

```

5. Lancer le serveur :

```bash 
npm start

```
Le serveur est disponible sur le port 3000 à l'adresse http://localhost:3000 si vous êtes en local.

