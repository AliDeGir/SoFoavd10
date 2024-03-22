import {
    fetchMembersNews,
    fetchMessages,
    addMessageDb, 
} from "./firestore.js"
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signOut, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"

const auth = getAuth();

// User online status
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User logged in: ', user);
        document.getElementById('HIDDEN-CONTAINER').style.display = "flex";
        document.getElementById('FORM-POPUP').style.display = "none";
        document.getElementById('LOGIN-INFO').style.display="none";
        document.getElementById('logout-btn').style.display= "flex";
        document.getElementById('becomeMember-btn').style.display = "none";
        fetchMessages();
        fetchMembersNews();
    } else {
        console.log('User logged out: ', user);
    }
})



// Login
const loginBtn = document.querySelector('#LOGIN-BTN');
loginBtn.addEventListener('click', function() {
    console.log('Login button clicked');
    let email = document.querySelector('#USER-INPUT').value;
    let password = document.querySelector('#PASSWORD-INPUT').value;

    // Attempt to sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        // Sign-in successful
        // console.log('User signed in successfully');
    })
    .catch((error) => {
        // Sign-in failed, display alert
        console.error('Sign-in error:', error);
        alert('Email or password is incorrect');
    });
});

// Logout
const logoutBtn = document.querySelector('#logout-btn');
logoutBtn.addEventListener('click', function() {
    signOut(auth);
    // console.log('Log out button clicked');
    document.getElementById('HIDDEN-CONTAINER').style.display = "none";
    document.getElementById('FORM-POPUP').style.display = "flex";
    document.getElementById('logout-btn').style.display= "none";
    document.getElementById('becomeMember-btn').style.display = "flex";
})

// add comments to database
const commentBtn = document.querySelector('#comment-btn')
commentBtn.addEventListener('click', function() {
    addMessageDb();
})

export { auth }