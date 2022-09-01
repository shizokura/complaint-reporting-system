<template>
    <div class="member-message">
        <div class="member-message__button">
            <q-btn @click="create_message_dialog = true" color="primary" label="Create Message" unelevated no-caps />
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
                    <div class="item">
                        <div class="item__title">Admin</div>
                        <div class="item__text">Your complaints is on pending. Eos qui ratione voluptatem sequi nescuint. Neque porro.</div>
                    </div>
                    <div class="item">
                        <div class="item__title">Admin</div>
                        <div class="item__text">Your complaints is on pending. Eos qui ratione voluptatem sequi nescuint. Neque porro.</div>
                    </div>
                    <div class="item">
                        <div class="item__title">Admin</div>
                        <div class="item__text">Your complaints is on pending. Eos qui ratione voluptatem sequi nescuint. Neque porro.</div>
                    </div>
                </q-tab-panel>

                <q-tab-panel name="outbox">
                    <div class="item">
                        <div class="item__title">Admin</div>
                        <div class="item__text">Your complaints is on pending. Eos qui ratione voluptatem sequi nescuint. Neque porro.</div>
                    </div>
                    <div class="item">
                        <div class="item__title">Admin</div>
                        <div class="item__text">Your complaints is on pending. Eos qui ratione voluptatem sequi nescuint. Neque porro.</div>
                    </div>
                    <div class="item">
                        <div class="item__title">Admin</div>
                        <div class="item__text">Your complaints is on pending. Eos qui ratione voluptatem sequi nescuint. Neque porro.</div>
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
                        <q-input label="To:" />
                        <q-input label="Subject:" />
                        <q-input type="textarea" label="Create a message here..." />
                        <div style="text-align: right">
                            <q-btn label="Send" unelevated color="primary" no-caps />
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>

<script>
import './MemberMessage.scss';

export default
{
    name: 'MemberMessage',
    data: () => 
    ({
        complaints: [],
        tab: 'inbox',
        create_message_dialog: false
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

    },
    mounted()
    {

    }
}
</script>
