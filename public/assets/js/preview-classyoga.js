document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const tableBody = document.getElementById('class-table-body');
    const addClassButton = document.getElementById('add-class-btn');

    fetch('/public/config.json')
        .then((response) => response.json())
        .then((config) => {
            const apiBaseUrl = config.API_BASE_URL;

            const fetchClasses = async () => {
                try {
                    const response = await fetch(`${apiBaseUrl}/class_yoga`, {
                        headers: { Authorization: token },
                    });

                    if (!response.ok) throw new Error('Failed to fetch classes');
                    const { result } = await response.json();

                    // Hide "Add Yoga Class" button if there's already a class
                    if (result.length > 0) {
                        addClassButton.style.display = 'none'; // Hide the button
                    } else {
                        addClassButton.style.display = 'block'; // Show the button
                    }

                    // Render the class list
                    tableBody.innerHTML = result
                        .map(
                            (classYoga) => `
                            <tr>
                                <td>${classYoga.id}</td>
                                <td><a href="${classYoga.url_link}" target="_blank">${classYoga.url_link}</a></td>
                                <td class="action-buttons">
                                    <a href="/public/admin/kelas-yoga/preview-classyoga.html?id=${classYoga.id}">Edit</a>
                                    <button data-id="${classYoga.id}" class="delete-btn">Delete</button>
                                </td>
                            </tr>
                        `
                        )
                        .join('');

                    // Attach delete event listeners
                    document.querySelectorAll('.delete-btn').forEach((button) =>
                        button.addEventListener('click', async () => {
                            const id = button.getAttribute('data-id');
                            if (confirm('Are you sure you want to delete this class?')) {
                                await fetch(`${apiBaseUrl}/${id}`, {
                                    method: 'DELETE',
                                    headers: { Authorization: token },
                                });
                                alert('Class deleted successfully!');
                                fetchClasses(); // Reload the data
                            }
                        })
                    );
                } catch (error) {
                    console.error('Error fetching classes:', error);
                }
            };

            fetchClasses();
        });
});
