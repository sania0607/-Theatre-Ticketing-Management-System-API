import crypto from "crypto";
import fs from "fs";
import path from "path";

const clientCode = "TEST001";

const timestamp = Date.now().toString();

const method = "POST";
const url = "/auth/client/login";

const body = {
   

};

const bodyString = JSON.stringify(body);

const data = [
  clientCode,
  timestamp,
  method,
  url,
  bodyString,
].join("|");

const privateKey = fs.readFileSync(
  path.join(process.cwd(), "keys", "client-private.pem"),
  "utf8"
);

const signer = crypto.createSign("RSA-SHA256");

signer.update(data);
signer.end();

const signature = signer.sign(privateKey, "base64");

console.log("\n========== CLIENT AUTH TEST ==========\n");

console.log("Client Code:");
console.log(clientCode);

console.log("\nTimestamp:");
console.log(timestamp);

console.log("\nMethod:");
console.log(method);

console.log("\nURL:");
console.log(url);

console.log("\nBody:");
console.log(JSON.stringify(body));

console.log("\nData being signed:");
console.log(data);

console.log("\nRSA Signature:");
console.log(signature);

console.log("\n======================================\n");