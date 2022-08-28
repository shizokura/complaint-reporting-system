<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <router-view v-if="!is_loading" />
    <q-inner-loading
        v-else
        :showing="true"
        label="Please wait..."
        label-style="font-size: 1.1em"
    />
  </transition>
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
            if (user) 
            {
                const uid = user.uid;
                let user_data = await getDoc(doc(this.$db, "users", uid));

                if (user_data.exists())
                {
                    user_data = user_data.data();
                    localStorage.setItem('user_data', JSON.stringify(user_data));

                    if (user_data.role === 'Member')
                    {
                        this.$router.push({ name: 'member_dashboard' });
                    }
                    else if (user_data.role === 'Admin')
                    {
                        this.$router.push({ name: 'admin_dashboard' });
                    }
                }
            }

            this.is_loading = false;
        });
    }
}
</script>
