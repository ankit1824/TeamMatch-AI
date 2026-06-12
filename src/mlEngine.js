/**
 * TeamMatch AI - Core AIML Recommendation & Matching Engine
 * Fully client-side JS implementation for instant calculations.
 */

export const SKILLS = ['dsa', 'backend', 'frontend', 'ml', 'uiux'];

export const SKILL_LABELS = {
  dsa: 'DSA & Algorithms',
  backend: 'Backend Engineering',
  frontend: 'Frontend Development',
  ml: 'Machine Learning / AI',
  uiux: 'UI/UX Design'
};

/**
 * Calculates compatibility score (0-100) between student A and student B.
 * Uses a weighted multi-factor heuristic:
 * - 40% Skill Complementarity (differences in specialized strengths)
 * - 30% Experience Balance (mentorship mixing: Advanced + Intermediate/Beginner)
 * - 20% Availability Sync (overlap in commitment capacity)
 * - 10% Communication baseline (average soft skills)
 */
export function calculateCompatibility(studentA, studentB) {
  if (!studentA || !studentB) return 0;

  // 1. Skill Complementarity (40%)
  // High difference in core strengths means they fill each other's gaps
  const skillDiff = SKILLS.reduce((sum, s) => sum + Math.abs((studentA[s] || 0) - (studentB[s] || 0)), 0);
  // Maximum absolute difference is 9 (scale 1-10) * 5 skills = 45
  const complementarityScore = (skillDiff / 45.0) * 100;

  // 2. Experience Level Balance (30%)
  const expMap = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  const expA = expMap[studentA.experience_level] || 2;
  const expB = expMap[studentB.experience_level] || 2;
  const expDiff = Math.abs(expA - expB);

  let expScore = 80; // default
  if (expDiff === 1) {
    expScore = 100; // Optimal mentor-peer ratio (Advanced + Intermediate or Intermediate + Beginner)
  } else if (expDiff === 0) {
    if (expA === 3) expScore = 75; // Two Advanced (high competence but potential role clash)
    else if (expA === 2) expScore = 90; // Two Intermediates (great equal peers)
    else expScore = 60; // Two Beginners (might struggle technically)
  } else {
    expScore = 80; // Advanced & Beginner (decent learning opportunity)
  }

  // 3. Availability Sync (20%)
  const hoursA = studentA.availability_hours || 15;
  const hoursB = studentB.availability_hours || 15;
  const maxHours = Math.max(hoursA, hoursB);
  const availScore = maxHours > 0 ? (1.0 - Math.abs(hoursA - hoursB) / maxHours) * 100 : 100;

  // 4. Communication Baseline (10%)
  const commA = studentA.communication || 5;
  const commB = studentB.communication || 5;
  const commScore = ((commA + commB) / 20.0) * 100; // scales average (1-10) to 0-100

  // Weights configuration
  const w = {
    complementarity: 0.40,
    experience: 0.30,
    availability: 0.20,
    communication: 0.10
  };

  const finalScore = 
    w.complementarity * complementarityScore +
    w.experience * expScore +
    w.availability * availScore +
    w.communication * commScore;

  return Math.round(finalScore * 10) / 10;
}

/**
 * Calculates Team Health Score (0-100) for an assembled team.
 * Evaluates technical breadth, role overlap, hours, and presenter capacity.
 */
