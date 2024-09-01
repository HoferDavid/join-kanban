
/**
 * The function `updateNoTasksFoundVisibility` toggles the visibility of an element based on the
 * presence of any visible tasks.
 * @param anyVisibleTask - The `anyVisibleTask` parameter is a boolean value that indicates whether
 * there are any visible tasks on the page. If there are visible tasks (`anyVisibleTask` is `true`),
 * the function will hide the element with the id 'noTasksFound'. If there are no visible tasks (`any
 */
function updateNoTasksFoundVisibility(anyVisibleTask) {
  const noTasksFound = document.getElementById('noTasksFound');
  if (anyVisibleTask) {
    noTasksFound.classList.add('dNone');
  } else {
    noTasksFound.classList.remove('dNone');
  }
}



/**
 * The function `checkScreenWidth` checks the screen width and redirects to a specific page based on
 * the screen size.
 * @param category - The `category` parameter in the `checkScreenWidth` function is used to determine
 * the task category for the task being added. It is stored in the session storage using
 * `sessionStorage.setItem('taskCategory', category)`. The function then checks the screen width and
 * performs different actions based on the screen width
 */
function checkScreenWidth(category) {
  const screenWidth = window.innerWidth;
  const activeTab = document.querySelector('.menuBtn[href="../html/addtask.html"]');
  const taskStatus = category;
  sessionStorage.setItem('taskCategory', category);
  if (screenWidth < 992) {
    changeActive(activeTab);
    window.location.href = "../html/addtask.html";
  } else {
    openAddTaskOverlay();
  }
}



/**
 * The function `openAddTaskOverlay` asynchronously opens an overlay for adding a task by fetching a
 * template and displaying it on the webpage.
 */
async function openAddTaskOverlay() {
  let addTaskOverlay = document.getElementById("addTaskOverlay");
  assignedContacts = [];
  addTaskOverlay.innerHTML = await fetchAddTaskTemplate();
  addTaskOverlay.style.display = "block";
}



/**
 * The function `openOverlay` displays an overlay with information about a specific task based on its
 * ID.
 * @param elementId - The `elementId` parameter is the unique identifier of the element that you want
 * to open in an overlay. In the provided function `openOverlay`, this parameter is used to find the
 * corresponding task object from an array called `tasks` based on its `id`.
 */
function openOverlay(elementId) {
  let element = tasks.find((task) => task.id === elementId);
  let overlay = document.getElementById("overlay");
  assignedContacts = [];
  overlay.innerHTML = generateOpenOverlayHTML(element);
  overlay.style.display = "block";
}



/**
 * The function closeModal hides the overlay and addTaskOverlay elements and removes the "modalOpen"
 * class from the body.
 */
function closeModal() {
  const overlay = document.getElementById("overlay");
  const addTaskOverlay = document.getElementById("addTaskOverlay");
  if (overlay || addTaskOverlay) {
    overlay.style.display = "none";
    addTaskOverlay.style.display = "none";
  }
  document.body.classList.remove("modalOpen");
}


/**
 * The function `updateSubtaskStatus` updates the status of a subtask within a task, updates the DOM,
 * progress bar, and data, and stores the updated tasks in session storage.
 * @param taskId - The `taskId` parameter is the unique identifier of the task that contains the
 * subtask you want to update.
 * @param subtaskIndex - The `subtaskIndex` parameter in the `updateSubtaskStatus` function refers to
 * the index of the subtask within the subtasks array of a specific task. It is used to identify the
 * particular subtask that needs to be updated in terms of its status.
 */
