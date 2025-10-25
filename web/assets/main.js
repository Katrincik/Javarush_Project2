document.querySelector(".join-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    await joinChat();
});

async function joinChat() {
    const nameInput = document.getElementById("name");
    const username = nameInput.value.trim();

    if (!username) {
        alert("Please enter a name!");
        return;
    }

    try {
        const response = await fetch(`/api/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        });
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Failed to create user");
            return;
        }

        if (!data.user) {
            throw new Error("Invalid server response — no user field returned.");
        }

        const user = data.user;
        console.log("Created user:", user);
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/chat.html";
    } catch(err) {
        console.error("Error creating user:", err);
        alert("Unable to join chat right now.");
    }
}