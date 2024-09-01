/**
 * Generates the HTML for a todo item.
 *
 * @param {Object} element - The todo item object.
 * @param {string} element.id - The ID of the todo item.
 * @param {string} element.category - The category of the todo item.
 * @param {string} element.title - The title of the todo item.
 * @param {string} element.description - The description of the todo item.
 * @param {Array} element.subtasks - The subtasks of the todo item.
 * @param {Array} element.assignedTo - The assigned users to the todo item.
 * @param {string} element.prio - The priority of the todo item.
 * @returns {string} The generated HTML string for the todo item.
 */
function generateTodoHTML(element) {
    let categoryHTML = generateCategoryHTML(element.category);
    let titleHTML = generateTitleHTML(element.title);
    let descriptionHTML = generateDescriptionHTML(element.description);
    let subtasksHTML = generateSubtasksHTML(element.subtasks, element.id);
    let assignedToHTML = generateAssignedToHTML(element.assignedTo);
    let prioHTML = generatePrioHTML(element.prio);

    return /*html*/ `
        <div draggable="true" id="${element.id}" class="todoContainer" onclick="openOverlay('${element.id}')" ondragend="dragEnd()">
            <div class="toDoContent">
                ${categoryHTML}
                <div class="toDoHeaderContainer">
                    ${titleHTML}
                    ${descriptionHTML}
                </div>
                ${subtasksHTML}
                <div class="toDoContentBottomContainer">
                    <div class="assignedToBadgeContainer">${assignedToHTML}</div>
                    ${prioHTML}
                </div>
            </div>
        </div>
    `;
}


/**
 * Generates the HTML for the category badge.
 *
 * @param {string} category - The category of the todo item.
 * @returns {string} The generated HTML string for the category badge.
 */
function generateCategoryHTML(category) {
    let categoryHTML = '';
    if (category == 'User Story') {
        categoryHTML = `<div class="userStoryBadge">User Story</div>`;
    } else {
        categoryHTML = `<div class="technicalTaskBadge">Technical Task</div>`;
    }
    return categoryHTML;
}


/**
 * Generates the HTML for the title of the todo item.
 *
 * @param {string} title - The title of the todo item.
 * @returns {string} The generated HTML string for the title.
 */
function generateTitleHTML(title) {
    let titleHTML = '';
    if (title.length < 20) {
        titleHTML = `<div class="toDoHeader">${title}</div>`;
    } else {
        titleHTML = `<div class="toDoHeader">${title.substring(0, 20) + '...'}</div>`;
    }
    return titleHTML;
}


/**
 * Generates the HTML for the description of the todo item.
 *
 * @param {string} description - The description of the todo item.
 * @returns {string} The generated HTML string for the description.
 */
function generateDescriptionHTML(description) {
    let descriptionHTML = '';
    if (description.length < 60) {
        descriptionHTML = `<div class="toDoDescription">${description}</div>`;
    } else {
        descriptionHTML = `<div class="toDoDescription">${description.substring(0, 40) + '...'}</div>`;
    }
    return descriptionHTML;
}


/**
 * Generates the HTML for the subtasks of the todo item.
 *
 * @param {Array} subtasks - The subtasks of the todo item.
 * @param {string} id - The ID of the todo item.
 * @returns {string} The generated HTML string for the subtasks.
 */
function generateSubtasksHTML(subtasks, id) {
    let subtasksHTML = "";
    if (subtasks && subtasks.length > 0) {
        subtasksHTML = /*html*/ `
        <div class="toDoSubtasksContainer">
            <div class="subtasksProgressbar">
                <div id="subtasksProgressbarProgress${id}" class="subtasksProgressbarProgress" style="width: 0%;" role="progressbar"></div>
            </div>
            <div id="subtasksProgressbarText${id}">0/${subtasks.length} Subtasks</div>
        </div>`;
    }
    return subtasksHTML;
}


/**
 * Generates the HTML for the assigned users of the todo item.
 *
 * @param {Array} assignedTo - The assigned users to the todo item.
 * @returns {string} The generated HTML string for the assigned users.
 */
