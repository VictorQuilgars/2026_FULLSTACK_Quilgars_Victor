import app from "./app";

const port = Number(process.env.PORT ?? 4000);

app.listen(port, () => {
  console.log(`API backend en ecoute sur le port ${port}`);
});
