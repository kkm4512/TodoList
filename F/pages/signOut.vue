<template>
</template>

<script setup>
import { useCookie } from 'nuxt/app';
import { useRouter } from 'vue-router';
const accessTokenCookie = useCookie('accessToken')
const router = useRouter()
let accessToken = accessTokenCookie.value
accessTokenCookie.value = '';
alert('로그아웃에 성공하였습니다.')
router.push('/')





</script>

<style>

</style>