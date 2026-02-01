const cursor = document.getElementById("inverted-cursor");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

// Mouse Move Logic
document.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
});

// Scroll Highlighting Logic
window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 120) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});

window.addEventListener("scroll", () => {
    let current = "";
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Offset of 200px helps trigger the change before the section hits the very top
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        // Check if the link href matches the current section ID
        if (link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});