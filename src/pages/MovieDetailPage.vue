<script setup>
import { computed, ref } from "vue";
import { items } from "@/movies.json";
import MovieStarRating from "@/components/MovieStarRating.vue";

const { id } = defineProps({ id: Number });
const movies = ref(items);
const movie = computed(() => movies.value.find((m) => m.id === id));
</script>

<template>
  <div
    class="flex w-full h-screen max-w-6xl justify-start items-center gap-x-4 dark:text-white"
  >
    <figure class="relative">
      <MovieStarRating :rating="movie.rating" class="absolute" />
      <img :src="movie.image" :alt="movie.name" class="w-96" />
    </figure>
    <div class="flex flex-col flex-1">
      <h3 class="text-5xl mb-4">{{ movie.name }}</h3>
      <div class="mb-3 flex items-center justify-start space-x-1">
        <span
          v-for="genre in movie.genres"
          :key="`${movie.id}-genre-${genre}`"
          class="text-lg bg-indigo-500 py-0.5 px-2 rounded-full"
          >{{ genre }}</span
        >
      </div>
      <div class="text-xl">{{ movie.description }}</div>
    </div>
  </div>
</template>

<style></style>
