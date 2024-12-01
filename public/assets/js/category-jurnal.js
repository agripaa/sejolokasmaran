document.addEventListener("DOMContentLoaded", () => {
    const uploadCategoryBtn = document.getElementById("uploadCategoryBtn");
    const uploadCategoryModal = document.getElementById("uploadCategoryModal");
    const closeModal = uploadCategoryModal.querySelector(".close");
    const form = document.getElementById("uploadCategoryForm");
    const tbody = document.querySelector("#category-table tbody");
    const trimesterSelect = document.getElementById("trimester_id");
    const token = localStorage.getItem("token");
    let isEdit = false;
    let editId = null;
  
    fetch('/public/config.json')
    .then(response => response.json())
    .then(config => {
        uploadCategoryBtn.addEventListener("click", () => {
        form.reset();
        isEdit = false;
        loadTrimesters();
        uploadCategoryModal.classList.remove("hidden");
        });
    
        closeModal.addEventListener("click", () => {
        uploadCategoryModal.classList.add("hidden");
        });
  
        const baseUrl = config.API_BASE_URL;
  
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const payload = Object.fromEntries(formData);
  
          try {
            const url = isEdit
              ? `${baseUrl}/pregnancy_journal/${editId}`
              : `${baseUrl}/pregnancy_journal`;
            const method = isEdit ? "PATCH" : "POST";
  
            const response = await fetch(url, {
              method,
              headers: {
                "Content-Type": "application/json",
                "Authorization": token,
              },
              body: JSON.stringify(payload),
            });
  
            const data = await response.json();
            if (data.status === 200) {
              alert(
                isEdit
                  ? "Category berhasil diperbarui!"
                  : "Category berhasil ditambahkan!"
              );
              fetchCategories();
              uploadCategoryModal.classList.add("hidden");
            } else {
              alert(data.msg);
            }
          } catch (error) {
            console.error("Error saving category:", error);
          }
        });
  
        async function fetchCategories() {
            try {
                const response = await fetch(`${baseUrl}/pregnancy_journal`, {
                    headers: {
                        "Authorization": token,
                    },
                });
                const data = await response.json();
                console.log("Pregnancy Journal Data:", data); // Tambahkan log ini
        
                tbody.innerHTML = "";
                data.result.forEach((item, index) => {
                    const row = `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.category_jurnal}</td>
                            <td>${item.Trimester ? item.Trimester.cat_trimester : 'Tidak Tersedia'}</td>
                            <td>
                                <button class="edit-btn" data-id="${item.id}">Edit</button>
                                <button class="delete-btn" data-id="${item.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    tbody.innerHTML += row;
                });
        
                // Tambahkan event listener untuk tombol Edit dan Delete
                const editButtons = document.querySelectorAll(".edit-btn");
                const deleteButtons = document.querySelectorAll(".delete-btn");
        
                editButtons.forEach((button) =>
                    button.addEventListener("click", (e) => handleEdit(e, data.result))
                );
        
                deleteButtons.forEach((button) =>
                    button.addEventListener("click", (e) => handleDelete(e))
                );
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        
  
        async function handleEdit(e, data) {
          const id = e.target.dataset.id;
          const category = data.find((item) => item.id == id);
          loadTrimesters();

          if (category) {
            isEdit = true;
            editId = id;
            document.getElementById("category_jurnal").value = category.category_jurnal;
            document.getElementById("desc").value = category.desc;
            document.getElementById("trimester_id").value = category.trimester_id;
            uploadCategoryModal.classList.remove("hidden");
          }
        }
  
        async function handleDelete(e) {
          const id = e.target.dataset.id;
  
          if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
            try {
              const response = await fetch(`${baseUrl}/pregnancy_journal/${id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": token,
                },
              });
              const data = await response.json();
              if (data.status === 200) {
                alert("Kategori berhasil dihapus!");
                fetchCategories();
              } else {
                alert(data.msg);
              }
            } catch (error) {
              console.error("Error deleting category:", error);
            }
          }
        }
  
        async function loadTrimesters() {
            try {
                const response = await fetch(`${baseUrl}/trimester`, {
                    headers: {
                        "Authorization": token,
                    },
                });
                const data = await response.json();
                console.log("Trimester Data:", data); // Tambahkan log ini
                trimesterSelect.innerHTML = ""; // Clear existing options
                if (data.result && data.result.length > 0) {
                    data.result.forEach((trimester) => {
                        const option = document.createElement("option");
                        option.value = trimester.id;
                        option.textContent = trimester.cat_trimester;
                        trimesterSelect.appendChild(option);
                    });
                } else {
                    alert("Tidak ada data trimester yang ditemukan.");
                }
            } catch (error) {
                console.error("Error loading trimesters:", error);
            }
        }
        fetchCategories()      
  });
});