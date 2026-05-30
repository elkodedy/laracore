# Tutorial Lengkap: Windows → WSL2 → Ubuntu → Docker Desktop

Panduan ini untuk pengguna baru yang ingin development Laravel di Linux environment tanpa install PHP, Composer, Node.js, PostgreSQL, atau Redis di Windows.

---

# Step 0 - Cek Windows

Pastikan menggunakan:

* Windows 11 (direkomendasikan)
* atau Windows 10 versi 2004+

Cek versi:

Tekan:

```text
Windows + R
```

Ketik:

```text
winver
```

---

# Step 1 - Install WSL2

Buka **PowerShell sebagai Administrator**.

Klik Start → ketik:

```text
PowerShell
```

Klik kanan:

```text
Run as Administrator
```

Jalankan:

```powershell
wsl --install
```

Tunggu hingga selesai.

Biasanya akan muncul:

```text
Installing:
Windows Subsystem for Linux
Virtual Machine Platform
Ubuntu
```

---

# Step 2 - Restart Windows

Setelah proses selesai:

```text
Restart komputer
```

Ini wajib.

---

# Step 3 - Verifikasi WSL

Buka PowerShell biasa.

Jalankan:

```powershell
wsl --status
```

Contoh hasil:

```text
Default Distribution: Ubuntu
Default Version: 2
```

Pastikan ada:

```text
Default Version: 2
```

---

# Step 4 - Jalankan Ubuntu Pertama Kali

Klik Start.

Cari:

```text
Ubuntu
```

Buka aplikasi tersebut.

Pertama kali akan muncul:

```text
Installing...
```

Tunggu beberapa menit.

---

# Step 5 - Buat User Linux

Saat diminta:

```text
Enter new UNIX username:
```

Contoh:

```text
elko
```

Lalu buat password:

```text
New password:
```

Password tidak akan terlihat saat diketik, itu normal.

---

# Step 6 - Update Ubuntu

Masih di terminal Ubuntu:

```bash
sudo apt update
sudo apt upgrade -y
```

Masukkan password Linux.

Tunggu sampai selesai.

---

# Step 7 - Install Windows Terminal (Opsional)

Buka Microsoft Store.

Install:

**Windows Terminal**

Lebih nyaman dibanding CMD biasa.

---

# Step 8 - Install VS Code

Download:

[Visual Studio Code](https://code.visualstudio.com?utm_source=chatgpt.com)

Install seperti biasa.

---

# Step 9 - Install Extension VS Code

Buka VS Code.

Install extension:

* Remote - WSL
* ESLint
* Prettier
* Tailwind CSS IntelliSense
* GitLens

---

# Step 10 - Install Docker Desktop

Download:

[Docker Desktop](https://www.docker.com/products/docker-desktop?utm_source=chatgpt.com)

Install.

Saat ada pilihan:

```text
Use WSL 2 instead of Hyper-V
```

Pastikan dicentang.

---

# Step 11 - Jalankan Docker Desktop

Buka:

```text
Docker Desktop
```

Tunggu sampai status:

```text
Engine running
```

---

# Step 12 - Hubungkan Docker ke WSL

Di Docker Desktop:

```text
Settings
→ Resources
→ WSL Integration
```

Aktifkan:

```text
Enable integration with my default WSL distro
```

Lalu aktifkan:

```text
Ubuntu
```

Klik:

```text
Apply & Restart
```

---

# Step 13 - Verifikasi Docker dari WSL

Buka Ubuntu.

Jalankan:

```bash
docker --version
```

Contoh:

```text
Docker version 28.x.x
```

Lalu:

```bash
docker compose version
```

Contoh:

```text
Docker Compose version v2.x.x
```

---

# Step 14 - Test Container

Masih di Ubuntu:

```bash
docker run hello-world
```

Jika berhasil akan muncul:

```text
Hello from Docker!
```

---

# Step 15 - Buat Folder Project

Di Ubuntu:

```bash
mkdir -p ~/projects
cd ~/projects
```

Cek:

```bash
pwd
```

Contoh:

```text
/ home / elko / projects
```

---

# Step 16 - Buka Folder WSL dari Windows

Di Ubuntu:

```bash
explorer.exe .
```

Windows Explorer akan membuka:

```text
\\wsl$\Ubuntu\home\<username>\projects
```

---

# Step 17 - Buka VS Code dalam WSL

Masih di Ubuntu:

```bash
code .
```

Jika berhasil, VS Code akan terbuka.

Lihat pojok kiri bawah.

Harus ada:

```text
WSL: Ubuntu
```

Bukan:

```text
Windows
```

---

# Step 18 - Test Docker Compose

Buat folder test:

```bash
mkdir ~/projects/docker-test
cd ~/projects/docker-test
```

Buat file:

```bash
nano docker-compose.yml
```

Isi:

```yaml
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
```

Simpan:

```text
CTRL+O
ENTER
CTRL+X
```

Jalankan:

```bash
docker compose up -d
```

---

# Step 19 - Cek Container

```bash
docker ps
```

Harus muncul container nginx.

Contoh:

```text
CONTAINER ID
IMAGE
nginx:latest
```

---

# Step 20 - Test Browser

Buka:

```text
http://localhost
```

Jika muncul halaman nginx:

```text
Welcome to nginx!
```

maka setup berhasil.

---

# Checklist Akhir

Pastikan semua berikut sudah berhasil:

✅ `wsl --status` menunjukkan Version 2
✅ Ubuntu bisa dibuka
✅ `docker --version` berjalan di Ubuntu
✅ `docker compose version` berjalan di Ubuntu
✅ `docker run hello-world` sukses
✅ `docker ps` menampilkan container
✅ `http://localhost` menampilkan nginx
✅ `code .` membuka VS Code dengan status `WSL: Ubuntu`

Jika semua checklist hijau, environment sudah siap untuk lanjut ke **Step 1: Membuat Docker Workspace Laravel 12 + PHP 8.4 + PostgreSQL + Redis + Node 22 + Inertia React**.
