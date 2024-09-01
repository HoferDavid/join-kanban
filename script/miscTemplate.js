/**
 * Generates HTML for a mobile greeting section.
 * 
 * @param {string} greetingTime - The time-based greeting (e.g., "Good morning").
 * @param {string} greetingName - The name of the person being greeted.
 * @returns {string} The HTML string for the mobile greeting section.
 */
function greetingMobileHTML(greetingTime, greetingName) {
  return /*html*/`    
    <div class="summ-greeting-mobile">
      <h3 class="summ-day-greeting">${greetingTime}</h3>
      <span class="summ-person-greeting">${greetingName}</span>
    </div>
  `;
}


/**
 * Creates an object template for a task with a specified key and task details.
 * 
 * @param {string} key - The unique identifier for the task.
 * @param {Object} task - The task details.
 * @param {Array} task.assignedTo - The list of people assigned to the task.
 * @param {string} task.category - The category of the task.
 * @param {string} task.date - The due date of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.prio - The priority level of the task.
 * @param {string} task.status - The status of the task.
 * @param {Array} task.subtasks - The list of subtasks.
 * @param {string} task.title - The title of the task.
 * @returns {Object} The task object template.
 */
function objectTemplateNumberOfBoard(key, task) {
  return {
    "id": key,
    "assignedTo": task.assignedTo,
    "category": task.category,
    "date": task.date,
    "description": task.description,
    "prio": task.prio,
    "status": task.status,
    "subtasks": task.subtasks,
    "title": task.title
  };
}