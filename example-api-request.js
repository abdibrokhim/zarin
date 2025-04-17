// // Insert your AIML API Key instead of <YOUR_AIMLAPI_KEY>:
// const API_KEY = '';
// const API_URL = 'https://api.aimlapi.com/v1/chat/completions';

// async function completeChat() {
//     const requestBody = {
//         model: "bagoodex/bagoodex-search-v1",
//         messages: [
//             {
//                 role: "user",
//                 content: "how to make a slingshot"
//             }
//         ]
//     };

//     try {
//         const response = await fetch(API_URL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${API_KEY}`
//             },
//             body: JSON.stringify(requestBody)
//         });

//         const data = await response.json();
//         console.log(data.choices[0].message.content);
//     } catch (error) {
//         console.error("Error fetching completion:", error);
//     }
// }

// // Run the function
// completeChat();
