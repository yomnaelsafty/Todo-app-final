export const DarkThemeElement = document.querySelector(".Header__themeToggle");
export const AppElement = document.body;
export const InputField = document.querySelector(".TodoInput__field");
export const InputCircle = document.querySelector(".TodoInput__circle");
export const ToDoListElement = document.querySelector(".TodoList__items");
export const FilterButtons = document.querySelectorAll(".filter-btn");
export const ClearCompeletedBtn = document.querySelector("#clear-completed");
export const TaskCounter = document.querySelector(".TodoList__count");
export const getItems = () => document.querySelectorAll(".TodoList__items li");
export const getDeleteIcons = () =>
  document.querySelectorAll(".TodoItem__delete");
export const getCheckIcons = () =>
  document.querySelectorAll(".TodoItem__check");
