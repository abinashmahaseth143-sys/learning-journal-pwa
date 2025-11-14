document.addEventListener("DOMContentLoaded", () => {
    fetch("backend/reflections.json")
        .then(r => r.json())
        .then(data => {
            const box = document.getElementById("json-entries");
            document.getElementById("counter").textContent = data.length + " reflection(s)";
            if (data.length === 0) {
                box.innerHTML = "<p>No entries yet – run save_entry.py and push to GitHub!</p>";
                return;
            }
            data.reverse().forEach(e => {
                const div = document.createElement("article");
                div.innerHTML = `
                    <h3>${e.date}</h3>
                    <p>${e.text.replace(/\n/g, "<br>")}</p>
                    <small>${e.words} words</small>
                    <hr>
                `;
                box.appendChild(div);
            });
        })
        .catch(() => {
            document.getElementById("json-entries").innerHTML = "<p>Entries will appear after you push to GitHub</p>";
        });
});