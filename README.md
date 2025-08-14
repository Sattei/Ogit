->Ogit – A Mini Git Implementation in Node.js

Ogit is a lightweight, educational version control tool inspired by Git.
It helps you understand how Git works under the hood by implementing basic commands like init, add, commit, and log using Node.js.

->Features

ogit init → Create a .ogit directory to store repo data.

ogit add <filename> → Stage a file by saving its content and hash.

ogit commit -m "<message>" → Save a commit with message, timestamp, and file hashes.

ogit log → View commit history.

ogit status → Show changes compared to the last commit.

->Installation

Clone the repository:

git clone https://github.com/Sattei/ogit.git
cd ogit


Install dependencies:

npm install


Link the CLI tool:

npm link

🚀 Usage
# Initialize repository
ogit init

# Add file to staging area
ogit add filename.txt

# Commit with message
ogit commit -m "Initial commit"

# View commit history
ogit log

->How It Works

.ogit/objects/ → Stores file contents & commits as hashed objects.

.ogit/refs/heads/master → Stores the latest commit hash.

.ogit/index → Staging area for file changes before commit.

->Why I Built This

This project is a learning experiment to understand Git's internals like object storage, commit tracking, and hashing — all in JavaScript.
