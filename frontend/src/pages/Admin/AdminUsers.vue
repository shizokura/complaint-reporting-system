<template>
    <div class="admin-container">
        <div class="admin-container__back">
            <q-btn @click="$router.go(-1)" color="primary" unelevated label="Back" no-caps />
        </div>
        <div class="admin-container__header">User Data</div>
        <div class="admin-container__body">
            <div class="table">
                <div class="table__filter">
                    <div></div>
                    <q-input v-model="search" type="text" bg-color="white" filled placeholder="Search..." />
                </div>
                <div class="table__table">
                    <q-markup-table separator="cell" flat>
                        <thead>
                            <tr>
                                <th class="text-center">#</th>
                                <th class="text-center">First Name</th>
                                <th class="text-center">Last Name</th>
                                <th class="text-center">Birthday</th>
                                <th class="text-center">Gender</th>
                                <th class="text-center">Phone no.</th>
                                <th class="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in users_filtered" :key="index">
                                <td class="text-center">{{ index + 1 }}</td>
                                <td class="text-center">{{ user.first_name }}</td>
                                <td class="text-center">{{ user.last_name }}</td>
                                <td class="text-center">{{ dateFormat(user.birthdate) }}</td>
                                <td class="text-center">{{ user.gender || 'Unspecified' }}</td>
                                <td class="text-center">{{ user.phone_number }}</td>
                                <td class="text-center">
                                    <q-btn @click="setAdmin(user.id)" style="margin-right: 15px;" color="primary" label="Set As Admin" unelevated />
                                    <q-btn @click="update(user)" style="margin-right: 15px;" color="primary" label="View" unelevated />
                                    <q-btn @click="remove(user.id)" color="red" label="Delete" unelevated />
                                </td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>
            </div>
        </div>

        <q-dialog full-width v-model="is_update_dialog">
            <q-card>
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">View User</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                    <div class="update-user">
                        <q-form
                            @submit="submit"
                            class="q-gutter-md"
                        >
                            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 15px;">
                                <q-input
                                    readonly
                                    filled
                                    v-model="update_data.first_name"
                                    label="First Name"
                                    lazy-rules
                                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                                />

                                <q-input
                                    readonly
                                    filled
                                    v-model="update_data.last_name"
                                    label="Last Name"
                                    lazy-rules
                                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                                />
                            </div>

                            <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 15px;">
                                <q-input
                                    readonly
                                    filled
                                    type="date"
                                    v-model="update_data.birthdate"
                                    label="Birthdate"
                                    lazy-rules
                                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                                />

                                <q-select
                                    readonly
                                    filled
                                    v-model="update_data.gender"
                                    label="Gender"
                                    lazy-rules
                                    :rules="[ val => val && val.length > 0 || 'Please type something']"
                                    :options="[ 'Male', 'Female' ]"
                                />
                            </div>

                            <q-input
                                readonly
                                filled
                                v-model="update_data.phone_number"
                                label="Phone Number"
                                lazy-rules
                                :rules="[ val => val && val.length > 0 || 'Please type something']"
                            />

                            <!-- <div style="text-align: right;">
                                <q-btn label="Submit" type="submit" color="primary"/>
                            </div> -->
                        </q-form>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import './AdminUsers.scss';
import { collection, getDocs, query, doc, setDoc, deleteDoc, where, onSnapshot } from "firebase/firestore"; 

export default
{
    name: 'AdminUsers',
    data: () => 
    ({
        users: [],
        search: '',
        is_update_dialog: false,
        update_data: null,
        unsub: null
    }),
    computed:
    {
        users_filtered()
        {
            return this.users.filter(user => `${ user.first_name } ${ user.last_name }`.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
        }
    },
    methods:
    {
        async setAdmin(id)
        {
            this.$q.loading.show({
                message: 'Setting as admin...'
            });

            await setDoc(doc(this.$db, "users", id), { role: 'Admin' }, { merge: true });
            await this.loadData();
            
            this.$q.loading.hide();
        },
        async remove(id)
        {
            try
            {
                this.$q.loading.show(
                {
                    message: 'Deleting user...'
                });

                await deleteDoc(doc(this.$db, "users", id));

                this.users = this.users.filter(user => user.id !== id);

                this.$q.notify(
                {
                    color: 'green',
                    message: 'Successfully deleted'
                });
            }
            catch (e)
            {
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
        },
        async submit()
        {
            try
            {
                this.$q.loading.show(
                {
                    message: 'Updating user...'
                });

                await setDoc(doc(this.$db, "users", this.update_data.id), this.update_data, { merge: true });

                this.$q.notify(
                {
                    color: 'green',
                    message: 'Successfully updated'
                });
            }
            catch (e)
            {
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
        },
        update(data)
        {
            this.is_update_dialog = true;
            this.update_data = data;

            console.log(this.update_data);
        },
        async verify(data)
        {
            try
            {
                this.$q.loading.show();

                if (data.is_verified)
                {
                    this.$q.notify(
                    {
                        color: 'red',
                        message: 'This account is already verified.'
                    });

                    return;
                }

                await this.$api.post('admin/verify-user',
                {
                    user_id: data._id
                });

                this.$q.notify(
                {
                    color: 'green',
                    message: 'This account has been successfully verified.'
                });

                this.data = await this.$api.post('admin/list-users').then(res => res.data);
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
                this.$q.loading.hide();
            }
        },
        dateFormat(date)
        {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const d = new Date(date);
            console.log(`${ monthNames[d.getMonth()] } ${ d.getDate() }, ${ d.getFullYear() }`);
            return `${ monthNames[d.getMonth()] } ${ d.getDate() }, ${ d.getFullYear() }`;
        },
        async loadData()
        {
            // this.users = await getDocs(query(collection(this.$db, "users"), where("is_verified", "==", true), where("role", "==", "Member"))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
            if (this.unsub) this.unsub();
            this.unsub = onSnapshot(query(collection(this.$db, "users"), where("is_verified", "==", true), where("role", "==", "Member")), (snap) => {
                this.users = [];
                snap.forEach((doc) => {
                    this.users.push(Object.assign({}, doc.data(), { id: doc.id }))
                })
            })
            
        }
    },
    async created()
    {
        this.loadData();
    },
    beforeUnmount()
    {
        console.log("Unsub...");
        if (this.unsub) this.unsub();
    }
}
</script>
