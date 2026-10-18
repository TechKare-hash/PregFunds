import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { documentUrl, docType } = await request.json();

    // Fix 1: Added backticks and injected the docType variable correctly
    const prompt = `Act as an official verification authority for maternal healthcare facilities.
Analyze the uploaded document for CAC Registration/License type: "${docType || 'General'}".
Determine if it is valid, extract the Registration Number, Expiry Date, and Facility Name.
Return valid JSON format only: { "isValid": boolean, "regNumber": string, "facilityName": string, "confidenceScore": number };`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured on server' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Safely clean markdown code blocks if Gemini returns ```json ... ```
    const rawText = response.text || '{}';
    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    return NextResponse.json({
      success: true,
      analysis: JSON.parse(cleanedText),
    });
  } catch (error: any) {
    console.error('OCR Processing Error:', error);
    return NextResponse.json({ error: error.message || 'OCR Processing Failed' }, { status: 500 });
  }
}