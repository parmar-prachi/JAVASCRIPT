/* FETCH FUNCTION */

async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}
/*  SUBSCRIBE FUNCTION */

function subscribeUser() {
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userMail").value.trim();

    if (name === "" || email === "") {
        alert("Please fill all fields");
        return;
    }

    let subscribers =
        JSON.parse(localStorage.getItem("subscribers")) || [];

    subscribers.push({ name, email });

    localStorage.setItem(
        "subscribers",
        JSON.stringify(subscribers)
    );

    document.getElementById("userName").value = "";
    document.getElementById("userMail").value = "";

    alert("Subscription Successful!");
}

/* FAQ SECTION (index.html) */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
        faqItems.forEach(faq => {
            if (faq !== item) {
                faq.classList.remove("active");
                faq.querySelector(".icon").textContent = "+";
            }
        });

        item.classList.toggle("active");

        const icon = item.querySelector(".icon");
        icon.textContent = item.classList.contains("active") ? "×" : "+";
    });
});


/* CHAPTER LIST PAGE (chapters.html) */

const chaptersBox = document.getElementById("chapters");

if (chaptersBox) {
    showAllChapters();
}

async function showAllChapters() {
    const chapters = await fetchData("https://vedicscriptures.github.io/chapters");
    let output = "";

    chapters.forEach(chapter => {
        output += `
        <div class="col-md-6 mb-4">
            <div class="card chapter-card"
                 onclick="openChapterPage(${chapter.chapter_number})">
                <div class="card-body">
                    <h6>Chapter ${chapter.chapter_number}</h6>
                    <h5 class="mt-3">${chapter.name}</h5>
                    <p class="mt-4">
                        ${chapter.summary.hi.slice(0, 150)}...
                    </p>
                    <p class="mt-4">
                        <i class="bi bi-list-ul me-2"></i>
                        ${chapter.verses_count} Verses
                    </p>
                </div>
            </div>
        </div>`;
    });

    chaptersBox.innerHTML = output;
}

function openChapterPage(number) {
    window.location.href = `chapter.html?no=${number}`;
}

/* SINGLE CHAPTER PAGE (chapter.html)*/
const chapterBox = document.getElementById("chapter");
const versesBox = document.getElementById("verses");

if (chapterBox) {
    showSingleChapter();
}

async function showSingleChapter() {
    const params = new URLSearchParams(window.location.search);
    const chapterNo = params.get("no");

    const chapter = await fetchData(
        `https://vedicscriptures.github.io/chapter/${chapterNo}`
    );

    chapterBox.innerHTML = `
        <div class="col-12">
            <div class="subtitle">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="./index.html" class="text-white">Home</a>
                    </li>
                    <li class="breadcrumb-item active">
                        <a href="./chapters.html" class="text-white">
                            Chapter : ${chapterNo}
                        </a>
                    </li>
                </ol>
            </div>
        </div>

        <div class="chapter-detail pt-3 mt-5"
             style="border-radius:20px; background:#F5F0EA;">
            <h3>
                Chapter ${chapter.chapter_number} : ${chapter.name}
            </h3>
            <p>Total Verses : ${chapter.verses_count}</p>
        </div>

        <p class="pt-5">${chapter.summary.hi}</p>
    `;

    versesBox.innerHTML = "";

    for (let i = 1; i <= chapter.verses_count; i++) {
        const verse = await fetchData(
            `https://vedicscriptures.github.io/slok/${chapterNo}/${i}`
        );

        versesBox.innerHTML += `
            <div class="verses-details"
                 style="cursor:pointer"
                 onclick="openVersePage(${chapterNo}, ${i})">
                <h3>Verse ${i}</h3>
                <p>${verse.tej.ht.slice(0, 150)}...</p>
            </div>
        `;
    }
}

function openVersePage(chapterNo, verseNo) {
    window.location.href =
        `shlok.html?cno=${chapterNo}&sno=${verseNo}`;
}

/* SHLOK PAGE (shlok.html) */
const shlokBox = document.getElementById("slok");

if (shlokBox) {
    showShlok();
}

async function showShlok() {
    const params = new URLSearchParams(window.location.search);
    const chapterNo = parseInt(params.get("cno"));
    const verseNo = parseInt(params.get("sno"));

    const shlok = await fetchData(
        `https://vedicscriptures.github.io/slok/${chapterNo}/${verseNo}`
    );

    shlokBox.innerHTML = `
    
        <div class="shlok-wrapper">

            <!-- Breadcrumb -->
            <nav class="breadcrumb-center">
                <a href="index.html">Home</a> /
                <a href="chapter.html?no=${chapterNo}">
                    Chapter ${chapterNo}
                </a> /
                <strong>Verse ${verseNo}</strong>
            </nav>

            <!-- Verse -->
            <div class="verse-box">
                <p class="verse-title">
                    Bhagavad Gita — Chapter ${chapterNo}, Verse ${verseNo}
                </p>
                <h3 class="verse-text">
                    ${shlok.slok}
                </h3>
            </div>

            <!-- Translation -->
            <div class="content-box">
                <h4>Translation</h4>
                <p>${shlok.siva.et}</p>
            </div>

            <!-- Commentary -->
            <div class="content-box">
                <h4>Commentary</h4>
                <p>${shlok.siva.ec}</p>
            </div>

            <!-- Navigation -->
            <div class="nav-buttons">
                <button onclick="goPrev(${chapterNo}, ${verseNo})">
                    ← Previous
                </button>
                <button onclick="goNext(${chapterNo}, ${verseNo})">
                    Next →
                </button>
            </div>

        </div>
    `;
}

// Previous : 

function goPrev(chapter, verse) {
    if (verse > 1) {
        window.location.href = `shlok.html?cno=${chapter}&sno=${verse - 1}`;
    }
}
// next :

function goNext(chapter, verse) {
    window.location.href = `shlok.html?cno=${chapter}&sno=${verse + 1}`;
}