function generateAssignedToHTML(assignedTo) {
    let assignedToHTML = '';
    if (!assignedTo) {
        return '';
    }
    for (let i = 0; i < Math.min(assignedTo.length, 4); i++) {
        assignedToHTML += `<div class="assignedToBadge">${assignedTo[i].profilePic}</div>`;
    }
    if (assignedTo.length > 4) {
        let assignedNum = assignedTo.length - 4;
        assignedToHTML += `<div class="assignedToMoreBadge">+${assignedNum}</div>`;
    }
    return assignedToHTML;
}


/**
 * Generates the HTML for the priority icon of the todo item.
 *
 * @param {string} prio - The priority of the todo item.
 * @returns {string} The generated HTML string for the priority icon.
 */
function generatePrioHTML(prio) {
    let prioHTML = '';
    if (prio == 'urgent') {
        prioHTML = `<img src="../assets/icons/priourgent.png">`;
    } else if (prio == 'medium') {
        prioHTML = `<img src="../assets/icons/priomedium.png">`;
    } else {
        prioHTML = `<img src="../assets/icons/priolow.png">`;
    }
    return prioHTML;
}


/**
 * Fetches the HTML template for adding a new task.
 *
 * @returns {Promise<string>} A promise that resolves to the HTML string for the add task template.
 */
async function fetchAddTaskTemplate() {
    let response = await fetch("../assets/templates/html/addtasktemplate.html");
    let html = await response.text();
    return `
        <div class="addTaskModalContainer">
          ${html}
        </div>
      `;
}


/**
 * Generates the HTML for the category badge in the modal.
 *
 * @param {string} category - The category of the todo item.
 * @returns {string} The generated HTML string for the category badge in the modal.
 */
function generateModalCategoryHTML(category) {
    let modalCategoryHTML = '';
    if (category == 'User Story') {
        modalCategoryHTML = `<div class="modalUserStoryBadge">User Story</div>`;
    } else {
        modalCategoryHTML = `<div class="modalTechnicalTaskBadge">Technical Task</div>`;
    }
    return modalCategoryHTML;
}


/**
 * Generates the HTML for the assigned users in the modal.
 *
 * @param {Array} assignedTo - The assigned users to the todo item.
 * @returns {string} The generated HTML string for the assigned users in the modal.
 */
function generateModalAssignedToHTML(assignedTo) {
    if (!assignedTo) return '';
    let modalAssignedToHTML = '';
    for (let i = 0; i < assignedTo.length; i++) {
        modalAssignedToHTML += /*html*/`
            <div class="modalAssignedToSingle">
                ${assignedTo[i].profilePic}
                ${assignedTo[i].name}
            </div>
        `;
    }
    return modalAssignedToHTML;
}


/**
 * Generates the HTML for the subtasks in the modal.
 *
 * @param {Object} element - The todo item object.
 * @param {Array} element.subtasks - The subtasks of the todo item.
 * @returns {string} The generated HTML string for the subtasks in the modal.
 */
function generateModalSubtasksHTML(element) {
    let modalSubtasksHTML = "";
    if (element.subtasks) {
        for (let i = 0; i < element.subtasks.length; i++) {
            let subtask = element.subtasks[i];
            let checked = subtask.status === 'checked' ? '../assets/icons/checkboxchecked.svg' : '../assets/icons/checkbox.svg';
            modalSubtasksHTML += /*html*/ `
                <label class="modalSubtasksSingle" onclick="updateSubtaskStatus('${element.id}', ${i})">
                    <img id="subtaskCheckbox${i}" src="${checked}" alt="Checkbox">
                    <div>${subtask.text}</div>
                </label>
            `;
        }
    } else {
        modalSubtasksHTML = 'No subtasks available!';
    }
    return modalSubtasksHTML;
}


/**
 * Generates the HTML for opening the overlay of a todo item.
 *
 * @param {Object} element - The todo item object.
 * @param {string} element.id - The ID of the todo item.
 * @param {string} element.category - The category of the todo item.
 * @param {string} element.title - The title of the todo item.
 * @param {string} element.description - The description of the todo item.
 * @param {Array} element.subtasks - The subtasks of the todo item.
 * @param {Array} element.assignedTo - The assigned users to the todo item.
 * @param {string} element.prio - The priority of the todo item.
 * @param {string} element.date - The due date of the todo item.
 * @returns {string} The generated HTML string for the todo item overlay.
 */
