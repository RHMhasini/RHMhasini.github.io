const canvas = document.getElementById('canvas-background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 4 + 2;
        this.pulse = Math.random() * Math.PI * 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        
        this.pulse += 0.05;
    }
    
    draw() {
        const pulseSize = Math.sin(this.pulse) * 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class Signal {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.progress = 0;
        this.speed = 0.02;
    }
    
    update() {
        this.progress += this.speed;
        return this.progress >= 1;
    }
    
    draw() {
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#4fc3f7';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#4fc3f7';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

const nodes = [];
const numNodes = 50;
for (let i = 0; i < numNodes; i++) {
    nodes.push(new Node(
        Math.random() * canvas.width,
        Math.random() * canvas.height
    ));
}

const signals = [];

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    nodes.forEach(node => {
        node.update();
        node.draw();
    });
    
    nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(other => {
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const opacity = 1 - distance / 150;
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    });
    
    for (let i = signals.length - 1; i >= 0; i--) {
        const complete = signals[i].update();
        signals[i].draw();
        if (complete) {
            signals.splice(i, 1);
        }
    }
    
    if (Math.random() < 0.05) {
        const from = nodes[Math.floor(Math.random() * nodes.length)];
        const to = nodes[Math.floor(Math.random() * nodes.length)];
        if (from !== to) {
            signals.push(new Signal(from, to));
        }
    }
    
    requestAnimationFrame(animate);
}

animate();

// Certification tabs functionality
const certButtons = document.querySelectorAll('.cert-btn');
const certContents = document.querySelectorAll('.cert-category-content');

certButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        
        certButtons.forEach(btn => btn.classList.remove('active'));
        certContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(category).classList.add('active');
    });
});

// Projects Carousel
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const indicators = Array.from(document.querySelectorAll('.indicator'));

let currentSlide = 0;

function updateCarousel() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
});

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
    });
});

window.addEventListener('resize', updateCarousel);

