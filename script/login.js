import { getAuth, signInWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";


const auth = getAuth();
const database = getDatabase();
const passwordInput = document.getElementById('passwordInput');
let isPasswordVisible = false;
let clickCount = -1;


/**
 * Initializes the login form, setting up remembered user credentials and password toggle functionality.
 */
function initLogin() {
    if (document.getElementById('login-form')) {
        let rememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe) {
            document.getElementById('emailInput').value = localStorage.getItem('email');
            document.getElementById('passwordInput').value = localStorage.getItem('password');
            document.getElementById('checkbox').src = rememberMe ? 'assets/icons/checkboxchecked.svg' : 'assets/icons/checkbox.svg';
            document.getElementById('rememberMe').checked = rememberMe;
        }
        setupPasswordToggle();
    }
}


/**
 * Sets up the password visibility toggle functionality for the password input field.
 */
function setupPasswordToggle() {
    passwordInput.addEventListener("click", changeVisibility);
    passwordInput.addEventListener("focus", () => { clickCount++; });
    passwordInput.addEventListener("blur", resetState);
}


/**
 * Toggles the visibility of the password in the password input field.
 * 
 * @param {Event} e - The click event on the password input field.
 */
function changeVisibility(e) {
    e.preventDefault();
    const cursorPosition = passwordInput.selectionStart;
    if (clickCount === 0) {
        togglePasswordVisibility();
        clickCount++;
    } else if (clickCount === 1) {
        togglePasswordVisibility();
        clickCount--;
    }
    passwordInput.setSelectionRange(cursorPosition, cursorPosition);
}


/**
 * Resets the password input field to its default state (hidden password) when it loses focus.
 */
function resetState() {
    passwordInput.type = "password";
    passwordInput.style.backgroundImage = "url('assets/icons/password_input.png')";
    clickCount = -1;
    isPasswordVisible = false;
}


/**
 * Toggles the type and background image of the password input field to show or hide the password.
 */
function togglePasswordVisibility() {
    passwordInput.type = isPasswordVisible ? "text" : "password";
    const image = isPasswordVisible ? "visibility.png" : "password_off.png";
    passwordInput.style.backgroundImage = `url('assets/icons/${image}')`;
    isPasswordVisible = !isPasswordVisible;
}


/**
 * The function `loginButtonClick` handles user login by capturing email and password inputs, signing
 * in with Firebase authentication, and displaying errors if any.
 * @param event - The `event` parameter in the `loginButtonClick` function represents the event that
 * occurred, such as a button click. In this case, the function is used to handle the click event of a
 * login button. By calling `event.preventDefault()`, the default action of the event (in this case,
 */
async function loginButtonClick(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value.trim().toLowerCase();
    const password = document.getElementById('passwordInput').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await setCurrentUser(email, userCredential);
        handleRememberMe(rememberMe);
        continueToSummary();
    } catch (error) {
        showError(error);
    }
}


/**
 * The function `setCurrentUser` asynchronously sets the current user based on their email address and
 * user credentials, deleting the user if not found.
 * @param email - The `email` parameter is a string that represents the email address of the user you
 * want to set as the current user.
 * @param userCredential - The `userCredential` parameter is typically an object that contains
 * information about the user who is currently authenticated. It may include details such as the user's
 * unique identifier, email address, display name, and other relevant information provided by the
 * authentication service. This object is usually obtained after a user successfully logs in
 * @returns If a user with the provided email address and isUser flag is found in the contacts data,
 * the currentUser object representing that user is returned. If no user is found, an error is thrown
 * with the message 'No user found with the provided email address.'
 */
async function setCurrentUser(email, userCredential) {
    const userSnapshot = await get(child(ref(database), `contacts`));
    if (userSnapshot.exists()) {
        const users = userSnapshot.val();
        for (const key in users) {
            if (!users[key]) continue;
            if (users[key].mail.toLowerCase() === email && users[key].isUser) {
                currentUser = users[key];
                return true;
            }
        }
    }
    deleteUser(userCredential.user);
    throw new Error('No user found with the provided email address.');
}


/**
 * Handles the "remember me" functionality by storing or removing user credentials in localStorage.
 * 
 * @param {boolean} rememberMe - Indicates if the user wants to be remembered.
 */
function handleRememberMe(rememberMe) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    if (rememberMe) {
        localStorage.setItem('email', document.getElementById('emailInput').value);
        localStorage.setItem('password', document.getElementById('passwordInput').value);
        localStorage.setItem('rememberMe', 'true');
    } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
    }
}


/**
 * Redirects the user to the summary page.
 */
function continueToSummary() {
    sessionStorage.setItem('activeTab', 'summary');
    window.location.href = 'html/summary.html';
}


/**
 * The function `showError` displays a specific error message on the webpage based on the type of error
 * received.
 * @param error - The `error` parameter is an object that contains information about an error that
 * occurred in the code. It likely has a `message` property that provides a description of the error.
 */
function showError(error) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = error.message.includes('auth/invalid-credential') ? 'Oops, wrong email address or password! Try it again.' : error.message;
    errorMessageElement.style.display = 'block';
}


/**
 * Handles the guest login functionality by setting a guest user and redirecting to the summary page.
 */
function handleGuestLogin() {
    const guestUser = { name: "Guest", firstLetters: "G" };
    sessionStorage.setItem('currentUser', JSON.stringify(guestUser));
    localStorage.clear();
    continueToSummary();
}


/**
 * Handles the checkbox click event for the "remember me" functionality, updating the checkbox image accordingly.
 */
function checkBoxClicked() {
    const checkedState = document.getElementById('rememberMe').checked;
    const checkboxImg = document.getElementById('checkbox');
    checkboxImg.src = checkedState ? 'assets/icons/checkboxchecked.svg' : 'assets/icons/checkbox.svg';
}

document.getElementById('rememberMe').addEventListener('click', checkBoxClicked);
document.getElementById('loginButton').addEventListener('click', loginButtonClick);
document.getElementById('guestLogin').addEventListener('click', handleGuestLogin);
document.addEventListener("DOMContentLoaded", initLogin);