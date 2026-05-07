# Simple Blog LTW - Project Knowledge Record

Tai lieu nay tong hop kien thuc tu source code trong repo. Cac thu muc sinh tu dong nhu `node_modules`, `dist`, `package-lock.json` khong duoc mo ta chi tiet tung dong vi chung khong phai source chinh cua ung dung. File `.env` duoc kiem tra theo ten bien, khong dua gia tri bi mat vao tai lieu.

## 1. Tong quan he thong

Du an gom 2 phan:

- `simple_blog_be`: backend Node.js dung Express, Mongoose, MongoDB va `express-session`.
- `simple_blog_fe`: frontend React dung Vite va React Router.

Ung dung la blog don gian co cac chuc nang chinh:

- Xem danh sach bai viet.
- Dang ky user.
- Dang nhap/dang xuat.
- Tao bai viet moi khi da dang nhap.
- Xem chi tiet bai viet khi da dang nhap.
- Sua/xoa bai viet khi da dang nhap.
- Binh luan bai viet khi da dang nhap.
- Xem danh sach user trong trang Stats khi da dang nhap.

Backend chay tai:

- `http://localhost:8080`

Frontend mac dinh cua Vite chay tai:

- `http://localhost:5173`

Backend chi cho phep CORS tu origin frontend nay va bat `credentials: true` de trinh duyet gui cookie session.

## 2. Cong nghe va dependency

### Backend

File: `simple_blog_be/package.json`

Runtime va framework:

- `express`: tao HTTP server va route.
- `mongoose`: ket noi va thao tac MongoDB bang model/schema.
- `mongodb`: driver MongoDB.
- `dotenv`: nap bien moi truong tu `.env`.
- `cors`: cho phep frontend goi API cross-origin.
- `express-session`: quan ly dang nhap bang session cookie.
- `body-parser`: co trong dependency nhung code hien tai khong dung truc tiep; backend dung `express.json()`.

Scripts:

- `npm start`: chay `node index.js`.
- `npm run dev`: chay `node --watch index.js`.
- `npm test`: hien tai chi in loi `Error: no test specified`.

### Frontend

File: `simple_blog_fe/package.json`

Runtime va framework:

- `react`: UI.
- `react-dom`: render React vao DOM.
- `react-router-dom`: routing tren client.
- `react-hook-form`: quan ly form cho Register va NewPost.
- `vite`: dev server/build tool.
- `eslint`: lint JavaScript/JSX.

Scripts:

- `npm run dev`: chay Vite dev server.
- `npm run build`: build production vao `dist`.
- `npm run lint`: chay ESLint.
- `npm run preview`: preview ban build.

## 3. Cau truc source

### Backend

```text
simple_blog_be/
  db/
    dbConnect.js
    userModel.js
    postModel.js
    commentModel.js
  middleware/
    requireAuth.js
  routes/
    UserRouter.js
    PostRouter.js
  test/
  .env
  index.js
  package.json
  package-lock.json
```

Vai tro:

- `index.js`: entrypoint backend, tao Express app, ket noi DB, cau hinh CORS/session, mount router va listen port `8080`.
- `db/dbConnect.js`: nap `.env` va ket noi MongoDB bang `process.env.DB_URL`.
- `db/userModel.js`: schema/model user.
- `db/postModel.js`: schema/model post.
- `db/commentModel.js`: schema/model comment.
- `middleware/requireAuth.js`: middleware chan request neu chua co `req.session.user`.
- `routes/UserRouter.js`: API dang ky, dang nhap, dang xuat, lay current user, lay danh sach user.
- `routes/PostRouter.js`: API CRUD post va comment.
- `test/`: ton tai nhung hien rong.

### Frontend

```text
simple_blog_fe/
  public/
    favicon.svg
    icons.svg
  src/
    AppLayout/index.jsx
    ProtectedRoute/index.jsx
    pages/
      About/index.jsx
      EditPost/index.jsx
      Error404/index.jsx
      Home/index.jsx
      Login/index.jsx
      NewPost/index.jsx
      Posts/index.jsx
      Posts/PostLists/index.jsx
      Posts/PostDetail/index.jsx
      Register/index.jsx
      Stats/index.jsx
    App.jsx
    App.css
    index.css
    main.jsx
  index.html
  vite.config.js
  eslint.config.js
  package.json
  package-lock.json
```

Vai tro:

