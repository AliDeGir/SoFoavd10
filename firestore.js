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
async function fetchWithSnapshot() {
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
    console.log('Function engaged!')
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
            console.log(news);
            let contentHtml = `<div>${news.content}</div>`;
            
            // Iterate over the keys of the news object
            Object.keys(news).forEach(key => {
                // Check if the value is an array
                if (Array.isArray(news[key])) {
                    contentHtml += '<br>'; // Add line break before the nested list
                    contentHtml += '<ul style="margin-left: 20px;">'; // Apply margin-left to indent the nested list
                    news[key].forEach((subItem) => {
                        contentHtml += `<li>${subItem}</li>`; // Add each subContent item as a list item
                    });
                    contentHtml += '</ul>'; // End the list
                }
            });

            const li = `
                <li>
                    <div style="font-weight: bold">${news.header}</div><br>
                    ${contentHtml}
                </li>
                <br>`; // Add line break after each main list item
            html += li;
        });
        memberNewsToAdd.innerHTML = html;
    } catch (error) {
        console.error("Error iterating and adding HTML:", error);
    }
}

// Usage example:
async function fetchMessagesDb() {
    const filePath = "messagesApp/membersNews/membersNewsDB";
    const memberNewsToAdd = document.querySelector('#members-news');
    const querySnapshot = await getQuerySnapshot(filePath);
    if (querySnapshot) {
        iterateAddHtmlAsList(querySnapshot, memberNewsToAdd); // Pass "memberNewsToAdd" as input
    }
}

// async function fetchMessagesDb() {
//     try {
//         const querySnapshot = await getDocs(collection(db, "messagesApp/membersNews/membersNewsDB"));
//         const memberNewsToAdd = document.querySelector('#members-news');
//         console.log("Fetch DB engaged!")
//         let html = '';
//         querySnapshot.forEach((doc) => {
//             const news = doc.data();
//             console.log(news);
//             let contentHtml = `<div>${news.content}</div>`;
//             if (Array.isArray(news.subContent)) {
//                 contentHtml += '<br>'; // Add line break before the nested list
//                 contentHtml += '<ul style="margin-left: 20px;">'; // Start the list
//                 news.subContent.forEach((subItem) => {
//                     contentHtml += `<li>${subItem}</li>`; // Add each subContent item as a list item
//                 });
//                 contentHtml += '</ul>'; // End the list
//             }
//             const li = `
//                 <li>
//                     <div style="font-weight: bold">${news.header}</div><br>
//                     ${contentHtml}
//                 </li><br>
//             `;
//             html += li;
//         });
//         memberNewsToAdd.innerHTML = html;
//     } catch (error) {
//         console.error("Error getting documents:", error);
//     }
// }


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
        console.log(data);


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

export { fetchMessagesDb, addMessageDb, fetchWithSnapshot, fetchTableContent }