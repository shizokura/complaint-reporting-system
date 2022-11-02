<template>
    <div class="login-container">
        <div v-if="!has_submitted" class="login">
            <div class="login__title">Find your Account</div>
            <div class="login__subtitle" style="margin-bottom: 25px;">Please enter your email or mobile number to search your account.</div>
            <q-form
                @submit="onSearch"
                class="q-gutter-md"
            >
                <div>
                    <div style="margin-bottom: 15px;">
                        <q-input v-model="email" type="text" outlined placeholder="Enter your email address" />
                    </div>
                    <div class="login__button" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 15px;">
                        <q-btn @click="$router.push({ name: 'login' })" style="height: 56px;" no-caps unelevated label="CANCEL" color="primary"/>
                        <q-btn style="height: 56px;" no-caps unelevated label="SEARCH" type="submit" color="primary"/>
                    </div>
                </div>
            </q-form>
        </div>
        <div v-else class="login">
            <div class="login__title">Reset your password</div>
            <div class="login__subtitle" style="margin-bottom: 50px;">Send code via Email</div>
            <div v-if="account" style="text-align: center; padding-bottom: 50px;">
                <img style="border-radius: 100%; width: 100px; height: 100px; object-fit: cover;" :src="account.photo || 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=170667a&w=0&h=kEAA35Eaz8k8A3qAGkuY8OZxpfvn9653gDjQwDHZGPE='" alt="">
                <div style="margin-top: 10px; font-weight: 600;">{{ `${ account.first_name } ${ account.last_name }` }}</div>
            </div>
            <q-form
                @submit="onSubmit"
                class="q-gutter-md"
            >
                <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 15px;">
                    <div class="login__terms" style="margin-bottom: 0;">
                        <div class="text" style="text-align: left;">No longer has access in this account?</div>
                    </div>
                    <div class="login__button" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 15px;">
                        <q-btn @click="has_submitted = false" style="height: 56px;" no-caps unelevated label="NOT YOU?" type="submit" color="primary"/>
                        <q-btn style="height: 56px;" no-caps unelevated label="CONTINUE" type="submit" color="primary"/>
                    </div>
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
    // grid-template-columns: 500px auto;
    column-gap: 100px;
    background-image: url('/bg.svg');
    background-size: cover;
}

.login
{
    width: 700px;
    margin: auto;
    background-color: #fff;
    padding: 50px;
    .two-columns
    {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 15px;
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
        .q-btn
        {
            width: 100%;
            height: 50px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
        }
    }
    &__terms
    {
        text-align: center;
        color: rgba(0,0,0,0.5);
        font-size: 1rem;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        margin-bottom: 25px;
        a
        {
            color: #5588ff;
        }
        .q-checkbox
        {
            display: inline-block;
            vertical-align: middle;
        }
        .text
        {
            display: inline-block;
            vertical-align: middle;
            a
            {
                color: #5588ff;
                cursor: pointer;
            }
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
import { collection, getDocs, limit, orderBy, where, query } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default
{
    name: 'ForgotPassword',
    data: () => 
    ({
        has_submitted: false,
        email: null,
        account: null
    }),
    methods:
    {
        async onSearch()
        {
            this.$q.loading.show({
                message: 'Finding account...'
            });

            let user = await getDocs(query(collection(this.$db, 'users'), where('email', '==', this.email), limit(1))).then(res => res.docs.length ? Object.assign({}, res.docs[0].data(), { id: res.docs[0].id }) : null);

            if (!user)
            {
                this.$q.notify({
                    color: 'red',
                    message: 'User not found'
                });
                this.$q.loading.hide();
                return;
            }

            this.account = user;

            this.has_submitted = true;

            this.$q.loading.hide();
        },
        async onSubmit()
        {
            this.$q.loading.show();
            const auth = getAuth();
            await sendPasswordResetEmail(auth, this.email)
            .then(() => {
                this.$router.push({ name: 'login' });
                this.$q.dialog({
                    title: 'Success',
                    message: 'Please check your email for further instruction. Make sure to check spam folder.',
                    persistent: true
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                this.$q.notify({
                    color: 'red',
                    message: errorMessage
                });
            })
            .finally(() => {
                this.$q.loading.hide();
            });
        }
    },
    async mounted()
    {

    }
}
</script>
