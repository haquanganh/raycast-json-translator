import { getSelectedText, showToast, Toast, getPreferenceValues, showHUD } from "@raycast/api";
import { translate } from "google-translate-api-x";
import fs from "fs";
import path from "path";

interface Preferences {
  localesPath: string;
  sourceLang: string;
}

export default async function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const { localesPath, sourceLang } = preferences;
  console.log("Preferences:", { localesPath, sourceLang });

  if (!fs.existsSync(localesPath)) {
    console.error(`Locales path not found: ${localesPath}`);
    await showToast({
      style: Toast.Style.Failure,
      title: "Locales path does not exist",
      message: localesPath,
    });
    return;
  }

  let selectedText: string;
  try {
    selectedText = await getSelectedText();
    console.log("Selected text:", selectedText);
  } catch (error) {
    console.error("Failed to get selected text:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Could not get selected text",
      message: "Please ensure text is selected in your editor.",
    });
    return;
  }

  // Basic regex to match "key": "value" or "key": 'value' or key: "value"
  // It handles simple flat JSON structures as requested.
  const jsonMatch = selectedText.match(/["']?([^"'\s:]+)["']?\s*:\s*["']([^"']+)["']/);

  if (!jsonMatch) {
    console.warn("Regex failed to match JSON pattern in selection");
    await showToast({
      style: Toast.Style.Failure,
      title: "Invalid selection",
      message: "Selection must be like '\"key\": \"value\"'",
    });
    return;
  }

  const [, key, value] = jsonMatch;
  console.log(`Parsed - Key: ${key}, Value: ${value}`);

  await showToast({
    style: Toast.Style.Animated,
    title: `Translating "${key}"...`,
  });

  try {
    const files = fs.readdirSync(localesPath).filter((f) => f.endsWith(".json"));
    console.log("Found locale files:", files);
    const results: string[] = [];

    for (const file of files) {
      const targetLang = path.basename(file, ".json");
      
      // Skip source language file as it's already updated by the user (or we don't want to overwrite it)
      if (targetLang === sourceLang) continue;

      const filePath = path.join(localesPath, file);
      let content: any = {};
      
      try {
        const fileData = fs.readFileSync(filePath, "utf-8");
        content = JSON.parse(fileData);
      } catch (e) {
        console.warn(`Could not parse ${file}, starting empty.`, e);
        // If file is empty or invalid, start with empty object
        content = {};
      }

      console.log(`Translating to ${targetLang}...`);
      // Translate the value
      const res = await translate(value, { to: targetLang, forceTo: true });
      content[key] = res.text;

      // Format with JSON.stringify
      const formatted = JSON.stringify(content, null, 2);

      fs.writeFileSync(filePath, formatted);
      results.push(targetLang);
    }

    await showHUD(`✅ Translated "${key}" to ${results.join(", ")}`);
  } catch (error) {
    console.error("Critical error in translation loop:", error);
    await showToast({
      style: Toast.Style.Failure,
      title: "Translation failed",
      message: String(error),
    });
  }
}
