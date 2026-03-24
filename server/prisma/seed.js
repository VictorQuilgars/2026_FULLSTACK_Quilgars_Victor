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
      droit: "ADMIN",
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
      droit: "ADMIN",
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
      droit: "COLLABORATEUR",
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
      droit: "COLLABORATEUR",
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
  const createdServices = {};
  for (const s of services) {
    const svc = await prisma.service.upsert({
      where: { nom: s.nom },
      update: {},
      create: s,
    });
    createdServices[s.nom] = svc.id;
  }

  // 3. Clients de test
  const clients = [
    { nom: "Martin", prenom: "Sophie", email: "sophie.martin@gmail.com", password: passwordHash, tel: "0612345678" },
    { nom: "Lebrun", prenom: "Thomas", email: "thomas.lebrun@gmail.com", password: passwordHash, tel: "0623456789" },
    { nom: "Durand", prenom: "Emma", email: "emma.durand@gmail.com", password: passwordHash, tel: "0634567890" },
    { nom: "Perrin", prenom: "Lucas", email: "lucas.perrin@gmail.com", password: passwordHash, tel: "0645678901" },
    { nom: "Fontaine", prenom: "Chloé", email: "chloe.fontaine@gmail.com", password: passwordHash, tel: "0656789012" },
  ];

  console.log("⏳ Création des clients de test...");
  const createdClients = {};
  for (const c of clients) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: c,
    });
    createdClients[c.email] = user.id;
  }

  // 4. Rendez-vous (seulement si pas déjà créés)
  const existing = await prisma.appointment.count();
  if (existing === 0) {
    console.log("⏳ Création des rendez-vous de démonstration...");

    const staff = await prisma.user.findMany({ where: { droit: { in: ["ADMIN", "COLLABORATEUR"] } } });
    const barnabe = staff.find(u => u.email === "barnabe@roz-nettoyage.fr");
    const julian = staff.find(u => u.email === "julian@roz-nettoyage.fr");
    const hugo = staff.find(u => u.email === "hugo@roz-nettoyage.fr");
    const nathan = staff.find(u => u.email === "nathan@roz-nettoyage.fr");

    const d = (offset) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const sVoiture = createdServices["Intérieur voiture"];
    const sCanape = createdServices["Canapé classique"];
    const sCanapeAngle = createdServices["Canapé d'angles"];
    const sTapis = createdServices["Tapis"];
    const sFauteuil = createdServices["Fauteuil"];

    const sophie = createdClients["sophie.martin@gmail.com"];
    const thomas = createdClients["thomas.lebrun@gmail.com"];
    const emma = createdClients["emma.durand@gmail.com"];
    const lucas = createdClients["lucas.perrin@gmail.com"];
    const chloe = createdClients["chloe.fontaine@gmail.com"];

    const appointments = [
      // ─── Passés DONE ───
      { date: d(-30), slot: "09:00", status: "DONE", clientId: sophie, staffId: barnabe?.id, serviceId: sVoiture, gamme: "Citadine (Clio, 208...)", prix: 99 },
      { date: d(-25), slot: "14:00", status: "DONE", clientId: thomas, staffId: hugo?.id, serviceId: sCanape, gamme: "Prix unique", prix: 99 },
      { date: d(-20), slot: "10:30", status: "DONE", clientId: emma, staffId: julian?.id, serviceId: sVoiture, gamme: "SUV (2008, Tiguan, Q5...)", prix: 119 },
      { date: d(-15), slot: "09:00", status: "DONE", clientId: lucas, staffId: nathan?.id, serviceId: sTapis, gamme: "Prix unique", prix: 99 },
      { date: d(-12), slot: "11:00", status: "DONE", clientId: chloe, staffId: barnabe?.id, serviceId: sFauteuil, gamme: "Prix unique", prix: 60 },
      { date: d(-10), slot: "14:00", status: "DONE", clientId: sophie, staffId: hugo?.id, serviceId: sCanapeAngle, gamme: "Prix unique", prix: 109 },
      { date: d(-7), slot: "09:00", status: "DONE", clientId: thomas, staffId: julian?.id, serviceId: sVoiture, gamme: "Berline/ Break (A5, 508..)", prix: 109 },

      // ─── Passés CANCELLED ───
      { date: d(-18), slot: "10:30", status: "CANCELLED", clientId: emma, staffId: null, serviceId: sCanape, gamme: "Prix unique", prix: 99 },
      { date: d(-8), slot: "14:00", status: "CANCELLED", clientId: lucas, staffId: barnabe?.id, serviceId: sVoiture, gamme: "Citadine (Clio, 208...)", prix: 99 },

      // ─── Récents / cette semaine CONFIRMED ───
      { date: d(-3), slot: "09:00", status: "CONFIRMED", clientId: chloe, staffId: hugo?.id, serviceId: sVoiture, gamme: "SUV (2008, Tiguan, Q5...)", prix: 119 },
      { date: d(-1), slot: "14:00", status: "CONFIRMED", clientId: sophie, staffId: nathan?.id, serviceId: sTapis, gamme: "Prix unique", prix: 99 },

      // ─── Futurs CONFIRMED ───
      { date: d(1), slot: "09:00", status: "CONFIRMED", clientId: thomas, staffId: barnabe?.id, serviceId: sVoiture, gamme: "Monospace 7 places/ Van", prix: 139 },
      { date: d(2), slot: "10:30", status: "CONFIRMED", clientId: emma, staffId: julian?.id, serviceId: sCanape, gamme: "Prix unique", prix: 99 },
      { date: d(3), slot: "14:00", status: "CONFIRMED", clientId: lucas, staffId: hugo?.id, serviceId: sFauteuil, gamme: "Prix unique", prix: 60 },

      // ─── Futurs PENDING ───
      { date: d(2), slot: "09:00", status: "PENDING", clientId: chloe, staffId: null, serviceId: sCanapeAngle, gamme: "Prix unique", prix: 109 },
      { date: d(4), slot: "09:00", status: "PENDING", clientId: sophie, staffId: null, serviceId: sVoiture, gamme: "Citadine (Clio, 208...)", prix: 99 },
      { date: d(5), slot: "10:30", status: "PENDING", clientId: thomas, staffId: null, serviceId: sTapis, gamme: "Prix unique", prix: 99 },
      { date: d(7), slot: "09:00", status: "PENDING", clientId: emma, staffId: null, serviceId: sVoiture, gamme: "SUV (2008, Tiguan, Q5...)", prix: 119 },
      { date: d(10), slot: "14:00", status: "PENDING", clientId: lucas, staffId: null, serviceId: sCanape, gamme: "Prix unique", prix: 99 },
      { date: d(14), slot: "09:00", status: "PENDING", clientId: chloe, staffId: null, serviceId: sVoiture, gamme: "Berline/ Break (A5, 508..)", prix: 109 },
    ];

    for (const appt of appointments) {
      await prisma.appointment.create({ data: appt });
    }

    // Ajouter quelques avis sur les RDV DONE
    const doneAppts = await prisma.appointment.findMany({ where: { status: "DONE" }, take: 4 });
    const reviews = [
      { rating: 5, comment: "Voiture impeccable, travail soigné et rapide !" },
      { rating: 4, comment: "Très bon résultat, canapé comme neuf." },
      { rating: 5, comment: "Je recommande vivement, équipe professionnelle." },
      { rating: 4, comment: "Bon travail, quelques petits détails mais globalement très satisfait." },
    ];
    for (let i = 0; i < doneAppts.length; i++) {
      await prisma.review.upsert({
        where: { appointmentId: doneAppts[i].id },
        update: {},
        create: { appointmentId: doneAppts[i].id, ...reviews[i] },
      });
    }

    console.log(`  ✓  20 rendez-vous et 4 avis créés.`);
  } else {
    console.log(`  ↩  Rendez-vous déjà présents (${existing}), ignorés.`);
  }

  // 5. 50 rendez-vous supplémentaires (seulement si < 70 en base)
  const totalExisting = await prisma.appointment.count();
  if (totalExisting < 70) {
    console.log("⏳ Création de 50 rendez-vous supplémentaires...");

    const allUsers = await prisma.user.findMany({ select: { id: true, droit: true } });
    const staffUsers = allUsers.filter(u => u.droit === "ADMIN" || u.droit === "COLLABORATEUR");
    const clientUsers = allUsers.filter(u => u.droit === "USER");
    const allServices = await prisma.service.findMany();

    const gammesByService = {
      "Intérieur voiture": [
        { gamme: "Citadine (Clio, 208...)", prix: 99 },
        { gamme: "Berline/ Break (A5, 508..)", prix: 109 },
        { gamme: "SUV (2008, Tiguan, Q5...)", prix: 119 },
        { gamme: "Monospace 7 places/ Van", prix: 139 },
      ],
      "Canapé classique":  [{ gamme: "Prix unique", prix: 99 }],
      "Canapé d'angles":   [{ gamme: "Prix unique", prix: 109 }],
      "Tapis":             [{ gamme: "Prix unique", prix: 99 }],
      "Fauteuil":          [{ gamme: "Prix unique", prix: 60 }],
    };

    const slots = ["08:00", "09:00", "10:00", "10:30", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const dOffset = (offset) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const offsets = [
      -90, -85, -80, -75, -70, -65, -60, -58, -55, -52,
      -48, -45, -42, -38, -35, -32, -28, -26, -23, -21,
      -19, -16, -14, -11, -9, -6, -4, -2, 0,
       1,   2,   3,   4,   5,   6,   7,   8,   9,  10,
      12,  14,  16,  18,  20,  22,  25,  28,  30,  35,
    ];

    for (const offset of offsets) {
      const svc = pick(allServices);
      const gammes = gammesByService[svc.nom] ?? [{ gamme: "Prix unique", prix: 99 }];
      const { gamme, prix } = pick(gammes);
      const client = pick(clientUsers);
      const status = offset < -5
        ? pick(["DONE", "DONE", "DONE", "CANCELLED"])
        : offset < 0
        ? pick(["DONE", "CONFIRMED"])
        : offset === 0
        ? pick(["CONFIRMED", "PENDING"])
        : pick(["PENDING", "PENDING", "CONFIRMED"]);

      const assignedStaff = (status === "CONFIRMED" || status === "DONE") ? pick(staffUsers) : null;

      await prisma.appointment.create({
        data: {
          date: dOffset(offset),
          slot: pick(slots),
          status,
          clientId: client.id,
          staffId: assignedStaff?.id ?? null,
          serviceId: svc.id,
          gamme,
          prix,
        },
      });
    }

    // Avis sur les DONE sans avis
    const doneWithoutReview = await prisma.appointment.findMany({
      where: { status: "DONE", review: null },
      take: 20,
    });
    const extraComments = [
      "Excellent travail, je suis très satisfait !",
      "Canapé comme neuf, je recommande.",
      "Équipe ponctuelle et professionnelle.",
      "Voiture impeccable, travail soigné.",
      "Super prestation, rapport qualité-prix imbattable.",
      "Toutes les taches ont disparu, parfait.",
      "Je ferai à nouveau appel à Roz sans hésiter.",
      "Travail rapide et soigné !",
      null, null, null,
    ];
    for (const appt of doneWithoutReview) {
      const rating = Math.random() < 0.7 ? 5 : Math.random() < 0.5 ? 4 : 3;
      await prisma.review.create({
        data: { appointmentId: appt.id, rating, comment: pick(extraComments) },
      });
    }

    const newTotal = await prisma.appointment.count();
    console.log(`  ✓  50 rendez-vous ajoutés. Total en base : ${newTotal}.`);
  } else {
    console.log(`  ↩  Rendez-vous supplémentaires déjà présents (${totalExisting}), ignorés.`);
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
