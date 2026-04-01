# Szépségszalon időpontfoglaló rendszer

---

## 🇭🇺 Magyar / 🇬🇧 English

- [🇭🇺 Magyar leírás](#-magyar-leírás)
- [🇬🇧 English documentation](#-english-documentation)

---

# 🇭🇺 Magyar leírás

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

### Backend indítása

```bash
cd backend
npm install
npm run dev
```

### Frontend indítása

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 Dokumentáció

Részletes magyar nyelvű dokumentáció a repository-ban található.

---

# 🇬🇧 English documentation

## 📌 Overview

This project is a web-based appointment booking system designed to support the operation of a beauty salon.  
Users can browse services, select an employee, and book an appointment.

The goal of the system is to replace manual (phone or paper-based) scheduling with a modern, automated solution.

---

## 🚀 Main features

- Booking appointments for services and employees
- Modifying and cancelling bookings
- Admin panel (manage services, employees, users)
- JWT-based authentication
- Role management (user / admin)
- Email notifications on booking
- Automatic prevention of overlapping bookings

---

## 🧠 Key technical solutions

- Relational data model (users, services, employees, bookings)
- REST API-based backend
- Role-based access control

---

## 🛠 Technologies used

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

## ⚙️ Running the project

### Start backend

```bash
cd backend
npm install
npm run dev
```

### Start frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📄 Documentation

Detailed Hungarian documentation is available in the repository.
