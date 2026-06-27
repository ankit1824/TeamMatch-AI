import os
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set! PostgreSQL connection requires this variable.")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

def get_db_connection():
    """Returns a connection to the PostgreSQL database."""
    conn = psycopg2.connect(DATABASE_URL)
    return conn

def execute_query(query, params=(), commit=False, fetch_all=False, fetch_one=False):
    """Executes a SQL query on PostgreSQL."""
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(query, params)
    if commit:
        conn.commit()
    result = None
    if fetch_all:
        result = [dict(row) for row in cursor.fetchall()]
    elif fetch_one:
        row = cursor.fetchone()
        result = dict(row) if row else None
    conn.close()
    return result

def init_db():
    """Initializes the database tables if they do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create students table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        student_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        dsa INTEGER NOT NULL,
        backend INTEGER NOT NULL,
        frontend INTEGER NOT NULL,
        ml INTEGER NOT NULL,
        uiux INTEGER NOT NULL,
        experience_level VARCHAR(50) NOT NULL,
        projects_count INTEGER DEFAULT 0,
        hackathons_count INTEGER DEFAULT 0,
        availability_hours INTEGER DEFAULT 15,
        skills TEXT,
        communication INTEGER NOT NULL,
        cluster_id INTEGER DEFAULT -1,
        university VARCHAR(255) DEFAULT '',
        github_url VARCHAR(255) DEFAULT '',
        linkedin_url VARCHAR(255) DEFAULT '',
        project_interests VARCHAR(255) DEFAULT '',
        past_hackathon_name VARCHAR(255) DEFAULT '',
        past_hackathon_project VARCHAR(255) DEFAULT '',
        past_hackathon_desc TEXT DEFAULT '',
        preferred_role VARCHAR(100) DEFAULT 'Frontend Developer',
        availability VARCHAR(100) DEFAULT 'Looking for team',
        phone VARCHAR(50) DEFAULT ''
    )
    """)
    
    # Add phone column if table already exists
    try:
        cursor.execute("ALTER TABLE students ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT ''")
    except Exception:
        pass
        
    # Create hackathons table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS hackathons (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        organizer VARCHAR(255),
        date VARCHAR(100),
        location VARCHAR(255),
        prize VARCHAR(100),
        description TEXT,
        tags VARCHAR(255),
        interest_filter VARCHAR(100)
    )
    """)
        
    # Create teams table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS teams (
        team_id SERIAL PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL,
        description TEXT,
        health_score REAL DEFAULT 0.0,
        members VARCHAR(255) NOT NULL,
        predicted_compatibility VARCHAR(50) DEFAULT 'N/A',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # Create training metrics table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS training_metrics (
        metric_name VARCHAR(255) PRIMARY KEY,
        metric_value REAL NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    conn.commit()
    conn.close()

def get_all_students():
    """Fetches all student profiles."""
    return execute_query("SELECT * FROM students", fetch_all=True)

def get_student_by_email(email):
    """Fetches a student profile by their email address."""
    return execute_query("SELECT * FROM students WHERE email = %s", (email,), fetch_one=True)

def add_student(s):
    """Registers a new student profile."""
    query = """
    INSERT INTO students (
        name, email, password_hash, dsa, backend, frontend, ml, uiux, 
        experience_level, projects_count, hackathons_count, 
        availability_hours, skills, communication, cluster_id,
        university, github_url, linkedin_url, project_interests,
        past_hackathon_name, past_hackathon_project, past_hackathon_desc,
        preferred_role, availability, phone
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (
        s['name'], s.get('email'), s.get('password_hash'), s['dsa'], s['backend'], s['frontend'], s['ml'], s['uiux'],
        s['experience_level'], s.get('projects_count', 0), s.get('hackathons_count', 0),
        s.get('availability_hours', 15), s.get('skills', 'Generalist'), s['communication'], s.get('cluster_id', -1),
        s.get('university', ''), s.get('github_url', ''), s.get('linkedin_url', ''), s.get('project_interests', ''),
        s.get('past_hackathon_name', ''), s.get('past_hackathon_project', ''), s.get('past_hackathon_desc', ''),
        s.get('preferred_role', 'Frontend Developer'), s.get('availability', 'Looking for team'), s.get('phone', '')
    )
    execute_query(query, params, commit=True)

def update_student(student_id, s):
    """Updates an existing student profile."""
    query = """
    UPDATE students SET 
        name = %s, dsa = %s, backend = %s, frontend = %s, ml = %s, uiux = %s, 
        experience_level = %s, projects_count = %s, hackathons_count = %s, 
        availability_hours = %s, skills = %s, communication = %s,
        university = %s, github_url = %s, linkedin_url = %s, project_interests = %s,
        past_hackathon_name = %s, past_hackathon_project = %s, past_hackathon_desc = %s,
        preferred_role = %s, availability = %s, phone = %s
    WHERE student_id = %s
    """
    params = (
        s['name'], s['dsa'], s['backend'], s['frontend'], s['ml'], s['uiux'],
        s['experience_level'], s['projects_count'], s['hackathons_count'],
        s['availability_hours'], s['skills'], s['communication'],
        s.get('university', ''), s.get('github_url', ''), s.get('linkedin_url', ''), s.get('project_interests', ''),
        s.get('past_hackathon_name', ''), s.get('past_hackathon_project', ''), s.get('past_hackathon_desc', ''),
        s.get('preferred_role', 'Frontend Developer'), s.get('availability', 'Looking for team'), s.get('phone', ''),
        student_id
    )
    execute_query(query, params, commit=True)

def update_student_cluster(student_id, cluster_id):
    """Updates the K-Means cluster assignment for a student."""
    execute_query("UPDATE students SET cluster_id = %s WHERE student_id = %s", (cluster_id, student_id), commit=True)

def get_all_teams():
    """Fetches all saved teams."""
    return execute_query("SELECT * FROM teams ORDER BY created_at DESC", fetch_all=True)

def add_team(t):
    """Saves a new team roster."""
    query = """
    INSERT INTO teams (
        team_name, description, health_score, members, predicted_compatibility
    ) VALUES (%s, %s, %s, %s, %s)
    """
    params = (
        t['team_name'], t.get('description', ''), t.get('health_score', 0.0),
        t['members'], t.get('predicted_compatibility', 'N/A')
    )
    execute_query(query, params, commit=True)

def delete_team(team_id):
    """Deletes a team roster by ID."""
    execute_query("DELETE FROM teams WHERE team_id = %s", (team_id,), commit=True)

def save_metric(name, value):
    """Saves or updates a model evaluation metric."""
    query = """
    INSERT INTO training_metrics (metric_name, metric_value, updated_at) 
    VALUES (%s, %s, CURRENT_TIMESTAMP)
    ON CONFLICT(metric_name) DO UPDATE SET 
        metric_value = EXCLUDED.metric_value, 
        updated_at = CURRENT_TIMESTAMP
    """
    execute_query(query, (name, value), commit=True)

def get_all_metrics():
    """Fetches all model evaluation metrics."""
    rows = execute_query("SELECT * FROM training_metrics", fetch_all=True)
    return {row['metric_name']: row['metric_value'] for row in rows} if rows else {}



def get_all_hackathons():
    """Fetches all upcoming hackathons."""
    return execute_query("SELECT * FROM hackathons", fetch_all=True)

def add_hackathon(h):
    """Inserts a new hackathon event into the database."""
    query = """
    INSERT INTO hackathons (id, name, organizer, date, location, prize, description, tags, interest_filter)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (
        h['id'], h['name'], h.get('organizer', ''), h.get('date', ''),
        h.get('location', ''), h.get('prize', ''), h.get('description', ''),
        h.get('tags', ''), h.get('interest_filter', '')
    )
    execute_query(query, params, commit=True)
