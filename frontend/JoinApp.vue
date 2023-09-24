<template>
    <div class="container mx-auto mt-8 pb-8">
        <div class="pb-8 flex space-x-8 text-center">
            <div v-if="game.state === 'guestPickingQuestion'" :class="categoryClass()" v-for="category in categories">
                <div class="group flex items-center p-2 border-b-4 border-indigo-800 drop-shadow-xl shadow-lg truncate">
                    <div class="w-full text-center text-lg font-bold">
                        {{category.name}}
                    </div>
                </div>
                <Question v-for="question in category.questions" :question="question" :state="game.state"></Question>
            </div>
            <Question v-else-if="game.question" :question="game.question" :category="categoryForQuestion(game.question)" :state="game.state"></Question>
        </div>
        <div class="mt-16 flex justify-center" :class="game.state === 'guestAnsweringQuestion' ? '-mt-16 pt-[66vh]' : ''">
            <Team v-for="team in teams" :team="team" :state="game.state" :answerValue="game.question?.value"></Team>
        </div>
        <div v-if="game.state === 'joining'" class="mt-16 pt-[20vh] flex justify-center items-center text-2xl font-bold">
            Joining...
        </div>
    </div>
</template>

<script>
import { io } from "socket.io-client"

import Team from './Team.vue'
import Question from './Question.vue'

export default {
    components: { Team, Question },
    mounted() {
        this.socket = io(window.baseUrl);
        this.socket.on("connect", () => {
            this.socket.emit('jeopardy:subscribe', { token: window.token })
            this.joinInterval = setInterval(() => {
                this.socket.emit('jeopardy:subscribe', { token: window.token })
            }, 1000)
        });
        this.socket.on("jeopardy:state", (state) => {
            clearInterval(this.joinInterval)
            this.game = state.game
            this.categories = state.categories
            this.teams = state.teams
        });
    },
    unmounted() {
        this.socket?.disconnect()
    },
    data() {
        return {
            categories: [],
            teams: [],
            game: {
                id: null,
                state: 'joining'
            },
        }
    },
    methods: {
        categoryClass() {
            const maxWidths = ['max-w-[100%]', 'max-w-[50%]', 'max-w-[33%]', 'max-w-[25%]', 'max-w-[20%]', 'max-w-[17%]', 'max-w-[14%]', 'max-w-[13%]', 'max-w-[11%]', 'max-w-[10%]', 'max-w-[9%]', 'max-w-[8%]']
            const width = maxWidths[this.categories.length - 1] ?? maxWidths.at(-1)
            return `${width} flex-grow`
        },
        categoryForQuestion(question) {
            return this.categories.find((category) => category.questions.some((q) => question.id === q.id))
        },
    }
}
</script>
