<template>
    <div class="member-message">
        <div class="member-message__button">
            <q-btn @click="add()" color="primary" label="Create Message" unelevated no-caps />
        </div>
        <div class="member-message__tab">
            <q-tabs
                v-model="tab"
                align="left"
                style="border: 1px solid #E0E0E0;"
            >
                <q-tab name="inbox" label="Inbox" />
                <q-tab name="outbox" label="Outbox" />
            </q-tabs>

            <q-separator />

            <q-tab-panels style="background-color: #F1F1F1" v-model="tab" animated>
                <q-tab-panel name="inbox">
                    <template v-if="inbox.length">
                        <div @click="view(message)" class="item" v-for="(message, index) in inbox" :key="index">
                            <div class="item__title">{{ message.from.name }}</div>
                            <div class="item__text">{{ message.subject }}</div>
                            <div class="item__date" style="text-align: right; margin-top: -25px;">{{ new Date(message.date_created.seconds * 1000).toLocaleDateString() }} {{ new Date(message.date_created.seconds * 1000).toLocaleTimeString() }} </div>
                        </div>
                    </template>
                    <div v-else>
                        No message yet
                    </div>
                </q-tab-panel>

                <q-tab-panel name="outbox">
                    <template v-if="outbox.length">
                        <div @click="view(message)" class="item" v-for="(message, index) in outbox" :key="index">
                            <div class="item__title">{{ message.to.name }}</div>
                            <div class="item__text">{{ message.subject }}</div>
                            <div class="item__date" style="text-align: right; margin-top: -25px;">{{ new Date(message.date_created.seconds * 1000).toLocaleDateString() }} {{ new Date(message.date_created.seconds * 1000).toLocaleTimeString() }} </div>
                        </div>
                    </template>
                    <div v-else>
                        No message yet
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </div>

        <q-dialog v-model="create_message_dialog">
            <q-card class="create-message">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">New Message</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section>
                    <div class="create-message__form">
                        <q-select v-model="to" use-input input-debounce="0" label="To:" :display-value="`${ to ? (to.first_name + ' ' + to.last_name) : '' }`" :options="users" @filter="filterFn">
                            <template v-slot:option="scope">
                                <q-item v-bind="scope.itemProps">
                                    <q-item-section>
                                        <q-item-label>{{ scope.opt.first_name + ' ' + scope.opt.last_name }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                        <q-input v-model="subject" label="Subject:" />
                        <q-input v-model="number" label="File Case Number:" type="number" />
                        <q-input v-model="message" type="textarea" label="Create a message here..." />
                        <div style="text-align: right">
                            <q-btn @click="send()" label="Send" unelevated color="primary" no-caps />
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-dialog v-model="view_message_dialog">
            <q-card class="create-message">
                <q-card-section class="row items-center q-pb-none">
                    <div class="text-h6">View Message</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section>
                    <div class="create-message__form">
                        <div>
                            <label for="" style="font-weight: 600;">Subject</label>
                            <q-input readonly v-model="subject" />
                        </div>
                        <div style="margin-top: 15px;">
                            <label for="" style="font-weight: 600;">File Case Number</label>
                            <q-input readonly v-model="number" />
                        </div>
                        <div style="margin-top: 15px;">
                            <label for="" style="font-weight: 600;">Message</label>
                            <q-input readonly v-model="message" type="textarea" />
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import './MemberMessage.scss';
import { getDocs, collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";

const types = ['inbox', 'outbox'];

export default
{
    name: 'MemberMessage',
    data: () => 
    ({
        complaints: [],
        tab: 'inbox',
        create_message_dialog: false,
        users: [],
        users_filtered: [],
        to: null,
        subject: null,
        number: null,
        message: null,
        inbox: [],
        outbox: [],
        unsubscribe: 
        {
            inbox: null,
            outbox: null
        },
        view_message_dialog: false
    }),
    props:
    {
        status: String
    },
    computed:
    {

    },
    methods:
    {
        add()
        {
            this.create_message_dialog = true;
            this.message = null,
            this.number = null;
            this.subject = null;
        },
        view({ message, subject, number })
        {
            this.message = message,
            this.subject = subject;
            this.number = number;
            this.view_message_dialog = true;
        },
        filterFn (val, update) 
        {
            if (val === '') 
            {
                update(() => 
                {
                    this.users_filtered = JSON.parse(JSON.stringify(this.users));
                })

                return
            }

            update(() => 
            {
                const needle = val.toLowerCase()
                this.users_filtered = this.users.filter(v => (v.first_name + ' ' + v.last_name).toLowerCase().indexOf(needle) > -1)
            })
        },
        async send()
        {
            try
            {
                this.$q.loading.show(
                {
                    message: 'Sending message...'
                });

                let user_data = JSON.parse(localStorage.getItem('user_data'));

                await addDoc(collection(this.$db, "messages"),
                {
                    from:
                    {
                        user_id: user_data.id,
                        name: `${ user_data.first_name } ${ user_data.last_name }`
                    },
                    to:
                    {
                        user_id: this.to.id,
                        name: `${ this.to.first_name } ${ this.to.last_name }`
                    },
                    message: this.message,
                    subject: this.subject,
                    number: this.number,
                    date_created: new Date()
                });

                await this.$_createNotification(
                { 
                    title: `New Message`, 
                    message: `${ user_data.first_name } ${ user_data.last_name } has sent you a new message. (File Case Number: ${ this.number })`, 
                    user_id: this.to.id
                });

                this.$q.notify(
                {
                    color: 'green',
                    message: 'Message sent!'
                });

                this.create_message_dialog = false;
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
        },
        getData(type = "inbox")
        {
            let user_data = JSON.parse(localStorage.getItem('user_data'));
            let where_query = null;
            if (type === "inbox") where_query = where("to.user_id", "==", user_data.id);
            else where_query = where("from.user_id", "==", user_data.id)
            const q = query(collection(this.$db, "messages"), where_query);

            this.unsubscribe[type] = onSnapshot(q, (querySnapshot) => 
            {
                this[type] = querySnapshot.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })).sort((a,b) => b.date_created.seconds - a.date_created.seconds);
            });
        }
    },
    async mounted()
    {
        types.forEach(t => this.getData(t));

        let user_data = JSON.parse(localStorage.getItem('user_data'));

        this.users = await getDocs(collection(this.$db, "users")).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })).filter(user => user.id !== user_data.id && !user_data.is_archived && user_data.is_verified && !user_data.is_rejected && user_data.is_email_verified));
    },
    unmounted()
    {
        types.forEach(type => this.unsubscribe[type]());
    }
}
</script>
