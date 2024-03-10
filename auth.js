import { fetchMessagesDb, addMessageDb, fetchWithSnapshot } from "./firestore.js"
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
        fetchWithSnapshot();
        fetchMessagesDb();
    } else {
        console.log('User logged out: ', user);
    }
})

const loginBtn = document.querySelector('#TEST-BTN');
loginBtn.addEventListener('click', function() {
    console.log('Login button clicked');
    let email = document.querySelector('#USER-INPUT').value;
    let password = document.querySelector('#PASSWORD-INPUT').value;

    signInWithEmailAndPassword(auth, email, password);
})

const logoutBtn = document.querySelector('#logout-btn');
logoutBtn.addEventListener('click', function() {
    signOut(auth);
    console.log('Log out button clicked');
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