- `index.html`: HTML shell, co `div#root`.
- `src/main.jsx`: render React app vao `#root`, boc bang `BrowserRouter`.
- `src/App.jsx`: render `AppLayout`.
- `src/AppLayout/index.jsx`: layout chinh, nav, state auth, route table.
- `src/ProtectedRoute/index.jsx`: redirect user chua dang nhap ve `/login`.
- `src/pages/*`: tung trang UI.
- `src/index.css`, `src/App.css`: CSS tu template Vite/React, mot phan style hien tai khong duoc page su dung nhieu.

## 4. Backend boot flow

File: `simple_blog_be/index.js`

Thu tu khoi dong:

1. Import `express`, tao `app`.
2. Bat JSON parser bang `app.use(express.json())`.
3. Import va goi `dbConnect()`.
4. Import `express-session`, `PostRouter`, `UserRouter`.
5. Goi `dbConnect()` de ket noi MongoDB bang `process.env.DB_URL`.
6. Cau hinh CORS:
   - origin: `http://localhost:5173`
   - credentials: `true`
7. Goi lai `app.use(express.json())`.
8. Cau hinh session:
   - `secret: "your_secret_key"`
   - `resave: false`
   - `saveUninitialized: false`
   - cookie:
     - `httpOnly: true`
     - `maxAge: 60 * 30 * 1000` = 30 phut
9. Mount route:
   - `app.use("/api", PostRouter)`
   - `app.use("/api", UserRouter)`
10. Listen port `8080`.

Ghi chu:

- `express.json()` dang duoc khai bao 2 lan. Ve logic van chay, nhung chi can 1 lan.
- Session secret dang hard-code trong source; nen dua vao `.env` trong moi truong that.
- Mac dinh `express-session` dung MemoryStore neu khong khai bao store rieng. MemoryStore chi phu hop dev, khong phu hop production.

## 5. Database va model

### Ket noi MongoDB

File: `simple_blog_be/db/dbConnect.js`

- Goi `require("dotenv").config()` de nap `.env`.
- Ket noi bang `mongoose.connect(process.env.DB_URL)`.
- `.env` can co bien `DB_URL`.

### User model

File: `simple_blog_be/db/userModel.js`

Model name:

- `Users`

Fields:

- `username`
  - type: `String`
  - required
  - unique
  - trim
- `password`
  - type: `String`
  - required

Options:

- `timestamps: true`, nen MongoDB document co `createdAt` va `updatedAt`.

Luu y bao mat:

- Password dang luu plain text, chua hash.

### Post model

File: `simple_blog_be/db/postModel.js`

Model name:

- `Posts`

Fields:

- `slug`
  - type: `String`
  - required
  - unique
- `title`
  - type: `String`
  - required
- `description`
  - type: `String`
  - required

Khong co `timestamps`, nen post hien khong tu dong co `createdAt`/`updatedAt`.

### Comment model

File: `simple_blog_be/db/commentModel.js`

Model name:

- `Comments`

Fields:

- `postSlug`
  - type: `String`
  - required
- `username`
  - type: `String`
  - required
- `content`
  - type: `String`
  - required
  - trim

Options:

- `timestamps: true`, nen comment co `createdAt` va `updatedAt`.

Quan he du lieu:

- Comment lien ket voi Post bang `postSlug`, khong dung `ObjectId`.
- Khi xoa post, code hien tai khong xoa comments lien quan.

## 6. Tat ca API backend

Base URL:

```text
http://localhost:8080/api
```

### POST `/api/users/register`

File: `simple_blog_be/routes/UserRouter.js`

Chuc nang:

- Dang ky user moi.

Auth:

- Public, khong can dang nhap.

Request body:

```json
{
  "username": "user1",
  "password": "123456"
}
```

Xu ly:

1. Lay `username`, `password` tu body.
2. Neu thieu username/password, tra `400`.
3. Tim user theo username.
4. Neu username da ton tai, tra `409`.
5. Tao `User` moi va `save()`.
6. Tra `201` voi `id`, `username`.

Response thanh cong:

```json
{
  "id": "...",
  "username": "user1"
}
```

Loi co the gap:

- `400`: thieu username/password.
- `409`: username da ton tai.
- `500`: loi server/database.

### POST `/api/users/login`

File: `simple_blog_be/routes/UserRouter.js`

Chuc nang:

- Dang nhap user va tao session.

Auth:

- Public.

Request body:

```json
{
  "username": "user1",
  "password": "123456"
}
```

Xu ly:

1. Validate username/password co ton tai.
2. Tim user theo username.
3. So sanh `user.password !== password`.
4. Neu hop le, gan:

```js
req.session.user = {
  id: user._id,
  username: user.username,
};
```

5. Express-session gui cookie `connect.sid` ve browser.
6. Tra `200` voi `id`, `username`.

Response thanh cong:

