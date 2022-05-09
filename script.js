/**
 * Inspired by Professor Fleenor
 * Runs when any page loads.
 */
window.onload = init;
function init() {
    initializeBagCount();
    initializeUserSignedIn();
    addLastUpdate();
    showTime();
    displaySignInOutButton();
    displayBagCount();
}

//All event listeners below
/**
 * This event listener attempts to sign a user in when the user clicks the submit 
 * button on the login form.
 */
let loginFormSubmitButton = document.getElementById("loginFormSubmitButton");
if (loginFormSubmitButton) {
    loginFormSubmitButton.addEventListener("click", signUserIn);
}

/**
 * This event listener signs the user out when the user clicks the login button
 * (the login button also serves as a link to the login page).
 */
let loginButton = document.getElementById("loginButton");
if (loginButton) {
    loginButton.addEventListener("click", signUserOut);
}

/**
 * This event listener attempts to create a new account when the user clicks the submit 
 * button on the create account form.
 */
let createAccountFormSubmitButton = document.getElementById("createAccountFormSubmitButton");
if (createAccountFormSubmitButton) {
    createAccountFormSubmitButton.addEventListener("click", createNewAccount);
}

/**
 * This event listener displays the contact acknowledgement message when the user clicks the submit 
 * button on the contact form.
 */
let contactFormSubmitButton = document.getElementById("contactFormSubmitButton");
if (contactFormSubmitButton) {
    contactFormSubmitButton.addEventListener("click", displayContactAck);
}

/**
 * This event listener both displays an acknowledgement and adds the submitted number of trash bags 
 * collected to the running trash bag count when the user clicks the submit 
 * button on the report service form.
 */
let reportServiceFormSubmitButton = document.getElementById("reportServiceFormSubmitButton");
if (reportServiceFormSubmitButton) {
    reportServiceFormSubmitButton.addEventListener("click", displayServiceAck);
    reportServiceFormSubmitButton.addEventListener("click", addBagsToBagCount);
}
//All event listeners above^^^

/**
 * Signs user in
 */
function signUserIn() {
    if (userSignedIn() === 'false') { //if the user is not already signed in 
        if (validateLogin()) { //if the user has valid login credentials
            localStorage.setItem("userSignedIn", true);
            displayWelcome();
            displaySignInOutButton();
        }
    }
}

/**
 * Creates a new account
 */
function createNewAccount() {
    let users = { "user1": "user1pass", "user2": "user2pass", "user3": "user3pass" }; //Array to store 'existing users'
    let enteredUsername = document.forms["createAccountForm"]["username"].value; //get the user's value entered in the form
    if (!(enteredUsername in users)) { //if a user with that username does not already exist
        if (checkPassMatch()) { //check passwords match
            localStorage.setItem("userSignedIn", true); //sign user in
            displaySignInOutButton();
            document.getElementById("createAccountForm").hidden = true; //hide the form
            document.getElementById("createAccountHeader").innerHTML = "Thank you for joining us!"; //display welcome message
        }
    } else {
        alert("That username is already taken."); //alert if username taken
    }
}

/**
 * Checks if two passwords entered into a form match
 * @return {boolean}      Whether the passwords match or not
 */
function checkPassMatch() {
    let passFlag = false;
    let pwdOne = document.forms["createAccountForm"]["pwdOne"].value;
    let pwdTwo = document.forms["createAccountForm"]["pwdTwo"].value;
    if (pwdOne == pwdTwo) {
        passFlag = true;
    }
    else {
        alert("Passwords did not match!");
    }
    return passFlag;
}


/**
 * Sign a user out
 */
function signUserOut() {
    if (userSignedIn() === 'true') {
        localStorage.setItem("userSignedIn", false);
        displaySignInOutButton();
    }
}

/**
 * check if user is signed in
 * @return {String}      String "true" if user signed in; "false" otherwise
 */
function userSignedIn() {
    let signedIn = localStorage.getItem("userSignedIn");
    return signedIn;
}

/**
 * Display the sign in/out button depending on if the user is signed in
 */
function displaySignInOutButton() {
    //If user is signed in, hide the login and create account buttons
    if (userSignedIn() === 'true') {
        document.getElementById("createAccountButton").hidden = true;
        document.getElementById("loginButton").innerHTML = "Logout";
    }
    else {
        document.getElementById("createAccountButton").hidden = false;
        document.getElementById("loginButton").innerHTML = "Login";
    }
}

/**
 * Display a welcome message after the user signs in
 */
function displayWelcome() {
    let formField1 = document.forms["loginForm"]["username"]; //get user input from login form
    let formField2 = document.forms["loginForm"]["password"];
    //check to make sure all HTML validations are satisfied before JS runs
    if (formField1.checkValidity() && formField2.checkValidity()) {
        document.getElementById("loginForm").hidden = true;
        document.getElementById("loginFormSubmitButton").hidden = true;
        document.getElementById("loginHeader").innerHTML = "Welcome back!";
    }
}

/**
 * Display a confirmation message for user contact and hide contact buttons and form
 */
