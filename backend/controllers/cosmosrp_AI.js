import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function extractLocationMetadata(title, description) {
  const prompt = `
You are an intelligent assistant that extracts accurate travel location data from YouTube video metadata.

Given a YouTube video title and description, extract the most precise location data possible and return ONLY a **strict JSON object**, with no extra text, markdown, or commentary Since I will be using json for some other work.

The output must follow **exactly** this structure:
{
  "country": "Country name (e.g., India, Japan)",
  "location": "Specific location or landmark (e.g., Colaba, Mumbai or Shibuya Crossing)",
  "locality": "Local area or neighborhood if available (e.g., Bandra, Old Delhi, etc.)",
  "latlong": [latitude, longitude] // Approximate values for accurate pin placement
}
Guidelines:
- Only return JSON. Do not explain, annotate, or format it.
- Use intelligent guessing when location is unclear.
- If the description mentions multiple places, return the **primary or most likely** one.

Now extract data for:

Title: ${title}
Description: ${description}
`;


  try {
    const response = await axios.post(
      "https://api.pawan.krd/cosmosrp-it/v1/chat/completions", // using instructed version
      {
        model: "cosmosrp",
        messages: [
          { role: "system", content: "You are a helpful assistant that extracts travel location data from YouTube videos." },
          { role: "user", content: prompt }
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.PAWAN_API_KEY}`, // store your pawan API key in .env
          "Content-Type": "application/json"
        }
      }
    );
    console.log("AI response:", response.data.choices[0].message);

    const jsonString = response.data.choices[0].message.content;
    console.log("AI response:", jsonString);
    const cleaned = jsonString.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("CosmosRP location extraction failed:", error?.response?.data || error.message);
    return null;
  }
}
