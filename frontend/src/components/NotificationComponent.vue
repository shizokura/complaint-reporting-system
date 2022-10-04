<template>
    <div class="notification q-pa-md">
        <div class="notification__header">Notifications</div>
        <div v-if="!is_loading" class="items">
            <template v-if="notifications.length">
                <div v-for="(notification, index) in notifications" :key="index" class="item">
                    <div class="item__label">{{ notification.title }}</div>
                    <div class="item__message">{{ notification.message }}</div>
                </div>
            </template>
            <div style="text-align: center;" v-else>
                No notification yet
            </div>
        </div>
        <div style="text-align: center;" v-else>
            <q-spinner
                style="padding-top: 15px;"
                color="primary"
                size="3em"
            />
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
        notifications: [],
        is_loading: true
    }),
    async mounted()
    {
        let user_data = JSON.parse(localStorage.getItem("user_data"));
        await this.$_clearNotification({ user_id: user_data.id });
        this.notifications = await getDocs(query(collection(this.$db, "notifications"), where("user_id", "==", user_data.id), limit(10), orderBy("date", "desc"))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
        this.is_loading = false;
    }
}
</script>
