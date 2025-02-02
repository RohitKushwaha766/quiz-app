# Web-Based Quiz App

## Overview
This project is a **Web-Based Quiz App** built using **HTML, CSS, and JavaScript**. It features a **15-minute timer** that starts when the quiz begins, and at the end, the **final score** is displayed. Initially, the project encountered a **CORS (Cross-Origin Resource Sharing) error** when fetching API data on localhost. To resolve this issue, a proxy was created, and a **PHP script** was deployed on **Hostinger** to act as a middleware for fetching the API data.

## Features
- Interactive UI built with **HTML, CSS, and JavaScript**.
- **15-minute timer** for completing the quiz.
- Displays **final score** at the end of the quiz.
- Fetches data from an external API.
- **CORS issue fixed** by using a PHP proxy.

## How the CORS Issue Was Fixed
1. A **PHP script** was created to act as a proxy.
2. The script fetches API data and returns it to the frontend.
3. The script was uploaded to **Hostinger**.
4. The **frontend fetches the API data** via the PHP script URL instead of directly accessing the external API.

## PHP Proxy Code
```php
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$url = "https://api.jsonserve.com/Uw5CrX"; 
$response = file_get_contents($url);
echo $response;
?>
```

## How to Use
1. Clone the repository:
   ```sh
   git clone https://github.com/RohitKushwaha766/quiz-app.git
   ```
2. Open `index.html` in a browser.
3. Update the JavaScript fetch request to use the hosted PHP proxy URL:
   ```js
   fetch('https://api.notesdrive.com/quiz-app.php')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
   ```
4. Run the project locally or deploy it on a server.

## Hosting Details
- **Frontend:** Localhost or any hosting provider.
- **Backend (Proxy):** Hosted on **Hostinger**.





