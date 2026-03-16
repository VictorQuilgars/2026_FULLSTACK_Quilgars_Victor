# car-wash-app

## Lancer le projet avec Docker

Les trois briques tournent dans Docker :

- `postgres` sur `localhost:5432`
- `server` sur `localhost:4000`
- `client` sur `localhost:3000`

Pré-requis :

- renseigner les secrets dans `server/.env`
- renseigner les secrets dans `client/.env.local`

La variable `DATABASE_URL` de `server/.env` peut rester en configuration locale si besoin : `docker-compose.yml` la remplace automatiquement dans le conteneur par l'URL interne vers `postgres`.

Démarrage :

```bash
docker-compose up --build
```

Arrêt :

```bash
docker-compose down
```

Pour supprimer aussi les volumes Docker :

```bash
docker-compose down -v
```
