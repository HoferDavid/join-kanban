let currentLetter = '';
let currentLetterId = '';
let editId = -1;


/**
 * Initializes the contacts page by setting up necessary data and rendering contacts.
 */
async function initContacts() {
  init();
  await getContactsData();
  renderContactsGeneral();
}


/**
 * Fetches contact data from storage and sets it in the contacts array.
 * 
 * @returns {Promise<Array>} - A promise that resolves to the array of contacts.
 */
async function getContactsData() {
  contacts = [];
  let loadItem = await loadData('contacts');
  setContactsArray(loadItem);
  sessionStorage.setItem("contacts", JSON.stringify(contacts));
  return contacts;
}


/**
 * This function processes the loaded contact data and adds it to the contacts array.
 * It checks for duplicate entries and ensures that only unique contacts are added.
 * @param {Array} loadItem - The loaded contact data from storage.
 * @returns {void}
 */
function setContactsArray(loadItem) {
  for (let i = 0; i < loadItem.length; i++) {
    const element = loadItem[i];
    if (!element) continue;
    if (contacts.findIndex(c => c.id === element.id) > -1) continue;
    else contacts.push(pushToContacts(element));
  }
}


/**
 * Renders the general contacts list, including contact letters and individual contacts.
 */
function renderContactsGeneral() {
  let contactBook = document.getElementById('contactsGeneral');
  let contactSort = [...contacts];
  contactBook.innerHTML = htmlRenderAddContact();
  contactSort.sort((a, b) => a.name.localeCompare(b.name));
  for (let i = 0; i < contactSort.length; i++) {
    const contact = contactSort[i];
    renderContactsLetter(contact);
    const contactBookEntry = document.getElementById(currentLetterId);
    contactBookEntry.innerHTML += htmlRenderGeneral(contact);
  }
}


/**
 * Renders a new letter section in the contacts list if the first letter of the contact's name has changed.
 * 
 * @param {Object} contact - The contact object.
 */
function renderContactsLetter(contact) {
  let contactBook = document.getElementById('contactsGeneral');
  let firstLetter = contact.name[0].toUpperCase();
  if (firstLetter !== currentLetter) {
    contactBook.innerHTML += htmlRenderContactLetter(firstLetter);
    currentLetter = firstLetter;
    currentLetterId = `contactLetter${currentLetter}`;
  }
}


/**
 * Refreshes the page by re-rendering the general contacts list and the details of the currently edited contact.
 */
function refreshPage() {
  renderContactsGeneral();
  renderContactsDetails(editId);
}


/**
 * Renders the details of the specified contact or an empty details section if no contact is specified.
 * 
 * @param {number|string} [id=''] - The ID of the contact to render details for.
 */
function renderContactsDetails(id = '') {
  let details = document.getElementById('contactsDetail');
  editId = id;
  details.innerHTML = contacts.find(c => (c.id == editId)) && (editId != -1) ? htmlRenderContactDetails(editId) : htmlRenderContactDetailsEmpty();
  makeContactActive(id);
}


/**
 * Highlights the specified contact in the contacts list as the active contact.
 * 
 * @param {number|string} [id=editId] - The ID of the contact to make active.
 */
function makeContactActive(id = editId) {
  let contactLabel = `contact${id}`;
  let contact = document.getElementById(contactLabel);
  let activeContact = document.querySelector('.activeContact');
  activeContact ? activeContact.classList.remove('activeContact') : null;
  contact ? contact.classList.add('activeContact') : null;
}


/**
 * Opens the add contact modal with empty input fields.
 */
function openAddContacts() {
  editId = contacts[contacts.length - 1].id + 1;
  let name = document.getElementById('addName');
  let email = document.getElementById('addMail');
  let tel = document.getElementById('addTel');
  name.value = '';
  email.value = '';
  tel.value = '';
  toggleClass('addContact', 'tt0', 'tty100');
  activateOutsideCheck('addContact', 'tt0', 'tty100');
}


/**
 * Adds a new contact with the inputted details and updates the database.
 * 
 * @param {number|string} [id=editId] - The ID of the new contact.
 */
async function addContacts(id = editId) {
  let addName = document.getElementById('addName').value;
  let addEmail = document.getElementById('addMail').value;
  let addTel = document.getElementById('addTel').value;
  let newContact = await createContact(id, addName, addEmail, addTel, false, false);
  if (checkAlreadyExists(newContact)) {
    await updateData(`${BASE_URL}contacts/${id}.json`, newContact);
    contacts.push(pushToContacts(newContact));
    sessionStorage.setItem("contacts", JSON.stringify(contacts));
    toggleClass('addContact', 'tt0', 'tty100');
    refreshPage();
  }
}


/**
 * Checks if a contact with the same name or email already exists.
 * 
 * @param {Object} contact - The contact to check.
 * @returns {boolean} - True if the contact does not already exist, false otherwise.
 */
function checkAlreadyExists(contact) {
  let warningMessage = document.querySelectorAll('.warning');
  warningMessage.forEach(warning => warning.classList.add('d-none'));
  for (let i = 0; i < contacts.length; i++) {
    const c = contacts[i];
    if ((c.name === contact.name) && (c.id != contact.id) || (c.email === contact.mail) && (c.id != contact.id)) {
      warningMessage.forEach(warning => warning.classList.remove('d-none'));
      return false;
    }
  }
  return true;
}