export function calculateTeamHealth(members) {
  if (!members || members.length === 0) {
    return {
      healthScore: 0,
      technicalCoverage: 0,
      roleDiversity: 0,
      availabilityCoordination: 0,
      communicationStrength: 0
    };
  }

  const nMembers = members.length;

  // 1. Technical Skill Coverage (40%)
  // Find maximum skill value in the team for each domain. Cap competent benchmark at 8.
  const coverages = SKILLS.map(s => {
    const maxVal = Math.max(...members.map(m => m[s] || 0));
    return Math.min(maxVal, 8) / 8.0;
  });
  const avgCoverage = coverages.reduce((sum, val) => sum + val, 0) / SKILLS.length;
  const technicalCoverage = avgCoverage * 100;

  // 2. Role Diversity (25%)
  // Find primary focus for each member (highest skill)
  const primarySkills = members.map(m => {
    let bestSkill = SKILLS[0];
    let bestVal = m[bestSkill] || 0;
    for (const s of SKILLS) {
      if ((m[s] || 0) > bestVal) {
        bestVal = m[s];
        bestSkill = s;
      }
    }
    return bestSkill;
  });
  const uniqueRoles = new Set(primarySkills).size;
  const roleDiversity = nMembers > 1 ? (uniqueRoles / nMembers) * 100 : 100.0;

  // 3. Availability Coordination (15%)
  const avails = members.map(m => m.availability_hours || 15);
  const avgAvail = avails.reduce((sum, val) => sum + val, 0) / avails.length;
  const minAvail = Math.min(...avails);

  // High average is good, low bottleneck capacity is penalized
  const avgAvailComp = (Math.min(avgAvail, 25) / 25.0) * 70;
  const minAvailComp = (Math.min(minAvail, 10) / 10.0) * 30;
  const availabilityCoordination = avgAvailComp + minAvailComp;

  // 4. Communication Strength (20%)
  const comms = members.map(m => m.communication || 5);
  const maxComm = Math.max(...comms);
  const avgComm = comms.reduce((sum, val) => sum + val, 0) / comms.length;
  const communicationStrength = (maxComm * 0.6 + avgComm * 0.4) * 10; // scale 1-10 to 0-100

  // Combine
  const healthScore = 
    0.40 * technicalCoverage +
    0.25 * roleDiversity +
    0.15 * availabilityCoordination +
    0.20 * communicationStrength;

  return {
    healthScore: Math.round(healthScore * 10) / 10,
    technicalCoverage: Math.round(technicalCoverage * 10) / 10,
    roleDiversity: Math.round(roleDiversity * 10) / 10,
    availabilityCoordination: Math.round(availabilityCoordination * 10) / 10,
    communicationStrength: Math.round(communicationStrength * 10) / 10
  };
}

/**
 * Detects skill gaps in a team and produces alert banners.
 */
export function analyzeSkillGaps(members) {
  if (!members || members.length === 0) {
    return { gaps: [], targetVector: SKILLS.reduce((acc, s) => ({ ...acc, [s]: 7 }), {}) };
  }

  const gaps = [];
  const targetVector = {};

  for (const s of SKILLS) {
    const maxVal = Math.max(...members.map(m => m[s] || 0));

    if (maxVal < 4) {
      gaps.push({
        skill: s,
        label: SKILL_LABELS[s],
        maxValue: maxVal,
        status: 'Critical',
        severity: 2,
        recommendation: `The team lacks competent coverage in ${SKILL_LABELS[s]} (Max: ${maxVal}/10). Add a specialist.`
      });
      targetVector[s] = 8;
    } else if (maxVal < 6) {
      gaps.push({
        skill: s,
        label: SKILL_LABELS[s],
        maxValue: maxVal,
        status: 'Warning',
        severity: 1,
        recommendation: `The team has basic capacity in ${SKILL_LABELS[s]} (${maxVal}/10), but could benefit from a mentor.`
      });
      targetVector[s] = 7;
    } else {
      targetVector[s] = 3; // low priority
    }
  }

  // Sort critical first
  gaps.sort((a, b) => b.severity - a.severity);

  return { gaps, targetVector };
}

/**
 * Recommends teammates for a specific student profile.
 */
export function recommendTeammatesForStudent(studentId, students, topN = 5) {
  const target = students.find(s => s.student_id === studentId);
  if (!target) return [];

  return students
    .filter(s => s.student_id !== studentId)
    .map(s => ({
      student: s,
      compatibilityScore: calculateCompatibility(target, s)
    }))
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, topN);
}

/**
 * Recommends developers to add to a team based on Team Health delta gains.
 */
export function recommendTeammatesForTeam(teamMemberIds, students, topN = 5) {
  const teamMembers = students.filter(s => teamMemberIds.includes(s.student_id));
  if (teamMembers.length === 0) return [];

  const baseline = calculateTeamHealth(teamMembers);
  const baselineScore = baseline.healthScore;

  return students
    .filter(s => !teamMemberIds.includes(s.student_id))
    .map(s => {
      const simulatedTeam = [...teamMembers, s];
      const simulatedHealth = calculateTeamHealth(simulatedTeam);
      const healthGain = simulatedHealth.healthScore - baselineScore;

      return {
        student: s,
        newHealthScore: simulatedHealth.healthScore,
        healthGain: Math.round(healthGain * 10) / 10,
        simulatedBreakdown: simulatedHealth
      };
    })
    .sort((a, b) => b.healthGain - a.healthGain)
    .slice(0, topN);
}