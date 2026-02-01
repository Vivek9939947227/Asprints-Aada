
import { GoogleGenAI } from "@google/genai";
import { Property } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSmartRecommendations(query: string, properties: Property[]): Promise<string[]> {
  const model = 'gemini-3-flash-preview';
  
  const propertiesContext = properties.map(p => ({
    id: p.id,
    title: p.title,
    type: p.type,
    city: p.city,
    location: p.location,
    hubs: p.nearbyHubs.join(', '),
    price: p.price.Month
  }));

  const prompt = `
    You are an AI assistant for "AsprintsAada", a stay booking app.
    User Query: "${query}"
    
    Available Properties JSON:
    ${JSON.stringify(propertiesContext)}

    Based on the query, identify the top 3 property IDs that match best. 
    Explain briefly why in a natural tone.
    Return only the list of IDs.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // Use response.text as a property getter (not a method)
    const text = response.text || "";
    const ids = properties.map(p => p.id).filter(id => text.includes(id));
    return ids;
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function generatePropertyDescription(title: string, amenities: string[]): Promise<string> {
  const model = 'gemini-3-flash-preview';
  const prompt = `Generate a catchy, Gen-Z friendly property description for a stay named "${title}" with amenities: ${amenities.join(', ')}. Keep it under 150 words. Focus on convenience for students/professionals. Use emojis and a vibrant tone.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    // Use response.text as a property getter (not a method)
    return response.text || "No description generated.";
  } catch (error) {
    return "Error generating description.";
  }
}

export async function analyzePropertyPhotos(base64Images: string[]): Promise<{ amenities: string[], qualityScore: number, feedback: string }> {
  // Use gemini-3-flash-preview for multimodal analysis with JSON response support
  const model = 'gemini-3-flash-preview';
  
  const parts = base64Images.map(img => ({
    inlineData: {
      data: img.split(',')[1],
      mimeType: "image/jpeg"
    }
  }));

  const prompt = {
    text: `Analyze these real estate photos. 
    1. Identify which of these amenities are present: WiFi, AC, Power Backup, Laundry, Attached Washroom, Geyser, Security, CCTV, RO Water, Parking, Gym, Meals Included.
    2. Rate the photo quality out of 100 based on lighting, clarity, and composition.
    3. Provide a one-sentence feedback for the owner.
    Return JSON format: { "amenities": [], "qualityScore": 0, "feedback": "" }`
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [...parts, prompt] },
      config: {
        responseMimeType: "application/json"
      }
    });
    // Use response.text as a property getter (not a method)
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Photo Analysis Error:", error);
    return { amenities: [], qualityScore: 0, feedback: "Unable to analyze photos." };
  }
}

