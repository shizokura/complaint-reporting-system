<template>
    <div class="login-container">
        <LogoComponent />
        <div class="login">
            <div class="login__title">Log-in your Account</div>
            <q-form
                @submit="onSubmit"
                class="q-gutter-md"
            >
                <q-input
                    filled
                    v-model="email"
                    label="Email Address"
                    type="email"
                />

                <q-input
                    filled
                    v-model="password"
                    label="Password"
                    type="password"
                />

                <div class="login__button">
                    <q-btn no-caps unelevated :disabled="is_loading" :label="is_loading ? 'LOADING...' : 'Log-in'" type="submit" color="primary"/>
                </div>
                <div class="login__register">
                    <p class="message">Not registered? <a @click="$router.push('/register')" href="javascript:">Create an account</a></p>
                </div>
            </q-form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login-container
{
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 15px;
    background: #fff;
    display: grid;
    grid-template-columns: 500px auto;
    column-gap: 100px;
}

.login
{
    width: 500px;
    margin: auto;
    padding: 25px;
    &__title
    {
        display: block;
        font-size: 2rem;
        color: #333333;
        line-height: 1.2;
        text-align: center;
        font-weight: 700;
        margin-bottom: 50px;
        text-align: left;
    }
    &__button
    {
        .q-btn
        {
            width: 100%;
            height: 50px;
        }
    }
    &__register
    {
        text-align: center;
        p
        {
            margin: 15px 0 0;
            color: #b3b3b3;
            font-size: 12px;
            a
            {
                color: #1976D2;
                text-decoration: none;
            }
        }
    }
}
</style>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import LogoComponent from "src/components/LogoComponent.vue";

export default
{
    name: 'LoginPage',
    components: { LogoComponent },
    data: () => 
    ({
        email: null,
        password: null,
        is_loading: false
    }),
    methods:
    {
        async onSubmit()
        {
            if (this.is_loading) return;

            this.is_loading = true;

            // let res = await this.$api.post('login', { email: this.email, password: this.password });

            // if (res.data)
            // {
            //     localStorage.setItem('user_data', JSON.stringify(res.data));
                
            //     if (res.data.role === 'Member')
            //     {
            //         if (res.data.is_verified)
            //         {
            //             this.$router.push({ name: 'member_dashboard' });
            //         }
            //         else
            //         {
            //             this.$q.notify(
            //             {
            //                 color: 'red',
            //                 message: 'Your account has not been verified.'
            //             });
            //         }
            //     }
            //     else if (res.data.role === 'Admin')
            //     {
            //         this.$router.push({ name: 'admin_dashboard' });
            //     }
            // }
            // else
            // {
            //     this.$q.notify(
            //     {
            //         color: 'red',
            //         message: 'Invalid credentials'
            //     });
            // }
            
            await signInWithEmailAndPassword(this.$auth, this.email, this.password)
            .catch((error) => 
            {
                const errorCode = error.code;

                let message = null;
                
                if (errorCode === 'auth/user-not-found')
                {
                    message = 'User not found';
                }

                if (message)
                {
                    this.$q.notify(
                    {
                        color: 'red',
                        message: message
                    });
                }

                this.is_loading = false;
            });
        }
    },
    created()
    {
        if (localStorage.getItem('user_data'))
        {
            let user_data = JSON.parse(localStorage.getItem('user_data'));

            if (user_data.role === 'Admin')
            {
                this.$router.push({ name: 'admin_dashboard' });
            }
            else if (user_data.role === 'Member')
            {
                this.$router.push({ name: 'member_dashboard' });
            }
        }
    }
}
</script>
