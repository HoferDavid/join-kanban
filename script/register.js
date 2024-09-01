/* These import statements are used to bring in specific functions and modules from the Firebase
JavaScript SDK version 10.12.4. */
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";


const auth = getAuth();
const database = getDatabase();
let clickCount1 = 0;
let clickCount2 = 0;


/**
 * The `initRegister` function initializes form submission handling and sets up password field toggling
 * for a signup form.
 */
function initRegister() {
    document.getElementById('signupForm').addEventListener('submit', submitData);
    setupPasswordFieldToggle("password");
    setupPasswordFieldToggle("confirmPassword");
}


/**
 * The function `setupPasswordFieldToggle` sets up event listeners for toggling a password input field
 * visibility.
 * @param inputFieldId - The `inputFieldId` parameter is the ID of the password input field in the HTML
 * document that you want to enhance with a password toggle functionality.
 */
function setupPasswordFieldToggle(inputFieldId) {
    const passwordInputField = document.getElementById(inputFieldId);
    passwordInputField.addEventListener("mousedown", (event) => togglePassword(event, passwordInputField));
    passwordInputField.addEventListener("focus", () => updateBackgroundImage(passwordInputField, false));
    passwordInputField.addEventListener("blur", () => resetState(passwordInputField));
}


/**
 * The function `togglePassword` toggles the visibility of a password input field and updates its
 * background image accordingly.
 * @param e - The `e` parameter in the `togglePassword` function is typically an event object, such as
 * a click event or keypress event, that triggers the function. It is used to prevent the default
 * behavior of the event using `e.preventDefault()`.
 * @param passwordInputField - The `passwordInputField` parameter in the `togglePassword` function is a
 * reference to the input field element where the user enters their password. This field can be of type
 * "password" to hide the entered characters or type "text" to display the characters in plain text.
 * The function toggles
 */
function togglePassword(e, passwordInputField) {
    e.preventDefault();
    const cursorPosition = passwordInputField.selectionStart;
    const isPasswordVisible = (passwordInputField.id === "password" ? clickCount1 : clickCount2) % 2 === 1;
    passwordInputField.type = isPasswordVisible ? "text" : "password";
    updateBackgroundImage(passwordInputField, isPasswordVisible);
    passwordInputField.setSelectionRange(cursorPosition, cursorPosition);
    passwordInputField.focus();
    isPasswordVisible ? passwordInputField.id === "password" ? clickCount1-- : clickCount2-- : passwordInputField.id === "password" ? clickCount1++ : clickCount2++;
}


/**
 * The function `updateBackgroundImage` changes the background image of a specified field based on the
 * visibility status.
 * @param field - The `field` parameter represents the HTML element (e.g., a div, input field, etc.)
 * whose background image you want to update based on the `isVisible` parameter.
 * @param isVisible - The `isVisible` parameter is a boolean value that determines whether the
 * background image should be visible or not. If `isVisible` is `true`, the background image will be
 * set to "visibility.png", and if it is `false`, the background image will be set to
 * "password_off.png".
 */
function updateBackgroundImage(field, isVisible) {
    const image = isVisible ? "visibility.png" : "password_off.png";
    field.style.backgroundImage = `url('../assets/icons/${image}')`;
}


/**
 * The function `resetState` resets the state of a given field by changing its type to password,
 * setting a background image, and resetting click counts based on the field's id.
 * @param field - The `field` parameter is likely referring to an HTML input element, such as a text
 * input field on a form. The function `resetState` is designed to reset the state of this input field
 * by changing its type to "password" and updating its background image. Additionally, it resets a
 * click
 */
function resetState(field) {
    field.type = "password";
    field.style.backgroundImage = "url('../assets/icons/password_input.png')";
    field.id === "password" ? clickCount1 = 0 : clickCount2 = 0;
}


/**
 * The function `submitData` handles form submission by validating user input and signing up the user
 * with the provided information.
 * @param event - The `event` parameter in the `submitData` function is an event object that represents
 * an event being handled, such as a form submission event. In this case, the function is used to
 * handle form submission and prevent the default form submission behavior using
 * `event.preventDefault()`.
 * @returns If the `validateForm` function returns `false`, the `submitData` function will not proceed
 * further and will return without executing the `signUp` function.
 */
