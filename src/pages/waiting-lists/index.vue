<!-- <script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Echo from 'laravel-echo'
import Socket from 'socket.io-client'
import { onMounted } from 'vue';
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
onMounted(() => {
    let echo = new Echo({
        broadcaster: 'socket.io',
        host: window.location.hostname + ':6001',
        authEndpoint: window.location.hostname + '/broadcasting/auth',
        auth:
        {
            headers:
            {
                'Accept': 'application/json',
                Authorization: "Bearer " + "4|5xrRAEVWgOezWomfvdDoadP8h9KjAXtKPetem5gK",
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
        <div class="columns center" v-for="(item) in list" :key="item.number">
            <div class="column is-12">
                <div class="mb-3">
                    <VField>
                        <VLabel class="required">
                            {{ item.number }} : {{ item.title }}</VLabel>
                        <VControl>
                        </VControl>
                    </VField>
                </div>
            </div>
        </div>
    </div>
</template> -->