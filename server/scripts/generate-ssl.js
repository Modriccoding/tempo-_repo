const selfsigned = require("selfsigned");
const fs = require("fs");
const path = require("path");

const attrs = [
  { name: "commonName", value: "tempo.local" },
  { name: "countryName", value: "FR" },
  { name: "organizationName", value: "Tempo Development" },
  { name: "organizationalUnitName", value: "Development" },
];

const pems = selfsigned.generate(attrs, {
  algorithm: "sha256",
  keySize: 2048,
  days: 365,
  extensions: [
    {
      name: "subjectAltName",
      altNames: [
        {
          type: 2, // DNS
          value: "tempo.local",
        },
      ],
    },
  ],
});

const sslDir = path.join(__dirname, "../ssl");

// Create ssl directory if it doesn't exist
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

fs.writeFileSync(path.join(sslDir, "key.pem"), pems.private);
fs.writeFileSync(path.join(sslDir, "cert.pem"), pems.cert);

console.log("✅ Certificats SSL générés avec succès dans le dossier ssl/");
console.log("📝 Détails du certificat :");
console.log("- Nom de domaine :", "tempo.local");
console.log("- Validité : 365 jours");
console.log("- Algorithm : SHA256");
console.log("- Taille de la clé : 2048 bits");
