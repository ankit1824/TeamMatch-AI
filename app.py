import os
import hashlib
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from database import (
    init_db, get_all_students, add_student, get_all_teams, 
    add_team, delete_team, get_student_by_email, update_student
)
from engine.ml_pipeline import (
    get_recommendations, calculate_ml_team_health, get_ml_team_recommendations
)

app = FastAPI(
    title="TeamMatch AI - ML REST API",
    description="FastAPI Backend with Security and Authenticated Profiles",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

def hash_password(password: str) -> str:
    """Hashes the password with SHA-256 for basic security validation."""
    return hashlib.sha256(password.encode()).hexdigest()

@app.post("/api/register", status_code=status.HTTP_201_CREATED)
async def api_register(request: Request):
    """Registers a new student profile with user credentials."""
    data = await request.json()
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        raise HTTPException(status_code=400, detail="Name, Email, and Password are required.")
    
    try:
        existing = get_student_by_email(data['email'])
        if existing:
            raise HTTPException(status_code=400, detail="Email is already registered.")
            
        student_profile = {
            "name": data['name'],
            "email": data['email'],
            "password_hash": hash_password(data['password']),
            "dsa": int(data.get('dsa', 5)),
            "backend": int(data.get('backend', 5)),
            "frontend": int(data.get('frontend', 5)),
            "ml": int(data.get('ml', 5)),
            "uiux": int(data.get('uiux', 5)),
            "experience_level": data.get('experience_level', 'Intermediate'),
            "projects_count": int(data.get('projects_count', 0)),
            "hackathons_count": int(data.get('hackathons_count', 0)),
            "availability_hours": int(data.get('availability_hours', 15)),
            "skills": data.get('skills', 'Generalist'),
            "communication": int(data.get('communication', 5))
        }
        
        add_student(student_profile)
        # Return student profile details excluding the credentials
        new_student = get_student_by_email(data['email'])
        student_data = dict(new_student)
        student_data.pop('password_hash', None)
        return {"message": "Registration successful.", "student": student_data}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/login")
async def api_login(request: Request):
    """Authenticates student credentials."""
    data = await request.json()
    if not data or not data.get('email') or not data.get('password'):
        raise HTTPException(status_code=400, detail="Email and Password are required.")
        
    try:
        student = get_student_by_email(data['email'])
        if not student:
            raise HTTPException(status_code=401, detail="Invalid email or password.")
            
        hashed_input = hash_password(data['password'])
        if student['password_hash'] != hashed_input:
            raise HTTPException(status_code=401, detail="Invalid email or password.")
            
        student_data = dict(student)
        student_data.pop('password_hash', None)
        return {"message": "Login successful.", "student": student_data}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/students/update")
async def api_update_student(request: Request):
    """Saves profile updates from the logged-in candidate."""
    data = await request.json()
    if not data or not data.get('student_id'):
        raise HTTPException(status_code=400, detail="student_id is required.")
        
    try:
        student_id = int(data['student_id'])
        student_profile = {
            "name": data['name'],
            "dsa": int(data.get('dsa', 5)),
            "backend": int(data.get('backend', 5)),
            "frontend": int(data.get('frontend', 5)),
            "ml": int(data.get('ml', 5)),
            "uiux": int(data.get('uiux', 5)),
            "experience_level": data.get('experience_level', 'Intermediate'),
            "projects_count": int(data.get('projects_count', 0)),
            "hackathons_count": int(data.get('hackathons_count', 0)),
            "availability_hours": int(data.get('availability_hours', 15)),
            "skills": data.get('skills', 'Generalist'),
            "communication": int(data.get('communication', 5))
        }
        
        update_student(student_id, student_profile)
        return {"message": "Profile updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/students")
async def api_students():
    """Retrieves all registered developer profiles from SQLite database."""
    try:
        students = get_all_students()
        cleaned_students = []
        for s in students:
            s_dict = dict(s)
            s_dict.pop('password_hash', None)
            cleaned_students.append(s_dict)
        return cleaned_students
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommend")
async def api_recommend(request: Request):
    """ML Teammate Matcher: Queries the KNN model with Cosine Similarity."""
    data = await request.json()
    if not data or not data.get('student_id'):
        raise HTTPException(status_code=400, detail="student_id is required")
        
    student_id = int(data['student_id'])
    top_n = int(data.get('top_n', 5))
    
    try:
        recs = get_recommendations(student_id, top_n=top_n, metric='cosine')
        return recs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/team-health")
async def api_team_health(request: Request):
    """ML Team Diagnostics: Uses K-Means group assignments to compute health score."""
    data = await request.json()
    if not data or 'members' not in data:
        raise HTTPException(status_code=400, detail="members list is required")
        
    try:
        result = calculate_ml_team_health(data['members'])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/team-recommend")
async def api_team_recommend(request: Request):
    """ML Recruit suggestions: Simulates recruit additions to recommend candidates."""
    data = await request.json()
    if not data or 'team_member_ids' not in data:
        raise HTTPException(status_code=400, detail="team_member_ids list is required")
        
    team_member_ids = [int(mid) for mid in data['team_member_ids']]
    top_n = int(data.get('top_n', 4))
    
    try:
        recs = get_ml_team_recommendations(team_member_ids, top_n=top_n)
        return recs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/teams")
async def api_get_teams():
    """Retrieves saved team rosters from SQLite database."""
    try:
        teams = get_all_teams()
        formatted_teams = []
        for t in teams:
            members_str = t['members']
            formatted_teams.append({
                "team_id": t['team_id'],
                "team_name": t['team_name'],
                "description": t['description'],
                "health_score": t['health_score'],
                "members": [int(mid) for mid in members_str.split(',') if mid],
                "created_at": t['created_at']
            })
        return formatted_teams
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/teams", status_code=status.HTTP_201_CREATED)
async def api_add_team(request: Request):
    """Saves a formed team assembly to the SQLite database."""
    data = await request.json()
    if not data or not data.get('team_name') or not data.get('members'):
        raise HTTPException(status_code=400, detail="team_name and members list are required")
        
    try:
        member_ids_str = ",".join(map(str, data['members']))
        team_record = {
            "team_name": data['team_name'],
            "description": data.get('description', ''),
            "health_score": float(data.get('health_score', 0.0)),
            "members": member_ids_str,
            "predicted_compatibility": "N/A"
        }
        
        add_team(team_record)
        return {"message": "Team roster successfully saved to SQLite database."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/teams/{team_id}")
async def api_delete_team(team_id: int):
    """Deletes a saved team roster by ID."""
    try:
        delete_team(team_id)
        return {"message": f"Team {team_id} successfully deleted."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
