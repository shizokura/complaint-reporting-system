<template>
    <div class="login-container">
        <div class="login">
            <div class="login__title">Verification</div>
            <div class="login__subtitle" style="margin-bottom: 50px;">Please check your enmail for a message with your code.</div>
            <q-form
                @submit="onSubmit"
                class="q-gutter-md"
            >
                <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 15px;">
                    <q-input
                        outlined
                        label="Enter Code"
                        type="text"
                        v-model="code"
                    />
                    <div class="login__button" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 15px;">
                        <q-btn @click="logout()" style="height: 56px;" no-caps unelevated label="CANCEL" type="submit" color="primary"/>
                        <q-btn style="height: 56px;" no-caps unelevated :label="is_loading ? 'LOADING...' : 'CONTINUE'" type="submit" color="primary"/>
                    </div>
                </div>
                <div class="login__terms" style="margin-bottom: 0;">
                    <div @click="resend()" class="text" style="cursor: pointer; text-decoration: underline;">Didn't get the code?</div>
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
import { signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import CONFIG from 'app/config';

export default
{
    name: 'MemberVerification',
    data: () => 
    ({
        code: null,
        user_data: null
    }),
    async mounted()
    {
        if (!localStorage.getItem('user_data'))
        {
            return await this.$router.push({ name: 'login' });
        }

        this.user_data = JSON.parse(localStorage.getItem('user_data'));
    },
    methods:
    {
        async resend()
        {
            this.$q.loading.show({
                message: 'Resending code...'
            });

            // generate code
            let code = Math.floor(100000 + Math.random() * 900000);

            // update user code
            await setDoc(doc(this.$db, "users", this.user_data.id), { code }, { merge: true });

            // resend email
            await this.$axios.post(`${ CONFIG.API_URL }/verify`, { id: this.user_data.id, code, email: this.user_data.email });

            this.$q.loading.hide();

            this.$q.notify({
                color: 'green',
                message: 'Successfully resend'
            });
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
        },
        async onSubmit()
        {
            this.$q.loading.show({
                message: 'Verifying code...'
            });

            let user_data = await getDoc(doc(this.$db, "users", this.user_data.id));
            user_data = Object.assign({}, user_data.data(), { id: user_data.id });

            // check if code is same
            if (String(user_data.code) !== String(this.code))
            {
                this.$q.notify({
                    color: 'red',
                    message: 'Invalid code'
                });
                this.$q.loading.hide();
                return;
            }

            // then update user data to verified
            await setDoc(doc(this.$db, 'users', this.user_data.id), { is_email_verified: true }, { merge: true });
            user_data = await getDoc(doc(this.$db, "users", this.user_data.id));
            user_data = Object.assign({}, user_data.data(), { id: user_data.id });
            localStorage.setItem('user_data', JSON.stringify(user_data));

            // then redirect to dashboard
            await this.$router.push({ name: 'member_dashboard' });

            this.$q.loading.hide();
        }
    }
}
</script>
