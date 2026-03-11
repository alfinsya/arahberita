/**
 * Load Breaking News dari articles.json untuk index.html
 * Script ini mengganti breaking news carousel dengan berita terbaru
 */

document.addEventListener('DOMContentLoaded', function() {
    const breakingNews = document.querySelector('.tranding-carousel');
    if (!breakingNews) return;

    // Fetch articles.json dan update breaking news
    fetch('articles.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load articles.json');
            return response.json();
        })
        .then(articles => {
            // Clear existing items
            breakingNews.innerHTML = '';

            // Ambil 2 berita terbaru untuk breaking news (membatasi judul agar tetap besar dan mudah dibaca)
            const latestArticles = articles.slice(0, 2);

            // Render breaking news items
            latestArticles.forEach(article => {
                const item = document.createElement('div');
                item.className = 'text-truncate';

                const link = document.createElement('a');
                link.className = 'text-white text-uppercase font-weight-semi-bold';
                link.href = article.url || '#';
                link.textContent = article.title || '';

                item.appendChild(link);
                breakingNews.appendChild(item);
            });

            // re-initialize Owl Carousel in case it was already running
            if (typeof $.fn.owlCarousel === 'function' && breakingNews.closest('.owl-carousel')) {
                const $bc = $(breakingNews);
                $bc.trigger('destroy.owl.carousel');
                $bc.html($bc.find('.owl-stage-outer').html()).removeClass('owl-loaded');
                $bc.owlCarousel({
                    autoplay: true,
                    smartSpeed: 2000,
                    items: 1,
                    dots: false,
                    loop: true,
                    nav : true,
                    navText : ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>']
                });
            }
        })
        .catch(err => {
            console.error('❌ Error loading articles.json for breaking news:', err);
        });
});