export const runtime = "edge";
export const maxDuration = 60;

export async function POST(req) {
  try {
    const { content, subjectName } = await req.json();

    if (!content || content.trim().length < 20) {
      return Response.json({ error: "Not enough content to study." }, { status: 400 });
    }

    const prompt = `You are an expert study assistant. A student has uploaded their course material for "${subjectName || "My Course"}".

Your task: Analyze the content and generate a complete structured study dataset in STRICT JSON format (no markdown, no backticks, pure JSON only).

The JSON must follow EXACTLY this structure:
{
  "subjectName": "string (course name)",
  "tips": "string (3-5 key study tips separated by \\n)",
  "topics": [
    {
      "id": "snake_case_id",
      "title": "Topic Title",
      "icon": "single emoji",
      "notes": [
        { "q": "question text", "a": "answer text" }
      ]
    }
  ],
  "pastQuestions": [
    { "q": "fill-in-the-blank or direct question", "a": "model answer", "topic": "topic_id" }
  ]
}

Rules:
- Extract 4-10 DISTINCT topics from the material
- Each topic must have 6-15 flashcard Q&A pairs
- Past questions: 25-50 items, styled like exam fill-in-the-blank questions
- Answers must be detailed and accurate based on the provided content
- Icons: use relevant single emojis
- topic IDs in pastQuestions must match topic IDs in topics array
- Output ONLY valid JSON, nothing else

COURSE MATERIAL:
${content.substring(0, 14000)}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || "Gemini API error " + response.status);
    }

    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = raw.replace(/```json|```/g, "").trim();
    const match = clean.match(/\{[\s\S]*\}/);
    const jsonStr = match ? match[0] : clean;
    const parsed = JSON.parse(jsonStr);

    return Response.json(parsed);
  } catch (err) {
    console.error("Generate error:", err);
    return Response.json({ error: err.message || "Generation failed" }, { status: 500 });
  }
}
