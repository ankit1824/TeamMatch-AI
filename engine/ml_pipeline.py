import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.neighbors import NearestNeighbors
from sklearn.cluster import KMeans

from database import get_all_students

SKILLS = ['dsa', 'backend', 'frontend', 'ml', 'uiux']
SKILL_LABELS = {
    'dsa': 'DSA & Problem Solving',
    'backend': 'Backend Development',
    'frontend': 'Frontend Development',
    'ml': 'Machine Learning / AI',
    'uiux': 'UI/UX Design'
}

def encode_experience(level):
    """Maps experience levels to ordinal numerical scale."""
    mapping = {"Beginner": 1.0, "Intermediate": 2.0, "Advanced": 3.0}
    return mapping.get(level, 2.0)

def prepare_features(students_list):
    """
    Transforms the SQLite student profile rows into a normalized feature matrix.
    Returns the raw DataFrame, scaled feature matrix, and fitted MinMaxScaler.
    """
    df = pd.DataFrame(students_list)
    if df.empty:
        return df, np.array([]), None
        
    df_feat = df.copy()
    df_feat['experience_encoded'] = df_feat['experience_level'].apply(encode_experience)
    
    # 8-dimensional feature vector
    feature_cols = SKILLS + ['experience_encoded', 'availability_hours', 'communication']
    
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(df_feat[feature_cols])
    
    return df, scaled_features, scaler

def run_ml_pipeline(students_list):
    """
    Fits MinMaxScaler and K-Means Clustering on the student population.
    Segments students into 3 clusters:
      - Cluster 0: AI/ML Developer archetype
      - Cluster 1: Frontend & UI/UX Developer archetype
      - Cluster 2: Backend & Systems Developer archetype
    Returns K-Means model, cluster labels, and scaled features.
    """
    df, scaled_features, scaler = prepare_features(students_list)
    if len(df) < 3:
        # Fallback if too few students
        return None, np.zeros(len(df)), scaled_features, scaler
        
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(scaled_features)
    
    return kmeans, cluster_labels, scaled_features, scaler

def get_recommendations(student_id, top_n=5, metric='cosine'):
    """
    KNN Matchmaker: Computes complementary profiles using K-Nearest Neighbors
    with Cosine Similarity on inverted skills vectors.
    """
    students = get_all_students()
    if len(students) < 2:
        return []
        
    df, scaled_features, scaler = prepare_features(students)
    
    # Locate target student
    try:
        target_idx = df[df['student_id'] == student_id].index[0]
        target_student = df.loc[target_idx]
    except IndexError:
        return []
        
    # Construct target complement query vector
    comp_skills = [10.0 - float(target_student[s]) for s in SKILLS]
    comp_exp = 4.0 - encode_experience(target_student['experience_level'])
    comp_avail = float(target_student['availability_hours'])
    comp_comm = 8.0 # target good communication baseline
    
    complement_raw = comp_skills + [comp_exp, comp_avail, comp_comm]
    feature_cols = SKILLS + ['experience_encoded', 'availability_hours', 'communication']
    
    query_df = pd.DataFrame([complement_raw], columns=feature_cols)
    query_vector = scaler.transform(query_df)[0]
    
    # Filter out target student from candidate pool
    other_indices = [i for i in range(len(df)) if i != target_idx]
    X_others = scaled_features[other_indices]
    
    n_neighbors = min(top_n, len(X_others))
    if n_neighbors <= 0:
        return []
        
    # Fit KNN
    knn = NearestNeighbors(n_neighbors=n_neighbors, metric=metric, algorithm='brute')
    knn.fit(X_others)
    
    distances, indices = knn.kneighbors([query_vector])
    
    recommendations = []
    for i in range(n_neighbors):
        actual_idx = other_indices[indices[0][i]]
        candidate = students[actual_idx]
        
        dist = distances[0][i]
        if metric == 'cosine':
            sim = 1.0 - dist
            pct = (sim + 1.0) / 2.0 * 100
        else:
            pct = 100.0 / (1.0 + dist)
            
        recommendations.append({
            "student": candidate,
            "compatibility_score": round(pct, 1)
        })
        
    return sorted(recommendations, key=lambda x: x['compatibility_score'], reverse=True)

