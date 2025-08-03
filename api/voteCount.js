// api/voteCount.js
import { db } from "./firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    // Fetch every vote doc
    const snapshot = await db.collection("votes").get();
    let counts = { saja: 0, huntrix: 0 };
    snapshot.forEach(doc => {
      const { choice } = doc.data();
      if (choice === "saja")    counts.saja++;
      else if (choice === "huntrix") counts.huntrix++;
    });
    return res.status(200).json(counts);
  } catch (err) {
    console.error("Error in /api/voteCount:", err);
    return res.status(500).json({ error: err.message });
  }
}
