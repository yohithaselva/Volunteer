-- 1. Define ENUM types (optional, for consistency)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('Admin', 'Volunteer');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('Pending', 'In Progress', 'Completed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assignment_status') THEN
        CREATE TYPE assignment_status AS ENUM ('Assigned', 'In Progress', 'Completed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_level') THEN
        CREATE TYPE priority_level AS ENUM ('High', 'Medium', 'Low');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status') THEN
        CREATE TYPE notification_status AS ENUM ('Sent', 'Read');
    END IF;
END $$;

-- 2. Core Tables

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VolunteerProfiles Table
CREATE TABLE IF NOT EXISTS VolunteerProfiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    skills TEXT,
    interests TEXT,
    availability JSON
);

-- Events Table
CREATE TABLE IF NOT EXISTS Events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS Tasks (
    task_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES Events(event_id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    required_skills TEXT,
    status task_status DEFAULT 'Pending'
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS Assignments (
    assignment_id SERIAL PRIMARY KEY,
    task_id INT REFERENCES Tasks(task_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status assignment_status DEFAULT 'Assigned',
    feedback TEXT,
    hours_logged DECIMAL(5,2),
    priority_level priority_level DEFAULT 'Medium',
    estimated_completion_time DECIMAL(5,2)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status notification_status DEFAULT 'Sent'
);

-- ActivityLogs Table
CREATE TABLE IF NOT EXISTS ActivityLogs (
    log_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES Events(event_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    task_id INT REFERENCES Tasks(task_id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    hours_logged DECIMAL(5,2)
);

-- 3. Additional Schemas for Extended Functionality

-- VolunteerTeams Table
CREATE TABLE IF NOT EXISTS VolunteerTeams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    event_id INT REFERENCES Events(event_id) ON DELETE CASCADE,
    team_leader INT REFERENCES Users(user_id)
);

-- TeamMembers Table
CREATE TABLE IF NOT EXISTS TeamMembers (
    team_member_id SERIAL PRIMARY KEY,
    team_id INT REFERENCES VolunteerTeams(team_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE
);

-- VolunteerCheckIns Table
CREATE TABLE IF NOT EXISTS VolunteerCheckIns (
    checkin_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES Events(event_id) ON DELETE CASCADE,
    checkin_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checkout_time TIMESTAMP
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS Feedback (
    feedback_id SERIAL PRIMARY KEY,
    assignment_id INT REFERENCES Assignments(assignment_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
