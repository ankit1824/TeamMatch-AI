# --- 1. Grabbing the Tools ---
import random          # Lets us roll the dice and pick random things
import pandas as pd    # Lets us organize data into clean tables (like Excel)
import sqlite3         # Lets Python talk to your local database file
import os              # Lets Python interact with your computer (like making folders)

# Grabs the setup functions you wrote in your other file, database.py
from database import init_db, get_db_connection


# --- 2. Manufacturing the Fake Users ---
def generate_students(n=60):
    # This is our factory line. If we don't give it a number, it makes 60 fake users.
    
    # A massive list of 50 hardcoded names to use as a starter pack
    names = [
        "Aarav Mehta", "Aditi Sharma", "Akash Patel", "Ananya Iyer", "Amit Verma", 
        "Anjali Rao", "Arjun Nair", "Devendra Singh", "Divya Kulkarni", "Gaurav Joshi",
        "Ishaan Gupta", "Karan Johar", "Kavita Reddy", "Manish Pandey", "Meera Sen",
        "Nikhil Deshmukh", "Nisha Saxena", "Pooja Hegde", "Pranav Shah", "Priya Mishra",
        "Rahul Dravid", "Rohan Gavaskar", "Siddharth Malhotra", "Sneha Patil", "Tarun Khanna",
        "Vikram Seth", "Yash Birla", "Aishwarya Roy", "Deepak Padukone", "Hrithik Roshan",
        "Kareena Kapoor", "Ranbir Kapoor", "Salman Khan", "Shahrukh Khan", "Varun Dhawan",
        "Alia Bhatt", "Katrina Kaif", "Priyanka Chopra", "Ranveer Singh", "Tiger Shroff",
        "Sanjay Dutt", "Sunny Deol", "Bobby Deol", "Juhi Chawla", "Madhuri Dixit",
        "Kajol Devgan", "Karisma Kapoor", "Rani Mukerji", "Preity Zinta", "Saif Ali Khan"
    ]
    
    # If we ask for 60 students but only have 50 names, this loop just tacks on 
    # generic names like "Developer 51", "Developer 52", etc., until we hit our target.
    while len(names) < n:
        names.append(f"Developer {len(names) + 1}")
        
    # Shuffle the list of names like a deck of cards so it's random every time
    random.shuffle(names)
    
    experience_levels = ["Beginner", "Intermediate", "Advanced"]
    
    # A cheat sheet. If someone is assigned a major (like AI/ML), this gives them the right text labels.
    skills_map = {
        "AI/ML": "Python, PyTorch, Scikit-learn, TensorFlow",
        "Frontend": "React, HTML, CSS, Figma, Next.js",
        "Backend": "Python, Node.js, Express, SQL, Docker",
        "Fullstack": "React, Node.js, SQLite, WebDev, Tailwind"
    }

    students = [] # An empty bucket to hold our finished fake people
    
    # Loop 60 times to build each student
    for i in range(n):
        name = names[i] # Grab a unique name from our shuffled deck
        
        # Randomly assign this student a major/focus area
        archetype = random.choice(["AI/ML", "Frontend", "Backend", "Fullstack"])
        
        # Randomly pick an experience level. The odds are rigged: 50% chance they are Intermediate.
        exp = random.choices(experience_levels, weights=[0.25, 0.50, 0.25])[0]
        
        # Give them a totally average baseline score (between 2 and 6) for EVERY single skill.
        stats = {s: random.randint(2, 6) for s in ["dsa", "backend", "frontend", "ml", "uiux"]}
        
        # Now we cheat and boost their core stats based on their major.
        if archetype == "AI/ML":
            stats["ml"] = random.randint(7, 10)       # Boost ML to 7-10
            stats["dsa"] = random.randint(7, 10)      # Boost DSA to 7-10
            skills = skills_map["AI/ML"]              # Grab the AI text labels
        elif archetype == "Frontend":
            stats["frontend"] = random.randint(7, 10)
            stats["uiux"] = random.randint(7, 10)
            skills = skills_map["Frontend"]
        elif archetype == "Backend":
            stats["backend"] = random.randint(7, 10)
            stats["dsa"] = random.randint(7, 10)
            skills = skills_map["Backend"]
        else: # Fullstack gets a slightly more balanced boost
            stats["backend"] = random.randint(6, 9)
            stats["frontend"] = random.randint(6, 9)
            stats["dsa"] = random.randint(5, 8)
            skills = skills_map["Fullstack"]
            
        # Roll the dice for soft skills and availability
        comm = random.randint(4, 10)
        proj = random.randint(1, 6)
        hacks = random.randint(0, 4)
        avail = random.choice([10, 15, 20, 25, 30, 35])
        
        # Pack all this data into a dictionary and drop it in the students bucket
        students.append({
            "name": name,
            "dsa": stats["dsa"],
            "backend": stats["backend"],
            "frontend": stats["frontend"],
            "ml": stats["ml"],
            "uiux": stats["uiux"],
            "experience_level": exp,
            "projects_count": proj,
            "hackathons_count": hacks,
            "availability_hours": avail,
            "skills": skills,
            "communication": comm,
            "cluster_id": -1 # Blank placeholder. The ML model will fill this in later.
        })
        
    return students # Spit out the full bucket of 60 people


