<template>
    <router-view v-if="!is_loading" v-slot="{ Component }">
        <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
        >
            <component :is="Component" />
        </transition>
    </router-view>
    <q-inner-loading
        v-else
        :showing="true"
        label="Please wait..."
        label-style="font-size: 1.1em"
    />
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";

export default
{
    name: 'App',
    data: () => 
    ({
        is_loading: true
    }),
    mounted()
    {
        onAuthStateChanged(this.$auth, async (user) => 
        {
            await this.login(user);
            this.is_loading = false;
        });
    },
    methods:
    {
        async login(user)
        {
            if (user) 
            {
                const uid = user.uid;
                localStorage.setItem("user_id", uid);
                let user_data = await getDoc(doc(this.$db, "users", uid));

                if (user_data.exists())
                {
                    user_data = Object.assign({}, user_data.data(), { id: user_data.id });
                    localStorage.setItem('user_data', JSON.stringify(user_data));

                    if (user_data.role === 'Member')
                    {
                        await this.$router.push({ name: 'member_dashboard' });
                    }
                    else if (user_data.role === 'Admin')
                    {
                        await this.$router.push({ name: 'admin_dashboard' });
                    }
                }
                else
                {
                    console.log("Retrying...");
                    setTimeout(() => this.login(user), 1000);
                }
            }
        }
    }
}
</script>
