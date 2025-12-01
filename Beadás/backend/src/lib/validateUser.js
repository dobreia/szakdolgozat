// E-mail formátum ellenőrzése
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Jelszó formátum ellenőrzése (legalább 6 karakter, kis- és nagybetű, szám)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export function validateUserInput({ name, email, password }) {

    // Név validálása: nem lehet üres
    if (!name || name.trim().length === 0) {
        const err = new Error("Név megadása kötelező!");
        err.status = 400;
        throw err;
    }

    // E-mail validálása: nem lehet üres
    if (!email || email.trim().length === 0) {
        const err = new Error("E-mail mező kitöltése kötelező!");
        err.status = 400;
        throw err;
    }

    // E-mail formátum ellenőrzése
    if (!emailRegex.test(email)) {
        const err = new Error("Érvénytelen e-mail formátum!");
        err.status = 400;
        throw err;
    }

    // Jelszó validálása: nem lehet üres
    if (!password || password.trim().length === 0) {
        const err = new Error("Jelszó megadása kötelező!");
        err.status = 400;
        throw err;
    }

    // Jelszó formátum ellenőrzése: minimum 6 karakter, kis- és nagybetű, szám
    if (!passwordRegex.test(password)) {
        const err = new Error(
            "A jelszónak minimum 6 karakterből kell állnia, " +
            "és tartalmaznia kell kis- és nagybetűt, valamint számot!"
        );
        err.status = 400;
        throw err;
    }
}
