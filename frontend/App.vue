<template>
    <div class="container mx-auto mt-8 pb-8">
        <div class="pb-8 flex space-x-8 text-center">
            <div v-if="game.state !== 'answeringQuestion'" :class="categoryClass()" v-for="category in categories">
                <div class="group flex items-center p-2 border-b-4 border-indigo-800 drop-shadow-xl shadow-lg truncate">
                    <template v-if="game.state === 'editing'">
                        <input class="block w-full text-center text-lg font-bold bg-transparent focus:outline-none" v-model="category.name"/>
                        <XCircleIcon v-if="game.state === 'editing'" class="h-6 w-6 text-red-700 cursor-pointer transition-opacity opacity-0 group-hover:opacity-100" @click="removeCategory(category)"/>
                    </template>
                    <div v-else class="w-full text-center text-lg font-bold">
                        {{category.name}}
                    </div>
                </div>
                <Question v-for="question in category.questions" :question="question" :state="game.state" @delete="removeQuestion(category, question)" @pick="pickQuestion(question)"></Question>
                <div v-if="game.state === 'editing'" class="mt-4 py-0 cursor-pointer border-4 border-indigo-800 bg-indigo-900 rounded-md drop-shadow-xl shadow-lg" @click="addQuestion(category)">+</div>
            </div>
            <Question v-if="game.state === 'answeringQuestion'" :question="game.question" :category="categoryForQuestion(game.question)" :state="game.state"></Question>
            <div v-if="game.state === 'editing'">
                <div class="px-4 py-2 cursor-pointer text-lg font-bold border-b-4 border-indigo-800 bg-indigo-950 rounded-t-md drop-shadow-xl shadow-lg" @click="addCategory()">+</div>
            </div>
        </div>
        <div v-if="game.state === 'pickingTeams'" class="w-full">
            <div class="w-full text-center text-2xl font-bold">Add teams</div>
            <div class="mt-4 flex justify-center">
                <Team v-for="team in teams" :team="team" :state="game.state" @delete="removeTeam(team)"></Team>
                <div class="p-4 cursor-pointer border-2 border-indigo-800 bg-indigo-900 rounded-2xl drop-shadow-xl shadow-lg" @click="addTeam()">+</div>
            </div>
        </div>
        <div v-if="game.state === 'pickingQuestion'" class="w-full">
            <div class="w-full text-center text-2xl font-bold">Choose a question</div>
            <div class="mt-16 flex justify-center">
                <Team v-for="team in teams" :team="team" :state="game.state" @delete="removeTeam(team)"></Team>
            </div>
            <div class="mt-16 flex justify-center">
                <div class="cursor-pointer text-indigo-300 opacity-75 flex items-center" @click="resetGame()">
                    <ArrowPathIcon class="w-4 h-4 mr-1"></ArrowPathIcon>
                    Reset game
                </div>
            </div>
        </div>
        <div v-if="game.state === 'answeringQuestion'" class="-mt-12 pt-[50vh]">
            <div class="w-full text-center text-2xl font-bold">Select which teams answered correctly</div>
            <div class="mt-16 flex justify-center">
                <Team v-for="team in teams" :team="team" :state="game.state" :answerValue="game.question.value"></Team>
            </div>
        </div>
    </div>
    <footer class="relative w-full sticky top-[100vh] border-t-4 pb-5 pt-4 border-indigo-800 bg-indigo-900">
        <div class="h-full container mx-auto flex justify-between items-center">
            <div class="basis-1/3 h-full flex justify-start">
                <div v-if="canGoBack()" class="flex items-center cursor-pointer" @click="goBack()">
                    <ChevronLeftIcon class="inline-block w-6 h-6"></ChevronLeftIcon>
                    <span class="text-lg font-bold flex items-center">
                        Back
                    </span>
                </div>
            </div>
            <div class="basis-1/3 text-indigo-300 text-center">
                Any feedback? Let us know at
                <a href="mailto:gm@adikus.me" class="text-indigo-200 hover:underline">gm@adikus.me</a>
            </div>
            <div class="basis-1/3 h-full flex justify-end">

                <div v-if="canContinue()" class="ml-4 flex items-center cursor-pointer" @click="continueGame()">
                    <span v-if="game.state === 'pickingTeams'" class="text-lg font-bold flex items-center">
                        Play
                    </span>
                    <span v-else class="text-lg font-bold flex items-center">
                        Continue
                    </span>
                    <ChevronRightIcon class="inline-block w-6 h-6"></ChevronRightIcon>
                </div>
            </div>
        </div>
        <div class="absolute bottom-[110%] inset-x-0">
            <Toast :messages="messages"></Toast>
        </div>
    </footer>
