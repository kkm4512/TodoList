<template>
  <h1>gd</h1>
    <div class="flex justify-end" >
        <template v-if="accessToken">
            <div class="text-lg text-white font-semibold mr-3">
                {{ nickname }}님 반갑습니다!
            </div>
        </template>

        <template v-if="!accessToken">
            <NuxtLink to="login" class="text-lg text-blue-500 hover:text-blue-700 font-semibold mr-4">로그인</NuxtLink>
        </template>

        <NuxtLink to="signUp" class="text-lg text-blue-500 hover:text-blue-700 font-semibold mr-4">회원가입</NuxtLink>
        
        <template v-if = "accessToken">
            <NuxtLink to="signOut" class="text-lg text-blue-500 hover:text-blue-700 font-semibold">로그아웃</NuxtLink>
        </template>
    </div>

    <div class="mt-10 flex justify-center" >
      <div class="w-1/2 bg-white rounded shadow-lg p-5" >
        <h2 class="text-lg font-semibold mb-4 text-center">Todo 리스트</h2>

        <div class="flex justify-between">
        <input type="text" v-model="newTodo" class="border-2 border-black rounded p-2 flex-grow" placeholder="새 Todo 항목" @click="checkUser">
            <button @click="addTodo" class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            추가
            </button>
      </div>
      
      <ul class="mt-3 flex flex-col">
        <li v-for="todo in todos" :key="todo.id" class="flex justify-between items-center mt-1" >
          <input type="checkbox" class="mr-2 mt-4" v-model="todo.checked">
          <span :class="{ 'red-text': todo.checked }" class="border-2 border-black rounded p-2 flex-grow mr-2 todo-item" @click="openModal(todo)">{{ todo.title }}</span>
        <!-- 작은 네모 상자 추가 -->
        <div class="mt-4 p-2 w-30 h-10 border-2 border-red-500 rounded mr-2">{{ todo.author }}</div>
        </li>
        <div class="flex justify-end">
          <button class="mt-2 mr-2 h-10 w-12 border-2 border-black bg-red-500 text-white" @click="deleteList" v-if="accessToken"> 삭제 </button>
        </div>
      </ul>

      <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h3>{{ selectedTodo.title }}</h3>
        <p>작성자: {{ selectedTodo.author }}</p>
        <button @click="isModalOpen = false">닫기</button>
      </div>
    </div>      
                
      </div>
    </div>    

</template>

<script setup>

import { useCookie } from 'nuxt/app';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'vue-router';



const accessTokenCookie = useCookie('accessToken')
const accessToken = accessTokenCookie.value
const router = useRouter()
let nickname = ref('');
const todos = ref([]);
const newTodo = ref('');
const isModalOpen = ref(false);
const selectedTodo = ref({});




import { onMounted } from 'vue';


if (accessToken) {
  try {
    const decoded = jwtDecode(accessToken)
    nickname = decoded.nickname
    
    
    
  } catch (error) {
    console.error("JWT 디코드 에러:", error);
  }
} 


const openModal = (todo) => {
    selectedTodo.value = todo;
    isModalOpen.value = true;
  };


const deleteList = async() => {
  const newTodos = todos.value.filter( todo => todo.checked === true)
  try {
    const response = await $fetch(('todolist'),{
      baseURL: "http://localhost:3001",
      method: "DELETE",
      body:{
        newTodos
      }
    })
    await fetchTodos()
  } catch (error) {
    
  }
}

const checkUser = () => {
  if (!accessToken){
    alert('로그인후에 이용해주세요')
    router.push('login')
  }
}

const addTodo = async () => {
  checkUser()
    const response = await $fetch('todolist',{
        baseURL: "http://localhost:3001",
        method: "POST",
        body: {
            todo: newTodo.value,
            nickname,
        }
    })
    
        router.push('/')
        todos.value.push({ title: newTodo.value, id: response.id });
        newTodo.value = '';
        fetchTodos()
  }

  //페이지 로드 됐을때 전체 Todo리스트 가져오기
  const fetchTodos = async () => {
  if(accessToken){
    const response = await $fetch('todolist', {
      baseURL: "http://localhost:3001",
      method: "GET"  
    });
    todos.value = response
    todos.value = response.map( todo => ({...todo, checked : false}) )
    
  } else {
    todos.value = '';
  }
};

  onMounted(()=>{
    fetchTodos()
  })
  
</script>

<style>
@import '../assets/css/todo-styles.css';
</style>
