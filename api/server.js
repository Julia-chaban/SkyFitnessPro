const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

function findApiFiles(dir, baseRoute = "") {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findApiFiles(filePath, `${baseRoute}/${file}`);
    } else if (
      file.endsWith(".js") &&
      file !== "server.js" &&
      file !== "_lib.js"
    ) {
      const routePath = baseRoute + "/" + file.replace(".js", "");
      const route = routePath
        .replace(/\[([^\]]+)\]/g, ":$1")
        .replace(/\/index$/, "");

      try {
        const handler = require(filePath).default;
        // Здесь регистрируем маршрут БЕЗ префикса /api
        app.all(route, async (req, res) => {
          req.query = { ...req.params, ...req.query };
          await handler(req, res);
        });
        console.log(`✅ Зарегистрирован маршрут: ${route}`);
      } catch (error) {
        console.error(`❌ Ошибка загрузки ${filePath}:`, error.message);
      }
    }
  });
}
app.get("/test-users", (req, res) => {
  res.json({ message: "Сервер работает!" });
});
findApiFiles(__dirname, "");

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 API сервер запущен на http://localhost:${PORT}`);
  console.log(
    `📚 API доступно по адресу: http://localhost:${PORT}/fitness/...`,
  );
});
