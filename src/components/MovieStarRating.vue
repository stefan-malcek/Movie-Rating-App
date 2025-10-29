<script setup lang="ts">
import { StarIcon } from "@heroicons/vue/24/solid";
import { computed } from "vue";

const { rating } = defineProps({ rating: Number });
const movieRated = computed(() => Boolean(rating));
</script>

<template>
  <div class="absolute right-0 top-0 size-16">
    <StarIcon
      class="size-16"
      :class="{
        'text-yellow-500': movieRated,
        'text-gray-500': !movieRated,
      }"
    />
    <span
      v-if="movieRated"
      class="absolute inset-0 flex items-center justify-center text-xl text-yellow-800"
    >
      {{ rating }}
    </span>
    <span
      v-else
      class="absolute inset-0 flex items-center justify-center text-xl text-gray-400"
    >
      -
    </span>
  </div>
</template>
