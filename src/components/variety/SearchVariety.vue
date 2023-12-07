<template>
  <div>
    <SearchSpecy
      class="col-12"
      v-model:botanicalName="searchVariety.searchSpecy.botanicalName"
      v-model:frenchCommonName="searchVariety.searchSpecy.frenchCommonName"
      v-model:visibilityValues="visibilityValues"
      @submit="submit"
    />
    <div class="col-12">
      <div class="field grid">
        <label for="name" class="col-12 sm:col-3">Nom</label>
        <div class="col-12 sm:col-6">
          <input
            id="name"
            placeholder="Chioggia"
            type="text"
            :class="cssClass.input.default"
            v-model="searchVariety.name"
            @keyup.enter="submit()"
            maxlength="128"
          />
        </div>
      </div>
    </div>
    <Button class="col-12" icon="pi pi-search" @click="submit()">Rechercher</Button>
  </div>
</template>

<script setup lang="ts">
import varietyScript from "@/scripts/VarietyScript";
import { cssClass } from "@/utils/style";
import { ref } from "vue";
import SearchSpecy from "@/components/specy/SearchSpecy.vue";
import Button from "primevue/button";
import { publicOption } from "@/models/Visibility";

const emit = defineEmits(["submit"]);

const searchVariety = ref(varietyScript.initSearch());

const visibilityValues = ref([publicOption]);

async function submit() {
  searchVariety.value.searchSpecy.visibility =
    visibilityValues.value.length == 1 ? visibilityValues.value[0].value : null;
  emit("submit", searchVariety.value);
}
</script>
