// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  "https://seb2.students.nomoredomains.icu",
  "http://seb2.students.nomoredomains.icu",
  "https://api.seb.students.nomoredomains.icu",
  "http://api.seb.students.nomoredomains.icu",
  "https://seb.diploma.nomoredomains.icu",
  "https://api.seb.diploma.nomoredomains.icu",
  "http://seb.diploma.nomoredomains.icu",
  "http://api.seb.diploma.nomoredomains.icu",
  "localhost:3000",
  "http://localhost:3000",
  "https://localhost:3000",
];

const cors = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = "GET, HEAD, PUT, PATCH, POST, DELETE";
  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers["access-control-request-headers"];

  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", true);
    // console.log(`allowedCors: ${allowedCors.includes(origin)}`);
  }

  // если это сложный CORS-запрос
  if (method === "OPTIONS") {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header("Access-Control-Allow-Origin", origin);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header("Access-Control-Allow-Headers", requestHeaders);
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Credentials", true);

    // console.log(JSON.stringify(res.header));

    // завершаем обработку запроса и возвращаем результат клиенту
    res.end();
    return;
  }

  next();
};

module.exports = cors;
