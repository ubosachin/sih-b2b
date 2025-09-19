# Firebase Setup Instructions

The application requires Firebase configuration to work properly. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Follow the setup wizard to create your project

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication

## 3. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

## 4. Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (Settings) > "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Give your app a name (e.g., "HerbPortal")
5. Copy the configuration values

## 5. Create Environment Variables

Create a `.env.local` file in the root directory of your project with the following content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here
```

Replace the placeholder values with your actual Firebase configuration values.

## 6. Initialize Your Database (Optional)

If you want to populate your Firestore with sample data, you can run the seed script:

```bash
npm run seed
```

Note: You may need to create a seed script in your package.json first.

## 7. Restart Your Development Server

After creating the `.env.local` file, restart your development server:

```bash
npm run dev
```

## Troubleshooting

- Make sure all environment variables are prefixed with `NEXT_PUBLIC_`
- Ensure your Firebase project has Authentication and Firestore enabled
- Check that your `.env.local` file is in the root directory
- Verify that your Firebase configuration values are correct

## Current Status

The application is currently using demo/placeholder Firebase configuration values, which means:
- Authentication will not work properly
- Database operations will fail
- You need to complete the Firebase setup above to use the application fully
