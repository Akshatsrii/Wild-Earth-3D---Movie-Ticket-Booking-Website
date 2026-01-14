
const state = {
    selectedSeats: [],
    selectedShowtime: null,
    selectedDate: null,
    ticketPrice: 0,
    occupiedSeats: ['C2', 'C7', 'E3', 'E4', 'D6', 'F5', 'B4', 'A8'], 
    totalSeats: 0
};


const config = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: 10,
    dates: [
        { day: 'WED', date: 15, month: 'Jan', full: 'Wednesday, January 15, 2026' },
        { day: 'THU', date: 16, month: 'Jan', full: 'Thursday, January 16, 2026' },
        { day: 'FRI', date: 17, month: 'Jan', full: 'Friday, January 17, 2026' },
        { day: 'SAT', date: 18, month: 'Jan', full: 'Saturday, January 18, 2026' },
        { day: 'SUN', date: 19, month: 'Jan', full: 'Sunday, January 19, 2026' }
    ],
    showtimes: [
        { time: '10:00 AM', screen: 'Screen 1 - 3D IMAX', price: 12 },
        { time: '1:30 PM', screen: 'Screen 2 - 3D Premium', price: 15 },
        { time: '4:00 PM', screen: 'Screen 1 - 3D IMAX', price: 12 },
        { time: '7:00 PM', screen: 'Screen 3 - 3D VIP', price: 18 },
        { time: '9:30 PM', screen: 'Screen 2 - 3D Premium', price: 15 }
    ],
    galleryImages: [
        { src: 'images/image1.jpg', caption: 'Majestic Mountain Peaks' },
        { src: 'images/image2.jpg', caption: 'Ocean Wildlife' },
        { src: 'images/image3.jpg', caption: 'Rainforest Canopy' },
        { src: 'images/image4.jpg', caption: 'Desert Landscape' },
        { src: 'images/image5.jpg', caption: 'Arctic Wonder' },
        { src: 'images/image6.jpg', caption: 'Savanna Sunset' }
    ]
};


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeDateSelector();
    initializeShowtimes();
    initializeSeatMap();
    initializeGallery();
    initializeEventListeners();
    initializeScrollAnimations();
    
    
    selectDate(config.dates[0], 0);
}

function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
              
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initializeDateSelector() {
    const dateSelector = document.getElementById('date-selector');
    
    config.dates.forEach((date, index) => {
        const button = document.createElement('button');
        button.className = 'date-btn';
        button.setAttribute('data-index', index);
        button.innerHTML = `${date.day} ${date.date}`;
        
        button.addEventListener('click', function() {
            selectDate(date, index);
        });
        
        dateSelector.appendChild(button);
    });
}

function selectDate(date, index) {

    const dateBtns = document.querySelectorAll('.date-btn');
    dateBtns.forEach(btn => btn.classList.remove('active'));
    dateBtns[index].classList.add('active');
    
  
    state.selectedDate = date.full;
    document.getElementById('selected-date').textContent = `${date.day}, ${date.month} ${date.date}`;
    
    updateBookingSummary();
}
function initializeShowtimes() {
    const showtimeGrid = document.getElementById('showtime-grid');
    
    config.showtimes.forEach((showtime, index) => {
        const card = document.createElement('div');
        card.className = 'showtime-card';
        card.setAttribute('data-index', index);
        card.innerHTML = `
            <div class="time">${showtime.time}</div>
            <div class="screen">${showtime.screen}</div>
            <div class="price">$${showtime.price.toFixed(2)}</div>
            <button class="select-btn">Select</button>
        `;
        
        card.querySelector('.select-btn').addEventListener('click', function() {
            selectShowtime(showtime, index);
        });
        
        showtimeGrid.appendChild(card);
    });
}

function selectShowtime(showtime, index) {
    
    const showtimeCards = document.querySelectorAll('.showtime-card');
    showtimeCards.forEach(card => card.classList.remove('selected'));
    showtimeCards[index].classList.add('selected');
    

    state.selectedShowtime = showtime;
    state.ticketPrice = showtime.price;
    
   
    document.getElementById('selected-time').textContent = showtime.time;
    document.getElementById('selected-screen').textContent = showtime.screen;
    
    updateBookingSummary();
    
   
    const bookingSection = document.getElementById('booking');
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = bookingSection.offsetTop - navHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}


function initializeSeatMap() {
    const seatMap = document.getElementById('seat-map');
    seatMap.innerHTML = ''; 
    
    config.rows.forEach(row => {
        const seatRow = document.createElement('div');
        seatRow.className = 'seat-row';
        seatRow.setAttribute('data-row', row);
       
        const rowLabel = document.createElement('span');
        rowLabel.className = 'row-label';
        rowLabel.textContent = row;
        seatRow.appendChild(rowLabel);
        

        for (let i = 1; i <= config.seatsPerRow; i++) {
            const seatId = `${row}${i}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.setAttribute('data-seat', seatId);
            if (state.occupiedSeats.includes(seatId)) {
                seat.classList.add('occupied');
            } else {
                seat.addEventListener('click', function() {
                    toggleSeat(seatId, this);
                });
            }
            
            seatRow.appendChild(seat);
        }
        
        seatMap.appendChild(seatRow);
    });
    
    state.totalSeats = config.rows.length * config.seatsPerRow;
}

function toggleSeat(seatId, seatElement) {
    if (seatElement.classList.contains('occupied')) {
        return; 
    }
    
    if (seatElement.classList.contains('selected')) {
        
        seatElement.classList.remove('selected');
        state.selectedSeats = state.selectedSeats.filter(s => s !== seatId);
    } else {
       
        if (state.selectedSeats.length < 10) {
            seatElement.classList.add('selected');
            state.selectedSeats.push(seatId);
        } else {
            showNotification('Maximum 10 seats can be selected at once');
        }
    }
    
    updateBookingSummary();
}



function updateBookingSummary() {
    const ticketCount = state.selectedSeats.length;
    const totalPrice = ticketCount * state.ticketPrice;
   
    document.getElementById('ticket-count').textContent = ticketCount;
    
  
    if (state.selectedSeats.length > 0) {
        document.getElementById('selected-seats').textContent = state.selectedSeats.sort().join(', ');
    } else {
        document.getElementById('selected-seats').textContent = 'None';
    }
    
 
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
    
    
    const proceedBtn = document.getElementById('proceed-btn');
    if (state.selectedSeats.length > 0 && state.selectedShowtime && state.selectedDate) {
        proceedBtn.disabled = false;
    } else {
        proceedBtn.disabled = true;
    }
}

function initializeGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    
    config.galleryImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${image.src}" alt="${image.caption}">`;
        
        item.addEventListener('click', function() {
            openLightbox(image.src, image.caption);
        });
        
        galleryGrid.appendChild(item);
    });
}

function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightbox.style.display = 'flex';
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}


