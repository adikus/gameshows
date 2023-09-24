<template>
    <ToastMessage v-for="message in messages" :message="message" @delete="removeMessage(message)"></ToastMessage>
</template>

<script>
import ToastMessage from './ToastMessage.vue'

export default {
    props: ['messages'],
    components: { ToastMessage },
    methods: {
        removeMessage(message) {
            const index = this.messages.indexOf(message)
            if (index > -1) {
                this.messages.splice(index, 1)
            }
        }
    }
}
</script>
