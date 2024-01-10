"use strict";
let habbits = [];

const HABBIT_KEY = "HABBIT_KEY";
/* page */
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".header__title"),
    progressProcent: document.querySelector(".progress__num"),
    progressBar: document.querySelector(".progress__cover-bar"),
  },
  content: {
    daysContainer: document.getElementById("days"),
    nextDays: document.querySelector(".habbit__day"),
  },
};

/* utils */

function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArrey = JSON.parse(habbitsString);
  if (Array.isArray(habbitArrey)) {
    habbits = habbitArrey;
  }
}

/* rerender */

function rerenderMenu(activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", habbit.id);

      element.classList.add("menu__item");
      element.addEventListener("click", () => rerender(habbit.id));
      element.innerHTML = `<img src="images/icons/${habbit.icon}.svg" alt="${habbit.name}" />`;

      if (activeHabbit.id === habbit.id) {
        element.classList.add("menu__item_active");
      }
      page.menu.appendChild(element);

      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("menu__item_active");
    } else {
      existed.classList.remove("menu__item_active");
    }
  }
}
function renderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressProcent.innerText = progress.toFixed(0) + "%";
  page.header.progressBar.setAttribute("style", `width:${progress}%`);
}
function renderHabbit(activeHabbit) {
  page.content.daysContainer.innerHTML = "";
  for (const index in activeHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = ` <div class="habbit__day">День ${
      Number(index) + 1
    }</div>
    <div class="habbit__coment">
     ${activeHabbit.days[index].comment}
    </div>
    <button class="habbit__delete">
      <img src="images/icons/delete.svg" alt="удалить день ${index + 1}" />
    </button>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDays.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  rerenderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderHabbit(activeHabbit);
}

/*init*/
function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

(() => {
  loadData();
  rerender(habbits[0].id);
})();