async function submitData(event) {
    event.preventDefault();
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    hideErrorMessages();
    if (!await validateForm(password, confirmPassword, email)) return;
    try {
        await signUp(name, email, password);
    } catch (error) {
        submitDataErrorHandling(error);
    }
}



/**
 * The function `hideErrorMessages` hides error messages displayed on a webpage by setting their
 * display style to 'none'.
 */
function hideErrorMessages() {
    document.getElementById('passwordErrorMessage').style.display = 'none';
    document.getElementById('mailErrorMessage').style.display = 'none';
    document.getElementById('criteriaMessage').style.display = 'none';
    document.getElementById('emailExistsMessage').style.display = 'none';
}



/**
 * The function `validateForm` checks if the password matches the confirmation, meets password
 * criteria, and if the email is valid and doesn't already exist, returning an error message if any
 * condition fails.
 * @param password - The `validateForm` function you provided checks various conditions before allowing
 * a user to submit a form. The `password` parameter is used to store the password input provided by
 * the user.
 * @param confirmPassword - The `confirmPassword` parameter in the `validateForm` function is used to
 * confirm that the user has entered the correct password by comparing it with the original password
 * input. If the `password` and `confirmPassword` values do not match, an error message is displayed to
 * the user.
 * @param email - The `email` parameter in the `validateForm` function is used to pass the email input
 * value that the user enters in a form for validation.
 * @returns The `validateForm` function is returning either an error message element (if a validation
 * check fails) or `true` if all validation checks pass.
 */
async function validateForm(password, confirmPassword, email) {
    if (!document.getElementById('privacy-policy').checked) {
        return returnLoginError(document.getElementById('privacyCheck'));
    }
    if (!isValidEmail(email)) {
        return returnLoginError(document.getElementById('mailErrorMessage'));
    }
    if (await emailExists(email)) {
        return returnLoginError(document.getElementById('emailExistsMessage'));
    }
    if (!isValidPassword(password)) {
        return returnLoginError(document.getElementById('criteriaMessage'));
    }
    if (password !== confirmPassword) {
        return returnLoginError(document.getElementById('passwordErrorMessage'));
    } return true;
}


/**
 * The function `returnLoginError` displays an error message window and returns false.
 * @param errorWindow - The `errorWindow` parameter is likely a reference to an HTML element that
 * represents a window or container where login errors are displayed. The function `returnLoginError`
 * sets the display style of this element to 'block' in order to make the error message visible to the
 * user.
 * @returns The function `returnLoginError` is returning the boolean value `false`.
 */
function returnLoginError(errorWindow) {
    errorWindow.style.display = 'block';
    return false;
}


/**
 * The function `isValidPassword` uses a regular expression to check if a password meets specific
 * criteria including having at least one uppercase letter, one digit, and one special character, and
 * being at least 8 characters long.
 * @param password - The function `isValidPassword` takes a password as input and checks if it meets
 * the following criteria:
 * @returns The function `isValidPassword` is returning a boolean value - `true` if the `password`
 * meets the specified criteria defined by the regular expression, and `false` otherwise.
 */
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:])[A-Za-z\d@$!%*?&.,:]{8,}$/;
    return regex.test(password);
}


/**
 * Checks if the provided email address is in a valid format,
 * ending with a period followed by letters, e.g., `.com`, `.org`, etc.
 * 
 * The email address must contain at least one `@` symbol and a period,
 * and the period must be followed by letters.
 * 
 * @param {string} email - The email address to be validated.
 * @returns {boolean} - Returns `true` if the email address matches the valid format, otherwise returns `false`.
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]+$/;
    return regex.test(email);
}


/**
 * The function `emailExists` checks if a given email exists in the database for a user account.
 * @param email - The `emailExists` function checks if a given email address exists in the `contacts`
 * database and belongs to a user. The function takes an email address as a parameter to search for in
 * the database.
 * @returns If the email exists in the database for a user with the `isUser` property set to true, the
 * function will return `false`. If there is an error during the process, the function will also return
 * `false`. If the email does not exist in the database or if there are no users with the `isUser`
 * property set to true, the function will not return anything explicitly (implicitly
 */
