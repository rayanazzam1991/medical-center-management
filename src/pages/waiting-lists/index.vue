<script lang="ts" setup>
import Echo from 'laravel-echo'
import Socket from 'socket.io-client'
import {onMounted} from 'vue';
import {useAuth} from '/@src/stores/Others/User/authStore';

window.io = Socket

interface TodoList {
  number?: number,
  title?: string
}

const list = ref<TodoList[]>([])
list.value.push({
  number: 1,
  title: "First"
})
list.value.push({
  number: 2,
  title: "Second"
})
list.value.push({
  number: 3,
  title: "Third"
})
const userAuth = useAuth()

onMounted(() => {
  let hostName = import.meta.env.VITE_SOCEKT_HOST;
  let echo = new Echo({
    broadcaster: 'socket.io',
    host: hostName + ':6001',
    authEndpoint: hostName + '/broadcasting/auth',
    auth:
      {
        headers:
          {
            'Accept': 'application/json',
            Authorization: `Bearer ${userAuth.token}`,
          }
      },
    rejectUnauthorized: false,
  });
  console.log("hi")
  echo.private('test')
    .listen("TestEvent", (e) => {
      console.log(e.message);
      if (e.message == "desc") {
        list.value?.sort((a: TodoList, b: TodoList) => b?.number! - a?.number!)
      } else {
        list.value?.sort((a: TodoList, b: TodoList) => a?.number! - b?.number!)
      }
    });
})
</script>
<template>
  <div class="page-content-inner">
    <div v-for="(item) in list" :key="item.number" class="columns center">
      <div class="column is-12">
        <div class="mb-3">
          <VField>
            <VLabel class="required">
              {{ item.number }} : {{ item.title }}
            </VLabel>
            <VControl>
            </VControl>
          </VField>
        </div>
      </div>
    </div>
  </div>
</template>
