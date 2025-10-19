<script setup lang="ts">
import { PencilIcon, StarIcon, TrashIcon } from "@heroicons/vue/24/solid";
import { computed } from "vue";

const { movie } = defineProps({ movie: { type: Object, required: true } });
const emit = defineEmits(["edit", "remove", "update:rating"]);

const movieRated = computed(() => !!movie.rating);

const updateRating = (rating) => {
  emit("update:rating", movie.id, rating);
};

const removeMovie = () => {
  emit("remove", movie.id);
};

const editMovie = () => {
  emit("edit", movie.id);
};
</script>

<template>
  <div
    class="w-96 h-auto bg-white rounded-md flex flex-col items-center justify-center overflow-hidden shadow-2xl group"
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
          :class="{
            'text-yellow-500': movieRated,
            'text-gray-500': !movieRated,
          }"
        />
        <span
          v-if="movieRated"
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
      <div class="w-full h-10 shrink-0 flex justify-between">
        <div class="flex items-center justify-start">
          <span class="text-xs mr-2 leading-7">
            Rating: ({{ movie.rating ?? "-" }}/5)
          </span>
          <button
            v-for="star in 5"
            :key="`${movie.id}-star-${star}`"
            class="size-5 cursor-pointer disabled:cursor-not-allowed"
            :disabled="star === movie.rating"
            @click="updateRating(star)"
          >
            <StarIcon
              :class="[
                star <= movie.rating ? 'text-yellow-500' : 'text-gray-500',
              ]"
            />
          </button>
        </div>
        <div class="hidden group-hover:flex space-x-2">
          <button class="float-button hover:bg-indigo-500" @click="editMovie()">
            <PencilIcon class="size-4" />
          </button>
          <button class="float-button hover:bg-red-500" @click="removeMovie()">
            <TrashIcon class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.float-button {
  @apply rounded-full bg-gray-200 p-3 hover:text-white;
}
</style>
