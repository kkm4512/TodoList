<template>
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

      <div class="mt-2">
        <span class="sorted mr-1 hover:bg-white hover:text-blue-300" @click="sortByLatest">최신순</span>
        /
        <span class="sorted ml-1 hover:bg-white hover:text-blue-300"  @click="sortByOldest">오래된순</span>
      </div>
      
      <ul class="mt-3 flex flex-col">
        <li v-for="todo in todos" :key="todo.id" class="flex justify-between items-center mt-1" >
          <input type="checkbox" class="mr-2 mt-4" v-model="todo.checked">
          <span :class="{ 'red-text': todo.checked }" class="border-2 border-black rounded p-2 flex-grow mr-2 todo-item" @click="openModal(todo)">{{ todo.title }}</span>
        
        <div class="mt-4 p-2 w-30 h-10 border-2 border-red-500 rounded mr-2">{{ todo.author }}</div>
        </li>

        <div class="flex justify-end">
          <button class="mt-2 mr-2 h-10 w-12 border-2 border-black bg-red-500 text-white" @click="deleteList" v-if="accessToken"> 삭제 </button>
        </div>        
        
        <!-- 페이지네이션 css -->

        <div class="flex justify-center items-center mt-10">
          <div v-for="page in Math.ceil(newPagetotal/5)" :key="page" class="mr-2">
            <div class="flex justify-center items-center border-2 border-l-sky-400 w-6 h-6 rounded-lg text-xs cursor-pointer" @click="sendPage(page)">
              {{ page }}
            </div>
          </div>
      </div>
      </ul>
      
  

      <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        제목 : <input type="text" class="border-2 border-black ml-5" v-model="modalTitle"><p class="mt-2" ></p>
        작성자 : <input type="text" class="border-2 border-black ml-1" v-model="modalAuthor">
        <div class="flex justify-end">
          <button class="mr-2 mt-3 border-2 *:rounded border-blue-500" @click="patch(modalTitle,modalAuthor)">수정</button>
          <button @click="isModalOpen = false" class="close">닫기</button>
        </div>

  

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
const modalTitle = ref('');
const modalAuthor = ref('');
const ids = ref('');
const newPagesLists = ref('');
const newPagetotal = ref('');
const currentPage = ref('');
const sotredChcked = ref(true);




import { onMounted } from 'vue';

//로그인여부
if (accessToken) {
  try {
    const decoded = jwtDecode(accessToken)
    nickname = decoded.nickname
    
    
    
  } catch (error) {
    console.error("JWT 디코드 에러:", error);
  }
} 


  //최신순 true
  //오래된순 false

  //최신순 DESC
  //오래된순 ASC
const sortByLatest = async() => {
  sotredChcked.value = true
  console.log(sotredChcked.value)
  if (currentPage.value === '') {
    currentPage.value = 1
  }
  const response = await $fetch(`todolist/sorted`,{
    baseURL: `http://localhost:3001`,
    method: "POST",
    body:{
      currentPage: currentPage.value,
      boolean: true
    }
  })



  todos.value = response

  
}


  //최신순 true
  //오래된순 false
  
  //최신순 DESC
  //오래된순 ASC
const sortByOldest = async() => {
  sotredChcked.value = false
  console.log(sotredChcked.value)
  if (currentPage.value === '') {
    currentPage.value = 1
  }
  const response = await $fetch(`todolist/sorted`,{
    baseURL: `http://localhost:3001`,
    method: "POST",
    body:{
      currentPage: currentPage.value,
      boolean: false
    }
  })

  todos.value = response
}

//페이지 보내기
const sendPage = async (page) => {
  currentPage.value = page
  const response = await $fetch(`todolist/sendPage/${page}`,{
    baseURL: `http://localhost:3001`,
    method: "GET",
  })
  todos.value = response.data
  console.log(newPagesLists.value)
  
}

//수정
const patch = async (title,author) => {
  const response = await $fetch('todolist',{
    baseURL: "http://localhost:3001",
    method: "PATCH",
    body: {
        id : ids.value,
        title,
        author
      }
  })
  if (response.status === 401){
    alert(response.message)
  } else {
    modalTitle.value = response.title;
    modalAuthor.value = response.author;
    isModalOpen.value = false
    fetchTodos()
  }
}

//모달창 띄우고 할일
const openModal = (todo) => {
    selectedTodo.value = todo;
    isModalOpen.value = true;
    modalTitle.value = todo.title;
    modalAuthor.value = todo.author
    ids.value = todo.id
  };


  //삭제
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


//로그인 유저확인
const checkUser = () => {
  if (!accessToken){
    alert('로그인후에 이용해주세요')
    router.push('login')
  }
}

//투두 추가
const addTodo = async () => {
  checkUser()
  if(newTodo.value===''){
    alert('내용을 입력해주세요.')
    return
  }
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
  
   //최신순 true
  //오래된순 false
  
  //최신순 DESC
  //오래된순 ASC
  const fetchTodos = async () => {
  if(accessToken && sotredChcked.value === true){
    const response = await $fetch('todolist', {
      baseURL: "http://localhost:3001",
      method: "GET"  
    });
    todos.value = response.data
    todos.value = response.data.map( todo => ({...todo, checked : false}) )
    newPagetotal.value = response.total

    
  } else {
    
    const response = await $fetch('todolist/false', {
      baseURL: "http://localhost:3001",
      method: "GET",
    });
    todos.value = response.data
    todos.value = response.data.map( todo => ({...todo, checked : false}) )
    newPagetotal.value = response.total    
    

  }
};


//실행
  onMounted( async ()=>{
    await fetchTodos()
  })
  
</script>

<style>
@import '../assets/css/todo-styles.css';
</style>
