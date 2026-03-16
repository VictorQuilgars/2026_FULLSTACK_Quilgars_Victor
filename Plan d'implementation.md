# Plan d'implémentation — Roz Nettoyage

## Phase 1 : Infrastructure & Setup

### 1.1 Initialisation du projet
- [ ] Créer le dépôt Git et le `.gitignore`
- [ ] Initialiser le projet Next.js 16 (React 19) dans `/client`
- [ ] Initialiser le projet Express 5 avec TypeScript dans `/server`
- [ ] Configurer les scripts npm (`dev`, `build`, `start`) pour les deux projets
- [ ] Configurer TypeScript (`tsconfig.json`) pour le client et le serveur

### 1.2 Docker & Base de données
- [ ] Créer le `docker-compose.yml` avec les 3 services (PostgreSQL 16, Express, Next.js)
- [ ] Configurer les volumes persistants (postgres_data, node_modules, .next)
- [ ] Configurer les healthchecks pour PostgreSQL et le serveur Express
- [ ] Installer et configurer Prisma ORM avec l'adaptateur PostgreSQL (`@prisma/adapter-pg`)
- [ ] Créer le client Prisma singleton avec cache global en dev
- [ ] Créer le fichier `prisma/schema.prisma` avec le schéma initial

### 1.3 Variables d'environnement
- [ ] Créer les fichiers `.env` (serveur) et `.env.local` (client) avec les variables nécessaires
- [ ] Configurer dotenv dans le serveur
- [ ] Configurer les variables Next.js (`NEXT_PUBLIC_*` et server-side)

---

## Phase 2 : Backend — Structure de base

### 2.1 Configuration Express
- [ ] Créer le point d'entrée (`server.tsx`) et l'app Express (`app.tsx`)
- [ ] Configurer CORS avec l'origine `CLIENT_URL`
- [ ] Configurer le body parser JSON
- [ ] Créer le endpoint health check (`GET /api/health`)
- [ ] Créer la classe d'erreur personnalisée `AppError`
- [ ] Créer le middleware de gestion d'erreurs globale (`errorHandler`)
  - Gestion des erreurs `AppError` (status code personnalisé)
  - Gestion des erreurs Prisma (code 400)
  - Gestion des erreurs non gérées (code 500)

### 2.2 Modèle de données (Prisma)
- [ ] Définir le modèle `User` (id uuid, nom, prenom, email, password, tel, dateNaissance, sexe, droit, role, createdAt, updatedAt)
- [ ] Définir les enums `AccessLevel` (USER, ADMIN, SUPER_ADMIN), `Gender` (MASCULIN, FEMININ, AUTRE), `AppointmentStatus` (PENDING, CONFIRMED, DONE, CANCELLED)
- [ ] Définir le modèle `Service` (id auto-increment, nom unique, description, prices JSON, dureeMinutes)
- [ ] Définir le modèle `Appointment` (id, date, slot, gamme, prix, status, review, clientId, staffId, serviceId)
- [ ] Définir le modèle `Review` (id, rating, comment, appointmentId unique)
- [ ] Définir les relations entre les modèles
- [ ] Exécuter `prisma generate` et `prisma db push`

---

## Phase 3 : Authentification

### 3.1 Configuration Auth0
- [ ] Créer l'application Auth0 (SPA + API)
- [ ] Configurer les URLs de callback, logout et origins dans Auth0
- [ ] Créer le module `lib/auth0.ts` côté serveur :
  - Fonction `getAuth0Config()` pour construire l'URL JWKS
  - Fonction `verifyAuth0AccessToken()` pour vérifier les JWT via JWKS (jose)
  - Fonction `getAuth0UserInfo()` pour récupérer le profil depuis `/userinfo`

### 3.2 Middleware d'authentification (serveur)
- [ ] Créer le middleware `protect` :
  - Extraction du Bearer token depuis le header Authorization
  - Vérification du JWT via JWKS Auth0
  - Récupération des infos utilisateur depuis Auth0
  - Auto-création de l'utilisateur en base si première connexion (upsert)
  - Synchronisation du profil Auth0 → base locale
  - Attachement de `req.authUser` à la requête
