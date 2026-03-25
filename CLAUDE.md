# CLAUDE.md — Roz Nettoyage

## Workflow — Avant et après chaque feature

### Avant
1. **Identifier l'issue GitHub correspondante** (si elle existe) pour bien cerner le scope attendu.
2. **Lire les fichiers concernés** avant de les modifier.

### Après
1. **Mettre à jour `doc/Plan d'implementation.md`** : cocher la tâche ou ajouter une nouvelle ligne si elle n'y figure pas.
2. **Commiter les fichiers modifiés** avec un message clair décrivant la feature.
3. **Gérer l'issue GitHub** :
   - Si une issue existante correspond → la fermer avec `gh issue close <id> --comment "Implémenté dans le commit <hash>"`.
   - Si aucune issue n'existe → créer une issue avec `gh issue create`, puis la fermer immédiatement.

---


Application web de prise de rendez-vous pour **Roz Nettoyage**, entreprise de nettoyage de véhicules et textiles à Brest. Deux espaces : site vitrine marketing + espace client/admin protégé par Auth0.

---

## Stack technique

| Couche | Techno |
|--------|--------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, TypeScript |
| Backend | Express 5, TypeScript |
| ORM | Prisma (adaptateur `@prisma/adapter-pg`) |
| Base de données | PostgreSQL 16 (Alpine, via Docker) |
| Authentification | Auth0 (JWKS, Google OAuth, email/password) |
| Infrastructure | Docker Compose — 3 services : `postgres`, `server`, `client` |
| Polices | IBM Plex Mono (titres), Outfit (corps) |

---

## Structure du projet

```
31-car-wash-app/
├── docker-compose.yml
├── doc/
│   ├── Cahier des charges.md
│   └── Plan d'implementation.md
├── server/                        # Express 5 + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── app.tsx
│       ├── server.tsx
│       ├── controllers/
│       │   ├── authController.tsx
│       │   ├── appointmentController.tsx
│       │   ├── serviceController.tsx
│       │   ├── adminController.tsx
│       │   ├── adminStatsController.tsx
│       │   ├── adminUserController.tsx
│       │   └── adminBlockedSlotController.tsx
│       ├── routes/
│       │   ├── authRoutes.tsx
│       │   ├── appointmentRoutes.tsx
│       │   ├── serviceRoutes.tsx
│       │   └── adminRoutes.tsx
│       ├── middleware/
│       │   ├── protect.tsx        # JWT + auto-provision + suspension
│       │   └── errorHandler.tsx
│       ├── lib/                   # Prisma client, Auth0, JWT
│       ├── utils/                 # dateTime.tsx, AppError
│       └── types/                 # express.d.ts (req.authUser)
└── client/                        # Next.js 16 App Router
    ├── app/
    │   ├── (marketing)/           # Site vitrine
    │   ├── espace-client/
    │   ├── espace-admin/
    │   └── api/                   # BFF proxy routes
    │       ├── appointments/
    │       ├── available-slots/
    │       ├── profile/
    │       ├── services/
    │       └── admin/
    │           ├── appointments/
    │           ├── blocked-slots/[id]/
    │           ├── staff/
    │           ├── stats/
    │           └── users/[id]/state, [id]/appointments
    ├── components/
    │   ├── marketing/
    │   ├── espace-client/
    │   │   ├── dashboard.tsx
    │   │   └── profile-section.tsx
    │   ├── espace-admin/
    │   │   ├── admin-dashboard.tsx
    │   │   ├── admin-calendar.tsx
    │   │   ├── stats-tab.tsx
    │   │   ├── blocked-slots-tab.tsx
    │   │   └── users-tab.tsx
    │   └── mobile-bottom-nav.tsx
    ├── lib/                        # config.ts, auth0.ts, fetch helpers
    ├── types/                      # auth.ts, appointment.ts, service.ts
    └── constants/                  # site-content.ts (contenu marketing)
```

---

## Modèle de données (Prisma)

### Enums

```prisma
enum AccessLevel { USER, COLLABORATEUR, ADMIN }
enum UserState   { ACTIVE, SUSPENDED }
enum Gender      { MASCULIN, FEMININ, AUTRE }
enum AppointmentStatus { PENDING, CONFIRMED, DONE, CANCELLED }
```

### Modèles

- **User** : `id` (uuid), `nom`, `prenom`, `email`, `password` (bcrypt), `tel`, `dateNaissance`, `sexe`, `droit` (AccessLevel), `role` (string prédéfini), `state` (UserState, default ACTIVE), timestamps
- **Service** : `id` (int), `nom` (unique), `description`, `prices` (JSON — gamme→prix), `dureeMinutes` (default 120)
- **Appointment** : `id` (int), `date`, `slot` (HH:mm), `gamme`, `prix`, `status`, `clientId` → User, `staffId` → User (nullable), `serviceId` → Service, timestamps
- **Review** : `id` (int), `rating` (1–5), `comment` (nullable), `appointmentId` (unique), `createdAt`
- **BlockedSlot** : `id` (int), `date`, `slot` (nullable — null = journée entière), `reason` (nullable), `createdAt`. Contrainte unique `[date, slot]`.

