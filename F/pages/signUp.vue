<template>
    <div>
        <div class="flex flex-col items-center justify-center min-h-screen text-black">
            <div class="bg-white rounded-md">
                <div class="mb-6 ml-10 mr-1 mt-10">
                    <input type="text" v-model="userIF.email" placeholder="email"
                        class="w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
                </div>
                <div class="mb-6 ml-10 mr-10">
                    <input type="password" v-model="userIF.password" placeholder="password"
                        class="w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
                </div>
                <div class="mb-6 ml-10 mr-10">
                    <input type="nickname" v-model="userIF.nickname" placeholder="nickname"
                        class="w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300">
                </div>
                <button @click="signUp"
                            class="w-96 px-3 py-2 mb-6 ml-10 mr-10 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                        회원가입
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()

const userIF = ref({
        email: '',
        password: '',
        nickname: '',
    })

const signUp = ( async() => {

    try {
        const response = await $fetch('/auth/signUp',{
            baseURL: "http://localhost:3001",
            method: "POST",
            body: {
                email: userIF.value.email,
                password: userIF.value.password,
                nickname: userIF.value.nickname
            }
        })
        if(response.email){
            alert('회원가입에 성공하였습니다!')
            router.push('/')
        }
    } catch (error) {
        if (error.status === 401){
            router.push('signUp')
        }
    }

    
})
</script>

<style>

</style>