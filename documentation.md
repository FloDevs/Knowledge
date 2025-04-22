# Documentation du projet

## Présentation

Application Node.js avec Express et EJS permettant de gérer l’achat de cursus et le suivi de progression.

## Structure du projet 

├── backend/
│   ├── app.js                  # Configuration de l'application Express
│   ├── server.js               # Point d'entrée du serveur (écoute des ports)
│   ├── config/                 # Configuration (connexion DB, variables d'env...)
│   ├── controllers/            # Logique métier liée aux routes
│   ├── mail/                   # Gestion des envois d'emails
│   ├── middlewares/           # Middlewares personnalisés (auth, upload, etc.)
│   ├── models/                 # Schémas des données (MongoDB, Mongoose...)
│   ├── routes/                 # Définition des routes Express
│   ├── tests/                 # Test unitaires
│
├── frontend/
│   ├── admin/                  # Pages du dashboard admin
│   ├── auth/                   # Pages liées à l'authentification
│   ├── main/                   # Pages publiques principales
│   ├── partials/               # Éléments réutilisables (header, footer...)
│   ├── purchase/               # Pages liées aux achats
│   ├── index.ejs               # Page d'accueil principale
│   ├── error.ejs               # Page d'erreur générale
│   ├── 404.ejs                 # Page "Not Found"
│
├── public/
│   ├── img/                    # Images statiques
│   ├── css/                    # Feuilles de style
│   ├── js/                     # Scripts JS
│   ├── uploads/                # Fichiers uploadés
│
├── documentation.md            # Documentation du projet (ce fichier)
├── package.json                # Dépendances et scripts du projet
├── .env                        # Variables d'environnement (non commitées)




## Routes de l'application 

# Authentification (/auth)

GET	/auth/register	Affiche le formulaire d'inscription
POST	/auth/register	Enregistre un nouvel utilisateur
GET	/auth/login	Affiche le formulaire de connexion
POST	/auth/login	Authentifie l’utilisateur
GET	/auth/confirm	Confirme un compte utilisateur
GET	/auth/logout	Déconnexion de l’utilisateur

# Utilisateurs (/users)
GET	/users	Liste tous les utilisateurs
GET	/users/profile	Affiche le profil utilisateur
POST	/users/update-password	Met à jour le mot de passe
PUT	/users/update/:id	Met à jour un utilisateur
DELETE	/users/delete/:id	Supprime un utilisateur

# Thèmes (/themes)
GET	/themes	Liste tous les thèmes
POST	/themes/create	Crée un nouveau thème
GET	/themes/:id	Récupère un thème spécifique
PUT	/themes/update/:id	Met à jour un thème
DELETE	/themes/delete/:id	Supprime un thème

# Cursus (/cursus)
GET	/cursus	Liste tous les cursus
GET	/cursus/dashboard	Dashboard des cursus
POST	/cursus/create	Crée un cursus
GET	/cursus/:id	Récupère un cursus spécifique
PUT	/cursus/update/:id	Met à jour un cursus
DELETE	/cursus/delete/:id	Supprime un cursus

# Leçons (/lessons)
POST	/lessons/create	Crée une nouvelle leçon
GET	/lessons/:id	Affiche une leçon
PUT	/lessons/update/:id	Met à jour une leçon
DELETE	/lessons/delete/:id	Supprime une leçon

# Achats (/purchases)
GET	/purchases	Liste des achats
POST	/purchases	Création d’un achat
GET	/purchases/my-purchases	Liste des achats de l’utilisateur
GET	/purchases/buy/:type/:id	Achat d’un cursus ou d’une leçon
GET	/purchases/success	Page de succès après achat
GET	/purchases/cancel	Page d’annulation d’achat

# Progression (/progress)
POST	/progress/complete-lesson	Marque une leçon comme complétée
GET	/progress/cursus/:cursusId	Récupère la progression d’un cursus

# Certifications (/certifications)
GET	/certifications	Liste des certifications
GET	/certifications/my-certifications	Liste personnelle des certifications
GET	/certifications/download/:cursusId	Téléchargement d’une certification

# Admin (/admin)
GET	/admin/dashboard	Dashboard administrateur
GET	/admin/cursus	Gestion des cursus
GET	/admin/users	Gestion des utilisateurs
GET	/admin/orders	Gestion des commandes

# Panier (/cart)
POST	/cart/add/:id	Ajoute un élément au panier
POST	/cart/remove/:id	Retire un élément du panier
GET	/cart	Affiche le contenu du panier
POST	/cart/checkout	Valide et paie le panier

# Page d'accueil
GET	/	Page d'accueil
