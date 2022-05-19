<template>
    <div class="login-container">
        <div class="login">
            <div class="login__title">REGISTER</div>
            <q-form
                @submit="onSubmit"
                class="q-gutter-md"
            >
                <q-input
                    filled
                    v-model="first_name"
                    label="First Name"
                />

                <q-input
                    filled
                    v-model="middle_name"
                    label="Middle Name (Optional)"
                />

                <q-input
                    filled
                    v-model="last_name"
                    label="Last Name"
                />

                <q-input
                    filled
                    type="email"
                    v-model="email"
                    label="Email Address"
                />

                <q-input
                    filled
                    v-model="password"
                    label="Password"
                    type="password"
                />

                <q-input
                    filled
                    v-model="confirm_password"
                    label="Confirm Password"
                    type="password"
                />

                <div class="login__button">
                    <q-btn unelevated :label="is_loading ? 'LOADING...' : 'SUBMIT'" type="submit" color="primary"/>
                </div>
                <div class="login__register">
                    <p class="message">Already registered? <a @click="$router.push('/login')" href="javascript:">Login</a></p>
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
    name: 'RegisterPage',
    data: () => 
    ({
        first_name: null,
        last_name: null,
        middle_name: null,
        email: null,
        password: null,
        confirm_password: null,
        is_loading: false
    }),
    methods:
    {
        async onSubmit()
        {
            try
            {
                this.is_loading = true;

                await this.$api.post('register',
                {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    middle_name: this.middle_name,
                    email: this.email,
                    password: this.password,
                    confirm_password: this.confirm_password
                });

                this.$q.notify({
                    color: 'green',
                    message: 'You have successfully registered.'
                });

                this.$router.push({ name: 'login' });
            }
            catch (e)
            {
                this.$q.notify(
                {
                    color: 'red',
                    message: e.response.data
                });
            }
            finally
            {
                this.is_loading = false;
            }
        }
    }
}
</script>
