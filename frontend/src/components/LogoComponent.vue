<template>
    <div class="logo">
        <div class="logo__img">
            <q-icon name="mdi-account-alert" />
        </div>
        <div class="logo__name">COMPLAINT REPORT SYSTEM</div>
        <!-- <div class="logo__sub">Amet, consectur adipiscing elit, sed do euismod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco labor nisi.</div> -->
    </div>
</template>

<style lang="scss" scoped>
.logo
{
    text-align: center;
    &__img
    {
        .q-icon
        {
            color: #fff;
            padding: 25px;
            background-color: #1976D2;
            border-radius: 100%;
            font-size: 75px;
        }
    }
    &__name
    {
        margin-top: 15px;
        font-size: 2.5rem;
        font-weight: 700;
    }
}
</style>

<script>
export default
{
    name: 'LogoComponent'
}
</script>
