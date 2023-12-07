<script setup>
import { LanguageSelector, NavBar } from './components'
</script>

<template>
  <NavBar />
  <main class="container mt-3">
    <router-view />
    <LanguageSelector />
  </main>
</template>
