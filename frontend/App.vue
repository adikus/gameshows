<template>
    <div class="container mx-auto mt-8 pb-8 flex space-x-8 text-center">
        <div class="flex-grow" v-for="category in categories">
            <div class="group flex items-center p-2 border-b-4 border-indigo-800 drop-shadow-xl shadow-lg truncate">
                <input class="block w-full text-center text-lg font-bold bg-transparent focus:outline-none" v-model="category.name"/>
                <XCircleIcon class="h-6 w-6 text-red-700 cursor-pointer transition-opacity opacity-0 group-hover:opacity-100" @click="removeCategory(category)"/>
            </div>
            <Question v-for="question in category.questions" :question="question" @delete="removeQuestion(category, question)"></Question>
            <div class="mt-4 py-0 cursor-pointer border-4 border-indigo-800 bg-indigo-900 rounded-md drop-shadow-xl shadow-lg" @click="addQuestion(category)">+</div>
        </div>
        <div>
            <div class="px-4 py-2 cursor-pointer text-lg font-bold border-b-4 border-indigo-800 bg-indigo-950 rounded-t-md drop-shadow-xl shadow-lg" @click="addCategory()">+</div>
        </div>
    </div>
    <footer class="w-full sticky top-[100vh] border-t-4 pb-5 pt-4 border-indigo-800 bg-indigo-900">
        <div class="h-full container mx-auto flex justify-between items-center">
            <div class="h-full min-w-32 flex items-center text-indigo-300">
                <span :class="saveMessageClass">Game saved</span>
            </div>
            <div class="text-indigo-300 text-center">
                Do you have any feedback? Let us know at&nbsp;
                <a href="mailto:gm@adikus.me" class="text-indigo-200 hover:underline">gm@adikus.me</a>
            </div>
            <div class="h-full flex items-center">
                <span class="text-lg font-bold flex items-center cursor-pointer">
                    Continue
                </span>
                <ChevronRightIcon class="inline-block w-6 h-6"></ChevronRightIcon>
            </div>
        </div>
    </footer>
</template>

<script>
import { XCircleIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import { debounce } from 'lodash'

import Question from './Question.vue'

import defaultQuestions from './services/defaultQuestions'

export default {
    components: { Question, ChevronRightIcon, XCircleIcon },
    mounted() {
        this.saveInterval = setInterval(() => {
            const lastState = window.localStorage.getItem('jeopardy-state')
            const newState = JSON.stringify({
                categories: this.categories
            })
            if (lastState !== newState) {
                window.localStorage.setItem('jeopardy-state', newState)
                this.debouncedSaveMessage()
            }
        }, 1000)
    },
    created() {
        this.debouncedSaveMessage = debounce(() => {
            this.saveMessageClass = 'opacity-100'
            setTimeout(() => { this.saveMessageClass = 'duration-1000 opacity-0' }, 1000)
            setTimeout(() => { this.saveMessageClass = 'invisible ' }, 2000)
        }, 1500, { trailing: true })
    },
    data() {
        const defaultState = { saveMessageClass: 'invisible ' }
        const lastState = window.localStorage.getItem('jeopardy-state')

        if(lastState) {
            try {
                return {
                    ...JSON.parse(lastState),
                    ...defaultState
                }
            } catch (e) {
                console.error("Couldn't parse last state from local storage", e)
            }
        }

        return {
            ...defaultQuestions,
            ...defaultState
        }
    },
    methods: {
        addCategory() {
            this.categories.push({ name: 'New category', questions: [] })
        },
        addQuestion(category) {
            const categoryIndex = this.categories.indexOf(category)
            category.questions.push({ question: 'New question', answer: null, value: this.nextValue(categoryIndex, category.questions.length) })
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
        }
    }
}
</script>
