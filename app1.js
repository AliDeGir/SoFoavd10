function checkPassword() {
    if (document.getElementById('PASSWORD').value == 123) {
        document.getElementById('HIDDEN-CONTAINER').classList.remove("hidden");
        document.getElementById('FORM-POPUP').style.display= "none"
        document.getElementById('VIP-BTN').style.display= "none"
    } else {
        document.getElementById('PASSWORD').value= ""; // RESETTING THE PASSWORD AFTER FAIL
        alert('Invalid Password!!'); password.setSelectionRange(0, password.value.length);
    }
};

const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".menu-links");
burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");

    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = "";
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${
                index / 7 + 0.5
            }s `;
        }
    });
    burger.classList.toggle("toggle");
});

const links = document.querySelectorAll('.nav-links li')
links.forEach(elem=>{
    elem.addEventListener("click", function(){
        let targetID = this.dataset.ref;
        document.querySelector(".active").classList.remove('active');
        document.querySelector(`#${targetID}`).classList.add('active');
        let navLi = document.querySelector(".nav-links");
        navLi.classList.toggle("nav-active");
        let burgerM = document.querySelector(".burger")
        burgerM.classList.toggle("toggle");
        window.scrollTo(0, 0);
    });
});