# --- 3. Running the Simulations (Historical Teams) ---
def generate_historical_teams(students, n_teams=300):
    # This builds a "cheat sheet" of successful/failed teams to train your ML model.
    team_data = [] # Empty bucket for fake teams
    
    # Loop 300 times to create 300 test scenarios
    for _ in range(n_teams):
        team_size = random.randint(2, 4) # Decide if this team has 2, 3, or 4 people
        members = random.sample(students, team_size) # Pluck that many students from our pool of 60
        
        # Look at the whole team and find the highest score in each category
        max_dsa = max(m["dsa"] for m in members)
        max_backend = max(m["backend"] for m in members)
        max_frontend = max(m["frontend"] for m in members)
        max_ml = max(m["ml"] for m in members)
        max_uiux = max(m["uiux"] for m in members)
        
        # Find the team's average communication score
        mean_comm = sum(m["communication"] for m in members) / len(members)
        
        # Find the bottleneck: the member with the lowest available hours
        min_avail = min(m["availability_hours"] for m in members)
        
        # Evaluate if the team meets our baseline requirements for success
        has_backend = max_backend >= 6
        has_frontend = max_frontend >= 6
        has_dsa = max_dsa >= 5
        good_comm = mean_comm >= 6.0
        no_bottleneck = min_avail >= 10
        
        # Quick math to generate a rough internal score
        score = (0.2 * max_backend + 0.2 * max_frontend + 0.1 * max_dsa + 0.25 * mean_comm + 0.25 * (min_avail / 5))
        
        # The Heuristic Logic: 
        if has_backend and has_frontend and has_dsa and good_comm and no_bottleneck:
            success_chance = 0.85 # If they pass all checks, 85% chance they succeed
        elif not has_backend or not has_frontend:
            success_chance = 0.15 # If they lack core dev skills, it drops to 15%
        else:
            success_chance = 0.45 # Anyone left in the middle gets a 45% coin toss
            
        # Roll a random decimal. If it's under the success chance, give them a 1 (Success). Else 0 (Fail).
        label = 1 if random.random() < success_chance else 0
        
        # Pack the team's max stats and their final label into the bucket
        team_data.append({
            "max_dsa": max_dsa,
            "max_backend": max_backend,
            "max_frontend": max_frontend,
            "max_ml": max_ml,
            "max_uiux": max_uiux,
            "mean_communication": round(mean_comm, 2),
            "min_availability": min_avail,
            "team_size": team_size,
            "success": label
        })
        
    # Convert the bucket of 300 teams into a clean Pandas DataFrame (Excel-style table)
    return pd.DataFrame(team_data)


# --- 4. Pushing the Big Red Button (Seeding the Database) ---
def seed_database():
    # This function actually saves all the fake data to your computer
    init_db() # Create the empty database tables
    
    # Open the door to the database so Python can send commands
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Wipe the slate clean. Delete any old students or teams from previous runs.
    cursor.execute("DELETE FROM students")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='students'") # Reset ID counter to 1
    cursor.execute("DELETE FROM teams")
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='teams'") # Reset ID counter to 1
    
    conn.commit() # Save the deletions
    conn.close()  # Close the database door
    
    print("Generating profiles...")
    students = generate_students(60) # Generate the 60 fake people
    
    # Re-open the door to insert the new data
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Loop through the 60 people and shove them permanently into the database
    for s in students:
        cursor.execute("""
        INSERT INTO students (
            name, dsa, backend, frontend, ml, uiux, 
            experience_level, projects_count, hackathons_count, 
            availability_hours, skills, communication, cluster_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            s['name'], s['dsa'], s['backend'], s['frontend'], s['ml'], s['uiux'],
            s['experience_level'], s['projects_count'], s['hackathons_count'],
            s['availability_hours'], s['skills'], s['communication'], s['cluster_id']
        ))
    conn.commit()
    conn.close()
    print("Successfully seeded 60 developer profiles in SQLite database!")
    
    print("Generating historical team match trials...")
    historical_df = generate_historical_teams(students, 300) # Generate the 300 test scenarios
    
    os.makedirs("data", exist_ok=True) # Check if 'data' folder exists. If not, make it.
    
    # Save that Excel-like table of teams as a CSV file in the data folder
    historical_df.to_csv("data/historical_teams.csv", index=False)
    print("Successfully saved 300 historical team trials to 'data/historical_teams.csv'!")

    
    


# --- 5. The Trigger ---
if __name__ == "__main__":
    # Standard Python rule: "Only run the code below if the user ran THIS file directly."
    seed_database()      # Run the database population