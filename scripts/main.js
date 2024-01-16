"use strict";
let habbits = [];

const HABBIT_KEY = "HABBIT_KEY";
let globalHabbitId;
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
  popup: {
    index: document.getElementById("add-habbit-popup"),
    iconField: document.querySelector('.popUp__form input[name="icon"]'),
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

function tooglePopup() {
  if (page.popup.index.classList.contains("cover_hidden")) {
    page.popup.index.classList.remove("cover_hidden");
  } else {
    page.popup.index.classList.add("cover_hidden");
  }
}
function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = "";
  }
}

function validateAndGetFormData(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove("error");
    if (!fieldValue) {
      form[field].classList.add("error");
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
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
    <button class="habbit__delete" onclick="deleteDay(${index})">
      <img src="images/icons/delete.svg" alt="удалить день ${index + 1}" />
    </button>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDays.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
  globalHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  document.location.replace(document.location.pathname + "#" + activeHabbitId);
  rerenderMenu(activeHabbit);
  renderHead(activeHabbit);
  renderHabbit(activeHabbit);
}
/* work with days */
function addDays(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ["comment"]);
  if (!data) {
    return;
  }

  habbits = habbits.map((habbit) => {
    if (habbit.id === globalHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });
  resetForm(event.target, ["comment"]);
  rerender(globalHabbitId);
  saveData();
}

function deleteDay(index) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalHabbitId) {
      habbit.days.splice(index, 1);
      return {
        ...habbit,
        days: habbit.days,
      };
    }
    return habbit;
  });
  rerender(globalHabbitId);
  saveData();
}

/* working with habbits */

function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector(".icon_active");
  console.log(activeIcon);
  activeIcon.classList.remove("icon_active");
  context.classList.add("icon_active");
}

function addHabbit(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ["name", "icon", "target"]);
  if (!data) {
    return;
  }
  const maxId = habbits.reduce(
    (acc, habbits) => (acc > habbits.id ? acc : habbits.id),
    0
  );
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: [],
  });
  resetForm(event.target, ["name", "target"]);
  tooglePopup();
  saveData();
  rerender(maxId + 1);
}
/*init*/
function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

(() => {
  loadData();
  const hashId = Number(document.location.hash.replace("#", ""));
  const urlHabbit = habbits.find((habbit) => habbit.id == hashId);
  if (urlHabbit) {
    rerender(urlHabbit.id);
  } else {
    rerender(habbits[0].id);
  }
})();
