<script setup>
import { items } from "./movies.json";
import { reactive } from "vue";
import { StarIcon } from "@heroicons/vue/24/solid";

const cloneMovies = (data) => JSON.parse(JSON.stringify(data));
const movies = reactive(cloneMovies(items));

const normalizeRating = (value, min = 0, max = 5) => {
  let n = parseInt(value, 10);
  if (Number.isNaN(n)) {
    n = 0;
  }
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n;
};

const setMovieRating = (movie, rating) => {
  movie.rating = normalizeRating(rating);
};
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
            :alt="`${movie.name} poster`"
            class="object-cover object-center h-[600px]"
          />
          <div class="absolute right-0 top-0 size-16">
            <StarIcon
              class="size-16"
              :class="movie.rating ? 'text-yellow-500' : 'text-gray-500'"
            />
            <span
              v-if="movie.rating"
              class="absolute inset-0 flex items-center justify-center text-xl text-yellow-800"
            >
              {{ movie.rating }}
            </span>
            <span
              v-else
              class="absolute inset-0 flex items-center justify-center text-xl text-gray-400"
            >
              -
            </span>
          </div>
        </div>
        <div class="w-full h-56 p-4 flex flex-col items-start justify-start">
          <div class="w-full h-16 shrink-0">
            <h3 class="text-2xl">{{ movie.name }}</h3>
            <div class="flex items-center justify-start space-x-1">
              <span
                v-for="genre in movie.genres"
                :key="`${movie.id}-genre-${genre}`"
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
              Rating: ({{ movie.rating ?? "-" }}/5)
            </span>
            <button
              v-for="star in 5"
              :key="`${movie.id}-star-${star}`"
              class="size-5 cursor-pointer disabled:cursor-not-allowed"
              :disabled="star === movie.rating"
              @click="setMovieRating(movie, star)"
            >
              <StarIcon
                :class="[
                  star <= movie.rating ? 'text-yellow-500' : 'text-gray-500',
                ]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
