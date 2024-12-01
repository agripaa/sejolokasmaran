document.addEventListener("DOMContentLoaded", () => {
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const categoryModal = document.getElementById("categoryModal");
    const closeModal = categoryModal.querySelector(".close");
    const form = document.getElementById("categoryForm");
    const tbody = document.querySelector("#category-table tbody");
    const token = localStorage.getItem("token");
    let isEdit = false;
    let editId = null;
  
    fetch('/public/config.json')
      .then(response => response.json())
      .then(config => {
        const baseUrl = config.API_BASE_URL;
  
        addCategoryBtn.addEventListener("click", () => {
          form.reset();
          isEdit = false;
          categoryModal.classList.remove("hidden");
        });
  
        closeModal.addEventListener("click", () => {
          categoryModal.classList.add("hidden");
        });
  
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const payload = Object.fromEntries(formData);
  
          try {
            const url = isEdit
              ? `${baseUrl}/learn_category/${editId}`
              : `${baseUrl}/learn_category`;
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
            if (data.status === 200 || data.status === 201) {
              alert(
                isEdit
                  ? "Kategori berhasil diperbarui!"
                  : "Kategori berhasil ditambahkan!"
              );
              fetchCategories();
              categoryModal.classList.add("hidden");
            } else {
              alert(data.msg);
            }
          } catch (error) {
            console.error("Error saving category:", error);
          }
        });
  
        async function fetchCategories() {
          try {
            const response = await fetch(`${baseUrl}/learn_category`, {
              headers: {
                "Authorization": token,
              },
            });
            const data = await response.json();
  
            tbody.innerHTML = "";
            data.result.forEach((item, index) => {
              const row = `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.category_name}</td>
                  <td>
                    <button class="edit-btn" data-id="${item.id}">Edit</button>
                    <button class="delete-btn" data-id="${item.id}">Delete</button>
                  </td>
                </tr>
              `;
              tbody.innerHTML += row;
            });
  
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
  
          if (category) {
            isEdit = true;
            editId = id;
            document.getElementById("category_name").value = category.category_name;
            categoryModal.classList.remove("hidden");
          }
        }
  
        async function handleDelete(e) {
          const id = e.target.dataset.id;
  
          if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
            try {
              const response = await fetch(`${baseUrl}/learn_category/${id}`, {
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
  
        fetchCategories();
      });
  });
  