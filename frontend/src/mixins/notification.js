import { collection, addDoc, doc, setDoc, increment, getDocs, query, where, deleteDoc } from "firebase/firestore";

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
        },
        async $_clearAllNotifications({ user_id })
        {
            let notifications = await getDocs(query(collection(this.$db, 'notifications'), where('user_id', '==', user_id))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));

            await Promise.all(notifications.map(async notification =>
            {
                await deleteDoc(doc(this.$db, "notifications", notification.id));
            }));

            console.log(notifications);
        }
    }
}