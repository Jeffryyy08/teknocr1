import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// --- CLIENTE OPENAI ---
const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

// --- CLIENTE SUPABASE (service role) ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // IMPORTANTE: service_key solo en rutas backend
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, name, specs } = body || {};

    if (!product_id || !name) {
      return NextResponse.json(
        { error: "Missing product_id or name" },
        { status: 400 }
      );
    }

    // 1. Revisar si ya existe descripción guardada
    const { data: existing, error: existingError } = await supabase
      .from("products")
      .select("ai_description")
      .eq("id", product_id)
      .single();

    if (existingError) console.error("Supabase lookup error:", existingError);

    if (existing?.ai_description) {
      return NextResponse.json({
        text: existing.ai_description,
        cached: true
      });
    }

    // 2. Generar IA si no existe descripción previa
    const prompt = `
Eres un experto en hardware. Escribe un párrafo breve, claro y profesional.
Debe sonar como una opinión sincera: objetiva, no exagerada y sin marketing.

Producto: ${name}
Especificaciones relevantes: ${JSON.stringify(specs || {}, null, 2)}

No menciones IA.
Máximo 500 caracteres.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim() ||
      "No se pudo generar la descripción.";

    // 3. Guardar descripción generada
    const { error: updateError } = await supabase
      .from("products")
      .update({ ai_description: text })
      .eq("id", product_id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
    }

    // 4. Devolver resultado
    return NextResponse.json({
      text,
      cached: false
    });
  } catch (error) {
    console.error("AI Route Error:", error);

    return NextResponse.json(
      { error: "AI generation failed", text: null },
      { status: 500 }
    );
  }
}
