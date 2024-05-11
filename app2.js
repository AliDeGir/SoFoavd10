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

function calculateSalary() {
    // Get the input values
    const salary = parseFloat(document.getElementById("salary").value);
    const year = document.getElementById("year").value;
    const unionDues = salary * 0.019;
    const taxDeduction = unionDues * 0.3;
    // Perform any processing with the salary and chosen year
    // For demonstration, let's say we simply multiply the salary by 1.1 (10% increase) if it's for 2024

    let yearIncrease;

    if (year === "2023") {
        yearIncrease = 1700 * 11.1;
    } else if (year === "2024") {
        yearIncrease = 1700 * 7.6;
    } else {
        yearIncrease = "Invalid year"; // Just in case
    }

    let result = taxDeduction + yearIncrease - unionDues;

    document.getElementById("unionDues").innerHTML = `${unionDues.toFixed(2)} kr`;
    document.getElementById("taxDeduction").innerHTML = `${taxDeduction.toFixed(2)} kr`;
    document.getElementById("yearIncrease").innerHTML = `${yearIncrease.toFixed(2)} kr`;
    document.getElementById("totalResult").innerHTML = `${result.toFixed(2)} kr`;
}