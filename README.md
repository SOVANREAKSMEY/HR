# HR Website with Admin Panel

A modern HR website for posting job opportunities with an easy-to-use admin panel.

## Features

- **Frontend Display**
  - Large RGB animated job titles
  - Responsive poster cards
  - Direct apply buttons with custom links
  - Contact options: Phone, Telegram, Facebook, Email
  - Beautiful gradient animations

- **Admin Panel**
  - Easy poster management
  - Add, edit, and delete job postings
  - Simple form interface
  - Real-time updates

## Installation

1. Install dependencies:
```bash
npm install
```

Note: The system now supports banner image uploads for each job poster!

2. Start the server:
```bash
npm start
```

3. Open your browser:
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin.html

## Usage

### Admin Panel
1. Go to http://localhost:3000/admin.html
2. Fill in the job details:
   - Job Title (required)
   - Description (required)
   - Apply Link (optional - any URL you want)
   - Phone, Telegram, Facebook, Email (optional)
3. Click "Save Poster"
4. Manage existing posters with Edit/Delete buttons

### Frontend
- Job posters display automatically
- Users can click "Apply Now" button (goes to your custom link)
- Contact buttons for Phone, Telegram, Facebook, Email

## Deployment to GitHub

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub

3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Data Storage

Job posters are stored in `data.json` file. This file is automatically created when you start the server.

## Technologies Used

- Node.js + Express (Backend)
- HTML/CSS/JavaScript (Frontend)
- JSON file storage (Database)
