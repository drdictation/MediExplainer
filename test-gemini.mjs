import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Load .env manually since we aren't using vite/dotenv here
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : '';

console.log("---------------------------------------------------");
console.log("  GEMINI API DEBUGGER");
console.log("---------------------------------------------------");
console.log(`API Key Found: ${apiKey ? "YES (" + apiKey.substring(0, 8) + "...)" : "NO"}`);
console.log("Testing Model: gemini-2.5-flash-lite");

if (!apiKey) {
    console.error("ERROR: No API Key found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        console.log("Sending test prompt...");
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("SUCCESS! Response received:");
        console.log(response.text());
    } catch (error) {
        console.error("\nFAILED TO CALL API:");
        console.error(error.message);
        console.error("\nTROUBLESHOOTING:");
        if (error.message.includes("404") || error.message.includes("not found")) {
            console.error("- The model 'gemini-2.5-flash-lite' might not be available for this API key type.");
            console.error("- Try 'gemini-1.5-flash' instead.");
        } else if (error.message.includes("403")) {
            console.error("- API Key might be invalid or restricted.");
        }
    }
}

test();
