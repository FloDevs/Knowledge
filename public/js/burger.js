document.addEventListener("DOMContentLoaded", () => {
  const adminBurger = document.getElementById("admin-burger");
  const adminNav = document.getElementById("admin-nav");
  const siteBurger = document.getElementById("site-burger");
  const navLeft = document.getElementById("nav-left");
  const navRight = document.getElementById("nav-right");

  if (adminBurger && adminNav) {
    adminBurger.addEventListener("click", () => {
      adminNav.classList.toggle("show");
    });
  }

  if (siteBurger && navLeft && navRight) {
    siteBurger.addEventListener("click", () => {
      navLeft.classList.toggle("show");
      navRight.classList.toggle("show");
    });
  }
});
