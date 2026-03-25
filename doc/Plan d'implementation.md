# Plan d'implémentation — Roz Nettoyage

## Phase 1 : Infrastructure & Setup ✅

### 1.1 Initialisation du projet
- [x] Créer le dépôt Git et le `.gitignore`
- [x] Initialiser le projet Next.js 16 (React 19) dans `/client`
- [x] Initialiser le projet Express 5 avec TypeScript dans `/server`
- [x] Configurer les scripts npm (`dev`, `build`, `start`) pour les deux projets
- [x] Configurer TypeScript (`tsconfig.json`) pour le client et le serveur

### 1.2 Docker & Base de données
- [x] Créer le `docker-compose.yml` avec les 3 services (PostgreSQL 16, Express, Next.js)
- [x] Configurer les volumes persistants (postgres_data, node_modules, .next)
- [x] Configurer les healthchecks pour PostgreSQL et le serveur Express
- [x] Installer et configurer Prisma ORM avec l'adaptateur PostgreSQL (`@prisma/adapter-pg`)
- [x] Créer le client Prisma singleton avec cache global en dev
- [x] Créer le fichier `prisma/schema.prisma` avec le schéma initial

### 1.3 Variables d'environnement
- [x] Créer les fichiers `.env` (serveur) et `.env.local` (client) avec les variables nécessaires
- [x] Configurer dotenv dans le serveur
- [x] Configurer les variables Next.js (`NEXT_PUBLIC_*` et server-side)

---

## Phase 2 : Backend — Structure de base ✅

### 2.1 Configuration Express
- [x] Créer le point d'entrée (`server.tsx`) et l'app Express (`app.tsx`)
- [x] Configurer CORS avec l'origine `CLIENT_URL`
- [x] Configurer le body parser JSON
- [x] Créer le endpoint health check (`GET /api/health`)
- [x] Créer la classe d'erreur personnalisée `AppError`
- [x] Créer le middleware de gestion d'erreurs globale (`errorHandler`)
  - Gestion des erreurs `AppError` (status code personnalisé)
  - Gestion des erreurs Prisma (code 400)
  - Gestion des erreurs non gérées (code 500)

### 2.2 Modèle de données (Prisma)
- [x] Définir le modèle `User` (id uuid, nom, prenom, email, password, tel, dateNaissance, sexe, droit, role, state, createdAt, updatedAt)
- [x] Définir les enums `AccessLevel` (USER, COLLABORATEUR, ADMIN), `Gender` (MASCULIN, FEMININ, AUTRE), `AppointmentStatus` (PENDING, CONFIRMED, DONE, CANCELLED), `UserState` (ACTIVE, SUSPENDED)
- [x] Définir le modèle `Service` (id auto-increment, nom unique, description, prices JSON, dureeMinutes)
- [x] Définir le modèle `Appointment` (id, date, slot, gamme, prix, status, clientId, staffId, serviceId)
- [x] Définir le modèle `Review` (id, rating, comment, appointmentId unique)
- [x] Définir le modèle `BlockedSlot` (id, date, slot nullable, reason nullable, contrainte unique [date, slot])
- [x] Définir les relations entre les modèles
- [x] Exécuter `prisma generate` et `prisma db push`

---

## Phase 3 : Authentification ✅

### 3.1 Configuration Auth0
- [x] Créer l'application Auth0 (SPA + API)
- [x] Configurer les URLs de callback, logout et origins dans Auth0
- [x] Créer le module `lib/auth0.ts` côté serveur (JWKS, verifyAuth0AccessToken, getAuth0UserInfo)
- [x] Configurer l'application M2M Auth0 Management API pour le seed (create:users, read:users)

### 3.2 Middleware d'authentification (serveur)
- [x] Créer le middleware `protect` :
  - Extraction du Bearer token depuis le header Authorization
  - Vérification du JWT via JWKS Auth0
  - Récupération des infos utilisateur depuis Auth0
  - Auto-création de l'utilisateur en base si première connexion (upsert)
  - Synchronisation du profil Auth0 → base locale
  - Attachement de `req.authUser` à la requête
  - Blocage des comptes suspendus (`UserState.SUSPENDED`)
