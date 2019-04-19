<template>
    <div>
        <div>下载页面</div>
        <iframe :src="src" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    name:"",
    data() {
        return {
            src:''
        }
    },
    mounted() {
        this.src=this.$route.query.src
    },
}
</script>

<style lang="scss" scoped>

</style>