```json
{
  "id": "...",
  "username": "user1"
}
```

Loi co the gap:

- `400`: thieu username/password.
- `401`: sai username/password.
- `500`: login failed.

### GET `/api/users/me`

File: `simple_blog_be/routes/UserRouter.js`

Chuc nang:

- Kiem tra browser hien tai co dang nhap khong, lay user tu session.

Auth:

- Can co session cookie hop le, nhung route tu kiem tra truc tiep thay vi dung `requireAuth`.

Request:

- Khong co body.
- Frontend phai gui cookie bang `credentials: "include"`.

Xu ly:

1. Neu khong co `req.session.user`, tra `401`.
2. Neu co, tra `200` voi object user trong session.

Response thanh cong:

```json
{
  "id": "...",
  "username": "user1"
}
```

Loi:

- `401`: Unauthorized.

### POST `/api/users/logout`

File: `simple_blog_be/routes/UserRouter.js`

Chuc nang:

- Dang xuat user hien tai.

Auth:

- Code khong bat buoc `requireAuth`; neu request co/khong co session van goi destroy.

Request:

- Khong co body.
- Frontend gui `credentials: "include"`.

Xu ly:

1. Goi `req.session.destroy()`.
2. Neu loi, tra `500`.
3. Neu thanh cong, clear cookie `connect.sid`.
4. Tra `200`.

Response thanh cong:

```json
{
  "message": "Logout successful"
}
```

Loi:

- `500`: Error logging out.

### GET `/api/users/stats`

File: `simple_blog_be/routes/UserRouter.js`

Chuc nang:

- Lay danh sach user cho trang Stats.

Auth:

- Can dang nhap, dung `requireAuth`.

Request:

- Khong co body.
- Frontend gui `credentials: "include"`.

Xu ly:

1. `requireAuth` kiem tra session.
2. Query `User.find()`.
3. Chi select `_id username`.
4. Sort theo `username: 1`.
5. `.lean()`.
6. Map `_id` thanh `id`.
7. Tra `200`.

Response thanh cong:

```json
[
  {
    "id": "...",
    "username": "user1"
  }
]
```

Loi:

- `401`: Unauthorized.
- `500`: Failed to get users.

### POST `/api/post`

File: `simple_blog_be/routes/PostRouter.js`

Chuc nang:

- Tao bai post moi.

Auth:

- Can dang nhap, dung `requireAuth`.

Request body:

```json
{
  "slug": "my-first-post",
  "title": "My First Post",
  "description": "Content..."
}
```

Xu ly:

1. `requireAuth` kiem tra session.
2. Tao `new Post(req.body)`.
3. `post.save()`.
4. Tra object post vua tao.

Response thanh cong:

- Status mac dinh la `200` vi code dung `res.send(post)`.
- Body la document post.

Loi:

- `401`: Unauthorized.
- `500`: loi save/validation/database.

Luu y:

- Route tao post la singular `/post`, trong khi cac route doc/sua/xoa dung plural `/posts`.

### GET `/api/posts`

File: `simple_blog_be/routes/PostRouter.js`

Chuc nang:

- Lay tat ca bai post.

Auth:

- Public.

Request:

- Khong co body.

Xu ly:

1. Query `Post.find({})`.
2. Tra mang posts.

Response thanh cong:

```json
[
  {
    "_id": "...",
    "slug": "my-first-post",
    "title": "My First Post",
    "description": "Content..."
  }
]
```

Loi:

- `500`: loi server/database.

### GET `/api/posts/:slug`

File: `simple_blog_be/routes/PostRouter.js`

Chuc nang:

- Lay chi tiet post theo slug.

Auth:

- Backend public, nhung frontend hien dang boc page chi tiet bang `ProtectedRoute`, nen nguoi chua dang nhap khong vao duoc UI chi tiet.

Path param:

- `slug`: slug cua bai post.

Xu ly:

1. Query `Post.findOne({ slug: req.params.slug })`.
2. Tra post.

Response thanh cong:

```json
{
  "_id": "...",
  "slug": "my-first-post",
  "title": "My First Post",
  "description": "Content..."
}
```

Luu y:

- Neu khong tim thay post, `findOne` tra `null` va code van `res.send(null)` voi status `200`; khong tra `404`.
- Frontend `PostDetail` se bi loading mai neu `post` la `null`.

Loi:

- `500`: loi server/database.

### PATCH `/api/posts/:slug`

File: `simple_blog_be/routes/PostRouter.js`

Chuc nang:

- Cap nhat post theo slug.

Auth:

- Can dang nhap, dung `requireAuth`.

Path param:

- `slug`: slug hien tai cua post.

