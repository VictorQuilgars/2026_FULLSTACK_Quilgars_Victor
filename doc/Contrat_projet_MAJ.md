# "Contrat" de projet Fullstack — Version mise à jour

**Nom : QUILGARS**
**Prénom : VICTOR**
**Date de mise à jour : Mars 2026**

---

## 1. Description du système

**Roz Nettoyage** est une application web de prise de rendez-vous pour une entreprise de nettoyage de véhicules et textiles (voitures, canapés, tapis) basée à Brest. Les clients réservent en ligne en choisissant un service, une date et un créneau horaire. L'application comprend deux espaces distincts : un **site vitrine marketing** public et un **espace protégé** (client + admin) sécurisé via Auth0.

Trois catégories d'utilisateurs :
- **USER** (client) : réserve et gère ses rendez-vous
- **COLLABORATEUR** (technicien nettoyeur) : accède à l'espace admin pour consulter ses interventions assignées
- **ADMIN** (fondateur) : accès complet à l'espace admin (planning, stats, utilisateurs, tous les RDV)

---

## 2. Technologies frontend

- **Next.js 16** (App Router, React Server Components, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **@auth0/nextjs-auth0** pour la gestion des sessions côté client
- Pattern **BFF (Backend For Frontend)** : les routes `app/api/*` sont des proxies Next.js qui transmettent le token Auth0 au backend Express

---

## 3. Technologies backend

- **Node.js avec Express 5**, TypeScript
- **Prisma ORM** avec adaptateur `@prisma/adapter-pg` pour l'accès à PostgreSQL
- **Auth0** pour l'authentification (vérification JWT via JWKS, auto-provision des utilisateurs en base à la première connexion)

---

## 4. Base de données

**PostgreSQL 16** (image Alpine), dockerisée via Docker Compose.

---

## 5. Autres technologies importantes

- **Auth0** (Universal Login, Google OAuth, email/password, M2M Management API pour le seed)
- **Docker Compose** (3 services : `postgres`, `server`, `client`) avec volumes persistants et healthchecks
- **Prisma** (schéma, migrations via `db push`, seed)

---

## 6. Gestion de projet

- **Versioning** : Git, un commit par fonctionnalité
- **Issues** : GitHub Issues (issues #1 à #32 créées et fermées au fil de l'avancement)
- **Styling** : Tailwind CSS v4 avec palette de couleurs custom, polices IBM Plex Mono (titres) et Outfit (corps)
- **Qualité** : ESLint (config Next.js), TypeScript strict

---

## RELEASE DE BASE — ✅ Réalisée

### 7. Fonctionnalités publiques

- Pages marketing : accueil (hero, services, avant/après, témoignages, CTA), page Particuliers (tarifs, durées), page Professionnels (B2B, formulaire devis)
- Affichage des services (nom, description, durée, grille tarifaire par gamme)
- Connexion/inscription via Auth0 (Google OAuth + email/password)

### 8. Fonctionnalités protégées

| Rôle | Accès |
|------|-------|
| **USER** | Ses rendez-vous (création, modification, annulation), son profil, avis sur prestation terminée |
| **COLLABORATEUR** | Espace admin — uniquement ses interventions assignées, changement de statut |
| **ADMIN** | Espace admin complet : tous les RDV, stats, planning, gestion des utilisateurs |

### 9. Interactions base de données

Prisma ORM avec adaptateur `@prisma/adapter-pg`. Schéma complet :

- **User** : `id` (uuid), `nom`, `prenom`, `email`, `tel`, `dateNaissance`, `sexe`, `droit` (AccessLevel), `role`, `state` (UserState)
- **Service** : `nom` (unique), `description`, `prices` (JSON — gamme→prix), `dureeMinutes`
- **Appointment** : `date`, `slot`, `gamme`, `prix`, `status`, `clientId`, `staffId` (nullable), `serviceId`
- **Review** : `rating` (1–5), `comment` (nullable), `appointmentId` (unique)
- **BlockedSlot** : `date`, `slot` (nullable — null = journée entière), `reason`, contrainte unique `[date, slot]`

Enums : `AccessLevel` (USER, COLLABORATEUR, ADMIN), `UserState` (ACTIVE, SUSPENDED), `Gender`, `AppointmentStatus` (PENDING, CONFIRMED, DONE, CANCELLED)

### 10. Authentification

Via **Auth0 Universal Login** (Google OAuth + email/password). Aucun mot de passe géré localement. À la première connexion, l'utilisateur est automatiquement créé en base (middleware `protect` via JWKS). Les comptes staff sont créés simultanément dans Auth0 (M2M) et PostgreSQL via le script seed.

---

## RELEASE AVANCÉE 1 — ✅ Réalisée

- Site vitrine complet avec header/footer, navigation desktop et barre mobile native (style app, bouton "Réserver" central surélevé, compatible iPhone safe-area)
- Système d'authentification Auth0 (Google OAuth + email/password)
- Espace client protégé : dashboard avec onglets Réservations et Profil
- Modification du profil (nom, prénom, email, téléphone, date de naissance, sexe)
- Système de réservation complet : choix du service, date (calendrier), créneau horaire, gamme tarifaire
- Attribution automatique d'un technicien disponible à la création/modification de RDV
- CRUD des rendez-vous (création, modification, annulation en deux étapes)
- Avis clients sur rendez-vous terminés (note 1–5 étoiles + commentaire optionnel)

---

## RELEASE AVANCÉE 2 — ✅ Réalisée

- **Espace admin complet** avec 4 onglets :
  - **Réservations** : liste filtrée par statut, vue différenciée COLLABORATEUR/ADMIN, actions de gestion (confirmer, assigner technicien, marquer terminé, refuser/annuler), agenda calendrier mensuel avec filtrage par date
  - **Statistiques** (ADMIN) : CA total/semaine/mois/année, compteurs par statut, taux d'annulation, top services, graphique mensuel sur 6 mois
  - **Planning** (ADMIN) : blocage de journées entières ou créneaux spécifiques, plages de fermeture multi-jours, liste groupée des fermetures, exclusion automatique dans le formulaire de réservation
  - **Utilisateurs** (ADMIN) : liste avec filtre par droit, suspension/réactivation, suppression (double confirmation), historique des RDV par utilisateur
- **Onglet Profil** dans les deux espaces (client et admin)
- **Script seed** complet : 5 services, comptes staff Auth0+DB, 5 clients démo, ~70 RDV avec statuts variés et avis

---

## EN COURS — Notifications email (Phase 10)

- Email de confirmation au client lors du passage PENDING → CONFIRMED (service, date, créneau, prix, technicien assigné)
- Rappel automatique J-1
- Choix du service d'envoi en cours (Resend / Nodemailer+SMTP / SendGrid)

---

## FUTUR — V3 (Phase 11)

- **Paiement en ligne** via Stripe (acompte ou règlement total à la réservation)
- **Programme de fidélité / parrainage** (points ou codes de parrainage)
- **Abonnements professionnels** : gestion des contrats "À la Roz-cousse"
- **PWA** (Progressive Web App)

---

## Récapitulatif de l'avancement

| Phase | Contenu | Statut |
|-------|---------|--------|
| 1–2 | Infrastructure, Docker, Backend de base | ✅ Terminé |
| 3 | Authentification Auth0 | ✅ Terminé |
| 4–5 | API Services & Réservations | ✅ Terminé |
| 6 | Site vitrine marketing | ✅ Terminé |
| 7 | Espace client | ✅ Terminé |
| 8 | Docker & Seed | ✅ Terminé |
| 9 | Espace Admin complet | ✅ Terminé |
| 10 | Notifications email | 🔄 En cours |
| 11 | PWA, Stripe, Fidélité | 📋 Futur |
