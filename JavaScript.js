function filterProjects(cat, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.project-card').forEach(card => {
        const cats = card.dataset.cat || '';
        if (cat === 'all' || cats.includes(cat)) {
            card.style.opacity = '0';
            card.style.display = 'block';
            setTimeout(() => {
                card.style.transition = 'opacity 0.35s';
                card.style.opacity = '1';
            }, 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => { card.style.display = 'none'; }, 350);
        }
    });
}

// Stagger entrance on load
document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s`;
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
});