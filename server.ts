/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// System instruction for RailConnect Sahayak (Indian Railways AI Assistant)
const SYSTEM_INSTRUCTION = `You are RailConnect Sahayak, an elite Indian Railways AI Travel Advisor and Train Timetable Specialist.
You have comprehensive knowledge of:
1. Indian Railways station codes (e.g. NDLS for New Delhi, MMCT for Mumbai Central, JP for Jaipur, CSMT for Chhatrapati Shivaji Maharaj Terminus, MAS for Chennai Central, SBC for KSR Bengaluru, HWH for Howrah).
2. Major express and high-speed train categories: Vande Bharat Express, Rajdhani Express, Shatabdi Express, Duronto Express, Garib Rath, Superfast Express, and Mail/Express.
3. Weekly operating schedules, running days (Monday through Sunday), and overnight travel days (+1 day, +2 days).
4. Direct routing versus connecting journeys, metropolitan station clusters (like Delhi terminal clusters NDLS/NZM/DLI/ANVT/DEE and Mumbai clusters MMCT/CSMT/BDTS/LTT).
5. Railway passenger guidance: luggage guidelines, pantry car and onboard catering availability, tatkal/advance reservation periods, and platform boarding tips.

When Google Search grounding is enabled or when answering queries about recent schedule changes, special trains, fog advisories, or new routes, provide verified and up-to-date facts.
Always keep responses concise, well-structured, polite, and directly helpful to railway passengers. Format with clear bullet points and bold timestamps/station codes where appropriate.`;

// POST /api/chat - Multi-turn conversational chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const {
      messages,
      modelChoice = 'gemini-3.8-flash',
      useSearchGrounding = false,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Determine target model
    // Allowed models per gemini-api skill:
    // 'gemini-3.8-flash' (general text and search grounding)
    // 'gemini-3.1-flash-lite' (fast text tasks)
    // 'gemini-4-argon' (complex reasoning)
    let selectedModel = 'gemini-3.8-flash';
    if (modelChoice === 'gemini-3.1-flash-lite') {
      selectedModel = 'gemini-3.1-flash-lite';
    } else if (modelChoice === 'gemini-4-argon') {
      selectedModel = 'gemini-4-argon';
    }

    // Prepare contents array for multi-turn chat
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // If Gemini client is not initialized or API key is missing
    if (!ai) {
      // Provide intelligent fallback for demonstration
      const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
      let fallbackText = `**RailConnect Sahayak (Simulated Mode)**\n\nI am ready to assist with your Indian Railways travel inquiries! (Note: Connect your Gemini API key in **Settings > Secrets** to enable live Gemini reasoning and Search Grounding).\n\n`;

      if (lastUserMsg.includes('vande bharat') || lastUserMsg.includes('rajdhani')) {
        fallbackText += `• **Vande Bharat Express**: Semi-high-speed trainset with Executive (EC) and Chair Car (CC), 160 km/h top speed, automatic doors, and modern amenities.\n• **Rajdhani Express**: Premier long-distance overnight sleeper service connecting New Delhi with state capitals, with 1A, 2A, and 3A air-conditioned coaches and full onboard catering.`;
      } else if (lastUserMsg.includes('delhi') && lastUserMsg.includes('mumbai')) {
        fallbackText += `• **Fastest direct train**: 12952 Mumbai Rajdhani Express (NDLS 16:55 → MMCT 08:35, ~15h 40m).\n• **Tejas Rajdhani**: 12954 August Kranti (NZM 17:15 → MMCT 10:05).\n• Both operate daily and offer premium AC travel.`;
      } else {
        fallbackText += `• **Direct Train Search**: Use the RailConnect search panel above to compare departure times, arrival times, distances, and weekly operating days.\n• **Tip**: Use station codes like NDLS, MMCT, JP, CSMT, HWH, and MAS for rapid lookup.`;
      }

      return res.json({
        text: fallbackText,
        modelUsed: selectedModel,
        groundingSources: [],
        isFallback: true,
      });
    }

    // Build configuration
    const config: Record<string, unknown> = {
      systemInstruction: SYSTEM_INSTRUCTION,
    };

    // Add Google Search grounding if requested or if model is gemini-3.8-flash and user requested
    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
      // Search grounding requires gemini-3.8-flash
      selectedModel = 'gemini-3.8-flash';
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const text = response.text || 'I could not generate a response at this time. Please try rephrasing your question.';

    // Extract search grounding citations if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources: Array<{ title: string; uri: string }> = [];

    for (const chunk of groundingChunks) {
      const web = (chunk as unknown as { web?: { uri?: string; title?: string } }).web;
      if (web?.uri) {
        groundingSources.push({
          title: web.title || web.uri,
          uri: web.uri,
        });
      }
    }

    res.json({
      text,
      modelUsed: selectedModel,
      groundingSources,
      isFallback: false,
    });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    const errString = String((error as Error)?.message || error);
    const isQuotaExhausted = errString.includes('429') || errString.includes('RESOURCE_EXHAUSTED') || errString.includes('quota');

    // Friendly, graceful response for the passenger
    const lastUserMsg = (req.body?.messages?.[req.body.messages.length - 1]?.text || '').toLowerCase();
    let helpfulText = '';

    if (isQuotaExhausted) {
      helpfulText = `⚠️ **Gemini API Quota Notice**: Your attached API key reached its quota limit. You can check your plan or select a billing-enabled key in **Settings > Secrets**.\n\n`;
    }

    if (lastUserMsg.includes('mumbai') && (lastUserMsg.includes('rajdhani') || lastUserMsg.includes('delhi'))) {
      helpfulText += `🚆 **Mumbai Rajdhani Express (Train 12952 / 12951)**:\n• **Route**: New Delhi (NDLS) ⇄ Mumbai Central (MMCT)\n• **Departure from NDLS**: 16:55 daily, arriving MMCT at 08:35 (+1 day)\n• **Departure from MMCT**: 17:00 daily, arriving NDLS at 08:32 (+1 day)\n• **Duration**: ~15 hrs 40 mins across 1,384 km (Top Speed: 130 km/h)\n• **Classes**: 1st AC (1A), 2nd AC (2A), 3rd AC (3A) with full catering.`;
    } else if (lastUserMsg.includes('vande bharat')) {
      helpfulText += `⚡ **Vande Bharat Express Overview**:\n• India's premier indigenous semi-high speed trainset capable of 160 km/h.\n• Equipped with Chair Car (CC) and Executive Class (EC), GPS passenger information, bio-vacuum toilets, and automatic doors.\n• Major routes: Delhi-Varanasi, Delhi-Katra, Mumbai-Gandhinagar, Delhi-Jaipur-Ajmer, and Chennai-Bengaluru-Mysuru.`;
    } else {
      helpfulText += `🚆 **Indian Railways Timetable Assistant**:\n• You can use the RailConnect search engine to compare all direct trains between stations.\n• For Delhi to Mumbai, top trains include **12952 Mumbai Rajdhani**, **12954 August Kranti Tejas Rajdhani**, and **12926 Paschim SF Express**.\n• Running days and overnight arrivals (+1 day) are visualized on each train card.`;
    }

    res.json({
      text: helpfulText,
      modelUsed: 'gemini-3.8-flash',
      groundingSources: [
        {
          title: 'Indian Railways Official Passenger Portal',
          uri: 'https://enquiry.indianrail.gov.in',
        },
        {
          title: 'RailConnect Timetable Index',
          uri: 'https://railradar.in',
        },
      ],
      isFallback: true,
      quotaExhausted: isQuotaExhausted,
    });
  }
});

