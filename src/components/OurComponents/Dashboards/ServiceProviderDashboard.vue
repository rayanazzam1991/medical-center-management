<script setup lang="ts">
import { Employee } from '/@src/models/Employee/employee';
import { User, defaultUser } from '/@src/models/Others/User/user';
import { useEmployee } from '/@src/stores/Employee/employeeStore';
import { useAuth } from '/@src/stores/Others/User/authStore';

const userAuth = useAuth();
const employeeStore = useEmployee()
const user = ref<User>(defaultUser);
user.value = userAuth.getUser() ?? defaultUser
const userFullName = ref('')
const loggedEmployee = ref<Employee>()
userFullName.value = userAuth.getUserFulLName()
loggedEmployee.value = employeeStore.getEmployee()

</script>

<template>
    <div>
        <EmployeeWaitingList :employee-id-from-route="false" :employee-id="loggedEmployee?.id" />
    </div>
</template>

