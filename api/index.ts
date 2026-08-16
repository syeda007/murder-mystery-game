import express from "express";
import { getAIService, SchemaType } from "../lib/ai-service";

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const ai = getAIService();
  res.json({ status: "ok", time: new Date().toISOString(), aiReady: !!ai, aiProvider: ai?.provider ?? null });
});

// 1. Dynamic AI Suspect Interrogation Endpoint
app.post("/api/interrogate", async (req, res) => {
  try {
    const { caseContext, suspect, question, presentedClue, history } = req.body;
    const ai = getAIService();

    if (!ai) {
      let stressChange = 0;
      let text = "";
      let secretUnlocked = false;

      const qLower = (question || "").toLowerCase();
      const hasClue = !!presentedClue;

      if (hasClue && presentedClue.relatedSuspectId === suspect.id && presentedClue.importance === 'key') {
        stressChange = 30;
        secretUnlocked = true;
        text = `*Visibly turns pale and shifts in seat* Where... where did you find that?! That was supposed to remain private! Fine, yes, I had reasons to fear Vance, but that does not make me a murderer!`;
      } else if (qLower.includes("alibi") || qLower.includes("where were you")) {
        stressChange = suspect.isCulprit ? 10 : 0;
        text = `As I told you, ${suspect.publicAlibi}. I have nothing to hide from the authorities.`;
      } else if (qLower.includes("victim") || qLower.includes("vance") || qLower.includes("kill")) {
        stressChange = 5;
        text = `Julian was a complicated man. Many people held grudges, but taking a life in cold blood is monstrous.`;
      } else {
        stressChange = suspect.isCulprit ? 5 : 0;
        text = `I have answered everything I know truthfully, Detective. Check the physical evidence and leave me to my thoughts.`;
      }

      return res.json({
        text,
        stressChange,
        secretUnlocked,
        subtleSlipUp: suspect.isCulprit && (suspect.stressLevel + stressChange > 60) ? "Noticeable hesitation when referencing the exact time of death." : null
      });
    }

    const systemPrompt = `You are a dynamic roleplaying Game Master engine for a Murder Mystery Detective game.
You must roleplay as the suspect: "${suspect.name}" (${suspect.role}, Age: ${suspect.age}).
Personality: ${suspect.personality}
Relation to Victim: ${suspect.relationToVictim}
Public Alibi: ${suspect.publicAlibi}
Hidden Secret: ${suspect.secret}
Motive: ${suspect.motive}
Is this character the ACTUAL CULPRIT?: ${suspect.isCulprit ? 'YES (Guilty)' : 'NO (Innocent of murder, but may have other secrets)'}
Current Stress Level: ${suspect.stressLevel}/100

Victim Details: ${JSON.stringify(caseContext?.victim || {})}
Setting: ${caseContext?.setting || 'Unknown'}

Rules:
1. Stay strictly in character. Speak in first person with distinct tone, vocabulary, and subtle emotional cues (*nervous cough*, *scoff*, etc.).
2. If innocent, defend your dignity or explain why you acted suspiciously if presented with evidence.
3. If the culprit, lie convincingly to preserve your alibi, BUT if presented with irrefutable KEY clues linking you to the crime, become cornered, show psychological strain, or slip up slightly.
4. If the player's question or presented clue directly exposes the secret (${suspect.secret}), set secretUnlocked to true and increase stressChange.
5. Keep your response concise (2 to 4 sentences), atmospheric, and punchy.`;

    const contents = `Player Interrogation Prompt:
Question asked: "${question || '(The detective stares intently)'}"
Presented Clue: ${presentedClue ? JSON.stringify({ name: presentedClue.name, description: presentedClue.description, details: presentedClue.details }) : 'None'}
Recent dialogue history: ${JSON.stringify((history || []).slice(-4))}

Respond strictly in JSON matching the requested schema.`;

    const response = await ai.generateResponse(contents, {
      systemInstruction: systemPrompt,
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          text: {
            type: SchemaType.STRING,
            description: "The suspect's direct in-character spoken dialogue and physical reaction",
          },
          stressChange: {
            type: SchemaType.INTEGER,
            description: "Change in stress level (-10 to +35 based on pressure applied and clue validity)",
          },
          secretUnlocked: {
            type: SchemaType.BOOLEAN,
            description: "Whether this interaction cracked their hidden secret",
          },
          subtleSlipUp: {
            type: SchemaType.STRING,
            description: "A subtle contradiction or psychological slip-up noticed by the detective, or null if composed",
          }
        },
        required: ["text", "stressChange", "secretUnlocked"],
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);

  } catch (error) {
    console.error("Interrogation API Error:", error);
    res.status(500).json({
      text: "*The suspect pauses nervously, clearing their throat.* I... I have nothing more to say on that specific matter right now, Detective.",
      stressChange: 0,
      secretUnlocked: false,
      subtleSlipUp: null
    });
  }
});

