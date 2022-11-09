<template>
    <div class="login-container">
        <div class="login-main">
            <div class="login">
                <div class="login__title">Login</div>
                <div class="login__subtitle">Doesn't have an account yet? <a @click="$router.push('/register')" href="javascript:">Sign Up</a></div>
                <q-form
                    @submit="onSubmit"
                >
                    <div class="form-group">
                        <label>Email Address</label>
                        <q-input
                            outlined
                            v-model="email"
                            placeholder="you@example.com"
                            type="email"
                        />
                    </div>

                    <div class="form-group" style="margin-top: 15px;">
                        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));">
                            <label>Password</label>
                            <div @click="$router.push({ name: 'forgot' })" style="text-align: right; font-size: 0.8rem; font-weight: 600;"><a href="javascript:">Forgot Password?</a></div>
                        </div>
                        <q-input
                            outlined
                            v-model="password"
                            placeholder="Enter 6 characters or more"
                            type="password"
                        />
                    </div>

                    <div class="login__button">
                        <q-btn no-caps unelevated :disabled="is_loading" :label="is_loading ? 'LOADING...' : 'LOGIN'" type="submit" color="primary"/>
                    </div>

                    <!-- <div class="login__register">
                        <p class="message">Not registered? <a @click="$router.push('/register')" href="javascript:">Create an account</a></p>
                    </div> -->
                </q-form>
            </div>
            <LogoComponent />
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
    background-image: url('/bg.svg');
    background-size: cover;
}

.login-main
{
    display: grid;
    grid-template-columns: 400px auto;
    column-gap: 0px;
    background-color: #fff;
    padding: 0px 50px;
    padding-right: 0;
    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.25);
}

.login
{
    width: 400px;
    margin: auto;
    padding: 25px;
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    .form-group
    {
        label
        {
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            font-size: 0.9rem;
            letter-spacing: 0.2px;
        }
        .q-input
        {
            margin-top: 5px;
        }
    }
    &__title
    {
        display: block;
        font-size: 2rem;
        color: #333333;
        line-height: 1.2;
        text-align: center;
        font-weight: 700;
        text-align: left;
        font-family: 'Montserrat', sans-serif;
    }
    &__subtitle
    {
        color: rgba(0,0,0,0.3);
        font-size: 1rem;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        margin-bottom: 25px;
        a
        {
            color: #5588ff;
        }
    }
    &__button
    {
        margin-top: 25px;
        .q-btn
        {
            width: 100%;
            height: 50px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
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
                color: #5588ff;
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
                else if (errorCode === 'auth/wrong-password')
                {
                    message = 'Invalid password';
                }

                if (message)
                {
                    this.$q.notify(
                    {
                        color: 'red',
                        message: message || error.message
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
