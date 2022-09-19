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
                                    <q-btn style="margin-right: 15px;" color="primary" label="Update" unelevated />
                                    <q-btn color="red" label="Delete" unelevated />
                                </td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { collection, getDocs, query } from "firebase/firestore"; 

export default
{
    name: 'AdminUsers',
    data: () => 
    ({
        users: [],
        search: ''
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
        }
    },
    async created()
    {
        this.users = await getDocs(query(collection(this.$db, "users"))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
    }
}
</script>
