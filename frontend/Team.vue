<template>
    <div class="group mr-2 p-4 border-2 border-indigo-800 bg-indigo-900 rounded-2xl drop-shadow-xl shadow-lg">
        <template v-if="state === 'pickingTeams'">
            <XCircleIcon class="absolute -right-2 -top-2 h-6 w-6 text-red-700 cursor-pointer transition-opacity opacity-0 group-hover:opacity-100" @click="$emit('delete')"/>
            <input class="ml-1 w-32 text-center flex-grow bg-indigo-900 rounded-md appearance-none focus:shadow-xl ring-indigo-600 focus:ring-2 focus:outline-none" v-model="team.name"/>
        </template>
        <template v-else-if="state === 'answeringQuestion'">
            <div class="px-4 text-2xl text-center">{{team.name}}</div>
            <div class="mt-2 text-center">
                {{formattedScore}}
                <template v-if="team.answer === 'correct'">
                    + <span class="text-green-600">${{answerValue}}</span>
                </template>
                <template v-if="team.answer === 'incorrect'" class="red">
                    - <span class="text-red-600">${{answerValue}}</span>
                </template>
            </div>
            <div class="mt-2 flex justify-center space-x-4">
                <CheckIcon class="h-6 w-6 cursor-pointer" :class="team.answer === 'correct' ? 'text-green-600 hover:text-green-500' : 'text-indigo-300 hover:text-indigo-200'" @click="toggleCorrectAnswer()"/>
                <XMarkIcon class="h-6 w-6 cursor-pointer" :class="team.answer === 'incorrect' ? 'text-red-600 hover:text-red-500' : 'text-indigo-300 hover:text-indigo-200'" @click="toggleIncorrectAnswer()"/>
            </div>
        </template>
        <template v-else>
            <div class="px-4 text-2xl text-center">{{team.name}}</div>
            <div class="w-full flex justify-center">
                $
                <input type="number" class="ml-1 w-16 px-1 bg-indigo-900 rounded-md appearance-none focus:shadow-xl ring-indigo-600 focus:ring-2 focus:outline-none" v-model="team.score"/>
            </div>
        </template>
    </div>
</template>

<script>
import { XCircleIcon, XMarkIcon, CheckIcon } from '@heroicons/vue/20/solid'

export default {
    props: ['team', 'state', 'answerValue'],
    emits: ['delete'],
    components: { XCircleIcon, XMarkIcon, CheckIcon },
    mounted() {
        if (!this.team.score) this.team.score = 0
    },
    computed: {
        formattedScore() {
            if (this.team.score < 0) {
                return `-$${Math.abs(this.team.score)}`
            } else {
                return `$${this.team.score}`
            }
        }
    },
    methods: {
        toggleCorrectAnswer() {
            if (this.team.answer === 'correct') {
                this.team.answer = null
            } else {
                this.team.answer = 'correct'
            }
        },
        toggleIncorrectAnswer() {
            if (this.team.answer === 'incorrect') {
                this.team.answer = null
            } else {
                this.team.answer = 'incorrect'
            }
        }
    }
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
}
</style>
