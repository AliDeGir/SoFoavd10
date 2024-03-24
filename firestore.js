import { firebaseConfig } from "./configFB.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    query, 
    getDoc, 
    getDocs, 
    addDoc, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// snapshot listener for chat
async function fetchMessages() {
    const toDisplay = document.querySelector('#display-data');
    try {
        const unsub = onSnapshot(collection(db, "messagesApp/messages/messagesDB"), (snapshot) => {
            let messagesArray = [];
            snapshot.docs.forEach(doc => {
                const messages = doc.data();
                messagesArray.push({
                    id: doc.id,
                    timeStamp: messages.timeStamp,
                    alias: messages.alias,
                    content: messages.content
                });
            });

            // Sort messages by timestamp
            messagesArray.sort((a, b) => a.timeStamp - b.timeStamp);

            let html = '';
            messagesArray.forEach(message => {
                const date = new Date(message.timeStamp);
                const localDate = date.toLocaleDateString();
                const localTime = date.toLocaleTimeString([], { timeStyle: 'short' });

                const li = `
                <li>
                    <div style="color: gray; font-size: 10px">${localDate}-${localTime}</div>
                    <div><span style="color: orange">${message.alias}: </span><i>${message.content}</i></div>
                </li><br>
                `;
                html += li;
            });

            toDisplay.innerHTML = html;
        });

        // Cleanup function to unsubscribe from the Firestore listener
        return () => {
            unsub();
        };
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// add new comment to DB function
async function addMessageDb() {
    const commentInput = document.querySelector('#comment-input').value;
    const aliasInput = document.querySelector('#alias-input').value;
    const user = auth.currentUser;
    const uid = user.uid;
    const doqref = await addDoc(collection(db, "messagesApp/messages/messagesDB"), {
        content: commentInput,
        timeStamp: Date.now(),
        userId: uid,
        alias: aliasInput
    });
    document.querySelector('#comment-input').value = "";
}


// getting data from firestore members news for website static html
// Function to get query snapshot for the given file path
async function getQuerySnapshot(filePath) {
    try {
        const querySnapshot = await getDocs(collection(db, filePath));
        return querySnapshot;
    } catch (error) {
        console.error("Error getting query snapshot:", error);
        return null;
    }
}

// Function to iterate over query snapshot and add to HTML as list
function iterateAddHtmlAsList(querySnapshot, memberNewsToAdd) {
    try {
        let html = '';
        querySnapshot.forEach((doc) => {
            const news = doc.data();

            // Check if news is an array
            if (Array.isArray(news)) {
                // Iterate over each object in the news array
                news.forEach((item) => {
                    // Extract header and content values from the current object
                    const headerValue = item.header;
                    const contentValue = item.content;
                    let subContentHtml = '';

                    // Iterate over the keys of the item object
                    Object.keys(item).forEach((key) => {
                        // Check if the value is an array
                        if (Array.isArray(item[key])) {
                            // Iterate over the array and construct HTML for sublist
                            subContentHtml += '<ul>';
                            item[key].forEach((subItem) => {
                                subContentHtml += `<li>${subItem}</li>`;
                            });
                            subContentHtml += '</ul>';
                        }
                    });

                    // Create collapsible HTML structure for each item
                    const collapsibleHtml = `
                        <li>
                            <div class="collapsible-header"><h4>${headerValue}</h4></div>
                            <div class="collapsible-body">
                                <p>
                                    ${contentValue}
                                    ${subContentHtml}
                                </p>
                            </div>
                        </li>
                    `;

                    html += collapsibleHtml;
                });
            } else {
                // If news is not an array, assume it's a single object
                const headerValue = news.header;
                const contentValue = news.content;
                let subContentHtml = '';

                // Iterate over the keys of the news object
                Object.keys(news).forEach((key) => {
                    // Check if the value is an array
                    if (Array.isArray(news[key])) {
                        // Iterate over the array and construct HTML for sublist
                        subContentHtml += '<ul>';
                        news[key].forEach((subItem) => {
                            subContentHtml += `<li>${subItem}</li>`;
                        });
                        subContentHtml += '</ul>';
                    }
                });

                const collapsibleHtml = `
                    <li>
                        <div class="collapsible-header"><h4>${headerValue}</h4></div>
                        <div class="collapsible-body">
                            <p>
                                ${contentValue}
                                ${subContentHtml}
                            </p>
                        </div>
                    </li>
                `;

                html += collapsibleHtml;
            }
        });

        // Set the HTML content to the memberNewsToAdd element
        memberNewsToAdd.innerHTML = html;

        
    } catch (error) {
        console.error("Error iterating and adding HTML:", error);
    }
}



// Generic function to fetch document data from Firestore
function getDocData(filePath, key) {
    const docRef = doc(db, filePath);

    return getDoc(docRef)
        .then((docSnap) => {
            const data = docSnap.data();
            return key ? data[key] : data; // Return the specified key or the entire data object
        })
        .catch((error) => {
            console.error("Error getting document:", error);
            throw error; // Re-throw the error for further handling if needed
        });
}




// Usage examples below:


// Usage for fetching photo URL
function photoLoad(path, divToAdd) {
    getDocData(path, 'url')
    .then((url) => {
        // console.log("Photo URL:", url);
        let html = `<img src="${url}">`;
        divToAdd.innerHTML = html;
    })
    .catch((error) => {
        console.error("Error fetching photo URL:", error);
    });
}

// Usage for fetching contact info
function contactInfoLoad(path, divToAdd, name) {
    getDocData(path)
    .then((contactData) => {
        // console.log("Contact Info:", contactData);
        let html = `<h2 class="notranslate">${name}</h2><p>${contactData.title}</p><br><br>${contactData.links}`;
        divToAdd.innerHTML = html;
    })
    .catch((error) => {
        console.error("Error fetching contact info:", error);
    });
}



// Members news fetch
async function fetchMembersNews() {
    const filePath = "messagesApp/membersNews/membersNewsDB";
    const memberNewsToAdd = document.querySelector('#members-news');
    const querySnapshot = await getQuerySnapshot(filePath);
    if (querySnapshot) {
        iterateAddHtmlAsList(querySnapshot, memberNewsToAdd); // Pass "memberNewsToAdd" as input
    }
}


// FROM CHATGPT!!
// Function to fetch data and add to HTML element
async function fetchDataAndAddToList(filePath, elementSelector) {
    const querySnapshot = await getQuerySnapshot(filePath);
    if (querySnapshot) {
        const elementToAdd = document.querySelector(elementSelector);
        iterateAddHtmlAsList(querySnapshot, elementToAdd);
    }
}

// Array of objects containing fetch information
const fetchListOperations = [
    { filePath: "messagesApp/medlemsfordelerDb/medlemsfordeler", elementSelector: '#tariffFordelerUl' },
    { filePath: "messagesApp/landingPageDb/landingPage", elementSelector: '#landing-page' },
    { filePath: "messagesApp/riksavtalenDb/riksavtalen", elementSelector: '#riksavtaler' },
    { filePath: "messagesApp/newsPublicDb/newsPublic", elementSelector: '#nyheter' }
];

const fetchContactOperations = [
    { filePath: "messagesApp/contactDb/contact/Ali Degirmenci", elementSelector: '#contact-info-ali' , name: 'Ali Degirmenci'},
    { filePath: "messagesApp/contactDb/contact/Marina Fedjajeva", elementSelector: '#contact-info-marina', name: 'Marina Fedjajeva' },
    { filePath: "messagesApp/contactDb/contact/Salwa Zakaria", elementSelector: '#contact-info-salwa', name: 'Salwa Zakaria' }
];

const fetchPhotoOpreations = [
    { filePath: "messagesApp/photosDb/photos/raoe5QY36fWZgHVsg0qZ", elementSelector: '#contact-img1' },
    { filePath: "messagesApp/photosDb/photos/ZjNylCkih0dUb0lhrRas", elementSelector: '#contact-img2' }
];

// Function to initiate fetch operations
async function initiateFetchOperations() {
    for (const { filePath, elementSelector } of fetchListOperations) {
        await fetchDataAndAddToList(filePath, elementSelector);
        
    }
    for (const {filePath, elementSelector} of fetchPhotoOpreations) {
        await photoLoad(filePath, document.querySelector(elementSelector));
    }
    for (const {filePath, elementSelector, name} of fetchContactOperations) {
        await contactInfoLoad(filePath, document.querySelector(elementSelector), name);
    }
}

// Call the function to initiate fetch operations
initiateFetchOperations();




// getting data for table creation
async function fetchTableContent() {
    try {
        const querySnapshot = await getDocs(collection(db, "messagesApp/tableContent/tableArrays"));
        const data = [];
        querySnapshot.forEach((doc) => {
            // Push each document data to the data array
            // data.push({ id: doc.id, ...doc.data() });
            data.push(doc.data());
            // console.log(doc.data())
        });
        // Function to generate HTML table
        function generateTable(array) {
            const tableDisplay = document.querySelector('#table-div');
            let tableHTML = '<table class="custom-table" border="1">';

            // Add table header (manually set header row)
            tableHTML += '<thead><tr>';
            tableHTML += `<th>Med tariffavtale</th>`;
            tableHTML += `<th>Uten tariffavtale</th>`;
            tableHTML += '</tr></thead>';

            // Add table body (remaining rows)
            tableHTML += '<tbody>';

            // Iterate through the array
            array.forEach((item) => {
                // Extract row name and column values
                const rowName = Object.keys(item)[0];
                const columns = item[rowName];

                // Add row to the table
                tableHTML += '<tr>';

                // Add columns to the row
                columns.forEach((column) => {
                    tableHTML += `<td>${column}</td>`;
                });

                // Close row tag
                tableHTML += `</tr>`;
            });
            tableHTML += '</tbody>';

            // Close table tag
            tableHTML += '</table>';
            tableDisplay.innerHTML = tableHTML;

            return tableHTML;
        }

        // Example usage
        const table = generateTable(data);
        // console.log(table); // Output the generated HTML table

        return data;
        
    } catch (error) {
        console.error("Error getting documents:", error);
    }
}

fetchTableContent();


// intiate collapsible function
document.addEventListener('DOMContentLoaded', function() {
    const collapsibleElements = document.querySelectorAll('.collapsible');

    collapsibleElements.forEach(collElement => {
        collElement.addEventListener('click', event => {
            const header = event.target.closest('.collapsible-header');
            const body = header.nextElementSibling;
            const pHeight = body.querySelector("p").offsetHeight;
            const uHeight = body.querySelector("ul") ? body.querySelector("ul").offsetHeight : 0;
            const totalHeight = pHeight + uHeight;

            if (body.clientHeight) {
                body.style.height = 0;
            } else {
                document.querySelectorAll('.collapsible-body').forEach(el => el.style.height = 0);
                body.style.height = totalHeight + "px";
            }
        });
    });
})


// THIS IS A TEST - NOT MODIFIED TO FUNCTION YET!!!
// Function to load data for static web app
function loadDataForApp() {
    // Define paths for fetching data
    const photoPath = 'photoPath';
    const contactPath = 'contactPath';

    // Fetch data using promises
    const photoPromise = getDocData(photoPath, 'url');
    const contactPromise = getDocData(contactPath);

    // Wait for all promises to resolve
    return Promise.all([photoPromise, contactPromise])
        .then(([photoUrl, contactData]) => {
            // Process the fetched data
            console.log("Photo URL:", photoUrl);
            console.log("Contact Info:", contactData);

            // Return processed data if needed
            return { photoUrl, contactData };
        })
        .catch((error) => {
            console.error("Error loading data for app:", error);
            throw error; // Re-throw the error for further handling if needed
        });
}



export { fetchMembersNews, addMessageDb, fetchMessages }