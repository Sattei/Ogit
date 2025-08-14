#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ogitdir = path.join(process.cwd(), ".ogit");

const command = process.argv[2];

const indexPath = path.join(ogitdir, "index");

function hashobject(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

// ogit init
if (command === "init") {
  console.log("Initializing ogit repository...");

  if (fs.existsSync(ogitdir)) {
    console.log("ogit already initialized.");
  } else {
    console.log("Creating .ogit repository...");

    fs.mkdirSync(ogitdir);
    fs.mkdirSync(path.join(ogitdir, "objects"));
    fs.mkdirSync(path.join(ogitdir, "refs"));
    fs.mkdirSync(path.join(ogitdir, "refs", "heads"));
    fs.writeFileSync(path.join(ogitdir, "index"), "");

    console.log("ogit repository initialized successfully!");
  }
}

// ogit add <filename>
else if (command === "add") {
  const filename = process.argv[3];
  if (!filename) {
    console.log("Usage: ogit add <filename>");
    process.exit(1);
  }

  const filepath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filepath)) {
    console.log(`File ${filename} does not exist.`);
    process.exit(1);
  }

  const content = fs.readFileSync(filepath);
  const hash = hashobject(content);
  const objectPath = path.join(ogitdir, "objects", hash);

  if (!fs.existsSync(objectPath)) {
    fs.writeFileSync(objectPath, content);
    console.log(`Added ${filename} to ogit.`);
  } else {
    console.log(`File ${filename} already added to ogit.`);
  }

  fs.appendFileSync(indexPath, `${filename} ${hash}\n`);

  console.log(`Added ${filename} to ogit index.`);
}

// ogit commit -m <message>
else if (command === "commit") {
  const messageFlag = process.argv[3];
  const message = process.argv[4];

  if (messageFlag !== "-m" || !message) {
    console.log("Usage: ogit commit -m <message>");
    process.exit(1);
  }

  if (!fs.existsSync(indexPath)) {
    console.log("Nothing to commit. Index File does not exist.");
    process.exit(1);
  }

  const indexContent = fs.readFileSync(indexPath, "utf8").trim();
  if (indexContent === "") {
    console.log("Nothing to commit. Index is empty.");
    process.exit(1);
  }

  const commitObject = {
    message: message,
    timeStamp: new Date().toISOString(),
    files: indexContent.split("\n").map((line) => {
      const [filename, hash] = line.trim().split(" ");
      return { filename, hash };
    }),
  };
  const serializedCommit = JSON.stringify(commitObject, null, 2);
  const commitHash = crypto
    .createHash("sha256")

    .update(serializedCommit)
    .digest("hex");
  const objectPath = path.join(ogitdir, "objects", commitHash);
  fs.writeFileSync(objectPath, serializedCommit);
  const headPath = path.join(ogitdir, "refs", "heads", "master");
  fs.writeFileSync(headPath, commitHash);

  fs.writeFileSync(indexPath, "");

  console.log(`Committes as ${commitHash} with message: "${message}"`);
}

//ogit log
else if (command === "log") {
  const headPath = path.join(ogitdir, "refs", "heads", "master");
  if (!fs.existsSync(headPath)) {
    console.log("No commits found");
    process.exit(1);
  }

  let currentHash = fs.readFileSync(headPath, "utf8").trim();

  while (currentHash) {
    const commitPath = path.join(ogitdir, "objects", currentHash);
    if (!fs.existsSync(commitPath)) {
      console.log(`Commit ${currentHash} not found.`);
      break;
    }

    const commitData = fs.readFileSync(commitPath, "utf8");
    const commitObject = JSON.parse(commitData);
    console.log(`Commit: ${currentHash}`);
    console.log(`Message: ${commitObject.message}`);
    console.log(`Timestamp: ${commitObject.timeStamp}`);
    console.log("----");

    break;
  }
}

// ogit status 

