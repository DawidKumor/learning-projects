const crypto = require("crypto");

(async () => {
  const salt = crypto.randomBytes(16).toString("hex");
  console.log("Testing pbkdf2...");
  const key = await crypto.pbkdf2("haslo", salt, 100000, 64, "sha512");
  console.log("Success:", key.toString("hex"));
})().catch((err) => console.error("Error:", err));
