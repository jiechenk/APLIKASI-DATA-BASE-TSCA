
        // Login functionality
        let isLoggedIn = false;
		const validCredentials = { username: 'admin', password: 'admin123' };

        

        // Check login status on page load
        function checkLoginStatus() {
            // For demo purposes, we'll use a simple variable
            // In real app, you'd check session or token
            if (isLoggedIn) {
                showMainApp();
            } else {
                showLoginPage();
            }
        }

        function showLoginPage() {
            document.getElementById('loginPage').style.display = 'flex';
            document.getElementById('mainApp').style.display = 'none';
        }

        function showMainApp() {
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
        }

        function login(username, password) {
            if (username === validCredentials.username && password === validCredentials.password) {
                isLoggedIn = true;
                showMainApp();
                return true;
            }
            return false;
        }

        function logout() {
            isLoggedIn = false;
            showLoginPage();
            // Clear form
            document.getElementById('loginForm').reset();
            document.getElementById('errorMessage').style.display = 'none';
        }

        // Login form event listener
		  document.getElementById('loginForm').addEventListener('submit', function(e) {
		e.preventDefault();
		
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		const errorMessage = document.getElementById('errorMessage');
		
		if (login(username, password)) {
			errorMessage.style.display = 'none';
			loadData();  // ✅ ambil dari localStorage
						
				// ❌ Hilangkan pemanggilan dummy data
				// if (members.length === 0 && activities.length === 0 && equipment.length === 0) {
				//     initializeSampleData();  
				// }

				renderAllTables();
				updateStats();
			} else {
				errorMessage.style.display = 'block';
				document.querySelector('.login-box').style.animation = 'shake 0.5s';
				setTimeout(() => {
					document.querySelector('.login-box').style.animation = '';
				}, 500);
			}
	});

        // Add shake animation CSS
        const shakeCSS = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        const style = document.createElement('style');
        style.textContent = shakeCSS;
        document.head.appendChild(style);

        // Data Storage
        let members = [];
        let activities = [];
        let equipment = [];
        let currentEditingMember = null;
        let currentEditingActivity = null;
        let currentEditingEquipment = null;
        let selectedMembers = new Set(); // Track selected members
		
		// === Fungsi LocalStorage ===
		function saveData() {
		localStorage.setItem('members', JSON.stringify(members));
		localStorage.setItem('activities', JSON.stringify(activities));
		localStorage.setItem('equipment', JSON.stringify(equipment));
	}


		function loadData() {
		members = JSON.parse(localStorage.getItem('members')) || [];
		activities = JSON.parse(localStorage.getItem('activities')) || [];
		equipment = JSON.parse(localStorage.getItem('equipment')) || [];
	}
	
			  // Tombol Reset Data
		function resetAllData() {
		if (confirm("Yakin ingin menghapus semua data?")) {
		localStorage.clear();
		members = [];
		activities = [];
		equipment = [];
		renderAllTables();
		updateStats();
		alert("Semua data berhasil dihapus!");
		}
	}
	


			// Backup Data ke file JSON
			function backupData() {
			const data = {
				members,
				activities,
				equipment};
				const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "tsca_backup.json";
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
				alert("Backup berhasil diunduh!");
			}

			// Restore Data dari file JSON
			function restoreData(event) {
			const file = event.target.files[0];
				if (!file) return;

				const reader = new FileReader();
				reader.onload = function(e) {
					try {
						const data = JSON.parse(e.target.result);
						members = data.members || [];
						activities = data.activities || [];
						equipment = data.equipment || [];
						saveData();
						renderAllTables();
						updateStats();
						alert("Data berhasil dipulihkan!");
					} catch (err) {
						alert("File tidak valid!");
					}
				};
				reader.readAsText(file);
			}

        // Initialize with sample data
          function initializeSampleData() {
			members = [];
			activities = [];
			equipment = [];
			renderAllTables();
			updateStats();
			}
						

			// === CRUD (tambahkan saveData setelah update) ===
			function deleteMember(id) { if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
				members = members.filter(m => m.id !== id);
			selectedMembers.delete(id);
			renderMembersTable();
			updateStats();
			saveData();
			}
		}


			function deleteActivity(id) {
			if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
			activities = activities.filter(a => a.id !== id);
			renderActivitiesTable();
			updateStats();
			saveData();
			}
			}

			 // 📌 Detail Kegiatan (popup)
				function viewActivity(id) {
					const activity = activities.find(a => a.id === id);
					if (!activity) return;

					alert(
					  `Nama Kegiatan: ${activity.name}\n` +
					  `Tanggal: ${activity.date ? new Date(activity.date).toLocaleDateString('id-ID') : '-' }\n` +
					  `Lokasi: ${activity.location}\n` +
					  `Peserta: ${activity.participants}\n` +
					  `Status: ${activity.status}`
					);
				}

				// 📌 Cetak Laporan Kegiatan
				function printActivity(id) {
					const activity = activities.find(a => a.id === id);
					if (!activity) return;

					const newWindow = window.open('', '', 'width=400,height=300');
					newWindow.document.write(`
						<html>
						<head>
							<title>Laporan Kegiatan</title>
							<style>
								body { font-family: Arial; text-align:center; padding:20px; }
								.card { border: 2px solid #000; padding: 10px; border-radius: 10px; display:inline-block; }
							</style>
						</head>
						<body>
							<div class="card">
								<h3>Laporan Kegiatan</h3>
								<p><strong>${activity.name}</strong></p>
								<p>Tanggal: ${activity.date ? new Date(activity.date).toLocaleDateString('id-ID') : '-'}</p>
								<p>Lokasi: ${activity.location}</p>
								<p>Peserta: ${activity.participants}</p>
								<p>Status: ${activity.status}</p>
								<hr>
								<small>TSCA Activity System</small>
							</div>
						</body>
						</html>
					`);
					newWindow.document.close();
					newWindow.print();
				}


		function deleteEquipment(id) {
		if (confirm('Apakah Anda yakin ingin menghapus peralatan ini?')) {
			equipment = equipment.filter(eq => eq.id !== id);
		renderEquipmentTable();
		updateStats();
		saveData();
		}
		}


		// === Inisialisasi ===
		document.addEventListener('DOMContentLoaded', function() {
		setupPhotoUpload();
		loadData();
		checkLoginStatus();
		});

        // Tab Navigation
        function showTab(tabName) {
            const tabs = document.querySelectorAll('.tab-content');
            const buttons = document.querySelectorAll('.tab-button');
            
            tabs.forEach(tab => tab.classList.remove('active'));
            buttons.forEach(btn => btn.classList.remove('active'));
            
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        // Stats Update
        function updateStats() {
            document.getElementById('totalMembers').textContent = members.length;
            document.getElementById('totalActivities').textContent = activities.length;
            document.getElementById('totalEquipment').textContent = equipment.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('activeMembers').textContent = members.filter(m => m.status === 'Aktif').length;
			document.getElementById('totalLetters').textContent    = lettersIn.length + lettersOut.length;
        }

        // Photo Upload Functions
        function setupPhotoUpload() {
            const photoInput = document.getElementById('memberPhoto');
            const photoPreview = document.getElementById('photoPreview');
            const uploadContainer = document.getElementById('photoUploadContainer');
            const uploadPrompt = document.getElementById('uploadPrompt');

            // File input change
            photoInput.addEventListener('change', function(e) {
                handlePhotoSelect(e.target.files[0]);
            });

            // Drag and drop
            uploadContainer.addEventListener('dragover', function(e) {
                e.preventDefault();
                uploadContainer.classList.add('drag-over');
            });

            uploadContainer.addEventListener('dragleave', function(e) {
                e.preventDefault();
                uploadContainer.classList.remove('drag-over');
            });

            uploadContainer.addEventListener('drop', function(e) {
                e.preventDefault();
                uploadContainer.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type.startsWith('image/')) {
                    handlePhotoSelect(files[0]);
                }
            });

            // Click to upload
            uploadContainer.addEventListener('click', function(e) {
                if (e.target.tagName !== 'BUTTON') {
                    photoInput.click();
                }
            });
        }

        function handlePhotoSelect(file) {
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                alert('Please select an image file.');
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size should be less than 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const photoPreview = document.getElementById('photoPreview');
                const uploadPrompt = document.getElementById('uploadPrompt');
                
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }

        function resetPhotoUpload() {
            const photoPreview = document.getElementById('photoPreview');
            const uploadPrompt = document.getElementById('uploadPrompt');
            const photoInput = document.getElementById('memberPhoto');
            
            photoPreview.src = '';
            photoPreview.style.display = 'none';
            uploadPrompt.style.display = 'block';
            photoInput.value = '';
        }

        // Members Functions
        function renderMembersTable() {
            const tbody = document.getElementById('membersTableBody');
            tbody.innerHTML = '';
            
            members.forEach((member, index) => {
                const row = tbody.insertRow();
                const shortAddress = member.address && member.address.length > 20 ? 
                    member.address.substring(0, 20) + '...' : member.address || '-';
                
                // Create photo cell
                let photoCell = '';
                if (member.photo) {
                    photoCell = `<img src="${member.photo}" alt="${member.name}" class="member-photo">`;
                } else {
                    photoCell = `<div class="no-photo">👤</div>`;
                }
                
                // Check if member is selected
                const isSelected = selectedMembers.has(member.id);
                if (isSelected) {
                    row.classList.add('selected-row');
                }
                
                row.innerHTML = `
                    <td><input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleMemberSelection(${member.id})" class="member-checkbox"></td>
                    <td>${index + 1}</td>
                    <td>${photoCell}</td>
                    <td><strong>${member.nat}</strong></td>
                    <td>${member.name}</td>
					<td>${member.birthPlace || ''}, ${member.birthDate || ''}</td>
                    <td>${member.email}</td>
                    <td>${member.phone}</td>
                    <td title="${member.address || '-'}">${shortAddress}</td>
                    <td><span class="status ${member.status.toLowerCase()}">${member.status}</span></td>
                    <td>${member.joinDate ? new Date(member.joinDate).toLocaleDateString('id-ID') : '-'}</td>
                   <td>
					<button class="btn btn-warning btn-action" title="Edit" onclick="editMember(${member.id})">✎</button>
					<button class="btn btn-danger btn-action" title="Hapus" onclick="deleteMember(${member.id})">🗑</button>
					<button class="btn btn-info btn-action" title="Detail" onclick="viewMember(${member.id})">ℹ️</button>
					<button class="btn btn-success btn-action" title="Cetak Kartu" onclick="printMemberCard(${member.id})">🖨</button>
				</td>

                `;
            });
            
            updateSelectedCount();
            updateSelectAllCheckbox();
        }

        // Member selection functions
        function toggleMemberSelection(memberId) {
            if (selectedMembers.has(memberId)) {
                selectedMembers.delete(memberId);
            } else {
                selectedMembers.add(memberId);
            }
            
            // Update row styling
            const checkboxes = document.querySelectorAll('.member-checkbox');
            checkboxes.forEach(checkbox => {
                const row = checkbox.closest('tr');
                const id = parseInt(checkbox.getAttribute('onchange').match(/\d+/)[0]);
                if (selectedMembers.has(id)) {
                    row.classList.add('selected-row');
                } else {
                    row.classList.remove('selected-row');
                }
            });
            
            updateSelectedCount();
            updateSelectAllCheckbox();
        }

        function selectAllMembers() {
            selectedMembers.clear();
            members.forEach(member => selectedMembers.add(member.id));
            renderMembersTable();
        }

        function unselectAllMembers() {
            selectedMembers.clear();
            renderMembersTable();
        }

        function toggleSelectAll() {
            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
            if (selectAllCheckbox.checked) {
                selectAllMembers();
            } else {
                unselectAllMembers();
            }
        }

        function updateSelectedCount() {
            const count = selectedMembers.size;
            document.getElementById('selectedCount').textContent = `${count} dipilih`;
        }

        function updateSelectAllCheckbox() {
            const selectAllCheckbox = document.getElementById('selectAllCheckbox');
            const totalMembers = members.length;
            const selectedCount = selectedMembers.size;
            
            if (selectedCount === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else if (selectedCount === totalMembers) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }

        // Export selected members functions
        function exportSelectedMembers() {
            if (selectedMembers.size === 0) {
                alert('Pilih minimal satu anggota untuk diekspor!');
                return;
            }
            
            const selectedMemberData = members.filter(member => selectedMembers.has(member.id));
            
            // Show export options modal
            const exportType = prompt('Pilih format export:\n1. CSV\n2. Excel\n\nKetik angka pilihan (1 atau 2):');
            
            if (exportType === '1') {
                exportSelectedToCSV(selectedMemberData);
            } else if (exportType === '2') {
                exportSelectedToExcel(selectedMemberData);
            } else if (exportType !== null) {
                alert('Pilihan tidak valid. Silakan pilih 1 untuk CSV atau 2 untuk Excel.');
            }
        }

        function exportSelectedToCSV(selectedData) {
            const headers = ['NAT', 'Nama', 'TLL', 'Email', 'Telepon', 'Alamat', 'Status', 'Tanggal Bergabung'];
            const filename = `data_anggota_pilihan_tsca_${new Date().toISOString().split('T')[0]}.csv`;
            
            let csvContent = headers.join(',') + '\n';
            
            selectedData.forEach(member => {
                const values = [
                    member.nat,
                    `"${member.name}"`,
					`"${member.birthPlace || ''}, ${member.birthDate || ''}"`,
                    member.email,
                    member.phone,
                    `"${member.address || ''}"`,
                    member.status,
                    member.joinDate
                ];
                csvContent += values.join(',') + '\n';
            });
            
            downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
        }

        function exportSelectedToExcel(selectedData) {
            const headers = ['NAT', 'Nama', 'TLL', 'Email', 'Telepon', 'Alamat', 'Status', 'Tanggal Bergabung'];
            const filename = `data_anggota_pilihan_tsca_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            const wsData = [headers];
            
            selectedData.forEach(member => {
                const values = [
                    member.nat,
                    member.name,
					`${member.birthPlace || ''}, ${member.birthDate || ''}`,
                    member.email,
                    member.phone,
                    member.address || '',
                    member.status,
                    member.joinDate
                ];
                wsData.push(values);
            });
            
            let csvContent = wsData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
            downloadFile(csvContent, filename, 'application/vnd.ms-excel');
        }

				function printSelectedMembers() {
				if (selectedMembers.size === 0) {
					alert('Pilih minimal satu anggota untuk dicetak!');
					return;
				}

				const selectedMemberData = members.filter(member => selectedMembers.has(member.id));

				const printWindow = window.open('', '_blank');
				printWindow.document.write(`
					<html>
					<head>
						<title>Data Anggota Terpilih TSCA</title>
						<style>
							body { font-family: Arial, sans-serif; margin: 20px; }
							h1 { text-align: center; color: #4a7c59; }
							table { width: 100%; border-collapse: collapse; margin-top: 20px; }
							th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
							th { background-color: #f8f9fa; font-weight: bold; }
							.header-info { text-align: center; margin-bottom: 30px; }
							.footer { margin-top: 30px; text-align: right; font-size: 12px; }
							.selection-info { background-color: #e8f5e8; padding: 10px; margin: 20px 0; border-radius: 5px; }
						</style>
					</head>
					<body>
						<div class="header-info">
							<h1>TROPIS SULAWESI CINTA ALAM</h1>
							<p>Data Anggota Terpilih - Dicetak pada ${new Date().toLocaleDateString('id-ID')}</p>
						</div>
						<div class="selection-info">
							<strong>Anggota yang dipilih: ${selectedMemberData.length} dari ${members.length} total anggota</strong>
						</div>
						<table>
							<thead>
								<tr>
									<th>NAT</th>
									<th>Nama</th>
									<th>TLL</th>
									<th>Email</th>
									<th>Telepon</th>
									<th>Alamat</th>
								</tr>
							</thead>
							<tbody>
								${selectedMemberData.map(member => {
									const ttl = (member.birthPlace || '') + 
											   (member.birthDate ? ', ' + new Date(member.birthDate).toLocaleDateString('id-ID') : '');
									return `
										<tr>
											<td>${member.nat || ''}</td>
											<td>${member.name || ''}</td>
											<td>${ttl}</td>
											<td>${member.email || ''}</td>
											<td>${member.phone || ''}</td>
											<td>${member.address || ''}</td>
										</tr>
									`;
								}).join('')}
							</tbody>
						</table>
						<div class="footer">
							<p>Total Anggota Dipilih: ${selectedMemberData.length}</p>
						</div>
					</body>
					</html>
				`);
				printWindow.document.close();
				printWindow.print();
			}


        // Utility function for file download
        function downloadFile(content, filename, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function showAddMemberModal() {
            currentEditingMember = null;
            document.getElementById('memberModalTitle').textContent = 'Tambah Anggota';
            document.getElementById('memberForm').reset();
            document.getElementById('memberId').value = '';
            resetPhotoUpload();
            document.getElementById('memberModal').style.display = 'block';
        }

        function editMember(id) {
            const member = members.find(m => m.id === id);
            if (!member) return;
            
            currentEditingMember = member;
            document.getElementById('memberModalTitle').textContent = 'Edit Anggota';
            document.getElementById('memberId').value = member.id;
            document.getElementById('memberNAT').value = member.nat;
            document.getElementById('memberName').value = member.name;
			document.getElementById('memberBirthPlace').value = member.birthPlace || '';
			document.getElementById('memberBirthDate').value = member.birthDate || '';
            document.getElementById('memberEmail').value = member.email;
            document.getElementById('memberPhone').value = member.phone;
            document.getElementById('memberStatus').value = member.status;
			
			document.getElementById('memberJoinDate').value = member.joinDate || '';
            document.getElementById('memberAddress').value = member.address;
            
            // Handle photo preview
            if (member.photo) {
                const photoPreview = document.getElementById('photoPreview');
                const uploadPrompt = document.getElementById('uploadPrompt');
                photoPreview.src = member.photo;
                photoPreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
            } else {
                resetPhotoUpload();
            }
            
            document.getElementById('memberModal').style.display = 'block';
        }

        function deleteMember(id) {
            if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
                members = members.filter(m => m.id !== id);
                selectedMembers.delete(id); // Remove from selection if deleted
                renderMembersTable();
                updateStats();
            }
        }
		 // 📌 Cetak Kartu Anggota Modern (format: NAT, Nama, TTL, Alamat)
			function printMemberCard(id) {
			  const member = members.find(m => m.id === id);
			  if (!member) return;
			  
			  const newWindow = window.open('', '', 'width=700,height=500');
			  newWindow.document.write(`
				<html>
				<head>
				  <title>Kartu Anggota TSCA</title>
				  <style>
					@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
					
					* {
					  margin: 0;
					  padding: 0;
					  box-sizing: border-box;
					}
					
					body {
					  font-family: 'Poppins', sans-serif;
					  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					  min-height: 100vh;
					  display: flex;
					  align-items: center;
					  justify-content: center;
					  padding: 20px;
					}
					
					.card-container {
					  perspective: 1000px;
					}
					
					.card {
					  position: relative;
					  width: 650px;
					  height: 420px;
					  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%);
					  border-radius: 20px;
					  box-shadow: 
						0 20px 40px rgba(0, 0, 0, 0.1),
						0 15px 12px rgba(0, 0, 0, 0.08),
						inset 0 1px 0 rgba(255, 255, 255, 0.9);
					  overflow: hidden;
					  transform: rotateY(0deg);
					  transition: transform 0.3s ease;
					}
					
					.card:hover {
					  transform: rotateY(-2deg) rotateX(2deg);
					}
					
					/* Header dengan pattern geometric */
					.header {
					  position: relative;
					  height: 120px;
					  background: linear-gradient(135deg, #2c5530 0%, #4a7c59 50%, #5d9cec 100%);
					  display: flex;
					  align-items: center;
					  justify-content: center;
					  overflow: hidden;
					}
					
					.header::before {
					  content: '';
					  position: absolute;
					  top: -50%;
					  left: -50%;
					  width: 200%;
					  height: 200%;
					  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
					  animation: float 20s ease-in-out infinite;
					}
					
					@keyframes float {
					  0%, 100% { transform: translateX(0px) translateY(0px); }
					  33% { transform: translateX(-10px) translateY(-10px); }
					  66% { transform: translateX(10px) translateY(10px); }
					}
					
					.header-content {
					  position: relative;
					  text-align: center;
					  color: white;
					  z-index: 2;
					}
					
					.org-name {
					  font-size: 24px;
					  font-weight: 700;
					  letter-spacing: 2px;
					  margin-bottom: 5px;
					  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
					}
					
					.org-subtitle {
					  font-size: 11px;
					  font-weight: 300;
					  opacity: 0.9;
					  letter-spacing: 1px;
					}
					
					.registration-info {
					  font-size: 10px;
					  margin-top: 8px;
					  line-height: 1.4;
					  opacity: 0.8;
					}
					
					/* Body section */
					.body {
					  position: relative;
					  padding: 25px;
					  height: calc(100% - 120px);
					  display: flex;
					  gap: 25px;
					}
					
					/* Photo section dengan frame modern */
					.photo-container {
					  position: relative;
					  width: 140px;
					  height: 180px;
					  flex-shrink: 0;
					}
					
					.photo-frame {
					  width: 100%;
					  height: 100%;
					  border-radius: 15px;
					  overflow: hidden;
					  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
					  border: 3px solid #fff;
					  box-shadow: 
						0 8px 25px rgba(0, 0, 0, 0.15),
						inset 0 1px 0 rgba(255, 255, 255, 0.8);
					  position: relative;
					}
					
					.photo-frame::before {
					  content: '';
					  position: absolute;
					  top: -2px;
					  left: -2px;
					  right: -2px;
					  bottom: -2px;
					  background: linear-gradient(45deg, #667eea, #764ba2);
					  border-radius: 18px;
					  z-index: -1;
					}
					
					.photo-frame img {
					  width: 100%;
					  height: 100%;
					  object-fit: cover;
					}
					
					.no-photo {
					  display: flex;
					  align-items: center;
					  justify-content: center;
					  height: 100%;
					  color: #6c757d;
					  font-size: 12px;
					  text-align: center;
					  flex-direction: column;
					}
					
					.photo-icon {
					  width: 40px;
					  height: 40px;
					  background: #dee2e6;
					  border-radius: 50%;
					  margin-bottom: 8px;
					  display: flex;
					  align-items: center;
					  justify-content: center;
					}
					
					/* Member info dengan styling modern */
					.member-info {
					  flex: 1;
					  display: flex;
					  flex-direction: column;
					  justify-content: space-between;
					}
					
					.info-section {
					  display: flex;
					  flex-direction: column;
					  gap: 15px;
					}
					
					.info-item {
					  position: relative;
					  padding: 12px 0;
					  border-bottom: 1px solid #e9ecef;
					}
					
					.info-item:last-child {
					  border-bottom: none;
					}
					
					.info-label {
					  font-size: 11px;
					  font-weight: 600;
					  color: #6c757d;
					  text-transform: uppercase;
					  letter-spacing: 1px;
					  margin-bottom: 4px;
					}
					
					.info-value {
					  font-size: 16px;
					  font-weight: 500;
					  color: #212529;
					  line-height: 1.3;
					}
					
					.info-value.nat {
					  font-size: 20px;
					  font-weight: 700;
					  color: #2c5530;
					}
					
					/* Footer dengan QR placeholder dan branding */
					.footer {
					  position: absolute;
					  bottom: 0;
					  left: 0;
					  right: 0;
					  height: 50px;
					  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%);
					  display: flex;
					  align-items: center;
					  justify-content: space-between;
					  padding: 0 25px;
					  border-top: 1px solid #dee2e6;
					}
					
					.qr-placeholder {
					  width: 35px;
					  height: 35px;
					  background: linear-gradient(135deg, #667eea, #764ba2);
					  border-radius: 8px;
					  display: flex;
					  align-items: center;
					  justify-content: center;
					  color: white;
					  font-size: 10px;
					  font-weight: 600;
					}
					
					.footer-text {
					  font-size: 11px;
					  color: #6c757d;
					  font-weight: 500;
					}
					
					.validity {
					  font-size: 10px;
					  color: #28a745;
					  font-weight: 600;
					}
					
					/* Print optimization */
					@media print {
					  body {
						background: white !important;
						padding: 0 !important;
					  }
					  
					  .card {
						box-shadow: none !important;
						border: 2px solid #000 !important;
					  }
					  
					  .card:hover {
						transform: none !important;
					  }
					}
				  </style>
				</head>
				<body>
				  <div class="card-container">
					<div class="card">
					  <div class="header">
						<div class="header-content">
						  <div class="org-name">TROPIS SULAWESI CINTA ALAM</div>
						  <div class="org-subtitle">MEMBER IDENTIFICATION CARD</div>
						  <div class="registration-info">
							Sekretariat: Jln Paccerakang, Daya<br>
							Terdaftar Nomor: 220/1163-1/KKB-2001
						  </div>
						</div>
					  </div>
					  
					  <div class="body">
						<div class="photo-container">
						  <div class="photo-frame">
							${member.photo ? 
							  `<img src="${member.photo}" alt="Member Photo">` : 
							  `<div class="no-photo">
								 <div class="photo-icon">👤</div>
								 <span>No Photo</span>
							   </div>`
							}
						  </div>
						</div>
						
						<div class="member-info">
						  <div class="info-section">
							<div class="info-item">
							  <div class="info-label">Nomor Anggota Tetap</div>
							  <div class="info-value nat">${member.nat || '-'}</div>
							</div>
							
							<div class="info-item">
							  <div class="info-label">Nama Lengkap</div>
							  <div class="info-value">${member.name || '-'}</div>
							</div>
							
							<div class="info-item">
							  <div class="info-label">Tempat, Tanggal Lahir</div>
							  <div class="info-value">
								${(member.birthPlace || '') + 
								  (member.birthDate ? ', ' + new Date(member.birthDate).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'long', 
									year: 'numeric'
								  }) : '') || '-'}
							  </div>
							</div>
							
							<div class="info-item">
							  <div class="info-label">Alamat</div>
							  <div class="info-value">${member.address || '-'}</div>
							</div>
						  </div>
						</div>
					  </div>
					  
					  <div class="footer">
						<div class="qr-placeholder">QR</div>
						<div class="footer-text">TSCA Membership System</div>
						<div class="validity">VALID ${new Date().getFullYear()}</div>
					  </div>
					</div>
				  </div>
				</body>
				</html>
			  `);
			  newWindow.document.close();
			  newWindow.print();
			}





        // Update search function to maintain selections
        function searchMembers() {
            const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
            const rows = document.querySelectorAll('#membersTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
            
            updateSelectedCount(); // Update count for visible rows
        }

        function closeMemberModal() {
            document.getElementById('memberModal').style.display = 'none';
        }

        // Activities Functions
        function renderActivitiesTable() {
            const tbody = document.getElementById('activitiesTableBody');
            tbody.innerHTML = '';
            
            activities.forEach((activity, index) => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${activity.name}</td>
                    <td>${new Date(activity.date).toLocaleDateString('id-ID')}</td>
                    <td>${activity.location}</td>
                    <td>${activity.participants}</td>
                    <td><span class="status ${activity.status.toLowerCase()}">${activity.status}</span></td>
                    <td>
					<button class="btn btn-warning btn-action" title="Edit" onclick="editActivity(${activity.id})">✎</button>
					<button class="btn btn-danger btn-action" title="Hapus" onclick="deleteActivity(${activity.id})">🗑</button>
					<button class="btn btn-info btn-action" title="Detail" onclick="viewActivity(${activity.id})">ℹ️</button>
					<button class="btn btn-success btn-action" title="Cetak" onclick="printActivity(${activity.id})">🖨</button>
				</td>


                `;
            });
        }

        function showAddActivityModal() {
            currentEditingActivity = null;
            document.getElementById('activityModalTitle').textContent = 'Tambah Kegiatan';
            document.getElementById('activityForm').reset();
            document.getElementById('activityId').value = '';
            document.getElementById('activityModal').style.display = 'block';
        }

        function editActivity(id) {
            const activity = activities.find(a => a.id === id);
            if (!activity) return;
            
            currentEditingActivity = activity;
            document.getElementById('activityModalTitle').textContent = 'Edit Kegiatan';
            document.getElementById('activityId').value = activity.id;
            document.getElementById('activityName').value = activity.name;
            document.getElementById('activityDate').value = activity.date;
            document.getElementById('activityLocation').value = activity.location;
            document.getElementById('activityParticipants').value = activity.participants;
            document.getElementById('activityStatus').value = activity.status;
            document.getElementById('activityDescription').value = activity.description;
            document.getElementById('activityModal').style.display = 'block';
        }
		
		function closeActivityModal() {
		document.getElementById('activityModal').style.display = 'none';
		document.getElementById('activityForm').reset();
		if (typeof currentEditingActivity !== 'undefined') {
			currentEditingActivity = null;
		}
	}


        function deleteActivity(id) {
            if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
                activities = activities.filter(a => a.id !== id);
                renderActivitiesTable();
                updateStats();
            }
        }

			let selectedEquipment = new Set();

		function renderEquipmentTable() {
					const tbody = document.getElementById('equipmentTableBody');
					tbody.innerHTML = '';
					equipment.forEach((item, index) => {
					const isSelected = selectedEquipment.has(item.id);
					const row = tbody.insertRow();
					if (isSelected) row.classList.add('selected-row');


					row.innerHTML = `
					<td><input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleEquipmentSelection(${item.id})"></td>
					<td>${index + 1}</td>
					<td>${item.name}</td>
					<td>${item.category}</td>
					<td><span class="status ${item.condition.toLowerCase()}">${item.condition}</span></td>
					<td>${item.quantity}</td>
					<td title="${item.notes || ''}">${item.notes ? item.notes.substring(0, 20) + (item.notes.length > 20 ? '...' : '') : '-'}</td>
					<td>
					<button class="btn btn-warning btn-action" onclick="editEquipment(${item.id})">✎</button>
					<button class="btn btn-danger btn-action" onclick="deleteEquipment(${item.id})">🗑</button>
					</td>
					`;
					});
					updateSelectedEquipmentCount();
					updateSelectAllEquipmentCheckbox();
					}


					function toggleEquipmentSelection(id) {
					if (selectedEquipment.has(id)) {
					selectedEquipment.delete(id);
					} else {
					selectedEquipment.add(id);
					}
					renderEquipmentTable();
					}


					function selectAllEquipment() {
					selectedEquipment.clear();
					equipment.forEach(item => selectedEquipment.add(item.id));
					renderEquipmentTable();
					}


					function unselectAllEquipment() {
					selectedEquipment.clear();
					renderEquipmentTable();
					}


					function toggleSelectAllEquipment() {
					const selectAllCheckbox = document.getElementById('selectAllEquipmentCheckbox');
					if (selectAllCheckbox.checked) {
					selectAllEquipment();
					} else {
					unselectAllEquipment();
					}
					}


					function updateSelectedEquipmentCount() {
					}
					   
        function showAddEquipmentModal() {
            currentEditingEquipment = null;
            document.getElementById('equipmentModalTitle').textContent = 'Tambah Peralatan';
            document.getElementById('equipmentForm').reset();
            document.getElementById('equipmentId').value = '';
            document.getElementById('equipmentModal').style.display = 'block';
        }

        function editEquipment(id) {
            const item = equipment.find(e => e.id === id);
            if (!item) return;
            
            currentEditingEquipment = item;
            document.getElementById('equipmentModalTitle').textContent = 'Edit Peralatan';
            document.getElementById('equipmentId').value = item.id;
            document.getElementById('equipmentName').value = item.name;
            document.getElementById('equipmentCategory').value = item.category;
            document.getElementById('equipmentCondition').value = item.condition;
            document.getElementById('equipmentQuantity').value = item.quantity;
            document.getElementById('equipmentNotes').value = item.notes;
            document.getElementById('equipmentModal').style.display = 'block';
        }

        function deleteEquipment(id) {
            if (confirm('Apakah Anda yakin ingin menghapus peralatan ini?')) {
                equipment = equipment.filter(e => e.id !== id);
                renderEquipmentTable();
                updateStats();
            }
        }

        function closeEquipmentModal() {
            document.getElementById('equipmentModal').style.display = 'none';
        }

        // Export Functions
        function exportToCSV(dataType) {
            let data, filename, headers;
            
            switch(dataType) {
			    case 'members':
					data = members;
					filename = 'data_anggota_tsca.csv';
					headers = ['NAT', 'Nama', 'TLL', 'Email', 'Telepon', 'Alamat', 'Status', 'Tanggal Bergabung']; // 👈 tambah TLL
					break;

                case 'activities':
                    data = activities;
                    filename = 'data_kegiatan_tsca.csv';
                    headers = ['Nama Kegiatan', 'Tanggal', 'Lokasi', 'Peserta', 'Status', 'Deskripsi'];
                    break;
                case 'equipment':
                    data = equipment;
                    filename = 'data_peralatan_tsca.csv';
                    headers = ['Nama Peralatan', 'Kategori', 'Kondisi', 'Jumlah', 'Keterangan'];
                    break;
            }
            
            let csvContent = headers.join(',') + '\n';
            
            data.forEach(row => {
                let values;
                switch(dataType) {
                    case 'members':
                        values = [
                            row.nat,
                            `"${row.name}"`,
							`"${row.birthPlace || ''}, ${row.birthDate || ''}"`,
                            row.email,
                            row.phone,
                            `"${row.address || ''}"`,
                            row.status,
                            row.joinDate ? new Date(row.joinDate).toLocaleDateString('id-ID') : ''

                        ];
                        break;
                    case 'activities':
                        values = [
                            `"${row.name}"`,
                            row.date,
                            `"${row.location}"`,
                            row.participants,
                            row.status,
                            `"${row.description || ''}"`
                        ];
                        break;
                    case 'equipment':
                        values = [
                            `"${row.name}"`,
                            row.category,
                            row.condition,
                            row.quantity,
                            `"${row.notes || ''}"`
                        ];
                        break;
                }
                csvContent += values.join(',') + '\n';
            });
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function exportToExcel(dataType) {
            let data, filename, headers;
            
            switch(dataType) {
                case 'members':
                    data = members;
                    filename = 'data_anggota_tsca.xlsx';
                    headers = ['NAT', 'Nama', 'TTL','Email', 'Telepon', 'Alamat', 'Status', 'Tanggal Bergabung'];
                    break;
                case 'activities':
                    data = activities;
                    filename = 'data_kegiatan_tsca.xlsx';
                    headers = ['Nama Kegiatan', 'Tanggal', 'Lokasi', 'Peserta', 'Status', 'Deskripsi'];
                    break;
                case 'equipment':
                    data = equipment;
                    filename = 'data_peralatan_tsca.xlsx';
                    headers = ['Nama Peralatan', 'Kategori', 'Kondisi', 'Jumlah', 'Keterangan'];
                    break;
            }
            
            // Create worksheet data
            const wsData = [headers];
            
            data.forEach(row => {
                let values;
                switch(dataType) {
                    case 'members':
                        values = [
                            row.nat,
                            row.name,
						`"${row.birthPlace || ''}, ${row.birthDate || ''}"`,
                            row.email,
                            row.phone,
                            row.address || '',
                            row.status,
                            row.joinDate ? new Date(row.joinDate).toLocaleDateString('id-ID') : ''

                        ];
                        break;
                    case 'activities':
                        values = [
                            row.name,
                            row.date,
                            row.location,
                            row.participants,
                            row.status,
                            row.description || ''
                        ];
                        break;
                    case 'equipment':
                        values = [
                            row.name,
                            row.category,
                            row.condition,
                            row.quantity,
                            row.notes || ''
                        ];
                        break;
                }
                wsData.push(values);
            });
            
            // Simple Excel export (basic implementation)
            // For more advanced Excel features, you would need a library like SheetJS
            let csvContent = wsData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

						// Print Functions
				function printMemberList() {
					const printWindow = window.open('', '_blank');
					printWindow.document.write(`
						<html>
						<head>
							<title>Data Anggota TSCA</title>
							<style>
								body { font-family: Arial, sans-serif; margin: 20px; }
								h1 { text-align: center; color: #4a7c59; }
								table { width: 100%; border-collapse: collapse; margin-top: 20px; }
								th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
								th { background-color: #f8f9fa; font-weight: bold; }
								.header-info { text-align: center; margin-bottom: 30px; }
								.footer { margin-top: 30px; text-align: right; font-size: 12px; }
							</style>
						</head>
						<body>
							<div class="header-info">
								<h1>TROPIS SULAWESI CINTA ALAM</h1>
								<p>Data Anggota - Dicetak pada ${new Date().toLocaleDateString('id-ID')}</p>
							</div>
							<table>
								<thead>
									<tr>
										<th>No</th>
										<th>NAT</th>
										<th>Nama</th>
										<th>TLL</th>
										<th>Email</th>
										<th>Telepon</th>
										<th>Alamat</th>
									</tr>
								</thead>
								<tbody>
									${members.map((member, index) => {
										const ttl = (member.birthPlace || '') + 
												   (member.birthDate ? ', ' + new Date(member.birthDate).toLocaleDateString('id-ID') : '');
										return `
											<tr>
												<td>${index + 1}</td>
												<td>${member.nat || ''}</td>
												<td>${member.name || ''}</td>
												<td>${ttl}</td>
												<td>${member.email || ''}</td>
												<td>${member.phone || ''}</td>
												<td>${member.address || ''}</td>
											</tr>
										`;
									}).join('')}
								</tbody>
							</table>
							<div class="footer">
								<p>Total Anggota: ${members.length}</p>
							</div>
						</body>
						</html>
					`);
					printWindow.document.close();
					printWindow.print();
				}


							function printActivity(id) {
				const activity = activities.find(a => a.id === id);
				if (!activity) return;

				const newWindow = window.open('', '', 'width=600,height=400');
				newWindow.document.write(`
					<html>
					<head>
						<title>Laporan Kegiatan</title>
						<style>
							body { font-family: Georgia, serif; padding: 20px; }
							.report {
								border: 3px solid #333;
								padding: 20px;
								border-radius: 10px;
								background: #fdfdfd;
							}
							h2 {
								text-align: center;
								margin-bottom: 20px;
								text-transform: uppercase;
							}
							.row {
								margin: 8px 0;
								font-size: 16px;
							}
							.label {
								font-weight: bold;
								display: inline-block;
								width: 120px;
							}
							.footer {
								text-align: center;
								margin-top: 20px;
								font-size: 12px;
								color: #555;
							}
						</style>
					</head>
					<body>
						<div class="report">
							<h2>Laporan Kegiatan</h2>
							<div class="row"><span class="label">Nama:</span> ${activity.name}</div>
							<div class="row"><span class="label">Tanggal:</span> ${activity.date ? new Date(activity.date).toLocaleDateString('id-ID') : '-'}</div>
							<div class="row"><span class="label">Lokasi:</span> ${activity.location}</div>
							<div class="row"><span class="label">Peserta:</span> ${activity.participants}</div>
							<div class="row"><span class="label">Status:</span> ${activity.status}</div>
						</div>
						<div class="footer">TSCA Activity System</div>
					</body>
					</html>
				`);
				newWindow.document.close();
				newWindow.print();
			}



        // Form Submissions
        document.getElementById('memberForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const memberData = {
                nat: document.getElementById('memberNAT').value,
                name: document.getElementById('memberName').value,
				birthPlace: document.getElementById('memberBirthPlace').value,
				birthDate: document.getElementById('memberBirthDate').value,
                email: document.getElementById('memberEmail').value,
                phone: document.getElementById('memberPhone').value,
                status: document.getElementById('memberStatus').value,
                address: document.getElementById('memberAddress').value,
				joinDate: document.getElementById('memberJoinDate').value || new Date().toISOString(), 
                photo: document.getElementById('photoPreview').src || null
            };

            // Check if NAT already exists (for new members or different member)
            const existingMember = members.find(m => m.nat === memberData.nat && (!currentEditingMember || m.id !== currentEditingMember.id));
            if (existingMember) {
                alert('Nomor Anggota (NAT) sudah digunakan!');
                return;
            }

            if (currentEditingMember) {
                const index = members.findIndex(m => m.id === currentEditingMember.id);
                members[index] = { ...currentEditingMember, ...memberData };
            } else {
                const newId = Math.max(...members.map(m => m.id), 0) + 1;
                members.push({
                    id: newId,
                    ...memberData,
                    joinDate: new Date().toISOString().split('T')[0]
                });
            }
            
            renderMembersTable();
            updateStats();
			saveData(); 
            closeMemberModal();
        });

        document.getElementById('activityForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const activityData = {
                name: document.getElementById('activityName').value,
                date: document.getElementById('activityDate').value,
                location: document.getElementById('activityLocation').value,
                participants: parseInt(document.getElementById('activityParticipants').value),
                status: document.getElementById('activityStatus').value,
                description: document.getElementById('activityDescription').value
            };

            if (currentEditingActivity) {
                const index = activities.findIndex(a => a.id === currentEditingActivity.id);
                activities[index] = { ...currentEditingActivity, ...activityData };
            } else {
                const newId = Math.max(...activities.map(a => a.id), 0) + 1;
                activities.push({ id: newId, ...activityData });
            }
            
            renderActivitiesTable();
            updateStats();
			saveData(); 
            closeActivityModal();
        });

        document.getElementById('equipmentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const equipmentData = {
                name: document.getElementById('equipmentName').value,
                category: document.getElementById('equipmentCategory').value,
                condition: document.getElementById('equipmentCondition').value,
                quantity: parseInt(document.getElementById('equipmentQuantity').value),
                notes: document.getElementById('equipmentNotes').value
            };

            if (currentEditingEquipment) {
                const index = equipment.findIndex(e => e.id === currentEditingEquipment.id);
                equipment[index] = { ...currentEditingEquipment, ...equipmentData };
            } else {
                const newId = Math.max(...equipment.map(e => e.id), 0) + 1;
                equipment.push({ id: newId, ...equipmentData });
            }
            
            renderEquipmentTable();
            updateStats();
			saveData(); 
            closeEquipmentModal();
        });

        // Search Functions
        function searchMembers() {
            const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
            const rows = document.querySelectorAll('#membersTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }

        function searchActivities() {
            const searchTerm = document.getElementById('activitySearch').value.toLowerCase();
            const rows = document.querySelectorAll('#activitiesTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }

        function searchEquipment() {
            const searchTerm = document.getElementById('equipmentSearch').value.toLowerCase();
            const rows = document.querySelectorAll('#equipmentTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }

        // Render all tables
        function renderAllTables() {
            renderMembersTable();
            renderActivitiesTable();
            renderEquipmentTable();
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
		// Initialize the application
		document.addEventListener('DOMContentLoaded', function() {
		setupPhotoUpload();
		loadData();           // ambil dari localStorage
		checkLoginStatus();   // tampilkan login atau mainApp
	});
    

			// === FIX: missing Equipment helpers & print ===

			function updateSelectAllEquipmentCheckbox() {
				try {
					const cb = document.getElementById('selectAllEquipmentCheckbox');
					if (!cb) return;
					const total = Array.isArray(equipment) ? equipment.length : 0;
					const sel = (typeof selectedEquipment !== 'undefined') ? selectedEquipment.size : 0;
					if (sel === 0) {
						cb.checked = false;
						cb.indeterminate = false;
					} else if (sel === total && total > 0) {
						cb.checked = true;
						cb.indeterminate = false;
					} else {
						cb.checked = false;
						cb.indeterminate = true;
					}
				} catch (e) {
					console.error('updateSelectAllEquipmentCheckbox error', e);
				}
			}


				function buildEquipmentPrintHTML(list, title) {
					const rows = list.map((item, idx) => `
						<tr>
							<td>${idx + 1}</td>
							<td>${item.name || ''}</td>
							<td>${item.category || ''}</td>
							<td>${item.condition || ''}</td>
							<td>${item.quantity != null ? item.quantity : ''}</td>
							<td>${item.notes ? item.notes : '-'}</td>
						</tr>
					`).join('');
					return `<!doctype html>
				<html>
				<head>
				<meta charset="utf-8">
				<title>${title}</title>
				<style>
					body { font-family: Arial, sans-serif; padding: 16px; }
					h1 { text-align: center; margin-bottom: 12px; }
					.meta { text-align:center; margin-bottom: 16px; font-size: 12px; color: #555; }
					table { width: 100%; border-collapse: collapse; }
					th, td { border: 1px solid #333; padding: 8px; font-size: 12px; }
					th { background: #f2f2f2; }
					.footer { margin-top: 16px; text-align: right; font-size: 10px; color: #666; }
					@media print {
						@page { size: A4; margin: 12mm; }
					}
				</style>
				</head>
				<body>
					<h1>${title}</h1>
					<div class="meta">Dicetak: ${new Date().toLocaleString('id-ID')}</div>
					<table>
						<thead>
							<tr>
								<th>No</th>
								<th>Nama Peralatan</th>
								<th>Kategori</th>
								<th>Kondisi</th>
								<th>Jumlah</th>
								<th>Keterangan</th>
							</tr>
						</thead>
						<tbody>${rows}</tbody>
					</table>
					<div class="footer">TSCA Equipment System</div>
				</body>
				</html>`;
				}


				function printEquipmentList() {
					try {
						if (!Array.isArray(equipment)) { alert('Data peralatan kosong.'); return; }
						const w = window.open('', '_blank');
						if (!w) { alert('Pop-up diblokir. Izinkan pop-up untuk situs ini.'); return; }
						const html = buildEquipmentPrintHTML(equipment, 'Data Peralatan - Dicetak');
						w.document.open();
						w.document.write(html);
						w.document.close();
						setTimeout(() => { w.focus(); w.print(); }, 200);
					} catch (e) {
						console.error('printEquipmentList error', e);
						alert('Gagal mencetak. Lihat konsol untuk detail.');
					}
				}


				function printSelectedEquipment() {
					try {
						if (typeof selectedEquipment === 'undefined' || selectedEquipment.size === 0) {
							alert('Pilih minimal satu peralatan terlebih dahulu.');
							return;
						}
						const list = equipment.filter(it => selectedEquipment.has(it.id));
						if (list.length === 0) {
							alert('Tidak ada data terpilih untuk dicetak.'); 
							return;
						}
						const w = window.open('', '_blank');
						if (!w) { alert('Pop-up diblokir. Izinkan pop-up untuk situs ini.'); return; }
						const html = buildEquipmentPrintHTML(list, 'Data Peralatan (Pilihan) - Dicetak');
						w.document.open();
						w.document.write(html);
						w.document.close();
						setTimeout(() => { w.focus(); w.print(); }, 200);
					} catch (e) {
						console.error('printSelectedEquipment error', e);
						alert('Gagal mencetak. Lihat konsol untuk detail.');
					}
				}

				/* ============================== VARIABEL GLOBAL	================================= */
						let lettersIn = JSON.parse(localStorage.getItem('lettersIn') || '[]');
						let lettersOut = JSON.parse(localStorage.getItem('lettersOut') || '[]');
						let currentLetterType = 'in'; // default tab

				/* ==============================   UTILITAS RENDER ================================ */
						function renderLetters(type) {
						  const tbody = type === 'in' ? document.getElementById('lettersInBody')
													  : document.getElementById('lettersOutBody');
						  const data  = type === 'in' ? lettersIn : lettersOut;

						  tbody.innerHTML = '';
						  data.forEach((letter, idx) => {
							const tr = document.createElement('tr');
							tr.innerHTML = `
							  <td><input type="checkbox" class="letters-${type}-checkbox"></td>
							  <td>${idx + 1}</td>
							  <td>${letter.number}</td>
							  <td>${letter.date}</td>
							  <td>${letter.destination}</td>
							  <td>${letter.subject}</td>
							  <td>
								${letter.pdf ? `<a href="${letter.pdf}" target="_blank">📎 Lihat PDF</a>` : '-'}
							  </td>
							  <td>${letter.status}</td>
							  <td>
								<button class="btn-edit" onclick="showEditLetterModal('${type}', ${idx})">✏️</button>
								<button class="btn-delete" onclick="deleteLetter('${type}', ${idx})">🗑️</button>
							  </td>`;
							tbody.appendChild(tr);
						  });
						  updateSelectedCount(type);
						  saveToLocal();
						}

						/* Simpan ke localStorage */
						function saveToLocal() {
						  localStorage.setItem('lettersIn', JSON.stringify(lettersIn));
						  localStorage.setItem('lettersOut', JSON.stringify(lettersOut));
						}
             
				/* ============================== MODAL TAMBAH	================================= */
						function showAddLetterModal() {
						  document.getElementById('addLetterForm').reset();
						  document.getElementById('addLetterModal').style.display = 'block';
						}
						function closeAddLetterModal() {
						  document.getElementById('addLetterModal').style.display = 'none';
						}

						/* Tambah surat */
						function addLetter(e) {
						  e.preventDefault();
						  const fileInput = document.getElementById('letterPdf');
						  const file = fileInput.files[0];
						  const fileURL = file ? URL.createObjectURL(file) : '';

						  const letter = {
							number: document.getElementById('letterNumber').value,
							date: document.getElementById('letterDate').value,
							destination: document.getElementById('letterDestination').value,
							subject: document.getElementById('letterSubject').value,
							pdf: fileURL,
							status: document.getElementById('letterStatus').value
						  };

					 if (currentLetterType === 'in') {
							lettersIn.push(letter);
							localStorage.setItem('lettersIn', JSON.stringify(lettersIn));   // simpan
						} else {
							lettersOut.push(letter);
							localStorage.setItem('lettersOut', JSON.stringify(lettersOut)); // simpan
						}

						  renderLetters(currentLetterType);
						  closeAddLetterModal();
						}

				function showEditLetterModal(type, idx) {
					  const modal = document.getElementById('editLetterModal');
					  const data = type === 'in' ? lettersIn[idx] : lettersOut[idx];

					  modal.innerHTML = `
						<div class="modal-content">
						  <span class="close" onclick="closeEditLetterModal()">&times;</span>
						  <h2>Edit Surat</h2>

						  <form onsubmit="updateLetter(event, '${type}', ${idx})" class="form-grid">
							<div class="form-group">
							  <label for="editNumber">Nomor Surat</label>
							  <input type="text" id="editNumber" value="${data.number}" required>
							</div>

							<div class="form-group">
							  <label for="editDate">Tanggal</label>
							  <input type="date" id="editDate" value="${data.date}" required>
							</div>

							<div class="form-group">
							  <label for="editDest">Tujuan / Pengirim</label>
							  <input type="text" id="editDest" value="${data.destination}" required>
							</div>

							<div class="form-group full-width">
							  <label for="editSubject">Perihal</label>
							  <input type="text" id="editSubject" value="${data.subject}" required>
							</div>

							<div class="form-group full-width">
							  <label for="editPdf">Ganti File PDF (kosongkan jika tidak diganti)</label>
							  <input type="file" id="editPdf" accept="application/pdf">
							</div>

							<div class="form-group">
							  <label for="editStatus">Status</label>
							  <select id="editStatus" required>
								<option value="Terkirim" ${data.status === 'Terkirim' ? 'selected' : ''}>Terkirim</option>
								<option value="Proses" ${data.status === 'Proses' ? 'selected' : ''}>Proses</option>
								<option value="Draft" ${data.status === 'Draft' ? 'selected' : ''}>Draft</option>
							  </select>
							</div>

							<div class="form-actions">
							  <button type="submit" class="btn btn-primary">💾 Simpan</button>
							  <button type="button" class="btn btn-secondary" onclick="closeEditLetterModal()">Batal</button>
							</div>
						  </form>
						</div>`;
					  modal.style.display = 'block';
					}

					/* ============================== DELETE ================================ */
						function deleteLetter(type, idx) {
						  if (!confirm('Hapus surat ini?')) return;
						  if (type === 'in') lettersIn.splice(idx,1); else lettersOut.splice(idx,1);
						  renderLetters(type);
						}

					/* ============================== TAB & SEARCH	================================= */
						function showLetterCategory(type) {
						  currentLetterType = type;
						  document.getElementById('letters-in').classList.toggle('active', type==='in');
						  document.getElementById('letters-out').classList.toggle('active', type==='out');

						  document.querySelectorAll('.sub-tab-button').forEach(btn =>
							btn.classList.toggle('active', btn.textContent.includes(type==='in'?'Masuk':'Keluar'))
						  );
						  renderLetters(type);
						}

						function searchLetters() {
						  const keyword = document.getElementById('letterSearch').value.toLowerCase();
						  const rows = document.querySelectorAll(`#letters${currentLetterType==='in'?'In':'Out'}Table tbody tr`);
						  rows.forEach(r => {
							const text = r.innerText.toLowerCase();
							r.style.display = text.includes(keyword) ? '' : 'none';
						  });
						}

					/* ============================== SELEKSI CEKBOX ================================ */
						function toggleSelectAll(type) {
						  const master = document.getElementById(type==='in'?'selectAllIn':'selectAllOut');
						  document.querySelectorAll(`.letters-${type}-checkbox`).forEach(cb => cb.checked = master.checked);
						  updateSelectedCount(type);
						}
						function selectAllLetters(type) {
						  document.querySelectorAll(`.letters-${type}-checkbox`).forEach(cb => cb.checked = true);
						  updateSelectedCount(type);
						}
						function unselectAllLetters(type) {
						  document.querySelectorAll(`.letters-${type}-checkbox`).forEach(cb => cb.checked = false);
						  updateSelectedCount(type);
						}
						function updateSelectedCount(type) {
						  const count = document.querySelectorAll(`.letters-${type}-checkbox:checked`).length;
						  document.getElementById('selectedLettersCount').textContent = `${count} dipilih`;
						}

					/* ==============================   EXPORT & PRINT	================================= */
						function exportToCSV(type) {
						  const data = type==='in'?lettersIn:lettersOut;
						  if (!data.length) { alert('Tidak ada data'); return; }
						  const rows = [['Nomor','Tanggal','Tujuan/Pengirim','Perihal','File','Status']];
						  data.forEach(l => rows.push([l.number,l.date,l.destination,l.subject,l.pdf,l.status]));
						  const csv = rows.map(r => r.map(v=>`"${v}"`).join(',')).join('\n');
						  const blob = new Blob([csv], {type:'text/csv'});
						  const a = document.createElement('a');
						  a.href = URL.createObjectURL(blob);
						  a.download = `surat-${type}.csv`;
						  a.click();
						}

						function exportToExcel(type) {
						  if (typeof XLSX === 'undefined') { alert('Perlu SheetJS (xlsx.min.js)'); return; }
						  const data = type==='in'?lettersIn:lettersOut;
						  const ws = XLSX.utils.json_to_sheet(data);
						  const wb = XLSX.utils.book_new();
						  XLSX.utils.book_append_sheet(wb, ws, 'Data');
						  XLSX.writeFile(wb, `surat-${type}.xlsx`);
						}

						function printLetterList(type) {
						  const data = type==='in'?lettersIn:lettersOut;
						  if (!data.length) { alert('Tidak ada data'); return; }
						  const win = window.open('', '_blank');
						  let html = '<h2>Daftar Surat</h2><table border="1" cellspacing="0" cellpadding="5"><tr><th>Nomor</th><th>Tanggal</th><th>Tujuan</th><th>Perihal</th><th>Status</th></tr>';
						  data.forEach(l => {
							html += `<tr><td>${l.number}</td><td>${l.date}</td><td>${l.destination}</td><td>${l.subject}</td><td>${l.status}</td></tr>`;
						  });
						  html += '</table>';
						  win.document.write(html);
						  win.print();
						}

						function printSelectedLetters(type) {
						  const checkboxes = document.querySelectorAll(`.letters-${type}-checkbox:checked`);
						  if (!checkboxes.length) { alert('Tidak ada surat yang dipilih.'); return; }
						  const data = (type==='in'?lettersIn:lettersOut);
						  const rows = [];
						  checkboxes.forEach((cb, i) => {
							const idx = Array.from(cb.closest('tbody').children).indexOf(cb.closest('tr'));
							rows.push(data[idx]);
						  });
						  const win = window.open('', '_blank');
						  let html = '<h2>Surat Terpilih</h2><table border="1" cellspacing="0" cellpadding="5"><tr><th>Nomor</th><th>Tanggal</th><th>Tujuan</th><th>Perihal</th><th>Status</th></tr>';
						  rows.forEach(l => {
							html += `<tr><td>${l.number}</td><td>${l.date}</td><td>${l.destination}</td><td>${l.subject}</td><td>${l.status}</td></tr>`;
						  });
						  html += '</table>';
						  win.document.write(html);
						  win.print();
						}

				/* ==============================  INISIALISASI ================================ */
						document.addEventListener('DOMContentLoaded', () => {
						  renderLetters('in');
						});