- [ ] Étendre les types Express (`express.d.ts`) pour inclure `authUser`

### 3.3 Routes & Contrôleurs Auth
- [ ] Créer les routes auth (`/api/auth`) :
  - `GET /me` (protégé) — retourne l'utilisateur connecté (sans mot de passe)
  - `PATCH /profile` (protégé) — mise à jour du profil
- [ ] Implémenter le contrôleur `authController` :
  - `getMe()` : retourne le user depuis `req.authUser`
  - `updateProfile()` : validation et mise à jour (email, nom, prénom, tel, dateNaissance, sexe)

### 3.4 Auth0 côté client
- [ ] Installer et configurer `@auth0/nextjs-auth0`
- [ ] Créer le module `lib/auth0.ts` côté client avec les scopes (openid, profile, email, offline_access)
- [ ] Configurer l'audience Auth0

---

## Phase 4 : Services (API)

### 4.1 Backend
- [ ] Créer les routes services (`/api/services`) :
  - `GET /` — liste tous les services (public)
- [ ] Implémenter le contrôleur `serviceController` :
  - `getServices()` : retourne tous les services avec prix, description, durée

### 4.2 Frontend
- [ ] Créer le module `lib/api/services.ts` :
  - `getServices()` : fetch avec revalidation toutes les 60 secondes
- [ ] Créer les types TypeScript pour Service (`types/service.ts`)

---

## Phase 5 : Système de réservation

### 5.1 Utilitaires de planification
- [ ] Créer le module `utils/dateTime.tsx` :
  - `parseSlotToMinutes()` : convertit "HH:mm" en minutes
  - `getAppointmentDate()` : parse "YYYY-MM-DD" en Date UTC
  - `buildDateTimeFromSlot()` : combine date + slot en DateTime
  - `addMinutes()` : ajoute des minutes à une Date
  - `slotsOverlap()` : vérifie le chevauchement de deux plages horaires

### 5.2 Backend
- [ ] Créer les routes appointments (`/api/appointments`) :
  - `POST /` (protégé) — créer un rendez-vous
  - `GET /active` (protégé) — tous les rendez-vous actifs (non annulés)
  - `GET /my-appointments` (protégé) — rendez-vous de l'utilisateur connecté
- [ ] Implémenter le contrôleur `appointmentController` :
  - `createAppointment()` :
    - Validation des champs requis (date, slot, serviceId)
    - Vérification du créneau max (17h00)
    - Validation de la gamme selon les prix du service
    - Recherche du staff disponible (ADMIN/SUPER_ADMIN sans conflit de créneau)
    - Vérification des chevauchements horaires
    - Création du rendez-vous avec assignation automatique
  - `getMyAppointments()` : rendez-vous du client avec détails service/staff
  - `getActiveAppointments()` : tous les rendez-vous non annulés

### 5.3 Frontend
- [ ] Créer les types TypeScript pour Appointment (`types/appointment.ts`)

---

## Phase 6 : Frontend — Site vitrine

### 6.1 Layout & Navigation
- [ ] Créer le layout racine (`app/layout.tsx`) avec métadonnées, polices (IBM Plex Mono, Outfit)
- [ ] Créer le layout marketing (`app/(marketing)/layout.tsx`) avec header/footer partagés
- [ ] Créer le composant `SiteHeader` :
  - Navigation : Accueil, Particuliers, Professionnels
  - Mise en avant des numéros de téléphone
  - Indicateur de page active
  - Menu hamburger responsive (mobile)
- [ ] Créer le composant `SiteFooter` :
  - Thème sombre
  - Liens de navigation
  - Icônes Facebook/Instagram
  - Email de contact

### 6.2 Page d'accueil
- [ ] Créer la page d'accueil (`app/(marketing)/page.tsx`)
- [ ] Créer les composants :
  - `landing-page.tsx` : composition principale
  - `hero.tsx` : section hero
  - `services-overview.tsx` : aperçu des services
  - `before-after.tsx` : galerie avant/après
  - `why-choose-us.tsx` : arguments de vente
  - `testimonials.tsx` : témoignages clients
  - `about.tsx` : à propos de l'entreprise
  - `contact-cta.tsx` : appel à l'action contact
  - `contact-form.tsx` : formulaire de contact