/**
 * Transforms a contact object into a new object with specific properties and values.
 * If the contact does not have a profile picture, a new one is generated using the contact's name.
 * @param {Object} contact - The contact object to transform.
 * @property {string} contact.mail - The email of the contact.
 * @property {string} contact.name - The name of the contact.
 * @property {number} contact.id - The ID of the contact.
 * @property {boolean} contact.isUser - Indicates whether the contact is a user.
 * @property {string} contact.profilePic - The profile picture of the contact.
 * @property {string} contact.number - The phone number of the contact.
 * @returns {Object} - A new object with the following properties:
 * @property {string} email - The email of the contact.
 * @property {string} firstLetters - The initials of the contact's name.
 * @property {number} id - The ID of the contact.
 * @property {boolean} isUser - Indicates whether the contact is a user.
 * @property {string} name - The name of the contact.
 * @property {string} profilePic - The profile picture of the contact. If not provided, a new one is generated.
 * @property {string} phone - The phone number of the contact.
 */
function pushToContacts(contact) {
  return {
    'email': contact.mail,
    'firstLetters': filterFirstLetters(contact.name),
    'id': contact.id,
    'isUser': contact.isUser,
    'name': contact.name,
    'profilePic': contact.profilePic ? contact.profilePic : generateSvgCircleWithInitials(contact.name, 120, 120),
    'phone': contact.number,
  };
}


/**
 * Opens the edit contact modal with the details of the specified contact.
 * 
 * @param {number|string} id - The ID of the contact to edit.
 */
function openEditContacts(id) {
  editId = id;
  let name = document.getElementById('editName');
  let email = document.getElementById('editMail');
  let tel = document.getElementById('editTel');
  let profilePic = document.getElementById('editProfilePic');
  name.value = contacts[contacts.findIndex(c => c.id == id)].name;
  email.value = contacts[contacts.findIndex(c => c.id == id)].email;
  tel.value = contacts[contacts.findIndex(c => c.id == id)].phone;
  profilePic.innerHTML = contacts[contacts.findIndex(c => c.id == id)].profilePic;
  toggleClass('editContact', 'tt0', 'tty100');
  activateOutsideCheck('editContact', 'tt0', 'tty100');
}


/**
 * Saves the edited contact details and updates the contact in the database.
 * 
 * @param {number|string} [id=editId] - The ID of the contact to save.
 */
async function editContacts(id = editId) {
  let editName = document.getElementById('editName').value;
  let editEmail = document.getElementById('editMail').value;
  let editTel = document.getElementById('editTel').value;
  let nameChange = editName != contacts[contacts.findIndex(c => c.id == id)].name;
  contacts[contacts.findIndex(c => c.id == id)].name = editName;
  contacts[contacts.findIndex(c => c.id == id)].email = editEmail;
  contacts[contacts.findIndex(c => c.id == id)].phone = editTel;
  let contact = contacts[contacts.findIndex(c => c.id == id)];
  if (checkAlreadyExists(contact)) {
    let editContact = await createContact(contact.id, editName, editEmail, editTel, nameChange ? false : contact.profilePic, contact.isUser);
    contacts[contacts.findIndex(c => c.id == id)].profilePic = editContact.profilePic;
    await updateData(`${BASE_URL}contacts/${id}.json`, editContact);
    toggleClass('editContact', 'tt0', 'tty100');
    refreshPage();
  }
}


/**
 * The function `openDeleteContacts` prompts the user with a confirmation message based on the type of
 * account being deleted.
 * @param [id] - The `id` parameter in the `openDeleteContacts` function is used to specify the ID of
 * the contact that you want to delete. If no `id` is provided when calling the function, it will
 * default to the value of `editId`.
 */
function openDeleteContacts(id = editId) {
  editId = id;
  let response = document.querySelector('#deleteResponse>.deleteQuestion>p');
  if (id === currentUser.id) {
    response.textContent = 'Are you sure you want to delete your own account?';
  } else if (contacts[contacts.findIndex(c => c.id == id)].isUser) {
    response.textContent = 'Are you sure you want to delete this user\'s account?';
  } else {
    response.textContent = 'Are you sure you want to delete this contact?';
  };
  toggleClass('deleteResponse', 'ts0', 'ts1');
}


/**
 * The function `deleteContacts` removes a contact from a list, deletes the contact data from a server,
 * updates the session storage, toggles a class in the DOM, and logs out the current user or refreshes
 * the page.
 * @param [id] - The `id` parameter in the `deleteContacts` function is used to specify the ID of the
 * contact that needs to be deleted. If no `id` is provided when calling the function, it defaults to
 * the value of `editId`.
 */
async function deleteContacts(id = editId) {
  contacts.splice(contacts.findIndex(c => c.id == id), 1);
  await deleteData(`contacts/${id}`);
  sessionStorage.setItem("contacts", JSON.stringify(contacts));
  toggleClass('deleteResponse', 'ts0', 'ts1');
  id === currentUser.id ? logOut() : refreshPage();
}


/**
 * Filters the first letters of each word in a name to create initials.
 * 
 * @param {string} name - The name to filter.
 * @returns {string} - The initials created from the name.
 */
function filterFirstLetters(name) {
  return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
}


/**
 * Generates an SVG profile picture with initials and a random background color.
 * 
 * @param {string} name - The name of the contact.
 * @param {number} width - The width of the SVG.
 * @param {number} height - The height of the SVG.
 * @returns {string} - The SVG profile picture as a string.
 */
function generateSvgCircleWithInitials(name, width, height) {
  const colors = ['#0038FF', '#00BEE8', '#1FD7C1', '#6E52FF', '#9327FF', '#C3FF2B', '#FC71FF', '#FF4646', '#FF5EB3', '#FF745E', '#FF7A00', '#FFA35E', '#FFBB2B', '#FFC701', '#FFE62B'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
  return svgProfilePic(randomColor, initials, height, width);
}