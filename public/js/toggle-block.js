document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-header").forEach(header => {
      header.addEventListener("click", () => {
        const section = header.closest(".toggle-block");
        section.classList.toggle("collapsed");
      });
    });
  });
  