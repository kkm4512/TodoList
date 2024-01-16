<template>
    <button @click="postAccessToken" 
    class="text-whtie w-96 px-3 py-2 mb-6 ml-10 mr-10 text-white bg-blue-500 rounded-md hover:bg-blue-600">
    Send My Token
    </button>
</template>

<script setup>
import { useCookie } from 'nuxt/app';
import { useRouter } from 'vue-router';
const accessTokenCoookie = useCookie('accessToken')
const router = useRouter()



const postAccessToken = async () => {
    try {
        const response = await $fetch('auth/token', {
        baseURL: "http://localhost:3001",
        method: "POST",
        headers: {
            'Authorization': `Bearer ${accessTokenCoookie.value}`
        }
    })  
    if (response){
        alert('토큰이 정상적으로 등록되어있습니다.')
        router.push('/')
    }
    
    } catch (error) {
        alert('로그인후 이용해주세요')
        router.push('/login')
    }

}
</script>
