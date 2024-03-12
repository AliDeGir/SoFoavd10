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
                            <div class="collapsible-header">${headerValue}</div>
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
                        <div class="collapsible-header">${headerValue}</div>
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

// Usage example:
// Members news fetch
async function fetchMembersNews() {
    const filePath = "messagesApp/membersNews/membersNewsDB";
    const memberNewsToAdd = document.querySelector('#members-news');
    const querySnapshot = await getQuerySnapshot(filePath);
    if (querySnapshot) {
        iterateAddHtmlAsList(querySnapshot, memberNewsToAdd); // Pass "memberNewsToAdd" as input
    }
}

// Tariff fordeler fetch
async function fetchTariffFordelList() {
    const filePath = "messagesApp/medlemsfordelerDb/medlemsfordeler";
    const fordelerToAdd = document.querySelector('#tariffFordelerUl');
    const querySnapshot = await getQuerySnapshot(filePath);
    if (querySnapshot) {
        iterateAddHtmlAsList(querySnapshot, fordelerToAdd);
    }
}


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

// html build
fetchTableContent();
fetchTariffFordelList();

// intiate collapsible function
document.addEventListener('DOMContentLoaded', function() {
    const collapsibleElements = document.querySelectorAll('.collapsible');
    collapsibleElements.forEach(function(collapsibleElement) {
        collapsibleElement.addEventListener('click', function(event) {
            console.log('Header clicked!')
            // Check if the clicked element or its ancestor matches the .collapsible-header selector
            const header = event.target.closest('.collapsible-header');
            if (header) {
                // Find the corresponding collapsible-body
                const body = header.nextElementSibling;
                
                // Close any open collapsible-bodies
                const openBodies = document.querySelectorAll('.collapsible-body.open');
                openBodies.forEach(function(openBody) {
                    if (openBody !== body) {
                        openBody.classList.remove('open');
                    }
                });

                // Toggle the .open class on the body
                body.classList.toggle('open');
                // Stop the event from propagating further
                event.stopPropagation();
            }
        });
    });
});

// function initCollapsible() {
//     console.log("initCollapsible function called");
//     const headers = document.querySelectorAll('.collapsible-header');

//     headers.forEach(header => {
//         header.addEventListener('click', function() {
//             console.log("Header clicked");
//             const body = this.nextElementSibling;

//             if (body.classList.contains('open')) {
//                 body.classList.remove('open');
//                 body.style.maxHeight = '0'; // Ensure body collapses smoothly
//             } else {
//                 body.classList.add('open');
//                 body.style.maxHeight = body.scrollHeight + 'px'; // Expand body to its full height
//             }
//         });
//     });
// }


export { fetchMembersNews, addMessageDb, fetchMessages, fetchTableContent, fetchTariffFordelList }