import {
  DarkThemeElement,
  AppElement,
  InputField,
  InputCircle,
  ToDoListElement,
  getDeleteIcons,
  getCheckIcons,
  FilterButtons,
  ClearCompeletedBtn,
  TaskCounter,
  getItems,
} from "./elements.js";

/*--Save Data */
const SaveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/*---Theme Toggle---*/
const toggleDarkMoode = () => {
  AppElement.classList.toggle("App--isDark");
  SaveData("darkModeFlag", AppElement.classList.contains("App--isDark"));
};
DarkThemeElement.addEventListener("click", () => {
  toggleDarkMoode();
});

/**--Tasks counter-- */
const taskCounting = () => {
  const tasks = FetchData("tasks") || [];
  const activeTask = tasks.filter((t) => !t.iscompleted).length;
  TaskCounter.textContent = `${activeTask} items left`;
};

/**--Drage && Drop-- */
let draggedIndex = null;

const dragStart = (index) => {
  draggedIndex = index;
};

const dragOver = (e) => {
  e.preventDefault();
};

const dragDrop = (dropIndex) => {
  const tasks = FetchData("tasks") || [];
  const draggedTask = tasks.splice(draggedIndex, 1)[0];
  tasks.splice(dropIndex, 0, draggedTask);

  SaveData("tasks", tasks);
  initTaskList(tasks);
  taskCounting();
  draggedIndex = null;
};

/** Filter buttons*/
let currentFilter = "all";

const getFilteredTasks = (tasks) => {
  if (currentFilter === "active") return tasks.filter((t) => !t.iscompleted);
  if (currentFilter === "completed") return tasks.filter((t) => t.iscompleted);
  return tasks;
};

FilterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    FilterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    initTaskList(FetchData("tasks") || []);
  });
});

/*--FetchData-- */
const FetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
};

/*--Render Task List-- */
const RenderTaskList = (tasks) => {
  let TodoList = "";
  tasks.forEach((task) => {
    TodoList += `<li draggable="true" class="${task.iscompleted ? "completed" : ""}">
     <button class="TodoItem__check${task.iscompleted ? " active" : ""}"></button>
     <span class="TodoItem__text">${task.value}</span>
     <button class="TodoItem__delete"></button>
   </li>`;
  });

  ToDoListElement.innerHTML = TodoList;
};

/**--Clear Compeleted-- */
const clearCompletedTodo = () => {
  const tasks = FetchData("tasks") || [];

  const hasCompeleted = tasks.some((t) => t.iscompleted);
  if (!hasCompeleted) return;

  const answer = confirm("Are you sure you want to delete compeleted todo ?");
  if (answer === false) return;

  const newTasks = tasks.filter((t) => !t.iscompleted);

  SaveData("tasks", newTasks);
  initTaskList(newTasks);
};

ClearCompeletedBtn.addEventListener("click", clearCompletedTodo);

/**--Delete Task-- */
const deleteTodo = (index) => {
  const answer = confirm("Are you sure you want to delete this todo ?");
  if (answer === false) return;

  const tasks = FetchData("tasks");
  tasks.splice(index, 1);
  SaveData("tasks", tasks);
  initTaskList(tasks);
  taskCounting();
};

/*--Task Listeners */
const taskListeners = () => {
  getDeleteIcons().forEach((icone, index) => {
    icone.addEventListener("click", () => deleteTodo(index));
  });

  getCheckIcons().forEach((box, index) => {
    box.addEventListener("click", (e) => toggleTask(e, index));
  });

  getItems().forEach((item, index) => {
    item.addEventListener("dragstart", () => dragStart(index));
    item.addEventListener("dragover", (e) => dragOver(e));
    item.addEventListener("drop", () => dragDrop(index));
  });
};

/*---Add Task---*/
const addToDo = () => {
  if (InputField.value.trim() == "") {
    return;
  }

  const task = {
    value: InputField.value.trim(),
    iscompleted: false,
  };

  const tasks = FetchData("tasks") || [];

  tasks.push(task);

  SaveData("tasks", tasks);

  initTaskList(tasks);

  taskCounting();
};

/**--Active mode-- */
InputField.addEventListener("input", () => {
  if (InputField.value.trim() !== "") {
    InputCircle.classList.add("active");
  } else {
    InputCircle.classList.remove("active");
  }
});

/**--Enter key--*/
InputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && InputField.value.trim() !== "") {
    addToDo(InputField.value);
    InputField.value = "";
    InputCircle.classList.remove("active");
  }
});

/**--Data on start up */
const initDataOnStartup = () => {
  FetchData("darkModeFlag") && toggleDarkMoode();
};

const initTaskList = (tasks) => {
  RenderTaskList(getFilteredTasks(tasks));
  taskListeners();
};

initDataOnStartup();

/**--Toggle Task-- */
const toggleTask = (e, index) => {
  const tasks = FetchData("tasks");
  e.currentTarget.classList.toggle("active");
  e.currentTarget.parentElement.classList.toggle("completed");
  tasks[index].iscompleted = !tasks[index].iscompleted;
  SaveData("tasks", tasks);

  taskCounting();
};
