# Travel Journal App

A React Native mobile application to record, manage, and sync travel journals. Users can create journals with photos, locations, dates, and tags. Journals are stored locally in SQLite and synchronized with Supabase for online access.

---

## Table of Contents

- [Demo](#demo)  
- [Features](#features)  
- [APK Download](#apk-download)  
- [Loom Video](#loom-video)  
- [Setup & Installation](#setup--installation)  
- [Folder Structure](#folder-structure)  
- [Assumptions](#assumptions)  
- [Tech Stack](#tech-stack)  
- [Notes](#notes)  

---

## Demo

This app allows users to:

- Add, edit, and delete journals with title, description, location, tags, date, and photos.  
- Automatically generate AI-based tags from uploaded images.  
- View journals offline and online with synchronization to Supabase.  
- Filter journals by date range and tags.  
- Interactive gallery to view images attached to journals.

---

## Features

- **Offline Storage:** Journals are saved in local SQLite database.  
- **Online Sync:** Journals are synced with Supabase if internet is available.  
- **AI Tag Generation:** Automatic tags for uploaded images using Clarifai API.  
- **Search & Filter:** Search journals by title/description and filter by tags/date.  
- **Media Support:** Upload up to 5 images per journal and view in full screen.  
- **Location Picker:** Google Places API integrated for adding locations.  

---

## APK Download

You can download the working APK from the link below:

[Download APK](https://<your-apk-link>)  

> Replace `<your-apk-link>` with the actual link to your APK file (e.g., Google Drive, GitHub Release).

---

## Loom Video

Watch the demo of the working application here:

[View Demo](https://<your-loom-link>)  

> Replace `<your-loom-link>` with the actual link to your Loom or demo video.

---

## Setup & Installation

### Prerequisites

- Node.js >= 18.x  
- npm >= 9.x  
- React Native CLI  
- Android Studio or Xcode (for running on emulator/device)  
- Google Maps API Key (for location autocomplete)  
- Supabase account and project  

### Steps

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