function displayContactAck() {
    let formField1 = document.forms["contactForm"]["firstName"];
    let formField2 = document.forms["contactForm"]["lastName"];
    let formField3 = document.forms["contactForm"]["emailAddress"];
    let formField4 = document.forms["contactForm"]["phoneNum"];
    //check to make sure all HTML validations are satisfied before JS runs
    if (formField1.checkValidity() && formField2.checkValidity() && formField3.checkValidity() && formField4.checkValidity()) {
        document.getElementById("contactForm").hidden = true;
        document.getElementById("contactFormSubmitButton").hidden = true;
        document.getElementById("contactHeader").innerHTML = "Thank you for contacting us. We will be in touch shortly.";
    }
}

/**
 * Display a confirmation message when user submits report service form
 */
function displayServiceAck() {
    let formField1 = document.forms["reportServiceForm"]["numBags"];
    let formField2 = document.forms["reportServiceForm"]["numParticipants"];
    //check to make sure all HTML validations are satisfied before JS runs
    if (formField1.checkValidity() && formField2.checkValidity()) {
        document.getElementById("reportServiceForm").hidden = true;
        document.getElementById("reportServiceFormSubmitButton").hidden = true;
        document.getElementById("reportServiceHeader").innerHTML = "Thank you for cleaning up your community!";
    }
}

/**
 * Checks if username/password combo are for an existing user
 * @return {boolean}      Whether the login credentials are valid or not
 */
function validateLogin() {
    //Array to store 'existing users'
    let users = { "user1": "user1pass", "user2": "user2pass", "user3": "user3pass" };
    let passFlag = false;
    let usernameFlag = false;
    let enteredUsername = document.forms["loginForm"]["username"].value; //get user input values
    let enteredPassword = document.forms["loginForm"]["password"].value;
    if (enteredUsername in users) { //check if username exists in list of valid usernames
        usernameFlag = true;
        if (users[enteredUsername] === enteredPassword) { //check if the entered password is correct for that username
            passFlag = true;
        }
    }
    if ((usernameFlag === false) || (passFlag === false)) { //fail message
        alert("Either your username does not exist in our records or your password is incorrect.");
    }
    return (usernameFlag && passFlag);
}

/**
 * Initializes the bag count to 0 in local storage when one of the pages is opened 
 * on a browser for the first time.
 */
function initializeBagCount() {
    if (localStorage.getItem("currentBagCount") === null) {

        localStorage.setItem("currentBagCount", "0");
    }
}

/**
 * Initializes userSignedIn to false in local storage when one of the pages is opened 
 * on a browser for the first time.
 */
function initializeUserSignedIn() {
    if (localStorage.getItem("userSignedIn") === null) {
        localStorage.setItem("userSignedIn", false);
    }
}

/**
 * Inspired by Professor Fleenor. Updates HTML with document's lastModified
 * property and puts it in footers. Called when page loads.
 */
function addLastUpdate() {
    let modDate = new Date(document.lastModified);
    let modMonth = modDate.getMonth();

    //array used to convert from numeric date to string month
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let modMonthStr = months[modMonth];
    let modYear = modDate.getFullYear();
    document.getElementById("update_date").innerHTML = (modMonthStr + " " + modYear);
}

/**
 * From Professor Fleenor. Updates HTML with document's lastModified
 * property and puts it in footers. Called when page loads.
 */
setInterval(showTime, 1000);

function showTime() {
    let time = new Date();
    document.getElementById("current_date").innerHTML = time.getFullYear();
}

/**
 * Takes user-entered bag count from report service form and adds to 
 * running bags collected that is displayed on home page.
 */
function addBagsToBagCount() {
    //get user input
    let formField1 = document.forms["reportServiceForm"]["numBags"];
    let formField2 = document.forms["reportServiceForm"]["numParticipants"];

    //ensure that HTML validation runs before JS
    if (formField1.checkValidity() && formField2.checkValidity()) {
        //Note: type conversion required by local storage
        let currentBagCountStr = localStorage.getItem("currentBagCount");
        let currentBagCountInt = parseInt(currentBagCountStr);
        let numBags = document.forms["reportServiceForm"]["numBags"].value;
        let numBagsInt = parseInt(numBags);
        currentBagCountInt = currentBagCountInt + numBagsInt;
        currentBagCountStr = currentBagCountInt.toString();
        localStorage.setItem("currentBagCount", currentBagCountStr);
    }
}

/**
 * Displays bag count on home page.
 */
function displayBagCount() {
    let title = document.getElementsByTagName("title")[0].innerHTML;//only display on home page
    if (title === "Index") {
        //Current Bags collected
        let currentBagCount = localStorage.getItem("currentBagCount");
        if (isNaN(currentBagCount)) {
            localStorage.setItem("currentBagCount", "0");
            currentBagCount = localStorage.getItem("currentBagCount");
        }
        let currentBagCountInt = parseInt(currentBagCount);
        document.getElementById("currentBagCount").innerHTML = currentBagCountInt;
    }
}