### 6.3 Page Particuliers
- [ ] Créer la page (`app/(marketing)/particuliers/page.tsx`)
- [ ] Créer les composants :
  - `particuliers-page.tsx` : liste des 5 services avec prix/durées
  - `service-card.tsx` : carte de service individuelle avec bouton "Réserver"
  - Section CTA contact en bas de page
- [ ] Layout en grille responsive

### 6.4 Page Professionnels
- [ ] Créer la page (`app/(marketing)/professionnels/page.tsx`)
- [ ] Créer les composants :
  - `professionnels-page.tsx` : services B2B
  - `pro-service-card.tsx` : carte de service professionnel
  - `subscription-section.tsx` : section abonnement "À la Roz-cousse"
  - Formulaire de demande de devis

### 6.5 Redirections
- [ ] Configurer les redirections 301 :
  - `/services` → `/particuliers`
  - `/contact` → `/professionnels`

### 6.6 Contenu
- [ ] Créer le fichier de constantes `constants/site-content.ts` avec le contenu marketing
- [ ] Configurer Tailwind CSS 4

---

## Phase 7 : Frontend — Espace client

### 7.1 Auth gate
- [ ] Créer la page espace client (`app/espace-client/page.tsx`)
- [ ] Créer le composant `auth-gate.tsx` : redirige vers la connexion si non authentifié

### 7.2 Dashboard
- [ ] Créer le composant `espace-client-page.tsx` : wrapper avec auth gate
- [ ] Créer le composant `dashboard.tsx` :
  - Affichage du nom et email de l'utilisateur
  - Bouton de déconnexion
  - Onglets : Réservations, Profil, Informations

### 7.3 Section Réservations
- [ ] Créer le composant `reservations-section.tsx` :
  - Séparation rendez-vous à venir / passés
  - Badges de statut stylisés (PENDING, CONFIRMED, DONE, CANCELLED)
  - Lien vers la page de réservation si aucun rendez-vous

### 7.4 Section Profil
- [ ] Créer le composant `profile-section.tsx` :
  - Formulaire de modification du profil
  - Champs : nom, prénom, email, téléphone, date de naissance, sexe
  - Validation et soumission vers `PATCH /api/auth/profile`

### 7.5 Configuration API client
- [ ] Créer le module `lib/config.ts` :
  - URL API serveur (SSR) vs client (browser)
  - Fallback par défaut
- [ ] Créer la route API Next.js `app/api/profile/route.ts` (proxy)
- [ ] Créer les types TypeScript pour Auth (`types/auth.ts`)

---

## Phase 8 : Docker & Déploiement

### 8.1 Dockerfiles
- [ ] Créer le Dockerfile du serveur Express
- [ ] Créer le Dockerfile du client Next.js

### 8.2 Docker Compose
- [ ] Configurer le service PostgreSQL (port 5433, healthcheck)
- [ ] Configurer le service serveur (port 4000, commande prisma generate + db push + dev)
- [ ] Configurer le service client (port 3000, dépend du serveur healthy)
- [ ] Configurer les volumes (postgres_data, node_modules, .next)
- [ ] Tester le démarrage complet avec `docker-compose up --build`

### 8.3 README
- [ ] Rédiger le README avec instructions de lancement Docker
- [ ] Documenter les prérequis (fichiers .env)

---

## Récapitulatif des phases

| Phase | Contenu | Priorité |
|-------|---------|----------|
| 1 | Infrastructure & Setup | Critique |
| 2 | Backend — Structure de base | Critique |
| 3 | Authentification (Auth0) | Critique |
| 4 | Services (API) | Haute |
| 5 | Système de réservation | Haute |
| 6 | Frontend — Site vitrine | Haute |
| 7 | Frontend — Espace client | Haute |
| 8 | Docker & Déploiement | Moyenne |

---

## Stack technique résumée

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Express 5, TypeScript |
| ORM | Prisma (adaptateur pg) |
| Base de données | PostgreSQL 16 |
| Authentification | Auth0 (JWKS, Google OAuth) |
| Infrastructure | Docker Compose |
| Polices | IBM Plex Mono, Outfit |
