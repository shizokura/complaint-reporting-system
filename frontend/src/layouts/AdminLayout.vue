<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="leftDrawerOpen = !leftDrawerOpen"
                />
                <q-toolbar-title>
                    Complaint Reporting System
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            bordered
        >
            <q-list>
                <q-item-label header>
                    NAVIGATION
                </q-item-label>

                <q-item @click="goTo('admin_dashboard')" clickable>
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Dashboard</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item @click="goTo('admin_users')" clickable>
                    <q-item-section avatar>
                        <q-icon name="mdi-account" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Users</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item @click="logout()" clickable>
                    <q-item-section avatar>
                        <q-icon name="mdi-logout-variant" />
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

export default
{
    name: 'AdminLayout',
    data: () => 
    ({
        leftDrawerOpen: false
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
            localStorage.removeItem('user_data');
            this.$router.push({ name: 'login' });
        }
    }
}
</script>