async function updateSubtaskStatus(taskId, subtaskIndex) {
  let task = tasks.find((task) => task.id === taskId);
  if (task) {
    let subtask = task.subtasks[subtaskIndex];
    if (subtask) {
      updateSubtaskStatusDom(subtask);
      updateSubtasksProgressBar(task.subtasks, taskId);
      await updateData(`${BASE_URL}tasks/${taskId}.json`, task);
      let taskIndex = tasks.findIndex(t => taskId === t.id);
      tasks.splice(taskIndex, 1, await createTaskArray(taskId, task));
      sessionStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
}


/**
 * Updates the status of a subtask in the DOM by toggling its checkbox image.
 *
 * @param {Object} subtask - The subtask object to update.
 * @param {string} subtask.status - The current status of the subtask ("checked" or "unchecked").
 * @param {number} subtaskIndex - The index of the subtask within its parent task's subtasks array.
 *
 * @returns {void}
 */
function updateSubtaskStatusDom(subtask) {
  subtask.status = subtask.status === "checked" ? "unchecked" : "checked";
  let subtaskCheckbox = document.getElementById(`subtaskCheckbox${subtaskIndex}`);
  if (subtaskCheckbox) {
    subtaskCheckbox.src =
      subtask.status === "checked" ? "../assets/icons/checkboxchecked.svg" : "../assets/icons/checkbox.svg";
  }
}



/**
 * Enables the editing of a task by populating the edit form with the task's current data.
 *
 * @param {string} taskId - The unique identifier of the task to be edited.
 *
 * @returns {void}
 */
function enableTaskEdit(taskId) {
  let modalContainer = document.getElementById("modalContainer");
  modalContainer.innerHTML = generateTaskEditHTML(taskId);
  let task = tasks.find((task) => task.id === taskId);
  assignedContacts = task.assignedTo ? task.assignedTo : [];
  currentTaskStatus = task.status;
  document.getElementById("editTaskTitle").value = task.title;
  document.getElementById("editTaskDescription").value = task.description;
  document.getElementById("editDateInput").value = task.date;
  updatePrioActiveBtn(task.prio);
  renderAssignedContacts();
}

/**
 * Creates an edited task object based on the provided task ID.
 * The function retrieves the original task from the tasks array,
 * iterates through the subtasks, and constructs a new subtasks array.
 * It then calls the createEditedTaskReturn function to create the edited task object.
 * @param {string} taskId - The unique identifier of the task to be edited.
 * @returns {Object} The edited task object.
 * @throws Will throw an error if the original task is not found in the tasks array.
 */
function createEditedTask(taskId) {
  let originalTask = tasks.find(task => task.id === taskId);
  if (!originalTask) return;
  let subtasks = [];
  document.querySelectorAll('#subtaskList .subtaskItem').forEach((subtaskItem, index) => {
    const subtaskText = subtaskItem.querySelector('span').innerText;
    let status = 'unchecked';
    if (originalTask.subtasks && originalTask.subtasks[index]) {
      status = originalTask.subtasks[index].status ? originalTask.subtasks[index].status : 'unchecked';
    }
    subtasks.push({ text: subtaskText, status: status });
  });
  return createEditedTaskReturn(subtasks, originalTask);
}


/**
 * Helper function to create the edited task object.
 * 
 * @param {Object[]} subtasks - The updated subtasks.
 * @param {Object} originalTask - The original task object.
 * @returns {Object} The edited task object.
 */
function createEditedTaskReturn(subtasks, originalTask) {
  return {
    title: document.getElementById('editTaskTitle').value,
    description: document.getElementById('editTaskDescription').value,
    date: document.getElementById('editDateInput').value,
    prio: currentPrio,
    status: currentTaskStatus,
    subtasks: subtasks,
    assignedTo: assignedContacts ? assignedContacts : [],
    category: originalTask.category,
  };
}


/**
 * Saves the edited task and updates the board accordingly.
 * 
 * @async
 * @param {Event} event - The form submission event.
 * @param {string} taskId - The ID of the task to save.
 */
async function saveEditedTask(event, taskId) {
  event.preventDefault();
  let singleTask = createEditedTask(taskId);
  await updateData(`${BASE_URL}tasks/${taskId}.json`, singleTask);
  let taskIndex = tasks.findIndex(t => taskId === t.id);
  tasks.splice(taskIndex, 1, await createTaskArray(taskId, singleTask));
  sessionStorage.setItem("tasks", JSON.stringify(tasks));
  openOverlay(taskId);
  initDragDrop();
  applyCurrentSearchFilter();
}


/**
 * Closes the modal if outside the overlay or add task overlay is clicked.
 * 
 * @param {MouseEvent} event - The mouse click event.
 */
window.onclick = function (event) {
  const overlay = document.getElementById("overlay");
  const addTaskOverlay = document.getElementById("addTaskOverlay");
  if (event.target === overlay || event.target === addTaskOverlay) {
    closeModal();
  }
};


/**
 * Removes the task category from local storage if it exists.
 */
document.addEventListener('DOMContentLoaded', () => {
  const category = localStorage.getItem('taskCategory');
  if (category) {
    localStorage.removeItem('taskCategory');
  }
});
