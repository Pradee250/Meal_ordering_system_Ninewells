// Hardcoded user accounts (you can change this to be dynamic, such as from a database)
const users = [
    { username: "pradeep", password: "123", role: "employer" },
    { username: "manager1", password: "123", role: "manager" },
];

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Check if the username and password match
    const user = users.find(u => u.username === username && u.password === password && u.role === role);

    if (user) {
        // Store user details in localStorage to simulate user session
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Redirect to dashboard after successful login
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid credentials!");
    }
});
