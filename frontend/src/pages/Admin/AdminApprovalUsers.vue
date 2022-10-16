<template>
    <div class="admin-container">
        <div class="admin-container__back">
            <q-btn @click="$router.go(-1)" color="primary" unelevated label="Back" no-caps />
        </div>
        <div class="admin-container__header">Approval</div>
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
                                <th class="text-center">Email</th>
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
                                <td class="text-center">{{ user.email }}</td>
                                <td class="text-center">{{ user.first_name }}</td>
                                <td class="text-center">{{ user.last_name }}</td>
                                <td class="text-center">{{ dateFormat(user.birthdate) }}</td>
                                <td class="text-center">{{ user.gender || 'Unspecified' }}</td>
                                <td class="text-center">{{ user.phone_number }}</td>
                                <td class="text-center">
                                    <q-btn-dropdown color="primary" unelevated label="Action">
                                        <q-list>
                                            <q-item clickable v-close-popup @click="view(user)">
                                                <q-item-section>
                                                    <q-item-label>View Certificate of Residency</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                            <q-item clickable v-close-popup @click="approve(user)">
                                                <q-item-section>
                                                    <q-item-label>Approve</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                            <q-item clickable v-close-popup @click="reject(user)">
                                                <q-item-section>
                                                    <q-item-label>Reject</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-btn-dropdown>
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
import { collection, getDocs, query, doc, setDoc, deleteDoc, where } from "firebase/firestore"; 

export default
{
    name: 'AdminApprovalUsers',
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
        view(data)
        {
            window.open(data.certificate_of_residency, '_blank');
        },
        async approve(data)
        {
            if (confirm('Are you sure to approve this user?'))
            {
                try
                {
                    this.$q.loading.show();
                    await setDoc(doc(this.$db, "users", data.id), { is_verified: true }, { merge: true });
                    await this.initialize();
                }
                catch (e)
                {
                    console.log(e.message);
                }
                finally
                {
                    this.$q.loading.hide();
                }
            }
        },
        async reject(data)
        {
            if (confirm('Are you sure to reject this user?'))
            {
                try
                {
                    this.$q.loading.show();
                    await setDoc(doc(this.$db, "users", data.id), { is_rejected: true, is_verified: true }, { merge: true });
                    await this.initialize();
                }
                catch (e)
                {
                    console.log(e.message);
                }
                finally
                {
                    this.$q.loading.hide();
                }
            }
        },
        dateFormat(date)
        {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const d = new Date(date);
            console.log(`${ monthNames[d.getMonth()] } ${ d.getDate() }, ${ d.getFullYear() }`);
            return `${ monthNames[d.getMonth()] } ${ d.getDate() }, ${ d.getFullYear() }`;
        },
        async initialize()
        {
            this.users = await getDocs(query(collection(this.$db, "users"), where("is_verified", "==", false))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
        }
    },
    async mounted()
    {
        this.initialize();
    }
}
</script>
