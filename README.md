# EasyKeeper

A simple, elegant note-taking application built with React and Firebase.

## Preview

Visit the live app: [easy-keeper.vercel.app](https://easy-keeper.vercel.app/)

## Features

- Google Authentication
- Create, edit, and delete notes
- Real-time sync with Firebase Firestore
- Search within notes
- Responsive design

## Prerequisites

- Node.js v18 or higher
- Yarn package manager
- Firebase project with Firestore and Authentication enabled

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/rahuldangeofficial/EasyKeeper.git
   cd EasyKeeper
   ```

2. Create a `.env` file from the template:
   ```bash
   cp .env.example .env
   ```

3. Fill in your Firebase configuration in `.env`

4. Install dependencies and start:
   ```bash
   yarn install
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173)

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository

### Step 3: Configure Environment Variables

In Vercel project settings → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | your-project-id |
| `VITE_FIREBASE_STORAGE_BUCKET` | your-project.firebasestorage.app |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | G-XXXXXXXXXX |

> **Important**: All environment variables must start with `VITE_` for Vite to expose them to the client.

### Step 4: Add Vercel Domain to Firebase

In Firebase Console → **Authentication** → **Settings** → **Authorized domains**:
- Add your Vercel domain (e.g., `your-app.vercel.app`)

### Step 5: Deploy

Click **Deploy** - Vercel will automatically build and deploy your app.

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Google Authentication** in Authentication → Sign-in method
3. Create a **Firestore Database** in native mode
4. Add authorized domains for both `localhost` and your Vercel URL
5. Set Firestore security rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## Tech Stack

- React 19
- Vite 6
- Firebase 11 (Firestore + Auth)
- CSS3

## License

MIT License - see [LICENSE](LICENSE) for details.
