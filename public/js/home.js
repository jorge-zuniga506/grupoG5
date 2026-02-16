// Carousel Logic
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    if (slides.length > 0) {
        setInterval(() => {
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');

            // Calculate next slide index
            currentSlide = (currentSlide + 1) % slides.length;

            // Add active class to next slide
            slides[currentSlide].classList.add('active');
        }, slideInterval);
    }
});
