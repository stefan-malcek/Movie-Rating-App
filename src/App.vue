<script setup>
import { items } from "./movies.json";
import { computed, ref } from "vue";
import { cloneDeep } from "../utils/clone.js";
import { normalizeRating } from "../utils/number.js";
import MovieItem from "../components/MovieItem.vue";
import MovieForm from "../components/MovieForm.vue";

const movies = ref(cloneDeep(items));
const selectedMovie = ref();

const averageRating = computed(() => {
  const filledRatings = movies.value.filter((m) => m.rating);
  if (filledRatings.length === 0) {
    return "-";
  }

  const average = filledRatings.reduce((acc, m) => acc + m.rating, 0);
  return Number(average / filledRatings.length).toFixed(1);
});

const totalMovies = computed(() => movies.value.length);

const updateRating = (movieId, rating) => {
  const movie = movies.value.find((m) => m.id === movieId);
  if (movie) {
    movie.rating = normalizeRating(rating);
  }
};

const resetRatings = () => {
  movies.value.forEach((movie) => {
    movie.rating = null;
  });
};

const showMovieDialog = ref(false);

const showForm = () => {
  showMovieDialog.value = true;
};

const removeMovie = (movieId) => {
  movies.value = movies.value.filter((movie) => movie.id !== movieId);
};

const editMovie = (movieId) => {
  selectedMovie.value = movies.value.find((movie) => movie.id === movieId);
  showForm();
};

const hideDialog = () => {
  showMovieDialog.value = false;
  selectedMovie.value = null;
};

const saveMovie = (movieForm) => {
  const existingMovie = movies.value.find((m) => m.id === movieForm.id);
  if (existingMovie) {
    updateMovie(movieForm, existingMovie);
  } else {
    addMovie(movieForm);
  }

  hideDialog();
};

const addMovie = (movieForm) => {
  if (!movieForm) {
    return;
  }

  movieForm.rating = null;
  movies.value.push(movieForm);
};

const updateMovie = (movieForm, existingMovie) => {
  if (!movieForm || !existingMovie) {
    return;
  }

  existingMovie.name = movieForm.name;
  existingMovie.description = movieForm.description;
  existingMovie.image = movieForm.image;
  existingMovie.genres = movieForm.genres;
  existingMovie.inTheaters = movieForm.inTheaters;
};
</script>

<template>
  <div
    class="max-w-full h-screen flex flex-col items-center justify-center mx-auto"
  >
    <div
      v-if="showMovieDialog"
      class="absolute inset-0 backdrop-blur bg-gray-800/40 z-10 flex items-center justify-center"
    >
      <MovieForm
        :model-value="selectedMovie"
        @update:modelValue="saveMovie"
        @cancel="hideDialog"
      />
    </div>
    <div class="w-full flex items-center justify-between max-w-6xl p-4 mb-4">
      <div class="flex items-center justify-center gap-4 text-white">
        <span> Total Movies: {{ totalMovies }}</span>
        <span> / </span>
        <span> Average Rating: {{ averageRating }}</span>
      </div>
      <div class="flex items-center justify-center space-x-5">
        <button
          class="text-white bg-blue-500 rounded-md px-4 py-2"
          @click="resetRatings"
        >
          Reset Ratings
        </button>
        <button
          class="text-white bg-blue-500 rounded-md px-4 py-2"
          @click="showForm()"
        >
          Add Movie
        </button>
      </div>
    </div>
    <div class="flex items-center justify-center space-x-4">
      <MovieItem
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        @edit="editMovie"
        @remove="removeMovie"
        @update:rating="updateRating"
      />
    </div>
  </div>
</template>

<style></style>
