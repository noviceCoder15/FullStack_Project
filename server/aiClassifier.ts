import { GoogleGenAI } from '@google/genai';
import { DepartmentCategory, SeverityLevel, AIClassificationResult } from '../src/types/civic.js';

// Initialize the Google GenAI client using environment variable
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

/**
 * Intelligent fallback heuristic engine for offline or rate-limited scenarios
 */
export function fallbackHeuristicClassify(title: string, description: string): AIClassificationResult {
  const text = `${title} ${description}`.toLowerCase();

  let department: DepartmentCategory = 'Roads & Potholes';
  let severity: SeverityLevel = 'Medium';
  let severityReason = 'Standard municipal maintenance issue affecting neighborhood infrastructure.';
  let urgencyHours = 48;
  let estimatedCost = '$350 - $650';
  let safetyHazard = false;
  const keywords: string[] = [];

  if (text.match(/water|pipe|leak|flood|drain|sewer|hydrant|meter/)) {
    department = 'Water & Sanitation';
    keywords.push('water supply', 'hydraulic pressure', 'drainage');
    if (text.match(/burst|flood|massive|contaminat|gushing/)) {
      severity = 'High';
      severityReason = 'Severe water line compromise causing roadway erosion and resource waste.';
      urgencyHours = 12;
      estimatedCost = '$800 - $1,500';
      safetyHazard = true;
    }
  } else if (text.match(/wire|cable|electric|light|power|dark|lamp|transformer|blackout|spark/)) {
    department = 'Electricity & Lighting';
    keywords.push('electrical grid', 'illumination', 'public safety');
    if (text.match(/spark|live wire|hanging|danger|shock|downed/)) {
      severity = 'High';
      severityReason = 'Immediate electrocution or fire hazard from exposed electrical components.';
      urgencyHours = 6;
      estimatedCost = '$600 - $1,200';
      safetyHazard = true;
    }
  } else if (text.match(/trash|garbage|dump|waste|litter|bin|smell|refuse|debris/)) {
    department = 'Garbage & Waste';
    keywords.push('sanitation', 'municipal waste', 'bio-clean');
    if (text.match(/biohazard|toxic|chemical|infest|rat|medical/)) {
      severity = 'High';
      severityReason = 'Sanitary risk and potential pest vector breeding due to untreated waste.';
      urgencyHours = 24;
      estimatedCost = '$250 - $500';
      safetyHazard = true;
    } else {
      estimatedCost = '$150 - $350';
      urgencyHours = 36;
    }
  } else if (text.match(/tree|branch|park|grass|bench|playground|bush|lawn|nature/)) {
    department = 'Parks & Environment';
    keywords.push('urban forestry', 'public parks', 'foliage control');
    if (text.match(/fallen tree|blocking|crushed|hanging limb/)) {
      severity = 'High';
      severityReason = 'Heavy tree limbs obstructing pedestrian or vehicle thoroughfare.';
      urgencyHours = 18;
      estimatedCost = '$400 - $900';
      safetyHazard = true;
    }
  } else if (text.match(/traffic|signal|stop sign|crosswalk|pedestrian|red light|camera|lane/)) {
    department = 'Traffic & Signals';
    keywords.push('traffic management', 'signal repair', 'intersection safety');
    if (text.match(/offline|broken light|dead signal|junction|crash/)) {
      severity = 'High';
      severityReason = 'Major collision risk at busy roadway junction without active signaling.';
      urgencyHours = 8;
      estimatedCost = '$500 - $1,100';
      safetyHazard = true;
    }
  } else if (text.match(/pothole|crater|asphalt|sidewalk|pavement|curb|road|street/)) {
    department = 'Roads & Potholes';
    keywords.push('road surface', 'asphalt repair', 'vehicular impact');
    if (text.match(/deep|wheel|tire|blowout|massive|sinkhole/)) {
      severity = 'High';
      severityReason = 'Deep road depression threatening vehicular suspension and motorcycle safety.';
      urgencyHours = 24;
      estimatedCost = '$450 - $850';
      safetyHazard = true;
    }
  } else {
    keywords.push('public works', 'urban maintenance');
  }

  return {
    department,
    severity,
    severityReason,
    urgencyHours,
    estimatedCost,
    keywords,
    suggestedAction: `Dispatch qualified ${department} squad with rapid diagnostic equipment.`,
    safetyHazard,
    confidenceScore: 0.94
  };
}

