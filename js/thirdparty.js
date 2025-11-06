document.addEventListener("DOMContentLoaded", () => {
  const fbButton = document.getElementById("facebook-share");
  if (!fbButton) return;

  fbButton.addEventListener("click", () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    window.open(fbShareUrl, "_blank", "width=600,height=400");
  });
});
