import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import {
  Advertisement,
  NotificationItem,
  ReferralRecord,
  Submission,
  Task,
  Transaction,
  UserProfile,
  UserRole,
  Withdrawal,
} from "./types";

// Your web app's Firebase configuration loaded from .env
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App (singleton pattern for Next.js SSR / HMR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication, Google Provider & Firestore Database
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Initialize Firebase Analytics safely on browser client only
let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore analytics errors in unsupported environments
    });
}

/**
 * Helper to build a UserProfile object and save/merge it into Firestore `users` table
 */
export async function saveUserToFirestore(
  fbUser: FirebaseUser,
  extra?: {
    fullName?: string;
    phone?: string;
    role?: UserRole;
    referralCodeUsed?: string;
    authProvider?: "email" | "google";
  }
): Promise<UserProfile> {
  const userRef = doc(db, "users", fbUser.uid);
  let existingData: Partial<UserProfile> = {};

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      existingData = snap.data() as Partial<UserProfile>;
    }
  } catch {
    // Proceed even if offline
  }

  const displayName =
    extra?.fullName?.trim() ||
    fbUser.displayName ||
    existingData.name ||
    (fbUser.email ? fbUser.email.split("@")[0] : "WingPoll User");

  const initials = displayName
    .trim()
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const refCode =
    existingData.referralCode ||
    `${
      displayName
        .replace(/[^a-zA-Z]/g, "")
        .toUpperCase()
        .slice(0, 5) || "WING"
    }${fbUser.uid.slice(0, 3).toUpperCase()}`;

  const phoneVal =
    extra?.phone || fbUser.phoneNumber || existingData.phone || "";

  const role: UserRole = extra?.role || existingData.role || "user";

  const userProfile: UserProfile = {
    id: fbUser.uid,
    name: displayName,
    email: fbUser.email || existingData.email || "",
    phone: phoneVal,
    mpesaNumber: existingData.mpesaNumber || phoneVal,
    role,
    avatarInitials: initials || "WP",
    photoURL: fbUser.photoURL || existingData.photoURL || undefined,
    authProvider:
      extra?.authProvider ||
      existingData.authProvider ||
      (fbUser.providerData.some((p) => p.providerId === "google.com")
        ? "google"
        : "email"),
    availableBalance: existingData.availableBalance ?? 0,
    totalEarnings: existingData.totalEarnings ?? 0,
    pendingEarnings: existingData.pendingEarnings ?? 0,
    completedTasks: existingData.completedTasks ?? 0,
    totalReferrals: existingData.totalReferrals ?? 0,
    referralEarnings: existingData.referralEarnings ?? 0,
    taskEarnings: existingData.taskEarnings ?? 0,
    referralCode: refCode,
    referralLink: `https://wingpoll.co.ke/register?ref=${refCode}`,
    joinedDate:
      existingData.joinedDate || new Date().toISOString().slice(0, 10),
    status: existingData.status || "Active",
  };

  try {
    const cleanDoc = JSON.parse(JSON.stringify(userProfile));
    await setDoc(userRef, cleanDoc, { merge: true });
  } catch (err) {
    console.warn("Firestore saveUserToFirestore warning:", err);
  }

  return userProfile;
}

/**
 * Fetch all users from Firestore `users` table
 */
export async function fetchAllUsersFromFirestore(): Promise<UserProfile[]> {
  try {
    const snap = await getDocs(collection(db, "users"));
    const list: UserProfile[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as UserProfile);
    });
    return list;
  } catch {
    return [];
  }
}

/**
 * Create a new Admin account in Firebase Auth (using a secondary app instance
 * so the current admin session is not interrupted) AND save to Firestore `users` table with role="admin"
 */
export async function createAdminAccountInFirebase(params: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<UserProfile> {
  const secondaryAppName = "WingPollSecondaryAdminApp";
  const existingSecondary = getApps().find(
    (a) => a.name === secondaryAppName
  );
  const secondaryApp =
    existingSecondary || initializeApp(firebaseConfig, secondaryAppName);
  const secondaryAuth = getAuth(secondaryApp);

  const credential = await createUserWithEmailAndPassword(
    secondaryAuth,
    params.email,
    params.password
  );

  if (params.fullName.trim()) {
    await updateProfile(credential.user, {
      displayName: params.fullName.trim(),
    });
  }

  // Save to primary Firestore `users` collection with role: "admin"
  const adminProfile = await saveUserToFirestore(credential.user, {
    fullName: params.fullName,
    phone: params.phone,
    role: "admin",
    authProvider: "email",
  });

  // Sign out secondary auth instance cleanly
  await signOut(secondaryAuth);

  return adminProfile;
}

/**
 * Update a user's fields in Firestore `users` collection
 */
export async function updateUserInFirestore(
  userId: string,
  updates: Partial<UserProfile>
) {
  if (!userId) return;
  try {
    const userRef = doc(db, "users", userId);
    const cleanUpdates = JSON.parse(JSON.stringify(updates));
    await setDoc(userRef, cleanUpdates, { merge: true });
  } catch {
    // Ignore
  }
}

/**
 * Reliably grant task reward to an earner's account in Firestore by reading
 * their latest user document and crediting availableBalance, totalEarnings,
 * taskEarnings, completedTasks, and decrementing pendingEarnings.
 */
export async function grantTaskRewardToUserInFirestore(
  userId: string,
  reward: number,
  wasPending = true
): Promise<Partial<UserProfile> | null> {
  if (!userId) return null;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    const data = snap.exists() ? (snap.data() as Partial<UserProfile>) : {};

    const updatedFields: Partial<UserProfile> = {
      availableBalance: Number(data.availableBalance ?? 0) + reward,
      totalEarnings: Number(data.totalEarnings ?? 0) + reward,
      taskEarnings: Number(data.taskEarnings ?? 0) + reward,
      pendingEarnings: wasPending
        ? Math.max(0, Number(data.pendingEarnings ?? 0) - reward)
        : Number(data.pendingEarnings ?? 0),
      completedTasks: Number(data.completedTasks ?? 0) + 1,
    };

    await setDoc(userRef, updatedFields, { merge: true });
    return updatedFields;
  } catch (err) {
    console.warn("Firestore grantTaskRewardToUserInFirestore warning:", err);
    return null;
  }
}

