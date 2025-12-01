import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

// Regisztrációs endpoint
// A regisztrációs kérelmet a AuthController.register metódus kezeli
router.post("/register", AuthController.register);

// Bejelentkezési endpoint
// A bejelentkezési kérelmet a AuthController.login metódus kezeli
router.post("/login", AuthController.login);

export default router;
