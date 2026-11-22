// Copies web/ into www/ so Capacitor can wrap it as the iOS and Android app.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const base = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const web = path.join(base, "web");
const www = path.join(base, "www");

fs.rmSync(www, { recursive: true, force: true });
fs.cpSync(web, www, { recursive: true });
console.log(`copied ${web} -> ${www}`);
