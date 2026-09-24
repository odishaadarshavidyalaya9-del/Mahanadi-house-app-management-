package com.mahanadihouse.app.data

import com.mahanadihouse.app.model.*

object MockData {
    val users = listOf(
        User(
            id = "usr-captain",
            fullName = "Rohan Verma",
            email = "rohan.verma@mahanadi.school.edu",
            mobileNumber = "+91 9876543210",
            role = Role.HOUSE_CAPTAIN,
            classLevel = "12th",
            section = "A",
            rollNumber = "12",
            dob = "2008-05-14",
            motto = "Pride by my side. Leading Mahanadi with honour and courage."
        ),
        User(
            id = "usr-vice-captain",
            fullName = "Shreya Mishra",
            email = "shreya.mishra@mahanadi.school.edu",
            mobileNumber = "+91 9876543219",
            role = Role.VICE_CAPTAIN,
            classLevel = "12th",
            section = "B",
            rollNumber = "05",
            dob = "2008-09-18",
            motto = "Supporting our house and teammates to victory."
        ),
        User(
            id = "usr-teacher",
            fullName = "Mrs. Ananya Sharma",
            email = "ananya.sharma@mahanadi.school.edu",
            mobileNumber = "+91 9811223344",
            role = Role.HOUSE_TEACHER,
            classLevel = "Faculty",
            section = "Staff",
            rollNumber = "HT-01",
            dob = "1988-11-20",
            motto = "Guiding young minds of Mahanadi to reach their greatest potential."
        ),
        User(
            id = "usr-attendance-coord",
            fullName = "Vikram Rathore",
            email = "vikram.r@mahanadi.school.edu",
            mobileNumber = "+91 9833221100",
            role = Role.ATTENDANCE_COORDINATOR,
            classLevel = "11th",
            section = "A",
            rollNumber = "11",
            dob = "2009-02-14",
            motto = "Punctuality and presence are the bedrocks of Mahanadi."
        ),
        User(
            id = "usr-sports-coord",
            fullName = "Aryan Naik",
            email = "aryan.naik@mahanadi.school.edu",
            mobileNumber = "+91 9822114455",
            role = Role.SPORTS_COORDINATOR,
            classLevel = "12th",
            section = "A",
            rollNumber = "02",
            dob = "2008-07-25",
            motto = "Speed, stamina, and house glory on the field!"
        ),
        User(
            id = "usr-cultural-coord",
            fullName = "Tanvi Swaminathan",
            email = "tanvi.s@mahanadi.school.edu",
            mobileNumber = "+91 9844332211",
            role = Role.CULTURAL_COORDINATOR,
            classLevel = "11th",
            section = "B",
            rollNumber = "29",
            dob = "2009-10-12",
            motto = "Art, music, and dramatic excellence for Mahanadi."
        ),
        User(
            id = "usr-discipline-coord",
            fullName = "Karan Singhania",
            email = "karan.s@mahanadi.school.edu",
            mobileNumber = "+91 9855443322",
            role = Role.DISCIPLINE_COORDINATOR,
            classLevel = "12th",
            section = "C",
            rollNumber = "15",
            dob = "2008-04-03",
            motto = "Upholding house honor and respectful conduct."
        ),
        User(
            id = "usr-event-coord",
            fullName = "Pooja Mohanty",
            email = "pooja.m@mahanadi.school.edu",
            mobileNumber = "+91 9866554433",
            role = Role.EVENT_COORDINATOR,
            classLevel = "11th",
            section = "C",
            rollNumber = "19",
            dob = "2009-08-16",
            motto = "Flawless coordination for every house fixture."
        ),
        User(
            id = "usr-comm-coord",
            fullName = "Devansh Barik",
            email = "devansh.b@mahanadi.school.edu",
            mobileNumber = "+91 9877665544",
            role = Role.COMMUNICATION_COORDINATOR,
            classLevel = "10th",
            section = "A",
            rollNumber = "08",
            dob = "2010-03-20",
            motto = "Keeping every member informed and connected."
        ),
        User(
            id = "usr-member-1",
            fullName = "Priya Patel",
            email = "priya.patel@mahanadi.school.edu",
            mobileNumber = "+91 9822334455",
            role = Role.HOUSE_MEMBER,
            classLevel = "10th",
            section = "B",
            rollNumber = "18",
            dob = "2010-08-22",
            motto = "Proud member of Mahanadi House. Ready to shine!"
        ),
        User(
            id = "usr-member-2",
            fullName = "Aarav Sengupta",
            email = "aarav.sengupta@mahanadi.school.edu",
            mobileNumber = "+91 9833445566",
            role = Role.HOUSE_MEMBER,
            classLevel = "11th",
            section = "A",
            rollNumber = "04",
            dob = "2009-03-11"
        ),
        User(
            id = "usr-member-3",
            fullName = "Kavya Nair",
            email = "kavya.nair@mahanadi.school.edu",
            mobileNumber = "+91 9844556677",
            role = Role.HOUSE_MEMBER,
            classLevel = "12th",
            section = "B",
            rollNumber = "09",
            dob = "2008-12-03"
        ),
        User(
            id = "usr-member-4",
            fullName = "Aditya Kumar",
            email = "aditya.kumar@mahanadi.school.edu",
            mobileNumber = "+91 9855667788",
            role = Role.HOUSE_MEMBER,
            classLevel = "9th",
            section = "A",
            rollNumber = "07",
            dob = "2011-04-19"
        ),
        User(
            id = "usr-member-5",
            fullName = "Diya Rao",
            email = "diya.rao@mahanadi.school.edu",
            mobileNumber = "+91 9866778899",
            role = Role.HOUSE_MEMBER,
            classLevel = "10th",
            section = "A",
            rollNumber = "14",
            dob = "2010-09-15"
        )
    )

