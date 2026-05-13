import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProductDescription(productName: string, category: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a futuristic, cyberpunk-style product description for a high-tech "${productName}" in the "${category}" category. The tone should be edgy, advanced, and appealing to a tech-savvy audience in the year 2077. Use markdown for bolding and bullet points.`,
  });
  return response.text;
}

export async function getSmartRecommendations(userHistory: any[], currentProduct?: any) {
  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        reason: { type: Type.STRING, description: "Why this product is recommended" },
        tag: { type: Type.STRING, description: "A short catchy tag for the recommendation" }
      },
      required: ["reason", "tag"]
    }
  };

  const prompt = currentProduct 
    ? `Assuming a user is looking at "${currentProduct.name}" and has a history of ${JSON.stringify(userHistory)}, provide 3 futuristic recommendation insights.`
    : `Provide 5 futuristic shopping insights/recommendations based on this user behavior: ${JSON.stringify(userHistory)}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse recommendations", e);
    return [];
  }
}

export async function smartSearch(query: string, allProducts: any[]) {
  const schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING, description: "Product IDs that match the semantic intent of the query" }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Filter these products for the search query: "${query}". Return only the IDs of products that semantically match, even if the keyword isn't exact. Products: ${JSON.stringify(allProducts.map(p => ({ id: p.id, name: p.name, category: p.category, description: p.description })))}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).map(p => p.id);
  }
}
