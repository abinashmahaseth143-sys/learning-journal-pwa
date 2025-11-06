document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save-entry");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    if (Notification.permission === "granted") {
      new Notification("✅ Your journal entry has been saved!");
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("✅ Your journal entry has been saved!");
        } else {
          alert("Notification permission denied.");
        }
      });
    }
  });
});
