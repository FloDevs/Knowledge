document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchCursus');
  const searchBtn = document.getElementById('searchCursusBtn');
  const cursusList = document.querySelectorAll('#cursusList li');
  const isOnCursusPage = window.location.pathname === "/cursus";

  function filterCursus() {
    const term = searchInput.value.toLowerCase();
    cursusList.forEach((item) => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(term) ? '' : 'none';
    });
  }

  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', function (e) {
      if (isOnCursusPage && cursusList.length) {
        e.preventDefault();
        filterCursus();
      }
    });

    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        if (isOnCursusPage && cursusList.length) {
          e.preventDefault();
          filterCursus();
        }
      }
    });
  }
});
