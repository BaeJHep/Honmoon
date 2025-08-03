// api/vote.js
import { db, auth } from './firebaseAdmin'

export default async function handler(req, res) {
  // 1) Verify user’s Firebase ID token
  const idToken = req.headers.authorization?.split('Bearer ')[1]
  if (!idToken) return res.status(401).json({ error: 'No token' })

  let uid
  try {
    const decoded = await auth.verifyIdToken(idToken)
    uid = decoded.uid
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const voteRef = db.collection('votes').doc(uid)

  switch (req.method) {
    case 'GET':
      // fetch this user’s vote
      const snap = await voteRef.get()
      return res.json({ vote: snap.exists ? snap.data().choice : null })

    case 'POST':
      // set/update vote: { choice: 'huntrix' } or { choice: 'sajaboys' }
      const { choice } = req.body
      if (!choice) return res.status(400).json({ error: 'Missing choice' })
      await voteRef.set({ choice, updatedAt: admin.firestore.FieldValue.serverTimestamp() })
      return res.status(200).json({ success: true })

    case 'DELETE':
      // delete (redact) this user’s vote
      await voteRef.delete()
      return res.status(200).json({ success: true })

    default:
      res.setHeader('Allow', ['GET','POST','DELETE'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
