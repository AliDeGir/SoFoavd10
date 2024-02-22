const employeeNr = [
    701453731, 701507163, 701404090, 701402078, 701670115, 
    701652729, 701430686, 701479498, 701630854, 701616623, 
    701670346, 701406191, 701420502, 701545902, 701572269, 
    701652705, 701660978, 701387056, 701493331, 701560865, 
    701669374, 701519533, 701506379, 701535342, 701446851, 
    701404477, 701556360, 701519679, 701519535, 701514112, 
    701443922, 701556355, 701649475, 701537676, 701656135, 
    701479876, 701518246, 701401775, 701540993, 701622446, 
    701661774, 701534887, 701620607, 701424067, 701402434, 
    701466553, 701401976, 701458552, 701662760, 701554777, 
    701532255, 701473258, 701450718, 701664788, 701519955, 
    701667069, 701550587, 701470181, 701631204, 701476443, 
    701685758, 701476443, 701679263
];

function testingPass() {

    nickInput = document.getElementById('USER-INPUT').value;
    passInput = document.getElementById('PASSWORD-INPUT').value;
    passInputNumber = Number(passInput);

    if (employeeNr.includes(passInputNumber)) {
        document.getElementById('HIDDEN-CONTAINER').classList.remove("hidden");
        document.getElementById('FORM-POPUP').style.display="none";
        document.getElementById('LOGIN-INFO').style.display="none";

        alert("Velkommen " + nickInput);
    } else {
        alert("Feil passord! Prøv på nytt eller be om riktig medlemsnummer fra de tillitsvalgte.")
        document.getElementById('PASSWORD-INPUT').value="";
        document.getElementById('USER-INPUT').value="";
    }
}


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