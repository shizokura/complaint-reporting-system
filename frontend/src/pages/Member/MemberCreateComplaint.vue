<template>
    <div class="member-container">
        <div class="member-container__header">Complaint Form</div>
        <div class="member-container__body">
            <q-form @submit="submit()" class="form">
                <div class="two-columns">
                    <div class="form-group">
                        <div class="form-group__label">Complaint Type</div>
                        <div class="form-group__input">
                            <q-input :readonly="$route.params.id ? true : false" v-model="form_data.type" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group__label">Complaint Category</div>
                        <div class="form-group__input">
                            <q-select :readonly="$route.params.id ? true : false"  v-model="form_data.category" :options="['Communications', 'Humaneness/Caring', 'Institutional Issues', 'Patient Rights', 'Quality', 'Safety', 'Timing and Access', 'Environment']" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group__label">Name of Complainants</div>
                        <div class="form-group__input">
                            <q-input :readonly="$route.params.id ? true : false"  v-model="form_data.name" dense bg-color="white" type="text" filled />
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-group__label">Date</div>
                        <div class="form-group__input">
                            <q-input :readonly="$route.params.id ? true : false"  v-model="form_data.date" dense bg-color="white" type="date" filled />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Complaint Details</div>
                    <div class="form-group__input">
                        <q-input :readonly="$route.params.id ? true : false"  v-model="form_data.details" dense bg-color="white" type="textarea" filled />
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Complaint Relief</div>
                    <div class="form-group__input">
                        <q-input :readonly="$route.params.id ? true : false"  v-model="form_data.relief" dense bg-color="white" type="textarea" filled />
                    </div>
                </div>
                <div class="form-group">
                    <div class="form-group__label">Complaint Proof or Related Documents</div>
                    <div class="form-group__input">
                        <q-file v-if="!$route.params.id" v-model="form_data.proof" dense bg-color="white" type="file" label="Drop files to upload" filled />
                        <q-input v-else v-model="form_data.proof" dense bg-color="white" type="text" filled readonly />
                    </div>
                </div>
                <!-- <div class="form-group" style="text-align: center;">
                    <q-checkbox :style="$route.params.id ? 'opacity: 0.5; pointer-events: none;' : ''" v-model="form_data.is_anonymous" label="Do you want it to be anonymous?" />
                </div> -->
                <div v-if="$route.params.id ? false : true"  style="text-align: center;">
                    <q-btn type="submit" label="Submit" no-caps unelevated color="primary" />
                </div>
            </q-form>
        </div>
    </div>
</template>

<script>
import { collection, addDoc, getDocs, limit, orderBy, where, query, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export default
{
    name: 'MemberCreateComplaint',
    data: () => 
    ({
        form_data:
        {
            type: '',
            category: '',
            name: '',
            date: null,
            details: '',
            relief: '',
            proof: null,
            is_anonymous: false
        }
    }),
    methods:
    {
        async submit()
        {
            try
            {
                this.$q.loading.show(
                {
                    message: 'Submitting data...'
                });

                if (!this.form_data.type || !this.form_data.category || !this.form_data.name || !this.form_data.name || !this.form_data.date || !this.form_data.details || !this.form_data.relief || !this.form_data.proof)
                {
                    throw new Error('Please fill up all fields');
                }

                this.$q.loading.show(
                {
                    message: 'Uploading Files...'
                });

                let extension = this.form_data.proof.name.split('.');
                extension = extension[extension.length - 1];
                const storageRef = ref(this.$storage, `${ uuidv4() }.${ extension }`);
                await uploadBytes(storageRef, this.form_data.proof);
                let url = await getDownloadURL(storageRef);

                this.$q.loading.show(
                {
                    message: 'Saving Data...'
                });

                this.form_data.proof = url;
                this.form_data.status = 'pending';
                this.form_data.date_created = serverTimestamp();

                // get ID
                let last_data = await getDocs(query(collection(this.$db, "complaints"), orderBy('date_created', 'desc'), limit('1'))).then(res => res.docs.length ? Object.assign({}, res.docs[0].data(), { id: res.docs[0].id }) : null);
                console.log(last_data, last_data.id_number);
                if (last_data) this.form_data.id_number = last_data.id_number + 1;
                else this.form_data.id_number = 1;

                // user id
                let user_data = JSON.parse(localStorage.getItem('user_data'));
                this.form_data.user_id = user_data.id;

                await addDoc(collection(this.$db, "complaints"), this.form_data);

                // get all admin and notify
                let admins = await getDocs(query(collection(this.$db, "users"), where("role", "==", "Admin"))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
                
                await Promise.all(admins.map(async admin => 
                {
                    await this.$_createNotification(
                    { 
                        title: 'New Complaint',
                        message: `${ user_data.first_name } ${ user_data.last_name } submitted a complaint.`,
                        user_id: admin.id
                    });
                }));

                this.$q.notify({
                    color: 'green',
                    message: 'Successfully added.'
                });

                this.$router.go(-1);
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
        if (this.$route.params.id)
        {
            this.form_data =
            {
                type: this.$route.params.type,
                category: this.$route.params.category,
                name: this.$route.params.name,
                date: this.$route.params.date,
                details: this.$route.params.details,
                relief: this.$route.params.relief,
                proof: this.$route.params.proof,
                is_anonymous: this.$route.params.is_anonymous === "true" ? true : false
            }
        }
    }
}
</script>
