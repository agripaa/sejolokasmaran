document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/public/user/login.html";
    return;
  }
  
  fetch('/public/config.json')
  .then(response => response.json())
  .then(config => {
    const apiBaseUrl = config.API_BASE_URL;

    fetch('/public/admin/sidebar/sidebar.html')
      .then((response) => response.text())
      .then(async (html) => {
        document.getElementById('sidebar-container').innerHTML = html;
  
        const sidebar = document.getElementById('sidebar');
        const content = document.querySelector('.content');
        const toggleButton = document.getElementById('toggle-sidebar');
  
        toggleButton.addEventListener('click', () => {
          sidebar.classList.toggle('hidden');
          content.classList.toggle('shifted');
        });
  
        const profileResponse = await fetch(`${apiBaseUrl}/auth/profile`, {
          headers: {
            Authorization: token,
          },
        });
    
        if (!profileResponse.ok) {
          window.location.href = "/public/user/login.html";
          return;
        }
    
        const { result: user } = await profileResponse.json();
    
        if (user.Role.role_name !== "ADMIN") {
          window.location.href = "/public/index.html";
          return;
        }
      })
      .catch((error) => console.error('Gagal memuat sidebar:', error));
  })

});
  