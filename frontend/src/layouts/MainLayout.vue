<template>
    <q-layout class="main-layout" view="lHh Lpr lFf">
        <q-header unelevated>
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
                    <q-btn icon="mdi-bell" unelevated style="margin-right: 15px;" />
                    {{ user_data.first_name }} {{ user_data.last_name }}
                    <q-btn icon="mdi-account" unelevated style="margin-left: 15px;" />
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            bordered
        >
            <q-item-label header style="text-align: center; font-size: 2rem; font-weight: 700;">
                e-CRS
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
                        <q-item-label>Complaint History</q-item-label>
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
import { signOut } from "firebase/auth";

export default
{
    name: 'MainLayout',
    data: () => 
    ({
        leftDrawerOpen: true,
        user_data: null
    }),
    created()
    {
        if (!localStorage.getItem('user_data'))
        {
            return this.$router.push({ name: 'login' });
        }

        let user_data = JSON.parse(localStorage.getItem('user_data'));

        if (user_data.role === 'Admin')
        {
            this.$router.push({ name: 'admin_dashboard' });
        }

        this.user_data = user_data;
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
    }
}
</script>
