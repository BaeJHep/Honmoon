// api/vote.js
import { db, auth, FieldValue } from "./firebaseAdmin.js";

export default async function handler(req, res) {
  try {
    // 1) Authenticate
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).json({ error: "No token provided" });
    }

    let uid;
    try {
      const decoded = await auth.verifyIdToken(idToken);
      uid = decoded.uid;
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }

    const voteRef = db.collection("votes").doc(uid);

    // 2) Route by method
    if (req.method === "GET") {
      const snap = await voteRef.get();
      return res.status(200).json({ vote: snap.exists ? snap.data().choice : null });
    }

    if (req.method === "POST") {
      const { choice } = req.body ?? {};
      if (!choice) {
        return res.status(400).json({ error: "Missing choice" });
      }
      await voteRef.set({
        choice,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      await voteRef.delete();
      return res.status(200).json({ success: true });
    }

    // 405 for anything else
    res.setHeader("Allow", ["GET","POST","DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (err) {
    console.error("Error in /api/vote:", err);
    return res.status(500).json({ error: err.message });
  }
}
