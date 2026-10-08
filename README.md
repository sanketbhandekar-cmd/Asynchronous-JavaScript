# GitHub Repository Tracker

## Task-by-Task Implementation Summary

### Task 1 — Fetch Public Repositories
* Set up user input handling using Node.js `readline` module.
* Accepted a GitHub username interactively from the terminal.
* Created a dynamic URL targeting GitHub's REST API endpoint: `https://api.github.com/users/{username}/repos`.
* Configured proper request headers including a `User-Agent` header (`GitHub-Repo-Tracker`) to satisfy GitHub API requirements.
* Used `fetch()` with `await` to asynchronously request repository data.
* Parsed the received response into JSON format using `response.json()`.
* Iterated through the list of public repositories and displayed each repository's name and URL in the console.

### Task 2 — Fetch Owner Profile Information
* Added a separate GitHub Users API request to fetch the repository owner's profile information.
* Created a `profileUrl` dynamically using the entered GitHub username (`https://api.github.com/users/{username}`).
* Reused the GitHub Personal Access Token stored in the `GITHUB_TOKEN` environment variable if available.
* Added the authorization header to the profile API request for authenticated access.
* Used `fetch()` with `await` to asynchronously retrieve the owner's profile response.
* Parsed the profile API response using `response.json()` to obtain usable JavaScript data.
* Displayed owner details including name, username, bio and public repositories count alongside repository information.
* Optimized network requests by running both profile and repository requests concurrently using `Promise.all()`.

### Task 3 — Refresh Data Automatically
* Encapsulated the fetching and display logic into a reusable asynchronous function (`fetchUserData`).
* Executed an initial fetch immediately when the username is entered.
* Scheduled automatic re-fetching every 60 seconds (60,000 milliseconds) using `setInterval()`.
* Added `console.clear()` before each refresh to provide a clean, real-time dashboard display in the terminal.
* Added a live timestamp to indicate when the displayed data was last updated.
* Allowed continuous tracking until stopped manually by the user using `Ctrl + C`.

### Task 4 — Error Handling
* Added input validation to check for empty or whitespace-only usernames.
* Wrapped API network requests inside a `try...catch` block to capture unexpected network drops or offline errors.
* Handled invalid GitHub usernames by checking for HTTP status `404 Not Found` and displaying a user-friendly error message.
* Handled GitHub API rate-limiting by checking for HTTP status `403` and notifying the user.
* Handled accounts with no public repositories gracefully by checking if the repositories array is empty and displaying an appropriate message.
* Prevented the automatic refresh timer from starting if the initial fetch fails due to an invalid username or error.

### Task 5 — Async/Await Implementation
* Structured all asynchronous operations using modern `async/await` syntax instead of callback chains.
* Combined multiple asynchronous calls cleanly using `Promise.all()` to fetch profile and repository data simultaneously.
* Handled errors with structured `try...catch` blocks for clean, readable error flows.
* Configured the project with ES Module (`import`) syntax and a `package.json` configuration.

---


