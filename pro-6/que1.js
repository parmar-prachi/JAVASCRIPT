
const imageBank = [
    {
        img: "./images/img1.jpeg", caption: "✨ Sunkissed waves, peaceful days. ✨"
    },
    {
        img: "./images/img2.jpeg", caption: "⛰️ Majestic Mountain View ⛰️"
    },
    {
        img: "./images/img3.jpeg", caption: "🌙 City Lights at Night 🌙"
    },
    {
        img: "./images/img4.jpeg", caption: "🌊 Ocean Waves on the Shore 🌊"
    },
    {
        img: "./images/img5.jpeg", caption: "🌸 Spring painted in pink 🌸"
    },
    {
        img: "./images/img6.jpeg", caption: "🌻 Lost in the colors of the valley 🌻"
    },
    {
        img: "./images/img7.jpeg", caption: "🌿 Peace flows where the water falls 🌿"
    }
];


let currentIndex = 0;
let autoPlayInterval;
let isPlaying = false;

// DOM Elements

const imageEl = document.getElementById('slider-image');
const captionEl = document.getElementById('slider-caption');
const counterEl = document.getElementById('slide-counter');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const addBtn = document.getElementById('add-btn');
const autoplayBtn = document.getElementById('autoplay-btn');


const showSlide = (index) => {


    const currentImage = imageBank[index];
    const totalSlides = imageBank.length;

    imageEl.src = currentImage.img;
    captionEl.textContent = `Caption: ${currentImage.caption}`;
    counterEl.textContent = `Slide ${index + 1} of ${totalSlides}`;

    console.log(`Displaying Slide ${index + 1}: ${currentImage.caption}`);
};


const nextSlide = () => {

    if (currentIndex === imageBank.length - 1) {
        alert("This is the last slide");
        console.log("Attempted next slide, but already on the last one.");
        return;
    }


    currentIndex = (currentIndex + 1) % imageBank.length;
    showSlide(currentIndex);
    console.log("Navigated to next slide.");
};

const prevSlide = () => {

    if (currentIndex === 0) {
        alert("This is the first slide");
        console.log("Attempted previous slide, but already on the first one.");
        return;
    }


    currentIndex = (currentIndex === 0)
        ? imageBank.length - 1
        : currentIndex - 1;
    showSlide(currentIndex);
    console.log("Navigated to previous slide.");
};

const toggleAutoPlay = () => {
    if (isPlaying) {
        clearInterval(autoPlayInterval);
        autoplayBtn.textContent = 'Play Slideshow';
        console.log("Auto-play paused.");
        isPlaying = false;
    } else {

        autoPlayInterval = setInterval(nextSlide, 3000);

        autoplayBtn.textContent = 'Pause Slideshow';
        console.log("Auto-play started.");
        isPlaying = true;
    }
};

const addNewSlide = () => {
    const newUrlInput = document.getElementById('new-img-url');
    const newCaptionInput = document.getElementById('new-caption');

    const newUrl = newUrlInput.value.trim();
    const newCaption = newCaptionInput.value.trim();

    if (newUrl && newCaption) {
        const newSlide = {
            img: newUrl,
            caption: newCaption
        };

        // Add the new object to the end of the array

        imageBank.push(newSlide);


        newUrlInput.value = '';
        newCaptionInput.value = '';

        //  keeping the current image visible
        showSlide(currentIndex);

        console.log(`Added new image: ${newCaption}. Total slides: ${imageBank.length}`);
    } else {
        alert("Please enter both a URL and a Caption!");
    }
};


// --- Event Listeners 

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
addBtn.addEventListener('click', addNewSlide);
autoplayBtn.addEventListener('click', toggleAutoPlay);

// Display the very first slide when the page loads

showSlide(currentIndex);
console.log("Slider initialized.");


