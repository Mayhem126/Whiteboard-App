# Whiteboard App

<img width="1920" height="959" alt="image" src="https://github.com/user-attachments/assets/a7e1076f-e4be-4cc8-8e20-e7fbdb212f85" />


A browser-based collaborative whiteboard application for drawing, sketching, and visual note-taking on an interactive canvas, with support for real-time collaboration and persistent sessions.

🔗 **Live Demo:** https://whiteboard-app-lovat.vercel.app/

---

## Features

### Core Drawing
- Freehand drawing (brush)
- Shape tools: line, rectangle, circle, arrow
- Text tool
- Eraser tool
- Undo / Redo
- Export canvas as PNG

### Collaboration & Persistence
- Real-time collaboration across multiple users
- Autosave of canvas state
- Persistent whiteboard sessions backed by a database
- Share canvases with other users
- Last-write-wins consistency model

### Authentication
- JWT-based authentication
- Protected routes for saved and shared canvases
- Guest mode for trying the canvas without signing in

---

## Tech Stack

### Frontend
- React
- Context API
- HTML Canvas
- Rough.js
- perfect-freehand
- Tailwind CSS + CSS Modules

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.IO (real-time collaboration)

---

## Architecture Highlights

- Centralized canvas state management using React Context and reducers
- Element-based drawing model with efficient redraw handling
- Rehydration of persisted drawing elements for consistent rendering across sessions
- Real-time canvas synchronization using Socket.IO events
- RESTful APIs for canvas creation, sharing, updating, and deletion

---

## Getting Started (Local Development)

```bash
# Clone the repository
git clone https://github.com/your-username/whiteboard-app.git

# Install frontend dependencies
cd frontend
npm install
npm start

# Install backend dependencies
cd backend
npm install
npm start
