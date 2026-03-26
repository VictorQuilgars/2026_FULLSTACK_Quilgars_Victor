# Roz Nettoyage

Application web de prise de rendez-vous pour Roz Nettoyage (nettoyage de véhicules et textiles à Brest).

## Démarrage depuis un clone

### 0. Cloner le dépôt

```bash
git clone https://github.com/VictorQuilgars/2026_FULLSTACK_Quilgars_Victor.git
cd 2026_FULLSTACK_Quilgars_Victor
```

### 1. Créer les fichiers d'environnement

```bash
cp server/.env.example server/.env
cp client/.env.local.example client/.env.local
```

Puis remplir les valeurs dans chaque fichier :

**`server/.env`** — secrets Auth0 (tenant domain, audience, M2M client id/secret)

**`client/.env.local`** — secrets Auth0 SPA (domain, client id/secret, audience, secret session)

> Pour générer `AUTH0_SECRET` : `openssl rand -hex 32`

Les variables système (`DATABASE_URL`, `PORT`, `CLIENT_URL`, `APP_BASE_URL`, etc.) sont déjà définies dans `docker-compose.yml` — ne pas les dupliquer.

### 2. Lancer les containers

```bash
docker-compose up --build
```

Les trois services démarrent automatiquement :
- `postgres` → `localhost:5433`
- `server` → `localhost:4000`
- `client` → `localhost:3000`

Au premier démarrage, le serveur exécute automatiquement `prisma db push` et `node prisma/seed.js`.

### 3. Commandes utiles

```bash
# Arrêter (conserve les données)
docker-compose down

# Arrêter et supprimer les volumes (repart de zéro)
docker-compose down -v

# Relancer sans reconstruire les images
docker-compose up

# Logs d'un service
docker logs roz-server -f
docker logs roz-client -f

# Lancer le seed manuellement
docker exec roz-server node prisma/seed.js
```

## Structure du projet

```
31-car-wash-app/
├── docker-compose.yml
├── server/                        # API REST — Express 5 + Prisma + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma          # Modèles : User, Service, Appointment, Review, BlockedSlot
│   │   └── seed.js                # Données initiales (services, staff Auth0 + DB, RDV)
│   └── src/
│       ├── app.tsx                # Configuration Express (middlewares, routes)
│       ├── server.tsx             # Point d'entrée, connexion DB
│       ├── controllers/           # Logique métier par domaine
│       ├── routes/                # Déclaration des routes Express
│       ├── middleware/
│       │   ├── protect.tsx        # Vérification JWT Auth0 + auto-provision utilisateur
│       │   └── errorHandler.tsx
│       ├── lib/                   # Clients Prisma, Auth0, JWT
│       └── utils/                 # Helpers (dates, erreurs)
└── client/                        # Next.js 16 App Router
    ├── app/
    │   ├── (marketing)/           # Site vitrine public
    │   ├── espace-client/         # Espace réservé aux clients connectés
    │   ├── espace-admin/          # Espace réservé aux collaborateurs et admins
    │   └── api/                   # Routes BFF — proxies vers l'API Express
    ├── components/
    │   ├── marketing/             # Composants du site vitrine
    │   ├── espace-client/         # Dashboard client, profil
    │   └── espace-admin/          # Dashboard admin, calendrier, stats, users
    ├── lib/                       # Helpers Auth0, fetch, config
    ├── types/                     # Types TypeScript partagés
    └── constants/                 # Contenu statique (textes marketing)
```

### Authentification

Auth0 Universal Login (Google OAuth + email/password). À la première connexion, l'utilisateur est automatiquement créé en base via le middleware `protect`. Les routes `client/app/api/*` sont des proxies BFF qui transmettent le token Auth0 à l'API Express — le client ne contacte jamais l'API directement.

### Rôles

| Valeur | Accès |
|--------|-------|
| `USER` | Espace client |
| `COLLABORATEUR` | Espace admin — ses RDV assignés uniquement |
| `ADMIN` | Espace admin — accès total |
