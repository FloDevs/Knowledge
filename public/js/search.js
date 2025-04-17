document.addEventListener('DOMContentLoaded', function () {
    // Cursus
    const searchCursus = document.getElementById('searchCursus');
    const searchCursusBtn = document.getElementById('searchCursusBtn');
    const cursusList = document.querySelectorAll('#cursusList li');
  
    if (searchCursus && searchCursusBtn && cursusList.length) {
      function filterCursus() {
        const term = searchCursus.value.toLowerCase();
        cursusList.forEach((item) => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(term) ? '' : 'none';
        });
      }
  
      searchCursusBtn.addEventListener('click', filterCursus);
      searchCursus.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          filterCursus();
        }
      });
    }
  
    // Leçons
    const searchLesson = document.getElementById('searchLesson');
    const searchLessonBtn = document.getElementById('searchLessonBtn');
    const lessonList = document.querySelectorAll('#lessonList li');
  
    if (searchLesson && searchLessonBtn && lessonList.length) {
      function filterLessons() {
        const term = searchLesson.value.toLowerCase();
        lessonList.forEach((item) => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(term) ? '' : 'none';
        });
      }
  
      searchLessonBtn.addEventListener('click', filterLessons);
      searchLesson.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          filterLessons();
        }
      });
    }
  });
  