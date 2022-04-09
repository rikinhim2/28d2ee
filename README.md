# Messenger

A one-to-one realtime chat app.

## Working inside a Cloud Environment
### Environment Setup
This repository supports Gitpod, so you can quickly setup your dev environment in the cloud by opening `https://gitpod.io/#https://github.com/<your-username>/<your-repo-name>` in your browser. A Gitpod workspace looks almost identical to Visual Studio Code.
![gitpod-demo](https://user-images.githubusercontent.com/8978815/154584026-8d252528-869a-4587-8387-5db0fb6213b6.png)
When you open a Gitpod page,
- Setup scripts will be automatically run in two integrated terminals - one for backend and the other for frontend.
- You can find Remote Explorer extension on the left edge. This extension shows the list of open ports and lets you connect to those ports by clicking the browser icon.

All changes you make inside this Gitpod workspace remains in the cloud even after you close the tab. You can access your existing workspaces on [Gitpod dashboard](https://gitpod.io/workspaces), and resume your work by opening the workspace again.

### Using Git inside Gitpod
You have full access to `git` CLI within Gitpod terminal, and Visual Studio Code's git integration is available too if your prefer GUI. You would need to create a new branch and push it in order to open a PR on GitHub. Some common commands are listed below:
- `git checkout <branch-name>`: switch to a specific branch.
- `git checkout -b <branch-name>`: create a new branch.
- `git push`: push changes to the remote repository (GitHub in this case).

## Local Setup

**Note:** these setup steps are not necessary when running the code on GitPod. They are only necessary when running the project on your local machine.

Create the PostgreSQL database (these instructions may need to be adapted for your operating system):

```
psql
CREATE DATABASE messenger;
\q
```

Alternatively, if you have docker installed, you can use it to spawn a postgres instance on your machine:

```
docker run -it -p 5432:5432 -e POSTGRES_DB=<database-name> -e POSTGRES_USER=<database-username> -e POSTGRES_PASSWORD=<database-password> postgres -c log_statement=all
```

Update db.js to connect with your local PostgreSQL set up. The [Sequelize documentation](https://sequelize.org/master/manual/getting-started.html) can help with this.

Create a .env file in the server directory and add your session secret (this can be any string):

```
SESSION_SECRET = "your session secret"
```

In the server folder, install dependencies and then seed the database:

```
cd server
npm install
npm run seed
```

In the client folder, install dependencies:

```
cd client
npm install
```

### Running the Application Locally

In one terminal, start the front end:

```
cd client
npm start
```

In a separate terminal, start the back end:

```
cd server
npm run dev
```

## How to Run E2E Tests

1. Seed the database with `npm run seed` in `server` directory.
1. Start the backend server with `npm run dev` in `server` directory.
1. Start the frontend server with `npm start` in `client` directory.
1. Open Cypress dashboard with `npx cypress open` in `client` directory.
1. Click on the test suite to run (e.g. `auth.spec.js`).

#### Notes

- You need to seed the database before each run. Because E2E test cases writes data to
  the actual database, re-seeding is necessary to assure consistent test results.
- The E2E tests are not comprehensive.
  There is a test for the authentication pages that should pass with the starting code,
  and some tests for some of the functionality for some of the tickets you will be assigned.
- When you push your changes to GitHub, E2E tests are automatically executed on GitHub Actions.
  You can find test results under Pull request > Checks > test > Cypress (see screenshots below).

![image](https://user-images.githubusercontent.com/8978815/136117299-b45a61ce-0b5c-495f-b572-05ad80b78a28.png)
![image](https://user-images.githubusercontent.com/8978815/136119935-4b941f87-0015-48c5-b93e-5bd0bcbbd64b.png)