export async function adjustUserPendingEarningsInFirestore(
  userId: string,
  delta: number
): Promise<number | null> {
  if (!userId) return null;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    const data = snap.exists() ? (snap.data() as Partial<UserProfile>) : {};
    const nextPending = Math.max(0, Number(data.pendingEarnings ?? 0) + delta);
    await setDoc(userRef, { pendingEarnings: nextPending }, { merge: true });
    return nextPending;
  } catch {
    return null;
  }
}

/**
 * Tasks collection helpers
 */
export async function saveTaskToFirestore(task: Task) {
  try {
    const taskRef = doc(db, "tasks", task.id);
    const cleanTask = JSON.parse(JSON.stringify(task));
    await setDoc(taskRef, cleanTask, { merge: true });
  } catch (err) {
    console.warn("Firestore saveTaskToFirestore warning:", err);
  }
}

export async function fetchAllTasksFromFirestore(): Promise<Task[]> {
  try {
    const snap = await getDocs(collection(db, "tasks"));
    const list: Task[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as Task);
    });
    return list;
  } catch {
    return [];
  }
}

export async function deleteTaskFromFirestore(taskId: string) {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
  } catch {
    // Ignore
  }
}

/**
 * Submissions collection helpers
 */
export async function saveSubmissionToFirestore(sub: Submission) {
  try {
    const cleanSub = JSON.parse(JSON.stringify(sub));
    await setDoc(doc(db, "submissions", sub.id), cleanSub, { merge: true });
  } catch (err) {
    console.warn("Firestore saveSubmissionToFirestore warning:", err);
  }
}

export async function deleteSubmissionFromFirestore(submissionId: string) {
  try {
    await deleteDoc(doc(db, "submissions", submissionId));
  } catch {
    // Ignore
  }
}

export async function fetchAllSubmissionsFromFirestore(): Promise<
  Submission[]
> {
  try {
    const snap = await getDocs(collection(db, "submissions"));
    const list: Submission[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as Submission);
    });
    return list;
  } catch {
    return [];
  }
}

/**
 * Withdrawals collection helpers
 */
export async function saveWithdrawalToFirestore(wth: Withdrawal) {
  try {
    const cleanWth = JSON.parse(JSON.stringify(wth));
    await setDoc(doc(db, "withdrawals", wth.id), cleanWth, { merge: true });
  } catch (err) {
    console.warn("Firestore saveWithdrawalToFirestore warning:", err);
  }
}

export async function fetchAllWithdrawalsFromFirestore(): Promise<
  Withdrawal[]
> {
  try {
    const snap = await getDocs(collection(db, "withdrawals"));
    const list: Withdrawal[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as Withdrawal);
    });
    return list;
  } catch {
    return [];
  }
}

/**
 * Transactions collection helpers
 */
export async function saveTransactionToFirestore(txn: Transaction) {
  try {
    const cleanTxn = JSON.parse(JSON.stringify(txn));
    await setDoc(doc(db, "transactions", txn.id), cleanTxn, { merge: true });
  } catch (err) {
    console.warn("Firestore saveTransactionToFirestore warning:", err);
  }
}

export async function fetchAllTransactionsFromFirestore(): Promise<
  Transaction[]
> {
  try {
    const snap = await getDocs(collection(db, "transactions"));
    const list: Transaction[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as Transaction);
    });
    return list;
  } catch {
    return [];
  }
}

/**
 * Referrals collection helpers
 */
export async function saveReferralToFirestore(ref: ReferralRecord) {
  try {
    const cleanRef = JSON.parse(JSON.stringify(ref));
    await setDoc(doc(db, "referrals", ref.id), cleanRef, { merge: true });
  } catch (err) {
    console.warn("Firestore saveReferralToFirestore warning:", err);
  }
}

export async function fetchAllReferralsFromFirestore(): Promise<
  ReferralRecord[]
