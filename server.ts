import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenAI({ 
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route: Get Optimization Tips
  app.post("/api/optimize", async (req, res) => {
    try {
      const { hardware, targetFPS } = req.body;
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a professional Call of Duty performance coach. Provide a detailed optimization guide for a user with the following hardware: ${hardware}. Target FPS: ${targetFPS}. Focus on MW3/Warzone. Return only the optimized settings in a structured way.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              settings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    setting: { type: Type.STRING },
                    value: { type: Type.STRING },
                    impact: { type: Type.STRING },
                  },
                  required: ["category", "setting", "value"]
                }
              },
              proTip: { type: Type.STRING }
            }
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Optimization Error:", error);
      res.status(500).json({ error: "Failed to generate tips" });
    }
  });

  // API Route: Get Meta Loadouts
  app.post("/api/loadouts", async (req, res) => {
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Provide 3 current meta loadouts for Call of Duty Warzone. Include weapon name, attachments (5), and why it is meta. Target competitive play.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                weapon: { type: Type.STRING },
                type: { type: Type.STRING },
                attachments: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                description: { type: Type.STRING }
              }
            }
          }
        }
      });
      res.json(JSON.parse(response.text || "[]"));
    } catch (error: any) {
      console.error("Loadout Error:", error);
      res.status(500).json({ error: "Failed to fetch loadouts" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
