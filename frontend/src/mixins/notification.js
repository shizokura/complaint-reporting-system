import { collection, addDoc, doc, setDoc, increment } from "firebase/firestore";

export default
{
    methods:
    {
        async $_createNotification({ title, message, user_id })
        {
            await addDoc(collection(this.$db, "notifications"), 
            {
                title,
                message,
                user_id,
                date: new Date()
            });

            await setDoc(doc(this.$db, "users", user_id),
            {
                notification_count: increment(1)
            }, 
            { merge: true });
        },
        async $_clearNotification({ user_id })
        {
            await setDoc(doc(this.$db, "users", user_id),
            {
                notification_count: 0
            }, 
            { merge: true });
        }
    }
}