</template>

<script>
import { XCircleIcon, ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon } from '@heroicons/vue/20/solid'
import { debounce } from 'lodash'

import Team from './Team.vue'
import Toast from './Toast.vue'
import Question from './Question.vue'

import defaultQuestions from './services/defaultQuestions'

export default {
    components: { Team, Toast, Question, ChevronLeftIcon, ChevronRightIcon, XCircleIcon, ArrowPathIcon },
    mounted() {
        this.saveInterval = setInterval(() => {
            const lastState = window.localStorage.getItem('jeopardy-state')
            const newState = JSON.stringify({
                categories: this.categories, game: this.game, teams: this.teams
            })
            if (lastState !== newState) {
                window.localStorage.setItem('jeopardy-state', newState)
                console.log('save')
                this.debouncedSaveMessage()
            }
        }, 1000)
    },
    created() {
        this.debouncedSaveMessage = debounce(() => {
            this.messages.push('Game saved')
            console.log(this.messages)
        }, 1500, { trailing: true })
    },
    data() {
        const defaultState = {
            ...defaultQuestions,
            teams: [],
            game: {
                state: 'editing'
            },
        }
        const overrideState = { messages: [] }
        const lastState = window.localStorage.getItem('jeopardy-state')

        if(lastState) {
            try {
                return {
                    ...defaultState,
                    ...JSON.parse(lastState),
                    ...overrideState
                }
            } catch (e) {
                console.error("Couldn't parse last state from local storage", e)
            }
        }

        return { ...defaultState, ...overrideState }
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
        generateId() {
            return Array(8).fill(0).map(_ => Math.random().toString(36).charAt(2)).join('')
        },
        addCategory() {
            this.categories.push({ name: 'New category', questions: [] })
        },
        addQuestion(category) {
            const categoryIndex = this.categories.indexOf(category)
            const id = this.generateId()
            category.questions.push({ id, question: 'New question', answer: null, value: this.nextValue(categoryIndex, category.questions.length) })
        },
        addTeam() {
            const id = this.generateId()
            this.teams.push({ id, name: "New name" })
        },
        nextValue(categoryIndex, questionIndex) {
            return this.categories[categoryIndex - 1]?.questions[questionIndex]?.value ??
                    this.categories[categoryIndex + 1]?.questions[questionIndex]?.value
        },
        removeCategory(category) {
            this.categories = this.categories.filter((c) => c !== category)
        },
        removeQuestion(category, question) {
            category.questions = category.questions.filter((q) => q !== question)
        },
        removeTeam(team) {
            this.teams = this.teams.filter((t) => t !== team)
        },
        canContinue() {
            return ['editing', 'pickingTeams', 'answeringQuestion'].includes(this.game.state)
        },
        continueGame() {
            if (this.game.state === 'editing') {
                this.game.state = 'pickingTeams'
            } else if (this.game.state === 'pickingTeams') {
                this.game.state = 'pickingQuestion'
            } else if (this.game.state === 'answeringQuestion') {
                const question = this.categories.flatMap((category) => [category.questions.find((question) => question.id === this.game.question.id)]).filter(Boolean)[0]
                this.teams.forEach((team) => {
                    if (team.answer === 'correct') {
                        team.score += question.value
                    } else if (team.answer === 'incorrect') {
                        team.score -= question.value
                    }
                    team.answer = null
                })
                question.answered = true
                this.game.question = null
                this.game.state = 'pickingQuestion'
            }
        },
        canGoBack() {
            return !['editing'].includes(this.game.state)
        },
        goBack() {
            if (this.game.state === 'pickingTeams') {
                this.game.state = 'editing'
            } else if (this.game.state === 'answeringQuestion') {
                this.game.state = 'pickingQuestion'
                this.game.question = null
            } else {
                this.game.state = 'pickingTeams'
            }
        },
        pickQuestion(question) {
            this.game.question = question
            this.game.state = 'answeringQuestion'
        },
        resetGame() {
            if (confirm('Are you sure you want to reset the game?')) {
                this.game.state = 'pickingQuestion'
                this.game.question = null
                this.teams.forEach((team) => {
                    team.score = 0
                })
                this.categories.forEach((category) => {
                    category.questions.forEach((question) => {
                        question.answered = false
                        question.answerRevealed = false
                    })
                })
            }
        }
    }
}
</script>
