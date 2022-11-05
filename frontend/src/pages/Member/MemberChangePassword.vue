<template>
    <div class="member-container">
        <div class="member-container__header">Change Password</div>
        <div class="member-container__body">
            <q-form @submit="submit()" class="form">
                <div class="form-group">
                    <div class="form-group__label">Old Password</div>
                    <div class="form-group__input">
                        <q-input type="password" v-model="old_password" dense bg-color="white" filled />
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">New Password</div>
                    <div class="form-group__input">
                        <q-input type="password" v-model="new_password" dense bg-color="white" filled />
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Confirm Password</div>
                    <div class="form-group__input">
                        <q-input type="password" v-model="confirm_password" dense bg-color="white" filled />
                    </div>
                </div>
                <div style="text-align: center;">
                    <q-btn type="submit" label="Submit" no-caps unelevated color="primary" />
                </div>
            </q-form>
        </div>
    </div>
</template>

<script>
import { updatePassword, signInWithEmailAndPassword } from "firebase/auth";

export default
{
    name: 'MemberChangePassword',
    data: () => 
    ({
        old_password: null,
        new_password: null,
        confirm_password: null
    }),
    methods:
    {
        async submit()
        {
            try
            {
                let user_data = JSON.parse(localStorage.getItem('user_data'));

                this.$q.loading.show(
                {
                    message: 'Changing password...'
                });

                if (!this.new_password || !this.confirm_password || !this.old_password)
                {
                    throw new Error('Please fill up all fields');
                }

                if (this.new_password !== this.confirm_password)
                {
                    throw new Error('Invalid confirm password');
                }

                await signInWithEmailAndPassword(this.$auth, user_data.email, this.old_password);
                await updatePassword(this.$auth.currentUser, this.new_password);

                this.$q.notify({
                    color: 'green',
                    message: 'Successfully password changed'
                });
            }
            catch (e)
            {
                if (e.message === 'Firebase: Error (auth/wrong-password).') e.message = 'Invalid old password';

                this.$q.notify(
                {
                    color: 'red',
                    message: e.message
                });
            }
            finally
            {
                this.$q.loading.hide();
            }
        }
    }
}
</script>