- [x] Créer le middleware `protectAdmin` (chaîne `protect` + vérification droit COLLABORATEUR ou ADMIN)
- [x] Étendre les types Express (`express.d.ts`) pour inclure `authUser`

### 3.3 Routes & Contrôleurs Auth
- [x] Créer les routes auth (`/api/auth`) :
  - `GET /me` (protégé) — retourne l'utilisateur connecté (sans mot de passe)
  - `PATCH /profile` (protégé) — mise à jour du profil
- [x] Implémenter le contrôleur `authController`

### 3.4 Auth0 côté client
- [x] Installer et configurer `@auth0/nextjs-auth0`
- [x] Créer le module `lib/auth0.ts` côté client avec les scopes (openid, profile, email, offline_access)
- [x] Configurer l'audience Auth0

---

## Phase 4 : Services (API) ✅

### 4.1 Backend
- [x] Créer les routes services (`/api/services`) : `GET /` (public)
- [x] Implémenter le contrôleur `serviceController`

### 4.2 Frontend
- [x] Créer le module `lib/api/services.ts` avec fetch et revalidation
- [x] Créer les types TypeScript pour Service (`types/service.ts`)

---

## Phase 5 : Système de réservation ✅

### 5.1 Utilitaires de planification
- [x] Créer le module `utils/dateTime.tsx` (parseSlotToMinutes, getAppointmentDate, buildDateTimeFromSlot, addMinutes, slotsOverlap)

### 5.2 Backend
- [x] Créer les routes appointments (`/api/appointments`) :
  - `POST /` (protégé) — créer un rendez-vous
  - `GET /my-appointments` (protégé) — rendez-vous de l'utilisateur connecté
  - `GET /available-slots` (protégé) — créneaux disponibles pour une date/service
  - `PATCH /:id` (protégé) — modifier un rendez-vous (service, date, créneau, gamme)
  - `PATCH /:id/cancel` (protégé) — annuler un rendez-vous
  - `POST /:id/review` (protégé) — laisser un avis
- [x] Implémenter le contrôleur `appointmentController` :
  - `createAppointment()` : validation, recherche staff disponible, vérification blocked slots, création
  - `getMyAppointments()` : avec détails service/staff/review
  - `getAvailableSlots()` : créneaux libres, exclusion journées fermées et créneaux bloqués, paramètre `excludeId`
  - `updateAppointment()` : réassignation automatique du staff
  - `cancelAppointment()` : PENDING/CONFIRMED → CANCELLED
  - `addReview()` : sur rendez-vous DONE uniquement

### 5.3 Frontend
- [x] Créer les types TypeScript pour Appointment (`types/appointment.ts`)
- [x] Créer les BFF proxy routes pour appointments

---

## Phase 6 : Frontend — Site vitrine ✅

### 6.1 Layout & Navigation
- [x] Créer le layout racine (`app/layout.tsx`) avec métadonnées, polices (IBM Plex Mono, Outfit)
- [x] Créer le layout marketing (`app/(marketing)/layout.tsx`) avec header/footer partagés
- [x] Créer le composant `SiteHeader` (sticky, navigation desktop, numéros de téléphone, icône profil mobile)
- [x] Créer la barre de navigation mobile fixe en bas (style app native, bouton central "Réserver" surélevé, compatible iPhone safe-area)
- [x] Créer le composant `SiteFooter` (liens, réseaux sociaux, email)

### 6.2 Pages marketing
- [x] Page d'accueil avec hero, services, avant/après, témoignages, à propos, CTA contact
- [x] Page Particuliers avec liste services, tarifs, durées, bouton "Réserver"
- [x] Page Professionnels avec services B2B, abonnement "À la Roz-cousse", formulaire devis
- [x] Contenu marketing externalisé dans `constants/site-content.ts`
- [x] Configurer Tailwind CSS 4 (styles `position: fixed` en inline pour compatibilité Docker+Turbopack)

---

## Phase 7 : Frontend — Espace client ✅

