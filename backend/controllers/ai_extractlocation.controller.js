// utils/extractLocationFromMetadata.js
import axios from "axios";
import dotenv from "dotenv";
// import { RateLimiter } from "../utils/rateLimiter.js";
import { CohereClientV2 } from "cohere-ai";
dotenv.config();

// const rateLimiter = new RateLimiter(18, 60 * 1000);


export async function extractLocationFromMetadata(title, description) {

  

  const prompt = `
You are an intelligent assistant that extracts accurate travel location data from YouTube video metadata, especially for travel vlogs.

Given the following YouTube video title and description, extract the most precise location data possible. Focus on identifying the **actual place being visited**, not just general references.

Return your answer in strict JSON format as:
{
  "country": "Country name (e.g., India, Japan)",
  "location": "Specific location or landmark (e.g., Colaba, Mumbai or Shibuya Crossing)",
  "locality": "Local area or neighborhood if available (e.g., Bandra, Old Delhi, etc.)",
  "latlong": [latitude, longitude] // Approximate values for accurate pin placement
}

Also note:
- If the video references multiple places, pick the **primary or most likely location**.
- You can infer locations from known landmarks, hotels, attractions, or city names in the text.
- Be careful to avoid false positives from channel names, hashtags, or unrelated mentions.
- If you are unsure, make your best intelligent guess using available clues.
- Latitude and longitude should be **accurate enough to place a pin on a map**.

Title: ${title}
Description: ${description}
`;


  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // model: "openai/gpt-3.5-turbo",
        model : "nousresearch/deephermes-3-mistral-24b-preview:free",
        messages: [
          { role: "system", content: "You are a helpful assistant that extracts travel location data." },
          { role: "user", content: prompt }
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`,
          // "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const responseData = response.data;

    if (
      !responseData ||
      !responseData.choices ||
      !Array.isArray(responseData.choices) ||
      !responseData.choices[0]?.message?.content
    ) {
      console.error("Invalid AI response format", responseData);
      return null;
    }

    const jsonString = response.data.choices[0].message.content;
    const cleaned = jsonString.replace(/```json|```/g, "").trim();
    // console.log("AI response:", cleaned);
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI location extraction failed:", error?.response?.data || error.message);
    return null;
  }
}




export async function extractLocationFromMetadataCohere(title, description) {
  try{
    const prompt = `
You are an intelligent assistant that extracts accurate travel location data from YouTube video metadata, especially for travel vlogs.

Given the following YouTube video title and description, extract the most precise location data possible. Focus on identifying the **actual place being visited**, not just general references.

Return your answer in strict JSON format as:
{
  "country": "Country name (e.g., India, Japan)",
  "location": "Specific location or landmark (e.g., Colaba, Mumbai or Shibuya Crossing)",
  "locality": "Local area or neighborhood if available (e.g., Bandra, Old Delhi, etc.)",
  "latlong": [longitude, latitude] // Approximate values for accurate pin placement
}

I wanted output to be in strict JSON format, so please do not add any extra text, markdown, or commentary.
no extra explanation, no annotations, no formatting. Just JSON.

Also note:
- If the video references multiple places, pick the **primary or most likely location**.
- You can infer locations from known landmarks, hotels, attractions, or city names in the text.
- Be careful to avoid false positives from channel names, hashtags, or unrelated mentions.
- If you are unsure, make your best intelligent guess using available clues.
- Latitude and longitude should be **accurate enough to place a pin on a map**.

Title: ${title}
Description: ${description}
`;
    const cohere = new CohereClientV2({
      token: process.env.COHERE_API_KEY2,
    });

    
    const response = await cohere.chat({
      model: 'command-a-03-2025',
      messages: [
          { role: "system", content: "You are a helpful assistant that extracts travel location data." },
          { role: "user", content: prompt }
      ],
    });

    const responseData = response.message["content"][0].text;
    console.log("AI response:", responseData);

    // if (
    //   !responseData ||
    //   !responseData.choices ||
    //   !Array.isArray(responseData.choices) ||
    //   !responseData.choices[0]?.message?.content
    // ) {
    //   console.error("Invalid AI response format", responseData);
    //   return null;
    // }

    // const jsonString = response.data.choices[0].message.content;
    const jsonString = response.message["content"][0].text;
    const cleaned = jsonString.replace(/```json|```/g, "").trim();
    // console.log("AI response:", cleaned);
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI location extraction failed:", error?.response?.data || error.message);
    return null;
  }
}
