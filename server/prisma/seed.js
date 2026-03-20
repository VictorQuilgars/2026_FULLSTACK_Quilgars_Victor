require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Auth0 Management API ────────────────────────────────────────────────────

async function getAuth0ManagementToken() {
  const { AUTH0_DOMAIN, AUTH0_MGMT_CLIENT_ID, AUTH0_MGMT_CLIENT_SECRET } = process.env;

  if (!AUTH0_MGMT_CLIENT_ID || !AUTH0_MGMT_CLIENT_SECRET) {
    console.warn("⚠️  AUTH0_MGMT_CLIENT_ID / AUTH0_MGMT_CLIENT_SECRET non définis → création Auth0 ignorée.");
    return null;
  }

  const res = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: AUTH0_MGMT_CLIENT_ID,
      client_secret: AUTH0_MGMT_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth0 token error: ${err}`);
  }

  const { access_token } = await res.json();
  return access_token;
}

async function createAuth0User(token, email, password, name) {
  const domain = process.env.AUTH0_DOMAIN;

  const res = await fetch(`https://${domain}/api/v2/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email,
      password,
      name,
      connection: "Username-Password-Authentication",
      email_verified: true,
    }),
  });

  if (res.status === 409) {
    console.log(`  ↩  ${email} existe déjà dans Auth0, ignoré.`);
    return;
  }

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Auth0 create user error (${email}): ${err.message}`);
  }

  console.log(`  ✓  ${email} créé dans Auth0.`);
}

// ─── Seed ────────────────────────────────────────────────────────────────────

async function main() {
  const SEED_PASSWORD = "Roz2024!";
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  // 1. Création de l'Équipe (ADMIN & SUPER_ADMIN)
  const staff = [
    {
      nom: "Rodier",
      prenom: "Barnabé",
      email: "barnabe@roz-nettoyage.fr",
      password: passwordHash,
      tel: "0772103552",
      dateNaissance: new Date("1995-05-15"),
      sexe: "MASCULIN",
      droit: "SUPER_ADMIN",
      role: "Co-fondateur",
    },
    {
      nom: "Mahé",
      prenom: "Julian",
      email: "julian@roz-nettoyage.fr",
      password: passwordHash,
      tel: "0602243720",
      dateNaissance: new Date("1996-08-20"),
      sexe: "MASCULIN",
      droit: "SUPER_ADMIN",
      role: "Co-fondateur",
    },
    {
      nom: "Le Douarec",
      prenom: "Hugo",
      email: "hugo@roz-nettoyage.fr",
      password: passwordHash,
      tel: "0600000001",
      dateNaissance: new Date("1998-03-10"),
      sexe: "MASCULIN",
      droit: "ADMIN",
      role: "Expert Nettoyage",
    },
    {
      nom: "Sévenou",
      prenom: "Nathan",
      email: "nathan@roz-nettoyage.fr",
      password: passwordHash,
      tel: "0600000002",
      dateNaissance: new Date("1997-11-25"),
      sexe: "MASCULIN",
      droit: "ADMIN",
      role: "Spécialiste Intérieur",
    },
  ];

  // 1a. Création dans Auth0
  console.log("⏳ Création des comptes Auth0...");
  const mgmtToken = await getAuth0ManagementToken();
  if (mgmtToken) {
    for (const u of staff) {
      await createAuth0User(mgmtToken, u.email, SEED_PASSWORD, `${u.prenom} ${u.nom}`);
    }
  }

  // 1b. Création dans PostgreSQL
  console.log("⏳ Création des utilisateurs en base...");
  for (const u of staff) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  // 2. Création des Services avec les prix JSON
  const services = [
    {
      nom: "Intérieur voiture",
      description: "Nettoyage complet pour un aspect sortie de concession.",
      dureeMinutes: 120,
      prices: {
        "Citadine (Clio, 208...)": 99,
        "Berline/ Break (A5, 508..)": 109,
        "SUV (2008, Tiguan, Q5...)": 119,
        "Monospace 7 places/ Van": 139,
      },
    },
    {
      nom: "Canapé classique",
      description: "Nettoyage en profondeur de votre canapé classique (2 ou 3 places) : taches, odeurs et acariens éliminés.",
      dureeMinutes: 60,
      prices: { "Prix unique": 99 },
    },
    {
      nom: "Canapé d'angles",
      description: "Nettoyage de votre canapé d'angle en profondeur. Même technique, surface plus grande couverte.",
      dureeMinutes: 60,
      prices: { "Prix unique": 109 },
    },
    {
      nom: "Tapis",
      description: "Injection-extraction sur tapis de toutes tailles. Couleurs ravivées, fibres assainies et odeurs neutralisées.",
      dureeMinutes: 180,
      prices: { "Prix unique": 99 },
    },
    {
      nom: "Fauteuil",
      description: "Nettoyage en profondeur de votre fauteuil textile. Idéal pour les assises du quotidien.",
      dureeMinutes: 60,
      prices: { "Prix unique": 60 },
    },
  ];

  console.log("⏳ Création des services...");
  for (const s of services) {
    await prisma.service.upsert({
      where: { nom: s.nom },
      update: {},
      create: s,
    });
  }

  console.log("");
  console.log("✅ Base de données initialisée avec succès !");
  console.log(`🔑 Mot de passe des comptes seed : ${SEED_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
