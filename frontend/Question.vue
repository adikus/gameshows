<template>
    <div :class="questionClass" @click="chooseQuestion()">
        <template v-if="state === 'editing'">
            <XCircleIcon class="absolute right-2 top-2 h-6 w-6 text-red-700 cursor-pointer transition-opacity opacity-0 group-hover:opacity-100" @click="$emit('delete')"/>

            <div class="w-24 mx-auto flex">
                $
                <input type="number" class="ml-1 w-full text-center flex-grow bg-indigo-900 rounded-md appearance-none focus:shadow-xl ring-indigo-600 focus:ring-2 focus:outline-none" v-model="question.value"/>
            </div>

            <textarea class="block mt-1 p-2 w-full text-center bg-indigo-900 rounded-md focus:shadow-xl ring-indigo-600 focus:ring-2 focus:outline-none resize-none focus:resize-y" v-model="question.question"></textarea>
            <textarea class="block mt-1 p-2 w-full text-center bg-indigo-900 rounded-md focus:shadow-xl ring-indigo-600 focus:ring-2 focus:outline-none resize-none focus:resize-y" rows="1" v-model="question.answer"></textarea>
        </template>
        <template v-else-if="state !== 'answeringQuestion' && state !== 'guestAnsweringQuestion'">
            <div class="py-2 text-2xl font-bold text-center" :class="question.answered ? 'opacity-40' : ''">${{question.value}}</div>
            <div v-if="!state.includes('guest')" class="truncate text-indigo-300" :class="question.answered ? 'opacity-40' : ''">{{question.question}}</div>
        </template>
        <template v-else>
            <div class="flex justify-between text-indigo-300 text-xl">
                <div class="p-4">{{category?.name}}</div>
                <div class="p-4">${{question.value}}</div>
            </div>
            <div class="p-8 h-full flex flex-col space-y-8 items-center justify-center text-3xl leading-relaxed border-4 border-indigo-800 bg-indigo-900 rounded-md drop-shadow-xl shadow-lg">
                <div v-html="formattedQuestion"></div>
                <VTooltip v-if="!question.answerRevealed" delay="50" placement="bottom">
                    <div class="text-indigo-300 cursor-pointer opacity-40 hover:opacity-70" v-html="formattedAnswer" @click="revealAnswer()"></div>
                    <template #popper>
                        Reveal answer for everyone
                    </template>
                </VTooltip>
                <div v-else class="text-indigo-300" v-html="formattedAnswer"></div>
            </div>
        </template>
    </div>
</template>

<script>
    import { XCircleIcon } from '@heroicons/vue/20/solid'

    export default {
        props: ['question', 'category', 'state'],
        emits: ['delete', 'pick'],
        components: { XCircleIcon },
        computed: {
            questionClass() {
                if (this.state === 'answeringQuestion') {
                    return 'absolute p-12 pt-4 top-0 left-0 right-0 h-almost-half z-50 bg-indigo-950'
                }
                if (this.state === 'guestAnsweringQuestion') {
                    return 'absolute p-12 pt-4 top-0 left-0 right-0 h-almost-two-thirds z-50 bg-indigo-950'
                }

                const cursorClass = this.state === 'pickingQuestion' && !this.question.answered ? 'cursor-pointer' : ''
                return `relative group mt-4 p-2 border-4 border-indigo-800 bg-indigo-900 rounded-md drop-shadow-xl shadow-lg ${cursorClass}`
            },
            formattedQuestion() {
                return this.$sanitize(this.question.question?.replace("\n", "<br>"))
            },
            formattedAnswer() {
                return this.$sanitize(this.question.answer?.replace("\n", "<br>"))
            }
        },
        methods: {
            chooseQuestion() {
                if (this.state !== 'pickingQuestion' || this.question.answered) return

                this.$emit('pick')
            },
            revealAnswer() {
                this.question.answerRevealed = true
            }
        }
    }
</script>

<style scoped>
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }

    .h-almost-half {
        height: calc(50% - 4.25rem);
    }
    .h-almost-two-thirds {
        height: calc(66% - 4.25rem);
    }
    .h-almost-full {
        height: calc(100% - 4.25rem);
    }
</style>