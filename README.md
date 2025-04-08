# 🚗 ParkerApp 🅿️

A mobile app for reporting civil parking violations.  
Users can upload photos, detect license plates via OCR, and submit geo-tagged reports.  
The app supports multiple user roles and provides a structured, efficient flow for handling reports.

Built with **React Native** (front-end) and **Express.js** (back-end).

---

## 📱 What Does the App Do?

**ParkerApp** allows users to easily report illegal parking from their phone by:

- Capturing a photo of the violation 📷  
- Detecting the license plate automatically via OCR 🔍  
- Choosing the type of violation or entering a custom one ✍️  
- Capturing the location automatically via GPS 📍  
- Submitting the report into a tracked system ⏱  

---

## 👥 User Roles

| 🧑 Role            | 🚦 Permissions                                                                 |
|-------------------|-------------------------------------------------------------------------------|
| **User**           | Submit reports, view their own report history                                |
| **Spectator**      | View reports assigned to their authority, update statuses                    |
| **Super Spectator**| View all reports in system, assign reports to Spectators                     |
| **Admin**          | Manage users, system settings, data exports, and full access to reports      |

---

## 🚀 Core Features

- 📸 **Report submission with camera or gallery**
- 🔍 **OCR-based license plate detection** (editable)
- 📍 **Automatic location tagging**
- ✍️ **Custom violation types** with free-text option
- 🧭 **Live report tracking with status updates**
- 🔐 **Secure login + Google Sign-In**
- 🧑‍💻 **Role-based dashboards**
- 📤 **Export capabilities for admins**

---

## ✨ Nice-to-Have Features

- 🧠 Smart form validation
- 🔔 Real-time push notifications
- 🌓 Dark mode support
- 📊 Filtering/sorting of reports
- 📄 PDF/Excel export support
- 🎨 Better UI through component libraries

---

## 🛠 Tech Stack

- ⚛️ React Native  
- 🚀 Express.js  
- 🗄️ Node.js  
- 📦 MongoDB or SQL  
- 📷 OCR (e.g. Tesseract / Google Vision API)

---

## 📦 Installation

```bash
git clone https://github.com/your-username/ParkerApp.git
cd ParkerApp
npm install
npx expo start

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
