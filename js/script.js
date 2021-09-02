"use strict";
let num = 0;
const todoController = {
  getData() {
    if (!todoModel.getData()) return false;
    return JSON.parse(todoModel.getData());
  },
  setData(inputs) {
    const todoItemObject = this.handleInputs(inputs);
    todoModel.saveData(todoItemObject);
    return todoItemObject;
  },
  handleInputs(inputs) {
    const obj = {};
    for (const input of inputs) {
      obj[input.name] = input.value;
    }
    return obj;
  },
};

const todoModel = {
  dbName: "saved_data",
  saveData(todoItem) {
    if (localStorage[this.dbName]) {
      const data = JSON.parse(localStorage[this.dbName]);
      todoItem.checkbox = false;
      todoItem.completed = "false";
      data.push(todoItem);
      localStorage.setItem(this.dbName, JSON.stringify(data));
      return data;
    }
    todoItem.checkbox = false;
    todoItem.completed = "false";
    const data = [todoItem];

    localStorage.setItem(this.dbName, JSON.stringify(data));
    return data;
  },
  getData() {
    if (!localStorage.getItem(this.dbName)) return false;
    return localStorage.getItem(this.dbName);
  },
};

const todoView = {
  form: document.querySelector("#todoForm"),
  template: document.querySelector("#todoItems"),

  setEvents() {
    window.addEventListener("load", this.onLoadFunc.bind(this));
    this.form.addEventListener("submit", this.formSubmit.bind(this));
    this.template.addEventListener("change", this.checkBoxFunc.bind(this));
    this.template.addEventListener("click", this.deletElemFunc.bind(this));
    this.template.addEventListener("click", this.deletAllFunc.bind(this));
  },
  formSubmit(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll("input, textarea");

    for (const input of inputs) {
      if (!input.value.length) return alert("No way you can add this shit");
    }
    todoController.setData(inputs);
    const todoItemObject =
      todoController.getData()[todoController.getData().length - 1];
    this.renderItem(todoItemObject);
    e.target.reset();
  },
  onLoadFunc() {
    num = 0;
    todoController.getData().forEach((item) => this.renderItem(item));
  },
  checkBoxFunc(boxCheck) {
    //controller
    let index = Number(boxCheck.target.parentElement.id);
    let arr = todoController.getData();
    arr[index].completed = "true";
    arr[index].checkbox = !arr[index].checkbox;
    //model
    localStorage.clear();
    localStorage.setItem(todoModel.dbName, JSON.stringify(arr));
    //view
    this.template.textContent = "";
    todoView.onLoadFunc();
  },
  deletElemFunc(elemDel) {
    if (elemDel.target.className === "taskButton") {
      //controller
      let index = Number(elemDel.target.parentElement.id);
      let arr = todoController.getData();
      arr.splice(index, 1);
      //model
      localStorage.clear();
      localStorage.setItem(todoModel.dbName, JSON.stringify(arr));
      //view
      this.template.innerHTML = "";
      todoView.onLoadFunc();
    }
  },
  deletAllFunc(delAll) {
    if (delAll.target.className === "taskdeleteAll") {
      //controller
      num = 0;
      console.log(delAll.target);
      let arr = todoController.getData();
      //model
      localStorage.setItem(todoModel.dbName, JSON.stringify(arr));
      //view
      this.template.innerHTML = "";
      localStorage.clear();
    }
  },
  createTemplate(
    titleText = "",
    descriptionText = "",
    completedText = "",
    checkboxTick = false,
    buttonText = "Delete element",
    deleteAllText = "Delete all"
  ) {
    const mainWrp = document.createElement("div");

    mainWrp.className = "col-4";

    const wrp = document.createElement("div");
    wrp.className = "taskWrapper";
    wrp.id = `${num++}`;
    mainWrp.append(wrp);

    const title = document.createElement("div");
    title.innerHTML = titleText;
    title.className = "taskHeading";
    wrp.append(title);

    const description = document.createElement("div");
    description.innerHTML = descriptionText;
    description.className = "taskDescription";
    wrp.append(description);

    const completed = document.createElement("div");
    completed.innerHTML = completedText;
    completed.className = "taskCompleted";
    wrp.append(completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checkboxTick;
    checkbox.className = "taskCheckbox";
    wrp.append(checkbox);

    const button = document.createElement("button");
    button.innerHTML = buttonText;
    button.className = "taskButton";
    wrp.append(button);

    const deleteAll = document.createElement("button");
    deleteAll.innerHTML = deleteAllText;
    deleteAll.className = "taskdeleteAll";
    mainWrp.append(deleteAll);
    return mainWrp;
  },
  renderItem({ title, description, completed, checkbox }) {
    const template = this.createTemplate(
      title,
      description,
      completed,
      checkbox
    );
    document.querySelector("#todoItems").prepend(template);
  },
};


localStorage.clear();

//— Добавить к каждому todo item который создается при сабмите формы поле completed
//— поле completed должно содержать false когда пользователь только что создал todo item
//— Поле completed можно изменить прямо из элемента todo http://joxi.ru/GrqX0JLf4v1Y5A — нужно добавить в него checkbox
//— Если задача не выполнена — нежно чтобы в чекбоксе не было галочки, а если выполнена — чтобы была (сразу после создания todo item галочки нету)
//— Если пользователь нажимает на текущем элементе на галочку то нужно изменять статус текущей задачи на выполненный (completed: true)
//— Так как все todo items у нас хранятся в массиве внутри localStorage то с ним нам и нужно работать
//— Добавить возможность удалять каждый отдельный todo item
//— Добавить возможность удалять сразу все todo items
todoView.setEvents();