Request body:

Frontend hien gui:

```json
{
  "title": "New title",
  "description": "New description"
}
```

Backend chap nhan bat ky field trong `req.body` theo schema/validator cua Mongoose.

Xu ly:

1. `requireAuth` kiem tra session.
2. `Post.findOneAndUpdate({ slug }, req.body, { new: true, runValidators: true })`.
3. Tra post sau khi update.

Response thanh cong:

- Status mac dinh `200`.
- Body la post da cap nhat hoac `null` neu khong tim thay.

Loi:

- `401`: Unauthorized.
- `500`: loi update/validation/database.

Luu y:

- Neu khong tim thay slug, code hien tra `200` voi `null`, khong tra `404`.

### DELETE `/api/posts/:slug`

File: `simple_blog_be/routes/PostRouter.js`

Chuc nang:

- Xoa post theo slug.

Auth:

- Can dang nhap, dung `requireAuth`.

Path param:

- `slug`: slug cua post can xoa.

Xu ly:

1. `requireAuth` kiem tra session.
2. `Post.findOneAndDelete({ slug })`.
3. Neu khong tim thay, tra `404`.
4. Neu xoa thanh cong, tra `204` khong body.

Response thanh cong:

- `204 No Content`

Loi:

- `401`: Unauthorized.
- `404`: Post wasn't found.
- `500`: loi server/database.

Luu y:

- Khong xoa comments theo `postSlug`, nen co the con comment mo coi.

### GET `/api/posts/:slug/comments`

File: `simple_blog_be/routes/PostRouter.js`

Chuc nang:

- Lay comment cua mot post.

Auth:

- Public.

Path param:

- `slug`: slug cua post.

Xu ly:

1. Kiem tra post co ton tai bang `Post.findOne({ slug })`.
2. Neu khong co post, tra `404`.
3. Query `Comment.find({ postSlug: slug })`.
4. Sort comment moi nhat truoc bang `{ createdAt: -1 }`.
5. `.lean()`.
6. Tra `200`.

Response thanh cong:

