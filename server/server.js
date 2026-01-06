const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 테스트용 계정 (실무에선 env로 빼면 됨)
const USER_EMAIL = process.env.TEST_USER_EMAIL || "test@ex.com";
const USER_PASSWORD = process.env.TEST_USER_PASSWORD || "pw1234";

// 아주 단순한 "세션" 대용 (쿠키)
function isAuthed(req) {
  return req.cookies && req.cookies.auth === "1";
}

app.get("/", (req, res) => res.redirect("/login"));

app.get("/health", (req, res) => res.status(200).send("ok"));

app.get("/login", (req, res) => {
  const err = req.query.err ? `<p role="alert">Invalid credentials</p>` : "";
  res.send(`
    <html>
      <body>
        <h1>Login</h1>
        ${err}
        <form method="POST" action="/login">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" />
          <br/>
          <label for="password">Password</label>
          <input id="password" name="password" type="password" />
          <br/>
          <button type="submit">Log in</button>
        </form>
      </body>
    </html>
  `);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === USER_EMAIL && password === USER_PASSWORD) {
    res.cookie("auth", "1", { httpOnly: true });
    return res.redirect("/dashboard");
  }
  return res.redirect("/login?err=1");
});

app.get("/dashboard", (req, res) => {
  if (!isAuthed(req)) return res.redirect("/login");

  res.send(`
    <html>
      <body>
        <h1>Dashboard</h1>
        <p>Welcome!</p>
        <form method="POST" action="/logout">
          <button type="submit">Logout</button>
        </form>
      </body>
    </html>
  `);
});

app.post("/logout", (req, res) => {
  res.clearCookie("auth");
  res.redirect("/login");
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "127.0.0.1"; // 기본은 localhost 전용
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
