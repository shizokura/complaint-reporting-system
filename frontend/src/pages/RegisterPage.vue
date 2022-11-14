<template>
    <div class="login-container">
        <!-- <LogoComponent /> -->
        <div class="login">
            <div class="login__title">Sign up to have an account</div>
            <div class="login__subtitle" style="margin-bottom: 50px;">Already registered? <a @click="$router.push('/login')" href="javascript:">Login</a></div>
            <q-form
                @submit="onSubmit"
                class="q-gutter-md"
            >
                <div class="two-columns">
                    <q-input
                        outlined
                        v-model="first_name"
                        label="First Name"
                    />
                    <q-input
                        outlined
                        v-model="last_name"
                        label="Last Name"
                    />
                </div>
                <div class="two-columns">
                    <q-input v-model="birthdate" type="date" outlined hint="Date of Birth" />
                    <q-input v-model="phone_number" type="number" outlined label="Phone no." />
                </div>
                <q-input v-model="address" type="text" outlined label="Complete Address" />
                <q-file v-model="certificate_of_residency" outlined label="Upload Your Certificate of Residency" />
                <q-input
                    outlined
                    type="email"
                    v-model="email"
                    label="Email"
                />
                <q-input
                    outlined
                    v-model="password"
                    label="Password"
                    type="password"
                />
                <q-input
                    outlined
                    v-model="confirm_password"
                    label="Confirm Password"
                    type="password"
                />
                <div class="login__terms">
                    <q-checkbox v-model="is_agree" />
                    <div class="text">I agree to <a @click="terms_dialog = true" href="javascript:">Terms and Condition</a> of this website.</div>
                </div>
                <div class="login__button">
                    <q-btn no-caps unelevated :label="is_loading ? 'LOADING...' : 'REGISTER'" type="submit" color="primary"/>
                </div>
                <!-- <div class="login__register">
                    <p class="message">Already registered? <a @click="$router.push('/login')" href="javascript:">Login</a></p>
                </div> -->
            </q-form>
        </div>

        <q-dialog v-model="terms_dialog">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Terms of Agreement</div>
                </q-card-section>

                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                    <p>Acknowledgment</p>
                    <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service. Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service. By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service. You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service. Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>

                    <p>User Accounts</p>
                    <p>When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times.  You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a Third-Party Social Media Service. You agree not to disclose Your password to any third party. You must notify Us immediately upon becoming aware of any breach of security or unauthorized use of Your account. You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than You without appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.</p>

                    <p>Content</p>
                    <p>Your Right to Post Content. Our Service allows You to post Content. You are responsible for the Content that You post to the Service, including its legality, reliability, and appropriateness. By posting Content to the Service, You grant Us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of Your rights to any Content You submit, post or display on or through the Service and You are responsible for protecting those rights. You agree that this license includes the right for Us to make Your Content available to other users of the Service, who may also use Your Content subject to these Terms. You represent and warrant that: (i) the Content is Yours (You own it) or You have the right to use it and grant Us the rights and license as provided in these Terms, and (ii) the posting of Your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.</p>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn @click="is_agree = false" flat label="Decline" color="primary" v-close-popup />
                    <q-btn @click="() => { terms_dialog = false; privacy_dialog = true }" flat label="Accept" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="privacy_dialog">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Data Privacy Policy</div>
                </q-card-section>

                <q-separator />

                <q-card-section style="max-height: 50vh" class="scroll">
                    <p>GENERAL</p>
                    <p>Online Complaint Report System and its affiliates (also collectively referred as “Company”, “we”, “our” and “us”) established this Data Privacy Policy to show that we recognize and value your privacy rights.</p>

                    <p>APPLICABILITY</p>
                    <p>This Data Privacy Policy applies to Personal Information we collect on our website. We have prepared this Privacy Policy to help you understand how Online Complaint Report System collects, uses, and seeks to safeguard the Personal Information (as defined below) you provide to us on our websites, via email, and through our service providers and distribution partners. This Privacy Policy does not address, and we are not responsible for, the privacy, information or other practices of any third party, including any third-party distribution partners, suppliers and tour operators, and any third party operating any site to which our websites contain a link. By downloading, accessing or using our websites, or providing information to us in connection with our websites, you agree to the terms and conditions of this Privacy Policy.</p>

                    <p>PERSONAL INFORMATION WE COLLECT</p>
                    <p style="white-space: pre-wrap;">“Personal Information” is information that identifies you as an individual which could also be considered “sensitive personal information”, such as but not limited to the following:
•	Name
•	Age
•	Date of Birth
•	Gender
•	Contact Details [Address/Location, Telephone number (including home and mobile phone numbers), Email address]
•	E-mail address information (email address, username)
•	And such other additional information that will be required in relation with herein declared purpose and use of information
If the Personal Information was provided by a minor or one who is not legally capable of entering into contractual transactions without parental or guardian consent, the parent or guardian shall be responsible in giving the consent required under this Data Privacy Policy and in correcting any information given or in informing us that the information should be disregarded or deleted.
If you provide us or our service providers with Personal Information of other people in connection with the services we offer, you hereby represent that you have the authority to do so and have secured consent to permit us to use the information in accordance with this Data Privacy Policy.</p>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn @click="is_agree = false" flat label="Decline" color="primary" v-close-popup />
                    <q-btn @click="() => { is_agree = true; privacy_dialog = false }" flat label="Accept" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<style lang="scss" scoped>
.login-container
{
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 15px;
    background: #fff;
    display: grid;
    // grid-template-columns: 500px auto;
    column-gap: 100px;
    background-image: url('/bg.svg');
    background-size: cover;
}