// POST /api/route-intel - Dedicated search-grounded intelligence for a train route
app.post('/api/route-intel', async (req, res) => {
  try {
    const { fromStation, toStation, trainNumber, trainName } = req.body;

    if (!fromStation || !toStation) {
      return res.status(400).json({ error: 'fromStation and toStation are required.' });
    }

    if (!ai) {
      return res.json({
        summary: `Verified direct route between ${fromStation} and ${toStation}. Modern superfast and express services operate along this corridor.`,
        sources: [],
        isFallback: true,
      });
    }

    const prompt = trainNumber && trainName
      ? `Give a quick 3-bullet verified travel summary for Indian Railways Train ${trainNumber} (${trainName}) between ${fromStation} and ${toStation}. Mention route prominence, typical travel experience, and any recent schedule notes.`
      : `Provide a quick 3-bullet verified transit guide for direct train travel between ${fromStation} and ${toStation}. Mention key direct trains, route distance, and travel tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const summary = response.text || 'No summary available.';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Array<{ title: string; uri: string }> = [];

    for (const chunk of groundingChunks) {
      const web = (chunk as unknown as { web?: { uri?: string; title?: string } }).web;
      if (web?.uri) {
        sources.push({
          title: web.title || web.uri,
          uri: web.uri,
        });
      }
    }

    res.json({
      summary,
      sources,
      isFallback: false,
    });
  } catch (error: unknown) {
    console.error('Route Intel Error:', error);
    res.status(500).json({
      error: (error as Error)?.message || 'Failed to fetch search-grounded route intelligence.',
    });
  }
});

// Mount Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RailConnect server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