### 7.1 Page & Auth gate
- [x] Créer la page espace client (`app/espace-client/page.tsx`)
- [x] Redirection automatique vers `/espace-admin` si COLLABORATEUR ou ADMIN (hors try/catch pour éviter NEXT_REDIRECT)
- [x] Redirection vers `/auth/login` si non authentifié

### 7.2 Dashboard
- [x] Créer le composant `dashboard.tsx` avec onglets Réservations / Profil
- [x] Bouton de déconnexion (rouge)

### 7.3 Section Réservations
- [x] Affichage des rendez-vous à venir et passés avec statut
- [x] Modal de détail (service, date, créneau, durée, prix, technicien, statut)
- [x] Annulation en deux étapes (PENDING/CONFIRMED)
- [x] Modification (service, date, créneau, gamme) avec réassignation staff
- [x] Avis clients sur rendez-vous DONE (note 1–5 + commentaire optionnel, indicateur visuel)

### 7.4 Section Profil
- [x] Formulaire de modification (nom, prénom, email, téléphone, date de naissance, sexe)
- [x] Affichage du rôle dans l'équipe (lecture seule pour COLLABORATEUR, modifiable pour ADMIN)

### 7.5 Configuration API client
- [x] Créer le module `lib/config.ts`
- [x] Créer les BFF proxy routes pour profile, appointments, services
- [x] Créer les types TypeScript pour Auth (`types/auth.ts`) avec `droit`, `role`, `state`

---

## Phase 8 : Docker & Déploiement ✅

### 8.1 Dockerfiles
- [x] Créer le Dockerfile du serveur Express
- [x] Créer le Dockerfile du client Next.js

### 8.2 Docker Compose
- [x] Configurer le service PostgreSQL (port 5433, healthcheck)
- [x] Configurer le service serveur (port 4000, commande prisma generate + db push + dev)
- [x] Configurer le service client (port 3000, dépend du serveur healthy)
- [x] Configurer les volumes (postgres_data, node_modules, .next)

### 8.3 Script Seed
- [x] Services (5 services avec prix JSON par gamme)
- [x] Comptes staff créés simultanément dans Auth0 (M2M Management API) et PostgreSQL
- [x] 5 clients de démonstration
- [x] ~70 rendez-vous de démonstration (statuts variés, dates passées/futures)
- [x] Avis sur les rendez-vous DONE
- [x] Guard `totalExisting < 70` pour éviter les doublons

---

## Phase 9 : Espace Admin ✅

### 9.1 Page & Auth gate
- [x] Créer la page espace admin (`app/espace-admin/page.tsx`)
- [x] Redirection vers `/auth/login` si non authentifié
- [x] Redirection vers `/espace-client` si `droit === "USER"`

### 9.2 Onglet Réservations
- [x] Liste filtrée par statut (Tous, En attente, Confirmés, Terminés, Annulés) avec badges comptage
- [x] Vue filtrée : COLLABORATEUR voit uniquement ses RDV assignés, ADMIN voit tous les RDV
- [x] Actions PENDING : Confirmer (+ picker technicien pour ADMIN) / Refuser
- [x] Actions CONFIRMED : Marquer comme terminé / Annuler
- [x] Sélecteur de technicien inline (vert) avec chargement lazy de la liste staff
- [x] Agenda calendrier mensuel (desktop uniquement, `lg:block`) avec indicateurs colorés par statut
- [x] Filtrage par date au clic sur le calendrier, badge de filtre actif effaçable

### 9.3 Onglet Statistiques (ADMIN uniquement)
- [x] CA total, semaine, mois, année (`KpiCard`)
- [x] Compteurs par statut (PENDING, CONFIRMED, DONE, CANCELLED)
- [x] Taux d'annulation global
- [x] Top services avec barres de progression
- [x] Graphique d'évolution mensuelle sur 6 mois (CSS pur, sans librairie)

### 9.4 Onglet Planning (ADMIN uniquement)
- [x] Toggle Journée entière / Créneau spécifique
- [x] Fermeture d'une plage de jours (date début → date fin avec motif optionnel)
- [x] Blocage d'un créneau spécifique (sélecteur 08:00–17:30 par 30min)
- [x] Liste des fermetures groupées par date (à venir / passés)
- [x] Suppression par tag `×`
- [x] Exclusion automatique dans le formulaire de réservation côté client

