# 🤝 Skill Swap Platform

A mini web application that allows users to **exchange skills** with others in a mutually beneficial way. Users can list the skills they offer and the skills they’re seeking, set availability, and initiate swap requests — creating a vibrant community of shared learning.

## 🌟 Features

### 👤 User Features
- **Profile Setup**:
  - Name, location (optional), and profile photo (optional)
  - Skills Offered and Skills Wanted
  - Availability (weekends, evenings, etc.)
  - Public or Private profile toggle

- **Skill Search & Browse**:
  - Find users by skill keywords (e.g., "Photoshop", "Excel")

- **Swap Requests**:
  - Send skill swap requests to others
  - Accept or reject incoming swap offers
  - View pending and accepted swaps
  - Delete swap requests if they are not accepted

- **Feedback System**:
  - Leave ratings or feedback after a completed swap

---

### 🛡️ Admin Features
- Moderate skill descriptions (reject spam/inappropriate entries)
- Ban users violating policies
- Monitor all swap statuses (pending, accepted, cancelled)
- Broadcast platform-wide messages (e.g., updates or alerts)
- Export reports:
  - User activity logs
  - Feedback logs
  - Swap statistics

---

## 🛠️ Tech Stack (suggested)

| Frontend        | Backend         | Database       | Others          |
|----------------|----------------|----------------|-----------------|
| React / Vite   | Node.js / Express | MongoDB / PostgreSQL | Firebase Auth (optional), Bootstrap or Tailwind |

> You can customize the tech stack to suit your needs.

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/skill-swap-platform.git
cd skill-swap-platform
