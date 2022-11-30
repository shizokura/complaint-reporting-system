import { collection, addDoc, doc, setDoc, increment, getDocs, query, where, deleteDoc, getDoc } from "firebase/firestore";
import CONFIG from 'app/config';

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

            let data = await getDoc(doc(this.$db, "users", user_id)).then(data => Object.assign({}, data.data(), { id: data.id }));

            await this.$axios.post(`${ CONFIG.API_URL }/notify`, { email: data.email, title, message });
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