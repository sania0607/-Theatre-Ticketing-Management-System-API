const crypto = require("crypto");
const fs = require("fs");

const privateKey = fs.readFileSync(
  "keys/client-private.pem",
  "utf8"
);

// This is the data the client wants to send
const data = JSON.stringify({
  message: "Hello Theatre API"
});

// Create RSA signature
const signer = crypto.createSign("RSA-SHA256");

signer.update(data);
signer.end();

const signature = signer.sign(privateKey, "base64");

console.log("Client Code:");
console.log("TEST001");

console.log("\nData:");
console.log(data);

console.log("\nSignature:");
console.log(signature);