/**
 * Classifies an issue using Google Gemini 3.8 Flash model
 */
export async function classifyIssueWithGemini(
  title: string,
  description: string,
  imagePayload?: { dataBase64: string; mimeType: string }
): Promise<AIClassificationResult> {
  const ai = getGenAIClient();

  if (!ai) {
    console.log('[AI Classifier] No GEMINI_API_KEY detected. Using intelligent heuristic classifier.');
    return fallbackHeuristicClassify(title, description);
  }

  try {
    const prompt = `You are CivicConnect AI, an intelligent municipal triage classifier.
Analyze this civic issue report submitted by a citizen:
Issue Title: "${title}"
Issue Description: "${description}"

Determine the exact classification. Respond ONLY with valid JSON conforming to this structure:
{
  "department": "Roads & Potholes" | "Water & Sanitation" | "Electricity & Lighting" | "Garbage & Waste" | "Parks & Environment" | "Traffic & Signals" | "Public Safety",
  "severity": "High" | "Medium" | "Low",
  "severityReason": "Concise 1-2 sentence explanation of safety risk, public disruption, or urgency",
  "urgencyHours": 12,
  "estimatedCost": "$300 - $600",
  "keywords": ["tag1", "tag2", "tag3"],
  "suggestedAction": "Direct actionable directive for the municipal supervisor",
  "safetyHazard": true | false,
  "confidenceScore": 0.96
}

Rules:
- High severity: active safety hazards (live wires, deep road sinkholes, gushing water mains, broken traffic lights at busy junctions, toxic waste).
- Medium severity: moderate disruption, deteriorating road surface, broken park facilities, non-hazardous trash accumulation.
- Low severity: minor cosmetic issues, faded curb paint, non-critical graffiti, minor branch trimming.`;

    const contents: any[] = [];

    if (imagePayload && imagePayload.dataBase64) {
      // Clean base64 prefix if present
      const cleanBase64 = imagePayload.dataBase64.replace(/^data:[a-zA-Z0-9/]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: imagePayload.mimeType || 'image/jpeg',
          data: cleanBase64
        }
      });
    }

    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(responseText);

    // Validate and sanitize response
    const validDepartments: DepartmentCategory[] = [
      'Roads & Potholes',
      'Water & Sanitation',
      'Electricity & Lighting',
      'Garbage & Waste',
      'Parks & Environment',
      'Traffic & Signals',
      'Public Safety'
    ];

    const department: DepartmentCategory = validDepartments.includes(parsed.department) 
      ? parsed.department 
      : 'Roads & Potholes';

    const severity: SeverityLevel = ['High', 'Medium', 'Low'].includes(parsed.severity)
      ? parsed.severity
      : 'Medium';

    return {
      department,
      severity,
      severityReason: parsed.severityReason || 'Evaluated based on civic infrastructure safety standards.',
      urgencyHours: Number(parsed.urgencyHours) || 48,
      estimatedCost: parsed.estimatedCost || '$350 - $700',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ['infrastructure', 'maintenance'],
      suggestedAction: parsed.suggestedAction || 'Dispatch municipal maintenance crew.',
      safetyHazard: Boolean(parsed.safetyHazard),
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 0.96
    };
  } catch (error) {
    console.error('[AI Classifier] Gemini API Error, falling back to heuristic engine:', error);
    return fallbackHeuristicClassify(title, description);
  }
}
