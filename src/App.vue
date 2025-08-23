<script setup>
import { items } from "./movies.json";
import { reactive } from "vue";
import { StarIcon } from "@heroicons/vue/24/solid";

const movies = reactive(items);
</script>

<template>
  <div class="max-w-full h-screen flex items-center justify-center mx-auto">
    <div class="flex items-center justify-center space-x-4">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="w-96 h-auto bg-white rounded-md flex flex-col items-center justify-center overflow-hidden shadow-2xl"
      >
        <div class="w-full h-[520px] overflow-hidden relative">
          <img
            :src="movie.image"
            class="object-cover object-center h-[600px]"
            alt=""
          />
        </div>
        <div class="w-full h-56 p-4 flex flex-col items-start justify-start">
          <div class="w-full h-16 shrink-0">
            <h3 class="text-2xl">{{ movie.name }}</h3>
            <div class="flex items-center justify-start space-x-1">
              <span
                v-for="genre in movie.genres"
                :key="`${movie.id}-${genre}`"
                class="text-xs bg-indigo-500 text-white py-0.5 px-2 rounded-full"
                >{{ genre }}</span
              >
            </div>
          </div>
          <div class="h-24 flex-1">
            <p class="text-sm">{{ movie.description }}</p>
          </div>
          <div class="w-full h-8 shrink-0 flex items-center justify-start">
            <span class="text-xs mr-2 leading-7">
              Rating: ({{ movie.rating }}/5)
            </span>
            <StarIcon
              v-for="star in movie.rating"
              :key="`star-${star}`"
              class="size-5 text-yellow-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