### 9.5 Onglet Utilisateurs (ADMIN uniquement)
- [x] Liste tous les utilisateurs avec filtre par droit (USER / COLLABORATEUR / ADMIN)
- [x] Infos : nom, email, téléphone, droit, rôle, état, nombre de RDV
- [x] Actions : Suspendre / Réactiver, Supprimer (double confirmation)
- [x] Modal "Voir les RDV" d'un utilisateur (client + technicien)
- [x] Garde : un admin ne peut pas s'auto-suspendre ni se supprimer

### 9.6 Onglet Profil
- [x] Modification des informations personnelles (nom, prénom, email, téléphone, date de naissance, sexe)
- [x] Rôle dans l'équipe modifiable (ADMIN) depuis liste prédéfinie, lecture seule (COLLABORATEUR)

### 9.7 Backend Admin
- [x] `adminController` : `updateAppointmentStatus` avec assignation optionnelle d'un staffId
- [x] `adminStatsController` : `getStats`
- [x] `adminUserController` : `getStaff`, `getUsers`, `getUserAppointments`, `updateUserState`, `deleteUser`
- [x] `adminBlockedSlotController` : `getBlockedSlots`, `createBlockedSlot` (plage + P2002 graceful), `deleteBlockedSlot`
- [x] Routes admin dans `adminRoutes.tsx`, toutes protégées par `protectAdmin`

### 9.8 BFF Proxy Routes (Next.js)
- [x] `GET /api/admin/stats`
- [x] `GET /api/admin/staff`
- [x] `GET|POST /api/admin/blocked-slots`
- [x] `DELETE /api/admin/blocked-slots/[id]`
- [x] `GET /api/admin/users`
- [x] `DELETE /api/admin/users/[id]`
- [x] `PATCH /api/admin/users/[id]/state`
- [x] `GET /api/admin/users/[id]/appointments`

---

## Phase 10 : Notifications email _(en cours)_

- [ ] Choix du service d'envoi (Resend, Nodemailer + SMTP, ou SendGrid)
- [ ] Créer le module `utils/mailer.ts` côté serveur
- [ ] Email de confirmation au client lors de la validation d'un RDV (PENDING → CONFIRMED)
  - Contenu : service, date, créneau, prix, technicien assigné
- [ ] Rappel automatique J-1 (job cron ou service tiers)
- [ ] Variables d'environnement pour les credentials SMTP/API

---

## Phase 11 : V3 _(futur)_

- [ ] **Paiement en ligne** via Stripe (acompte ou règlement total à la réservation)
- [ ] **Fidélité / parrainage** : programme de points ou codes de parrainage
- [ ] **Abonnements professionnels** : gestion des contrats "À la Roz-cousse"
- [ ] **Multi-localisation** : plusieurs zones géographiques

---

## Récapitulatif des phases

| Phase | Contenu | Statut |
|-------|---------|--------|
| 1 | Infrastructure & Setup | ✅ Terminé |
| 2 | Backend — Structure de base | ✅ Terminé |
| 3 | Authentification (Auth0) | ✅ Terminé |
| 4 | Services (API) | ✅ Terminé |
| 5 | Système de réservation | ✅ Terminé |
| 6 | Frontend — Site vitrine | ✅ Terminé |
| 7 | Frontend — Espace client | ✅ Terminé |
| 8 | Docker & Déploiement | ✅ Terminé |
| 9 | Espace Admin | ✅ Terminé |
| 10 | Notifications email | 🔄 En cours |
| 11 | V3 (PWA, Stripe, Fidélité…) | 📋 Futur |

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, TypeScript |
| Backend | Express 5, TypeScript |
| ORM | Prisma (adaptateur pg) |
| Base de données | PostgreSQL 16 (Alpine) |
| Authentification | Auth0 (JWKS, Google OAuth, email/password) |
| Infrastructure | Docker Compose (3 services) |
| Polices | IBM Plex Mono (titres), Outfit (corps) |
