function openForm() {
    document.getElementById('FORM-POPUP').style.visibility= "visible";
}
function closeForm() {
    document.getElementById('FORM-POPUP').style.visibility= "hidden";
}
window.onbeforeunload = function() {
    window.scrollTo(0, 0);
}
const imgs = document.querySelectorAll('.slipp-img img');
const fullPage = document.querySelector('#fullpage');
const mainPage = document.querySelector('.mainDiv');

imgs.forEach(img => {
  img.addEventListener('click', function() {
    fullPage.style.backgroundImage = 'url(' + img.src + ')';
    fullPage.style.display = 'block';
  });
});

function openFullscreen() {
    var img = event.target;
    var fullScreenDiv = document.createElement("div");
    fullScreenDiv.classList.add("fullscreen");
    fullScreenDiv.onclick = closeFullscreen;
    var imgClone = img.cloneNode(true);
    fullScreenDiv.appendChild(imgClone);
    document.body.appendChild(fullScreenDiv);
    document.body.style.overflow = "hidden"; /* disable scrolling in background */
}

function closeFullscreen() {
    var fullScreenDiv = document.querySelector(".fullscreen");
    fullScreenDiv.parentNode.removeChild(fullScreenDiv);
    document.body.style.overflow = "auto"; /* enable scrolling again */
}