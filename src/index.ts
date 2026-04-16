import { Hono } from "hono";

const app = new Hono();

const users = [];
let idCounter = 0;

app.get("/", (c) => c.text("Hello Hono!"));

app.get("/users", (c) => {
  return c.json(users);
});

app.get("/users/:id", (c) => {
  const id = Number(c.req.param("id"));
  const user = users.find((u) => u.id === id);

  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json(user);
});

app.post("/signup", async (c) => {
  const { name, email, password } = await c.req.json();

  if (users.some((u) => u.email === email)) {
    return c.json({ error: "Email already exists" }, 400);
  }

  const newUser = { id: ++idCounter, name, email, password };
  users.push(newUser);

  return c.json(newUser, 201);
});

app.post("/signin", async (c) => {
  const { email, password } = await c.req.json();
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  return c.json({
    message: "Login successful",
    user: user,
  });
});

export default app;