def calculate_ml_team_health(team_members):
    """
    ML Team Health diagnostics using K-Means Clustering labels to grade
    diversity and identify unrepresented archetype gaps.
    """
    if not team_members:
        return {
            "health": {
                "health_score": 0.0,
                "technical_coverage": 0.0,
                "role_diversity": 0.0,
                "availability_coordination": 0.0,
                "communication_strength": 0.0
            },
            "gaps": []
        }
        
    students = get_all_students()
    
    # 1. Fit clustering on developer population to assign clusters
    kmeans, cluster_labels, _, _ = run_ml_pipeline(students)
    
    # Create lookup map for student clusters
    student_cluster_map = {}
    for idx, s in enumerate(students):
        student_cluster_map[s['student_id']] = int(cluster_labels[idx]) if kmeans else 1
        
    # Map team members to their assigned K-Means clusters
    team_clusters = [student_cluster_map.get(m['student_id'], 1) for m in team_members]
    unique_clusters = len(set(team_clusters))
    n_members = len(team_members)
    
    # Unsupervised Diversity score: higher when members span multiple K-Means clusters
    if n_members > 1:
        role_diversity = (unique_clusters / min(3, n_members)) * 100
    else:
        role_diversity = 100.0
        
    # 2. Technical skill coverage (40% of team health)
    coverages = []
    for s in SKILLS:
        max_val = max(int(m.get(s, 0)) for m in team_members)
        coverages.append(min(max_val, 8) / 8.0)
    tech_coverage = np.mean(coverages) * 100
    
    # 3. Availability coordination (15% of team health)
    hours = [int(m.get('availability_hours', 15)) for m in team_members]
    avg_avail = np.mean(hours)
    min_avail = min(hours)
    
    avg_avail_comp = min(avg_avail, 25) / 25.0 * 70
    min_avail_comp = min(min_avail, 10) / 10.0 * 30
    avail_score = avg_avail_comp + min_avail_comp
    
    # 4. Communication Strength (20% of team health)
    comms = [int(m.get('communication', 5)) for m in team_members]
    max_comm = max(comms)
    avg_comm = np.mean(comms)
    comm_score = (max_comm * 0.6 + avg_comm * 0.4) * 10
    
    # Aggregate health score
    health_score = (
        0.40 * tech_coverage +
        0.25 * role_diversity +
        0.15 * avail_score +
        0.20 * comm_score
    )
    
    # 5. ML-driven deficit alarms based on unrepresented K-Means clusters
    gaps = []
    cluster_labels_map = {
        0: {"label": "Machine Learning / AI", "desc": "AI/ML Developer archetype (Cluster 0)"},
        1: {"label": "Frontend & UI/UX", "desc": "Frontend & UI/UX Developer archetype (Cluster 1)"},
        2: {"label": "Backend & Systems", "desc": "Backend & Systems Developer archetype (Cluster 2)"}
    }
    
    if kmeans:
        for cid in [0, 1, 2]:
            if cid not in team_clusters:
                meta = cluster_labels_map[cid]
                # Identify maximum team value in this cluster's key skill to customize message
                key_skill = 'ml' if cid == 0 else ('frontend' if cid == 1 else 'backend')
                max_team_val = max(int(m.get(key_skill, 0)) for m in team_members)
                
                gaps.append({
                    "skill": key_skill,
                    "label": meta["label"],
                    "max_value": max_team_val,
                    "status": "Critical" if max_team_val < 4 else "Warning",
                    "recommendation": f"The team lacks representation from the {meta['desc']}. Add a candidate belonging to Cluster {cid}."
                })
                
    # Sort critical first
    gaps = sorted(gaps, key=lambda x: x['status'] == 'Critical', reverse=True)
    
    return {
        "health": {
            "health_score": round(health_score, 1),
            "technical_coverage": round(tech_coverage, 1),
            "role_diversity": round(role_diversity, 1),
            "availability_coordination": round(avail_score, 1),
            "communication_strength": round(comm_score, 1)
        },
        "gaps": gaps
    }

def get_ml_team_recommendations(team_member_ids, top_n=4):
    """
    Roster Optimizer suggestions using K-Means and KNN. Simulates adding candidate developers
    to identify the recruit who maximizes the health gain delta (driven by K-Means diversity).
    """
    students = get_all_students()
    
    # Filter members and candidates
    team_members = [s for s in students if s['student_id'] in team_member_ids]
    if not team_members:
        return []
        
    baseline = calculate_ml_team_health(team_members)
    baseline_score = baseline['health']['health_score']
    
    recommendations = []
    
    for s in students:
        if s['student_id'] in team_member_ids:
            continue
            
        simulated_team = team_members + [s]
        simulated_health = calculate_ml_team_health(simulated_team)
        health_gain = simulated_health['health']['health_score'] - baseline_score
        
        recommendations.append({
            "student": s,
            "new_health_score": float(simulated_health['health']['health_score']),
            "health_gain": float(round(health_gain, 1))
        })
        
    recommendations = sorted(recommendations, key=lambda x: x['health_gain'], reverse=True)
    return recommendations[:top_n]