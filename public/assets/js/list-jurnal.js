document.addEventListener("DOMContentLoaded", () => {
    const uploadJournalBtn = document.getElementById("uploadJournalBtn");
    const uploadJournalModal = document.getElementById("uploadJournalModal");
    const closeModal = uploadJournalModal.querySelector(".close");
    const form = document.getElementById("uploadJournalForm");
    const tbody = document.querySelector("#journal-table tbody");
    const pregnancySelect = document.getElementById("pregnancy_journal_id");
    const token = localStorage.getItem("token");
    let isEdit = false;
    let editId = null;
  
    fetch('/public/config.json')
      .then(response => response.json())
      .then(config => {
        const baseUrl = config.API_BASE_URL;
  
        uploadJournalBtn.addEventListener("click", () => {
          form.reset();
          isEdit = false;
          loadPregnancyCategories();
          uploadJournalModal.classList.remove("hidden");
        });
  
        closeModal.addEventListener("click", () => {
          uploadJournalModal.classList.add("hidden");
        });
  
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          const payload = Object.fromEntries(formData);
  
          try {
            const url = isEdit
              ? `${baseUrl}/list_journal/${editId}`
              : `${baseUrl}/list_journal`;
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
                  ? "Jurnal berhasil diperbarui!"
                  : "Jurnal berhasil ditambahkan!"
              );
              fetchListJournal();
              uploadJournalModal.classList.add("hidden");
            } else {
              alert(data.msg);
            }
          } catch (error) {
            console.error("Error saving journal:", error);
          }
        });
  
        async function fetchListJournal() {
          try {
            const response = await fetch(`${baseUrl}/list_journal`, {
              headers: {
                "Authorization": token,
              },
            });
            const data = await response.json();
            console.log({data: data.result})
  
            tbody.innerHTML = "";
            data.result.forEach((item, index) => {
              const row = `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.journal}</td>
                  <td>${item.is_required ? "Ya" : "Tidak"}</td>
                  <td>${item.PregnancyJournal.category_jurnal}</td>
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
            console.error("Error fetching list journals:", error);
          }
        }
  
        async function handleEdit(e, data) {
          const id = e.target.dataset.id;
          const journal = data.find((item) => item.id == id);
          loadPregnancyCategories();
  
          if (journal) {
            isEdit = true;
            editId = id;
            document.getElementById("journal").value = journal.journal;
            document.getElementById("is_required").value = journal.is_required;
            document.getElementById("pregnancy_journal_id").value = journal.pregnancy_journal_id;
            uploadJournalModal.classList.remove("hidden");
          }
        }
  
        async function handleDelete(e) {
          const id = e.target.dataset.id;
  
          if (confirm("Apakah Anda yakin ingin menghapus jurnal ini?")) {
            try {
              const response = await fetch(`${baseUrl}/list_journal/${id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": token,
                },
              });
              const data = await response.json();
              if (data.status === 200) {
                alert("Jurnal berhasil dihapus!");
                fetchListJournal();
              } else {
                alert(data.msg);
              }
            } catch (error) {
              console.error("Error deleting journal:", error);
            }
          }
        }
  
        async function loadPregnancyCategories() {
          try {
            const response = await fetch(`${baseUrl}/pregnancy_journal`, {
              headers: {
                "Authorization": token,
              },
            });
            const data = await response.json();
            pregnancySelect.innerHTML = "";
            if (data.result && data.result.length > 0) {
              data.result.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.category_jurnal;
                pregnancySelect.appendChild(option);
              });
            } else {
              const option = document.createElement("option");
              option.textContent = "Tidak ada kategori tersedia";
              option.disabled = true;
              pregnancySelect.appendChild(option);
            }
          } catch (error) {
            console.error("Error loading pregnancy categories:", error);
          }
        }
  
        fetchListJournal();
      });
  });
  