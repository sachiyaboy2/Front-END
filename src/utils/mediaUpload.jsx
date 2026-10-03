import { createClient } from "@supabase/supabase-js";

const anonKey =
  "sb_publishable_V4oZb3VfSfBAOU3Htyv5rg_Y6vMMzAJ";

const supabaseUrl =
  "https://gbxtxssjwxxeocoghbkt.supabase.co";

const supabase = createClient(
  supabaseUrl,
  anonKey
);

export default async function MediaUploader(file) {
  if (!file) {
    throw new Error("No file has been selected");
  }

  // Unique file name
  const timestamp = Date.now();

  // File name එක clean කරගන්න
  const safeFileName = file.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  );

  const fileName = `${timestamp}-${safeFileName}`;

  // Upload image
  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("Supabase Upload Error:", error);
    throw error;
  }

  console.log("Upload Data:", data);

  // IMPORTANT: මෙතන file.name නෙවෙයි fileName
  const { data: publicData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  return publicData.publicUrl;
}