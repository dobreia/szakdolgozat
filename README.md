# Szépségszalon időpontfoglaló rendszer

## 📌 Áttekintés

Ez a projekt egy webalapú időpontfoglaló rendszer, amely egy szépségszalon működését támogatja.  
A felhasználók szolgáltatásokat böngészhetnek, dolgozót választhatnak, majd időpontot foglalhatnak.

A rendszer célja a manuális (telefonos vagy papíralapú) időpontkezelés kiváltása egy modern, automatizált megoldással.

---

## 🚀 Fő funkciók

- Időpontfoglalás szolgáltatásra és dolgozóra
- Foglalások módosítása és lemondása
- Admin felület (szolgáltatások, dolgozók, felhasználók kezelése)
- JWT alapú hitelesítés
- Szerepkör kezelés (user / admin)
- E-mail értesítések foglaláskor
- Átfedő időpontok automatikus tiltása

---

## 🧠 Kiemelt technikai megoldások

- Relációs adatmodell (users, services, employees, bookings)
- REST API alapú backend
- Role-based access control

---

## 🛠 Használt technológiák

Frontend:
- React
- Vite
- Axios

Backend:
- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt

---

## ⚙️ Futtatás

Backend indítása:
cd backend
npm install
npm run dev

Frontend indítása:
cd frontend
npm install
npm run dev

---

## 📄 Dokumentáció

A részletes dokumentáció a repository-ban található.
