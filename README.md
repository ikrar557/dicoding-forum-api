# Forum API

Forum API adalah RESTful API yang memungkinkan pengguna untuk membuat dan berpartisipasi dalam diskusi secara online. API ini dibangun menggunakan JavaScript dengan framework **Hapi** dan basis data **PostgreSQL**.

---

## ✨ Fitur

- 🔐 Autentikasi (register, login) dengan JWT
- 🧵 CRUD Topik Diskusi
- 💬 Membalas topik (reply)
- 👍 Sistem like / vote

---

## 🛠️ Teknologi

- **Backend:** JavaScript, [Hapi.js](https://hapi.dev/)
- **Database:** PostgreSQL
- **ORM / Query Builder:** pg
- **Autentikasi:** JWT (JSON Web Token)

---

## 🚀 Instalasi

### 1. Clone proyek ini

```bash
git clone https://github.com/username/forum-api.git
cd forum-api
```

### 2. Install dependencies

```bash
npm install
```

## 3. Buat file konfigurasi `.env`

Salin file `.env.example` menjadi `.env`, lalu isi sesuai konfigurasi lokalmu:

```bash
PGHOST_TEST = "localhost"
PGUSER_TEST = "postgres"
PGPASSWORD_TEST = ""
PGDATABASE_TEST = "forumapi_test"
PGPORT_TEST = 5432
```

### 4. Setup database

```bash
npm run migrate
```

### 5. Jalankan server

```bash
npm start
```

## 📝 Tugas

### ✅ 1. **Menggunakan Struktur Data**

**Status:** ✔

**Bukti:**

Struktur data seperti `object`, `array`, dan `class-based entity` digunakan secara luas, terutama pada folder `Domains/*/entities` (misalnya: `AddThread.js`, `AddComment.js`).

**Kode:**

```javascript
// src/Domains/threads/entities/AddThread.js
class AddThread {
  constructor(payload) {
    const { title, body, owner } = payload;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }
}
module.exports = AddThread;
```

> Data `title`, `body`, dan `owner` disimpan secara **terstruktur** dalam satu entitas.

---

### ✅ 2. **Menerapkan Perintah Eksekusi Bahasa Pemrograman**

**Status:** ✔

**Bukti:**

Seluruh API berjalan melalui eksekusi program JavaScript dengan framework Hapi (`app.js`, `createServer.js`), menunjukkan implementasi perintah eksekusi melalui `node app.js`.

**Kode:**

```javascript
// src/app.js
require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');

(async () => {
  const server = await createServer(container);
  await server.start();
  console.log(`server start at ${server.info.uri}`);
})();
```

> Eksekusi dijalankan menggunakan pendekatan text (CLI) dengan menjalan projet dengan bantuan `npm`

---

### ✅ 3. **Menerapkan Metode dan Praktik Reusable**

**Status:** ✔

**Bukti:**

Class seperti `UserRepository`, `PasswordHash`, dan `AuthenticationTokenManager` didesain reusable, serta digunakan lintas modul melalui dependency injection (`container.js`).

**Kode:**

```javascript
// src/Applications/security/PasswordHash.js
class PasswordHash {
  async hash(password) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }

  async comparePassword(plain, encrypted) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  }
}
```

> Re-usable untuk berkas lain, semisalkan `RegisterUserUseCase` dan `LoginUserUseCase`

---

### ✅ 4. **Mengimplementasikan Pemrograman Terstruktur**

**Status:** ✔

**Bukti:**

Struktur direktori terorganisasi dengan rapi (seperti `Domains`, `Applications`, `Interfaces`, dll), dan penggunaan fungsi serta modul yang terpisah sesuai tanggung jawabnya menunjukkan pemrograman terstruktur.

**Kode:**

```javascript
// src/Interfaces/http/api/threads/handler.js
  async getThreadByIdHandler(request, h) {
    const { threadId: id } = request.params;

    const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
    const thread = await detailThreadUseCase.execute(id);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });

    return response;
  }
```

> `handler.js` hanya fokus pada penanganan HTTP Request, bukan bisnis logic, bukan query SQL, bukan validasi user — semua dipisah ke tempat yang sesuai.

### ✅ 5. **Menggunakan Library atau Komponen Pre-existing**

**Status:** ✔

**Bukti:**

Library seperti:

* `dotenv` (konfigurasi environment),
* `bcrypt` (hash password),
* `jsonwebtoken` (JWT token),
* `pg` (koneksi database),

**Kode:**

```javascript
// src/Infrastructures/container.js
const { createContainer } = require('instances-container');

const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');
```

> Menggunakan library tambahan seperti `hapi`, `bcrypt` untuk authentikasi, `nanoid` untuk membuat id pada tabel.

---



### ✅ 6. **Menggunakan SQL**

**Status:** ✔

**Bukti:**

Modul di `Infrastructures/repository/*.js` seperti `ThreadRepositoryPostgres.js` dan `UserRepositoryPostgres.js` menggunakan raw SQL (query string) untuk berinteraksi dengan PostgreSQL.

**Kode:**

```javascript
// tests/UsersTableTestHelper.js
const UsersTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  },
```

> Menggunakan *SQL Raw* untuk memasukan data *dummy* ke database.

---

### ✅ 7. **Menerapkan Akses Basis Data**

**Status:** ✔

**Bukti:**

Koneksi ke database diatur melalui `pool.js`, dan digunakan oleh repositori untuk melakukan operasi `CRUD` (Create, Read, Update, Delete).

Kode:

```javascript
// src/Infrastructures/database/postgres
const { Pool } = require('pg');

const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
};

const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool();

module.exports = pool;
```

> Mengatur koneksi ke database dengan bantuan module `pool`, module `pool` sendiri menjembatani akses ke database dengan bantuan library `dotenv` untuk memudahkan konfigurasi.

---

### ✅ 8. **Mengimplementasikan Algoritma Pemrograman**

**Status:** ✔

**Bukti:**

Logika seperti login, validasi token, manajemen like/unlike, dan pengecekan authentikasi menunjukkan adanya implementasi algoritma

**Kode:**

```javascript
    const thread = await this._threadRepository.getThreadById(id);

    let comments = await this._commentRepository.getAllCommentsByThreadId(id);

    const replays = await this._replayRepository.fetchAllReplaysByThreadId(id);

    comments = await this._likesRepository.getCommentLikesForEveryComment(comments);

    comments = comments.map((comment) => ({
      ...new DetailComment(comment),
      likeCount: comment.likeCount,
      replies: replays.filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({ ...new DetailReplay(reply) })),
    }));

    return { ...thread, comments };
```

> Mengambil data `thread`, `comment`, `replay`, dan `like` menjadi satu struktur yang terintegrasi.

---

### ✅ 9. **Melakukan Debugging**

**Status:** ✔

**Bukti:**

Proyek memiliki banyak unit test (`_test` folder), yang secara tidak langsung melibatkan debugging saat test gagal. Selain itu, library seperti `jest`/`supertest` biasanya dilengkapi logging saat error.

**Kode:**

```javascript
// src/Domains/users/entities/UserLogin.js
  constructor(payload) {
    this._verifyPayload(payload);

    this.username = payload.username;
    this.password = payload.password;
  }

  _verifyPayload(payload) {
    const { username, password } = payload;

    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
```

> Melakukan *debugging* dengan mengembailkan pesan *error* data yang di inputkan tidak sesuai dengan harapan.

---

### ✅ 10. **Melaksanakan Pengujian Unit Program**

**Status:** ✔````````````````````

**Bukti:**

Terdapat test pada hampir setiap modul, baik di level domain (`*.test.js`), use case (`*.UseCase.test.js`), maupun integrasi HTTP (`http/_test/*.test.js`). Ini membuktikan pengujian unit telah dilaksanakan dengan baik.

**Kode:**

```javascript
// src/Domains/users/entities/_test/UserLogin.test.js
  it('should create UserLogin entities correctly', () => {
    const payload = {
      username: 'dicoding',
      password: '12345',
    };

    const userLogin = new UserLogin(payload);

    expect(userLogin).toBeInstanceOf(UserLogin);
    expect(userLogin.username).toEqual(payload.username);
    expect(userLogin.password).toEqual(payload.password);
```

> Melakukan pengujian dengan membandingkan data 

---



## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.
