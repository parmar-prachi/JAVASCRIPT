let results = [];

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
// password 

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hash = await crypto.subtle.digest("SHA-256", data);

    let finalHash = "";
    const bytes = new Uint8Array(hash);

    for (let b of bytes) {
        finalHash += b.toString(16).padStart(2, "0");
    }

    return finalHash;
}

/* LOCAL STORAGE HELPERS  */

function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* SIGNUP */

async function signup(e) {
    e.preventDefault();

    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    if (name === "" || email === "" || password === "") {
        alert("All fields are required");
        return;
    }

    const users = getData("users");

    for (let u of users) {
        if (u.email === email) {
            alert("Email already exists");
            return;
        }
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: await hashPassword(password)
    };

    users.push(newUser);
    saveData("users", users);

    alert("Signup successful");
    location.href = "index.html";
}

/* LOGIN */

async function login(e) {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = await hashPassword(loginPassword.value);

    const users = getData("users");
    let foundUser = null;

    for (let u of users) {
        if (u.email === email && u.password === password) {
            foundUser = u;
            break;
        }
    }

    if (!foundUser) {
        alert("Invalid email or password");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    location.href = "dashboard.html";
}

/* AUTH PROTECTION */

if (location.pathname.includes("dashboard.html") && !currentUser) {
    location.href = "index.html";
}

/* RESULTS LOGIC */

function loadResults() {
    results = getData("results");
    renderResults();
}

function addResult(e) {
    e.preventDefault();

    const student = studentName.value.trim();
    const subjectName = subject.value.trim();
    const scoreValue = score.value;
    const dateValue = date.value;

    if (student === "" || subjectName === "" || scoreValue === "") {
        alert("Please fill all fields");
        return;
    }

    const newResult = {
        id: Date.now(),
        userId: currentUser.id,
        student: student,
        subject: subjectName,
        score: Number(scoreValue),
        date: dateValue
    };

    results.push(newResult);
    saveData("results", results);

    e.target.reset();
    renderResults();
}

function editResult(id) {
    for (let r of results) {
        if (r.id === id && r.userId === currentUser.id) {
            const newScore = prompt("Enter new score", r.score);
            if (newScore !== null) {
                r.score = Number(newScore);
                saveData("results", results);
                renderResults();
            }
            break;
        }
    }
}

function deleteResult(id) {
    const newResults = [];

    for (let r of results) {
        if (r.id !== id) {
            newResults.push(r);
        }
    }

    results = newResults;
    saveData("results", results);
    renderResults();
}

/* DISPLAY RESULTS  */

function renderResults() {
    const searchText = searchInput.value.toLowerCase();
    const selectedSubject = filterSubject.value;

    resultList.innerHTML = "";
    filterSubject.innerHTML = `<option value="">All Subjects</option>`;

    let userResults = [];

    for (let r of results) {
        if (r.userId === currentUser.id) {
            userResults.push(r);
        }
    }

    // subject dropdown fill

    const subjects = [];

    for (let r of userResults) {
        if (!subjects.includes(r.subject)) {
            subjects.push(r.subject);
        }
    }

    for (let sub of subjects) {
        const opt = document.createElement("option");
        opt.value = sub;
        opt.textContent = sub;
        if (sub === selectedSubject) opt.selected = true;
        filterSubject.appendChild(opt);
    }

    // search filter

    if (searchText !== "") {
        userResults = userResults.filter(r =>
            r.student.toLowerCase().includes(searchText) ||
            r.subject.toLowerCase().includes(searchText)
        );
    }


    // subject filter
    if (selectedSubject !== "") {
        userResults = userResults.filter(r => r.subject === selectedSubject);
    }

    // display list

    for (let r of userResults) {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";

        li.innerHTML = `
            <div>
                <strong>${r.student}</strong><br>
                ${r.subject} | Score: ${r.score} | ${r.date || ""}
            </div>
            <div>
                <button class="btn btn-warning btn-sm me-1" onclick="editResult(${r.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteResult(${r.id})">Delete</button>
            </div>
        `;

        resultList.appendChild(li);
    }
}

/* LOGOUT */

function logout() {
    localStorage.removeItem("currentUser");
    location.href = "index.html";
}

/* INITIAL LOAD */

if (currentUser && document.getElementById("resultList")) {
    loadResults();
}
