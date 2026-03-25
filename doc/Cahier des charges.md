# Concept & Architecture

Application web de prise de rendez-vous pour une entreprise de nettoyage à domicile (véhicules, canapés, tapis, moquettes, fauteuils). Le projet utilise Express comme backend et Next.js (React) en frontend.

L'entreprise s'appelle **Roz Nettoyage**, basée à Brest et ses alentours. Elle propose des services de nettoyage intérieur de véhicules et de textiles d'ameublement (canapés, tapis, moquettes, fauteuils) à destination des particuliers et des professionnels.

## Fonctionnalités

### Site vitrine (marketing)

Le site sert de vitrine pour l'entreprise avec :

- Une **page d'accueil** présentant l'entreprise, ses services, des témoignages clients, une section avant/après, et un appel à l'action pour prendre contact.
- Une **page Particuliers** listant les services proposés aux particuliers avec leurs tarifs, durées et un bouton "Réserver" pour chaque service.
- Une **page Professionnels** listant les services B2B, une section abonnement "À la Roz-cousse", et un formulaire de demande de devis.
- Un **header** sticky avec navigation desktop (Accueil, Particuliers, Professionnels, Mon espace), mise en avant des numéros de téléphone. Sur mobile : logo + icône profil à droite (accès rapide à l'espace personnel).
- Une **barre de navigation mobile** fixée en bas de l'écran (style app native : Accueil, Particuliers, Pro, bouton central Réserver surélevé). Compatible iPhone avec `env(safe-area-inset-bottom)`.
- Un **footer** avec liens de navigation, icônes réseaux sociaux (Facebook, Instagram), email de contact.

### Espace client

Les utilisateurs (rôle USER) accèdent à un espace protégé `/espace-client` avec :

- Un **dashboard** avec des onglets : Réservations, Profil.
- La possibilité de **consulter ses réservations** passées et à venir avec le statut de chaque rendez-vous.
- Un **modal de détail** pour chaque rendez-vous (service, date, créneau, durée, prix, technicien assigné, statut).
- La possibilité d'**annuler un rendez-vous** (PENDING ou CONFIRMED) avec confirmation en deux étapes.
- La possibilité de **modifier un rendez-vous** (PENDING ou CONFIRMED) : changement du service, de la date, du créneau et de la gamme, avec réassignation automatique du staff.
- La possibilité de **laisser un avis** (note 1–5 étoiles + commentaire optionnel) sur un rendez-vous terminé (DONE). Un indicateur visuel sur la carte invite à laisser un avis.
- La possibilité de **modifier son profil** (nom, prénom, email, téléphone, date de naissance, sexe).
- **Redirection automatique** vers `/espace-admin` si l'utilisateur connecté est COLLABORATEUR ou ADMIN.

### Espace admin

Les membres du personnel (COLLABORATEUR et ADMIN) accèdent à un espace dédié `/espace-admin` avec plusieurs onglets :

#### Onglet Réservations
- Liste des rendez-vous filtrée par statut (Tous, En attente, Confirmés, Terminés, Annulés) avec badges de comptage.
- Pour les **COLLABORATEUR** : uniquement les rendez-vous qui leur sont assignés.
- Pour les **ADMIN (fondateurs)** : tous les rendez-vous de tous les clients et techniciens.
- Actions selon le statut :
  - PENDING → Confirmer (avec sélection du technicien) ou Refuser
  - CONFIRMED → Marquer comme terminé ou Annuler
- **Agenda calendrier** (desktop) affiché à droite de la liste avec navigation mensuelle, indicateurs colorés par statut, filtre par date au clic.

#### Onglet Statistiques _(ADMIN uniquement)_
- Chiffre d'affaires par période (semaine, mois, année, total).
- Compteurs de rendez-vous par statut.
- Taux d'annulation global.
- Classement des services les plus demandés avec barres de progression.
- Graphique d'évolution mensuelle sur 6 mois.

#### Onglet Planning _(ADMIN uniquement)_
- Gestion des fermetures : journée entière ou créneau spécifique.
- Possibilité de fermer une plage de jours (date début → date fin) avec motif optionnel.
- Liste des fermetures à venir et passées avec suppression par tag.
- Les journées fermées et créneaux bloqués sont exclus automatiquement du formulaire de réservation côté client.

#### Onglet Utilisateurs _(ADMIN uniquement)_
- Liste de tous les utilisateurs de la plateforme (clients, collaborateurs, admins).
- Filtres par type d'utilisateur.
- Informations affichées : nom, email, téléphone, droit, rôle, état (actif/suspendu), nombre de RDV.
- Actions : **Suspendre / Réactiver** un compte, **Supprimer** un compte (avec double confirmation).
- **Voir les RDV** d'un utilisateur (en tant que client et en tant que technicien) via modal.
- Un admin ne peut pas s'auto-suspendre ni se supprimer.
- Les comptes suspendus ne peuvent plus se connecter (bloqués au niveau du middleware).

#### Onglet Profil
- Modification des informations personnelles (nom, prénom, email, téléphone, date de naissance, sexe).
- Modification du rôle dans l'équipe (liste prédéfinie) uniquement pour les ADMIN.
- Les COLLABORATEUR voient leur rôle en lecture seule.

### Système de réservation

- L'utilisateur peut **prendre un rendez-vous** en choisissant un service, une date, un créneau horaire et une gamme de prix (selon le type de véhicule ou de prestation).
- Le système **assigne automatiquement un membre du staff** disponible en vérifiant les conflits de créneaux.
- Les créneaux sont limités : **dernier créneau à 17h00**, par tranches de 30 minutes à partir de 8h00.
- Les services ont des **durées variables** (par défaut 120 minutes).
- Les prix sont **variables selon la gamme** (ex : Citadine, Berline, SUV) stockés en JSON.
- Les **journées fermées** et **créneaux bloqués** par les admins sont automatiquement exclus.
- Lors de la **modification** d'un RDV, le créneau actuel reste disponible (paramètre `excludeId`).

### Authentification

L'authentification se fait via **Auth0** :

- Connexion via Google OAuth ou email/password gérés par Auth0.
- À la première connexion, l'utilisateur est **automatiquement provisionné** dans la base de données locale.
- Les informations du profil Auth0 (email, nom, prénom) sont synchronisées avec la base locale.
- Le backend vérifie les tokens JWT via le endpoint JWKS d'Auth0.
- Un middleware `protect` protège les routes authentifiées et bloque les comptes suspendus.
- Un middleware `protectAdmin` (chaîne `protect` + vérification du droit) protège les routes réservées au personnel.
- Le script seed crée les comptes staff simultanément dans Auth0 (Management API) et PostgreSQL.

### Gestion des services

- Liste publique de tous les services proposés avec prix, description et durée.
- Endpoint API public pour récupérer les services (cache côté client).

## Technique

### Architecture

Le code est organisé de manière modulaire avec une séparation claire des responsabilités :

- **Backend** : Routes → Contrôleurs → Services/Utils → Prisma (ORM) → PostgreSQL
- **Frontend** : Pages (App Router Next.js) → Composants → BFF proxy routes → Types

### Technologies utilisées

#### Frontend
- **Next.js 16** avec App Router (React 19) et Turbopack
- **Tailwind CSS 4** pour le styling (styles `position: fixed` en inline pour compatibilité Docker+Turbopack)
- **@auth0/nextjs-auth0** pour l'authentification côté client
- **TypeScript** pour le typage statique

#### Backend
- **Express 5** avec TypeScript
- **Prisma ORM** avec adaptateur PostgreSQL (`@prisma/adapter-pg`)
- **jose** pour la vérification JWT (JWKS Auth0)
- **bcryptjs** pour le hashing des mots de passe (seed)
- **cors** pour la gestion des origines autorisées
- **dotenv** pour les variables d'environnement
- **tsx** pour l'exécution TypeScript en développement

#### Base de données
- **PostgreSQL 16** (Alpine) via Docker

#### Infrastructure
- **Docker Compose** pour orchestrer les 3 services (PostgreSQL, Express, Next.js)
- Volumes persistants pour les données PostgreSQL et les node_modules
- Health checks sur PostgreSQL et le serveur Express

### Sécurité

- Vérification des tokens JWT via JWKS (Auth0)
- Middleware d'authentification sur les routes protégées
- Middleware `protectAdmin` avec vérification du rôle (COLLABORATEUR ou ADMIN)
- Blocage des comptes suspendus (`UserState.SUSPENDED`) au niveau du middleware
- Configuration CORS avec origine autorisée (`CLIENT_URL`)
- Gestion centralisée des erreurs avec classes d'erreur personnalisées (`AppError`)
- Validation des entrées côté serveur (format date, types, enums, transitions de statut)
- Un ADMIN ne peut pas modifier les informations personnelles d'un autre utilisateur

### Méthodologie

#### Frontend

Le code frontend est organisé de manière modulaire :

- **App Router** : Routes groupées par contexte (`(marketing)` pour le site vitrine, `espace-client`, `espace-admin`).
- **BFF proxy routes** : Routes Next.js API qui transmettent les requêtes au backend Express avec le token Auth0.
- **Composants réutilisables** : Chaque section de page est un composant indépendant.
- **Types partagés** : Dossier `/types` avec les interfaces TypeScript pour Auth, Appointment, Service, Admin.
- **Lib** : Configuration API, client Auth0, fonctions de fetch.
- **Constants** : Contenu marketing externalisé.

#### Backend

Le code backend est organisé de manière modulaire :

- **Routes** : Définition des endpoints et association aux contrôleurs.
- **Contrôleurs** : Logique métier (`authController`, `appointmentController`, `adminController`, `adminUserController`, `adminStatsController`, `adminBlockedSlotController`).
- **Middleware** : Authentification (`protect`), autorisation admin (`protectAdmin`), gestion d'erreurs (`errorHandler`).
- **Utils** : Fonctions utilitaires (gestion des dates/créneaux, classe d'erreur).
- **Lib** : Clients (Prisma, Auth0, JWT).
- **Types** : Extensions de types Express.

### Variables d'environnement

#### Backend (server/.env)

```
DATABASE_URL=postgresql://user:password@postgres:5432/car_wash
NODE_ENV=development
CLIENT_URL=http://localhost:3000
PORT=4000
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=https://your-auth0-domain.auth0.com/api/v2/
AUTH0_MGMT_CLIENT_ID=your_mgmt_client_id
AUTH0_MGMT_CLIENT_SECRET=your_mgmt_client_secret
```

#### Frontend (client/.env.local)

```
API_URL=http://server:4000/api
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=https://your-auth0-domain.auth0.com/api/v2/
AUTH0_SECRET=your_auth0_secret
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
```

### Données

#### Modèle de données

**User** : id (uuid), nom, prenom, email, password (bcrypt), tel, dateNaissance, sexe (enum: MASCULIN, FEMININ, AUTRE), droit (enum: USER, COLLABORATEUR, ADMIN), role (string — liste prédéfinie : Co-fondateur, Technicien, Expert Nettoyage, Spécialiste Intérieur, Responsable Qualité), state (enum: ACTIVE, SUSPENDED), createdAt, updatedAt

**Service** : id (int auto-increment), nom (unique), description, prices (JSON — map gamme → prix), dureeMinutes (default 120)

**Appointment** : id (int auto-increment), date (DateTime), slot (string HH:mm), gamme (string), prix (int), status (enum: PENDING, CONFIRMED, DONE, CANCELLED), clientId (FK → User), staffId (FK → User nullable), serviceId (FK → Service), createdAt, updatedAt

**Review** : id (int auto-increment), rating (int 1–5), comment (string nullable), appointmentId (unique FK → Appointment), createdAt

**BlockedSlot** : id (int auto-increment), date (DateTime), slot (string nullable — null = journée entière fermée), reason (string nullable), createdAt. Contrainte unique `[date, slot]`.

#### Relations

- Un User peut avoir plusieurs Appointments (en tant que client)
- Un User peut être assigné à plusieurs Appointments (en tant que staff)
- Un Service peut être lié à plusieurs Appointments
- Un Appointment peut avoir une Review (1:1)

#### Enums

- **AccessLevel** : USER (client), COLLABORATEUR (technicien nettoyeur), ADMIN (fondateur — accès total)
- **UserState** : ACTIVE, SUSPENDED
- **Gender** : MASCULIN, FEMININ, AUTRE
- **AppointmentStatus** : PENDING, CONFIRMED, DONE, CANCELLED

#### Transitions de statut autorisées

- PENDING → CONFIRMED (confirmation par un admin/collaborateur assigné)
- PENDING → CANCELLED (refus)
- CONFIRMED → DONE (prestation terminée)
- CONFIRMED → CANCELLED (annulation)

## Design

Le design est moderne, épuré et responsive (mobile-first).

- **Palette** : Couleurs inspirées de l'identité Roz Nettoyage — rose primaire (`rose-primary`), rose doux (`rose-soft`), tons ardoise (`slate`).
- **Typographie** : Polices IBM Plex Mono (titres/accents) et Outfit (corps de texte).
- **Layout** : Utilisation de Flexbox et Grid pour une mise en page fluide.
- **Navigation** : Header sticky avec liens principaux sur desktop. Sur mobile : icône profil dans le header + barre de navigation fixe en bas (style app native) avec un bouton central surélevé pour la réservation rapide.
- **Cards** : Utilisées pour afficher les services et les rendez-vous.
- **Responsive** : Adaptation complète mobile/tablette/desktop. La barre de navigation mobile est masquée sur `md:` et au-dessus.
- **Sections marketing** : Hero, services, avant/après, témoignages, à propos, contact.

# Versions

## V1 ✅

- Site vitrine complet (accueil, particuliers, professionnels) avec header/footer.
- Navigation mobile : barre fixe en bas de l'écran (style app native) avec bouton central "Réserver" surélevé et icône profil dans le header.
- Système d'authentification via Auth0 (Google OAuth + email/password).
- Provisionnement automatique des utilisateurs en base à la première connexion.
- Espace client protégé avec dashboard (onglets Réservations, Profil).
- Modification du profil utilisateur (nom, prénom, email, téléphone, date de naissance, sexe).
- Liste publique des services avec tarifs et durées.
- Système de réservation avec choix du service, date (calendrier), créneau horaire et gamme de prix.
- Attribution automatique du staff disponible avec vérification des conflits de créneaux.
- Consultation des rendez-vous passés et à venir avec statut, dans un modal de détail.
- Annulation de rendez-vous (PENDING/CONFIRMED) avec confirmation en deux étapes.
- Modification de rendez-vous (PENDING/CONFIRMED) : service, date, créneau, gamme — avec réassignation du staff.
- Avis clients sur les rendez-vous terminés (note 1–5 étoiles + commentaire optionnel) avec indicateur visuel sur la carte.
- Docker Compose pour orchestrer PostgreSQL, Express et Next.js.
- API REST avec endpoints : auth, services, appointments (CRUD, cancel, review), créneaux disponibles.
- Script seed pour initialiser les services, les comptes staff (Auth0 + PostgreSQL) et les données de démonstration.

## V2 ✅

- **Espace admin** `/espace-admin` avec redirection automatique pour les COLLABORATEUR et ADMIN.
- **Dashboard réservations** : liste filtrée par statut, actions de validation/refus/completion/annulation.
- **Assignation technicien** : lors de la confirmation d'un RDV, l'ADMIN sélectionne le technicien à assigner.
- **Agenda calendrier** : visualisation mensuelle des rendez-vous avec filtrage par date (desktop).
- **Statistiques** : CA par période, compteurs par statut, taux d'annulation, top services, évolution sur 6 mois.
- **Planning** : blocage de créneaux spécifiques ou fermeture de journées/plages de jours (avec motif), exclusion automatique dans le formulaire de réservation.
- **Gestion des utilisateurs** : liste filtrée, suspension/réactivation, suppression, visualisation des RDV par utilisateur.
- **Profil admin** : modification des informations personnelles + rôle dans l'équipe (ADMIN uniquement).
- **Système de droits** : USER / COLLABORATEUR / ADMIN avec suspension de compte (`UserState`).
- **Middleware protectAdmin** + blocage des comptes suspendus.

## V2 — En cours

- **Notifications email** : confirmation de RDV au client lors de la validation, rappel automatique J-1.

## V3 (futur)

- PWA (Progressive Web App) : application installable sur mobile, support offline basique.
- Paiement en ligne via **Stripe** : acompte ou règlement total à la réservation.
- Système de fidélité / programme de parrainage.
- Gestion des abonnements professionnels ("À la Roz-cousse").
- Multi-localisation (plusieurs zones géographiques).

## FUTUR

- Algorithme d'optimisation des tournées pour les déplacements à domicile.
- Intégration calendrier externe (Google Calendar, iCal) pour le staff et les clients.
- Chatbot d'aide à la réservation.
