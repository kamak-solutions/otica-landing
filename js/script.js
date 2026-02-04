const links = document.querySelectorAll('.menu a');
const sections = document.querySelector('.sections');
const panels = document.querySelectorAll('.panel');
const arrows = document.querySelectorAll('.arrow');

let currentIndex = 0;

function updateArrows() {
  panels.forEach((panel, index) => {
    const prev = panel.querySelector('.arrow-prev');
    const next = panel.querySelector('.arrow-next');

    if (prev) prev.style.display = index === 0 ? 'none' : 'block';
    if (next) next.style.display = index === panels.length - 1 ? 'none' : 'block';
  });
}

function goToSection(index) {
  if (index < 0 || index >= panels.length) return;

  currentIndex = index;
  sections.style.transform = `translateX(-${index * 100}vw)`;

  links.forEach(l => l.classList.remove('active'));
  links[index].classList.add('active');

  updateArrows();
}

/* MENU */
links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goToSection(Number(link.dataset.index));
  });
});

/* SETAS */
arrows.forEach(arrow => {
  arrow.addEventListener('click', () => {
    if (arrow.dataset.go === 'next') {
      goToSection(currentIndex + 1);
    } else {
      goToSection(currentIndex - 1);
    }
  });
});

/* INIT */
updateArrows();
