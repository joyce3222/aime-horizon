import OpenAI from "openai";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const user = cookieStore.get("internal_user");
  if (!user?.value) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt, style } = await req.json();
  if (!prompt?.trim()) {
    return Response.json({ error: "No prompt provided" }, { status: 400 });
  }

  // Enhance prompt for Xiaohongshu aesthetic
  const styleGuide = style === "product"
    ? "clean product photography style, white or minimal background, soft natural lighting, aesthetic and minimalist, suitable for Chinese social media Xiaohongshu (Little Red Book)"
    : style === "lifestyle"
    ? "lifestyle photography style, warm tones, authentic and aspirational, aesthetic flat lay or candid shot, suitable for Xiaohongshu (Little Red Book)"
    : "modern Chinese social media aesthetic, clean composition, soft lighting, visually appealing, suitable for Xiaohongshu (Little Red Book)";

  const enhancedPrompt = `${prompt}. Style: ${styleGuide}. High quality, 4K, professional photography.`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    const imageUrl = response.data?.[0]?.url;
    const revisedPrompt = response.data?.[0]?.revised_prompt;

    return Response.json({ imageUrl, revisedPrompt });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
