# Mahanadi House - Native Android Application

Native Android implementation of **Mahanadi House** built with **Kotlin** and **Jetpack Compose**.

## Features Implemented

1. **Role-Based Portals & Authentication:**
   - Dedicated entry options for **House Captain**, **House Teacher**, **House Member**, and **House Coordinators**.
   - Multiple login paths: Email & Password, Mobile OTP verification, and Google Workspace sign-in.
   - Demo 1-tap fast access for evaluating any of the 10 house roles.

2. **Member Entry Form:**
   - Full student profile registration: Full Name, Class, Section, Roll Number, Date of Birth, House (*Mahanadi House*), Contact, and interactive Math Captcha verification.

3. **Home Dashboard:**
   - Mahanadi House emblem with rising sun, golden crown rays, and azure river waves.
   - House motto: **"PRIDE BY MY SIDE"**.
   - Total members count, house points (1,850 Pts, Rank #1), pinned announcements, and interactive RSVP for upcoming house fixtures.

4. **Date-Based Attendance System:**
   - Daily roll-call register with date selector (Today, Yesterday, Custom date).
   - Permission-gated: Captain, Vice Captain, House Teacher, and Attendance Coordinator can toggle Present / Absent status in real time.
   - Live attendance percentage bar and student roster breakdown.

5. **House Chat:**
   - 3 channels: **House Group**, **Official Broadcast**, and **Peer Messages**.
   - Permission enforcement: Only House Captain and House Teacher can broadcast in the official channel.

6. **House Calls System:**
   - **Join Call**: Enter room code (e.g., `MAH-4821`) for group meetings.
   - **Teacher & Captain Hotline**: 1-tap direct connection to House Teacher or House Captain.
   - **Peer Calling**: HD audio and video calling between house members.
   - Secure architecture with no hardcoded API keys.

7. **10 House Roles & Permissions:**
   - House Captain
   - Vice Captain
   - House Teacher
   - Attendance Coordinator
   - Sports Coordinator
   - Cultural Coordinator
   - Discipline Coordinator
   - Event Coordinator
   - Communication Coordinator
   - House Member

8. **Profile & House Creed:**
   - Student ID pass with photo avatar, house details, role permissions checklist, house pledge, and role switcher.

---

## How to Build the APK

### In Android Studio
1. Open Android Studio (Ladybug / Koala or newer recommended).
2. Choose **Open an Existing Project** and select the `/android` directory.
3. Allow Gradle to sync.
4. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
5. Generated APK will be named `MahanadiHouse-debug.apk` or `MahanadiHouse-release.apk` inside `app/build/outputs/apk/`.

### From Command Line
```bash
cd android
./gradlew assembleDebug
# Or for release:
./gradlew assembleRelease
```
