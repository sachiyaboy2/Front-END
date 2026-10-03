import { useState } from "react";
import MediaUploader from "../utils/mediaUpload";

export default function TestPage() {
  const [file, setFile] = useState(null);

  async function uploadImage() {
    try {
      if (!file) {
        console.log("Please select a file first");
        return;
      }

      const link = await MediaUploader(file);

      console.log("Uploaded Image URL:", link);
    } catch (error) {
      console.error("Upload Failed:", error);
    }
  }

  return (
    <div className="w-full h-screen bg-[#D99B21]">

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
        }}
      />

      <button
        type="button"
        onClick={uploadImage}
        className="bg-accent text-secoundry p-3 rounded-full w-44"
      >
        Upload Image
      </button>

    </div>
  );
}