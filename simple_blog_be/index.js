const express = require("express");
const app = express();

const cors = require("cors");

app.use(express.json());

const dbConnect = require("./db/dbConnect.js");

const session = require("express-session");

const PostRouter = require("./routes/PostRouter.js");

const UserRouter = require("./routes/UserRouter.js");

dbConnect();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 30 * 1000,
    },
  }),
);

app.use("/api", PostRouter);
app.use("/api", UserRouter);
//POST new post
// app.post("/api/post", jsonParser, (req, res) => {
//   const post = {
//     slug: req.body.slug,
//     title: req.body.title,
//     description: req.body.description,
//   };
//   BlogPosts.BlogPosts.push(post);
//   res.status(200).send({ msg: "Posted successful" });
// });

//GET post list
// app.get("/api/posts", (req, res) => {
//   res.json(BlogPosts.BlogPosts);
// });

//GET post
// app.get("/api/posts/:slug", (req, res) => {
//   const slug = req.params.slug;
//   const post = BlogPosts.BlogPosts.find((e) => e.slug === slug);
//   if (post) {
//     res.json(post);
//   } else res.status(404).send("NOT FOUND!");
// });

//Login Route - Stateful
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find(
//     (u) => u.username === username && u.password === password,
//   );
//   if (user) {
//     req.session.userId = user.id; // Store user ID in session
//     res.send("Login successful");
//   } else {
//     res.status(401).send("Invalid credentials");
//   }
// });

// //Protected Route - Stateful
// app.get("/", (req, res) => {
//   if (req.session.userId) {
//     res.send(`Welcome to the Home Page, User ${req.session.userId}`);
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// });

// //Logout Route - Stateful
// app.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       res.status(500).send("Error logging out");
//     } else {
//       res.redirect("/");
//     }
//   });
// });

// //Login Route - Stateless
// app.get("/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find(
//     (u) => u.username === username && u.password === password,
//   );
//   jwt.sign({ user }, secretKey, { expireIn: "1h" }, (err, token) => {
//     if (err) {
//       res.status(500).send("Error generating token");
//     } else {
//       res.json({ token });
//     }
//   });
// });

// //Protected Route
// app.get("/", verifyToken, (req, res) => {
//   res.send("Welcome to the Home Page");
// });

// function verifyToken() {
//   const token = req.headers["authorization"];
//   if (typeof token !== "undefined") {
//     jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
//       if (err) {
//         res.status(403).send("Invalid token");
//       } else {
//         req.user = decoded.user;
//         next();
//       }
//     });
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// }

app.listen(8080, () => {
  console.log("Server is running at : http://localhost:8080 !");
});
