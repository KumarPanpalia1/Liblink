
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getBookRecommendations(interests) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Recommend 5 books for a student interested in: ${interests}. Return ONLY a JSON array with "title" and "author".`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return JSON.parse(text);
  } catch (e) {
    return [{ title: "Atomic Habits", author: "James Clear" }];
  }
}

module.exports = { getBookRecommendations };