    val announcements = listOf(
        Announcement(
            id = "anc-1",
            title = "Zero-Period Roll Call & House Assembly",
            description = "All students must report in full house uniform to the central quadrangle by 07:45 AM tomorrow. Attendance Coordinator will mark attendance.",
            date = "Today, 08:30 AM",
            authorName = "Mrs. Ananya Sharma",
            authorRole = Role.HOUSE_TEACHER,
            category = "MEETING",
            isPinned = true
        ),
        Announcement(
            id = "anc-2",
            title = "Annual Inter-House Football Championship Trials",
            description = "Selection trials for the Mahanadi Senior & Junior Boys squad start this Thursday at the sports complex. Bring your cleats and shin guards.",
            date = "Yesterday",
            authorName = "Aryan Naik",
            authorRole = Role.SPORTS_COORDINATOR,
            category = "COMPETITION",
            isPinned = false
        ),
        Announcement(
            id = "anc-3",
            title = "Inter-House Debate & Elocution Auditions",
            description = "Topic: 'AI and the Future of Education'. Interested speakers register with Tanvi Swaminathan by Wednesday evening.",
            date = "2 days ago",
            authorName = "Tanvi Swaminathan",
            authorRole = Role.CULTURAL_COORDINATOR,
            category = "ACTIVITY",
            isPinned = false
        )
    )

    val activities = listOf(
        HouseActivity(
            id = "act-1",
            title = "Inter-House March-Past Drill Practice",
            description = "Mandatory sync drill practice for Sports Day contingent. Focus on timing and flag bearer synchronization.",
            date = "2026-09-23",
            time = "03:45 PM",
            location = "School Main Grounds",
            category = "SPORTS",
            pointsAwarded = 250,
            participantsCount = 14,
            isUserParticipating = true
        ),
        HouseActivity(
            id = "act-2",
            title = "Mahanadi House Quiz League - Stage 1",
            description = "Inter-house science, literature and general knowledge rounds. Top 4 students will represent Mahanadi in the finals.",
            date = "2026-09-25",
            time = "02:00 PM",
            location = "Auditorium Hall B",
            category = "ACADEMIC",
            pointsAwarded = 150,
            participantsCount = 8,
            isUserParticipating = false
        ),
        HouseActivity(
            id = "act-3",
            title = "House Cleanliness & Eco-Drive",
            description = "Annual campus green drive and house bulletin board decoration contest.",
            date = "2026-09-28",
            time = "09:00 AM",
            location = "House Common Room & Quadrangle",
            category = "COMMUNITY",
            pointsAwarded = 100,
            participantsCount = 20,
            isUserParticipating = true
        )
    )

    val initialChatMessages = listOf(
        ChatMessage(
            id = "msg-1",
            channel = ChatChannel.OFFICIAL_ANNOUNCEMENTS,
            senderId = "usr-captain",
            senderName = "Rohan Verma (Captain)",
            senderRole = Role.HOUSE_CAPTAIN,
            senderClass = "12th A",
            text = "Welcome everyone to the official Mahanadi House app! Keep your attendance updated and check upcoming activities regularly.",
            timestamp = "08:15 AM"
        ),
        ChatMessage(
            id = "msg-2",
            channel = ChatChannel.HOUSE_GROUP,
            senderId = "usr-member-1",
            senderName = "Priya Patel",
            senderRole = Role.HOUSE_MEMBER,
            senderClass = "10th B",
            text = "Hello everyone! Ready for the sports day trials this week! Pride by my side!",
            timestamp = "09:00 AM"
        ),
        ChatMessage(
            id = "msg-3",
            channel = ChatChannel.HOUSE_GROUP,
            senderId = "usr-sports-coord",
            senderName = "Aryan Naik",
            senderRole = Role.SPORTS_COORDINATOR,
            senderClass = "12th A",
            text = "Great enthusiasm Priya! Bring your athletic shoes at 3:45 PM for fitness screening.",
            timestamp = "09:05 AM"
        )
    )
}
