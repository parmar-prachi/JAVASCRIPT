if (document.getElementById("chapters")) {
    fetch('https://vedicscriptures.github.io/chapters')
        .then(response => response.json())
        .then(data => {
            let cards = "";

            data.forEach(chap => {
                cards += `       
                
            <div class="col-md-6 mb-4">
            <div class="card chapter-card" onclick="openChapter(${chap.chapter_number})">
            <div class="card-body">
            <h6 class="card-subtitle mb-2 ">Chapter  ${chap.chapter_number}</h6>
            <h5 class="card-title mt-3 ">${chap.name}</h5>
            <p class="card-text mt-4">${chap.summary.hi.slice(0, 150)}...</p>
            
            <p class="card-text mt-4"> <i class="bi bi-list-ul me-2"></i>${chap.verses_count} Verses</p>
            </div>
            </div>
            </div>  
            `
            });
            document.getElementById("chapters").innerHTML = cards;
        })
}

function openChapter(chapterNo) {
    window.location.href = `chapter.html?no=${chapterNo}`;
}

if (document.getElementById("chapter")) {

    const params = new URLSearchParams(window.location.search);
    const chapterNo = params.get("no");


    fetch(`https://vedicscriptures.github.io/chapter/${chapterNo}`)
        .then(response => response.json())
        .then(async data => {

            document.getElementById("chapter").innerHTML = `
            <div class="col-12">
             <div class="subtitle">
            <ol class="breadcrumb">
                <li class="breadcrumb-item "><a href="./index.html" class="text-white">Home</a></li>
                <li class="breadcrumb-item active" aria-current="page"><a href="./chapters.html" class="text-white">Chapter : ${chapterNo}</a></li>
            </ol>
        </div>
         </div>
            <div class="chapter-detail pt-3 mt-5" style="border-radius:20px; background-color:#F5F0EA;">
            <h3>Chapter ${data.chapter_number}: ${data.name}</h3>
            <p>Total Verses: ${data.verses_count}</p>
            </div>
            <p class="pt-5">${data.summary.hi}</p>
           
            `;

            const versesBox = document.getElementById("verses");
            versesBox.innerHTML = "";

            for (let i = 1; i <= data.verses_count; i++) {
                fetch(`https://vedicscriptures.github.io/slok/${chapterNo}/${i}`)
                const response = await fetch(
                    `https://vedicscriptures.github.io/slok/${chapterNo}/${i}`
                );
                const verse = await response.json();

                versesBox.innerHTML += `
                       
                            <div class="verses-detail" onclick="openShlok(${chapterNo}, ${i})" style="cursor:pointer">
                            <h3>Verse ${i}</h3>
                            <p class="card-text ">${verse.tej.ht.slice(0, 150)}..</p>
                             </div>  
            `

            }
        });
}

function openShlok(chapterNo, slok) {
    window.location.href = `shlok.html?cno=${chapterNo}&sno=${slok}`;
}


if (document.getElementById("slok")) {

    const params = new URLSearchParams(window.location.search);
    const chapterNo = params.get("cno");
    const shlokNo = params.get("sno");

    fetch(`https://vedicscriptures.github.io/slok/${chapterNo}/${shlokNo}`)
        .then(response => response.json())
        .then(shlok => {

            document.getElementById("slok").innerHTML = `
             <div class="col-6" style="margin:20px auto;">
                <ol class="d-flex ">
                <li ><a href="./index.html"> Chapter > </a></li>
                <li ><a href="./chapter.html?no=${chapterNo}"> Chapter ${chapterNo} > </a></li>
                <li><a href="./shlok.html?sno=${shlokNo}"> Verse ${shlokNo}</a> </li>
                 </ol>
            <div class="shlok-detail pt-5">
                <p class="text-center mb-4" style="border-radius:20px;padding:20px; background-color:#F5F0EA;">Bhagavad
                    Gita: Chapter ${chapterNo}, Verse ${shlokNo}</p>
                <h3 class="pt-5 text-center pb-5"> ${shlok.slok}</h3>
                <h4 class="pt-2 pb-2 ">Translation</h4>
                <span >${shlok.siva.et}</span><br>
                <h4 class="pt-5 ">Commentary</h4>
                <p class=" pb-5">${shlok.siva.ec}</p>
            </div>


        </div>


            `;
        });

}

function subscribeUser() {
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userMail").value.trim();

    if (name == "" || email == "") {
        alert("Please Fill All Fields");
        return;
    }

    let subscriber = JSON.parse(localStorage.getItem("subscribers")) || [];

    const userData = {
        name: name,
        email: email
    };
    subscriber.push(userData);

    localStorage.setItem("subscribers", JSON.stringify(subscriber));

    document.getElementById("userName").value = "";
    document.getElementById("userMail").value = "";

    alert("Subscription Successful ! ");

}
