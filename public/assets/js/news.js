document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    fetch('/public/config.json')
    .then(response => response.json())
    .then(async (config) => {
        const apiBaseUrl = config.API_BASE_URL;
        const newsListElement = document.getElementById('news-list');
        
        async function fetchNews() {
          try {
            const response = await fetch(`${apiBaseUrl}/news`,{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                  },
            });
            const { status, result } = await response.json();
      
            if (status !== 200) {
              throw new Error('Gagal memuat berita.');
            }
      
            displayNews(result);
          } catch (error) {
            console.error('Error fetching news:', error);
            newsListElement.innerHTML = `<p>Gagal memuat berita.</p>`;
          }
        }
      
        function displayNews(newsList) {
            newsListElement.innerHTML = newsList
              .map((news) => {
                return `
                  <div class="news-item">
                    <img src="http://localhost:5001${news.img_news || '/public/assets/imgs/backgrounds/intersect.svg'}" alt="${news.title}">
                    <div class="news-item-content">
                      <h3 class="news-item-title">${news.title}</h3>
                      <p class="news-item-subtitle">${news.sub_title}</p>
                      <a href="news-detail.html?id=${news.id}" class="news-item-link">Read More</a>
                      <div class="news-item-actions">
                        <button class="btn btn-edit" data-id="${news.id}">Edit</button>
                        <button class="btn btn-danger" data-id="${news.id}">Delete</button>
                      </div>
                    </div>
                  </div>
                `;
              })
              .join('');
          
            addActionListeners();
          }
          
          function addActionListeners() {
            document.querySelectorAll('.btn-danger').forEach((button) => {
              button.addEventListener('click', async (e) => {
                const newsId = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this news?')) {
                  try {
                    const response = await fetch(`${apiBaseUrl}/news/${newsId}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `${token}`,
                      },
                    });
          
                    if (!response.ok) {
                      throw new Error('Failed to delete news.');
                    }
          
                    alert('News deleted successfully.');
                    fetchNews();
                  } catch (error) {
                    console.error('Error deleting news:', error);
                    alert('Failed to delete news. Please try again.');
                  }
                }
              });
            });
          
            document.querySelectorAll('.btn-edit').forEach((button) => {
              button.addEventListener('click', (e) => {
                const newsId = e.target.dataset.id;
                window.location.href = `/public/admin/news/edit-news.html?id=${newsId}`;
              });
            });
          }
          
      
        fetchNews();
    })
  });
  