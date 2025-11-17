# Projeto 2 – Full Stack (ES47B)

Aplicação Full Stack composta por **Frontend (React)** e **Backend (Express + SQLite)**.
Desenvolvido por **Gabriel Henrique de Almeida Souza** e **Gustavo Prezoto Boca**.

---

## 🚀 Frontend (React + Vite)

**Como executar:**

```bash
cd frontend
npm install
npm run dev
```

O frontend espera o backend em `http://localhost:3000`.
Para alterar, configure no `.env`:

```
VITE_API_BASE=http://localhost:3000
```

---

## 🖥️ Backend (Express + SQLite)

**Como executar:**

```bash
cd backend
npm install
npm run init-db
npm run dev
```

Servidor disponível em `http://localhost:3000`.

**Usuário padrão:**

* Email: `admin@example.com`
* Senha: `123456`

---

## 📘 Sobre o Projeto

Projeto 2 da disciplina **Full Stack – ES47B**, contendo funcionalidades de **login, busca e inserção**, com integração completa entre frontend e backend.