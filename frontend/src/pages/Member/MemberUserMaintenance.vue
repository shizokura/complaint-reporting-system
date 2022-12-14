<template>
    <div class="member-container">
        <div class="member-container__header">User Profile</div>
        <div class="member-container__body">
            <q-form @submit="submit()" class="form">
                <div style="text-align: center; margin-bottom: 25px;">
                    <div style="margin-bottom: 15px;"><img :src="form_data.photo || 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'" style="width: 150px; height: 150px; border-radius: 100%; object-fit: cover;" /></div>
                    <q-btn @click="$refs.profile_image.click()" label="Upload" unelevated color="primary" />
                    <input ref="profile_image" @change="onUpload" type="file" style="display: none;" name="" id="">
                </div>
                <div class="two-columns">
                    <div class="form-group">
                        <div class="form-group__label">First name</div>
                        <div class="form-group__input">
                            <q-input :readonly="true" v-model="form_data.first_name" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group__label">Last name</div>
                        <div class="form-group__input">
                            <q-input :readonly="true" v-model="form_data.last_name" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                </div>
                <div class="three-columns">
                    <div class="form-group">
                        <div class="form-group__label">Date of Birth</div>
                        <div class="form-group__input">
                            <q-input :readonly="true" v-model="form_data.birthdate" dense bg-color="white" type="date" filled />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group__label">Gender</div>
                        <div class="form-group__input">
                            <q-select :readonly="true" :options="[ 'Male', 'Female' ]" v-model="form_data.gender" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group__label">Phone No.</div>
                        <div class="form-group__input">
                            <q-input :readonly="true" v-model="form_data.phone_number" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Complete Address</div>
                    <div class="form-group__input">
                        <q-input :readonly="$route.params.view ? true : false" v-model="form_data.address" dense bg-color="white" type="text" filled />
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Verification Identify</div>
                    <div class="form-group__input">
                        <q-file :readonly="$route.params.view ? true : false" v-model="form_data.identification" dense bg-color="white" type="file" label="Upload ID (maximum file size: 5mb)" filled accept="image/*, application/pdf" />
                        <q-btn unelevated color="primary" style="margin-top: 15px; display: block;" v-if="(form_data.identification && typeof form_data.identification === 'string')" :href="form_data.identification" alt="" target="_blank">View ID</q-btn>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Certificate of Residency</div>
                    <div class="form-group__input">
                        <q-file :readonly="$route.params.view ? true : false" v-model="form_data.certification" dense bg-color="white" type="file" label="Drop files to upload (maximum file size: 5mb)" filled accept="image/*, application/pdf" />
                        <q-btn unelevated color="primary" style="margin-top: 15px; display: block;" v-if="(form_data.certification && typeof form_data.certification === 'string')" :href="form_data.certification" alt="" target="_blank">View Certificate</q-btn>
                    </div>
                </div>
                <div v-if="$route.params.id ? false : true"  style="text-align: center;">
                    <q-btn v-if="$route.params.view ? false : true" type="submit" label="Update" no-caps unelevated color="primary" />
                </div>
            </q-form>
        </div>
    </div>
</template>

<script>
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

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
            address: null,
            identification: null,
            certification: null,
            photo: null
        },
        user_data: null
    }),
    methods:
    {
        async onUpload(event)
        {
            try
            {
                this.$q.loading.show({
                    message: 'Uploading image...'
                });

                let file = event.target.files[0];
                let extension = file.name.split('.');
                extension = extension[extension.length - 1];
                const storageRef = ref(this.$storage, `${ uuidv4() }.${ extension }`);
                await uploadBytes(storageRef, file);
                let url = await getDownloadURL(storageRef);
                this.form_data.photo = url;
            }
            catch (e)
            {
                console.log(e.message);
            } 
            finally
            {
                this.$q.loading.hide();
            }
        },
        async submit()
        {
            try
            {
                this.$q.loading.show(
                {
                    message: 'Submitting data...'
                });

                if (!this.form_data.first_name || !this.form_data.last_name || !this.form_data.birthdate || !this.form_data.gender || !this.form_data.phone_number || !this.form_data.address)
                {
                    throw new Error('Please fill up all fields');
                }

                // validate size
                if (typeof this.form_data.identification === 'object' && (this.form_data.identification.size  / 1024 / 1024) > 5)
                {
                    throw new Error('File size exceed (5mb only).');
                }

                if (typeof this.form_data.certification === 'object' && (this.form_data.certification.size  / 1024 / 1024) > 5)
                {
                    throw new Error('File size exceed (5mb only).');
                }

                this.$q.loading.show(
                {
                    message: 'Uploading Files...'
                });

                const uploadFile = async (data) =>
                {
                    let extension = data.name.split('.');
                    extension = extension[extension.length - 1];
                    const storageRef = ref(this.$storage, `${ uuidv4() }.${ extension }`);
                    await uploadBytes(storageRef, data);
                    let url = await getDownloadURL(storageRef);  
                    return url;
                };

                let update_data = Object.assign({}, this.form_data);

                update_data.date_created = new Date();

                if (this.form_data.identification && typeof this.form_data.identification === 'object') update_data.identification = await uploadFile(this.form_data.identification);
                else delete update_data.identification;
                if (this.form_data.certification && typeof this.form_data.certification === 'object') update_data.certification = await uploadFile(this.form_data.certification);
                else delete update_data.certification;

                this.$q.loading.show(
                {
                    message: 'Saving Data...'
                });

                let user_data = JSON.parse(localStorage.getItem('user_data'));

                if (!update_data.photo) update_data.photo = null;

                await setDoc(doc(this.$db, "users", user_data.id), update_data, { merge: true });

                this.$q.notify({
                    color: 'green',
                    message: 'Successfully updated.'
                });

                this.$router.go(-1);

                window.location.reload();
            }
            catch (e)
            {
                this.$q.dialog(
                {
                    title: "Something went wrong",
                    message: e.message,
                    persistent: true
                })
            }
            finally
            {
                this.$q.loading.hide();
            }
        }
    },
    mounted()
    {
        let user_data = JSON.parse(localStorage.getItem('user_data'));

        this.form_data.first_name = user_data.first_name;
        this.form_data.last_name = user_data.last_name;
        this.form_data.birthdate = user_data.birthdate;
        this.form_data.gender = user_data.gender;
        this.form_data.phone_number = user_data.phone_number;
        this.form_data.address = user_data.address;
        this.form_data.gender = user_data.gender ? user_data.gender : 'Male';
        this.form_data.photo = user_data.photo;
        this.form_data.identification = user_data.identification;
        this.form_data.certification = user_data.certification || user_data.certificate_of_residency;
    }
}
</script>
