<template>
  <img
    src="https://flagcdn.com/24x18/tr.png"
    data-testid="language-tr-selector"
    @click="$i18n.locale = 'tr'"
    role="button"
  />
  <span class="m-1"></span>
  <img
    src="https://flagcdn.com/24x18/gb.png"
    data-testid="language-en-selector"
    @click="$i18n.locale = 'en'"
    role="button"
  />
</template>
