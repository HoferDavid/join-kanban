let numberOfBoard = [];
let numberOfTodos = 0;
let numberOfInProgress = 0;
let numberOfAwaitFeedback = 0;
let numberOfDone = 0;
let urgentTasks = [];
let counts = {
  toDo: 0,
  inProgress: 0,
  awaitFeedback: 0,
  done: 0
};


/**
 * The function `initSummary` initializes, greets, loads categories, assigns tasks, and shows urgent
 * tasks asynchronously.
 */
async function initSummary() {
  init();
  greetingSummary();
  await loadCategory();
  taskAssignment();
  showUrgentTask();
}


/**
 * The `greetingSummary` function dynamically updates the greeting message based on the user's name and
 * the current time, with different behavior for mobile and desktop views.
 */
function greetingSummary() {
  let greetingTime = greeting();
  let greetingName = currentUser.name;

  if (window.matchMedia("(max-width: 1199.8px)").matches) {
    let greetingMobile = document.getElementById('greetingSummaryMobile');
    let summaryMain = document.getElementById('summaryMain');
    greetingMobile.innerHTML = greetingMobileHTML(greetingTime, greetingName);
    animationGreeting(greetingMobile, summaryMain);
    updateGreetingDesktop(greetingTime, greetingName);
  } else {
    updateGreetingDesktop(greetingTime, greetingName);
  }
}


/**
 * The function determines the appropriate greeting based on the current time of day.
 * @returns The function `greeting()` returns a greeting based on the current time of the day. If the
 * current time is before 12 PM, it returns "Good morning,". If the current time is between 12 PM and 6
 * PM, it returns "Good afternoon,". Otherwise, it returns "Good evening,".
 */
function greeting() {
  let now = new Date();
  let hours = now.getHours();
  if (hours < 12) {
    return "Good morning,";
  } else if (hours < 18) {
    return "Good afternoon,";
  } else {
    return "Good evening,";
  }
}


/**
 * The function `animationGreeting` animates the transition between a mobile greeting element and a
 * main summary element by adjusting their styles and adding/removing classes with timed delays.
 * @param greetingMobile - The `greetingMobile` parameter seems to be a DOM element representing a
 * greeting section on a mobile device. The function `animationGreeting` is designed to animate this
 * greeting section along with a `summaryMain` element.
 * @param summaryMain - `summaryMain` is likely a reference to an HTML element that represents the main
 * summary section of a webpage or application. This element is being used in the `animationGreeting`
 * function to control its opacity and transition properties for a specific animation effect.
 */
function animationGreeting(greetingMobile, summaryMain) {
  greetingMobile.style.display = 'flex';
  setTimeout(() => {
    summaryMain.style.opacity = '0';
    setTimeout(() => {
      greetingMobile.classList.add('hide');
      setTimeout(() => {
        greetingMobile.style.display = 'none';
        summaryMain.style.opacity = '1';
        summaryMain.style.transition = 'opacity 0.9s ease';
      }, 900);
    }, 1000);
  });
}


/**
 * The function `updateGreetingDesktop` updates the text content of two elements on a webpage with the
 * provided time and name.
 * @param time - The `time` parameter in the `updateGreetingDesktop` function represents the time of
 * day, such as "morning", "afternoon", "evening", or "night".
 * @param name - The `name` parameter in the `updateGreetingDesktop` function represents the name of
 * the user or person for whom the greeting is being displayed on the desktop interface.
 */
function updateGreetingDesktop(time, name) {
  let greetingDesktop = document.getElementById('greetingSumm');
  let greetingNameDesktop = document.getElementById('greetingNameDesktop');
  greetingDesktop.innerText = time;
  greetingNameDesktop.innerText = name;
}



/**
 * The function `loadCategory` loads tasks data, processes each task, and categorizes them based on
 * priority.
 */
async function loadCategory() {
  let tasksData = await loadData("tasks");
  for (const key in tasksData) {
    const task = tasksData[key];
    if (!task) {
      continue;
    }
    numberOfBoard.push(objectTemplateNumberOfBoard(key, task));
    if (task.prio === 'urgent') {
      urgentTasks.push(task);
    }
  }
}


/**
 * The function `taskAssignment` updates the counts of different task statuses and the number of tasks
 * on the board in Join summary page.
 */
function taskAssignment() {
  getTaskCounts();
  updateElement('howManyTodos', counts.toDo);
  updateElement('howManyInProgress', counts.inProgress);
  updateElement('howManyAwaitFeedback', counts.awaitFeedback);
  updateElement('howManyDone', counts.done);
  updateElement('howManyTaskInBoard', numberOfBoard.length);
}


/**
 * The function `getTaskCounts` is intended to calculate the number of tasks in each status category.
 */
function getTaskCounts() {
  counts = numberOfBoard.reduce((acc, task) => {
    acc[task.status]++;
    return acc;
  }, counts);
}


/**
 * The function `updateElement` updates the inner HTML content of an element with the specified ID.
 * @param id - The `id` parameter is a string that represents the id attribute of an HTML element that
 * you want to update.
 * @param value - The `value` parameter in the `updateElement` function represents the new content that
 * you want to set for the HTML element with the specified `id`. This content will be displayed on the
 * webpage once the function is called.
 */
function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.innerHTML = value;
  }
}


/**
 * The function `showUrgentTask` sorts urgent tasks by date, updates the number of urgent tasks
 * displayed, and formats the date of the earliest urgent task in German locale.
 */
function showUrgentTask() {
  if (urgentTasks && urgentTasks.length > 0) {
    urgentTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    updateElement('howManyUrgent', urgentTasks.length);
    let date = new Date(urgentTasks[0].date);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let formattedDate = date.toLocaleDateString('de-DE', options);
    updateElement('summUrgentDate', formattedDate);
  } else {
    updateElement('howManyUrgent', 0);
    updateElement('summUrgentDate', '');
  }
}


/**
 * The function `nextPage()` redirects the user to the 'board.html' page and sets the 'activeTab' item
 * in sessionStorage to 'board'.
 */
function nextPage() {
  window.location.href = 'board.html';
  sessionStorage.setItem('activeTab', 'board');
}