// 2. Custom AI Mystery Case Generator Endpoint
app.post("/api/generate-case", async (req, res) => {
  try {
    const { theme, era, difficulty, customPrompt } = req.body;
    const ai = getAIService();

    if (!ai) {
      return res.status(400).json({ error: "AI provider API key is not configured on the server." });
    }

    const prompt = `Generate a complete, deeply engaging, solvable Murder Mystery Game Case.
Theme / Setting: ${theme || 'Atmospheric Noir'}
Era: ${era || '1930s Golden Age'}
Difficulty: ${difficulty || 'Detective'}
Custom Directives: ${customPrompt || 'Create a classic locked-room or high-stakes mystery with multiple suspects, contradictory alibis, and interconnected clues.'}

Requirements:
- 1 detailed Victim (name, title, backstory, cause of death, time of death, location found, autopsy notes).
- 3-4 distinct Rooms/Locations to search, each with 2-3 searchable items that yield forensic/document clues.
- 3-4 deep Suspects (name, role, age, personality, occupation, relation to victim, public alibi, dark secret, motive, isCulprit flag). Exactly ONE suspect is the true culprit.
- 6-8 physical, document, toxicological, or digital Clues with categories and importance ratings ('key', 'supporting', 'red_herring').
- Chronological Timeline events (some verified, some contradictory alibis).
- Complete verifiable Solution with culpritId, murder weapon, true motive, how alibi was broken, and an atmospheric epilogue.
- 3 Party Mode Rounds with Game Master narration scripts and private suspect prompts.`;

    const response = await ai.generateResponse(prompt, {
      systemInstruction: "You are the Master Storyteller and Architect of Murder Mysteries. Create rich, logically consistent, immersive detective cases.",
      responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
            title: { type: SchemaType.STRING },
            subtitle: { type: SchemaType.STRING },
            era: { type: SchemaType.STRING },
            setting: { type: SchemaType.STRING },
            difficulty: { type: SchemaType.STRING },
            estimatedTime: { type: SchemaType.STRING },
            summary: { type: SchemaType.STRING },
            victim: {
              type: SchemaType.OBJECT,
              properties: {
                name: { type: SchemaType.STRING },
                title: { type: SchemaType.STRING },
                age: { type: SchemaType.INTEGER },
                backstory: { type: SchemaType.STRING },
                causeOfDeath: { type: SchemaType.STRING },
                timeOfDeath: { type: SchemaType.STRING },
                locationFound: { type: SchemaType.STRING },
                autopsyNotes: { type: SchemaType.STRING }
              },
              required: ["name", "title", "causeOfDeath", "timeOfDeath", "locationFound"]
            },
            rooms: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.STRING },
                  name: { type: SchemaType.STRING },
                  description: { type: SchemaType.STRING },
                  atmosphere: { type: SchemaType.STRING },
                  searched: { type: SchemaType.BOOLEAN },
                  itemsToSearch: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        id: { type: SchemaType.STRING },
                        name: { type: SchemaType.STRING },
                        description: { type: SchemaType.STRING },
                        clueId: { type: SchemaType.STRING },
                        searched: { type: SchemaType.BOOLEAN }
                      },
                      required: ["id", "name", "description"]
                    }
                  }
                },
                required: ["id", "name", "description", "itemsToSearch"]
              }
            },
            suspects: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.STRING },
                  name: { type: SchemaType.STRING },
                  role: { type: SchemaType.STRING },
                  age: { type: SchemaType.INTEGER },
                  avatarSeed: { type: SchemaType.STRING },
                  personality: { type: SchemaType.STRING },
                  occupation: { type: SchemaType.STRING },
                  relationToVictim: { type: SchemaType.STRING },
                  publicAlibi: { type: SchemaType.STRING },
                  secret: { type: SchemaType.STRING },
                  secretUnlocked: { type: SchemaType.BOOLEAN },
                  motive: { type: SchemaType.STRING },
                  stressLevel: { type: SchemaType.INTEGER },
                  suspiciousnessRating: { type: SchemaType.INTEGER },
                  isCulprit: { type: SchemaType.BOOLEAN },
                  keyQuotes: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
                },
                required: ["id", "name", "role", "publicAlibi", "secret", "motive", "isCulprit"]
              }
            },
            clues: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.STRING },
                  name: { type: SchemaType.STRING },
                  category: { type: SchemaType.STRING },
                  importance: { type: SchemaType.STRING },
                  description: { type: SchemaType.STRING },
                  details: { type: SchemaType.STRING },
                  locationId: { type: SchemaType.STRING },
                  locationName: { type: SchemaType.STRING },
                  discovered: { type: SchemaType.BOOLEAN },
                  relatedSuspectId: { type: SchemaType.STRING },
                  contradictionHint: { type: SchemaType.STRING }
                },
                required: ["id", "name", "category", "importance", "description", "details", "locationId"]
              }
            },
            timeline: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.STRING },
                  time: { type: SchemaType.STRING },
                  description: { type: SchemaType.STRING },
                  location: { type: SchemaType.STRING },
                  suspectId: { type: SchemaType.STRING },
                  suspectName: { type: SchemaType.STRING },
                  isContradiction: { type: SchemaType.BOOLEAN },
                  verified: { type: SchemaType.BOOLEAN }
                },
                required: ["id", "time", "description", "location"]
              }
            },
            solution: {
              type: SchemaType.OBJECT,
              properties: {
                culpritId: { type: SchemaType.STRING },
                culpritName: { type: SchemaType.STRING },
                murderWeapon: { type: SchemaType.STRING },
                trueMotive: { type: SchemaType.STRING },
                howAlibiWasBroken: { type: SchemaType.STRING },
                fullEpilogue: { type: SchemaType.STRING }
              },
              required: ["culpritId", "culpritName", "murderWeapon", "trueMotive", "howAlibiWasBroken", "fullEpilogue"]
            },
            partyRounds: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  roundNumber: { type: SchemaType.INTEGER },
                  title: { type: SchemaType.STRING },
                  gmNarration: { type: SchemaType.STRING },
                  objectives: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                  publicClueReveal: { type: SchemaType.STRING },
                  suspectActions: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        suspectId: { type: SchemaType.STRING },
                        privatePrompt: { type: SchemaType.STRING }
                      },
                      required: ["suspectId", "privatePrompt"]
                    }
                  }
                },
                required: ["roundNumber", "title", "gmNarration", "objectives"]
              }
            }
          },
          required: ["id", "title", "subtitle", "era", "setting", "difficulty", "victim", "rooms", "suspects", "clues", "timeline", "solution", "partyRounds"]
        }
    });

    const parsedCase = JSON.parse(response.text || "{}");
    parsedCase.suspects = (parsedCase.suspects || []).map((s: any) => ({
      ...s,
      stressLevel: s.stressLevel || 20,
      secretUnlocked: false,
      dialogueHistory: [
        {
          id: `init-${s.id}`,
          sender: 'suspect',
          text: `I've told the police everything I saw. What else do you need to know, Detective?`,
          timestamp: 'Initial statement'
        }
      ]
    }));
    parsedCase.clues = (parsedCase.clues || []).map((c: any) => ({ ...c, discovered: false }));
    parsedCase.rooms = (parsedCase.rooms || []).map((r: any) => ({
      ...r,
      searched: false,
      itemsToSearch: (r.itemsToSearch || []).map((i: any) => ({ ...i, searched: false }))
    }));

    res.json(parsedCase);
  } catch (error) {
    console.error("Generate Case API Error:", error);
    res.status(500).json({ error: "Failed to generate case with Gemini AI." });
  }
});

