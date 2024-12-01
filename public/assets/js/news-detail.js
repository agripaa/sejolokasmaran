document.addEventListener('DOMContentLoaded', () => {   
    fetch('/public/config.json')
    .then(response => response.json())
    .then(async (config) => {
        const apiBaseUrl = config.API_BASE_URL;
        const newsDetailElement = document.getElementById('news-detail');
        const newsTitleElement = document.getElementById('news-title');
      
        const params = new URLSearchParams(window.location.search);
        const newsId = params.get('id');
        const token = localStorage.getItem('token')
      
        if (!newsId) {
          newsTitleElement.textContent = 'Berita tidak ditemukan';
          return;
        }
      
        async function fetchNewsDetail() {
          try {
            const response = await fetch(`${apiBaseUrl}/news/${newsId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                  },
            });
            const { status, result } = await response.json();
      
            if (status !== 200) {
              throw new Error('Berita tidak ditemukan.');
            }
      
            displayNewsDetail(result);
          } catch (error) {
            console.error('Error fetching news detail:', error);
            newsTitleElement.textContent = 'Gagal memuat berita.';
          }
        }

        function formatDate(isoDate) {
            const date = new Date(isoDate);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            return date.toLocaleDateString('id-ID', options);
        }
      
        function displayNewsDetail(news) {
            const formattedDate = formatDate(news.release);

          newsDetailElement.innerHTML = `
            <img src="http://localhost:5001${news.img_news || '/public/assets/imgs/placeholder.png'}" alt="${news.title}" style="width: 100%; height: auto; margin-bottom: 20px; border-radius: 20px;">

            <h2>${news.title}</h2>
            <h3>${news.sub_title}</h3>
            <p><strong>Release Date:</strong> ${formattedDate}</p>
            <div>
              ${news.NewsContents.map(content => `<p>${content.paragraph}</p>`).join('')}
            </div>
          `;
        }
      
        fetchNewsDetail();
      });
    });