export async function getPropertyAiSummary(property: Property): Promise<string> {
  const model = 'gemini-3-flash-preview';
  const prompt = `Based on these details: ${property.title}, ${property.type}, ${property.location}, Amenities: ${property.amenities.join(', ')}. Summarize the "vibe" and top 3 reasons to stay here for a student or professional. Also mention any "Strengths" and "Weaknesses" based on a general profile. Keep it concise.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    // Use response.text as a property getter (not a method)
    return response.text || "";
  } catch (error) {
    return "";
  }
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  const model = 'gemini-3-flash-preview';
  const prompt = `Translate the following text to ${targetLang}. Preserve the tone and emojis: "${text}"`;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    // Use response.text as a property getter (not a method)
    return response.text || text;
  } catch (e) {
    return text;
  }
}

export async function extractIdDetails(base64Image: string): Promise<{ name: string, idNumber: string, address: string }> {
  // Use gemini-3-flash-preview for multimodal analysis with JSON response support
  const model = 'gemini-3-flash-preview';
  const prompt = {
    text: "Extract 'name', 'idNumber', and 'address' from this ID document (e.g. Aadhaar). Return as JSON. If unclear, provide best guesses."
  };
  const part = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: "image/jpeg"
    }
  };
  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [part, prompt] },
      config: { responseMimeType: "application/json" }
    });
    // Use response.text as a property getter (not a method)
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { name: "", idNumber: "", address: "" };
  }
}

export async function draftLeaseAgreement(owner: string, tenant: string, rent: number, property: string): Promise<string> {
  const model = 'gemini-3-flash-preview';
  const prompt = `Draft a professional yet simple residential lease agreement for a property named "${property}". 
  Owner: ${owner}
  Tenant: ${tenant}
  Monthly Rent: INR ${rent}
  Include standard clauses for security deposit, maintenance, and termination.`;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    // Use response.text as a property getter (not a method)
    return response.text || "";
  } catch (e) {
    return "Error drafting agreement.";
  }
}

export async function diagnoseComplaint(base64Image: string): Promise<{ diagnosis: string, severity: string, estimatedCost: string }> {
  // Use gemini-3-flash-preview for multimodal analysis with JSON response support
  const model = 'gemini-3-flash-preview';
  const prompt = {
    text: "Analyze this maintenance issue photo (e.g., broken tap, leak, electrical). 1. Diagnosis of the problem. 2. Severity (Low, Medium, Emergency). 3. Estimated repair cost in INR. Return as JSON: { 'diagnosis': '', 'severity': '', 'estimatedCost': '' }"
  };
  const part = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: "image/jpeg"
    }
  };
  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [part, prompt] },
      config: { responseMimeType: "application/json" }
    });
    // Use response.text as a property getter (not a method)
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { diagnosis: "Unknown", severity: "Unknown", estimatedCost: "Unknown" };
  }
}

export async function suggestRentPrice(property: Property): Promise<{ suggestion: number, reason: string }> {
  const model = 'gemini-3-flash-preview';
  const prompt = `Analyze this property: ${property.title}, ${property.type} in ${property.city}. Current rent: ${property.price.Month}. Amenities: ${property.amenities.join(', ')}. 
  Suggest an optimal monthly rent based on current Indian market trends for students/professionals. Return JSON: { 'suggestion': 0, 'reason': '' }`;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    // Use response.text as a property getter (not a method)
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { suggestion: property.price.Month, reason: "Error fetching trends." };
  }
}

export async function getChatSuggestions(property: Property): Promise<string[]> {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Based on this property listing:
    Name: ${property.title}
    Type: ${property.type}
    Location: ${property.location}
    Amenities: ${property.amenities.join(', ')}
    Price: ${property.price.Month}/month
    Nearby Hubs: ${property.nearbyHubs.join(', ')}

    Suggest 3 distinct, short, and polite questions a potential tenant would likely ask the owner on WhatsApp to start a conversation.
    Example: "Is parking available for my bike?" or "How far is the metro station exactly?"
    Return only a JSON array of 3 strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    // Use response.text as a property getter (not a method)
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Failed to get chat suggestions", error);
    return [
      "Is the room still available for a visit?",
      "Can you tell me more about the food quality?",
      "How far is the nearest coaching institute?"
    ];
  }
}

export async function analyzeInquiry(message: string): Promise<{ seriousness: number, tone: string, isSpam: boolean, reasoning: string }> {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Analyze this rental inquiry message for a property owner:
    Message: "${message}"

    Evaluate based on:
    1. Seriousness (0-100 scale): Is the user actually interested or just messing around?
    2. Tone: (e.g., Professional, Casual, Rude, Desperate)
    3. Spam Check: Is this a bot, promotional content, or irrelevant?
    4. Reasoning: One sentence why.

    Return only JSON: { "seriousness": 0, "tone": "", "isSpam": false, "reasoning": "" }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    // Use response.text as a property getter (not a method)
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Inquiry Analysis Error:", error);
    return { seriousness: 50, tone: "Neutral", isSpam: false, reasoning: "Unable to analyze." };
  }
}
