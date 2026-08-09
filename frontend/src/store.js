import { collection, addDoc, doc, setDoc, getDoc, query, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export async function logAIReceipt(studentId, receipt) {
  return addDoc(collection(db, "receipts"), { studentId, ...receipt, timestamp: Date.now() });
}

export function listenReceipts(studentId, callback) {
  return onSnapshot(collection(db, "receipts"), (snap) => {
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(all.filter((r) => r.studentId === studentId).sort((a, b) => b.timestamp - a.timestamp));
  });
}

export async function saveSessionScore(studentId, subject, score, rollingScore, breakdown = {}) {
  await addDoc(collection(db, "sessions"), { studentId, subject, score, rollingScore, ...breakdown, timestamp: Date.now() });
  await setDoc(doc(db, "engagement", `${studentId}_${subject}`), { studentId, subject, rollingScore, updatedAt: Date.now() }, { merge: true });
}

export function listenAllSessions(studentId, callback) {
  return onSnapshot(collection(db, "sessions"), (snap) => {
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(all.filter((s) => s.studentId === studentId).sort((a, b) => a.timestamp - b.timestamp));
  });
}

export function listenSessions(studentId, subject, callback) {
  return onSnapshot(collection(db, "sessions"), (snap) => {
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(all.filter((s) => s.studentId === studentId && s.subject === subject).sort((a, b) => a.timestamp - b.timestamp));
  });
}

export function listenAllEngagement(callback) {
  return onSnapshot(collection(db, "engagement"), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function getRollingScore(studentId, subject) {
  const snap = await getDoc(doc(db, "engagement", `${studentId}_${subject}`));
  return snap.exists() ? snap.data().rollingScore : null;
}