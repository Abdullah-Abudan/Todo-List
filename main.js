const input = document.querySelector(".input");
const btnSubmit = document.querySelector(".add-btn");
const tasks = document.querySelector(".tasks");

btnSubmit.addEventListener("click", function (e) {
  if (input.value.length > 0) {
    addTaskToArray(input.value);
    input.value = "";
  } else {
    e.preventDefault();
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You need to write something!",
    });
  }
});
// Array of tasks
let arrayOfTasks = [];
console.log(arrayOfTasks);
// Functions

// check if there is tasks in local storage "Array - reload"
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

//trigger get tasks from local storage
getTasksFromLocalStorage();

// Add a task to the list
let childElementCount = 0;
function addTaskToArray(task) {
  const taskDetails = {
    id: Date.now(),
    title: task,
    completed: false,
  };
  // Add the task to the array
  arrayOfTasks.push(taskDetails);
  // Add the task to the page
  addTaskToPage(arrayOfTasks);
  // Add the task to the local storage
  addTaskToLocalStorage(arrayOfTasks);
}

// Add a task to the page Function
function addTaskToPage(arrayOfTasks) {
  tasks.innerHTML = "";
  // Loop through the array of tasks
  arrayOfTasks.forEach((task) => {
    const div = document.createElement("div");

    div.className = "task";
    div.setAttribute("data-id", task.id);
    if (task.completed) {
      div.className = "task done";
    }
    const span = document.createElement("span");
    const spanText = document.createTextNode(task.title);
    const divButton = document.createElement("div");
    const deleteBtn = document.createElement("button");
    const deleteBtnText = document.createTextNode("Delete");
    const updateBtn = document.createElement("button");
    const updateBtnText = document.createTextNode("Update");
    div.appendChild(span);
    span.appendChild(spanText);
    divButton.appendChild(deleteBtn);
    divButton.appendChild(updateBtn);
    div.appendChild(divButton);
    deleteBtn.appendChild(deleteBtnText);
    updateBtn.appendChild(updateBtnText);
    tasks.appendChild(div);

    deleteBtn.addEventListener("click", function (e) {
      deleteTask(e);
    });

    updateBtn.addEventListener("click", function (e) {
      updateTask(e);
    });

    div.addEventListener("click", function (e) {
      e.target.classList.toggle("done");
      //Toggle the completed function
      toggleCompleted(e);
    });
  });
}

// Add a task to the local storage Function
function addTaskToLocalStorage(arrayOfTasks) {
  localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

// get tasks from local storage Function "Page"
function getTasksFromLocalStorage() {
  const tasks = localStorage.getItem("tasks");
  if (tasks) {
    addTaskToPage(JSON.parse(tasks));
  }
}

// Delete a task Function
function deleteTask(e) {
  const id = e.target.parentElement.parentElement.getAttribute("data-id");
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != id);
  addTaskToPage(arrayOfTasks);
  addTaskToLocalStorage(arrayOfTasks);
}

// Toggle the completed function
function toggleCompleted(e) {
  const id = e.target.getAttribute("data-id");
  const task = arrayOfTasks.find((task) => task.id == id);
  if (task) {
    task.completed = !task.completed;
    addTaskToLocalStorage(arrayOfTasks);
  }
}

// Update a task Function using SweetAlert prompt
function updateTask(e) {
  const id = e.target.parentElement.parentElement.getAttribute("data-id");
  const task = arrayOfTasks.find((task) => task.id == id);

  Swal.fire({
    title: "Update Task Title",
    input: "text",
    inputValue: task.title,
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    inputValidator: (value) => {
      if (!value) {
        return "You need to enter a title!";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      task.title = result.value;
      addTaskToPage(arrayOfTasks);
      addTaskToLocalStorage(arrayOfTasks);
    }
  });
}
