// Register
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch("/auth/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const message = await response.text();

        document.getElementById("message").textContent = message;

        if (response.ok) {
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        }
    });
}


// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch("/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const message = await response.text();

        document.getElementById("message").textContent = message;

        if (response.ok) {
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        }
    });
}