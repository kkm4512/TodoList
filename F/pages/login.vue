<template>
    <div class="flex justify-center items-center min-h-screen bg-black text-black" >
        <form @submit.prevent="postUserIF" class="flex flex-col items-center w-full max-w-md p-4 py-8 bg-white rounded-md">
            <div class="mb-4">
                <input type="text" v-model="userIF.email"
                    class="w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" placeholder="email" >
            </div>
            <div class="mb-4">
                <input type="password" v-model="userIF.password"
                    class="w-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300" placeholder="password">
            </div>
            <input type="submit" value="로그인"
                class="w-96 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
        </form>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCookie } from 'nuxt/app';
import { jwtDecode } from "jwt-decode";


const router = useRouter()
const accessTokenCookie = useCookie('accessToken')



const userIF = ref({
    email: '',
    password: ''
})

const postUserIF = async () => {
    try {
        const response = await $fetch('auth/login', {
        baseURL: "http://localhost:3001",
        method: "POST",
        body: {
            email: userIF.value.email,
            password: userIF.value.password,
            }
        })       

        const token = response.accessToken

        accessTokenCookie.value = response.accessToken;


        if(response){
            alert('로그인에 성공하였습니다!')
            router.push('/')
        }
        
    } catch (error) {
        if (error.status === 401){
            alert('회원정보가 일치하지않습니다.')
            router.push('login')
            userIF.value.email = '';
            userIF.value.password = '';
        }
    }

}





</script>