async function emailExists(email) {
    try {
        const userSnapshot = await get(child(ref(database), `contacts`));
        const users = userSnapshot.val() || {};
        for (const key in users) {
            if (!users[key]) {
                continue;
            }
            if (users[key].mail.toLowerCase() === email.toLowerCase() && users[key].isUser) {
                return false;
            }
        }
    } catch (error) {
        return false;
    }
}


/**
 * The `signUp` function asynchronously creates a new user account with the provided name, email, and
 * password, then creates a new contact, shows a success popup, and redirects the user to the index
 * page after a delay.
 * @param name - The `name` parameter in the `signUp` function represents the name of the user who is
 * signing up for Join.
 * @param email - The `email` parameter is the email address of the user signing up for Join.
 * @param password - The `password` parameter in the `signUp` function is the password that the user
 * enters when signing up for an account. It is used to create a new user account with the provided
 * email address and password using the `createUserWithEmailAndPassword` function.
 */
async function signUp(name, email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createNewContact(name, email);
    showSuccessPopup();
    setTimeout(() => window.location.href = "../index.html", 1500);
}


/**
 * The function `createNewContact` creates a new contact with the provided name and email, updates the
 * data, adds the contact to the contacts list, and stores the contacts in the session storage.
 * @param name - The `name` parameter in the `createNewContact` function represents the name of the
 * contact that you want to create.
 * @param email - The `email` parameter in the `createNewContact` function is the email address of the
 * new contact being created.
 */
async function createNewContact(name, email) {
    const contact = await createContact(false, name, email, 'Please add phone number', false, true);
    await updateData(`${BASE_URL}contacts/${contact.id}.json`, contact);
    contacts.push(pushToContacts(contact));
    sessionStorage.setItem("contacts", JSON.stringify(contacts));
}


/**
 * The function `showSuccessPopup` displays a popup with the id 'successPopup' and redirects to
 * 'index.html' when the popup is clicked.
 */
function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.style.display = 'block';
    popup.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
}


/**
 * The function `submitDataErrorHandling` handles errors by displaying specific messages based on the
 * error code.
 * @param error - The `error` parameter is an object that contains information about the error that
 * occurred during the submission of data. It likely has a `code` property that specifies the type of
 * error that occurred.
 */
function submitDataErrorHandling(error) {
    if (error.code === 'auth/email-already-in-use') {
        showError("emailExistsMessage");
    } else {
        showError("errorMessage");
    }
}


/**
 * The function showError displays an error message by setting the display style of an element with a
 * specific ID to 'block'.
 * @param messageId - The `messageId` parameter in the `showError` function is a string that represents
 * the id attribute of an HTML element. This function is designed to display the element with the
 * specified id by setting its display style property to 'block', making it visible on the webpage.
 */
function showError(messageId) {
    document.getElementById(messageId).style.display = 'block';
}


/**
 * The function `checkBoxClicked` toggles the checked state of a checkbox, updates the checkbox image
 * accordingly, and enables/disables a submit button based on the checkbox state.
 */
function checkBoxClicked() {
    const checkedState = document.getElementById('privacy-policy').checked;
    const checkboxImg = document.getElementById('checkbox');
    const submitButton = document.getElementById('signup-btn');
    submitButton.disabled = !checkedState;
    checkboxImg.src = checkedState ? '../assets/icons/checkboxchecked.svg' : '../assets/icons/checkbox.svg';
}


/* The code is adding an event listener to the element with the id 'privacy-policy'. When this element
is clicked, the function checkBoxClicked will be called. Additionally, the code is also adding an
event listener to the 'DOMContentLoaded' event, which will call the function initRegister when the
DOM content has finished loading. */
document.getElementById('privacy-policy').addEventListener('click', checkBoxClicked);
document.addEventListener('DOMContentLoaded', initRegister);