> {
  try {
    const snap = await getDocs(collection(db, "referrals"));
    const list: ReferralRecord[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as ReferralRecord);
    });
    return list;
  } catch {
    return [];
  }
}

/**
 * Advertisements collection helpers
 */
export async function saveAdToFirestore(ad: Advertisement) {
  try {
    const cleanAd = JSON.parse(JSON.stringify(ad));
    await setDoc(doc(db, "ads", ad.id), cleanAd, { merge: true });
  } catch (err) {
    console.warn("Firestore saveAdToFirestore warning:", err);
  }
}

export async function fetchAllAdsFromFirestore(): Promise<Advertisement[]> {
  try {
    const snap = await getDocs(collection(db, "ads"));
    const list: Advertisement[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as Advertisement);
    });
    return list;
  } catch {
    return [];
  }
}

export async function deleteAdFromFirestore(adId: string) {
  try {
    await deleteDoc(doc(db, "ads", adId));
  } catch {
    // Ignore
  }
}

/**
 * Notifications collection helpers
 */
export async function saveNotificationToFirestore(notif: NotificationItem) {
  try {
    const cleanNotif = JSON.parse(JSON.stringify(notif));
    await setDoc(doc(db, "notifications", notif.id), cleanNotif, {
      merge: true,
    });
  } catch {
    // Ignore
  }
}

export async function fetchAllNotificationsFromFirestore(): Promise<
  NotificationItem[]
> {
  try {
    const snap = await getDocs(collection(db, "notifications"));
    const list: NotificationItem[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as NotificationItem);
    });
    return list;
  } catch {
    return [];
  }
}

/**
 * Sign in with Email & Password
 */
export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await saveUserToFirestore(credential.user);
  return credential.user;
}

/**
 * Register a new normal user account with Email & Password, set Display Name,
 * save user to Firestore `users` table with role="user",
 * and automatically send a Firebase Email Verification link
 */
export async function registerWithEmail(
  fullName: string,
  email: string,
  password: string,
  phone?: string,
  referralCodeUsed?: string
) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  if (fullName.trim()) {
    await updateProfile(credential.user, {
      displayName: fullName.trim(),
    });
  }

  // Save normal user to Firestore `users` collection with role="user"
  await saveUserToFirestore(credential.user, {
    fullName,
    phone,
    role: "user",
    referralCodeUsed,
    authProvider: "email",
  });

  // If a referral code was provided, link it to the referrer in Firestore
  if (referralCodeUsed?.trim()) {
    try {
      const code = referralCodeUsed.trim().toUpperCase();
      const allUsers = await fetchAllUsersFromFirestore();
      const referrer = allUsers.find(
        (u) => u.referralCode?.toUpperCase() === code
      );
      if (referrer) {
        const refRecord: ReferralRecord = {
          id: `ref-${Date.now().toString().slice(-5)}`,
          referrerId: referrer.id,
          referrerName: referrer.name,
          referrerCode: referrer.referralCode,
          referredName: fullName.trim(),
          referredPhone: phone || "",
          registrationDate: new Date().toISOString().slice(0, 10),
          tasksCompleted: 0,
          status: "Pending First Task",
          rewardEarned: 0,
        };
        await saveReferralToFirestore(refRecord);
        await updateUserInFirestore(referrer.id, {
          totalReferrals: (referrer.totalReferrals || 0) + 1,
        });
      }
    } catch {
      // Ignore referral lookup error
    }
  }

  await sendEmailVerification(credential.user);
  return credential.user;
}

/**
 * Send or Resend Email Verification Link to the current Firebase user
 */
export async function sendVerificationEmail(targetUser?: FirebaseUser | null) {
  const userToVerify = targetUser ?? auth.currentUser;
  if (!userToVerify) {
    throw new Error("No signed-in user found to verify.");
  }
  await sendEmailVerification(userToVerify);
}

/**
 * Reload current Firebase user from server and return updated emailVerified status
 */
export async function reloadFirebaseUser(): Promise<boolean> {
  if (!auth.currentUser) return false;
  await reload(auth.currentUser);
  return auth.currentUser.emailVerified;
}

/**
 * Sign in or Register with Google (Gmail) Popup and save user to Firestore `users` table
 */
export async function signInWithGooglePopup() {
  const credential = await signInWithPopup(auth, googleProvider);
  await saveUserToFirestore(credential.user, {
    authProvider: "google",
  });
  return credential.user;
}

/**
 * Send Password Reset Email via Firebase Auth
 */
export async function sendFirebasePasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Sign out current Firebase user
 */
export async function logoutFirebase() {
  await signOut(auth);
}

/**
 * Convert Firebase Auth error codes into friendly messages
 */
export function getFirebaseAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing authentication.";
    case "auth/cancelled-popup-request":
      return "Another sign-in popup is already open.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/too-many-requests":
      return "Too many requests. Please wait a minute before trying again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    default:
      return error instanceof Error
        ? error.message
        : "Authentication failed. Please try again.";
  }
}

export {
  app,
  auth,
  db,
  googleProvider,
  analytics,
  onAuthStateChanged,
  updateDoc,
};
export type { FirebaseUser };