function initializeEventListeners() {

    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function() {
            const showtimeSection = document.getElementById('showtime');
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = showtimeSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }
    
   
    const proceedBtn = document.getElementById('proceed-btn');
    if (proceedBtn) {
        proceedBtn.addEventListener('click', openPaymentModal);
    }
    

    const closePayment = document.getElementById('close-payment');
    if (closePayment) {
        closePayment.addEventListener('click', closePaymentModal);
    }
    
  
    const closeSuccess = document.getElementById('close-success');
    if (closeSuccess) {
        closeSuccess.addEventListener('click', closeSuccessModal);
    }
    
  
    const lightboxClose = document.getElementById('lightbox-close');
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
        const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
    
 
    initializeInputFormatting();
    
 
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePaymentModal();
            closeSuccessModal();
            closeLightbox();
        }
    });
}

function initializeInputFormatting() {
 
    const cardInput = document.getElementById('card');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
   
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
    }
    
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
        });
    }
}

function openPaymentModal() {
    if (state.selectedSeats.length === 0 || !state.selectedShowtime || !state.selectedDate) {
        showNotification('Please select date, showtime, and seats before proceeding');
        return;
    }
    
    const totalPrice = state.selectedSeats.length * state.ticketPrice;
    document.getElementById('modal-total').textContent = `$${totalPrice.toFixed(2)}`;
    
    const modal = document.getElementById('payment-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handlePaymentSubmit(e) {
    e.preventDefault();
    
   
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const card = document.getElementById('card').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    
    
    if (!name || !email || !phone || !card || !expiry || !cvv) {
        showNotification('Please fill in all required fields');
        return;
    }
    
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address');
        return;
    }
    
    if (card.replace(/\s/g, '').length < 15) {
        showNotification('Please enter a valid card number');
        return;
    }

    const expiryParts = expiry.split('/');
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
        showNotification('Please enter expiry date in MM/YY format');
        return;
    }
    
  
    if (cvv.length < 3) {
        showNotification('Please enter a valid CVV');
        return;
    }

    showNotification('Processing payment...');
    
    setTimeout(() => {
        closePaymentModal();
        showSuccessModal(email);
    }, 2000);
}


function showSuccessModal(email) {
    const modal = document.getElementById('success-modal');
    const bookingDetails = document.getElementById('booking-details');
    const confirmationEmail = document.getElementById('confirmation-email');
    
    const details = `
        <strong>Date:</strong> ${state.selectedDate}<br>
        <strong>Time:</strong> ${state.selectedShowtime.time}<br>
        <strong>Seats:</strong> ${state.selectedSeats.sort().join(', ')}<br>
        <strong>Total:</strong> $${(state.selectedSeats.length * state.ticketPrice).toFixed(2)}
    `;
    
    bookingDetails.innerHTML = details;
    confirmationEmail.textContent = email;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
 
    resetBooking();
}

function resetBooking() {
    
    state.selectedSeats = [];
    state.selectedShowtime = null;
    state.ticketPrice = 0;
    

    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });
    
    document.querySelectorAll('.showtime-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.getElementById('selected-time').textContent = 'Not selected';
    document.getElementById('selected-screen').textContent = '-';

    const form = document.getElementById('payment-form');
    if (form) form.reset();
    
    updateBookingSummary();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showNotification(message) {
  
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);
    
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
   
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}


function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll('.about-section, .showtime-section, .booking-section, .gallery-section');
    elementsToAnimate.forEach(el => observer.observe(el));
}

function randomizeOccupiedSeats() {
    const allSeats = [];
    config.rows.forEach(row => {
        for (let i = 1; i <= config.seatsPerRow; i++) {
            allSeats.push(`${row}${i}`);
        }
    });
  
    const occupiedCount = Math.floor(allSeats.length * 0.2);
    state.occupiedSeats = [];
    
    for (let i = 0; i < occupiedCount; i++) {
        const randomIndex = Math.floor(Math.random() * allSeats.length);
        const seat = allSeats[randomIndex];
        if (!state.occupiedSeats.includes(seat)) {
            state.occupiedSeats.push(seat);
        }
    }
}


console.log('%c🌿 Wild Earth 3D - Movie Booking System Loaded Successfully!', 'color: #10b981; font-size: 16px; font-weight: bold;');
console.log('%cTotal Seats: ' + (config.rows.length * config.seatsPerRow), 'color: #10b981; font-size: 12px;');
console.log('%cOccupied Seats: ' + state.occupiedSeats.length, 'color: #10b981; font-size: 12px;');