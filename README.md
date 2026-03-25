# Roz Nettoyage

Application web de prise de rendez-vous pour Roz Nettoyage (nettoyage de véhicules et textiles à Brest).

## Démarrage depuis un clone

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