```json
[
  {
    "_id": "...",
    "postSlug": "my-first-post",
    "username": "user1",
    "content": "Nice post",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

Loi:

- `404`: Post not found.
- `500`: Failed to get comments.

### POST `/api/posts/:slug/comments`

File: `simple_blog_be/routes/PostRouter.js`

Chuc nang:

- Tao comment moi cho post.

Auth:

- Can dang nhap. Route kiem tra `req.session.user` truc tiep, khong dung `requireAuth`.

Path param:

- `slug`: slug cua post.

Request body:

```json
{
  "content": "Nice post"
}
```

Xu ly:

1. Neu khong co `req.session.user`, tra `401`.
2. Lay `content` tu body.
3. Neu content rong hoac chi co khoang trang, tra `400`.
4. Kiem tra post ton tai.
5. Tao comment:
   - `postSlug`: slug tren URL.
   - `username`: username tu session.
   - `content`: `content.trim()`.
6. Tra `201` voi comment vua tao.

Response thanh cong:

```json
{
  "_id": "...",
  "postSlug": "my-first-post",
  "username": "user1",
  "content": "Nice post",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Loi:

- `400`: Comment is required.
- `401`: Unauthorized.
- `404`: Post not found.
- `500`: Failed to create comment.

## 7. Auth/session - giai thich chi tiet

He thong auth hien tai la stateful session auth, khong phai JWT.

### Thanh phan backend tham gia auth

File `simple_blog_be/index.js` cau hinh session:

```js
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
```

Y nghia:

- `express-session` tao mot session id.
- Session id duoc gui ve browser duoi dang cookie mac dinh ten `connect.sid`.
- Cookie co `httpOnly: true`, JavaScript frontend khong doc truc tiep duoc cookie nay.
- `maxAge` la 30 phut.
- Du lieu user that su nam o server-side session store, browser chi giu session id.

File `simple_blog_be/middleware/requireAuth.js`:

```js
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  next();
}
```

Y nghia:

- Neu request khong co session hop le hoac session chua co `user`, backend chan bang `401`.
- Neu da dang nhap, cho request di tiep.

### Luong dang ky

1. User vao `/register`.
2. Frontend validate:
   - username required.
   - password required va toi thieu 6 ky tu.
   - confirm password required.
   - password phai khop confirm password.
3. Frontend goi `POST /api/users/register`.
4. Backend kiem tra username/password, kiem tra username trung, tao user.
5. Thanh cong thi frontend hien message va sau 800ms navigate sang `/login`.

Dang ky khong tu dong dang nhap.

### Luong dang nhap

1. User vao `/login`.
2. Nhap username/password.
3. Frontend goi `POST /api/users/login` voi:

```js
credentials: "include";
```

4. Backend tim user, so sanh password plain text.
5. Neu dung, backend set:

```js
req.session.user = {
  id: user._id,
  username: user.username,
};
```

6. `express-session` gui cookie `connect.sid` ve browser.
7. Frontend nhan `{ id, username }`, goi `onLogin(result)`, tuc la `setUser(result)` trong `AppLayout`.
8. Frontend navigate sang `/posts`.

### Luong giu dang nhap khi refresh

1. `AppLayout` mount.
2. `useEffect` goi `GET /api/users/me` voi `credentials: "include"`.
3. Neu browser con cookie session hop le, backend tra user.
4. `AppLayout` set state `user`.
5. Trong luc dang check auth, UI hien `Loading...`.
6. Khi check xong, route/nav duoc render theo `user`.

### Luong bao ve route o frontend

File `simple_blog_fe/src/ProtectedRoute/index.jsx`:

```jsx
if (!user) {
  return <Navigate to="/login" replace />;
}
return children;
```

Route duoc bao ve trong frontend:

- `/newpost`
- `/stats`
- `/posts/:slug`
- `/posts/:slug/edit`

Neu `user` la null/undefined, React Router redirect ve `/login`.

Luu y quan trong:

- Frontend protection chi la UI guard.
- Bao mat that su nam o backend middleware `requireAuth` cho cac route can bao ve.
- Trong code hien tai, backend `GET /api/posts/:slug` la public, nhung frontend lai chan trang chi tiet. Ai goi API truc tiep van co the xem chi tiet post.

### Luong dang xuat

1. User bam `Logout` tren nav.
2. Frontend goi `POST /api/users/logout` voi `credentials: "include"`.
3. Backend goi `req.session.destroy()`.
4. Backend clear cookie `connect.sid`.
5. Frontend set `user` thanh `null`.
6. Frontend navigate ve `/`.

### Tai sao frontend phai dung `credentials: "include"`

Frontend va backend khac origin:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

Voi cross-origin request, browser khong tu gui cookie neu `fetch` khong khai bao:

```js
credentials: "include";
```

Backend cung phai bat:

```js
cors({ origin: "http://localhost:5173", credentials: true });
```

Neu thieu mot trong hai phia:

- Login co the tao session nhung browser khong luu/gui cookie dung cach.
- Cac API can auth se tra `401 Unauthorized`.

### Diem yeu auth hien tai

- Password luu plain text, nen can hash bang `bcrypt` hoac tuong duong.
- Session secret hard-code, nen dua vao `.env`.
- Chua co session store rieng cho production, mac dinh MemoryStore khong ben vung khi restart va khong scale.
- Chua co CSRF protection cho cookie-based auth.
- Chua regenerate session id sau login, co rui ro session fixation.
- Logout route khong can auth, tuy khong qua nguy hiem nhung nen xu ly ro rang hon.
- Cookie chua cau hinh `sameSite`/`secure`; voi production HTTPS nen cau hinh phu hop.
- Khong co role/permission; moi user dang nhap deu co the tao/sua/xoa moi post.

## 8. Frontend routing va luong tung trang

Routing duoc khai bao trong `simple_blog_fe/src/AppLayout/index.jsx`.

### App startup

Files:

- `simple_blog_fe/index.html`
- `simple_blog_fe/src/main.jsx`
- `simple_blog_fe/src/App.jsx`
- `simple_blog_fe/src/AppLayout/index.jsx`

Luong:

1. Browser load `index.html`.
2. Script `/src/main.jsx` chay.
3. React render:

```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

4. `App` render `AppLayout`.
5. `AppLayout` fetch `/api/users/me` de khoi phuc auth.
6. Trong luc auth loading, hien `Loading...`.
7. Sau khi check auth xong, render nav va route.

### Navigation bar

Nav luon co:

- Home -> `/`
- About -> `/about`
- Posts -> `/posts`

Khi chua dang nhap:

- Login -> `/login`
- Register -> `/register`

Khi da dang nhap:

- New Post -> `/newpost`
- Stats -> `/stats`
- Logout -> goi API logout va ve `/`

### `/` - Home page

File: `simple_blog_fe/src/pages/Home/index.jsx`

UI:

- Hien heading `This is Home Page !`

API:

- Khong goi API rieng.

Auth:

- Public.

### `/about` - About page

File: `simple_blog_fe/src/pages/About/index.jsx`

UI:

- Hien heading `This is About Page !`

API:

- Khong goi API.

Auth:

- Public.

### `/posts` - Posts layout + Post list

Files:

- `simple_blog_fe/src/pages/Posts/index.jsx`
- `simple_blog_fe/src/pages/Posts/PostLists/index.jsx`

UI:

- `Posts` hien heading `This is Posts Page !`.
- Ben trong render `<Outlet />`.
- Route index cua `/posts` render `PostLists`.
- `PostLists` hien:
  - `Loading...` khi dang fetch.
  - error message neu fetch loi.
  - `Chua co bai post nao` neu mang rong.
  - danh sach link post neu co data.

API:

- `GET http://localhost:8080/api/posts`

Auth:

- Frontend public.
- Backend API public.

Luong:

1. Vao `/posts`.
2. `PostLists` mount.
3. `useEffect` fetch list post.
4. Neu thanh cong, luu vao state `posts`.
5. Render moi post thanh link `/posts/{slug}`.

Ghi chu:

- Code xoa post trong `PostLists` dang bi comment.

### `/posts/:slug` - Post detail

File: `simple_blog_fe/src/pages/Posts/PostDetail/index.jsx`

Auth:

- Frontend protected bang `ProtectedRoute`.
- Backend API doc post va doc comments public.
- Backend API delete/comment can session.

UI:

- Neu `post` chua co, hien `Loading post...`.
- Khi co post:
  - hien title.
  - hien description.
  - nut Edit.
  - nut Delete.
  - form comment.
  - danh sach comments.

API khi mount:

- `GET /api/posts/:slug`
- `GET /api/posts/:slug/comments`

API khi delete:

- `DELETE /api/posts/:slug`
- Co `credentials: "include"`.

API khi comment:

- `POST /api/posts/:slug/comments`
- Co `credentials: "include"`.
- Body:

```json
{
  "content": "..."
}
```

Luong xem chi tiet:

1. User click link post o `/posts`.
2. React Router match route `/posts/:slug`.
3. `ProtectedRoute` kiem tra `user`.
4. Neu chua dang nhap, redirect `/login`.
5. Neu da dang nhap, render `PostDetail`.
6. `PostDetail` lay `slug` bang `useParams()`.
7. Fetch post va comments.
8. Render noi dung.

Luong edit:

1. Bam `Edit`.
2. `navigate(`/posts/${slug}/edit`)`.

Luong delete:

1. Bam `Delete`.
2. Browser confirm `Delete this post ?`.
3. Neu OK, goi `DELETE /api/posts/:slug`.
4. Neu thanh cong, navigate ve `/posts`.

Luong comment:

1. User nhap comment.
2. Submit form.
3. Goi `POST /api/posts/:slug/comments`.
4. Neu loi, hien message mau do.
5. Neu thanh cong, them comment moi vao dau list va clear input.

### `/posts/:slug/edit` - Edit post

File: `simple_blog_fe/src/pages/EditPost/index.jsx`

Auth:

- Frontend protected bang `ProtectedRoute`.
- Backend PATCH can session.
- Backend GET post public.

UI:

- Form gom:
  - title
  - description
  - Save button
  - message loi neu co

API khi mount:

- `GET /api/posts/:slug`

API khi submit:

- `PATCH /api/posts/:slug`
- Co `credentials: "include"`.
- Body:

```json
{
  "title": "...",
  "description": "..."
}
```

Luong:

1. Vao `/posts/:slug/edit`.
2. `ProtectedRoute` check user.
3. `EditPost` lay `slug`.
4. Fetch post hien tai.
5. Set form state tu title/description.
6. User sua form va submit.
7. Goi PATCH.
8. Neu thanh cong, navigate ve `/posts/:slug`.
9. Neu loi, hien `Update post failed`.

Luu y:

- Trang edit khong cho sua `slug`.
- Neu GET post tra `null`, code se doc `data.title` va co the loi.

### `/newpost` - New post

File: `simple_blog_fe/src/pages/NewPost/index.jsx`

Auth:

- Frontend protected bang `ProtectedRoute`.
- Backend `POST /api/post` can session.

UI:

- Form dung `react-hook-form`.
- Fields:
  - slug required.
  - title required.
  - description required.
- Submit button `Add new post`.
- Message thanh cong/that bai.

API:

- `POST /api/post`
- Co `credentials: "include"`.
- Body la JSON tu form:

```json
{
  "slug": "...",
  "title": "...",
  "description": "..."
}
```

Luong:

1. User vao `/newpost`.
2. `ProtectedRoute` check user.
3. User nhap form.
4. `react-hook-form` validate required.
5. Submit thi goi API tao post.
6. Neu OK, reset form va hien `Post created successfully !`.
7. Neu loi, hien `Post created failed !`.

### `/stats` - Stats page

File: `simple_blog_fe/src/pages/Stats/index.jsx`

Auth:

- Frontend protected bang `ProtectedRoute`.
- Backend `GET /api/users/stats` can session.

UI:

- Heading `This is Stats Page !`
- Loi chao user hien tai: `Xin chao: {user?.username}`
- Danh sach user.
- Message loi mau do neu API fail.

API:

- `GET /api/users/stats`
- Co `credentials: "include"`.

Luong:

1. User vao `/stats`.
2. `ProtectedRoute` check user.
3. `Stats` fetch users.
4. Neu OK, render username list.
5. Neu loi, render message.

### `/login` - Login page

File: `simple_blog_fe/src/pages/Login/index.jsx`

Auth:

- Public.

UI:

- Form username/password.
- Submit button Login.
- Message loi mau do.

API:

- `POST /api/users/login`
- Co `credentials: "include"`.

Body:

```json
{
  "username": "...",
  "password": "..."
}
```

Luong:

1. User nhap credentials.
2. Submit form.
3. Frontend goi login API.
4. Neu backend tra loi, hien message.
5. Neu thanh cong:
   - `onLogin(result)` cap nhat `user` trong `AppLayout`.
   - Navigate `/posts`.

### `/register` - Register page

File: `simple_blog_fe/src/pages/Register/index.jsx`

Auth:

- Public.

UI:

- Form dung `react-hook-form`.
- Fields:
  - username required.
  - password required, min length 6.
  - confirmPassword required.
- Message thanh cong mau xanh, loi mau do.

API:

- `POST /api/users/register`

Body frontend gui:

```json
{
  "username": "...",
  "password": "..."
}
```

Luong:

1. User nhap form.
2. `react-hook-form` validate required/min length.
3. Code tu check password co khop confirm password.
4. Goi register API.
5. Neu thanh cong:
   - reset form.
   - hien `User created successfully. Redirecting to login...`
   - sau 800ms navigate `/login`.
6. Neu loi:
   - hien message tu backend hoac HTTP status.

### `*` - Error404 page

File: `simple_blog_fe/src/pages/Error404/index.jsx`

UI:

- Hien `404 NOT FOUND !`

API:

- Khong goi API.

Auth:

- Public.

## 9. Mapping frontend page -> backend API

| Frontend                 | API dung                         | Auth yeu cau                       |
| ------------------------ | -------------------------------- | ---------------------------------- |
| AppLayout mount          | `GET /api/users/me`              | session neu co                     |
| Logout nav               | `POST /api/users/logout`         | gui session neu co                 |
| `/posts`                 | `GET /api/posts`                 | public                             |
| `/posts/:slug`           | `GET /api/posts/:slug`           | backend public, frontend protected |
| `/posts/:slug`           | `GET /api/posts/:slug/comments`  | public                             |
| `/posts/:slug` delete    | `DELETE /api/posts/:slug`        | backend protected                  |
| `/posts/:slug` comment   | `POST /api/posts/:slug/comments` | backend protected                  |
| `/posts/:slug/edit` load | `GET /api/posts/:slug`           | backend public, frontend protected |
| `/posts/:slug/edit` save | `PATCH /api/posts/:slug`         | backend protected                  |
| `/newpost`               | `POST /api/post`                 | backend protected                  |
| `/stats`                 | `GET /api/users/stats`           | backend protected                  |
| `/login`                 | `POST /api/users/login`          | public                             |
| `/register`              | `POST /api/users/register`       | public                             |

## 10. Routing table frontend

| Path                | Component                              | Protected? |
| ------------------- | -------------------------------------- | ---------- |
| `/`                 | `Home`                                 | No         |
| `/about`            | `About`                                | No         |
| `/posts`            | `Posts` + `PostLists`                  | No         |
| `/posts/:slug`      | `Posts` + `ProtectedRoute(PostDetail)` | Yes        |
| `/posts/:slug/edit` | `Posts` + `ProtectedRoute(EditPost)`   | Yes        |
| `/newpost`          | `ProtectedRoute(NewPost)`              | Yes        |
| `/stats`            | `ProtectedRoute(Stats)`                | Yes        |
| `/login`            | `Login`                                | No         |
| `/register`         | `Register`                             | No         |
| `*`                 | `Error404`                             | No         |

## 11. Data shape tong quat

### User

Backend database:

```json
{
  "_id": "...",
  "username": "user1",
  "password": "plain-text-password",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Backend tra ra frontend:

```json
{
  "id": "...",
  "username": "user1"
}
```

### Session user

Luu trong `req.session.user`:

```json
{
  "id": "...",
  "username": "user1"
}
```

### Post

```json
{
  "_id": "...",
  "slug": "my-first-post",
  "title": "My First Post",
  "description": "Content..."
}
```

### Comment

```json
{
  "_id": "...",
  "postSlug": "my-first-post",
  "username": "user1",
  "content": "Nice post",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## 12. Cac luong chinh end-to-end

### Xem danh sach post

1. Browser vao `/posts`.
2. React render `Posts` va `PostLists`.
3. `PostLists` fetch `GET /api/posts`.
4. Backend query MongoDB collection `Posts`.
5. Frontend render danh sach title thanh link.

### Dang ky -> dang nhap -> tao post

1. Vao `/register`.
2. Submit username/password.
3. Backend tao user.
4. Frontend ve `/login`.
5. Submit login.
6. Backend set `req.session.user`, browser nhan cookie `connect.sid`.
7. Frontend set state `user`, nav hien New Post/Stats/Logout.
8. Vao `/newpost`.
9. Submit slug/title/description.
10. Frontend gui cookie session.
11. Backend `requireAuth` pass va tao post.

### Refresh khi da dang nhap

1. Browser refresh.
2. React state mat vi reload.
3. `AppLayout` goi `/api/users/me`.
4. Browser gui cookie session neu con han.
5. Backend doc session va tra user.
6. Frontend khoi phuc `user`.

### Sua post

1. User da dang nhap vao `/posts/:slug`.
2. Bam Edit.
3. Vao `/posts/:slug/edit`.
4. Fetch post hien tai.
5. Submit PATCH co cookie session.
6. Backend `requireAuth` pass, update MongoDB.
7. Frontend navigate ve detail page.

### Xoa post

1. User da dang nhap vao detail page.
2. Bam Delete va confirm.
3. Frontend goi `DELETE /api/posts/:slug` co cookie session.
4. Backend `requireAuth` pass va xoa post.
5. Frontend ve `/posts`.

### Comment

1. User da dang nhap vao detail page.
2. Nhap comment.
3. Frontend goi `POST /api/posts/:slug/comments` co cookie session.
4. Backend lay username tu session, khong lay username tu body.
5. Backend tao comment.
6. Frontend prepend comment moi vao danh sach.

## 13. Luu y ve tinh nhat quan va rui ro

Nhung diem dang chu y trong source hien tai:

- `GET /api/posts/:slug` backend public, nhung frontend protected. Neu muc tieu la post detail chi cho user da dang nhap, backend cung nen co `requireAuth`.
- Password chua hash.
- Chua co owner/author cho post, nen moi user dang nhap deu co quyen sua/xoa tat ca post.
- Tao post khong gan tac gia vao post.
- Comment chi luu `username`, khong luu `userId`; neu user doi username sau nay se kho lien ket.
- Delete post khong delete comment lien quan.
- `GET /api/posts/:slug` va `PATCH /api/posts/:slug` khong tra `404` khi khong tim thay.
- `dbConnect.js` import `User` nhung khong dung.
- `body-parser` trong dependency nhung khong dung truc tiep.
- `express.json()` duoc goi 2 lan.
- Backend co nhieu block code cu bi comment trong `index.js` ve BlogPosts/JWT/stateful example; khong tham gia runtime.
- Mot so text tieng Viet trong frontend dang bi loi encoding, vi du `ChÆ°a cÃ³ bÃ i post nÃ o`, `Xin chÃ o`.
- `src/App.css` con CSS template nhung `App.jsx` khong import `App.css`, nen phan style nay co the khong ap dung.
- `simple_blog_fe/dist` la build output da ton tai trong repo.
- `simple_blog_be/test` hien rong va script test chua co test that.

## 14. Cach chay du an

Backend:

```bash
cd simple_blog_be
npm install
npm run dev
```

Dieu kien:

- `.env` phai co `DB_URL`.
- MongoDB URL phai truy cap duoc.

Frontend:

```bash
cd simple_blog_fe
npm install
npm run dev
```

Mo:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:8080/api
```

## 15. Tom tat ngan gon

Du an la blog React + Express + MongoDB. Auth dung session cookie, khong dung JWT. Khi login, backend luu `{ id, username }` vao `req.session.user`, browser giu cookie `connect.sid`, va frontend gui cookie qua `credentials: "include"`. Middleware `requireAuth` bao ve tao/sua/xoa post va stats. Frontend dung `ProtectedRoute` de chan mot so trang khi state `user` khong ton tai. Database co 3 model chinh: `Users`, `Posts`, `Comments`.
