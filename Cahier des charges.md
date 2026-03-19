# Concept & Architecture

Application web de prise de rendez-vous pour une entreprise de nettoyage à domicile (véhicules, canapés, tapis, moquettes, fauteuils). Le projet utilise Express comme backend et Next.js (React) en frontend.

L'entreprise s'appelle **Roz Nettoyage**, basée à Brest et ses alentours. Elle propose des services de nettoyage intérieur de véhicules et de textiles d'ameublement (canapés, tapis, moquettes, fauteuils) à destination des particuliers et des professionnels.

## Fonctionnalités

### Site vitrine (marketing)

Le site doit servir de vitrine pour l'entreprise avec :

- Une **page d'accueil** présentant l'entreprise, ses services, des témoignages clients, une section avant/après, et un appel à l'action pour prendre contact.
- Une **page Particuliers** listant les services proposés aux particuliers avec leurs tarifs, durées et un bouton "Réserver" pour chaque service.
- Une **page Professionnels** listant les services B2B, une section abonnement "À la Roz-cousse", et un formulaire de demande de devis.
- Un **header** sticky avec navigation desktop (Accueil, Particuliers, Professionnels, Espace client), mise en avant des numéros de téléphone. Sur mobile : logo + icône profil (accès rapide à l'espace client).
- Une **barre de navigation mobile** fixée en bas de l'écran (style app native : Accueil, Particuliers, Pro, bouton central Réserver surélevé).
- Un **footer** avec liens de navigation, icônes réseaux sociaux (Facebook, Instagram), email de contact.

### Espace client

Les utilisateurs peuvent créer un compte et accéder à un espace client protégé qui contient :

- Un **dashboard** avec des onglets : Réservations, Profil.
- La possibilité de **consulter ses réservations** passées et à venir avec le statut de chaque rendez-vous.
- Un **modal de détail** pour chaque rendez-vous (service, date, créneau, durée, prix, technicien assigné, statut).
- La possibilité d'**annuler un rendez-vous** (PENDING ou CONFIRMED) avec confirmation en deux étapes.
- La possibilité de **modifier un rendez-vous** (PENDING ou CONFIRMED) : changement du service, de la date, du créneau et de la gamme, avec réassignation automatique du staff.
- La possibilité de **laisser un avis** (note 1–5 étoiles + commentaire optionnel) sur un rendez-vous terminé (DONE).
- La possibilité de **modifier son profil** (nom, prénom, email, téléphone, date de naissance, sexe).

### Système de réservation

- L'utilisateur peut **prendre un rendez-vous** en choisissant un service, une date, un créneau horaire et une gamme de prix (selon le type de véhicule ou de prestation).
- Le système **assigne automatiquement un membre du staff** disponible en vérifiant les conflits de créneaux.
- Les créneaux sont limités : **dernier créneau à 17h00**.
- Les services ont des **durées variables** (par défaut 120 minutes).
- Les prix sont **variables selon la gamme** (ex : Citadine, Berline, SUV) stockés en JSON.

### Authentification

L'authentification se fait via **Auth0** :

- Connexion via Google OAuth ou email/password gérés par Auth0.
- À la première connexion, l'utilisateur est **automatiquement provisionné** dans la base de données locale.
- Les informations du profil Auth0 (email, nom, prénom) sont synchronisées avec la base locale.
- Le backend vérifie les tokens JWT via le endpoint JWKS d'Auth0.
- Un middleware protège les routes qui nécessitent une authentification.

### Gestion des services

- Liste publique de tous les services proposés avec prix, description et durée.
- Endpoint API public pour récupérer les services (cache côté client avec revalidation toutes les 60 secondes).

## Technique

### Architecture

Le code est organisé de manière modulaire avec une séparation claire des responsabilités :

- **Backend** : Routes → Contrôleurs → Services/Utils → Prisma (ORM) → PostgreSQL
- **Frontend** : Pages (App Router Next.js) → Composants → Librairies/API → Types

### Technologies utilisées

#### Frontend
- **Next.js 16** avec App Router (React 19)
- **Tailwind CSS 4** pour le styling
- **@auth0/nextjs-auth0** pour l'authentification côté client
- **TypeScript** pour le typage statique

#### Backend
- **Express 5** avec TypeScript
- **Prisma ORM** avec adaptateur PostgreSQL (`@prisma/adapter-pg`)
- **jose** pour la vérification JWT (JWKS Auth0)
- **bcryptjs** pour le hashing (réservé pour usage futur)
- **cors** pour la gestion des origines autorisées
- **dotenv** pour les variables d'environnement
- **tsx** pour l'exécution TypeScript en développement

#### Base de données
- **PostgreSQL 16** (Alpine) via Docker

#### Infrastructure
- **Docker Compose** pour orchestrer les 3 services (PostgreSQL, Express, Next.js)
- Volumes persistants pour les données PostgreSQL et les node_modules

### Sécurité

- Vérification des tokens JWT via JWKS (Auth0)
- Middleware d'authentification sur les routes protégées
- Configuration CORS avec origine autorisée (`CLIENT_URL`)
- Gestion centralisée des erreurs avec classes d'erreur personnalisées (`AppError`)
- Validation des entrées côté serveur (format email, types, enums)

### Méthodologie

#### Frontend

Le code frontend est organisé de manière modulaire :

- **App Router** : Routes groupées par contexte (`(marketing)` pour le site vitrine, `espace-client` pour l'espace protégé).
- **Composants réutilisables** : Chaque section de page est un composant indépendant.
- **Types partagés** : Dossier `/types` avec les interfaces TypeScript pour Auth, Appointment, Service.
- **Lib** : Configuration API, client Auth0, fonctions de fetch.
- **Constants** : Contenu marketing externalisé.

#### Backend

Le code backend est organisé de manière modulaire :

- **Routes** : Définition des endpoints et association aux contrôleurs.
- **Contrôleurs** : Logique métier de chaque endpoint.
- **Middleware** : Authentification (`protect`), gestion d'erreurs (`errorHandler`).
- **Utils** : Fonctions utilitaires (gestion des dates/créneaux, classe d'erreur).
- **Lib** : Clients (Prisma, Auth0, JWT).
- **Types** : Extensions de types Express.

### Variables d'environnement

fichier .env

#### Backend (server/.env)

```
DATABASE_URL=postgresql://user:password@localhost:5433/car_wash
JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
PORT=4000
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=https://your-auth0-domain.auth0.com/api/v2/
```

#### Frontend (client/.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
API_URL_SERVER=http://server:4000/api        # URL interne Docker
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=https://your-auth0-domain.auth0.com/api/v2/
AUTH0_SECRET=your_auth0_secret
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
```

### Données

#### Modèle de données

User: id (uuid), nom, prenom, email, password (bcrypt, nullable si Auth0 uniquement), tel, dateNaissance, sexe (enum: MASCULIN, FEMININ, AUTRE), droit (enum: USER, ADMIN, SUPER_ADMIN), role (string), createdAt, updatedAt

Service: id (int auto-increment), nom (unique), description, prices (JSON - map gamme → prix), dureeMinutes (default 120)

Appointment: id (int auto-increment), date (DateTime), slot (string HH:mm), gamme (string), prix (float), status (enum: PENDING, CONFIRMED, DONE, CANCELLED), review (string nullable), clientId (FK → User), staffId (FK → User nullable), serviceId (FK → Service)

Review: id (int auto-increment), rating (int 1-5), comment (string), appointmentId (unique FK → Appointment)

#### Relations

- Un User peut avoir plusieurs Appointments (en tant que client)
- Un User peut être assigné à plusieurs Appointments (en tant que staff)
- Un Service peut être lié à plusieurs Appointments
- Un Appointment peut avoir une Review (1:1)

#### Enums

- AccessLevel: USER, ADMIN, SUPER_ADMIN
- Gender: MASCULIN, FEMININ, AUTRE
- AppointmentStatus: PENDING, CONFIRMED, DONE, CANCELLED

## Design

Le design est moderne, épuré et responsive (mobile-first).

- **Palette** : Couleurs inspirées de l'identité Roz Nettoyage (tons professionnels, contrastes soignés).
- **Typographie** : Polices IBM Plex Mono (titres/accents) et Outfit (corps de texte).
- **Layout** : Utilisation de Flexbox et Grid pour une mise en page fluide.
- **Navigation** : Header sticky avec liens principaux sur desktop. Sur mobile : icône profil dans le header + barre de navigation fixe en bas (style app native) avec un bouton central surélevé pour la réservation rapide.
- **Cards** : Utilisées pour afficher les services et les rendez-vous.
- **Responsive** : Adaptation complète mobile/tablette/desktop.
- **Sections marketing** : Hero, services, avant/après, témoignages, à propos, contact.

# Versions

## V1 ✅

* Site vitrine complet (accueil, particuliers, professionnels) avec header/footer.
* Navigation mobile : barre fixe en bas de l'écran (style app native) avec bouton central "Réserver" surélevé et icône profil dans le header.
* Système d'authentification via Auth0 (Google OAuth + email/password).
* Provisionnement automatique des utilisateurs en base à la première connexion.
* Espace client protégé avec dashboard (onglets Réservations, Profil).
* Modification du profil utilisateur (nom, prénom, email, téléphone, date de naissance, sexe).
* Liste publique des services avec tarifs et durées.
* Système de réservation avec choix du service, date (calendrier), créneau horaire et gamme de prix.
* Attribution automatique du staff disponible avec vérification des conflits de créneaux.
* Consultation des rendez-vous passés et à venir avec statut, dans un modal de détail.
* Annulation de rendez-vous (PENDING/CONFIRMED) avec confirmation en deux étapes.
* Modification de rendez-vous (PENDING/CONFIRMED) : service, date, créneau, gamme — avec réassignation du staff.
* Avis clients sur les rendez-vous terminés (note 1–5 étoiles + commentaire optionnel).
* Docker Compose pour orchestrer PostgreSQL, Express et Next.js.
* API REST avec endpoints : auth, services, appointments (CRUD, cancel, review), créneaux disponibles.
* Health check endpoint pour le monitoring.

## V2 (à venir)

* Système de notifications (email/SMS) pour rappeler les rendez-vous aux clients.
* Tableau de bord administrateur pour gérer les rendez-vous, les services et le staff.
* Gestion des disponibilités du staff (jours de congé, horaires personnalisés).
* Paiement en ligne (Stripe) pour confirmer les réservations.
* Page de gestion des services pour l'admin (CRUD services).

## V3 (futur)

* Application mobile (React Native ou PWA).
* Système de fidélité / programme de points.
* Gestion des abonnements professionnels ("À la Roz-cousse").
* Statistiques et analytics pour l'administrateur (CA, taux de remplissage, etc.).
* Multi-localisation (plusieurs zones géographiques).

## FUTUR

* Algorithme d'optimisation des tournées pour les déplacements à domicile.
* Intégration calendrier externe (Google Calendar, iCal) pour le staff et les clients.
* Chatbot d'aide à la réservation.