### Transitions de statut

```
PENDING → CONFIRMED (admin confirme + assigne technicien)
PENDING → CANCELLED (refus)
CONFIRMED → DONE    (prestation terminée)
CONFIRMED → CANCELLED (annulation)
```

---

## Authentification & Droits

- Auth0 Universal Login (Google OAuth + email/password)
- À la 1ère connexion → `upsert` automatique en base (middleware `protect`)
- **`protect`** : vérifie JWT via JWKS Auth0, attache `req.authUser`, bloque les `SUSPENDED`
- **`protectAdmin`** : chaîne `protect` + vérifie `droit === COLLABORATEUR || ADMIN`

### Rôles (droit)

| Valeur | Nom métier | Accès |
|--------|-----------|-------|
| `USER` | Client | Espace client uniquement |
| `COLLABORATEUR` | Technicien nettoyeur | Espace admin — uniquement ses RDV assignés |
| `ADMIN` | Fondateur | Espace admin — accès total (stats, planning, users) |

### Rôles prédéfinis (champ `role`)

`Co-fondateur`, `Technicien`, `Expert Nettoyage`, `Spécialiste Intérieur`, `Responsable Qualité`

---

## BFF Pattern (proxy Next.js → Express)

Les routes `client/app/api/*` sont des proxies qui :
1. Récupèrent le token Auth0 de la session (`getAccessToken`)
2. Le transmettent au backend Express en header `Authorization: Bearer <token>`

Ne jamais appeler l'API Express directement depuis le client — toujours passer par les BFF.

---

## Points techniques importants

### Tailwind CSS + Docker + Turbopack
Les styles `position: fixed` ne sont pas générés par Tailwind dans l'environnement Docker+Turbopack. Utiliser des **styles inline** pour ces cas (`style={{ position: 'fixed', ... }}`).

### NEXT_REDIRECT dans try/catch
Next.js `redirect()` lève une exception interne. Ne jamais appeler `redirect()` à l'intérieur d'un bloc `try/catch` — le placer avant ou après.

### Seed
Le seed crée les comptes staff simultanément dans **Auth0** (Management API M2M) et **PostgreSQL**. Pour lancer le seed :
```bash
docker exec roz-server node prisma/seed.js
```
Guard interne : ne crée les 50 RDV supplémentaires que si `totalExisting < 70`.

### Volumes Docker
`docker-compose down -v` **supprime les volumes** (données PostgreSQL comprises). Utiliser `docker-compose down` (sans `-v`) pour conserver les données.

### Restart après changement de routes serveur
Si de nouvelles routes Express sont ajoutées, redémarrer le container :
```bash
docker restart roz-server
```

### Prisma après renommage d'enum
Après un renommage d'enum en base, le container serveur peut tourner avec l'ancien Prisma client. Faire `docker restart roz-server`.

---

## Variables d'environnement

### Backend (`server/.env`)
```
DATABASE_URL=postgresql://user:password@postgres:5432/car_wash
NODE_ENV=development
CLIENT_URL=http://localhost:3000
PORT=4000
AUTH0_DOMAIN=<tenant>.auth0.com
AUTH0_AUDIENCE=https://<tenant>.auth0.com/api/v2/
AUTH0_MGMT_CLIENT_ID=<m2m_client_id>
AUTH0_MGMT_CLIENT_SECRET=<m2m_client_secret>
```

### Frontend (`client/.env.local`)
```
API_URL=http://server:4000/api
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=<tenant>.auth0.com
AUTH0_AUDIENCE=https://<tenant>.auth0.com/api/v2/
AUTH0_SECRET=<random_secret>
AUTH0_CLIENT_ID=<spa_client_id>
AUTH0_CLIENT_SECRET=<spa_client_secret>
```

---

## Commandes utiles

```bash
# Lancer l'environnement
docker-compose up

# Lancer sans reconstruire
docker-compose up --no-build

# Seed (depuis l'intérieur du container)
docker exec roz-server node prisma/seed.js

# Redémarrer un service
docker restart roz-server
docker restart roz-client

# Logs
docker logs roz-server -f
docker logs roz-client -f
```

---

## État d'avancement

| Phase | Contenu | Statut |
|-------|---------|--------|
| 1–8 | Infrastructure, Auth, API, Site vitrine, Espace client, Docker | ✅ Terminé |
| 9 | Espace Admin complet (réservations, stats, planning, users, profil) | ✅ Terminé |
| 10 | Notifications email (confirmation + rappel J-1) | 🔄 En cours |
| 11 | PWA, Stripe, Fidélité | 📋 Futur |

### GitHub Issues
- Issues #1–#19 : V1 (toutes CLOSED)
- Issues #20–#21, #23–#26, #30–#32 : V2 (toutes CLOSED)
- Issue #22 : Notifications email (OPEN — V2 en cours)
- Issues #27–#29 : V3 (OPEN — futur)
