<template>
    <div>
        <h1>My Page</h1>
        <p>This is my page content</p>
        <button @click="printPage">Print</button>
        <div class="printable">
            <h1>Printable Section</h1>
            <p>This is the section that will be printed</p>
        </div>
    </div>
</template>
  
<script lang="ts" setup>

const printPage = () => {
    window.print()
}
</script>
  
<style lang="scss">
@media print {
    * {
        color: black !important;
        background: transparent !important;
        text-shadow: none !important;
        filter: none !important;
        -ms-filter: none !important;
    }

    .printable {
        position: absolute;
        left: 0;
        top: 0;
    }

}
</style>