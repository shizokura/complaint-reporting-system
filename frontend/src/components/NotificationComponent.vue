<template>
    <div class="notification q-pa-md">
        <div class="notification__header">Notifications</div>
        <div class="items">
            <div v-for="(notification, index) in notifications" :key="index" class="item">
                <div class="item__label">{{ notification.title }}</div>
                <div class="item__message">{{ notification.message }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { collection, getDocs, limit, orderBy, where, query } from "firebase/firestore";

export default
{
    name: 'NotificationComponent',
    data: () => 
    ({
        notifications: []
    }),
    async mounted()
    {
        let user_data = JSON.parse(localStorage.getItem("user_data"));
        this.notifications = await getDocs(query(collection(this.$db, "notifications"), where("user_id", "==", user_data.id), limit(10), orderBy("date", "desc"))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
        console.log(this.notifications);
    }
}
</script>