// 3. AI Game Master Hint / Forensic Consultation Endpoint
app.post("/api/gm-hint", async (req, res) => {
  try {
    const { caseContext, discoveredClues, interrogatedSuspects } = req.body;
    const ai = getAIService();

    if (!ai) {
      return res.json({
        hint: "Review the timestamps on the timeline and check for physical discrepancies between the suspect's stated whereabouts and items found in the scene.",
        atmosphericObservation: "Rain lashes against the darkened windowpanes as the clock ticks closer to dawn."
      });
    }

    const prompt = `You are the Game Master for a Murder Mystery Detective game.
Case: "${caseContext?.title}"
Victim: ${caseContext?.victim?.name} (${caseContext?.victim?.causeOfDeath})
Discovered Clues (${discoveredClues?.length || 0}): ${JSON.stringify(discoveredClues?.map((c: any) => c.name) || [])}
Interrogated Suspects: ${JSON.stringify(interrogatedSuspects || [])}
True Solution: Culprit is ${caseContext?.solution?.culpritName}.

Provide a subtle, atmospheric Game Master hint that does NOT spoil the culprit directly, but guides the detective's focus to an overlooked contradiction, unexamined room, or psychological tension.`;

    const response = await ai.generateResponse(prompt, {
      systemInstruction: "You are an atmospheric Noir Game Master guiding an investigative sleuth.",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          hint: { type: SchemaType.STRING, description: "Subtle deductive guidance" },
          atmosphericObservation: { type: SchemaType.STRING, description: "Atmospheric sensory description of the scene" }
        },
        required: ["hint", "atmosphericObservation"]
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error) {
    console.error("GM Hint API Error:", error);
    res.json({
      hint: "Cross-reference the alibi times with the travel logs in the station.",
      atmosphericObservation: "The silence in the manor is heavy, broken only by the ticking pendulum clock."
    });
  }
});

// 4. Final Accusation Evaluation & Dramatic Verdict
app.post("/api/evaluate-accusation", async (req, res) => {
  try {
    const { caseContext, submission } = req.body;
    const solution = caseContext?.solution;

    const isCorrectCulprit = submission?.suspectId === solution?.culpritId;
    const isCorrectWeapon = (submission?.weapon || '').toLowerCase().includes((solution?.murderWeapon || '').slice(0, 8).toLowerCase());
    const isCorrectMotive = !!submission?.motive && submission.motive.length > 5;

    let score = 0;
    if (isCorrectCulprit) score += 50;
    if (isCorrectWeapon) score += 25;
    if (isCorrectMotive) score += 15;
    if (submission?.keyClueId) score += 10;

    let rank: 'Legendary Sleuth' | 'Senior Inspector' | 'Sharp Investigator' | 'Novice Constable' | 'Misguided Detective' = 'Misguided Detective';
    if (score >= 90) rank = 'Legendary Sleuth';
    else if (score >= 75) rank = 'Senior Inspector';
    else if (score >= 50) rank = 'Sharp Investigator';
    else if (score >= 30) rank = 'Novice Constable';

    const ai = getAIService();
    let critique = "";

    if (ai) {
      try {
        const evalPrompt = `Evaluate this detective's final accusation:
Case: ${caseContext?.title}
True Culprit: ${solution?.culpritName}
True Weapon: ${solution?.murderWeapon}
True Motive: ${solution?.trueMotive}
True Alibi Break: ${solution?.howAlibiWasBroken}

Player's Indictment:
- Accused Suspect ID: ${submission?.suspectId}
- Murder Weapon Claimed: ${submission?.weapon}
- Motive Claimed: ${submission?.motive}
- Key Clue Cited: ${submission?.keyClueId}
- Detective Reasoning Notes: ${submission?.reasoningNotes}

Write a 2-paragraph dramatic noir climax:
Paragraph 1: The Detective's confrontation in front of all gathered suspects and the suspect's reaction.
Paragraph 2: The final verdict, either unmasking the true criminal with confession or describing the tragic misdirection if the wrong person was accused.`;

        const response = await ai.generateResponse(evalPrompt, {
          systemInstruction: "You are the dramatic narrator of a classic mystery climax."
        });
        critique = response.text || "";
      } catch (err) {
        console.error("AI Verdict generation fallback", err);
      }
    }

    if (!critique) {
      if (isCorrectCulprit) {
        critique = `Your deduction was razor-sharp. Stepping into the center of the room, you laid out the undeniable trail of evidence. ${solution?.culpritName} attempted to maintain composure, but the web of contradictions left no escape. Handcuffs click into place as justice is served.`;
      } else {
        critique = `You pointed an accusatory finger, but your hypothesis crumbled under scrutiny. The true killer watched silently from the shadows, knowing the innocent suspect took the blame while they walked away free into the night.`;
      }
    }

    res.json({
      isCorrectCulprit,
      isCorrectWeapon,
      isCorrectMotive,
      score,
      rank,
      breakdown: {
        culpritAccuracy: isCorrectCulprit ? 50 : 0,
        evidenceScore: submission?.keyClueId ? 10 : 0,
        timeBonus: 15,
        deductionAccuracy: isCorrectWeapon ? 25 : 0
      },
      critique,
      confessionNarrative: isCorrectCulprit ? solution?.fullEpilogue : `The true murderer was ${solution?.culpritName}. ${solution?.howAlibiWasBroken}`
    });
  } catch (error) {
    console.error("Accusation Evaluation Error:", error);
    res.status(500).json({ error: "Failed to evaluate accusation." });
  }
});

export default app;
