<template>
  <div>
    <SearchSpecy
      class="col-12"
      v-model:botanicalName="searchVariety.searchSpecy.botanicalName"
      v-model:frenchCommonName="searchVariety.searchSpecy.frenchCommonName"
      v-model:validityValues="searchSpecyFilter.validityValues"
      v-model:onAllSpecies="searchSpecyFilter.onAllSpecies"
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
      <div class="field grid">
        <label for="onlyValid" class="col-12 sm:col-3"
          >Variété validée ?&nbsp;
            <div
              class="pi pi-question-circle"
              v-tooltip="
                'La validation d\'une variété est réservée aux Administrateurs. Non déterminé signifie qu\'elle n\'a pas encore été revue'
              "
            ></div
          ></label>
        <div class="col-12 sm:col-8">
          <SelectButton
            v-model="searchVarietyFilter.validityValues"
            :options="validityOptions"
            optionLabel="name"
            multiple
            aria-labelledby="multiple"
            class="mb-1"
          />
        </div>
      </div>
      <div class="field grid" v-if="authorizationService.isAdmin()">
        <label for="onAllVarieties" class="col-12 sm:col-3"
          >Toutes les variétés ?</label>
        <div class="col-12 sm:col-6">
          <Checkbox id="onAllVarieties"
            v-model="searchVarietyFilter.onAllVarieties"
            :binary="true">
          </Checkbox>
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
import { PUBLIC } from "@/utils/constant";
import authorizationService from "@/services/AuthorizationService";
import Checkbox from "primevue/checkbox";
import { VALIDITY, selectOptionsToValidity, validityOptions } from "@/utils/validity";
import SelectButton from "primevue/selectbutton";

const emit = defineEmits(["submit"]);

const searchVarietyFilter = ref({
  onAllVarieties: true,
  validityValues: [VALIDITY.TRUE]
});

const searchSpecyFilter = ref({
  onAllSpecies: true,
  validityValues: [VALIDITY.TRUE]
});

const searchVariety = ref(varietyScript.initSearch());

async function submit() {
  searchVariety.value.searchSpecy.owner = searchSpecyFilter.value.onAllSpecies ? null : PUBLIC;
  searchVariety.value.owner = searchVarietyFilter.value.onAllVarieties ? null : PUBLIC;
  searchVariety.value.searchSpecy.validity = selectOptionsToValidity(searchSpecyFilter.value.validityValues);
  searchVariety.value.validity = selectOptionsToValidity(searchVarietyFilter.value.validityValues);
  emit("submit", searchVariety.value);
}
</script>
