<template>
    <div class="relative group mt-4 p-2 border-4 border-indigo-800 bg-indigo-900 rounded-md drop-shadow-xl shadow-lg truncate">
        <XCircleIcon class="absolute right-2 top-2 h-6 w-6 text-red-700 cursor-pointer transition-opacity opacity-0 group-hover:opacity-100" @click="$emit('delete')"/>

        <div class="w-24 mx-auto flex">
            $
            <input type="number" class="ml-1 w-full text-center flex-grow bg-indigo-900 rounded-md appearance-none focus:shadow-xl ring-indigo-600 focus:ring-2 focus:outline-none" v-model="question.value"/>
        </div>

        <textarea class="block mt-1 p-2 w-full text-center bg-indigo-900 rounded-md focus:shadow-xl ring-indigo-600 focus:ring-2 focus:outline-none resize-none focus:resize-y" v-model="question.question"></textarea>
        <textarea class="block mt-1 p-2 w-full text-center bg-indigo-900 rounded-md focus:shadow-xl ring-indigo-600 focus:ring-2 focus:outline-none resize-none focus:resize-y" rows="1" v-model="question.answer"></textarea>
    </div>
</template>

<script>
    import { XCircleIcon } from '@heroicons/vue/20/solid'

    export default {
        props: ['question'],
        emits: ['delete'],
        components: { XCircleIcon }
    }
</script>

<style scoped>
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }
</style>