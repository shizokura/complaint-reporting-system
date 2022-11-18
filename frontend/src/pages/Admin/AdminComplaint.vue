<template>
    <div class="admin-container">
        <div class="admin-container__back">
            <q-btn @click="$router.go(-1)" color="primary" unelevated label="Back" no-caps />
        </div>
        <div class="admin-container__header">{{ title }}</div>
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
                                <th class="text-center">Complaint File #</th>
                                <th class="text-center">Complainant</th>
                                <th class="text-center">Complaint Type</th>
                                <th class="text-center">Creation date</th>
                                <th class="text-center">Status</th>
                                <th class="text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(complaint, index) in complaints_filtered" :key="index">
                                <td class="text-center">{{ complaint.id_number.toString().padStart(5, '0') }}</td>
                                <td class="text-center">{{ complaint.name }}</td>
                                <td class="text-center">{{ complaint.type }}</td>
                                <td class="text-center">{{ dateFormat(new Date(complaint.date_created.seconds * 1000)) }}</td>
                                <td class="text-center" style="text-transform: capitalize;">{{ getStatus(complaint.status) }}</td>
                                <td class="text-center"><q-btn @click="viewComplaint(index, complaint)" color="primary" label="View" unelevated /></td>
                            </tr>
                        </tbody>
                    </q-markup-table>
                </div>
            </div>
        </div>

        <q-dialog v-model="detail_dialog" :maximized="true">
            <div style="background-color: #fff;">
                <div class="admin-container">
                    <q-btn @click="detail_dialog = false" class="admin-container__back" color="primary" unelevated label="Back" no-caps />
                    <q-btn v-if="selected_data.status !== 'closed'" @click="prompt = true" style="margin-left: 15px;" class="admin-container__back" color="primary" unelevated label="Action" no-caps />
                    <q-btn v-else-if="selected_data.status === 'closed'" disabled style="margin-left: 15px;" class="admin-container__back" color="primary" unelevated label="Action Taken" no-caps />
                    <div class="admin-container__header">Complaints Details</div>
                    <div class="admin-container__body">
                        <div class="view-complaint">
                            <div class="item">
                                <div class="item__label">Complaint No. #:</div>
                                <div class="item__value">{{ selected_data.id_number.toString().padStart(5, '0') }}</div>
                            </div>
                            <div class="item">
                                <div class="item__label">Complaint Type:</div>
                                <div class="item__value">{{ selected_data.type }}</div>
                            </div>
                            <div class="item">
                                <div class="item__label">Complaint Date:</div>
                                <div class="item__value">{{ selected_data.date }}</div>
                            </div>
                            <div class="item">
                                <div class="item__label">Complaint Details:</div>
                                <div class="item__value">{{ selected_data.details }}</div>
                            </div>
                            <div class="item">
                                <div class="item__label">Complainant Name:</div>
                                <div class="item__value">{{ selected_data.name }}</div>
                            </div>
                            <div class="item">
                                <div class="item__label">Complaint Proof:</div>
                                <div class="item__value"><a :href="selected_data.proof" target="_blank">{{ selected_data.proof }}</a></div>
                            </div>
                            <div class="item">
                                <div class="item__label">Complaint Relief:</div>
                                <div class="item__value">{{ selected_data.relief }}</div>
                            </div>
                            <div class="item">
                                <div class="item__label">Complaint Status:</div>
                                <div class="item__value">{{ getStatus(selected_data.status) }}</div>
                            </div>
                            <div v-if="selected_data.report" class="item">
                                <div class="item__label">Resolution:</div>
                                <div class="item__value">{{ selected_data.report }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </q-dialog>

        <q-dialog v-model="prompt" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                    <div class="text-h6">Resolution - Narrative Report</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input type="textarea" dense v-model="report" autofocus />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn color="red" @click="prompt = false" flat label="Back" v-close-popup />
                    <q-btn @click="closeComplaint()" flat label="Submit" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import './AdminComplaint.scss';

import { query, orderBy, collection, getDocs, where, setDoc, doc } from "firebase/firestore"; 

export default
{
    name: 'AdminComplaint',
    data: () =>
    ({
        detail_dialog: false,
        selected_data: null,
        selected_index: null,
        complaints: [],
        search: '',
        prompt: false,
        report: ''
    }),
    props:
    {
        status: String
    },
    computed:
    {
        title()
        {
            if (this.status === 'pending')
            {
                return 'Pending Complaints';
            }
            else if (this.status === 'process')
            {
                return 'In-Process Complaints';
            }
            else if (this.status === 'closed')
            {
                return 'Closed Complaints';
            }
            else
            {
                return '';
            }
        },
        complaints_filtered()
        {
            return this.complaints.filter(complaint => complaint.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
        }
    },
    methods:
    {
        getStatus(status)
        {
            if (status === 'pending')
            {
                return 'Pending';
            }
            else if (status === 'process')
            {
                return 'In-Process';
            }
            else if (status === 'closed')
            {
                return 'Closed';
            }
            else
            {
                return '';
            }
        },
        async closeComplaint()
        {
            try
            {
                this.$q.loading.show(
                {
                    message: 'Closing this complaint...'
                });

                await setDoc(doc(this.$db, "complaints", this.selected_data.id), { status: 'closed', report: this.report }, { merge: true });

                await this.$_createNotification(
                { 
                    title: `Complaint Status Changed`, 
                    message: `Complaint #${ this.selected_data.id_number } has been closed.`, 
                    user_id: this.selected_data.user_id
                });

                this.complaints = this.complaints.filter((complaint, index2) => index2 !== this.selected_index);
                this.detail_dialog = false;
                this.report = '';
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
        async viewComplaint(index, data)
        {
            this.$q.loading.show();

            if (data.status === 'pending')
            {
                await setDoc(doc(this.$db, "complaints", data.id), { status: 'process' }, { merge: true });

                await this.$_createNotification(
                { 
                    title: `Complaint Status Changed`, 
                    message: `Complaint #${ data.id_number.toString().padStart(5, '0') } is on process.`, 
                    user_id: data.user_id
                });

                this.complaints = this.complaints.filter((complaint, index2) => index2 !== index);
            }

            this.selected_data = data;
            this.selected_index = index;
            this.detail_dialog = true;

            this.$q.loading.hide();
        },
        dateFormat(date)
        {
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const d = new Date(date);
            console.log(`${ monthNames[d.getMonth()] } ${ d.getDate() }, ${ d.getFullYear() }`);
            return `${ monthNames[d.getMonth()] } ${ d.getDate() }, ${ d.getFullYear() }`;
        }
    },
    async mounted()
    {
        this.complaints = await getDocs(query(collection(this.$db, "complaints"), orderBy("id_number"), where("status", "==", this.status))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
    }
}
</script>
