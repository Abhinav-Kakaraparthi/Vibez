# VibeZ MVP

A privacy-first nearby connection app.

## Core rules

- User A sees only User B's profile picture in a 0.1-mile radius.
- User A sends a one-time request.
- User B sees User A's full profile before accepting.
- If accepted, both profiles and chat unlock.
- If ignored for 24 hours, the request expires.
- User A cannot request the same person again.
- No exact distance, address, or live location is shown.

## Backend setup

1. Create a PostgreSQL database with PostGIS.
2. Run `backend/schema.sql`.
3. Copy `backend/.env.example` to `backend/.env`.
4. Install requirements:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Mobile setup

```bash
cd mobile
npm install
npx expo start
```

## Production work still needed

- Replace demo auth header with Firebase Auth or Supabase Auth.
- Add photo upload storage.
- Add selfie verification.
- Add chat after accepted requests.
- Add push notifications.
- Add cron job to expire requests after 24 hours.
- Add moderation dashboard.
- Add App Store and Play Store compliance docs.