# EasyKeeper

A note-taking app with Google Sign-In and cloud sync.

## Preview

[easykeeper.vercel.app](https://easykeeper.vercel.app/)

## Setup

1. Clone and install:
   ```bash
   git clone https://github.com/rahuldangeofficial/EasyKeeper.git
   cd EasyKeeper
   cp .env.example .env
   yarn install
   ```

2. Add your Firebase config to `.env`

3. Run locally:
   ```bash
   yarn dev
   ```

## Firebase Setup

1. Create a Firebase project
2. Enable Google Authentication
3. Create a Firestore database
4. Add `localhost` to authorized domains

## Tech Stack

React 19, Vite 6, Firebase 11
