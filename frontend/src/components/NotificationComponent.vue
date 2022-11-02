<template>
    <div class="notification q-pa-md">
        <div class="notification__header">Notifications</div>
        <div v-if="!is_loading" class="items">
            <template v-if="notifications.length">
                <div style="cursor: pointer;" @click="action(notification)" v-for="(notification, index) in notifications" :key="index" class="item">
                    <div class="item__label">{{ notification.title }}</div>
                    <div class="item__message">{{ notification.message }}</div>
                </div>

                <div style="text-align: center;">
                    <a @click="clear()" href="javascript:">Clear all notification</a>
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
    },
    methods:
    {
        async clear()
        {
            let user_data = JSON.parse(localStorage.getItem("user_data"));

            this.$q.loading.show({
                message: 'Clearing all notifications...'
            });

            await this.$_clearAllNotifications({ user_id: user_data.id });

            this.notifications = [];

            this.$q.loading.hide();
        },
        action(data)
        {
            let user_data = JSON.parse(localStorage.getItem("user_data"));

            if (data.title === 'New Application')
            {
                if (user_data.role === 'Admin') this.$router.push({ name: 'admin_approval' });
            }
            else if (data.title === 'New Complaint')
            {
                if (user_data.role === 'Admin') this.$router.push({ name: 'admin_complaint_pending' });
            }
            else if (data.title === 'New Message')
            {
                if (user_data.role === 'Admin') this.$router.push({ name: 'admin_message' });
                else this.$router.push({ name: 'member_message' });
            }
            else if (data.title === 'Complaint Status Changed')
            {
                if (user_data.role === 'Member') this.$router.push({ name: 'member_complaint_all' });
            }
        }
    }
}
</script>
