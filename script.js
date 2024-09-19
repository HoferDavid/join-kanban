let BASE_URL = 'https://joinkanbanboard-default-rtdb.europe-west1.firebasedatabase.app/';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser')) || null;
let activeTab = sessionStorage.getItem('activeTab') || '';
let contacts = JSON.parse(sessionStorage.getItem('contact')) || [];
let tasks = JSON.parse(sessionStorage.getItem('tasks')) || [];
let currentPrio = 'medium';


/**
 * Initializes the application by including HTML, setting the active tab, and checking the current user.
 * If 'taskCategory' isn't set in session storage, it'll get set to 'toDo'.
 */
async function init() {
  await includeHTML();
  setActive();
  checkCurrentUser();
  if (!sessionStorage.getItem('taskCategory')) {
    sessionStorage.setItem('taskCategory', 'toDo');
  }
}


/**
 * Sets the minimum date for date inputs to the current date.
 */
function setActualDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dateInput').setAttribute('min', today);
  document.getElementById('update-date') && document.getElementById('update-date').setAttribute('min', today);
}


/**
 * Includes HTML from external files into elements with the 'w3-include-html' attribute.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}


/**
 * Changes the active tab to the specified link.
 *
 * @param {Element} link - The link element that was clicked.
 */
function changeActive(link) {
  let linkBtn = document.querySelectorAll(".menuBtn");
  linkBtn.forEach(btn => btn.classList.remove("menuBtnActive"));
  activeTab = link.innerText.toLowerCase();
  sessionStorage.setItem("activeTab", activeTab);
  sessionStorage.getItem('taskCategory');
  setActive();
}


/**
 * Sets the active tab based on the current active tab in session storage.
 */
function setActive() {
  let linkBtn = document.querySelectorAll(".menuBtn");
  linkBtn.forEach(btn => {
    activeTab = activeTab == '' ? document.querySelector('h1').innerText.toLowerCase() : activeTab;
    if (btn.innerText.toLowerCase() === activeTab) {
      btn.classList.add("menuBtnActive");
    }
  });
}


/**
 * Removes the active class from all tabs except the current active tab.
 */
function removeActiveTab() {
  let linkBtn = document.querySelectorAll(".menuBtn");
  linkBtn.forEach(btn => {
    activeTab = activeTab == '' ? document.querySelector('h1').innerText.toLowerCase() : activeTab;
    if (btn.innerText.toLowerCase() != activeTab) {
      btn.classList.remove("menuBtnActive");
    }
  });
}


/**
 * Sets the active tab to the specified link.
 *
 * @param {string} link - The selector for the link element to set as active.
 */
function setActiveTab(link) {
  const activeTab = document.querySelector(link);
  if (activeTab) {
    changeActive(activeTab);
  }
}


/**
 * Updates the active priority button based on the specified priority.
 *
 * @param {string} prio - The priority level to set as active.
 */
function updatePrioActiveBtn(prio) {
  const buttons = document.querySelectorAll('.prioBtn');
  buttons.forEach(button => {
    button.classList.remove('prioBtnUrgentActive', 'prioBtnMediumActive', 'prioBtnLowActive');
    const imgs = button.querySelectorAll('img');
    imgs.forEach(img => { img.classList.add('hidden'); });
  });
  changeActiveBtn(prio);
}


/**
 * Changes the active button based on the specified priority.
 *
 * @param {string} prio - The priority level to set as active.
 */
function changeActiveBtn(prio) {
  const activeButton = document.querySelector(`.prioBtn[data-prio="${prio}"]`);
  if (activeButton) {
    activeButton.classList.add(`prioBtn${capitalize(prio)}Active`);
    const whiteIcon = activeButton.querySelector(`.prio${prio}smallWhite`);
    if (whiteIcon) {
      whiteIcon.classList.remove('hidden');
    }
  }
}


/**
 * Checks the current user and updates the UI based on the user's status.
 */
function checkCurrentUser() {
  const forbiddenContent = document.querySelectorAll('.forbiddenContent');
  const menuUserContainer = document.getElementById('menuUserContainer');
  const headerUserContainer = document.getElementById('headerUserContainer');
  const headerUserBadge = document.querySelectorAll('.headerUserBadge');
  if (!currentUser) {
    noUserContent(forbiddenContent, menuUserContainer, headerUserContainer);
  } else if (currentUser && currentUser.name === 'Guest') {
    userContent(forbiddenContent, menuUserContainer, headerUserContainer);
    headerUserBadge.innerHTML = currentUser.firstLetters;
  } else if (currentUser) {
    userContent(forbiddenContent, menuUserContainer, headerUserContainer);
    headerUserBadge.forEach(b => b.innerHTML = currentUser.firstLetters);
  }
}


/**
 * Hides content for users who are not logged in.
 *
 * @param {NodeList} forbiddenContent - The content elements to hide.
 * @param {Element} menuUserContainer - The user menu container element.
 * @param {Element} headerUserContainer - The user header container element.
 */
