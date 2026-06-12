# 🤝 TeamMatch AI — ML Teammate Matcher & Analyzer

TeamMatch AI is a full-stack **Machine Learning-driven Matchmaking & Grouping platform** designed to assemble balanced hackathon and project teams. It pairs a modern, minimal **React frontend** with a high-performance **Python FastAPI backend**, utilizing an **SQLite DBMS** for persistence and **Scikit-Learn** models for intelligence.

---

## 🧠 Machine Learning Architecture & Core Pipelines

Instead of arbitrary scoring rules, the entire matching and gap analysis system is driven by standard, dynamic machine learning models:

### 1. Complementary Recommender: K-Nearest Neighbors (KNN)
* **Goal**: Find the top N complementary developers for a given user profile.
* **Feature Engineering (8D Vector Space)**:
  Each profile is represented by a normalized vector containing technical skills, experience level, availability, and communication:
  $$\vec{x} = [x_{\text{dsa}}, x_{\text{backend}}, x_{\text{frontend}}, x_{\text{ml}}, x_{\text{uiux}}, x_{\text{experience}}, x_{\text{availability}}, x_{\text{communication}}] \in \mathbb{R}^8$$
* **Complement Target Search**: To pair complementary skills (e.g., Backend expert with a Frontend designer) rather than duplicate them, technical skills are inverted:
  $$q_{\text{skill}} = 10.0 - x_{\text{skill}}$$
* **Similarity Metric**: The index is queried with this target vector using the **Cosine Distance** metric to rank matches:
  $$\text{Cosine Distance} = 1.0 - \frac{\vec{q} \cdot \vec{c}}{\|\vec{q}\| \|\vec{c}\|}$$

### 2. Team Diagnostics & Balance: K-Means Clustering
* **Goal**: Segment the student developer population into archetype cohorts and grade team balance.
* **Archetypes**: The pipeline groups developers into $K=3$ distinct clusters:
  * **Cluster 0**: *AI / ML Specialists* (High ML & DSA stats).
  * **Cluster 1**: *Frontend & UI/UX Designers* (High Frontend & UI/UX stats).
  * **Cluster 2**: *Backend & Systems Engineers* (High Backend & DSA stats).
* **Role Diversity Score**: The diversity of a drafted team is evaluated based on the K-Means cluster labels of its members:
  $$\text{Role Diversity} = \frac{\text{Unique Clusters Represented}}{\min(3, \text{Team Size})} \times 100\%$$
* **Deficit Gaps**: Triggers a critical alert if any of the three K-Means clusters are unrepresented in the team, recommending specific candidates from the missing cluster.

---

## 💾 Relational Database Schema (DBMS)

The application uses **SQLite** (`data/teammatch.db`) to store profiles and rosters:

* **`students` Table**: Stores name, skills description, commitment hours, communication score, 5 skill metrics, and K-Means `cluster_id`.
* **`teams` Table**: Stores saved team rosters including names, descriptions, members (comma-separated student IDs), and health scores.

---

## 🛠️ Technology Stack

* **Frontend**: React
* **Backend**: Python FastAPI, Uvicorn 
* **Database**: SQLite Relational DBMS
* **Machine Learning**: Scikit-Learn (`MinMaxScaler`, `KMeans`, `NearestNeighbors`), Pandas, NumPy

---

## 🚀 Installation & Local Setup

### Prerequisites
- Python 3.8+
- Node.js (v16+)

### Step 1: Clone and Set Up Python Backend
1. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate      # On Windows
   source .venv/bin/activate   # On Mac/Linux
