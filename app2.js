function checkPassword() {
    if (document.getElementById('PASSWORD').value == 123) {
        document.getElementById('HIDDEN-CONTAINER').classList.remove("hidden");
        document.getElementById('FORM-POPUP').style.display= "none"
        document.getElementById('VIP-BTN').style.display= "none"
    } else {
        document.getElementById('PASSWORD').value= ""; // RESETTING THE PASSWORD AFTER FAIL
        alert('Invalid Password!!'); password.setSelectionRange(0, password.value.length);
    }
}
function openForm() {
    document.getElementById('FORM-POPUP').style.visibility= "visible";
}
function closeForm() {
    document.getElementById('FORM-POPUP').style.visibility= "hidden";
}
window.onbeforeunload = function() {
    window.scrollTo(0, 0);
}