function generateOpenOverlayHTML(element) {
    let modalCategoryHTML = generateModalCategoryHTML(element.category);
    let priority = element.prio.charAt(0).toUpperCase() + element.prio.slice(1);
    let modalAssignedToHTML = generateModalAssignedToHTML(element.assignedTo);
    let modalSubtasksHTML = generateModalSubtasksHTML(element);

    return /*html*/ `
        <div class="modalContainer" id="modalContainer">
            <div class="modalToDoContent">
                <div class="modalCategoryContainer">
                    ${modalCategoryHTML}
                    <img class="modalCloseIcon" onclick="closeModal()" src="../assets/icons/closeGrey.svg" alt="">
                </div>
                <div class="modalScrollbarWrapper">
                    <div id="modalHeader" class="modalHeader">${element.title}</div>
                    <div class="modalDescription" id="modalDescription">${element.description}</div>
                    <div class="modalDateContainer">
                        <div class="modalDateText">Due date:</div>
                        <div>${element.date}</div>
                    </div>
                    <div class="modalPrioContainer">
                        <div class="modalPrioText">Priority:</div>
                        <div class="modalPrioIconContainer">
                            <div>${priority}</div>
                            <img src="../assets/icons/prio${element.prio}small.svg">
                        </div>
                    </div>
                    <div class="modalAssignedToContainer">
                        <div class="modalAssignedToText">Assigned To:</div>
                        <div class="modalAssignedToContainer">${modalAssignedToHTML}</div>
                    </div>
                    <div>
                        <div class="modalSubtasksText">Subtasks</div>
                        <div class="modalSubtasksContainer">${modalSubtasksHTML}</div>
                    </div>
                </div>
                <div class="modalBottomContainer">
                    <div class="modalBottomDeleteContainer" onclick="deleteTask('${element.id}')">
                        <img src="../assets/icons/deleteDarkBlue.svg">
                        <div>Delete</div>
                    </div>
                    <div class="modalBottomSeparator"></div>
                    <div class="modalBottomEditContainer" onclick="enableTaskEdit('${element.id}')">
                        <img src="../assets/icons/pencilDarkBlue.svg">
                        <div>Edit</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/**
 * Generates the HTML for editing a task.
 *
 * @param {string} taskId - The ID of the task to be edited.
 * @returns {string} The generated HTML string for editing the task.
 */
function generateTaskEditHTML(taskId) {
    let task = tasks.find(task => task.id === taskId);
    let subtaskHTML = '';
    assignedContacts = !task.assignedTo ? [] : task.assignedTo.forEach(t => assignedContacts.push(t));

    if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach((subtask, index) => {
            subtaskHTML += /*html*/ `
                <li class="subtaskEditList" id="subtask-${index}" ondblclick="editSubtask(this)">
                    <div class="subtaskItem">
                        <span class="subtaskItemText">${subtask.text}</span>
                        <input type="text" class="editSubtaskInput dNone" value="${subtask.text}" maxlength="80"/>
                        <div class="addedTaskIconContainer">
                            <img class="icon" src="../assets/icons/pencilDarkBlue.svg" onclick="editSubtask(this)">
                            <div class="subtaskInputSeperator"></div>
                            <img class="icon" src="../assets/icons/delete.svg" onclick="deleteSubtask(this)">
                        </div>
                    </div>
                </li>
            `;
        });
    }

    return /*html*/ `
        <div class="modalToDoContent">
            <div class="editTaskCloseContainer">
                <img class="modalCloseIcon" onclick="closeModal()" src="../assets/icons/closeGrey.svg" alt="">
            </div>
            <form onsubmit="return saveEditedTask(event, '${taskId}')" class="editTaskForm">
                <div class="editTaskScrollbarWrapper">
                    <div class="singleInputContainer">
                        <div class="redStarAfter">Title</div>
                        <input id="editTaskTitle" type="text" placeholder="Enter a title" required maxlength="80">
                        <div class="formValidationText" style="display: none;">This field is required</div>
                    </div>
                    <div class="singleInputContainer">
                        <div>Description</div>
                        <textarea id="editTaskDescription" placeholder="Enter a Description" maxlength="240"></textarea>
                    </div>
                    <div class="singleInputContainer" onclick="">
                        <div class="redStarAfter">Due date</div>
                        <input id="editDateInput" class="dateInput" type="date" placeholder="dd/mm/yyyy" required>
                        <div class="formValidationText" style="display: none;">This field is required</div>
                    </div>
                    <div class="editTaskPrioContainer">
                        <div>Priority</div>
                    <div class="prioBtnContainer">
                        <div class="prioBtn prioBtnUrgent" onclick="setPrio(this)" data-prio="urgent">
                        <div>Urgent</div>
                            <img class="priourgentsmallWhite" src="../assets/icons/priourgentsmallWhite.svg">
                            <img class="priourgentsmall" src="../assets/icons/priourgentsmall.svg">
                        </div>
                        <div class="prioBtn prioBtnMedium prioBtnMediumActive" onclick="setPrio(this)" data-prio="medium">
                        <div>Medium</div>
                            <img class="priomediumsmallWhite" src="../assets/icons/priomediumsmallWhite.svg">
                            <img class="priomediumsmall" src="../assets/icons/priomediumsmall.svg">
                        </div>
                        <div class="prioBtn prioBtnLow" onclick="setPrio(this)" data-prio="low">
                        <div>Low</div>
                            <img class="priolowsmallWhite" src="../assets/icons/priolowsmallWhite.svg">
                            <img class="priolowsmall" src="../assets/icons/priolowsmall.svg">
                        </div>
                    </div>
                    </div>
                    <div class="singleInputContainer">
                        <div>Assigned to</div>
                        <div id="assignDropdown" class="assignContainer">
                            <input id="assignSearch" type="search" class="contactsAssignStandard"
                                value="Select contacts to assign" onclick="toggleDropdown()" oninput="assignSearchInput()"
                                placeholder="Search contacts" readonly>
                            <div class="imgContainer" onclick="toggleDropdown()">
                                <img id="assignDropArrow" src="../assets/icons/arrowdropdown.svg" alt="">
                            </div>
                            <div id="contactsToAssign" class="contactsToAssign"></div>
                        </div>
                        <div id="contactsAssigned" class="contactsAssigned"></div>
                    </div>
                    <div class="singleInputContainer">
                        <div>Subtasks</div>
                        <div class="subtasksInputContainer" onclick="addNewSubtask(event)">
                            <input id="subtaskInput" class="subtasksInput" type="text" placeholder="Add new subtask" maxlength="80" onkeydown="handleKeyDown(event)">
                            <img id="subtaskPlusIcon" class="subtaskPlusIcon" src="../assets/icons/addBlack.svg">
                            <div id="subtaskIconContainer" class="subtaskIconContainer dNone">
                                <img onclick="clearSubtaskInput()" class="icon" src="../assets/icons/delete.svg">
                                <div class="subtaskInputSeperator"></div>
                                <img onclick="saveSubtask()" class="icon" src="../assets/icons/checkBlackBig.svg">
                            </div>
                        </div>
                        <ul id="subtaskList">${subtaskHTML}</ul>
                    </div>
                </div>
                <div class="editBottomContainer">
                    <button type="submit" class="saveTaskEditBtn" onclick="return formValidation()">
                        <div>Ok</div>
                        <img src="../assets/icons/check.svg">
                    </button>
                </div>
            </form>
        </div>
    `;
}


/**
 * Generates the HTML for the delete confirmation dialog.
 *
 * @param {string} id - The ID of the task to be deleted.
 * @returns {string} The generated HTML string for the delete confirmation dialog.
 */
function openDeleteTaskSureHtml(id) {
    return /*html*/`
        <div class="deleteQuestion">
            <p>Do you really want to delete this task?</p>
            <form onsubmit="deleteTaskSure('${id}'); return false;">
                <button type="button" onclick="toggleClass('deleteResponse', 'ts0', 'ts1')">NO
                    <img src="../assets/icons/close.svg" alt="close X">
                </button>
                <button type="submit">YES
                    <img src="../assets/icons/check.svg" alt="check icon">
                </button>
            </form>
        </div>
    `;
}
