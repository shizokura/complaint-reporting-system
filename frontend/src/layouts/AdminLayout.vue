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
                <q-item @click="$router.push({ name: 'admin_dashboard' })" clickable>
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Dashboard</q-item-label>
                    </q-item-section>
                </q-item>

                <q-expansion-item
                    icon="mdi-alert"
                    label="Complaints"
                >
                    <q-item @click="$router.push({ name: 'admin_complaint_pending' })" clickable style="padding-left: 75px;">
                        <q-item-section>
                            <q-item-label>Pending</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item @click="$router.push({ name: 'admin_complaint_process' })"  clickable style="padding-left: 75px;">
                        <q-item-section>
                            <q-item-label>In-Process</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item @click="$router.push({ name: 'admin_complaint_closed' })"  clickable style="padding-left: 75px;">
                        <q-item-section>
                            <q-item-label>Closed</q-item-label>
                        </q-item-section>
                    </q-item>

                </q-expansion-item>

                <q-item clickable>
                    <q-item-section avatar>
                        <q-icon name="mdi-account" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>User Data</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item clickable>
                    <q-item-section avatar>
                        <q-icon name="mdi-message" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Message</q-item-label>
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
import './AdminLayout.scss';
import { signOut } from "firebase/auth";

export default
{
    name: 'AdminLayout',
    data: () => 
    ({
        leftDrawerOpen: true
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
    },
    methods:
    {
        goTo(name)
        {
            this.$router.push({ name });
            this.leftDrawerOpen = false;
        },
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
