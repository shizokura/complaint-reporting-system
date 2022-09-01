<template>
    <div class="member-container">
        <div class="member-container__header">User Profile</div>
        <div class="member-container__body">
            <q-form @submit="submit()" class="form">
                <div class="two-columns">
                    <div class="form-group">
                        <div class="form-group__label">First name</div>
                        <div class="form-group__input">
                            <q-input v-model="form_data.first_name" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group__label">Last name</div>
                        <div class="form-group__input">
                            <q-input v-model="form_data.last_name" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                </div>
                <div class="three-columns">
                    <div class="form-group">
                        <div class="form-group__label">Date of Birth</div>
                        <div class="form-group__input">
                            <q-input v-model="form_data.birthdate" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group__label">Gender</div>
                        <div class="form-group__input">
                            <q-input v-model="form_data.gender" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group__label">Phone No.</div>
                        <div class="form-group__input">
                            <q-input v-model="form_data.phone_number" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Complete Address</div>
                    <div class="form-group__input">
                        <q-input v-model="form_data.address" dense bg-color="white" type="text" filled />
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Verification Identify</div>
                    <div class="form-group__input">
                        <!-- <q-input v-model="form_data.address" dense bg-color="white" type="text" filled /> -->
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Certificate of Residency</div>
                    <div class="form-group__input">
                        <!-- <q-input v-model="form_data.address" dense bg-color="white" type="text" filled /> -->
                    </div>
                </div>
                <div v-if="$route.params.id ? false : true"  style="text-align: center;">
                    <q-btn type="submit" label="Submit" no-caps unelevated color="primary" />
                </div>
            </q-form>
        </div>
    </div>
</template>

<script>
export default
{
    name: 'MemberUserMaintenance',
    data: () => 
    ({
        form_data:
        {
            first_name: null,
            last_name: null,
            birthdate: null,
            gender: null,
            phone_number: null,
            address: null
        }
    })
}
</script>
