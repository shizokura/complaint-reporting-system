<template>
    <div class="login-container">
        <div class="login">
            <div class="login__title">LOGIN</div>
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
                    <q-btn unelevated :disabled="is_loading" :label="is_loading ? 'LOADING...' : 'SUBMIT'" type="submit" color="primary"/>
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
}

.login
{
    width: 390px;
    margin: auto;
    &__title
    {
        display: block;
        font-size: 39px;
        color: #333333;
        line-height: 1.2;
        text-align: center;
        font-weight: 700;
        margin-bottom: 50px;
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
export default
{
    name: 'LoginPage',
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

            let res = await this.$api.post('login', { email: this.email, password: this.password });

            if (res.data)
            {
                localStorage.setItem('user_data', JSON.stringify(res.data));
                
                if (res.data.role === 'Member')
                {
                    if (res.data.is_verified)
                    {
                        this.$router.push({ name: 'member_dashboard' });
                    }
                    else
                    {
                        this.$q.notify(
                        {
                            color: 'red',
                            message: 'Your account has not been verified.'
                        });
                    }
                }
                else if (res.data.role === 'Admin')
                {
                    this.$router.push({ name: 'admin_dashboard' });
                }
            }
            else
            {
                this.$q.notify(
                {
                    color: 'red',
                    message: 'Invalid credentials'
                });
            }

            this.is_loading = false;
        }
    }
}
</script>
