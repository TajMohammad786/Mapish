import Settings from "../models/settings.model.js";
import { processVideos } from "./video.controller.js";

export async function getRefreshStatus(req, res) {
  const setting = await Settings.findOne({ key: "lastVideoRefresh" });
  res.json({ lastUpdated: setting?.value || null });
}

export async function refreshVideos(req, res) {
  const setting = await Settings.findOne({ key: "lastVideoRefresh" });
  const now = Date.now();
  if (setting && now - setting.value < 24 * 60 * 60 * 1000) {
    return res.status(429).json({ message: "You can only refresh once every 24 hours.", lastUpdated: setting.value });
  }
  await processVideos({ query: { fetch24HrVideos: true } }, { status: () => ({ json: () => {} }) });
  await Settings.findOneAndUpdate(
    { key: "lastVideoRefresh" },
    { value: now },
    { upsert: true }
  );
  res.json({ message: "Videos refreshed!", lastUpdated: now });
}