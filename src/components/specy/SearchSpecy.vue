<template>
  <div>
    <h2 class="public-object-text">Search Specy</h2>
    <div class="field grid">
      <label for="name" class="col-12 sm:col-3">Nom Botanique</label>
      <div class="col-12 sm:col-8">
        <input
          id="name"
          placeholder="Beta vulgaris"
          type="text"
          :class="getInputClass(formError.botanicalNameError)"
          v-model="searchSpecy.botanicalName"
          @keyup.enter="submit()"
          maxlength="128"
        />
      </div>
    </div>
    <FormMessage :message="formError.botanicalNameError" />
  </div>
</template>

<script setup lang="ts">
import specyScript from "@/scripts/SpecyScript";
import { getInputClass } from "@/utils/style";
import FormMessage from "@/components/common/FormMessage.vue";
import { ref } from "vue";

const searchSpecy = ref(specyScript.initSearch());
const formError = {
  botanicalNameError: "",
};

function submit() {
  console.log("search");
}
</script>
