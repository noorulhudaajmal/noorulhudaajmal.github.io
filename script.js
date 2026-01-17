function animate_tag() {
    gsap.fromTo("#first-tag",
        { opacity: 1 },
        {
            opacity: 0,
            duration: 10,
            scrollTrigger: {
                trigger: ".home",
                start: "top top",
                end: "bottom top",
                scrub: true,
                onUpdate: self => {
                    if (self.direction === 1) {
                        gsap.to("#first-tag", { opacity: 0 });
                        gsap.to("#second-tag", { opacity: 0 });
                    } else {
                        gsap.to("#first-tag", { opacity: 1, duration: 2 });
                        gsap.to("#second-tag", { opacity: 1, duration: 2 });
                    }
                }
            }
        }
    );
};

animate_tag();

function show_menu() {
    var menuButton = document.querySelector(".ri-menu-fill");
    var closeMenuButton = document.querySelector(".ri-close-large-fill");
    var fullDiv = document.getElementById('menu-div');

    // Timeline for menu and links
    var tl = gsap.timeline({ paused: true, reversed: true });

    // Animate menu div to slide in
    tl.to("#menu-div", {
        right: "0%",
        duration: 0.5,
        ease: "power2.out"
    })
    // Animate menu links to appear with stagger
    .from("#menu-div h4", {
        x: 200,
        duration: 0.5,
        delay: 0.1,
        stagger: 0.2,
        opacity: 0,
        ease: "power2.out"
    })
    // Animate social icons to slide up from the bottom
    .from(".social-icons-div", {
        y: 100, // Start 100px down from its position
        duration: 0.6,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.3"); // Start this animation slightly before the last menu link finishes

    // Menu button toggle functionality
    menuButton.addEventListener("click", function () {
        if (menuButton.classList.contains('ri-menu-fill')) {
            menuButton.classList.remove('ri-menu-fill');
            menuButton.classList.add('ri-close-large-fill');
            fullDiv.style.display = 'flex'; // Ensure it's displayed during animation
            tl.play();
        } else {
            menuButton.classList.remove('ri-close-large-fill');
            menuButton.classList.add('ri-menu-fill');
            tl.reverse();
            setTimeout(function () {
                fullDiv.style.display = 'none';
            }, 500); // Match this delay with the animation duration
        }
    });

    // Close menu button functionality
    closeMenuButton.addEventListener("click", function () {
        menuButton.classList.remove('ri-close-large-fill');
        menuButton.classList.add('ri-menu-fill');
        tl.reverse();
        setTimeout(function () {
            fullDiv.style.display = 'none';
        }, 500); // Match this delay with the animation duration
    });
};


function closeMenu() {
    var menuButton = document.querySelector(".ri-close-large-fill");
    var fullDiv = document.getElementById('menu-div');

    menuButton.classList.remove('ri-close-large-fill');
    menuButton.classList.add('ri-menu-fill');

    setTimeout(function () {
        fullDiv.style.display = 'none';
    }, 500);

}

window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    const testimonials = document.getElementById('testimonials');
    const contact = document.getElementById('contact');
    const about = this.document.getElementById('about');
    const aboutTop = about.offsetTop;
    const testimonialsTop = testimonials.offsetTop;
    const contactTop = contact.offsetTop;
    const scrollY = window.scrollY;
    

    if (scrollY >= testimonialsTop && scrollY < contactTop) {
        header.classList.add('header-black');
    } else {
        header.classList.remove('header-black');
    }

    if (scrollY >= aboutTop && scrollY < testimonialsTop) {
        header.classList.add('header-black');
    } else if (scrollY >= testimonialsTop && scrollY < contactTop) {
        header.classList.remove('header-black');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const testimonialsWrapper = document.querySelector('.wrapper');
    const testimonialsItems = document.querySelectorAll('.testimonial-item');

    testimonialsWrapper.style.setProperty('--items-count', testimonialsItems.length);

    testimonialsItems.forEach(item => {
        const clone = item.cloneNode(true);
        testimonialsWrapper.appendChild(clone);
    });

    const scrollInterval = 6000;
    const totalDuration = scrollInterval * testimonialsItems.length;
    testimonialsWrapper.style.animationDuration = `${totalDuration}ms`;

    testimonialsItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            testimonialsWrapper.classList.add('paused');
        });

        item.addEventListener('mouseleave', () => {
            testimonialsWrapper.classList.remove('paused');
        });
    });
});

function openPopup(projectId) {
    document.getElementById(projectId + '-popup').style.display = 'block';
}

function closePopup(projectId) {
    document.getElementById(projectId + '-popup').style.display = 'none';
    // Close all open details
    document.querySelectorAll('.popup__description_detail_opened').forEach(function(openDetail) {
        openDetail.classList.remove('popup__description_detail_opened');
        openDetail.previousElementSibling.querySelector('.popup__arrow').classList.remove('popup__arrow_opened');
    });
}


document.addEventListener('DOMContentLoaded', function() {
    // Select all description items
    var descriptionItems = document.querySelectorAll('.popup__description_item');

    descriptionItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // Toggle the detail section
            var detail = this.nextElementSibling;
            if (detail.classList.contains('popup__description_detail_opened')) {
                detail.classList.remove('popup__description_detail_opened');
                this.querySelector('.popup__arrow').classList.remove('popup__arrow_opened');
            } else {
                // Close all open details
                document.querySelectorAll('.popup__description_detail_opened').forEach(function(openDetail) {
                    openDetail.classList.remove('popup__description_detail_opened');
                    openDetail.previousElementSibling.querySelector('.popup__arrow').classList.remove('popup__arrow_opened');
                });
                // Open the clicked detail
                detail.classList.add('popup__description_detail_opened');
                this.querySelector('.popup__arrow').classList.add('popup__arrow_opened');
            }
        });
    });
});


function initializeGallery(imageList, containerId) {
    let galleryImages = imageList;
    let currentImageIndex = 0;

    function showImage(index) {
        document.querySelector(`#${containerId} img`).src = galleryImages[index];
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        showImage(currentImageIndex);
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(currentImageIndex);
    }

    // Add event listeners for the next/prev buttons
    document.querySelector(`#${containerId} .gallery__arrow--right`).addEventListener('click', showNextImage);
    document.querySelector(`#${containerId} .gallery__arrow--left`).addEventListener('click', showPrevImage);

    // Show the first image on initialization
    showImage(currentImageIndex);
}

var praImages = ['./projects/PLA/img1.png', './projects/PLA/img2.png', './projects/PLA/img3.png', './projects/PLA/img4.png'];
var bpaImages = ['./projects/BPA/img1.png', './projects/BPA/img2.png', './projects/BPA/img3.png', './projects/BPA/img4.png'];
var foamImages = ['./projects/FOAM/img1.png', './projects/FOAM/img2.png', './projects/FOAM/img3.png', './projects/FOAM/img4.png', './projects/FOAM/img5.png', './projects/FOAM/img6.png'];
var ptaImages = ['./projects/PTA/img1.png', './projects/PTA/img2.png', './projects/PTA/img3.png', './projects/PTA/img4.png'];
var siImages = ['./projects/SI/img1.png', './projects/SI/img2.png', './projects/SI/img3.png', './projects/SI/img4.png'];

initializeGallery(praImages, 'pra_gallery');
initializeGallery(bpaImages, 'bpa_gallery');
initializeGallery(foamImages, 'foam_gallery');
initializeGallery(ptaImages, 'pta_gallery');
initializeGallery(siImages, 'si_gallery');

document.addEventListener('DOMContentLoaded', show_menu);




