import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { environment } from '../environments/environment';

export const app = initializeApp(environment.firebase);
export const db = getFirestore(app);

// https://www.concretepage.com/angular/angular-keyvaluediffers
// import { Firestore, collection } from '@angular/fire/firestore';
// import { getDocs } from "firebase/firestore";
// import { db } from '../firebase';

// constructor(
//  public firestore: Firestore,
// ) { }
// const querySnapshot = await getDocs(collection(db, "bank-accounts"));
// querySnapshot.forEach((doc) => {
//   // doc.data() is never undefined for query doc snapshots
//   console.log(doc.id, " => ", doc.data());
// });