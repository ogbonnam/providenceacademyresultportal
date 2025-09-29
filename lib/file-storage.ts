import fs from "fs/promises";
import path from "path";

/**
 * Saves a file from a FormData object to the public uploads directory.
 * @param file The file object from FormData.
 * @returns The public URL of the saved file, or null if no file was provided.
 */
export async function saveFile(
  file: File | undefined | null
): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  // Create the uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  // Create a unique file name to avoid collisions
  const extension = path.extname(file.name);
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}${extension}`;
  const filePath = path.join(uploadsDir, fileName);

  // Read the file as an array buffer and convert to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Write the file to the file system
  await fs.writeFile(filePath, buffer);

  // Return the public URL path
  return `/uploads/${fileName}`;
}
