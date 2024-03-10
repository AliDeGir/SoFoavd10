// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
// Function to load Tawk.to script
function loadTawkTo() {
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/65d7be4a9131ed19d9707a09/1hn9bull8';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
}

// Function to store version number in local storage
function storeVersion(version) {
        localStorage.setItem('websiteVersion', version);
    }
  
  // Function to check if website version has been updated
  function checkAndUpdateVersion() {
        const currentVersion = '2'; // Change this to the current version of your website
        const storedVersion = localStorage.getItem('websiteVersion');
    
    if (storedVersion === null) {
        // If no version is stored, store the current version
        storeVersion(currentVersion);
        alert('New information availible!')
    } else if (storedVersion !== currentVersion) {
        // If stored version is different from current version, alert the user and update the stored version
        alert('New information availible!');
        storeVersion(currentVersion);
    }
}

checkAndUpdateVersion();

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