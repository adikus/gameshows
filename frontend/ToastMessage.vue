<template>
    <div class="p-2 mb-2 mx-auto bg-slate-950 w-64 text-center rounded-md" :class="messageClass">
        {{message}}
    </div>
</template>

<script>
export default {
    props: ['message'],
    emits: ['delete'],
    data() {
        return {
            messageClass: 'opacity-75'
        }
    },
    mounted() {
        setTimeout(() => { this.messageClass = 'duration-1000 opacity-0' }, 1000)
        setTimeout(() => { this.$emit('delete') }, 2000)
    }
}
</script>
