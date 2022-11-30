// require('dotenv').config();
const app = require("./app");

// Слушаем 3001 порт
//const { PORT = 3003 } = process.env;
const { PORT = 3001 } = require("./utils/env-config");

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