.login
{
    width: 700px;
    margin: auto;
    background-color: #fff;
    padding: 50px;
    @media screen and (max-width: 750px)
    {
        width: 100%;
    }
    @media screen and (max-width: 500px)
    {
        padding: 25px;
    }
    .two-columns
    {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        column-gap: 15px;
    }
    &__title
    {
        display: block;
        font-size: 2rem;
        color: #333333;
        line-height: 1.2;
        text-align: center;
        font-weight: 700;
        text-align: left;
        font-family: 'Montserrat', sans-serif;
        @media screen and (max-width: 600px)
        {
            font-size: 1.5rem;
        }
    }
    &__subtitle
    {
        color: rgba(0,0,0,0.3);
        font-size: 1rem;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        margin-bottom: 25px;
        @media screen and (max-width: 600px)
        {
            font-size: 0.8rem;
        }
        a
        {
            color: #5588ff;
        }
    }
    &__button
    {
        .q-btn
        {
            width: 100%;
            height: 50px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
        }
    }
    &__terms
    {
        text-align: center;
        color: rgba(0,0,0,0.5);
        font-size: 1rem;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        margin-bottom: 25px;
        a
        {
            color: #5588ff;
        }
        .q-checkbox
        {
            display: inline-block;
            vertical-align: middle;
        }
        .text
        {
            display: inline-block;
            vertical-align: middle;
            @media screen and (max-width: 560px)
            {
                font-size: 0.8rem;
            }
            a
            {
                color: #5588ff;
                cursor: pointer;
            }
        }
    }
    &__register
    {
        text-align: center;
        p
        {
            margin: 15px 0 0;
            color: #b3b3b3;
            font-size: 12px;
            a
            {
                color: #5588ff;
                text-decoration: none;
            }
        }
    }
}
</style>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, getDocs, where, query } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import LogoComponent from "src/components/LogoComponent.vue";
import { v4 as uuidv4 } from 'uuid';
import CONFIG from 'app/config';

export default
{
    name: 'RegisterPage',
    // components: { LogoComponent },
    data: () => 
    ({
        // Form Data
        first_name: null,
        last_name: null,
        birthdate: null,
        phone_number: null,
        address: null,
        certificate_of_residency: null,
        email: null,
        password: null,
        confirm_password: null,

        // Boolean
        is_loading: false,
        is_agree: false,
        terms_dialog: false,
        privacy_dialog: false
    }),
    methods:
    {
        async onSubmit()
        {
            if (this.is_loading)
            {
                return;
            }

            try
            {
                this.is_loading = true;
                this.$q.loading.show(
                {
                    message: 'Submitting Data...'
                });

                if (this.password !== this.confirm_password)
                {
                    const error = new Error("message");
                    error.code = "auth/invalid-password";
                    throw error;
                }

                if (!this.is_agree)
                {
                    const error = new Error("message");
                    error.code = "auth/terms-required";
                    throw error;
                }

                if (!this.first_name || !this.last_name || !this.birthdate || !this.phone_number || !this.address || !this.certificate_of_residency || !this.email || !this.password || !this.confirm_password)
                {
                    const error = new Error("message");
                    error.code = "auth/fields-incomplete";
                    throw error;
                }

                let { user } = await createUserWithEmailAndPassword(this.$auth, this.email, this.password);

                // Upload File
                this.$q.loading.show(
                {
                    message: 'Uploading Files...'
                });

                let extension = this.certificate_of_residency.name.split('.');
                extension = extension[extension.length - 1];
                const storageRef = ref(this.$storage, `${ uuidv4() }.${ extension }`);
                await uploadBytes(storageRef, this.certificate_of_residency);
                let url = await getDownloadURL(storageRef);
                

                this.$q.loading.show(
                {
                    message: 'Saving Data...'
                });

                // generate 6 digit code
                let code = Math.floor(100000 + Math.random() * 900000);

                await setDoc(doc(this.$db, "users", user.uid), 
                {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    birthdate: this.birthdate,
                    phone_number: this.phone_number,
                    address: this.address,
                    certificate_of_residency: url,
                    email: this.email,
                    role: 'Member',
                    is_verified: false,
                    is_rejected: false,
                    is_email_verified: false,
                    code
                });

                let admins = await getDocs(query(collection(this.$db, "users"), where("role", "==", "Admin"))).then(res => res.docs.map(doc => Object.assign({}, doc.data(), { id: doc.id })));
                
                await Promise.all(admins.map(async admin => 
                {
                    await this.$_createNotification(
                    { 
                        title: 'New Application',
                        message: `${ this.first_name } ${ this.last_name } is waiting for review. Check approval tab.`,
                        user_id: admin.id
                    });
                }));

                await this.$axios.post(`${ CONFIG.API_URL }/verify`, { id: user.uid, code, email: this.email });

                this.$q.notify(
                {
                    color: 'green',
                    message: 'You have successfully registered.'
                });

                window.location.reload();
            }
            catch (error)
            {
                const errorCode = error.code;

                let message = null;
                
                if (errorCode === 'auth/admin-restricted-operation')
                {
                    message = 'Fill up all fields';
                }
                else if (errorCode === 'auth/email-already-in-use')
                {
                    message = 'Email already in use';
                }
                else if (errorCode === 'auth/invalid-password')
                {
                    message = 'Invalid confirm password';
                }
                else if (errorCode === 'auth/terms-required')
                {
                    message = 'Please accept terms and condition.';
                }
                else if (errorCode === 'auth/fields-incomplete')
                {
                    message = 'Fill up all fields';
                }
                else
                {
                    message = error.message;
                }

                if (message)
                {
                    this.$q.dialog(
                    {
                        title: "Something went wrong",
                        message: message,
                        persistent: true
                    });
                }
            }
            finally
            {
                this.is_loading = false;
                this.$q.loading.hide();
            }
        }
    }
}
</script>
