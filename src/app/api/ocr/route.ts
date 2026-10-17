import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { documentUrl, docType } = await request.json();

    const prompt = Act as an official verification authority for maternal healthcare facilities.
    Analyze the uploaded document for CAC Registration/License type: "".
    Determine if it is valid, extract the Registration Number, Expiry Date, and Facility Name.
    Return JSON format: { "isValid": boolean, "regNumber": string, "facilityName": string, "confidenceScore": number };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      analysis: JSON.parse(response.text || '{}')
    });
  } catch (error) {
    return NextResponse.json({ error: 'OCR Processing Failed' }, { status: 500 });
  }
}
