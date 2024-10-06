import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { exec } from "child_process";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  // Bağımlılıkları yükle
  exec("npm install", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  // Sunucu oluştur ve dinle
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port);

  console.log(
    `> Server listening at http://localhost.com:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});