function noUserContent(forbiddenContent, menuUserContainer, headerUserContainer) {
  forbiddenContent.forEach(content => content.classList.add('d-none'));
  menuUserContainer.classList.add('d-none');
  headerUserContainer.classList.add('d-none');
}


/**
 * Shows content for users who are logged in.
 *
 * @param {NodeList} forbiddenContent - The content elements to show.
 * @param {Element} menuUserContainer - The user menu container element.
 * @param {Element} headerUserContainer - The user header container element.
 */
function userContent(forbiddenContent, menuUserContainer, headerUserContainer) {
  forbiddenContent.forEach(content => content.classList.remove('d-none'));
  menuUserContainer.classList.remove('d-none');
  headerUserContainer.classList.remove('d-none');
}


/**
 * Toggles between two classes on a specified element.
 *
 * @param {string} menu - The ID of the element to toggle classes on.
 * @param {string} className1 - The first class to toggle.
 * @param {string} className2 - The second class to toggle.
 */
function toggleClass(menu, className1, className2) {
  let edit = document.getElementById(menu);
  edit.classList.toggle(className1);
  edit.classList.toggle(className2);
}


/**
 * Gets the value of an element by its ID.
 *
 * @param {string} id - The ID of the element to get the value from.
 * @returns {string} The value of the element.
 */
function getId(id) {
  return document.getElementById(id).value;
}


/**
 * Loads data from a specified path in the database.
 *
 * @param {string} [path=''] - The path to load data from.
 * @returns {Promise<Object>} The loaded data.
 */
async function loadData(path = '') {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseAsJson = await response.json();
    return responseAsJson;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}


/**
 * Deletes data from a specified path in the database.
 *
 * @param {string} [path=''] - The path to delete data from.
 * @returns {Promise<Object>} The response from the delete request.
 */
async function deleteData(path = '') {
  let response = await fetch(BASE_URL + path + '.json', {
    method: 'DELETE',
  });
  return responseToJson = await response.json();
}


/**
 * Posts data to a specified path in the database.
 *
 * @param {string} [path=''] - The path to post data to.
 * @param {Object} [data={}] - The data to post.
 * @returns {Promise<Object>} The response from the post request.
 */
async function postData(path = "", data = {}) {
  try {
    let response = await fetch(BASE_URL + path + ".json", {
      method: "POST",
      header: { "Content-Type": " application/json" },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error posting data:", error);
  }
}


/**
 * Updates data at a specified URL in the database.
 *
 * @param {string} url - The URL to update data at.
 * @param {Object} data - The data to update.
 * @returns {Promise<Object>} The response from the update request.
 */
async function updateData(url, data) {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating data:', error);
  }
}


/**
 * Displays a confirmation modal to delete a task.
 *
 * @param {number} id - The ID of the task to delete.
 */
function deleteTask(id) {
  toggleClass('deleteResponse', 'ts0', 'ts1');
  document.getElementById('deleteResponse').innerHTML = openDeleteTaskSureHtml(id);
}


/**
 * Deletes a task after confirmation and updates the task list.
 *
 * @param {number} id - The ID of the task to delete.
 */
async function deleteTaskSure(id) {
  toggleClass('deleteResponse', 'ts0', 'ts1');
  await deleteData(`tasks/${id}`);
  tasks = tasks.filter((task) => task.id !== id);
  sessionStorage.setItem("tasks", JSON.stringify(tasks));
  closeModal();
  initDragDrop();
  initCheckData();
}


/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} The capitalized string.
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * Logs out the current user and redirects to the login page.
 */
function logOut() {
  sessionStorage.removeItem('currentUser');
  localStorage.removeItem('currentUser');
  window.location.href = '../index.html';
}


/**
 * Activates a mousedown event listener to check if the user has clicked outside a specified modal element.
 * If the user has clicked outside the modal and the modal has the specified class,
 * the function toggles the classes of the modal to hide it.
 *
 * @param {string} modalName - The ID of the modal element.
 * @param {string} class1 - The class to check if the modal has.
 * @param {string} class2 - The class to toggle if the modal should be hidden.
 */
function activateOutsideCheck(modalName, class1, class2) {
  document.addEventListener('mousedown', function () { checkOutsideModal(modalName, class1, class2); });
}


/**
 * Checks if the user has clicked outside a specified modal element.
 * If the user has clicked outside the modal and the modal has the specified class,
 * the function toggles the classes of the modal to hide it.
 *
 * @param {string} modalName - The ID of the modal element.
 * @param {string} class1 - The class to check if the modal has.
 * @param {string} class2 - The class to toggle if the modal should be hidden.
 */
function checkOutsideModal(modalName, class1, class2) {
  let modal = document.getElementById(modalName);
  if (modal.classList.contains(class1) && !modal.contains(event.target)) {
    toggleClass(modalName, class1, class2);
    document.removeEventListener('click', function () { checkOutsideModal(modalName); });
  };
}
