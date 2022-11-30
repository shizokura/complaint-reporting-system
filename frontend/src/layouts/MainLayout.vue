<template>
    <q-layout class="main-layout" view="lHh Lpr lFf">
        <q-header v-if="user_data" unelevated>
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="leftDrawerOpen = !leftDrawerOpen"
                />
                <q-toolbar-title style="text-align: right; font-size: 14px;">
                    <q-btn @click="user_data.notification_count = 0;" icon="mdi-bell" unelevated style="margin-right: 15px;">
                        <q-menu>
                            <NotificationComponent />
                        </q-menu>
                        <q-badge v-if="user_data.notification_count" style="margin-top: 5px;" color="red" floating>{{ user_data.notification_count }}</q-badge>
                    </q-btn>
                    {{ user_data.first_name }} {{ user_data.last_name }}
                    <q-btn icon="mdi-account" unelevated style="margin-left: 15px;">
                        <q-menu>
                            <div style="padding: 15px; width: 200px;">
                                <div style="padding 25px; background-color: #fff;">
                                    <div style="text-align: center;">
                                        <img style="width: 100px; height: 100px; object-fit: cover; border-radius: 100%;" :src="user_data.photo || 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'" alt="">
                                    </div>
                                    <div style="display: flex; flex-direction: column; text-align: center; margin-top: 15px; row-gap: 5px;">
                                        <a style="text-decoration: none; color: #000; cursor: pointer; font-weight: 400;" @click="$router.push({ name: 'member_user_maintenance', params: { view: true } })" href="javascript:">User Profile</a>
                                        <a style="text-decoration: none; color: #000; cursor: pointer; font-weight: 400;" @click="$router.push({ name: 'member_change_password' })" href="javascript:">Change Password</a>
                                    </div>
                                </div>
                            </div>
                        </q-menu>
                    </q-btn>
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            bordered
        >
            <q-item-label header style="text-align: center; font-size: 2rem; font-weight: 700;">
                eCRS
            </q-item-label>

            <q-separator />

            <q-list style="padding: 15px;">
                <q-item @click="$router.push({ name: 'member_dashboard' })" clickable>
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Dashboard</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item @click="$router.push({ name: 'member_create_complaint' })" clickable>
                    <q-item-section avatar>
                        <q-icon name="mdi-pencil" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Create Complaint</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item @click="$router.push({ name: 'member_complaint_history' })" clickable>
                    <q-item-section avatar>
                        <q-icon name="mdi-history" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Recent Complaints</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item @click="$router.push({ name: 'member_message' })" clickable>
                    <q-item-section avatar>
                        <q-icon name="mdi-message" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Message</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item @click="$router.push({ name: 'member_user_maintenance' })" clickable>
                    <q-item-section avatar>
                        <q-icon name="mdi-cog" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>User Maintenance</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item @click="logout()" clickable>
                    <q-item-section avatar>

                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Logout</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import './MainLayout.scss';
import { signOut, deleteUser } from "firebase/auth";
import { getDoc, doc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import NotificationComponent from '../components/NotificationComponent.vue';

export default
{
    name: 'MainLayout',
    data: () => 
    ({
        leftDrawerOpen: true,
        user_data: null,
        unsub: null
    }),
    components: { NotificationComponent },
    async created()
    {
        if (!localStorage.getItem('user_data'))
        {
            return await this.$router.push({ name: 'login' });
        }

        let user_data = JSON.parse(localStorage.getItem('user_data'));

        if (user_data.role === 'Admin')
        {
            return await this.$router.push({ name: 'admin_dashboard' });
        }

        if (!user_data.is_email_verified)
        {
            return await this.$router.push({ name: 'verification' });
        }

        if (user_data.is_rejected)
        {
            alert('Your account is rejected. Create new account to submit new application.');
            this.$q.loading.show({ message: 'Deleting user...' });
            await deleteDoc(doc(this.$db, "users", user_data.id));
            await deleteUser(this.$auth.currentUser);
            return this.logout();
        }

        if (!user_data.is_verified)
        {
            alert('Your account is unverified. Wait until your application is reviewed.');
            return this.logout();
        }
        
        this.unsub = onSnapshot(
            doc(this.$db, "users", user_data.id),
            (doc) => {
                this.user_data = Object.assign({}, doc.data(), { id: doc.id });
                console.log(this.user_data);
            },
            (error) => {
                // handle error
            }
        );

        // this.user_data = await getDoc(doc(this.$db, "users", user_data.id)).then(doc => Object.assign({}, doc.data(), { id: doc.id }));
    },
    methods:
    {
        logout()
        {
            this.$q.loading.show({
                message: "Logging out..."
            });

            setTimeout(async () =>
            {
                await signOut(this.$auth);
                localStorage.removeItem('user_data');
                this.$router.push({ name: 'login' });

                this.$q.loading.hide();
            }, 1000);
        }
    },
    beforeUnmount()
    {
        console.log("Unsub...");
        if (this.unsub) this.unsub();
    }
}
</script>
