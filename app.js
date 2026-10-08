import { createInterface } from "readline";

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

async function fetchUserData(username) {
    if (!username) {
        console.log("Error: Username cannot be empty.");
        return false;
    }

    const token = process.env.GITHUB_TOKEN;

    const headers = {
        "User-Agent": "GitHub-Repo-Tracker"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const repoUrl = `https://api.github.com/users/${username}/repos`;
    const profileUrl = `https://api.github.com/users/${username}`;

    try {
        const [profileResponse, repoResponse] = await Promise.all([
            fetch(profileUrl, { headers }),
            fetch(repoUrl, { headers })
        ]);

        // Handle invalid username (404 Not Found)
        if (profileResponse.status === 404) {
            console.log(`Error: User '${username}' not found. Please check the username.`);
            return false;
        }

        // Handle rate limit or permission issues
        if (profileResponse.status === 403 || repoResponse.status === 403) {
            console.log("Error: GitHub API rate limit exceeded. Please try again later or provide a token.");
            return false;
        }

        // Handle other HTTP errors
        if (!profileResponse.ok || !repoResponse.ok) {
            console.log(`Error: Failed to fetch data (Status: ${profileResponse.status}/${repoResponse.status})`);
            return false;
        }

        const [profile, repositories] = await Promise.all([
            profileResponse.json(),
            repoResponse.json()
        ]);

        console.clear();
        console.log("Latest Data (" + new Date().toLocaleTimeString() + ")");
        console.log("Owner Details:");
        console.log("Name:", profile.name || "N/A");
        console.log("Username:", profile.login);
        console.log("Bio:", profile.bio || "No bio provided");
        console.log("Public Repositories:", profile.public_repos);

        console.log("\nRepositories:");
        // Handle user with no public repositories
        if (Array.isArray(repositories) && repositories.length > 0) {
            repositories.forEach(repo => {
                console.log(`- ${repo.name} (${repo.html_url})`);
                console.log(`  Description: ${repo.description || "No description"}`);
            });
        } else {
            console.log("This user has no public repositories.");
        }

        return true;
    } catch (error) {
        // Handle network/connection failure
        console.log("Network Error: Could not connect to GitHub API. Please check your internet connection.");
        return false;
    }
}

rl.question("Enter GitHub username: ", async function (username) {
    const trimmedUser = username.trim();
    rl.close();

    // Initial fetch
    const success = await fetchUserData(trimmedUser);

    // Only start interval if user exists and initial fetch was successful
    if (success) {
        console.log("\nRefreshing data every 60 seconds... (Press Ctrl+C to stop)");
        setInterval(async () => {
            await fetchUserData(trimmedUser);
        }, 60000);
    }
});
